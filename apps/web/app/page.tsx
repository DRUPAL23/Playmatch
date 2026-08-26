const matches = [
  { venue: 'Nairobi Pool Arena', table: 'T01', players: 'John vs Open', stake: 'KSh 500', status: 'Challenge' },
  { venue: 'Westlands Cue Club', table: 'T03', players: 'Brian vs Mike', stake: 'KSh 1,000', status: 'Live' },
];

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar"><strong>PLAYMATCH</strong><span>Wallet · KSh 2,450</span></header>
      <section className="hero"><p className="eyebrow">LIVE COMPETITION</p><h1>Play. Challenge. Win.</h1><p>Find verified live matches at nearby venues and compete head-to-head.</p></section>
      <section><div className="section-title"><h2>Live now</h2><span>View all</span></div>
        {matches.map((m) => <article className="match" key={m.table}><div><small>{m.venue} · {m.table}</small><h3>{m.players}</h3><p>Pool · Stake {m.stake}</p></div><button>{m.status}</button></article>)}
      </section>
      <nav className="nav"><span>Home</span><span>Matches</span><span>Live</span><span>Wallet</span><span>Profile</span></nav>
    </main>
  );
}