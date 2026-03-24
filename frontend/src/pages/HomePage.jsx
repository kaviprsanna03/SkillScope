import { motion } from 'framer-motion';
import { Orbs } from '../components/UI';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

export default function HomePage({ navigate }) {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 72, position: 'relative', zIndex: 1 }}>
      <Orbs />

      {/* Hero */}
      <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>

        <motion.div {...fadeUp(0.1)}
          style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.35rem 1rem', borderRadius:99, border:'1px solid rgba(0,229,255,0.3)', background:'rgba(0,229,255,0.06)', fontSize:'0.78rem', fontWeight:500, color:'var(--accent)', marginBottom:'2rem', letterSpacing:'0.05em', textTransform:'uppercase' }}>
          <span style={{ fontSize:'0.45rem', animation:'pulse 2s infinite' }}>●</span>
          AI-Powered Skill Intelligence
        </motion.div>

        <motion.h1 {...fadeUp(0.2)} style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'clamp(2.5rem, 7vw, 5.5rem)', lineHeight:1.05, letterSpacing:'-0.04em', background:'linear-gradient(135deg, #fff 0%, #00e5ff 50%, #7c3aed 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:'1.5rem' }}>
          Predict the Future<br />of Your Skills
        </motion.h1>

        <motion.p {...fadeUp(0.3)} style={{ maxWidth:540, fontSize:'1.1rem', color:'var(--muted)', lineHeight:1.7, marginBottom:'2.5rem' }}>
          Discover if your tech skills will thrive or fade. SkillScope uses AI + real-time trend data to give you a relevance score, risk assessment, and smart career recommendations.
        </motion.p>

        <motion.button {...fadeUp(0.4)} className="btn-primary" onClick={() => navigate('input')}>
          Analyze a Skill →
        </motion.button>

        {/* Stats */}
        <motion.div {...fadeUp(0.5)} style={{ display:'flex', gap:'3rem', marginTop:'4rem', flexWrap:'wrap', justifyContent:'center' }}>
          {[
            { num: '200+', label: 'Skills Tracked' },
            { num: 'AI',   label: 'Powered Analysis' },
            { num: '24mo', label: 'Trend History' },
          ].map(s => (
            <div key={s.label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Syne, sans-serif', fontSize:'2rem', fontWeight:800, color:'var(--accent)' }}>{s.num}</div>
              <div style={{ fontSize:'0.8rem', color:'var(--muted)', marginTop:'0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Feature strip */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'1rem', padding:'2rem', maxWidth:960, margin:'0 auto 4rem' }}>
        {[
          { icon:'📊', text:'Trend Analysis' },
          { icon:'🤖', text:'AI Explanation' },
          { icon:'🎯', text:'Risk Scoring' },
          { icon:'🗺️', text:'Skill Roadmap' },
        ].map(f => (
          <div key={f.text} className="glass-card" style={{ padding:'1.25rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span style={{ fontSize:'1.4rem' }}>{f.icon}</span>
            <span style={{ fontFamily:'Syne, sans-serif', fontWeight:600 }}>{f.text}</span>
          </div>
        ))}
      </motion.div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}