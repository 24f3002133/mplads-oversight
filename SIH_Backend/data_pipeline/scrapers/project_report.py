import json
import curl_cffi
import time
import random



def lok_sabha_project():
    URL = "https://mplads.mospi.gov.in/rest/PreLoginDashboardData/getTilesReportData"

    header = {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}

    response = curl_cffi.post(URL, impersonate="chrome123", headers=header,
                            json={"combo":"0,0,0,2","key":"Works Recommended"},
                            timeout=180)
    data = json.loads(response.content.decode("latin-1"))  # server mislabels charset; some rows have Latin-1 bytes (e.g. "crèches")
    return json.loads(data["Total Works Recommended"])


def rajya_sabha_project():
    URL = "https://mplads.mospi.gov.in/rest/PreLoginDashboardData/getTilesReportData"

    header = {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}

    response = curl_cffi.post(URL, impersonate="chrome123", headers=header,
                            json={"combo":"0,0,0,1","key":"Works Recommended"},
                            timeout=180)
    data = json.loads(response.content.decode("latin-1"))  # server mislabels charset; some rows have Latin-1 bytes (e.g. "crèches")
    return json.loads(data["Total Works Recommended"])


if __name__ == "__main__":
    lok_sabha_project_list = lok_sabha_project()
    rajya_sabha_project_list = rajya_sabha_project()
    
    with open("lok_sabha_project.json","w") as f:
        json.dump(lok_sabha_project_list , f, indent=2)
        f.close()

    with open("rajya_sabha_project.json","w") as f:
        json.dump(rajya_sabha_project_list , f, indent=2)
        f.close()
