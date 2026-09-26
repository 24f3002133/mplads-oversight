from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import date


class WorkRow(BaseModel):
    work_id: str
    description: Optional[str]
    state: Optional[str]
    constituency: Optional[str]
    ida_name: Optional[str]
    mp_name: Optional[str]
    status: Optional[str]
    sanction_amount: Optional[float]
    recommended_date: Optional[date]
    sanctioned_date: Optional[date]
    risk_score: int
    checks: list[str]


class StateDetail(BaseModel):
    state: str
    works_monitored: int
    works_flagged: int
    avg_risk_score: float
    total_sanctioned: float
    works: list["WorkRow"]


class WorksResponse(BaseModel):
    total: int
    completed: int
    flagged: int
    total_sanctioned: float
    works: list[WorkRow]




class LiveStatus(BaseModel):
    last_synced_at: str
    data_source: str = "eSAKSHI"
    works_count: int
    is_live: bool


class LiveEvent(BaseModel):
    work_id: str
    state: Optional[str]
    field_changed: str
    old_value: Optional[str]
    new_value: Optional[str]
    detected_at: str


class LiveEventsResponse(BaseModel):
    events: list[LiveEvent]
    events_today: int
    last_synced_at: str
 
 
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


class CostOutlierInfo(BaseModel):
    z_score: float
    peer_avg: float
    peer_sd: float
    peer_n: int
    scatter: list[dict]


class DuplicateMatch(BaseModel):
    work_id: str
    description: Optional[str]
    state: Optional[str]
    constituency: Optional[str]
    ida_name: Optional[str]
    sanction_amount: Optional[float]
    sanctioned_date: Optional[date]


class DossierResponse(BaseModel):
    work_id: str
    description: Optional[str]
    state: Optional[str]
    constituency: Optional[str]
    ida_name: Optional[str]
    mp_name: Optional[str]
    status: Optional[str]
    sanction_amount: Optional[float]
    recommended_amount: Optional[float]
    recommended_date: Optional[date]
    sanctioned_date: Optional[date]
    risk_score: int
    checks: list[str]
    cost_outlier: Optional[CostOutlierInfo]
    duplicate_matches: list[DuplicateMatch]


class Contractor(BaseModel):
    vendor_id:int
    contractor_agency:str
    total_work:int
    flagged:int
    completion_rate:float
    avg_risk:float
    idle_fund:float


class ContractorsResponse(BaseModel):
    total_contractors:int
    high_risk_count:int
    avg_completion_rate:float
    total_idle_fund:float
    contractors:list[Contractor]