import React from 'react';
import { useVals } from '../state/useVals.js';


export default function Copilot() {
  const v = useVals();
  return (
    <>
    <div style={{ position: "fixed", bottom: "96px", right: "24px", zIndex: "50", display: "flex", height: "min(560px,70vh)", width: "380px", flexDirection: "column", overflow: "hidden", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--card-bg)", boxShadow: "0 24px 48px -12px rgba(19,26,34,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid var(--copilot-accent-line)", background: "var(--copilot-header-bg)", padding: "12px 16px" }}>
        <div style={{ display: "flex", width: "32px", height: "32px", alignItems: "center", justifyContent: "center", borderRadius: "999px", background: "var(--copilot-accent)", color: "var(--copilot-accent-fg)", fontSize: "13px", fontWeight: "700", boxShadow: "0 0 14px -2px var(--copilot-accent)" }}>
          AI
        </div>
        <div style={{ minWidth: "0" }}>
          <div style={{ fontSize: "13.5px", fontWeight: "700", letterSpacing: "0.01em", color: "var(--copilot-accent)" }}>
            Oversight Copilot
          </div>
          <div style={{ fontSize: "11.5px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Context: {v.copilotContext}
          </div>
        </div>
        {v.copilotHasHistory && (
          <>
          <button onClick={v.clearCopilot} className="mp-glow" title="Clear this conversation" aria-label="Clear conversation" style={{ marginLeft: "auto", flexShrink: "0", border: "1px solid var(--copilot-accent-line)", background: "transparent", borderRadius: "6px", padding: "4px 9px", fontSize: "11px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", color: "var(--copilot-accent)" }}>
            Clear
          </button>
          </>
        )}
      </div>
      <div style={{ flex: "1", overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {(v.copilotMessages ?? []).map((m, mIndex) => (
          <React.Fragment key={mIndex}>
            <div style={{ maxWidth: "88%", borderRadius: "8px", padding: "8px 12px", fontSize: "12.5px", lineHeight: "1.5", alignSelf: m.align, background: m.bg, color: m.color }}>
              {m.text}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", borderTop: "1px solid var(--border-color)", padding: "10px 12px" }}>
        <button onClick={v.copilotSummarize} className="mp-glow" style={{ borderRadius: "6px", border: "1px solid var(--copilot-accent-line)", background: "var(--copilot-chip-bg)", padding: "5px 10px", fontSize: "11.5px", cursor: "pointer", fontFamily: "inherit", color: "var(--copilot-accent)", fontWeight: "600" }}>
          Summarize why flagged
        </button>
        <button onClick={v.copilotDraftMemo} className="mp-glow" style={{ borderRadius: "6px", border: "1px solid var(--copilot-accent-line)", background: "var(--copilot-chip-bg)", padding: "5px 10px", fontSize: "11.5px", cursor: "pointer", fontFamily: "inherit", color: "var(--copilot-accent)", fontWeight: "600" }}>
          Draft clarification memo
        </button>
        <button onClick={v.copilotBiddingHistory} className="mp-glow" style={{ borderRadius: "6px", border: "1px solid var(--copilot-accent-line)", background: "var(--copilot-chip-bg)", padding: "5px 10px", fontSize: "11.5px", cursor: "pointer", fontFamily: "inherit", color: "var(--copilot-accent)", fontWeight: "600" }}>
          Check bidding history
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", borderTop: "1px solid var(--border-color)", padding: "12px" }}>
        <textarea value={v.copilotDraft} onChange={v.setCopilotDraft} onKeyDown={v.copilotKeyDown} placeholder="Ask the copilot, or dictate your notes…" style={{ flex: "1", minHeight: "36px", resize: "none", borderRadius: "6px", border: "1px solid var(--border-color)", padding: "8px 10px", fontSize: "12.5px", fontFamily: "inherit", color: "var(--text-primary)", background: "var(--card-bg)" }} />
        <button onClick={v.toggleListening} className={v.listenClass} aria-label="Voice dictation" title={v.listenTitle} style={{ flexShrink: "0", width: "34px", height: "34px", borderRadius: "6px", cursor: "pointer", border: `1px solid ${v.listenBorder}`, background: v.listenBg, color: v.listenColor, fontSize: "15px" }}>
          {v.listenIcon}
        </button>
        <button onClick={v.sendCopilotMessage} className="mp-glow" aria-label="Send" title="Send" style={{ flexShrink: "0", width: "34px", height: "34px", borderRadius: "6px", border: "none", background: "var(--copilot-accent)", color: "var(--copilot-accent-fg)", cursor: "pointer", boxShadow: "0 0 12px -3px var(--copilot-accent)" }}>
          ➤
        </button>
      </div>
    </div>
    </>
  );
}
