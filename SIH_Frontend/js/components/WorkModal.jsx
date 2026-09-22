import React from 'react';
import { useVals } from '../state/useVals.js';

export default function WorkModal() {
  const v = useVals();
  if (!v.workModalOpen) return null;
  const wm = v.wm || {};
  if (!wm.id) return (
    <div onClick={v.closeWorkModal} style={{ position: "fixed", inset: "0", zIndex: "80", background: "rgba(19,26,34,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div onClick={v.stopProp} style={{ borderRadius: "12px", background: "var(--card-bg)", padding: "32px", boxShadow: "0 32px 64px -16px rgba(19,26,34,0.45)" }}>
        <p style={{ margin: "0", color: "var(--text-primary)" }}>{wm.loadingDossier ? 'Loading dossier…' : 'Unable to load dossier.'}</p>
      </div>
    </div>
  );
  return (
    <>
    <div onClick={v.closeWorkModal} style={{ position: "fixed", inset: "0", zIndex: "80", background: "rgba(19,26,34,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div onClick={v.stopProp} style={{ width: "100%", maxWidth: "1080px", maxHeight: "92vh", overflowY: "auto", borderRadius: "12px", background: "var(--card-bg)", boxShadow: "0 32px 64px -16px rgba(19,26,34,0.45)", position: "relative" }}>
        <button onClick={v.closeWorkModal} aria-label="Close" style={{ position: "sticky", top: "12px", left: "100%", marginRight: "12px", float: "right", border: "none", background: "var(--sidebar-bg)", borderRadius: "999px", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px", color: "var(--text-primary)" }}>
          ✕
        </button>
        <div style={{ padding: "32px", clear: "both" }}>
          <div style={{ borderBottom: "2px solid var(--text-primary)", paddingBottom: "24px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)" }}>
                {v.wm.id}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", borderRadius: "6px", padding: "2px 8px", fontSize: "11.5px", fontWeight: "600", background: v.wm.statusBg, color: v.wm.statusColor }}>
                {v.wm.status}
              </span>
              <button onClick={v.wm.trackAction} style={{ marginLeft: "auto", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)" }}>
                {v.wm.trackLabel}
              </button>
            </div>
            <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}>
              <div>
                <h2 style={{ maxWidth: "36ch", fontFamily: "'Source Serif 4',serif", fontSize: "29px", fontWeight: "700", letterSpacing: "-0.018em", lineHeight: "1.18", margin: "0", color: "var(--heading-color)" }}>
                  {v.wm.title}
                </h2>
                <p style={{ marginTop: "8px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  {v.wm.locationLine}
                </p>
              </div>
              <div style={{ flexShrink: "0", textAlign: "right" }}>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                  Risk score
                </div>
                <div style={{ fontFamily: "'Source Serif 4',serif", fontWeight: "700", fontSize: "44px", lineHeight: "1", color: v.wm.riskColor }}>
                  {v.wm.riskScore}
                  <span style={{ fontSize: "20px", fontWeight: "400", color: "var(--text-muted)" }}>
                    /100
                  </span>
                </div>
                <div style={{ marginTop: "4px", fontSize: "12px", color: "var(--text-secondary)" }}>
                  {v.wm.checksCount} checks triggered
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <section>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  Why this was flagged
                </h3>
                {v.wm.checksCount > 0 && (
                  <p style={{ marginTop: "8px", maxWidth: "70ch", fontSize: "13.5px", lineHeight: "1.55", color: "var(--text-secondary)" }}>
                    This work was flagged because it triggered {v.wm.checksCount} anomaly{v.wm.checksCount > 1 ? 'ies' : 'y'}: {v.wm.checkTags.join(', ')}.
                  </p>
                )}
                {v.wm.checksCount === 0 && (
                  <p style={{ marginTop: "10px", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                    No anomaly checks triggered for this work.
                  </p>
                )}
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  {v.wm.hasCostOutlier && (
                    <div style={{ borderRadius: "8px", border: "1px solid var(--border-color)", borderLeft: "4px solid var(--risk-high)", background: "var(--card-bg)", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: "var(--heading-color)" }}>
                          Cost outlier
                        </div>
                        <span style={{ borderRadius: "6px", background: "var(--risk-high-wash)", padding: "2px 8px", fontSize: "11.5px", fontWeight: "600", color: "var(--risk-high)" }}>
                          High confidence
                        </span>
                      </div>
                      <p style={{ marginTop: "10px", maxWidth: "62ch", fontFamily: "'Source Serif 4',serif", fontSize: "15.5px", lineHeight: "1.6", color: "var(--body-color)" }}>
                        Sanctioned amount is <b>{v.wm.zScore} standard deviations</b> above the peer average for works in the same state and stage.
                      </p>
                      <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                        <div style={{ marginBottom: "8px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                          Cost distribution — comparable works in this state and stage
                        </div>
                        <svg viewBox="0 0 480 180" style={{ width: "100%", height: "180px" }}>
                          <line x1="24" x2="456" y1="156" y2="156" stroke={v.borderColor} strokeWidth="1" />
                          <line x1={v.wm.scatterMeanX} x2={v.wm.scatterMeanX} y1="24" y2="156" stroke={v.textMuted} strokeDasharray="3 3" strokeWidth="1" />
                          <text x={v.wm.scatterMeanX} y="16" fontSize="9.5" textAnchor="middle" fill={v.textMuted}>
                            peer avg
                          </text>
                          {(v.wm.scatterPoints ?? []).map((pt, ptIndex) => (
                            <circle key={ptIndex} cx={pt.cx} cy={pt.cy} r="3" fill={v.textSecondary} opacity="0.55" />
                          ))}
                          <circle cx={v.wm.scatterHighlightX} cy="126" r="5.5" fill={v.riskHighColor} />
                          <text x={v.wm.scatterHighlightX} y="108" fontSize="10" fontWeight="600" textAnchor="middle" fill={v.riskHighColor}>
                            this work
                          </text>
                        </svg>
                      </div>
                    </div>
                  )}
                  {v.wm.hasDuplicate && v.wm.duplicateMatches.length > 0 && (
                    <div style={{ borderRadius: "8px", border: "1px solid var(--border-color)", borderLeft: "4px solid var(--risk-med)", background: "var(--card-bg)", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--heading-color)" }}>
                          Duplicate project match
                        </div>
                        <span style={{ borderRadius: "6px", background: "var(--risk-med-wash)", padding: "2px 8px", fontSize: "11.5px", fontWeight: "600", color: "var(--risk-med)" }}>
                          Needs review
                        </span>
                      </div>
                      <p style={{ marginTop: "10px", maxWidth: "62ch", fontFamily: "'Source Serif 4',serif", fontSize: "15.5px", lineHeight: "1.6", color: "var(--body-color)" }}>
                        Another work under the same agency has the same description. This may be a duplicate entry or a split project.
                      </p>
                      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        {v.wm.duplicateMatches.slice(0, 3).map((dup, i) => (
                          <div key={i} style={{ borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--card-bg)", padding: "14px" }}>
                            <div style={{ fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                              {dup.id}
                            </div>
                            <p style={{ marginTop: "6px", fontSize: "13px", lineHeight: "1.4", color: "var(--body-color)" }}>
                              {dup.title}
                            </p>
                            <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>
                              {dup.location} · Sanctioned {dup.sanctioned}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {v.wm.hasStalled && (
                    <div style={{ borderRadius: "8px", border: "1px solid var(--border-color)", borderLeft: "4px solid var(--risk-med)", background: "var(--card-bg)", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--heading-color)" }}>
                        Stalled work
                      </div>
                      <p style={{ marginTop: "10px", maxWidth: "62ch", fontFamily: "'Source Serif 4',serif", fontSize: "15.5px", lineHeight: "1.6", color: "var(--body-color)" }}>
                        The work was recommended on <b>{v.wm.recommendedDate}</b> but is still marked <b>“Pending for Sanction”</b> after more than a year. Long delays at this stage can mean the project is blocked, the paperwork is incomplete, or funds are sitting unused.
                      </p>
                    </div>
                  )}
                </div>
              </section>
              <section style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  AI progress &amp; satellite change verification
                </h3>
                <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--text-muted)" }}>
                  Coming soon — no satellite data available for this work.
                </p>
              </section>
              <section style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  Vendor cartel &amp; shell company detector
                </h3>
                <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--text-muted)" }}>
                  Contractor/vendor linkage data not yet ingested.
                </p>
              </section>
              <section style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  News coverage &amp; sentiment analysis
                </h3>
                <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--text-muted)" }}>
                  No news items linked to this work yet.
                </p>
              </section>
              <section style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  Citizen ground truth
                </h3>
                <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--text-muted)" }}>
                  No crowdsourced verification photos for this site yet.
                </p>
              </section>
              <section style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  Record your assessment
                </h3>
                <div style={{ marginTop: "12px" }}>
                  <textarea value={v.workModalNote} onChange={v.setWorkNote} placeholder="Enter your findings — this auto-saves as you type…" style={{ width: "100%", minHeight: "112px", resize: "vertical", borderRadius: "6px", border: "1px solid var(--border-color)", padding: "10px 12px", fontSize: "13.5px", fontFamily: "inherit", color: "var(--text-primary)", background: "var(--card-bg)" }} />
                  <div style={{ marginTop: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11.5px", color: "var(--text-muted)" }}>
                    <span>
                      {v.wm.savedLabel}
                    </span>
                    <button type="button" onClick={v.aiDraftNote} style={{ border: "none", background: "none", fontWeight: "500", color: "var(--primary)", cursor: "pointer", fontFamily: "inherit" }}>
                      One-click AI draft assessment
                    </button>
                  </div>
                </div>
                <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "8px", borderTop: "2px solid var(--text-primary)", paddingTop: "16px" }}>
                  <button onClick={v.wm.clearAction} style={{ border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", background: "var(--primary)", color: "#fff" }}>
                    Clear this work
                  </button>
                  <button onClick={v.wm.clarifyAction} style={{ border: "1px solid var(--border-color)", borderRadius: "6px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", background: "var(--card-bg)", color: "var(--text-primary)" }}>
                    Ask agency for clarification
                  </button>
                  <button onClick={v.wm.escalateAction} style={{ border: "1px solid var(--border-color)", borderRadius: "6px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", background: "var(--card-bg)", color: "var(--risk-high)" }}>
                    Escalate to state
                  </button>
                </div>
                {v.workModalDecision && (
                  <div style={{ marginTop: "12px", borderRadius: "6px", background: "var(--risk-clear-wash)", padding: "10px 14px", fontSize: "12.5px", fontWeight: "500", color: "var(--risk-clear)" }}>
                    Recorded: {v.workModalDecision} — entry added to immutable case history below.
                  </div>
                )}
              </section>
              <section>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  Immutable case history
                </h3>
                {v.wm.history.length === 0 ? (
                  <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
                    No case history entries yet.
                  </p>
                ) : (
                  <div style={{ marginTop: "12px", display: "flex", flexDirection: "column" }}>
                    {v.wm.history.map((h, hIndex) => (
                      <div key={hIndex} style={{ display: "grid", gridTemplateColumns: "104px 1fr", gap: "16px", borderBottom: "1px solid var(--border-color)", padding: "10px 0", fontSize: "13px" }}>
                        <time style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {h.time}
                        </time>
                        <div>
                          <p style={{ margin: "0", color: "var(--body-color)" }}>
                            {h.text}
                          </p>
                          <p style={{ marginTop: "2px", fontFamily: "monospace", fontSize: "10.5px", color: "var(--text-muted)" }}>
                            sha256:{h.hash}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
            <aside style={{ display: "flex", flexDirection: "column", gap: "20px", borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
              <div>
                <h4 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "16px", fontWeight: "700", letterSpacing: "-0.01em", margin: "0 0 12px", color: "var(--heading-color)" }}>
                  Project metadata
                </h4>
                <dl style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", margin: "0" }}>
                  {v.wm.metadata.map((m, mIndex) => (
                    <div key={mIndex} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                      <dt style={{ color: "var(--text-muted)", margin: "0" }}>
                        {m.k}
                      </dt>
                      <dd style={{ textAlign: "right", fontWeight: "500", margin: "0", color: "var(--text-primary)" }}>
                        {m.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h4 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "16px", fontWeight: "700", letterSpacing: "-0.01em", margin: "0 0 12px", color: "var(--heading-color)" }}>
                  Financial breakdown
                </h4>
                <dl style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", margin: "0" }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <dt style={{ color: "var(--text-muted)", margin: "0" }}>
                      Recommended
                    </dt>
                    <dd style={{ fontWeight: "600", margin: "0", color: "var(--text-primary)" }}>
                      {v.wm.recommended}
                    </dd>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <dt style={{ fontWeight: "500", color: "var(--risk-high)", margin: "0" }}>
                      Sanctioned
                    </dt>
                    <dd style={{ fontWeight: "600", color: "var(--risk-high)", margin: "0" }}>
                      {v.wm.sanctioned}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "15px", fontWeight: "600", margin: "0 0 8px", color: "var(--heading-color)" }}>
                  Check tags
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {v.wm.checkTags.map((t, tIndex) => (
                    <span key={tIndex} style={{ display: "inline-flex", alignItems: "center", borderRadius: "4px", background: "var(--surface-muted)", padding: "2px 6px", fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
