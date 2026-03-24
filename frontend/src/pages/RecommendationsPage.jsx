import { motion } from 'framer-motion';
import { Card, TrajTag } from '../components/UI';

const fu = (d=0) => ({ initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay:d} });

export default function RecommendationsPage({ recommendations, analysis, navigate }) {
  if (!recommendations) return (
    <div style={{ minHeight:'100vh', paddingTop:72, zIndex:1, position:'relative' }}>
      <div style={{ maxWidth:960, margin:'0 auto', padding:'3rem 2rem' }}>
        <p style={{ color:'var(--muted)' }}>No data. <button className="chip" onClick={()=>navigate('input')}>Analyze a skill</button></p>
      </div>
    </div>
  );

  const recs = recommendations.recommendations || [];

  return (
    <div style={{ minHeight:'100vh', paddingTop:72, position:'relative', zIndex:1 }}>
      <div style={{ maxWidth:960, margin:'0 auto', padding:'3rem 2rem' }}>

        <motion.div {...fu(0)} style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem' }}>
          <div>
            <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'2.5rem', letterSpacing:'-0.03em' }}>Skill Roadmap</h1>
            <p style={{ color:'var(--muted)', marginTop:'0.35rem' }}>
              Future-proof alternatives for{' '}
              <strong style={{ color:'var(--accent)', textTransform:'capitalize' }}>{analysis?.skill}</strong>
            </p>
          </div>
          <button className="chip" onClick={() => navigate('results')}>← Results</button>
        </motion.div>

        {/* Rec cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
          {recs.map((rec, i) => {
            const color = rec.score >= 80 ? '#10b981' : rec.score >= 60 ? '#00e5ff' : '#f59e0b';
            return (
              <motion.div key={rec.skill} {...fu(0.1 + i * 0.08)}>
                <Card style={{ padding:'1.5rem', cursor:'default', position:'relative', overflow:'hidden' }}>
                  {/* Subtle hover gradient */}
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(0,229,255,0.04), transparent)', opacity:0, transition:'opacity 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity=1}
                    onMouseLeave={e => e.currentTarget.style.opacity=0} />

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.4rem' }}>
                    <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.1rem' }}>{rec.skill}</div>
                    <span style={{ fontFamily:'Syne, sans-serif', fontWeight:700, color, fontSize:'1.15rem' }}>{rec.score}</span>
                  </div>

                  <TrajTag traj={rec.trajectory} />

                  {/* Score bar */}
                  <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:99, margin:'0.75rem 0' }}>
                    <motion.div
                      initial={{ width:0 }}
                      animate={{ width:`${rec.score}%` }}
                      transition={{ duration:0.9, delay:0.2 + i * 0.08, ease:'easeOut' }}
                      style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg, #00e5ff, #7c3aed)' }}
                    />
                  </div>

                  <p style={{ fontSize:'0.82rem', color:'var(--muted)', lineHeight:1.6, marginBottom:'0.75rem' }}>{rec.why}</p>
                  <div style={{ fontSize:'0.72rem', color:'var(--muted)' }}>Category: {rec.category}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Learning strategy tip */}
        <motion.div {...fu(0.6)}>
          <Card style={{ padding:'1.5rem', background:'rgba(0,229,255,0.03)', borderColor:'rgba(0,229,255,0.15)' }}>
            <h3 style={{ fontFamily:'Syne, sans-serif', fontWeight:700, marginBottom:'0.75rem' }}>💡 Learning Strategy</h3>
            <p style={{ color:'var(--muted)', fontSize:'0.9rem', lineHeight:1.7 }}>
              Focus on skills with <strong style={{color:'#10b981'}}>rising</strong> or <strong style={{color:'#10b981'}}>surging</strong> trajectory first.
              Pair your existing expertise in{' '}
              <strong style={{ color:'var(--accent)', textTransform:'capitalize' }}>{analysis?.skill}</strong>{' '}
              with 1–2 of these skills to maximize market differentiation. Prioritize scores above 80 for the best career ROI.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}