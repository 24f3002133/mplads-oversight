from fastapi import APIRouter, HTTPException, Query

import risk
from db import get_cursor
from schema import (
    LiveStatus, WorkKPIs, CheckTypeBreakdown, RankedStatesResponse, StateDetail,
)

router = APIRouter()


@router.get("/live-status", response_model=LiveStatus)
def get_live_status():
    snap = risk.snapshot()
    last_synced = snap["last_synced_at"]
    return LiveStatus(
        last_synced_at=last_synced.isoformat() if last_synced else "",
        works_count=snap["kpis"]["works_monitored"],
        is_live=last_synced is not None,
    )


@router.get("/work-data", response_model=WorkKPIs)
def work_data():
    return WorkKPIs(**risk.snapshot()["kpis"])


@router.get("/flag-check", response_model=CheckTypeBreakdown)
def flag_check():
    return CheckTypeBreakdown(**risk.snapshot()["checks"])


@router.get("/ranked-states", response_model=RankedStatesResponse)
def ranked_states():
    states = risk.snapshot()["states"]
    return RankedStatesResponse(states=states, total_states=len(states))

@router.get("/state_map/{state}", response_model=StateDetail)
def state_map(state: str, limit: int = Query(20, le=100)):
    with get_cursor() as cur:
        cur.execute(risk.SCORED_TABLE)
        cur.execute(
            """SELECT count(*) AS works_monitored,
                      count(*) FILTER (WHERE risk_score >= %s) AS works_flagged,
                      COALESCE(round(avg(risk_score)::numeric, 1), 0) AS avg_risk_score,
                      COALESCE(sum(sanction_amount), 0) AS total_sanctioned
               FROM scored WHERE state = %s""",
            (risk.FLAGGED_THRESHOLD, state),
        )
        summary = dict(cur.fetchone())
        if not summary["works_monitored"]:
            raise HTTPException(status_code=404, detail=f"No works for state {state!r}")

        cur.execute(
            f"""SELECT work_id, description, state, constituency, ida_name, mp_name, status,
                       sanction_amount, recommended_date, sanctioned_date, risk_score,
                       {', '.join(risk.CHECK_WEIGHTS)}
                FROM scored WHERE state = %s
                ORDER BY risk_score DESC, work_id LIMIT %s""",
            (state, limit),
        )
        rows = cur.fetchall()

    return StateDetail(
        state=state,
        **summary,
        works=[
            {
                **{k: v for k, v in r.items() if k not in risk.CHECK_WEIGHTS},
                "checks": [c for c in risk.CHECK_WEIGHTS if r[c]],
            }
            for r in rows
        ],
    )