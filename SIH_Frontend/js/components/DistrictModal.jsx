import React from 'react';
import { useVals } from '../state/useVals.js';


export default function DistrictModal() {
  const v = useVals();
  return (
    <>
    <div onClick={v.closeDistrictModal} style={{ position: "fixed", inset: "0", zIndex: "70", background: "rgba(19,26,34,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div onClick={v.stopProp} style={{ width: "100%", maxWidth: "640px", maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: "12px", background: "var(--card-bg)", boxShadow: "0 24px 48px -12px rgba(19,26,34,0.4)" }}>
        <div style={{ borderBottom: "1px solid var(--border-color)", padding: "24px 24px 16px" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Source Serif 4',serif", fontSize: "20px", fontWeight: "600", margin: "0", color: "var(--heading-color)" }}>
            {v.districtModalState.name}
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
            {v.districtModalState.flagged} flagged of {v.districtModalState.monitored} monitored works · avg. risk {v.districtModalState.avgRisk}
          </p>
        </div>
        <div onScroll={v.onDistrictScroll} style={{ overflowY: "auto", padding: "0 24px" }}>
          {(v.districtModalWorks ?? []).map((w, wIndex) => (
            <React.Fragment key={wIndex}>
              <button onClick={w.open} style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", gap: "16px", border: "none", borderBottom: "1px solid var(--border-color)", background: "none", padding: "14px 0", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "var(--text-primary)" }}>
                <div style={{ minWidth: "0" }}>
                  <div style={{ fontSize: "13.5px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {w.title}
                  </div>
                  <div style={{ marginTop: "2px", fontSize: "12px", color: "var(--text-muted)" }}>
                    {w.sub}
                  </div>
                </div>
                <span style={{ flexShrink: "0", borderRadius: "6px", padding: "3px 9px", fontSize: "12px", fontWeight: "600", background: w.riskBg, color: w.riskColor }}>
                  {w.riskLabel}
                </span>
              </button>
            </React.Fragment>
          ))}
          {v.districtModalLoadingMore && (
            <div className="mp-pulse" style={{ padding: "14px 0", textAlign: "center", fontSize: "12px", color: "var(--text-muted)" }}>
              Loading more works…
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
