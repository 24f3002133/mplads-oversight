from fastapi import APIRouter
from schema import (
    LiveStatus, WorkKPIs, CheckTypeBreakdown,
    RankedStatesResponse, DistrictDrilldownResponse,
    TrendPoint, DataQuality
)


router = APIRouter()


@router.get("/")
def main_page():
    return

@router.get("/live-status")
def get_live_status():
    return {
        "last_synced_at": "",
        "data_source": "eSAKSHI",
        "works_count": 0,
        "is_live": True
    }

@router.get("/work-data")
def work_data():
    return {
        "works_monitored": 0,
        "flagged_for_review": 0,
        "high_risk_works": 0,
        "avg_national_risk_score": 0.0,
        "total_funds_sanctioned": 0.0
    }

@router.get("/flag-check")
def flag_check():
    return

@router.get("/ranked-states")
def ranked_states():
    return

