import { motion } from 'framer-motion';

export default function Navbar({ page, setPage, hasAnalysis }) {
  const links = [
    { id: 'home',            label: 'Home' },
    { id: 'about',           label: 'About' },
    { id: 'input',           label: 'Analyze' },
    ...(hasAnalysis ? [
      { id: 'results',       label: 'Results' },
      { id: 'dashboard',     label: 'Dashboard' },
      { id: 'recommendations',label: 'Recommend' },
      { id: 'prediction',    label: 'Predict' },
    ] : []),
  ];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: 'rgba(7,11,20,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
      {/* Logo */}
      <button onClick={() => setPage('home')} style={{ background:'none', border:'none', cursor:'pointer',
        fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'1.25rem',
        color:'var(--accent)', letterSpacing:'-0.02em' }}>
        Skill<span style={{ color:'var(--text)' }}>Scope</span>
      </button>

      {/* Links */}
      <div style={{ display:'flex', gap:'0.25rem', flexWrap:'wrap' }}>
        {links.map(link => (
          <button key={link.id} onClick={() => setPage(link.id)}
            style={{
              background: page === link.id ? 'rgba(0,229,255,0.08)' : 'none',
              border: 'none', cursor: 'pointer',
              padding: '0.4rem 0.9rem', borderRadius: 6,
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', fontWeight: 500,
              color: page === link.id ? 'var(--accent)' : 'var(--muted)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (page !== link.id) { e.target.style.color = 'var(--text)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}}
            onMouseLeave={e => { if (page !== link.id) { e.target.style.color = 'var(--muted)'; e.target.style.background = 'none'; }}}
          >
            {link.label}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}