

# Table 1 -> MPs.sql 

1. MP name
2. House (Lok Sabha / Rajya Sabha)
3. State
4. Constituency/District
5. Total entitlement/allocated amount
6. Amount recommended
7. Amount sanctioned (this may differ from allocated — worth keeping separate)

Source --> 
    "https://mplads.mospi.gov.in/rest/PreLoginDashboardData/getTilesReportData" (key: "Allocated Limit" — untested, verify next)

# Table 2 -> project_directory.sql

1. Work ID
2. MP name
3. Constituency
4. State
5. Description
6. Category
7. Activity name (ACTIVITY_NAME)
8. Implementing Agency (IA_NAME)
9. Sanction amount (separate from recommended amount)
10. Actual/completion amount
11. Status (Recommended / Sanctioned / Completed / Rejected)
12. Implementing authority / IDA
13. District
14. Recommended amount
15. Recommended date
16. Sanctioned date
17. Completion date

Source --> 
    "https://mplads.mospi.gov.in/rest/PreLoginDashboardData/getTilesReportData" (primary — confirmed working, public, no auth; keys: "Works Recommended", "Works Sanctioned", "Works Completed")

Source -->
    "https://indiaelections.org/mplads" (backup/cross-check only)

# Table 3 -> contractors.sql

1. Work ID (FK to project_directory)
2. Vendor name (VENDOR_NAME)
3. Vendor ID (VENDOR_ID)
4. Fund disbursed amount (FUND_DISBURSED_AMT)
5. Expenditure date
6. Work status (as recorded in expenditure record)

Source --> 
    "https://mplads.mospi.gov.in/rest/PreLoginDashboardData/getTilesReportData" (primary — confirmed working; key: "Expenditure on Completed and On-going Works as on Date")
Source --> 
    CPPP tender award data / tender.sarthaksidhant.com bulk dump (fallback — only for works where eSAKSHI has no vendor: pre-sanction stage, in-house IA execution, or pre-April 2023 works)


# Table 4 -> 