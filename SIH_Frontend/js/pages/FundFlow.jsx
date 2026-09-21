import React from 'react';
import { useVals } from '../state/useVals.js';


export default function FundFlow() {
  const v = useVals();
  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px 28px", borderBottom: "2px solid var(--text-primary)", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "30px", fontWeight: "700", letterSpacing: "-0.018em", lineHeight: "1.15", margin: "0", color: "var(--heading-color)" }}>
            Fund Flow
          </h1>
          <p style={{ marginTop: "8px", maxWidth: "68ch", fontSize: "14px", lineHeight: "1.55", color: "var(--text-secondary)" }}>
            Tracks the journey of money from sanction to utilisation, surfacing idle-fund accumulation and PFMS leakage signals by implementing agency.
          </p>
          <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
              Scope
            </span>
            <select value={v.fundDistrict} onChange={v.setFundDistrict} style={{ height: "32px", borderRadius: "6px", border: "1px solid var(--border-color)", padding: "0 8px", fontSize: "13px", fontFamily: "inherit", background: "var(--card-bg)", color: "var(--text-primary)" }}>
              <option value="__all__">
                All districts — national
              </option>
              {(v.districtOptions ?? []).map((d, dIndex) => (
                <React.Fragment key={dIndex}>
                  <option value={d.value}>
                    {d.label}
                  </option>
                </React.Fragment>
              ))}
            </select>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              Every figure below reflects this scope.
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "11px", flexShrink: "0", position: "relative", paddingLeft: "32px", maxWidth: "440px" }}>
          <div aria-hidden="true" style={{ position: "absolute", left: "0", top: "4px", bottom: "4px", width: "1px", background: "currentColor", opacity: "0.13" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "0.17em", textTransform: "uppercase", opacity: "0.55", whiteSpace: "nowrap" }}>
                भारत सरकार · Government of India
              </div>
              <div style={{ marginTop: "6px", fontFamily: "'Source Serif 4',serif", fontSize: "17.5px", fontWeight: "600", lineHeight: "1.32", opacity: "0.88" }}>
                Ministry of Statistics &amp;
              </div>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "17.5px", fontWeight: "600", lineHeight: "1.32", opacity: "0.88" }}>
                Programme Implementation
              </div>
              <div style={{ marginTop: "5px", fontSize: "11.5px", letterSpacing: "0.06em", opacity: "0.46", whiteSpace: "nowrap" }}>
                MPLADS Division · सत्यमेव जयते
              </div>
            </div>
            <svg aria-hidden="true" viewBox="0 0 48 48" width="64" height="64" style={{ display: "block", flexShrink: "0" }}>
              <circle cx="24" cy="24" r="22.2" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.35" />
              <circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
              <line x1="28.20" y1="24.00" x2="42.30" y2="24.00" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="28.06" y1="25.09" x2="41.68" y2="28.74" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="27.64" y1="26.10" x2="39.85" y2="33.15" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="26.97" y1="26.97" x2="36.94" y2="36.94" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="26.10" y1="27.64" x2="33.15" y2="39.85" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="25.09" y1="28.06" x2="28.74" y2="41.68" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="24.00" y1="28.20" x2="24.00" y2="42.30" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="22.91" y1="28.06" x2="19.26" y2="41.68" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="21.90" y1="27.64" x2="14.85" y2="39.85" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="21.03" y1="26.97" x2="11.06" y2="36.94" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="20.36" y1="26.10" x2="8.15" y2="33.15" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="19.94" y1="25.09" x2="6.32" y2="28.74" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="19.80" y1="24.00" x2="5.70" y2="24.00" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="19.94" y1="22.91" x2="6.32" y2="19.26" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="20.36" y1="21.90" x2="8.15" y2="14.85" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="21.03" y1="21.03" x2="11.06" y2="11.06" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="21.90" y1="20.36" x2="14.85" y2="8.15" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="22.91" y1="19.94" x2="19.26" y2="6.32" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="24.00" y1="19.80" x2="24.00" y2="5.70" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="25.09" y1="19.94" x2="28.74" y2="6.32" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="26.10" y1="20.36" x2="33.15" y2="8.15" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="26.97" y1="21.03" x2="36.94" y2="11.06" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="27.64" y1="21.90" x2="39.85" y2="14.85" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <line x1="28.06" y1="22.91" x2="41.68" y2="19.26" stroke="currentColor" strokeWidth="0.85" opacity="0.62" />
              <circle cx="24" cy="24" r="3.6" fill="currentColor" opacity="0.8" />
            </svg>
          </div>
          <div aria-hidden="true" style={{ width: "100%", height: "1px", background: "currentColor", opacity: "0.11" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap", gap: "6px 11px", fontSize: "10.5px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", opacity: "0.5", textAlign: "right" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "999px", background: "var(--risk-clear)" }} />
              Verified {v.tickerSyncedLabel}
            </span>
            <span style={{ opacity: "0.4" }}>
              ·
            </span>
            <span>
              As of {v.sealDateLabel}
            </span>
            <span style={{ opacity: "0.4" }}>
              ·
            </span>
            <span>
              PFMS · CGA Ledger
            </span>
          </div>
        </div>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px" }}>
        {(v.fundflowStats ?? []).map((s, sIndex) => (
          <React.Fragment key={sIndex}>
            <div style={{ borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--card-bg)", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
              <div style={{ fontSize: "11.5px", fontWeight: "500", color: "var(--text-muted)" }}>
                {s.label}
              </div>
              <div style={{ marginTop: "4px", fontFamily: "'Source Serif 4',serif", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.02em", lineHeight: "1.1", color: s.color }}>
                {s.value}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--card-bg)", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
              Released vs. utilised (₹ Cr, cumulative)
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--text-secondary)" }}>
              Shaded band marks the idle-fund gap widening over time.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: "var(--primary)" }} />
              Released (₹ Cr)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: "var(--risk-clear)" }} />
              Utilised (₹ Cr)
            </span>
          </div>
        </div>
        <div style={{ marginTop: "20px", position: "relative" }}>
          <svg viewBox="0 0 640 240" preserveAspectRatio="none" style={{ width: "100%", height: "240px", display: "block" }}>
            {(v.gridLines ?? []).map((g, gIndex) => (
              <React.Fragment key={gIndex}>
                <line x1="46" x2="606" y1={g.y} y2={g.y} stroke={v.borderColor} strokeWidth="1" />
              </React.Fragment>
            ))}
            <text x="8" y="107" transform="rotate(-90 8 107)" fontSize="9.5" textAnchor="middle" fill={v.textMuted}>
              Cumulative amount (₹ Cr)
            </text>
            <path d={v.fundflowUtilisedAreaPath} fill={v.riskClearColor} opacity="0.16" />
            <path d={v.fundflowReleasedAreaPath} fill={v.primaryColor} opacity="0.16" />
            <path d={v.fundflowReleasedPoints} fill="none" stroke={v.primaryColor} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d={v.fundflowUtilisedPoints} fill="none" stroke={v.riskClearColor} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
            {(v.fundflowReleasedDots ?? []).map((d, dIndex) => (
              <React.Fragment key={dIndex}>
                <circle cx={d.x} cy={d.y} r="2.5" fill={v.primaryColor} />
              </React.Fragment>
            ))}
            {(v.fundflowUtilisedDots ?? []).map((d, dIndex) => (
              <React.Fragment key={dIndex}>
                <circle cx={d.x} cy={d.y} r="2.5" fill={v.riskClearColor} />
              </React.Fragment>
            ))}
            <text x="326" y="234" fontSize="9.5" textAnchor="middle" fill={v.textMuted}>
              Time period
            </text>
          </svg>
          {(v.gridLines ?? []).map((g, gIndex) => (
            <React.Fragment key={gIndex}>
              <div style={{ position: "absolute", left: "17px", width: "26px", top: `${g.y}px`, marginTop: "-6px", textAlign: "right", fontSize: "9.5px", color: "var(--text-muted)", pointerEvents: "none" }}>
                {g.value}
              </div>
            </React.Fragment>
          ))}
          {(v.fundflowLabels ?? []).map((l, lIndex) => (
            <React.Fragment key={lIndex}>
              <div style={{ position: "absolute", top: "206px", left: `calc(${l.x}/640*100%)`, width: "40px", marginLeft: "-20px", textAlign: "center", fontSize: "9.5px", color: "var(--text-muted)", pointerEvents: "none" }}>
                {l.text}
              </div>
            </React.Fragment>
          ))}
          <div style={{ position: "absolute", left: `calc(${v.fundflowReleasedEnd.x}/640*100%)`, top: `${v.fundflowReleasedEnd.y}px`, margin: "-14px 0 0 8px", fontSize: "10.5px", fontWeight: "600", color: "var(--primary)", whiteSpace: "nowrap", pointerEvents: "none" }}>
            {v.fundflowReleasedEnd.label}
          </div>
          <div style={{ position: "absolute", left: `calc(${v.fundflowUtilisedEnd.x}/640*100%)`, top: `${v.fundflowUtilisedEnd.y}px`, margin: "4px 0 0 8px", fontSize: "10.5px", fontWeight: "600", color: "var(--risk-clear)", whiteSpace: "nowrap", pointerEvents: "none" }}>
            {v.fundflowUtilisedEnd.label}
          </div>
        </div>
      </div>
      <div style={{ borderRadius: "12px", border: "1px solid rgba(180,33,61,0.3)", background: "var(--risk-high-wash)", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
        <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--risk-high)" }}>
          PFMS leakage detector
        </h2>
        <p style={{ marginTop: "6px", maxWidth: "70ch", fontSize: "12.5px", color: "var(--text-secondary)" }}>
          Agencies below have overdue Utilisation Certificates or funds idle beyond the {v.settingsOverdueDays}-day threshold — a pattern strongly correlated with diversion risk under PFMS audits.
        </p>
        <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {(v.leakageAgencies ?? []).map((a, aIndex) => (
            <React.Fragment key={aIndex}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "6px", border: "1px solid rgba(180,33,61,0.4)", background: "var(--card-bg)", padding: "5px 10px", fontSize: "12px", color: "var(--risk-high)", fontWeight: "500" }}>
                {a.name} · {a.overdueUCs} overdue UCs
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{ borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--card-bg)", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
        <div style={{ borderBottom: "1px solid var(--border-color)", padding: "20px" }}>
          <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
            Agency idle-funds ledger
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--text-secondary)" }}>
            Ranked by total idle funds held beyond the utilisation window.
          </p>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                Agency
              </th>
              <th style={{ textAlign: "right", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                Idle funds
              </th>
              <th style={{ textAlign: "right", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                Avg. idle days
              </th>
              <th style={{ textAlign: "right", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                Missing DPRs
              </th>
              <th style={{ textAlign: "right", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                Overdue UCs
              </th>
              <th style={{ textAlign: "right", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                Severity
              </th>
            </tr>
          </thead>
          <tbody>
            {(v.agencyRows ?? []).map((a, aIndex) => (
              <React.Fragment key={aIndex}>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "var(--cell-pad)", fontSize: "13px", fontWeight: "500" }}>
                    {a.name}
                  </td>
                  <td style={{ padding: "var(--cell-pad)", textAlign: "right", fontSize: "13px", fontWeight: "600", color: "var(--risk-high)" }}>
                    {a.idleFunds}
                  </td>
                  <td style={{ padding: "var(--cell-pad)", textAlign: "right", fontSize: "13px", color: "var(--text-secondary)" }}>
                    {a.avgIdleDays}
                  </td>
                  <td style={{ padding: "var(--cell-pad)", textAlign: "right", fontSize: "13px", color: "var(--text-secondary)" }}>
                    {a.missingDPRs}
                  </td>
                  <td style={{ padding: "var(--cell-pad)", textAlign: "right", fontSize: "13px", color: "var(--text-secondary)" }}>
                    {a.overdueUCs}
                  </td>
                  <td style={{ padding: "var(--cell-pad)", textAlign: "right" }}>
                    <span style={{ display: "inline-block", borderRadius: "6px", padding: "3px 9px", fontSize: "12px", fontWeight: "600", background: a.sevBg, color: a.sevColor }}>
                      {a.severity}
                    </span>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
