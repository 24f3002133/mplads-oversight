"""Anomaly checks computed directly from project_directory.

Only checks derivable from the works data are implemented. Anything needing the
expenditure feed (progress mismatch, idle funds) or FILE_STATUS (missing
evidence) is deliberately absent rather than reported as zero.
"""
import time

from db import get_cursor

FLAGGED_THRESHOLD = 40
HIGH_RISK_THRESHOLD = 75
TREND_PERIODS = 8
_CACHE_TTL_SECONDS = 300

CHECK_WEIGHTS = {
    "cost_outlier": 30,
    "impossible_timeline": 30,
    "duplicate_match": 25,
    "stalled": 20,
    "concentration": 15,
    "round_number": 10,
}

# Map codes the frontend's india-map-data.js keys its SVG paths by. Ladakh has
# no path in that file, so it is absent here too and simply gets no map cell.
STATE_CODES = {
    "Andaman And Nicobar Islands": "AN", "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR",
    "Assam": "AS", "Bihar": "BR", "Chandigarh": "CH", "Chhattisgarh": "CT", "Delhi": "DL",
    "Goa": "GA", "Gujarat": "GJ", "Haryana": "HR", "Himachal Pradesh": "HP",
    "Jammu And Kashmir": "JK", "Jharkhand": "JH", "Karnataka": "KA", "Kerala": "KL",
    "Lakshadweep": "LD", "Madhya Pradesh": "MP", "Maharashtra": "MH", "Manipur": "MN",
    "Meghalaya": "ML", "Mizoram": "MZ", "Nagaland": "NL", "Odisha": "OD", "Puducherry": "PY",
    "Punjab": "PB", "Rajasthan": "RJ", "Sikkim": "SK", "Tamil Nadu": "TN", "Telangana": "TG",
    "The Dadra And Nagar Haveli And Daman And Diu": "DD", "Tripura": "TR",
    "Uttar Pradesh": "UP", "Uttarakhand": "UK", "West Bengal": "WB",
}

# Cost outliers are measured against works at the same stage in the same state,
# since sanction amounts are not comparable across stages.
SCORED_TABLE = """
CREATE TEMP TABLE scored ON COMMIT DROP AS
WITH base AS (
    SELECT work_id, state, constituency, ida_name, mp_name, status, description,
           sanction_amount, recommended_amount, recommended_date, sanctioned_date,
           lower(btrim(description)) AS norm_desc
    FROM project_directory
),
stats AS (
    SELECT b.*,
           avg(sanction_amount) OVER w AS peer_avg,
           stddev_pop(sanction_amount) OVER w AS peer_sd,
           count(*) OVER w AS peer_n,
           count(*) OVER (PARTITION BY ida_name, norm_desc) AS dup_n,
           count(*) OVER (PARTITION BY state) AS state_n,
           count(*) OVER (PARTITION BY state, ida_name) AS state_ida_n
    FROM base b
    WINDOW w AS (PARTITION BY state, status)
),
flagged AS (
    SELECT work_id, state, constituency, ida_name, mp_name, description, status,
           sanction_amount, recommended_amount, recommended_date, sanctioned_date,
           peer_avg, peer_sd, peer_n,
           (peer_n >= 30 AND peer_sd > 0 AND sanction_amount IS NOT NULL
            AND abs(sanction_amount - peer_avg) / peer_sd >= 2.5) AS cost_outlier,
           (sanctioned_date IS NOT NULL AND recommended_date IS NOT NULL
            AND sanctioned_date < recommended_date) AS impossible_timeline,
           (dup_n > 1 AND norm_desc IS NOT NULL AND norm_desc <> '') AS duplicate_match,
           (status = 'Pending for Sanction'
            AND recommended_date < CURRENT_DATE - 365) AS stalled,
           (state_n >= 100 AND state_ida_n::numeric / state_n > 0.20) AS concentration,
           (sanction_amount IS NOT NULL AND sanction_amount > 0
            AND mod(sanction_amount::numeric, 1000000) = 0) AS round_number
    FROM stats
)
SELECT *,
       LEAST(100, {score_expr}) AS risk_score
FROM flagged
""".format(
    score_expr=" + ".join(
        f"CASE WHEN {check} THEN {weight} ELSE 0 END"
        for check, weight in CHECK_WEIGHTS.items()
    )
)

_cache = {"at": 0.0, "data": None}


def _compute():
    with get_cursor() as cur:
        cur.execute(SCORED_TABLE)
        cur.execute("CREATE INDEX ON scored (state)")
        cur.execute("ANALYZE scored")

        cur.execute(
            """
            SELECT count(*) AS works_monitored,
                   count(*) FILTER (WHERE risk_score >= %s) AS flagged_for_review,
                   count(*) FILTER (WHERE risk_score >= %s) AS high_risk_works,
                   COALESCE(round(avg(risk_score)::numeric, 1), 0) AS avg_national_risk_score,
                   COALESCE(sum(sanction_amount), 0) AS total_funds_sanctioned,
                   COALESCE(sum(recommended_amount), 0) AS total_funds_recommended
            FROM scored
            """,
            (FLAGGED_THRESHOLD, HIGH_RISK_THRESHOLD),
        )
        kpis = dict(cur.fetchone())

        cur.execute(
            "SELECT {} FROM scored".format(
                ", ".join(f"count(*) FILTER (WHERE {c}) AS {c}" for c in CHECK_WEIGHTS)
            )
        )
        checks = dict(cur.fetchone())

        cur.execute(
            """
            SELECT state,
                   count(*) AS works_monitored,
                   count(*) FILTER (WHERE risk_score >= %s) AS works_flagged,
                   COALESCE(round(avg(risk_score)::numeric, 1), 0) AS avg_risk_score,
                   COALESCE(sum(sanction_amount), 0) AS total_sanctioned,
                   count(*) FILTER (WHERE status = 'Pending for Sanction') AS pending_sanction_count,
                   round(100.0 * count(*) FILTER (WHERE sanctioned_date IS NULL) / count(*), 1)
                       AS pct_missing_sanction_date
            FROM scored
            WHERE state IS NOT NULL
            GROUP BY state
            """,
            (FLAGGED_THRESHOLD,),
        )
        states = [dict(r) for r in cur.fetchall()]

        # Flagged works per state bucketed by recommendation month, oldest first.
        cur.execute(
            """
            WITH periods AS (
                SELECT generate_series(
                    date_trunc('month', CURRENT_DATE) - make_interval(months => %s),
                    date_trunc('month', CURRENT_DATE),
                    INTERVAL '1 month'
                ) AS period
            )
            SELECT s.state, p.period, count(sc.work_id) AS flagged
            FROM (SELECT DISTINCT state FROM scored WHERE state IS NOT NULL) s
            CROSS JOIN periods p
            LEFT JOIN scored sc
                   ON sc.state = s.state
                  AND sc.risk_score >= %s
                  AND date_trunc('month', sc.recommended_date) = p.period
            GROUP BY s.state, p.period
            ORDER BY s.state, p.period
            """,
            (TREND_PERIODS - 1, FLAGGED_THRESHOLD),
        )
        trends = {}
        for row in cur.fetchall():
            trends.setdefault(row["state"], []).append(int(row["flagged"]))

        cur.execute("SELECT max(detected_at) AS last_synced_at FROM work_history")
        last_synced_at = cur.fetchone()["last_synced_at"]

    for s in states:
        s["state_code"] = STATE_CODES.get(s["state"])
        s["trend"] = trends.get(s["state"], [])
    states.sort(key=lambda s: s["works_flagged"], reverse=True)

    total = kpis["works_monitored"] or 1
    kpis["flagged_pct"] = round(100.0 * kpis["flagged_for_review"] / total, 1)

    return {
        "kpis": kpis,
        "checks": checks,
        "states": states,
        "last_synced_at": last_synced_at,
    }


def snapshot(force=False):
    """Full-table window functions take ~1.3s, so the result is cached."""
    if force or _cache["data"] is None or time.time() - _cache["at"] > _CACHE_TTL_SECONDS:
        _cache["data"] = _compute()
        _cache["at"] = time.time()
    return _cache["data"]
