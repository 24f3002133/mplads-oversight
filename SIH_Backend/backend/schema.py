from pydantic import BaseModel
from typing import Optional
from enum import Enum




class LiveStatus(BaseModel):
    last_synced_at: str
    data_source: str = "eSAKSHI"
    works_count: int
    is_live: bool
 
 
class WorkKPIs(BaseModel):
    works_monitored: int
    flagged_for_review: int
    flagged_pct: float                  # flagged / total * 100
    high_risk_works: int                # risk >= 75
    avg_national_risk_score: float
    total_funds_sanctioned: float       # in rupees
    total_funds_recommended: float
 
 
class CheckTypeBreakdown(BaseModel):
    # Only the checks derivable from project_directory. Progress mismatch and
    # missing evidence need the expenditure feed / FILE_STATUS, which are not
    # scraped yet, so they are omitted rather than reported as a false zero.
    cost_outlier: int
    impossible_timeline: int
    duplicate_match: int
    stalled: int
    concentration: int
    round_number: int
 
 
class StateRow(BaseModel):
    state: str
    state_code: Optional[str]           # keys the frontend's SVG map paths
    works_monitored: int
    works_flagged: int
    avg_risk_score: float
    total_sanctioned: float
    pending_sanction_count: int         # backlog signal
    pct_missing_sanction_date: float    # data quality signal
    trend: list[int]                    # flagged works per recommendation month
 
 
class RankedStatesResponse(BaseModel):
    states: list[StateRow]
    total_states: int
 
 
class DistrictRow(BaseModel):
    district: str                       # parsed from IDA_NAME
    ida_name: str                       # raw IDA string
    works_count: int
    total_sanctioned: float
    stage_mix: dict[str, int]           # {"Pending for Sanction": 120, "Physical Inspection": 80, ...}
 
 
class DistrictDrilldownResponse(BaseModel):
    state: str
    districts: list[DistrictRow]
 
 
class TrendPoint(BaseModel):
    period: str                         # "2025-01", "2025-02", ...
    avg_risk_score: float
    works_flagged: int
 
 
class DataQuality(BaseModel):
    total_works: int
    missing_sanction_date: int          # 25.8%
    missing_sanction_date_pct: float
    missing_sanction_amount: int        # 0.5%
    stage_na_count: int                 # 541
    file_status_true_count: int         # 24%
    file_status_true_pct: float
 
 