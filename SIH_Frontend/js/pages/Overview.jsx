import React from 'react';
import { useVals } from '../state/useVals.js';


export default function Overview() {
  const v = useVals();
  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderBottom: "2px solid var(--text-primary)", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "30px", fontWeight: "700", letterSpacing: "-0.018em", lineHeight: "1.15", margin: "0", color: "var(--heading-color)" }}>
            National Overview
          </h1>
          <p style={{ marginTop: "8px", maxWidth: "68ch", fontSize: "14px", lineHeight: "1.55", color: "var(--text-secondary)" }}>
            Anomaly checks computed over the eSAKSHI works register. Covers recommended and sanctioned works only — expenditure, vendor and field verification data are not ingested yet.
          </p>
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
            <span>
              Source · eSAKSHI
            </span>
            <span style={{ opacity: "0.4" }}>
              ·
            </span>
            <span>
              Last synced {v.lastSyncedLabel}
            </span>
          </div>
        </div>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px" }}>
        {(v.overviewStats ?? []).map((s, sIndex) => (
          <React.Fragment key={sIndex}>
            <div style={{ borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--card-bg)", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
              <div style={{ fontSize: "11.5px", fontWeight: "500", color: "var(--text-muted)" }}>
                {s.label}
              </div>
              <div style={{ marginTop: "4px", fontFamily: "'Source Serif 4',serif", fontSize: "26px", fontWeight: "700", letterSpacing: "-0.02em", lineHeight: "1.1", color: s.color }}>
                {s.value}
              </div>
              {s.sub && (
                <>
                <div style={{ marginTop: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
                  {s.sub}
                </div>
                </>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: "20px" }}>
        <div style={{ borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--card-bg)", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
          <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
            Flagged works by state
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--text-secondary)" }}>
            Shaded by number of flagged works.
          </p>
          <div style={{ marginTop: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", padding: "16px", display: "flex", justifyContent: "center", background: "var(--map-bg)" }}>
            <svg viewBox={`0 0 ${v.indiaMapW} ${v.indiaMapH}`} style={{ width: "100%", maxWidth: "380px", height: "auto" }}>
              {(v.mapOtherPaths ?? []).map((op, opIndex) => (
                <React.Fragment key={opIndex}>
                  <path d={op} fill={v.mapMuted} stroke={v.mapBg} strokeWidth="0.6" />
                </React.Fragment>
              ))}
              {(v.mapCells ?? []).map((c, cIndex) => (
                <React.Fragment key={cIndex}>
                  <path d={c.d} fill={c.fill} stroke={v.mapBg} strokeWidth="0.8" style={{ cursor: c.open ? "pointer" : "default" }} onClick={c.open}>
                    <title>
                      {c.title}
                    </title>
                  </path>
                </React.Fragment>
              ))}
            </svg>
          </div>
          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "var(--text-muted)" }}>
            <span>
              Fewer flagged
            </span>
            <div style={{ display: "flex", height: "8px", flex: "1", maxWidth: "220px", overflow: "hidden", borderRadius: "999px" }}>
              {(v.legendCells ?? []).map((lc, lcIndex) => (
                <React.Fragment key={lcIndex}>
                  <div style={{ flex: "1", background: lc }} />
                </React.Fragment>
              ))}
            </div>
            <span>
              More flagged
            </span>
          </div>
        </div>
        <div style={{ borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--card-bg)", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
          <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
            Flags by check type
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--text-secondary)" }}>
            National distribution of automated anomaly signals.
          </p>
          <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {(v.checkBars ?? []).map((b, bIndex) => (
              <React.Fragment key={bIndex}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "132px", flexShrink: "0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                    {b.label}
                  </div>
                  <div style={{ position: "relative", height: "7px", flex: "1", borderRadius: "999px", background: "var(--surface-muted)" }}>
                    <div style={{ position: "absolute", inset: "0 auto 0 0", borderRadius: "999px", background: "var(--primary)", width: `${b.pct}%` }} />
                  </div>
                  <div style={{ width: "36px", flexShrink: "0", textAlign: "right", fontSize: "12.5px", fontWeight: "600" }}>
                    {b.value}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--card-bg)", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", padding: "20px" }}>
          <div>
            <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
              States ranked by flagged works
            </h2>
            <p style={{ margin: "2px 0 0", fontSize: "12.5px", color: "var(--text-secondary)" }}>
              Trend shows flagged works by recommendation month, last 8 months.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {(v.sortButtons ?? []).map((sb, sbIndex) => (
              <React.Fragment key={sbIndex}>
                <button onClick={sb.go} style={{ borderRadius: "6px", padding: "6px 12px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", border: "none", background: sb.bg, color: sb.color }}>
                  {sb.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)", width: "40px" }}>
                #
              </th>
              <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                State
              </th>
              <th style={{ textAlign: "right", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                Monitored
              </th>
              <th style={{ textAlign: "right", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                Flagged
              </th>
              <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                Avg. risk
              </th>
              <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                Flagged by month
              </th>
            </tr>
          </thead>
          <tbody>
            {(v.sortedStateRows ?? []).map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr onClick={row.open} style={{ borderBottom: "1px solid var(--border-color)", cursor: row.open ? "pointer" : "default" }}>
                  <td style={{ padding: "var(--cell-pad)", fontSize: "13px", color: "var(--text-muted)" }}>
                    {row.rank}
                  </td>
                  <td style={{ padding: "var(--cell-pad)", fontSize: "13px", fontWeight: "500" }}>
                    {row.name}
                  </td>
                  <td style={{ padding: "var(--cell-pad)", textAlign: "right", fontSize: "13px", color: "var(--text-secondary)" }}>
                    {row.monitored}
                  </td>
                  <td style={{ padding: "var(--cell-pad)", textAlign: "right", fontSize: "13px", fontWeight: "600" }}>
                    {row.flagged}
                  </td>
                  <td style={{ padding: "var(--cell-pad)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap", background: row.riskBg, color: row.riskColor }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: row.riskColor }} />
                      {row.riskLabel}
                    </span>
                  </td>
                  <td style={{ padding: "var(--cell-pad)" }}>
                    <svg width="96" height="28" viewBox="0 0 96 28">
                      <polyline points={row.sparkPoints} fill="none" stroke={row.sparkColor} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="96" cy={row.sparkLastY} r="2.5" fill={row.sparkColor} />
                    </svg>
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
