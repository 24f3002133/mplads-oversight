from mp_names import json_api_lok_sabha, json_api_rajya_sabha
from project_report import lok_sabha_project, rajya_sabha_project
import asyncio
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

def get_db():
    return psycopg2.connect(os.getenv("DATABASE_URL"), cursor_factory=RealDictCursor)


# ── SQL Queries ──

MP_EXISTS = "SELECT id FROM mp_data WHERE mp_name = %s AND constituency = %s AND tenure = %s"
MP_UPDATE = "UPDATE mp_data SET allocated_amount=%s, state=%s, house=%s, tenure_start_date=%s, tenure_end_date=%s WHERE id=%s"
MP_INSERT = "INSERT INTO mp_data (mp_name, house, tenure, tenure_start_date, tenure_end_date, state, constituency, allocated_amount) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"

WORK_EXISTS = "SELECT * FROM project_directory WHERE work_id = %s"
WORK_UPDATE = "UPDATE project_directory SET mp_name=%s, constituency=%s, state=%s, description=%s, category=%s, activity_name=%s, ida_name=%s, status=%s, recommended_amount=%s, sanction_amount=%s, actual_completion_amount=%s, recommended_date=%s, sanctioned_date=%s, completion_date=%s WHERE work_id=%s"
WORK_INSERT = "INSERT INTO project_directory (work_id, mp_name, constituency, state, description, category, activity_name, ida_name, status, recommended_amount, sanction_amount, actual_completion_amount, recommended_date, sanctioned_date, completion_date) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
HISTORY_INSERT = "INSERT INTO work_history (work_id, field_changed, old_value, new_value) VALUES (%s,%s,%s,%s)"

TRACKED_FIELDS = ["status", "sanction_amount", "recommended_amount", "actual_completion_amount", "sanctioned_date", "completion_date"]


async def mp_names():
    lok_sabha_mps = await json_api_lok_sabha()
    rajya_sabha_mps = await json_api_rajya_sabha()

    all_mps = (lok_sabha_mps or []) + (rajya_sabha_mps or [])

    # normalise
    rows = []
    for r in all_mps:
        if not r.get("MP_NAME"): continue
        rows.append((
            r["MP_NAME"].strip(),
            r.get("HOUSE_NAME", "Lok Sabha"),
            r.get("TENURE"),
            r.get("TENURE_START_DATE"),
            r.get("TENURE_END_DATE"),
            r.get("STATE_NAME"),
            r.get("CONSTITUENCY"),
            r.get("ALLOCATED_AMT"),
        ))

    # push to db
    conn = get_db()
    cur = conn.cursor()
    for row in rows:
        mp_name, house, tenure, start, end, state, constituency, amount = row
        cur.execute(MP_EXISTS, (mp_name, constituency, tenure))
        existing = cur.fetchone()
        if existing:
            cur.execute(MP_UPDATE, (amount, state, house, start, end, existing["id"]))
        else:
            cur.execute(MP_INSERT, row)
    conn.commit()
    cur.close()
    conn.close()


async def mp_project_data():
    project_loksabha = lok_sabha_project()
    project_rajyasabha = rajya_sabha_project()

    all_works = (project_loksabha or []) + (project_rajyasabha or [])

    # normalise
    rows = []
    for w in all_works:
        wid = str(w.get("WORK_RECOMMENDATION_DTL_ID", "")).strip()
        if not wid: continue
        rows.append({
            "work_id": wid,
            "mp_name": w.get("MP_NAME", "").strip(),
            "constituency": w.get("CONSTITUENCY"),
            "state": w.get("STATE_NAME"),
            "description": w.get("WORK_DESCRIPTION"),
            "category": w.get("WORK_CATEGORY"),
            "activity_name": w.get("ACTIVITY_NAME"),
            "ida_name": w.get("IDA_NAME"),
            "status": w.get("WORK_STAGE"),
            "recommended_amount": w.get("RECOMMENDED_AMOUNT"),
            "sanction_amount": w.get("SANCTION_AMOUNT"),
            "actual_completion_amount": w.get("ACTUAL_AMOUNT"),
            "recommended_date": w.get("RECOMMENDATION_DATE"),
            "sanctioned_date": w.get("SANCTION_DATE"),
            "completion_date": w.get("ACTUAL_END_DATE"),
        })

    # push to db with diff
    conn = get_db()
    cur = conn.cursor()
    for r in rows:
        cur.execute(WORK_EXISTS, (r["work_id"],))
        existing = cur.fetchone()

        if existing:
            # diff tracked fields, log changes
            for field in TRACKED_FIELDS:
                old_val = str(existing[field]) if existing[field] is not None else None
                new_val = str(r[field]) if r[field] is not None else None
                if old_val != new_val:
                    cur.execute(HISTORY_INSERT, (r["work_id"], field, old_val, new_val))

            # update
            cur.execute(WORK_UPDATE, (
                r["mp_name"], r["constituency"], r["state"], r["description"],
                r["category"], r["activity_name"], r["ida_name"], r["status"],
                r["recommended_amount"], r["sanction_amount"], r["actual_completion_amount"],
                r["recommended_date"], r["sanctioned_date"], r["completion_date"],
                r["work_id"]
            ))
        else:
            cur.execute(WORK_INSERT, (
                r["work_id"], r["mp_name"], r["constituency"], r["state"],
                r["description"], r["category"], r["activity_name"], r["ida_name"],
                r["status"], r["recommended_amount"], r["sanction_amount"],
                r["actual_completion_amount"], r["recommended_date"],
                r["sanctioned_date"], r["completion_date"]
            ))

    conn.commit()
    cur.close()
    conn.close()


if __name__ == "__main__":
    asyncio.run(mp_names())
    asyncio.run(mp_project_data())