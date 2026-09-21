import React from 'react';
import { useVals } from '../state/useVals.js';


export default function Queue() {
  const v = useVals();
  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px 28px", borderBottom: "2px solid var(--text-primary)", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "30px", fontWeight: "700", letterSpacing: "-0.018em", lineHeight: "1.15", margin: "0", color: "var(--heading-color)" }}>
            Review Queue
          </h1>
          <p style={{ marginTop: "8px", maxWidth: "68ch", fontSize: "14px", lineHeight: "1.55", color: "var(--text-secondary)" }}>
            Your personal workbench — works awaiting a decision, and a permanent record of everything you have already resolved.
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
              MPLADS MIS · Decision Log
            </span>
          </div>
        </div>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
        {(v.queueStats ?? []).map((s, sIndex) => (
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
      <div>
        <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid var(--border-color)" }}>
          <button onClick={v.setQueueAwaiting} style={{ border: "none", background: "none", padding: "var(--cell-pad)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", borderBottom: `2px solid ${v.queueAwaitingBorder}`, color: v.queueAwaitingColor }}>
            Awaiting action ({v.awaitingCount})
          </button>
          <button onClick={v.setQueueResolved} style={{ border: "none", background: "none", padding: "var(--cell-pad)", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", borderBottom: `2px solid ${v.queueResolvedBorder}`, color: v.queueResolvedColor }}>
            Resolved ({v.resolvedCount})
          </button>
        </div>
        {v.isQueueAwaiting && (
          <>
          <div style={{ marginTop: "16px", overflow: "hidden", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--card-bg)", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Work
                  </th>
                  <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Flagged on
                  </th>
                  <th style={{ textAlign: "right", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Waiting
                  </th>
                  <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Status
                  </th>
                  <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                {(v.awaitingRows ?? []).map((w, wIndex) => (
                  <React.Fragment key={wIndex}>
                    <tr onClick={w.open} style={{ borderBottom: "1px solid var(--border-color)", cursor: "pointer" }}>
                      <td style={{ padding: "var(--cell-pad)", maxWidth: "300px" }}>
                        <div style={{ fontSize: "13.5px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {w.title}
                        </div>
                        <div style={{ marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                          {w.idLine}
                        </div>
                      </td>
                      <td style={{ padding: "var(--cell-pad)", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                        {w.flaggedDate}
                      </td>
                      <td style={{ padding: "var(--cell-pad)", textAlign: "right", fontSize: "13px", fontWeight: "500", color: w.waitColor }}>
                        {w.waitingDays}d
                      </td>
                      <td style={{ padding: "var(--cell-pad)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", borderRadius: "6px", padding: "2px 8px", fontSize: "11.5px", fontWeight: "600", whiteSpace: "nowrap", background: w.statusBg, color: w.statusColor }}>
                          {w.status}
                        </span>
                      </td>
                      <td style={{ padding: "var(--cell-pad)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap", background: w.riskBg, color: w.riskColor }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: w.riskColor }} />
                          {w.riskLabel}
                        </span>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
        {v.isQueueResolved && (
          <>
          <div style={{ marginTop: "16px", overflow: "hidden", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--card-bg)", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Work
                  </th>
                  <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Resolved on
                  </th>
                  <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Decision
                  </th>
                  <th style={{ textAlign: "left", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Reviewed by
                  </th>
                  <th style={{ textAlign: "right", padding: "var(--cell-pad)", fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                    Sanctioned
                  </th>
                </tr>
              </thead>
              <tbody>
                {(v.resolvedRows ?? []).map((w, wIndex) => (
                  <React.Fragment key={wIndex}>
                    <tr onClick={w.open} style={{ borderBottom: "1px solid var(--border-color)", cursor: "pointer" }}>
                      <td style={{ padding: "var(--cell-pad)", maxWidth: "280px" }}>
                        <div style={{ fontSize: "13.5px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {w.title}
                        </div>
                        <div style={{ marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                          {w.id}
                        </div>
                      </td>
                      <td style={{ padding: "var(--cell-pad)", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                        {w.resolvedDate}
                      </td>
                      <td style={{ padding: "var(--cell-pad)", fontSize: "12.5px", color: "var(--risk-clear)" }}>
                        {w.decision}
                      </td>
                      <td style={{ padding: "var(--cell-pad)", fontSize: "12.5px", color: "var(--text-secondary)" }}>
                        {w.reviewedBy}
                      </td>
                      <td style={{ padding: "var(--cell-pad)", textAlign: "right", fontSize: "13px", fontWeight: "500" }}>
                        {w.sanctioned}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
