import json
import os
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
import time
import pandas
import asyncio

URL = 'https://mplads.mospi.gov.in/digigov/dashboard.html'
def download_method():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(URL,wait_until="domcontentloaded")
        time.sleep(10)
        close_popup = page.locator(".btn-close.privacy-close")
        try:
            close_popup.wait_for(state="visible", timeout=10_000)
            print("yes")
            close_popup.click()
            page.locator("#privacyPolicyModal").wait_for(state="hidden", timeout=5_000)
            time.sleep(5)
        except PWTimeout:
            print("no")

        with page.expect_download() as download_info:
            page.get_by_text("CSV").click()
        download = download_info.value

        print(download)

async def json_api_lok_sabha():
    import requests

    resp = requests.post(
        "https://mplads.mospi.gov.in/rest/PreLoginDashboardData/getTilesReportData",
        json={"combo": "0,0,0,2", "key": "Allocated Limit for Hon'ble MPs"},
        headers={"Content-Type": "application/json"},
        timeout=60,
    )
    import json
    rows = json.loads(resp.json()["Allocated Limit"])  # value is a JSON string, not a list
    # print(rows)

    return rows

async def json_api_rajya_sabha():
    import requests

    resp = requests.post(
        "https://mplads.mospi.gov.in/rest/PreLoginDashboardData/getTilesReportData",
        json={"combo": "0,0,0,1", "key": "Allocated Limit for Hon'ble MPs"},
        headers={"Content-Type": "application/json"},
        timeout=60,
    )
    import json
    rows = json.loads(resp.json()["Allocated Limit"])  # value is a JSON string, not a list
    # print(rows)
    with open("mplads_data.json","w") as f:
        json.dump(rows , f,indent=2)

if __name__ == "__main__":

    lok_sabha_data, rajya_sabha_data = asyncio.run(
        asyncio.gather(json_api_lok_sabha(), json_api_rajya_sabha())
    )

    with open("mplads_data_lok.json","w") as f:
        json.dump(lok_sabha_data , f,indent=2)
        f.close()
    with open("mplads_data_rajya.json","w") as f:
        json.dump(rajya_sabha_data, f,indent=2)
