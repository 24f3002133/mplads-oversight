from fastapi import APIRouter, HTTPException

import risk
from db import get_cursor
from schema import DossierResponse

router = APIRouter()

PEER_SAMPLE = 40


@router.get("/dossier-metadata")
def dossier_data():
    return {
        "Risk Score": "",
        "Flagged_Reason": {},
        "Project metadata": {},
        "Financial breakdown": {},
        "flagged reason": {},
        "Vendor cartel & shell company detector": {},
        "News Sentiments": {},
        "case history": {}
    }


@router.get("/{work_id}", response_model=DossierResponse)
def get_dossier(work_id: str):
    with get_cursor() as cur:
        cur.execute(risk.SCORED_TABLE)
        cur.execute(
            f"""SELECT work_id, description, state, constituency, ida_name, mp_name, status,
                       sanction_amount, recommended_amount, recommended_date, sanctioned_date,
                       risk_score, peer_avg, peer_sd, peer_n,
                       {', '.join(risk.CHECK_WEIGHTS)}
                FROM scored WHERE work_id = %s""",
            (work_id,),
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Work {work_id!r} not found")

        checks = [c for c in risk.CHECK_WEIGHTS if row[c]]

        cost_outlier = None
        if "cost_outlier" in checks and row["peer_sd"] and row["peer_sd"] > 0:
            cur.execute(
                """SELECT work_id, sanction_amount
                   FROM scored
                   WHERE state = %s AND status = %s AND work_id <> %s
                     AND sanction_amount IS NOT NULL
                   ORDER BY random()
                   LIMIT %s""",
                (row["state"], row["status"], work_id, PEER_SAMPLE),
            )
            scatter = [
                {"work_id": r["work_id"], "sanction_amount": float(r["sanction_amount"])}
                for r in cur.fetchall()
            ]
            cost_outlier = {
                "z_score": round(abs(row["sanction_amount"] - row["peer_avg"]) / row["peer_sd"], 2),
                "peer_avg": float(row["peer_avg"]),
                "peer_sd": float(row["peer_sd"]),
                "peer_n": row["peer_n"],
                "scatter": scatter,
            }

        duplicate_matches = []
        if "duplicate_match" in checks:
            cur.execute(
                """SELECT work_id, description, state, constituency, ida_name, sanction_amount, sanctioned_date
                   FROM scored
                   WHERE ida_name = %s
                     AND lower(btrim(description)) = lower(btrim(%s))
                     AND work_id <> %s
                   ORDER BY work_id
                   LIMIT 20""",
                (row["ida_name"], row["description"], work_id),
            )
            duplicate_matches = [dict(r) for r in cur.fetchall()]

    return DossierResponse(
        work_id=row["work_id"],
        description=row["description"],
        state=row["state"],
        constituency=row["constituency"],
        ida_name=row["ida_name"],
        mp_name=row["mp_name"],
        status=row["status"],
        sanction_amount=float(row["sanction_amount"]) if row["sanction_amount"] else None,
        recommended_amount=float(row["recommended_amount"]) if row["recommended_amount"] else None,
        recommended_date=row["recommended_date"],
        sanctioned_date=row["sanctioned_date"],
        risk_score=row["risk_score"],
        checks=checks,
        cost_outlier=cost_outlier,
        duplicate_matches=duplicate_matches,
    )
