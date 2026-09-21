from fastapi import FastAPI
from routes import (
    overview, all_works, funds, contractor,
    tracker, reports, review_queue, dossier,
    settings, ai
)


app = FastAPI()

app = FastAPI(
    title="MPLADS Oversight API",
    description="AI-powered monitoring and anomaly detection for MPLADS scheme"
)


app.include_router(overview.router,      prefix="/api/v1/overview",      tags=["Overview"])
app.include_router(all_works.router,     prefix="/api/v1/works",         tags=["All Works"])
app.include_router(funds.router,         prefix="/api/v1/funds",         tags=["Fund Flow"])
app.include_router(contractor.router,    prefix="/api/v1/contractors",   tags=["Contractors"])
app.include_router(tracker.router,       prefix="/api/v1/tracker",       tags=["Tracker"])
app.include_router(reports.router,       prefix="/api/v1/reports",       tags=["Reports"])
app.include_router(review_queue.router,  prefix="/api/v1/review-queue",  tags=["Review Queue"])
app.include_router(dossier.router,       prefix="/api/v1/dossier",       tags=["Investigation"])
app.include_router(settings.router,      prefix="/api/v1/settings",      tags=["Settings"])
app.include_router(ai.router,            prefix="/api/v1/copilot",       tags=["AI Copilot"])

@app.get("/api/v1/health", tags=["System"])
def health():
    return {
        "status": "ok",
        "source": "eSAKSHI",
        "version": app.version
    }
