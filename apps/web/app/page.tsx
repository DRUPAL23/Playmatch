'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

type Match = { id: string; stakeMinor: string | number; state: string; participants: { user: { displayName: string } }[]; table?: { label: string; venue: { name: string } } | null };

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [stake, setStake] = useState(500);
  const [status, setStatus] = useState('Sandbox mode · demo credits only');

  async function load() {
    try { const r = await fetch(`${API}/matches/open`, { cache: 'no-store' }); if (r.ok) setMatches(await r.json()); } catch { setStatus('API offline · start the backend to play'); }
  }
  useEffect(() => { load(); }, []);

  async function createChallenge() {
    setStatus('Creating sandbox challenge…');
    const r = await fetch(`${API}/matches`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ challengerId: 'demo-alice', stakeMinor: stake }) });
    setStatus(r.ok ? 'Challenge created' : 'Create failed — bootstrap demo data first');
    load();
  }

  return <main className="shell">
    <header className="topbar"><strong>PLAYMATCH</strong><span>Wallet · DEMO</span></header>
    <section className="hero"><p className="eyebrow">LIVE COMPETITION</p><h1>Play. Challenge. Win.</h1><p>Find verified live matches and compete head-to-head. Real-money wagering is disabled in this build.</p><div className="actions"><input aria-label="stake" type="number" min="100" step="100" value={stake} onChange={e => setStake(Number(e.target.value))}/><button onClick={createChallenge}>Create challenge</button></div><small>{status}</small></section>
    <section><div className="section-title"><h2>Open matches</h2><button className="ghost" onClick={load}>Refresh</button></div>
      {matches.length === 0 ? <div className="empty">No open sandbox matches yet.</div> : matches.map(m => <article className="match" key={m.id}><div><small>{m.table?.venue.name ?? 'Venue'} · {m.table?.label ?? 'Open table'}</small><h3>{m.participants[0]?.user.displayName ?? 'Player'} vs Open</h3><p>Pool · Stake KSh {Number(m.stakeMinor).toLocaleString()}</p></div><button>Challenge</button></article>)}
    </section>
    <nav className="nav"><span>Home</span><span>Matches</span><span>Live</span><span>Wallet</span><span>Profile</span></nav>
  </main>;
}
