import React from 'react';
import { useVals } from '../state/useVals.js';

const CHECKS = [
  { name: 'Cost outlier', weight: 30, desc: 'Sanction amount is 2.5+ standard deviations from the average for works in the same state and stage (needs at least 30 peer works to compare against).' },
  { name: 'Impossible timeline', weight: 30, desc: 'The work was sanctioned before it was recommended.' },
  { name: 'Duplicate match', weight: 25, desc: 'The same implementing authority has more than one work with an identical description.' },
  { name: 'Stalled', weight: 20, desc: 'Still "Pending for Sanction" more than 365 days after being recommended.' },
  { name: 'Concentration', weight: 15, desc: 'One authority holds over 20% of all works in a state that has 100+ works overall.' },
  { name: 'Round-number amount', weight: 10, desc: 'Sanction amount is an exact multiple of ₹10 lakh.' },
];

export default function GlossaryModal() {
  const v = useVals();
  return (
    <>
    <div onClick={v.closeGlossary} style={{ position: "fixed", inset: "0", zIndex: "70", background: "rgba(19,26,34,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div onClick={v.stopProp} style={{ width: "100%", maxWidth: "640px", maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: "12px", background: "var(--card-bg)", boxShadow: "0 24px 48px -12px rgba(19,26,34,0.4)" }}>
        <div style={{ borderBottom: "1px solid var(--border-color)", padding: "24px 24px 16px" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Source Serif 4',serif", fontSize: "20px", fontWeight: "600", margin: "0", color: "var(--heading-color)" }}>
            Risk scoring glossary
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
            How works are checked, how a risk score is built from those checks, and how states get ranked.
          </p>
        </div>
        <div style={{ overflowY: "auto", padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: "13.5px", fontWeight: "700", color: "var(--heading-color)" }}>
              Risk score
            </h3>
            <p style={{ margin: "0", fontSize: "12.5px", lineHeight: "1.6", color: "var(--text-secondary)" }}>
              Every work is run through six checks. Each check that triggers adds its weight below; the total is capped at 100.
              A work is <b>flagged for review</b> at a score of <b>40</b> or higher, and marked <b>high-risk</b> at <b>75</b> or higher.
            </p>
          </div>
          <div style={{ borderRadius: "10px", border: "1px solid var(--border-color)", overflow: "hidden" }}>
            {CHECKS.map((c, i) => (
              <React.Fragment key={c.name}>
                <div style={{ display: "flex", gap: "12px", padding: "12px 14px", borderTop: i===0 ? "none" : "1px solid var(--border-color)" }}>
                  <div style={{ flexShrink: "0", width: "34px", textAlign: "right", fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
                    +{c.weight}
                  </div>
                  <div>
                    <div style={{ fontSize: "12.5px", fontWeight: "600", color: "var(--text-primary)" }}>
                      {c.name}
                    </div>
                    <div style={{ marginTop: "2px", fontSize: "11.5px", lineHeight: "1.5", color: "var(--text-muted)" }}>
                      {c.desc}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: "13.5px", fontWeight: "700", color: "var(--heading-color)" }}>
              How states are ranked
            </h3>
            <p style={{ margin: "0", fontSize: "12.5px", lineHeight: "1.6", color: "var(--text-secondary)" }}>
              States are sorted by their <b>count of flagged works</b> (score ≥ 40), highest first — not by average risk score,
              since a small state with a few very risky works can otherwise rank above a large state with many.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
