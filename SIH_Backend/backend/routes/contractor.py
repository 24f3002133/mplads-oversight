from fastapi import APIRouter, Query

import risk
from db import get_cursor
from schema import ContractorsResponse

router = APIRouter()

HIGH_RISK_THRESHOLD = 75

VENDOR_AGG_TABLE = f"""
CREATE TEMP TABLE vendor_agg ON COMMIT DROP AS
WITH vendor_works AS (
    SELECT DISTINCT vendor_id, vendor_name, work_id
    FROM vendor_payments
),
vendor_disbursed AS (
    SELECT vendor_id, work_id, sum(fund_disbursed_amt) AS disbursed
    FROM vendor_payments
    GROUP BY vendor_id, work_id
)
SELECT vw.vendor_id,
       max(vw.vendor_name) AS contractor_agency,
       count(DISTINCT vw.work_id) AS total_work,
       count(DISTINCT vw.work_id) FILTER (WHERE s.risk_score >= {risk.FLAGGED_THRESHOLD}) AS flagged,
       round(100.0 * count(DISTINCT vw.work_id) FILTER (WHERE s.status = 'Work Completed')
             / count(DISTINCT vw.work_id), 1) AS completion_rate,
       round(avg(s.risk_score)::numeric, 1) AS avg_risk,
       GREATEST(0, COALESCE(sum(s.sanction_amount) - sum(vd.disbursed), 0)) AS idle_fund
FROM vendor_works vw
JOIN scored s ON s.work_id = vw.work_id
JOIN vendor_disbursed vd ON vd.vendor_id = vw.vendor_id AND vd.work_id = vw.work_id
GROUP BY vw.vendor_id
"""


@router.get("/", response_model=ContractorsResponse)
def contractors(limit: int = Query(50, le=5000), offset: int = 0):
    with get_cursor() as cur:
        cur.execute(risk.SCORED_TABLE)
        cur.execute(VENDOR_AGG_TABLE)

        # totals over the whole set, independent of the page being fetched
        cur.execute(
            f"""SELECT count(*) AS total_contractors,
                       count(*) FILTER (WHERE avg_risk >= {HIGH_RISK_THRESHOLD}) AS high_risk_count,
                       COALESCE(round(avg(completion_rate)::numeric, 1), 0) AS avg_completion_rate,
                       COALESCE(sum(idle_fund), 0) AS total_idle_fund
                FROM vendor_agg"""
        )
        totals = dict(cur.fetchone())

        cur.execute(
            "SELECT * FROM vendor_agg ORDER BY avg_risk DESC, vendor_id LIMIT %s OFFSET %s",
            (limit, offset),
        )
        rows = cur.fetchall()

    return ContractorsResponse(**totals, contractors=rows)

