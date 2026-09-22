from fastapi import APIRouter, Query

import risk
from db import get_cursor
from schema import WorksResponse

router = APIRouter()

COLUMNS = """work_id, description, state, constituency, ida_name, mp_name, status,
             sanction_amount, recommended_date, sanctioned_date, risk_score"""


@router.get("/project_data", response_model=WorksResponse)
def project_data(
    state: str | None = None,
    status: str | None = None,
    check_type: str | None = None,
    min_risk: int | None = None,
    q: str | None = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
):
    clauses, params = [], []
    if state:
        clauses.append("state = %s")
        params.append(state)
    if status:
        clauses.append("status = %s")
        params.append(status)
    if min_risk is not None:
        clauses.append("risk_score >= %s")
        params.append(min_risk)
    if check_type in risk.CHECK_WEIGHTS:
        clauses.append(check_type)
    if q:
        clauses.append("(description ILIKE %s OR work_id ILIKE %s)")
        params += [f"%{q}%", f"%{q}%"]
    where = ("WHERE " + " AND ".join(clauses)) if clauses else ""

    with get_cursor() as cur:
        cur.execute(risk.SCORED_TABLE)
        cur.execute(
            f"""SELECT count(*) AS total,
                       count(*) FILTER (WHERE status = 'Work Completed') AS completed,
                       count(*) FILTER (WHERE risk_score >= {risk.FLAGGED_THRESHOLD}) AS flagged,
                       COALESCE(sum(sanction_amount), 0) AS total_sanctioned
                FROM scored {where}""",
            params,
        )
        stats = dict(cur.fetchone())

        cur.execute(
            f"""SELECT {COLUMNS}, {', '.join(risk.CHECK_WEIGHTS)}
                FROM scored {where}
                ORDER BY risk_score DESC, work_id
                LIMIT %s OFFSET %s""",
            params + [limit, offset],
        )
        rows = cur.fetchall()

    return WorksResponse(
        total=stats["total"],
        completed=stats["completed"],
        flagged=stats["flagged"],
        total_sanctioned=stats["total_sanctioned"],
        works=[
            {
                **{k: v for k, v in r.items() if k not in risk.CHECK_WEIGHTS},
                "checks": [c for c in risk.CHECK_WEIGHTS if r[c]],
            }
            for r in rows
        ],
    )
