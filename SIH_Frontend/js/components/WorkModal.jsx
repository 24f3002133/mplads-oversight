import React from 'react';
import { useVals } from '../state/useVals.js';
import asset_0936eac12f0241baac87b6b622a95627 from '../../assets/img/0936eac1-2f02-41ba-ac87-b6b622a95627.webp';
import asset_f30d8c7c708f4ee98a280cb3008d98bc from '../../assets/img/f30d8c7c-708f-4ee9-8a28-0cb3008d98bc.webp';
import asset_e60102db133546e88f3ed4cd1b7228ec from '../../assets/img/e60102db-1335-46e8-8f3e-d4cd1b7228ec.webp';
import asset_a40093c76f3345a7bdbd292dd06492ed from '../../assets/img/a40093c7-6f33-45a7-bdbd-292dd06492ed.webp';

export default function WorkModal() {
  const v = useVals();
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
              <span style={{ display: "inline-flex", alignItems: "center", borderRadius: "4px", background: "var(--sector-badge-bg)", padding: "2px 6px", fontSize: "11px", fontWeight: "600", color: "var(--primary)" }}>
                {v.wm.sector}
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
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  {v.wm.hasCostOutlier && (
                    <>
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
                        Sanctioned amount is
                        <b>
                          {v.wm.sdAbove} standard deviations
                        </b>
                        above the median for comparable {v.wm.subTypeLower} works in {v.wm.state}.
                      </p>
                      <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "16px" }}>
                        <div style={{ marginBottom: "8px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                          Cost distribution — comparable works in this sub-type
                        </div>
                        <svg viewBox="0 0 480 180" style={{ width: "100%", height: "180px" }}>
                          <line x1="24" x2="456" y1="156" y2="156" stroke={v.borderColor} strokeWidth="1" />
                          <line x1={v.wm.scatterMeanX} x2={v.wm.scatterMeanX} y1="24" y2="156" stroke={v.textMuted} strokeDasharray="3 3" strokeWidth="1" />
                          <text x={v.wm.scatterMeanX} y="16" fontSize="9.5" textAnchor="middle" fill={v.textMuted}>
                            median
                          </text>
                          {(v.wm.scatterPoints ?? []).map((pt, ptIndex) => (
                            <React.Fragment key={ptIndex}>
                              <circle cx={pt.cx} cy={pt.cy} r="3" fill={v.textSecondary} opacity="0.55" />
                            </React.Fragment>
                          ))}
                          <circle cx={v.wm.scatterHighlightX} cy="126" r="5.5" fill={v.riskHighColor} />
                          <text x={v.wm.scatterHighlightX} y="108" fontSize="10" fontWeight="600" textAnchor="middle" fill={v.riskHighColor}>
                            this work
                          </text>
                        </svg>
                      </div>
                    </div>
                    </>
                  )}
                  {v.wm.hasDuplicate && (
                    <>
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
                        Nearly identical sanction description found within
                        <b>
                          11 days
                        </b>
                        and
                        <b>
                          2.4 km
                        </b>
                        of this site.
                      </p>
                      <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", overflow: "hidden", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--border-color)" }}>
                        <div style={{ background: "var(--card-bg)", padding: "14px" }}>
                          <div style={{ fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                            {v.wm.id}
                          </div>
                          <p style={{ marginTop: "6px", fontSize: "13px", lineHeight: "1.4", color: "var(--body-color)" }}>
                            <mark style={{ background: "var(--risk-med-wash)", padding: "0 2px", color: "var(--body-color)" }}>
                              {v.wm.title}
                            </mark>
                          </p>
                          <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>
                            Sanctioned {v.wm.sanctionDate} · {v.wm.agency}
                          </div>
                        </div>
                        <div style={{ background: "var(--card-bg)", padding: "14px" }}>
                          <div style={{ fontSize: "11.5px", fontWeight: "600", color: "var(--text-muted)" }}>
                            {v.wm.dupId}
                          </div>
                          <p style={{ marginTop: "6px", fontSize: "13px", lineHeight: "1.4", color: "var(--body-color)" }}>
                            <mark style={{ background: "var(--risk-med-wash)", padding: "0 2px", color: "var(--body-color)" }}>
                              {v.wm.subType} construction near {v.wm.village}
                            </mark>
                          </p>
                          <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--text-secondary)" }}>
                            Sanctioned {v.wm.sanctionDate} · {v.wm.agency}
                          </div>
                        </div>
                      </div>
                    </div>
                    </>
                  )}
                  {v.wm.hasProgressIssue && (
                    <>
                    <div style={{ borderRadius: "8px", border: "1px solid var(--border-color)", borderLeft: "4px solid var(--risk-med)", background: "var(--card-bg)", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--heading-color)" }}>
                        {v.wm.progressIssueLabel}
                      </div>
                      <p style={{ marginTop: "10px", maxWidth: "62ch", fontFamily: "'Source Serif 4',serif", fontSize: "15.5px", lineHeight: "1.6", color: "var(--body-color)" }}>
                        Reported physical progress of
                        <b>
                          {v.wm.progress}%
                        </b>
                        does not reconcile with financial utilisation of
                        <b>
                          {v.wm.utilPct}%
                        </b>
                        of sanctioned value.
                      </p>
                    </div>
                    </>
                  )}
                </div>
              </section>
              <section style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  AI progress &amp; satellite change verification
                </h3>
                <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--text-muted)" }}>
                  Split-screen comparison — sanction-date capture vs. most recent pass.
                </p>
                <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <figure style={{ margin: "0", overflow: "hidden", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ position: "relative", aspectRatio: "4/3" }}>
                      <img src={asset_0936eac12f0241baac87b6b622a95627} loading="lazy" decoding="async" width={900} height={900} alt="Satellite imagery at sanction date" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                    <figcaption style={{ background: "var(--surface-subtle)", padding: "8px 12px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                      Captured {v.wm.sanctionDate} — sanction date
                    </figcaption>
                  </figure>
                  <figure style={{ margin: "0", overflow: "hidden", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ position: "relative", aspectRatio: "4/3" }}>
                      <img src={asset_f30d8c7c708f4ee98a280cb3008d98bc} loading="lazy" decoding="async" width={900} height={900} alt="Recent satellite imagery" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", left: "8px", top: "8px", border: "2px solid rgba(180,33,61,0.8)", borderRadius: "6px", width: "60%", height: "55%" }} />
                      <span style={{ position: "absolute", right: "8px", top: "8px", borderRadius: "6px", background: "var(--risk-high)", padding: "2px 6px", fontSize: "10px", fontWeight: "700", color: "#fff" }}>
                        AI bounding box
                      </span>
                    </div>
                    <figcaption style={{ background: "var(--surface-subtle)", padding: "8px 12px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                      Captured 18 Aug 2026 — latest pass
                    </figcaption>
                  </figure>
                </div>
                <div style={{ marginTop: "10px", borderRadius: "6px", background: "var(--risk-med-wash)", padding: "10px 14px", fontSize: "12.5px", color: "var(--risk-med)" }}>
                  Ground-truth vs. reported completion disparity: structure footprint suggests ~{v.wm.impliedProgress}% actual completion against {v.wm.progress}% reported.
                </div>
              </section>
              <section style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  Vendor cartel &amp; shell company detector
                </h3>
                <p style={{ marginTop: "8px", maxWidth: "62ch", fontSize: "13.5px", color: "var(--text-secondary)" }}>
                  Cross-referencing GSTIN, directors and bidding history for the awarded contractor against other {v.wm.agency} tenders.
                </p>
                <div style={{ marginTop: "12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", padding: "16px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ fontWeight: "500", color: "var(--body-color)" }}>
                      Shared director / GSTIN across works
                    </span>
                    <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "18px", fontWeight: "700", color: "var(--risk-high)" }}>
                      {v.wm.sharedDirectorCount}
                    </span>
                  </div>
                  <div style={{ marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ fontWeight: "500", color: "var(--body-color)" }}>
                      Sole-bidder tender rate (last 12 months)
                    </span>
                    <span style={{ fontFamily: "'Source Serif 4',serif", fontSize: "18px", fontWeight: "700", color: "var(--risk-med)" }}>
                      {v.wm.soleBidderPct}%
                    </span>
                  </div>
                </div>
              </section>
              <section style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  News coverage &amp; sentiment analysis
                </h3>
                <div style={{ marginTop: "8px", display: "flex", height: "6px", overflow: "hidden", borderRadius: "999px", background: "var(--surface-muted)" }}>
                  <div style={{ height: "100%", width: "25%", background: "var(--risk-clear)" }} />
                  <div style={{ height: "100%", width: "35%", background: "rgba(90,102,112,0.3)" }} />
                  <div style={{ height: "100%", width: "40%", background: "var(--risk-high)" }} />
                </div>
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(v.wm.news ?? []).map((n, nIndex) => (
                    <React.Fragment key={nIndex}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>
                            {n.source}
                          </div>
                          <p style={{ marginTop: "2px", fontSize: "13.5px", lineHeight: "1.4", color: "var(--body-color)" }}>
                            {n.text}
                          </p>
                        </div>
                        <span style={{ flexShrink: "0", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap", background: n.bg, color: n.color }}>
                          {n.sentiment}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </section>
              <section style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  Citizen ground truth
                </h3>
                <p style={{ marginTop: "4px", fontSize: "13px", color: "var(--text-muted)" }}>
                  Geofenced, crowdsourced verification photos near the sanctioned site.
                </p>
                <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <figure style={{ margin: "0", overflow: "hidden", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ aspectRatio: "4/3" }}>
                      <img src={asset_e60102db133546e88f3ed4cd1b7228ec} loading="lazy" decoding="async" width={900} height={900} alt="Citizen verification photo 1" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                    <figcaption style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-subtle)", padding: "8px 12px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                      <span>
                        Submitted {v.wm.village} · 28 Aug 2026
                      </span>
                      <span style={{ fontWeight: "600", color: "var(--risk-clear)" }}>
                        88% trust
                      </span>
                    </figcaption>
                  </figure>
                  <figure style={{ margin: "0", overflow: "hidden", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <div style={{ aspectRatio: "4/3" }}>
                      <img src={asset_a40093c76f3345a7bdbd292dd06492ed} loading="lazy" decoding="async" width={900} height={900} alt="Citizen verification photo 2" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                    <figcaption style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-subtle)", padding: "8px 12px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                      <span>
                        Submitted {v.wm.village} · 27 Aug 2026
                      </span>
                      <span style={{ fontWeight: "600", color: "var(--risk-clear)" }}>
                        82% trust
                      </span>
                    </figcaption>
                  </figure>
                </div>
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
                  <>
                  <div style={{ marginTop: "12px", borderRadius: "6px", background: "var(--risk-clear-wash)", padding: "10px 14px", fontSize: "12.5px", fontWeight: "500", color: "var(--risk-clear)" }}>
                    Recorded: {v.workModalDecision} — entry added to immutable case history below.
                  </div>
                  </>
                )}
              </section>
              <section>
                <h3 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.012em", margin: "0", color: "var(--heading-color)" }}>
                  Immutable case history
                </h3>
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column" }}>
                  {(v.wm.history ?? []).map((h, hIndex) => (
                    <React.Fragment key={hIndex}>
                      <div style={{ display: "grid", gridTemplateColumns: "104px 1fr", gap: "16px", borderBottom: "1px solid var(--border-color)", padding: "10px 0", fontSize: "13px" }}>
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
                    </React.Fragment>
                  ))}
                </div>
              </section>
            </div>
            <aside style={{ display: "flex", flexDirection: "column", gap: "20px", borderTop: "2px solid var(--text-primary)", paddingTop: "20px" }}>
              <div>
                <h4 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "16px", fontWeight: "700", letterSpacing: "-0.01em", margin: "0 0 12px", color: "var(--heading-color)" }}>
                  Project metadata
                </h4>
                <dl style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", margin: "0" }}>
                  {(v.wm.metadata ?? []).map((m, mIndex) => (
                    <React.Fragment key={mIndex}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                        <dt style={{ color: "var(--text-muted)", margin: "0" }}>
                          {m.k}
                        </dt>
                        <dd style={{ textAlign: "right", fontWeight: "500", margin: "0", color: "var(--text-primary)" }}>
                          {m.v}
                        </dd>
                      </div>
                    </React.Fragment>
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
                      Sanctioned
                    </dt>
                    <dd style={{ fontWeight: "600", margin: "0", color: "var(--text-primary)" }}>
                      {v.wm.sanctioned}
                    </dd>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <dt style={{ color: "var(--text-muted)", margin: "0" }}>
                      Released
                    </dt>
                    <dd style={{ fontWeight: "600", margin: "0", color: "var(--text-primary)" }}>
                      {v.wm.released}
                    </dd>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                    <dt style={{ color: "var(--text-muted)", margin: "0" }}>
                      Utilised
                    </dt>
                    <dd style={{ fontWeight: "600", margin: "0", color: "var(--text-primary)" }}>
                      {v.wm.utilised}
                    </dd>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <dt style={{ fontWeight: "500", color: "var(--risk-high)", margin: "0" }}>
                      Balance
                    </dt>
                    <dd style={{ fontWeight: "600", color: "var(--risk-high)", margin: "0" }}>
                      {v.wm.balance}
                    </dd>
                  </div>
                </dl>
                <div style={{ marginTop: "12px" }}>
                  <div style={{ marginBottom: "4px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "11.5px", color: "var(--text-muted)" }}>
                    <span>
                      Physical progress
                    </span>
                    <span style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                      {v.wm.progress}%
                    </span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "999px", background: "var(--surface-muted)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: "999px", width: `${v.wm.progress}%`, background: v.wm.progressColor }} />
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "15px", fontWeight: "600", margin: "0 0 8px", color: "var(--heading-color)" }}>
                  Check tags
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(v.wm.checkTags ?? []).map((t, tIndex) => (
                    <React.Fragment key={tIndex}>
                      <span style={{ display: "inline-flex", alignItems: "center", borderRadius: "4px", background: "var(--surface-muted)", padding: "2px 6px", fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)" }}>
                        {t}
                      </span>
                    </React.Fragment>
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
