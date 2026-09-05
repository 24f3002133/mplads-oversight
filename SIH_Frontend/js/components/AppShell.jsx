import React from 'react';
import { useVals } from '../state/useVals.js';
const Overview = React.lazy(() => import('../pages/Overview.jsx'));
const AllWorks = React.lazy(() => import('../pages/AllWorks.jsx'));
const FundFlow = React.lazy(() => import('../pages/FundFlow.jsx'));
const Tracker = React.lazy(() => import('../pages/Tracker.jsx'));
const Queue = React.lazy(() => import('../pages/Queue.jsx'));
const Contractors = React.lazy(() => import('../pages/Contractors.jsx'));
const Reports = React.lazy(() => import('../pages/Reports.jsx'));
const Settings = React.lazy(() => import('../pages/Settings.jsx'));
const CommandPalette = React.lazy(() => import('../components/CommandPalette.jsx'));
const Copilot = React.lazy(() => import('../components/Copilot.jsx'));
const DistrictModal = React.lazy(() => import('../components/DistrictModal.jsx'));
const WorkModal = React.lazy(() => import('../components/WorkModal.jsx'));

export default function AppShell() {
  const v = useVals();
  return (
    <>
    <aside style={{ position: "fixed", top: "16px", bottom: "16px", left: "16px", zIndex: "40", display: "flex", flexDirection: "column", width: "220px", borderRadius: "20px", boxShadow: "0 4px 16px rgba(19,26,34,0.08)", background: "var(--sidebar-bg)" }}>
      <div style={{ borderBottom: "1px solid var(--sidebar-border)", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
        <div>
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "17px", fontWeight: "700", lineHeight: "1.3" }}>
            <span style={{ color: "#b4213d" }}>
              M
            </span>
            <span style={{ color: "var(--text-primary)" }}>
              PLADS
            </span>
          </div>
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "17px", fontWeight: "700", lineHeight: "1.3" }}>
            <span style={{ color: "#b4213d" }}>
              O
            </span>
            <span style={{ color: "var(--text-primary)" }}>
              versight
            </span>
          </div>
        </div>
        <div title="MPLADS Oversight — use the sidebar to switch between dashboard sections" style={{ fontFamily: "'Source Serif 4',serif", fontStyle: "italic", fontSize: "26px", fontWeight: "700", color: "#b4213d", flexShrink: "0", cursor: "help" }}>
          MO
        </div>
      </div>
      <nav style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px", padding: "16px 12px" }}>
        {(v.navItems ?? []).map((item, itemIndex) => (
          <React.Fragment key={itemIndex}>
            <button onClick={item.go} style={{ display: "flex", alignItems: "center", gap: "10px", textAlign: "left", border: "none", borderLeft: `2px solid ${item.borderColor}`, background: item.bg, color: item.color, borderRadius: "6px", padding: "10px 12px", fontSize: "14.5px", fontWeight: item.weight, cursor: "pointer", fontFamily: "inherit" }}>
              <span aria-hidden="true">
                {item.dot}
              </span>
              {item.label}
            </button>
          </React.Fragment>
        ))}
      </nav>
      <button onClick={v.gotoQueue} style={{ margin: "0 12px 12px", display: "flex", alignItems: "center", gap: "10px", border: "none", borderRadius: "6px", padding: "10px 12px", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", textAlign: "left", fontFamily: "inherit", background: v.queueNavBg, color: "var(--risk-high)" }}>
        {v.queueNavLabel}
      </button>
      <div style={{ borderTop: "1px solid var(--sidebar-border)", padding: "14px 16px" }}>
        <div style={{ fontSize: "11px", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
          Signed in as
        </div>
        <div style={{ marginTop: "2px", fontSize: "14px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {v.sessionName}
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {v.sessionRoleLine}
        </div>
        <button onClick={v.handleLogout} style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", border: "none", background: "none", padding: "0", fontSize: "13px", fontWeight: "500", color: "var(--text-muted)", cursor: "pointer", fontFamily: "inherit" }}>
          Sign out
        </button>
      </div>
    </aside>
    <div style={{ marginLeft: "252px" }}>
      <div aria-hidden="true" style={{ position: "fixed", inset: "0 0 0 252px", pointerEvents: "none", background: "radial-gradient(circle at 88% 4%, var(--primary)14, transparent 40%), radial-gradient(circle at 6% 96%, var(--primary)0d, transparent 45%)" }} />
      <svg aria-hidden="true" viewBox="0 0 200 200" style={{ position: "fixed", right: "-70px", bottom: "-70px", width: "440px", height: "440px", opacity: "0.06", pointerEvents: "none" }}>
        <circle cx="100" cy="100" r="92" fill="none" stroke={v.primaryColor} strokeWidth="2" />
        <circle cx="100" cy="100" r="6" fill={v.primaryColor} />
        {(v.chakraSpokes ?? []).map((sp, spIndex) => (
          <React.Fragment key={spIndex}>
            <line x1="100" y1="100" x2={sp.x} y2={sp.y} stroke={v.primaryColor} strokeWidth="1.5" />
          </React.Fragment>
        ))}
      </svg>
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "16px 24px 0" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0", flex: "1", borderRadius: "8px", border: "1px solid var(--border-color)", background: v.tickerBg, padding: "var(--cell-pad)", boxShadow: "0 1px 2px rgba(19,26,34,0.05)", transition: "background 0.6s" }}>
            <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px", alignItems: "center", justifyContent: "center" }}>
              <span style={{ position: "absolute", display: "inline-flex", width: "8px", height: "8px", borderRadius: "999px", background: "var(--risk-high)", opacity: "0.6", animation: "mp-ping 1.6s cubic-bezier(0,0,0.2,1) infinite" }} />
              <span style={{ position: "relative", display: "inline-flex", width: "6px", height: "6px", borderRadius: "999px", background: "var(--risk-high)" }} />
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em", color: "var(--risk-high)", textTransform: "uppercase", flexShrink: "0" }}>
              Live
            </span>
            <div style={{ minWidth: "0", flex: "1", overflow: "hidden" }}>
              <div style={{ display: "inline-flex", whiteSpace: "nowrap", animation: "mp-marquee 28s linear infinite" }}>
                <span style={{ paddingRight: "56px", fontSize: "13px" }} dangerouslySetInnerHTML={v.tickerMarqueeHtml} />
                <span style={{ paddingRight: "56px", fontSize: "13px" }} dangerouslySetInnerHTML={v.tickerMarqueeHtml} />
              </div>
            </div>
            <span style={{ flexShrink: "0", fontSize: "11px", color: "var(--text-muted)" }}>
              {v.tickerCount} events today
            </span>
            <span style={{ flexShrink: "0", fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              Synced {v.tickerSyncedLabel}
            </span>
          </div>
          <button onClick={v.toggleDarkMode} title={v.darkModeTitle} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", padding: "0", cursor: "pointer", fontFamily: "inherit", border: `1px solid ${v.darkModeBorder}`, background: v.darkModeBg, color: v.darkModeColor, flexShrink: "0", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
            {v.darkMode && (
              <>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              </>
            )}
            {v.darkModeInv && (
              <>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              </>
            )}
          </button>
          <button onClick={v.openPalette} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", width: "124px", height: "36px", borderRadius: "8px", padding: "0", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", border: "1px solid var(--border-color)", background: "var(--card-bg)", whiteSpace: "nowrap", flexShrink: "0", color: "var(--text-primary)", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
            Search
            <span style={{ border: "1px solid var(--border-color)", borderRadius: "4px", padding: "1px 5px", fontSize: "10.5px", color: "var(--text-muted)" }}>
              ⌘K
            </span>
          </button>
          <button onClick={v.exportCurrentReport} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", width: "124px", height: "36px", borderRadius: "8px", padding: "0", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-primary)", whiteSpace: "nowrap", flexShrink: "0", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
            {v.exportReportLabel}
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", marginTop: "16px" }}>
          {v.canSwitchScope && (
            <>
            <div style={{ display: "flex", alignItems: "center", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", padding: "4px", boxShadow: "0 1px 2px rgba(19,26,34,0.05)" }}>
              <button onClick={v.setScopeLocal} style={{ display: "flex", alignItems: "center", gap: "6px", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", background: v.scopeLocalBg, color: v.scopeLocalColor, whiteSpace: "nowrap" }}>
                Local scope · {v.sessionDistrict}
              </button>
              <button onClick={v.setScopeNational} style={{ display: "flex", alignItems: "center", gap: "6px", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", background: v.scopeNationalBg, color: v.scopeNationalColor, whiteSpace: "nowrap" }}>
                National overview
              </button>
            </div>
            </>
          )}
          {v.showScopedBadge && (
            <>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--card-bg)", padding: "6px 12px", fontSize: "12.5px", fontWeight: "600", color: "var(--text-secondary)", boxShadow: "0 1px 2px rgba(19,26,34,0.05)", whiteSpace: "nowrap", flexShrink: "0" }}>
              Scoped to {v.sessionDistrict}, {v.sessionState}
            </div>
            </>
          )}
        </div>
      </div>
      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "24px" }}>
        {v.isOverview && (
          <React.Suspense fallback={null}>
            <Overview />
          </React.Suspense>
        )}
        {v.isAllworks && (
          <React.Suspense fallback={null}>
            <AllWorks />
          </React.Suspense>
        )}
        {v.isFundflow && (
          <React.Suspense fallback={null}>
            <FundFlow />
          </React.Suspense>
        )}
        {v.isTracker && (
          <React.Suspense fallback={null}>
            <Tracker />
          </React.Suspense>
        )}
        {v.isQueue && (
          <React.Suspense fallback={null}>
            <Queue />
          </React.Suspense>
        )}
        {v.isContractors && (
          <React.Suspense fallback={null}>
            <Contractors />
          </React.Suspense>
        )}
        {v.isReports && (
          <React.Suspense fallback={null}>
            <Reports />
          </React.Suspense>
        )}
        {v.isSettings && (
          <React.Suspense fallback={null}>
            <Settings />
          </React.Suspense>
        )}
      </main>
    </div>
    {v.toast && (
      <>
      <div style={{ position: "fixed", bottom: "24px", left: "24px", zIndex: "60", maxWidth: "340px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--card-bg)", padding: "14px 16px", boxShadow: "0 12px 32px -12px rgba(19,26,34,0.35)" }}>
        <div style={{ fontSize: "13px", fontWeight: "600" }}>
          {v.toast.title}
        </div>
        <div style={{ marginTop: "2px", fontSize: "12px", color: "var(--text-secondary)" }}>
          {v.toast.description}
        </div>
      </div>
      </>
    )}
    {v.paletteOpen && (
      <React.Suspense fallback={null}>
        <CommandPalette />
      </React.Suspense>
    )}
    <button onClick={v.toggleCopilot} aria-label="Open AI copilot" className="mp-glow" title="Oversight Copilot" style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: "50", width: "56px", height: "56px", borderRadius: "999px", border: "none", background: "var(--copilot-accent)", color: "var(--copilot-accent-fg)", fontSize: "22px", cursor: "pointer", boxShadow: "0 12px 24px -8px rgba(19,26,34,0.4)" }}>
      {v.copilotIcon}
    </button>
    {v.copilotOpen && (
      <React.Suspense fallback={null}>
        <Copilot />
      </React.Suspense>
    )}
    {v.districtModalOpen && (
      <React.Suspense fallback={null}>
        <DistrictModal />
      </React.Suspense>
    )}
    {v.workModalOpen && (
      <React.Suspense fallback={null}>
        <WorkModal />
      </React.Suspense>
    )}
    </>
  );
}
