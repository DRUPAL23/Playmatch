'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type Match = { id: string; stakeMinor: string | number; state: string; table?: { label: string; venue?: { name: string } } | null; participants?: { user: { displayName: string } }[] };

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true);
    try { const r = await fetch(`${API}/matches/open`, { cache: 'no-store' }); setMatches(await r.json()); }
    catch { setMessage('API unavailable — showing demo shell.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function challenge(id: string) {
    setMessage('Demo challenge flow ready. Sign in as a second player to accept.');
    window.location.hash = `match-${id}`;
  }

  return <main className="shell">
    <header className="topbar"><strong>PLAYMATCH</strong><span>DEMO WALLET · KSh 2,450</span></header>
    <section className="hero"><p className="eyebrow">LIVE POOL NETWORK</p><h1>Play. Challenge. Win.</h1><p>Find verified live matches, join a table and compete head-to-head.</p><div className="hero-actions"><button onClick={load}>Refresh matches</button><span className="badge">REAL MONEY OFF</span></div></section>
    {message && <div className="notice">{message}</div>}
    <section><div className="section-title"><h2>Open challenges</h2><span>{loading ? 'Loading…' : `${matches.length} available`}</span></div>
      {matches.length === 0 && !loading && <div className="empty">No open matches yet. Create one from the demo API.</div>}
      {matches.map(m => <article className="match" key={m.id}><div><small>{m.table?.venue?.name ?? 'Venue'} · {m.table?.label ?? 'Open table'}</small><h3>{m.participants?.map(p => p.user.displayName).join(' vs ') || 'Player vs Open'}</h3><p>Pool · Demo stake KSh {Number(m.stakeMinor)}</p></div><button onClick={() => challenge(m.id)}>Challenge</button></article>)}
    </section>
    <section className="live-card"><div><span className="live-dot">● LIVE</span><h2>Live match room</h2><p>Realtime score and match events arrive through the secure match WebSocket.</p></div><button onClick={() => setMessage('Open a match to enter its live room.')}>View live</button></section>
    <nav className="nav"><span>Home</span><span>Matches</span><span>Live</span><span>Wallet</span><span>Profile</span></nav>
  </main>;
}
