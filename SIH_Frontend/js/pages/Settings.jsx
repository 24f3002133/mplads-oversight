import React from 'react';
import { useVals } from '../state/useVals.js';


export default function Settings() {
  const v = useVals();
  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "16px 28px", borderBottom: "2px solid var(--text-primary)", paddingBottom: "20px" }}>
        <div>
          <h1 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "30px", fontWeight: "700", letterSpacing: "-0.018em", lineHeight: "1.15", margin: "0", color: "var(--heading-color)" }}>
            Settings
          </h1>
          <p style={{ marginTop: "8px", maxWidth: "68ch", fontSize: "14px", lineHeight: "1.55", color: "var(--text-secondary)" }}>
            Workspace defaults, risk thresholds, and notification and export preferences for your MPLADS oversight workspace.
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
        </div>
      </header>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", border: "1px solid var(--border-color)", background: "var(--card-bg)", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)", flexWrap: "wrap" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--surface-active)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Source Serif 4',serif", fontWeight: "700", fontSize: "15px", flex: "0 0 auto", border: "1px solid var(--primary)" }}>
          {v.sessionInitials}
        </div>
        <div style={{ flex: "1 1 auto", minWidth: "0" }}>
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "16px", fontWeight: "600" }}>
            {v.sessionName}
          </div>
          <div style={{ marginTop: "2px", fontSize: "12.5px", color: "var(--text-secondary)" }}>
            {v.sessionRoleLine}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "16px" }}>
        <section style={{ border: "1px solid var(--border-color)", background: "var(--card-bg)", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "16.5px", fontWeight: "700", letterSpacing: "-0.01em", margin: "0", color: "var(--heading-color)" }}>
              Workspace defaults
            </h2>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "12px" }}>
              Your role, jurisdiction, and what loads when you sign in.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Role
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                Set by your zonal admin
              </span>
            </div>
            <div style={{ fontWeight: "600", fontSize: "13px" }}>
              {v.sessionRole}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Jurisdiction access
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                Whether you can browse data outside your assigned district
              </span>
            </div>
            <div style={{ display: "inline-flex", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "2px", background: "var(--surface-muted)", gap: "2px" }}>
              <button onClick={v.toggleJurisdictionLocked} style={{ border: "0", background: v.jurisdictionLockedBg, color: v.jurisdictionLockedColor, boxShadow: `inset 0 0 0 1px ${v.jurisdictionLockedBorder}`, fontSize: "12px", fontWeight: "600", padding: "6px 11px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>
                Assigned only
              </button>
              <button onClick={v.toggleJurisdictionLocked} style={{ border: "0", background: v.jurisdictionAnyBg, color: v.jurisdictionAnyColor, boxShadow: `inset 0 0 0 1px ${v.jurisdictionAnyBorder}`, fontSize: "12px", fontWeight: "600", padding: "6px 11px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>
                Any jurisdiction
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Default scope
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                State and district shown on Overview
              </span>
            </div>
            {v.settingsJurisdictionLocked && (
              <>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                {v.scopeChipDistrict}, {v.scopeChipState}
              </div>
              </>
            )}
            {v.settingsJurisdictionUnlocked && (
              <>
              <div style={{ display: "flex", gap: "8px" }}>
                <select value={v.settingsState} onChange={v.setSettingsState} style={{ background: "var(--surface-muted)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-primary)", fontSize: "12.5px", padding: "7px 10px" }}>
                  {(v.settingsStateOptions ?? []).map((op, opIndex) => (
                    <React.Fragment key={opIndex}>
                      <option value={op}>
                        {op}
                      </option>
                    </React.Fragment>
                  ))}
                </select>
                <select value={v.settingsDistrict} onChange={v.setSettingsDistrict} style={{ background: "var(--surface-muted)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-primary)", fontSize: "12.5px", padding: "7px 10px" }}>
                  {(v.settingsDistrictOptions ?? []).map((op, opIndex) => (
                    <React.Fragment key={opIndex}>
                      <option value={op}>
                        {op}
                      </option>
                    </React.Fragment>
                  ))}
                </select>
              </div>
              </>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Data refresh
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                PFMS &amp; satellite feeds sync continuously
              </span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: "600", color: "var(--risk-high)" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--risk-high)" }} />
              Live — always on
            </div>
          </div>
          <button onClick={v.requestJurisdictionChange} style={{ alignSelf: "flex-start", background: "none", border: "0", color: "var(--primary)", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", padding: "0", fontFamily: "inherit" }}>
            Request a role or jurisdiction change →
          </button>
        </section>
        <section style={{ border: "1px solid var(--border-color)", background: "var(--card-bg)", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "16.5px", fontWeight: "700", letterSpacing: "-0.01em", margin: "0", color: "var(--heading-color)" }}>
              Appearance
            </h2>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "12px" }}>
              Applies only to your sign-in, not shared with your district team.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Theme
              </span>
            </div>
            <div style={{ display: "inline-flex", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "2px", background: "var(--surface-muted)", gap: "2px" }}>
              <button onClick={v.setThemeLight} style={{ border: "0", background: v.lightModeBg, color: v.lightModeColor, fontSize: "12px", fontWeight: "600", padding: "6px 11px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>
                Light
              </button>
              <button onClick={v.setThemeDark} style={{ border: "0", background: v.darkModeBg, color: v.darkModeColor, fontSize: "12px", fontWeight: "600", padding: "6px 11px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>
                Dark
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Dark mode intensity
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                How deep the background navy runs when Theme is Dark
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Muted
              </span>
              <input type="range" min="0" max="100" value={v.settingsDarkIntensity} onChange={v.setSettingsDarkIntensity} style={{ width: "110px" }} />
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Deep
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Density
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                Row height on tables and ledgers
              </span>
            </div>
            <div style={{ display: "inline-flex", border: "1px solid var(--border-color)", borderRadius: "8px", padding: "2px", background: "var(--surface-muted)", gap: "2px" }}>
              <button onClick={v.setDensityComfortable} style={{ border: "0", background: v.densityComfortableBg, color: v.densityComfortableColor, boxShadow: `inset 0 0 0 1px ${v.densityComfortableBorder}`, fontSize: "12px", fontWeight: "600", padding: "6px 11px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>
                Comfortable
              </button>
              <button onClick={v.setDensityCompact} style={{ border: "0", background: v.densityCompactBg, color: v.densityCompactColor, boxShadow: `inset 0 0 0 1px ${v.densityCompactBorder}`, fontSize: "12px", fontWeight: "600", padding: "6px 11px", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}>
                Compact
              </button>
            </div>
          </div>
        </section>
        <section style={{ gridColumn: "1 / -1", border: "1px solid var(--border-color)", background: "var(--card-bg)", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "16.5px", fontWeight: "700", letterSpacing: "-0.01em", margin: "0", color: "var(--heading-color)" }}>
              Risk &amp; alert thresholds
            </h2>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "12px" }}>
              Controls when a work or agency gets flagged across Overview, Tracker and the PFMS leakage detector.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Overdue UC threshold
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                Days after which an unsettled Utilisation Certificate is flagged idle
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input type="number" min="0" step="10" value={v.settingsOverdueDays} onChange={v.setSettingsOverdueDays} style={{ width: "64px", background: "var(--surface-muted)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-primary)", fontSize: "13px", fontWeight: "600", padding: "7px 8px", textAlign: "right" }} />
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                days
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Idle-fund flag threshold
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                Minimum idle balance per agency to surface in the ledger
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <input type="number" min="0" step="1" value={v.settingsIdleFundCr} onChange={v.setSettingsIdleFundCr} style={{ width: "64px", background: "var(--surface-muted)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-primary)", fontSize: "13px", fontWeight: "600", padding: "7px 8px", textAlign: "right" }} />
              <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                ₹ Cr
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Severity cutoffs
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                Overdue UCs on record before an agency crosses into each tier
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--risk-high)" }} />
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", width: "60px" }}>
                  Critical ≥
                </span>
                <input type="number" min="0" value={v.settingsCritCutoff} onChange={v.setSettingsCritCutoff} style={{ width: "56px", background: "var(--surface-muted)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-primary)", fontSize: "13px", fontWeight: "600", padding: "7px 8px", textAlign: "right" }} />
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--risk-med)" }} />
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", width: "60px" }}>
                  High ≥
                </span>
                <input type="number" min="0" value={v.settingsHighCutoff} onChange={v.setSettingsHighCutoff} style={{ width: "56px", background: "var(--surface-muted)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-primary)", fontSize: "13px", fontWeight: "600", padding: "7px 8px", textAlign: "right" }} />
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--text-muted)" }} />
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", width: "60px" }}>
                  Medium ≥
                </span>
                <input type="number" min="0" value={v.settingsMedCutoff} onChange={v.setSettingsMedCutoff} style={{ width: "56px", background: "var(--surface-muted)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-primary)", fontSize: "13px", fontWeight: "600", padding: "7px 8px", textAlign: "right" }} />
              </span>
            </div>
          </div>
        </section>
        <section style={{ border: "1px solid var(--border-color)", background: "var(--card-bg)", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "16.5px", fontWeight: "700", letterSpacing: "-0.01em", margin: "0", color: "var(--heading-color)" }}>
              Notifications
            </h2>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "12px" }}>
              Where alerts reach you outside the dashboard.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Email digest
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                Summary of new flags for your district
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <select value={v.settingsEmailFrequency} onChange={v.setSettingsEmailFrequency} style={{ background: "var(--surface-muted)", border: "1px solid var(--border-color)", borderRadius: "6px", color: "var(--text-primary)", fontSize: "12.5px", padding: "7px 10px" }}>
                <option value="daily">
                  Daily
                </option>
                <option value="weekly">
                  Weekly
                </option>
              </select>
              <button onClick={v.toggleSettingsEmailDigest} style={{ border: "0", background: v.emailDigestBg, color: v.emailDigestColor, fontSize: "12px", fontWeight: "600", padding: "6px 12px", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit" }}>
                {v.emailDigestLabel}
              </button>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Desktop alerts
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                Push a browser notification for new critical flags
              </span>
            </div>
            <button onClick={v.toggleSettingsDesktopAlerts} style={{ border: "0", background: v.desktopAlertsBg, color: v.desktopAlertsColor, fontSize: "12px", fontWeight: "600", padding: "6px 12px", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit" }}>
              {v.desktopAlertsLabel}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "14px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Notify me for
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                Severity tiers included in alerts
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button onClick={v.toggleSettingsNotifyCritical} style={{ border: `1px solid ${v.notifyCriticalBorder}`, background: v.notifyCriticalBg, color: v.notifyCriticalColor, borderRadius: "999px", fontSize: "12px", fontWeight: "600", padding: "6px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                Critical
              </button>
              <button onClick={v.toggleSettingsNotifyHigh} style={{ border: `1px solid ${v.notifyHighBorder}`, background: v.notifyHighBg, color: v.notifyHighColor, borderRadius: "999px", fontSize: "12px", fontWeight: "600", padding: "6px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                High
              </button>
              <button onClick={v.toggleSettingsNotifyMedium} style={{ border: `1px solid ${v.notifyMediumBorder}`, background: v.notifyMediumBg, color: v.notifyMediumColor, borderRadius: "999px", fontSize: "12px", fontWeight: "600", padding: "6px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                Medium
              </button>
            </div>
          </div>
        </section>
        <section style={{ border: "1px solid var(--border-color)", background: "var(--card-bg)", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h2 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "16.5px", fontWeight: "700", letterSpacing: "-0.01em", margin: "0", color: "var(--heading-color)" }}>
              Export
            </h2>
            <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "12px" }}>
              "Export report" always saves a PDF — there's no format to default.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--body-color)" }}>
                Include supporting annexures
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                Agency ledgers and contractor lists as an appendix, on every export
              </span>
            </div>
            <button onClick={v.toggleSettingsIncludeAnnexures} style={{ border: "0", background: v.includeAnnexuresBg, color: v.includeAnnexuresColor, fontSize: "12px", fontWeight: "600", padding: "6px 12px", borderRadius: "999px", cursor: "pointer", fontFamily: "inherit" }}>
              {v.includeAnnexuresLabel}
            </button>
          </div>
        </section>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", padding: "14px 20px", border: "1px solid var(--border-color)", borderRadius: "12px", background: "var(--card-bg)" }}>
        <button onClick={v.resetSettings} style={{ border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", borderRadius: "8px", fontSize: "13px", fontWeight: "600", padding: "9px 18px", cursor: "pointer", fontFamily: "inherit" }}>
          Reset to defaults
        </button>
        <button onClick={v.saveSettings} style={{ border: "1px solid var(--primary)", background: "var(--primary)", color: "#fff", borderRadius: "8px", fontSize: "13px", fontWeight: "600", padding: "9px 18px", cursor: "pointer", fontFamily: "inherit" }}>
          Save changes
        </button>
      </div>
    </div>
    </>
  );
}
