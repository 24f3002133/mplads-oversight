import React from 'react';
import { useVals } from '../state/useVals.js';


export default function Register() {
  const v = useVals();
  return (
    <>
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0e1a2e", overflow: "hidden" }}>
      <div style={{ height: "5px", display: "flex", flexShrink: "0" }}>
        <div style={{ flex: "1", background: "#FF9933" }} />
        <div style={{ flex: "1", background: "#FFFFFF" }} />
        <div style={{ flex: "1", background: "#138808" }} />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", inset: "0", top: "5px", background: "radial-gradient(circle at 82% 18%, rgba(255,153,51,0.16), transparent 42%), radial-gradient(circle at 12% 85%, rgba(19,136,8,0.16), transparent 45%), linear-gradient(160deg, #0e1a2e 0%, #16273f 55%, #0e1a2e 100%)" }} />
      <svg aria-hidden="true" viewBox="0 0 200 200" style={{ position: "absolute", right: "-60px", top: "-60px", width: "420px", height: "420px", opacity: "0.08" }}>
        <circle cx="100" cy="100" r="92" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="100" cy="100" r="6" fill="#fff" />
        {(v.chakraSpokes ?? []).map((sp, spIndex) => (
          <React.Fragment key={spIndex}>
            <line x1="100" y1="100" x2={sp.x} y2={sp.y} stroke="#fff" strokeWidth="1.5" />
          </React.Fragment>
        ))}
      </svg>
      <header style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px", padding: "18px 32px", flexShrink: "0" }}>
        <div style={{ display: "flex", width: "38px", height: "38px", alignItems: "center", justifyContent: "center", borderRadius: "999px", border: "2px solid rgba(255,255,255,0.7)", flexShrink: "0" }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="1.4">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
            <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
            भारत सरकार · Government of India
          </div>
          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "14px", fontWeight: "600", color: "#fff" }}>
            National Portal · MPLADS Public Oversight Network
          </div>
        </div>
      </header>
      <div style={{ position: "relative", flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: "100%", maxWidth: "920px", borderRadius: "16px", overflow: "hidden", border: "1px solid #D6DCD3", background: "#fff", boxShadow: "0 24px 48px -24px rgba(19,26,34,0.35)" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#1b3a6b", padding: "40px", color: "#FAFBF9" }}>
            <div>
              <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "20px", fontWeight: "700" }}>
                MPLADS Oversight
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(250,251,249,0.7)" }}>
                National fraud-detection &amp; fund-flow monitor
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ borderRadius: "8px", background: "rgba(255,255,255,0.1)", padding: "16px" }}>
                <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "30px", fontWeight: "700" }}>
                  14,208
                </div>
                <div style={{ fontSize: "12.5px", color: "rgba(250,251,249,0.7)" }}>
                  Works monitored nationwide
                </div>
              </div>
              <div style={{ borderRadius: "8px", background: "rgba(255,255,255,0.1)", padding: "16px" }}>
                <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: "30px", fontWeight: "700", color: "#f2a6b2" }}>
                  1,243
                </div>
                <div style={{ fontSize: "12.5px", color: "rgba(250,251,249,0.7)" }}>
                  Currently flagged for review
                </div>
              </div>
            </div>
            <p style={{ fontSize: "11.5px", color: "rgba(250,251,249,0.57)", margin: "0" }}>
              Data through 31 August 2026 · Central Vigilance Cell
            </p>
          </div>
          <div style={{ padding: "40px", color: "#131A22" }}>
            <h1 style={{ fontFamily: "'Source Serif 4',serif", fontSize: "24px", fontWeight: "600", margin: "0", color: "#131A22" }}>
              Register your account
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "#4A555F" }}>
              Your dashboard will auto-scope to the state &amp; district you register.
            </p>
            {v.showRegToast && (
              <>
              <div style={{ marginTop: "16px", borderRadius: "6px", border: "1px solid #059669", background: "#D1FAE5", padding: "10px 14px", fontSize: "12.5px", fontWeight: "600", color: "#059669" }}>
                {v.regToastMsg}
              </div>
              </>
            )}
            <form onSubmit={v.handleRegisterSubmit} style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#131A22" }}>
                  Full name
                </label>
                <input value={v.regFullName} onChange={v.setRegFullName} placeholder="Anagha Kulkarni" required="" style={{ display: "block", marginTop: "6px", width: "100%", height: "36px", borderRadius: "6px", border: "1px solid #D6DCD3", padding: "0 10px", fontSize: "13.5px", fontFamily: "inherit", background: "#fff", color: "#131A22" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#131A22" }}>
                  Official email
                </label>
                <input type="email" value={v.regEmail} onChange={v.setRegEmail} placeholder="you@nic.gov.in" required="" style={{ display: "block", marginTop: "6px", width: "100%", height: "36px", borderRadius: "6px", border: "1px solid #D6DCD3", padding: "0 10px", fontSize: "13.5px", fontFamily: "inherit", background: "#fff", color: "#131A22" }} />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: "500", color: "#131A22" }}>
                  Role
                </label>
                <select value={v.regRole} onChange={v.setRegRole} style={{ display: "block", marginTop: "6px", width: "100%", height: "36px", borderRadius: "6px", border: "1px solid #D6DCD3", padding: "0 8px", fontSize: "13.5px", fontFamily: "inherit", background: "#fff", color: "#131A22" }}>
                  {(v.roleOptions ?? []).map((r, rIndex) => (
                    <React.Fragment key={rIndex}>
                      <option value={r}>
                        {r}
                      </option>
                    </React.Fragment>
                  ))}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "500", color: "#131A22" }}>
                    Assigned state
                  </label>
                  <select value={v.regState} onChange={v.setRegState} style={{ display: "block", marginTop: "6px", width: "100%", height: "36px", borderRadius: "6px", border: "1px solid #D6DCD3", padding: "0 8px", fontSize: "13.5px", fontFamily: "inherit", background: "#fff", color: "#131A22" }}>
                    {(v.stateNameOptions ?? []).map((s, sIndex) => (
                      <React.Fragment key={sIndex}>
                        <option value={s}>
                          {s}
                        </option>
                      </React.Fragment>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "13px", fontWeight: "500", color: "#131A22" }}>
                    Assigned district
                  </label>
                  <select value={v.regDistrict} onChange={v.setRegDistrict} style={{ display: "block", marginTop: "6px", width: "100%", height: "36px", borderRadius: "6px", border: "1px solid #D6DCD3", padding: "0 8px", fontSize: "13.5px", fontFamily: "inherit", background: "#fff", color: "#131A22" }}>
                    {(v.regDistrictOptions ?? []).map((d, dIndex) => (
                      <React.Fragment key={dIndex}>
                        <option value={d}>
                          {d}
                        </option>
                      </React.Fragment>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={v.regSubmitting} style={{ marginTop: "8px", width: "100%", height: "38px", borderRadius: "6px", border: "none", background: "#1b3a6b", color: "#FAFBF9", fontWeight: "600", fontSize: "13.5px", cursor: "pointer" }}>
                {v.regButtonLabel}
              </button>
            </form>
            <p style={{ marginTop: "24px", fontSize: "13px", color: "#4A555F" }}>
              Already registered?
              <a href="#" onClick={v.gotoLogin} style={{ fontWeight: "500" }}>
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
