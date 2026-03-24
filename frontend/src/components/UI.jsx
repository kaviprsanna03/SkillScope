/**
 * Shared UI components for SkillScope
 */
import { motion } from 'framer-motion';

// ── Fade-up animation variant ──
export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay } }),
};

// ── Animated page wrapper ──
export function PageWrapper({ children }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: {} }}
      style={{ minHeight: '100vh', paddingTop: 72, position: 'relative', zIndex: 1 }}>
      {children}
    </motion.div>
  );
}

// ── Glass card ──
export function Card({ children, className = '', style = {}, ...props }) {
  return (
    <div className={`glass-card ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}

// ── Score ring SVG ──
export function ScoreRing({ score, size = 140 }) {
  const r     = (size / 2) - 12;
  const circ  = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          initial={{ strokeDasharray: circ, strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.3, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontSize: size === 140 ? '2.2rem' : '1.5rem', fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>score</span>
      </div>
    </div>
  );
}

// ── Risk badge ──
export function RiskBadge({ risk }) {
  const styles = {
    Low:    { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.25)', icon: '✓' },
    Medium: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)', icon: '⚠' },
    High:   { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.25)',  icon: '✕' },
  };
  const s = styles[risk] || styles.Medium;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 99,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: '0.8rem', fontWeight: 600 }}>
      {s.icon} {risk} Risk
    </span>
  );
}

// ── Verdict pill ──
export function VerdictPill({ verdict }) {
  const map = {
    'Future-Proof': { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
    'Evolving':     { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    'Obsolete Soon':{ bg: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
  };
  const s = map[verdict] || map['Evolving'];
  return (
    <span style={{ display: 'inline-block', padding: '6px 18px', borderRadius: 8,
      fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem',
      background: s.bg, color: s.color }}>
      {verdict}
    </span>
  );
}

// ── Spinner ──
export function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
        style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: 'var(--accent)' }} />
      <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: '1rem' }}>Running AI analysis...</p>
    </div>
  );
}

// ── Trajectory tag ──
export function TrajTag({ traj }) {
  const colors = { surging:'#10b981', rising:'#10b981', stable:'#00e5ff', declining:'#f59e0b', obsolete:'#ef4444' };
  return (
    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, color: colors[traj] || 'var(--muted)' }}>
      {traj}
    </span>
  );
}

// ── Custom chart tooltip ──
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
      <p style={{ color: '#64748b', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</strong></p>
      ))}
    </div>
  );
}

// ── Orbs ──
export function Orbs() {
  return (
    <>
      <div className="orb" style={{ width: 600, height: 600, background: '#7c3aed', top: -200, right: -200 }} />
      <div className="orb" style={{ width: 400, height: 400, background: '#00e5ff', bottom: -100, left: -100 }} />
    </>
  );
}