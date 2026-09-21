from fastapi import APIRouter



router = APIRouter()

@router.get("/project_list")
def project_list():
    return "projects under a particular states"

@router.get("/dossier-data")
def dossier_data():
    return {
        "Risk Score":"",
        "Project metadata":{},
        "Financial breakdown":{},
        "flagged reason":{},
        "satelite view":"",
        "Vendor cartel & shell company detector":{},
        "News Sentiments":{},
        "case history":{}
    }

@router.post("/push-dossier-data")
def push_dossier_data():
    return