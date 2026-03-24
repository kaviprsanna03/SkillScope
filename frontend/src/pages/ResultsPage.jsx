import { motion } from 'framer-motion';
import { Card, ScoreRing, RiskBadge, VerdictPill } from '../components/UI';

const fu = (d=0) => ({ initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay:d} });

export default function ResultsPage({ analysis, navigate }) {
  if (!analysis) return (
    <div style={{ minHeight:'100vh', paddingTop:72, zIndex:1, position:'relative' }}>
      <div style={{ maxWidth:860, margin:'0 auto', padding:'3rem 2rem' }}>
        <p style={{ color:'var(--muted)' }}>No analysis data.{' '}
          <button className="chip" onClick={() => navigate('input')}>Run a new analysis</button>
        </p>
      </div>
    </div>
  );

  const { skill, score, risk, trajectory, explanation, verdict, category } = analysis;

  const quickNav = [
    { label:'📊 Dashboard',       page:'dashboard' },
    { label:'🔮 Predictions',      page:'prediction' },
    { label:'🗺️ Recommendations', page:'recommendations' },
  ];

  return (
    <div style={{ minHeight:'100vh', paddingTop:72, position:'relative', zIndex:1 }}>
      <div style={{ maxWidth:860, margin:'0 auto', padding:'3rem 2rem' }}>

        <motion.div {...fu(0)}>
          <button className="chip" onClick={() => navigate('input')} style={{ marginBottom:'1.5rem' }}>← New Analysis</button>
        </motion.div>

        <motion.h1 {...fu(0.1)} style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'2.5rem', letterSpacing:'-0.03em', textTransform:'capitalize', marginBottom:'0.35rem' }}>
          {skill}
        </motion.h1>
        <motion.p {...fu(0.15)} style={{ color:'var(--muted)', marginBottom:'2rem' }}>
          Category: {category} · Trajectory: <span style={{ textTransform:'capitalize', color:'var(--accent)' }}>{trajectory}</span>
        </motion.p>

        {/* Main result card */}
        <motion.div {...fu(0.2)}>
          <Card style={{ marginBottom:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'3rem', padding:'2rem', flexWrap:'wrap' }}>
              <ScoreRing score={score} />
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'0.75rem' }}>
                  <RiskBadge risk={risk} />
                  <VerdictPill verdict={verdict} />
                </div>
                <h3 style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.1rem', marginBottom:'0.6rem' }}>
                  Relevance Score: {score}/100
                </h3>
                <p style={{ color:'var(--muted)', fontSize:'0.9rem', lineHeight:1.7 }}>{explanation}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Metric strip */}
        <motion.div {...fu(0.3)} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
          {[
            { label:'Score',      value:`${score}/100`,  color: score>=75?'#10b981':score>=50?'#f59e0b':'#ef4444' },
            { label:'Risk',       value:risk,            color: risk==='Low'?'#10b981':risk==='Medium'?'#f59e0b':'#ef4444' },
            { label:'Trajectory', value:trajectory,      color:'var(--accent)' },
            { label:'Verdict',    value:verdict,         color:'var(--accent2)' },
          ].map(m => (
            <Card key={m.label} style={{ padding:'1.25rem' }}>
              <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginBottom:'0.35rem' }}>{m.label}</div>
              <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.1rem', color:m.color, textTransform:'capitalize' }}>{m.value}</div>
            </Card>
          ))}
        </motion.div>

        {/* Quick nav */}
        <motion.div {...fu(0.4)} style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
          {quickNav.map(({ label, page }) => (
            <motion.button key={page} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              className="glass-card chip" onClick={() => navigate(page)}
              style={{ padding:'0.75rem 1.5rem', fontSize:'0.9rem', color:'var(--text)', borderRadius:12 }}>
              {label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}