from fastapi import APIRouter

import risk
from schema import (
    LiveStatus, WorkKPIs, CheckTypeBreakdown, RankedStatesResponse,
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
