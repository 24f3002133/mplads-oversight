import React from 'react';
import { useVals } from './state/useVals.js';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
const AppShell = React.lazy(() => import('./components/AppShell.jsx'));

export default function Root() {
  const v = useVals();
  return (
    <>
      <div style={{ minHeight: "100vh", background: "var(--page-bg)", fontFamily: "'IBM Plex Sans',-apple-system,sans-serif", color: "var(--text-primary)", fontSize: "15px", fontVariantNumeric: "tabular-nums" }}>
        {v.showLogin && <Login />}
        {v.showRegister && <Register />}
        {v.showApp && (
          <React.Suspense fallback={null}>
            <AppShell />
          </React.Suspense>
        )}
      </div>
    </>
  );
}
