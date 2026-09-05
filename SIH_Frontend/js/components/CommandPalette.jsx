import React from 'react';
import { useVals } from '../state/useVals.js';


export default function CommandPalette() {
  const v = useVals();
  return (
    <>
    <div onClick={v.closePalette} style={{ position: "fixed", inset: "0", zIndex: "70", background: "rgba(19,26,34,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "96px" }}>
      <div onClick={v.stopProp} style={{ width: "100%", maxWidth: "560px", borderRadius: "12px", background: "var(--card-bg)", boxShadow: "0 24px 48px -12px rgba(19,26,34,0.4)", overflow: "hidden" }}>
        <input autoFocus="true" value={v.paletteQuery} onChange={v.setPaletteQuery} placeholder="Jump to borewell MP-2024-08832, filter drinking water in Junnar, export dossier…" style={{ width: "100%", border: "none", borderBottom: "1px solid var(--border-color)", padding: "14px 18px", fontSize: "14px", fontFamily: "inherit", background: "var(--card-bg)", color: "var(--text-primary)" }} />
        <div style={{ maxHeight: "400px", overflowY: "auto", padding: "8px" }}>
          {v.paletteHasMatches && (
            <>
            <div style={{ padding: "6px 10px", fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Works
            </div>
            {(v.paletteMatches ?? []).map((m, mIndex) => (
              <React.Fragment key={mIndex}>
                <button onClick={m.go} style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", gap: "10px", border: "none", background: "none", borderRadius: "8px", padding: "8px 10px", textAlign: "left", cursor: "pointer", fontFamily: "inherit", color: "var(--text-primary)" }}>
                  <div style={{ minWidth: "0" }}>
                    <div style={{ fontSize: "13px", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                      {m.sub}
                    </div>
                  </div>
                  <span style={{ flexShrink: "0", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", fontWeight: "600", background: m.riskBg, color: m.riskColor }}>
                    {m.riskLabel}
                  </span>
                </button>
              </React.Fragment>
            ))}
            </>
          )}
          <div style={{ padding: "6px 10px", fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Navigate
          </div>
          {(v.paletteNavItems ?? []).map((n, nIndex) => (
            <React.Fragment key={nIndex}>
              <button onClick={n.go} style={{ display: "block", width: "100%", border: "none", background: "none", borderRadius: "8px", padding: "9px 10px", textAlign: "left", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", color: "var(--text-primary)" }}>
                {n.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
