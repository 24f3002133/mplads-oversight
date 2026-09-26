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


def lok_sabha_expenditure():
    URL = "https://mplads.mospi.gov.in/rest/PreLoginDashboardData/getTilesReportData"

    header = {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}

    # Large payload (~55MB+); the server resets the connection mid-response often enough
    # that a single attempt isn't reliable.
    for attempt in range(3):
        try:
            response = curl_cffi.post(URL, impersonate="chrome123", headers=header,
                                    json={"combo":"0,0,0,2","key":"Expenditure on Completed and On-going Works as on Date"},
                                    timeout=180)
            data = json.loads(response.content.decode("latin-1"))  # server mislabels charset; some rows have Latin-1 bytes (e.g. "crèches")
            return json.loads(data["Total Expenditure"])
        except (curl_cffi.requests.exceptions.RequestException, json.JSONDecodeError):
            if attempt == 2:
                raise
            time.sleep(3)


def rajya_sabha_expenditure():
    URL = "https://mplads.mospi.gov.in/rest/PreLoginDashboardData/getTilesReportData"

    header = {"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}

    response = curl_cffi.post(URL, impersonate="chrome123", headers=header,
                            json={"combo":"0,0,0,1","key":"Expenditure on Completed and On-going Works as on Date"},
                            timeout=180)
    data = json.loads(response.content.decode("latin-1"))  # server mislabels charset; some rows have Latin-1 bytes (e.g. "crèches")
    return json.loads(data["Total Expenditure"])



if __name__ == "__main__":
    lok_sabha_project_list = lok_sabha_project()
    rajya_sabha_project_list = rajya_sabha_project()
    
    with open("lok_sabha_project.json","w") as f:
        json.dump(lok_sabha_project_list , f, indent=2)
        f.close()

    with open("rajya_sabha_project.json","w") as f:
        json.dump(rajya_sabha_project_list , f, indent=2)
        f.close()
