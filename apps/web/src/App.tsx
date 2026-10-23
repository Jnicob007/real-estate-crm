import React, { useEffect, useState } from 'react';
import { apiPaths } from '@real-estate-crm/api-contracts';
import type { RegisteredUser, UserRole } from '@real-estate-crm/shared-types';

type Notice = { kind: 'error' | 'success'; text: string };

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message ?? 'Nie udało się wykonać operacji. Spróbuj ponownie.');
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

const roleLabels: Record<UserRole, string> = {
  administrator: 'Administrator',
  manager: 'Kierownik',
  agent: 'Agent',
};

export default function App() {
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [bootstrapAvailable, setBootstrapAvailable] = useState(false);
  const [mode, setMode] = useState<'login' | 'bootstrap'>('login');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    let active = true;
    request<{ user: RegisteredUser }>(apiPaths.authMe)
      .then(({ user: currentUser }) => { if (active) setUser(currentUser); })
      .catch(() => {
        if (!active) return;
        setBootstrapAvailable(true);
        setMode('login');
      })
      .finally(() => { if (active) setCheckingSession(false); });
    return () => { active = false; };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    try {
      const path = mode === 'bootstrap' ? apiPaths.authBootstrap : apiPaths.authLogin;
      const body = mode === 'bootstrap'
        ? { email, password, firstName: String(data.get('firstName') ?? '').trim(), lastName: String(data.get('lastName') ?? '').trim() }
        : { email, password };
      const result = await request<{ user: RegisteredUser }>(path, { method: 'POST', body: JSON.stringify(body) });
      setUser(result.user);
      setNotice({ kind: 'success', text: mode === 'bootstrap' ? 'Konto administratora zostało utworzone.' : 'Zalogowano pomyślnie.' });
    } catch (error) {
      setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd.' });
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    setNotice(null);
    try {
      await request<void>(apiPaths.authLogout, { method: 'POST' });
      setUser(null);
      setNotice({ kind: 'success', text: 'Wylogowano.' });
    } catch (error) {
      setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Nie udało się wylogować.' });
    } finally {
      setBusy(false);
    }
  }

  if (checkingSession) return <main className="loading-screen" aria-live="polite">Sprawdzam sesję…</main>;

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Estate Desk — strona główna"><span className="brand-mark">E</span><span>estate<span className="brand-light">desk</span></span></a>
        <span className="topbar-note">PRZESTRZEŃ TWOJEGO BIURA</span>
      </header>
      <section className="content-grid">
        <div className="intro-panel">
          <div className="eyebrow"><span className="eyebrow-dot" /> SYSTEM ZARZĄDZANIA BIUREM</div>
          <h1>Każda relacja<br />zaczyna się <em>od miejsca.</em></h1>
          <p className="intro-copy">Jedna przestrzeń dla Twoich klientów, ofert i zespołu. Zaloguj się, by wrócić do pracy.</p>
          <div className="building-art" aria-hidden="true"><span className="sun" /><div className="tower tower-back"><i /><i /><i /><i /><i /><i /></div><div className="tower tower-front"><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="ground" /></div>
          <div className="intro-footer"><span>01</span><span className="footer-line" /><span>PRACA W DOBRYM MIEJSCU</span></div>
        </div>
        <div className="form-panel">
          <div className="form-card">
            <div className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 3.5 9.5V21h17V9.5L12 3Z"/><path d="M9 21v-7h6v7M3.5 10l8.5-6.5 8.5 6.5"/></svg></div>
            {user ? (
              <>
                <div className="eyebrow card-eyebrow">TWOJE KONTO</div>
                <h2>Witaj{user.employee?.firstName ? `, ${user.employee.firstName}` : ''}.</h2>
                <p className="form-description">Jesteś zalogowany do przestrzeni Estate Desk.</p>
                <div className="account-summary"><span className="avatar">{(user.employee?.firstName?.[0] ?? user.email[0]).toUpperCase()}</span><div><strong>{user.employee ? `${user.employee.firstName} ${user.employee.lastName}` : user.email}</strong><span>{roleLabels[user.role]} · {user.email}</span></div><span className="status-dot" title="Konto aktywne" /></div>
                {user.role === 'administrator' && <p className="admin-hint">Konta zespołu możesz tworzyć w panelu administratora przez <code>POST /api/users</code>.</p>}
                <button className="button button-secondary full-width" type="button" onClick={logout} disabled={busy}>{busy ? 'Wylogowywanie…' : 'Wyloguj się'}<span aria-hidden="true">↗</span></button>
              </>
            ) : (
              <>
                <div className="eyebrow card-eyebrow">{mode === 'bootstrap' ? 'KONFIGURACJA BIURA' : 'STREFA ZESPOŁU'}</div>
                <h2>{mode === 'bootstrap' ? 'Utwórz konto.' : 'Dobrze Cię widzieć.'}</h2>
                <p className="form-description">{mode === 'bootstrap' ? 'Załóż pierwsze konto administratora, aby rozpocząć pracę.' : 'Zaloguj się do swojego konta, aby kontynuować.'}</p>
                <form onSubmit={submit}>
                  {mode === 'bootstrap' && <div className="name-fields"><label>Imię<input name="firstName" autoComplete="given-name" required maxLength={100} placeholder="np. Anna" /></label><label>Nazwisko<input name="lastName" autoComplete="family-name" required maxLength={100} placeholder="np. Kowalska" /></label></div>}
                  <label>Adres e-mail<input name="email" type="email" autoComplete="email" required maxLength={255} placeholder="ty@biuro.pl" /></label>
                  <label>Hasło<input name="password" type="password" autoComplete={mode === 'bootstrap' ? 'new-password' : 'current-password'} required minLength={mode === 'bootstrap' ? 12 : 1} maxLength={128} placeholder={mode === 'bootstrap' ? 'Minimum 12 znaków, litera i cyfra' : 'Wpisz swoje hasło'} />{mode === 'bootstrap' && <span className="field-hint">Co najmniej 12 znaków, w tym litera i cyfra.</span>}</label>
                  {notice && <p className={`notice ${notice.kind}`} role="alert">{notice.text}</p>}
                  <button className="button button-primary full-width" type="submit" disabled={busy}>{busy ? 'Chwileczkę…' : mode === 'bootstrap' ? 'Utwórz konto administratora' : 'Zaloguj się'}<span aria-hidden="true">→</span></button>
                </form>
                {mode === 'login' && bootstrapAvailable && <button className="text-button" type="button" onClick={() => { setMode('bootstrap'); setNotice(null); }}>Pierwsze uruchomienie? <span>Utwórz konto administratora</span></button>}
                {mode === 'bootstrap' && <button className="text-button" type="button" onClick={() => { setMode('login'); setNotice(null); }}>Masz już konto? <span>Zaloguj się</span></button>}
                {mode === 'login' && !bootstrapAvailable && <p className="security-note"><span aria-hidden="true">⌑</span> Konta tworzy administrator biura.</p>}
              </>
            )}
          </div>
          <div className="form-footnote"><span>BEZPIECZNY DOSTĘP</span><span>·</span><span>REAL ESTATE CRM</span></div>
        </div>
      </section>
      <footer className="page-footer"><span>© {new Date().getFullYear()} ESTATE DESK</span><span>PRZESTRZEŃ DLA TWOJEGO ZESPOŁU</span></footer>
    </main>
  );
}
