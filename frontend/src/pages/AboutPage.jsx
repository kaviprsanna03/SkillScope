import { motion } from 'framer-motion';
import { Card } from '../components/UI';

const fu = (delay = 0) => ({ initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay} });

const features = [
  { icon:'📊', name:'Trend Analysis',    desc:'24-month historical + 12-month predicted demand powered by real search data.' },
  { icon:'🤖', name:'AI Explanation',    desc:'Natural language analysis of why a skill is rising, stable, or declining.' },
  { icon:'🎯', name:'Risk Scoring',      desc:'Low / Medium / High obsolescence risk based on trajectory and market velocity.' },
  { icon:'🔮', name:'Predictions',       desc:'ML-simulated future demand curves with interactive timeline visualization.' },
  { icon:'🗺️', name:'Skill Roadmap',    desc:'Personalized recommendations for adjacent, future-proof skills to learn next.' },
  { icon:'⚡', name:'Real-Time Data',    desc:'Data refreshed from job boards, GitHub trends, and search interest signals.' },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight:'100vh', paddingTop:72, position:'relative', zIndex:1 }}>
      <div style={{ maxWidth:800, margin:'0 auto', padding:'3rem 2rem' }}>

        <motion.h1 {...fu(0)} style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'2.5rem', letterSpacing:'-0.03em', marginBottom:'0.5rem' }}>
          About SkillScope
        </motion.h1>
        <motion.p {...fu(0.1)} style={{ color:'var(--muted)', marginBottom:'2.5rem' }}>
          AI-powered skill intelligence for the future of work
        </motion.p>

        <motion.div {...fu(0.2)}>
          <Card style={{ padding:'2rem', marginBottom:'1.5rem' }}>
            <h2 style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.3rem', marginBottom:'1rem' }}>What is SkillScope?</h2>
            <p style={{ color:'var(--muted)', lineHeight:1.8, marginBottom:'1rem' }}>
              SkillScope is an AI-powered tool that analyzes the future relevance of technical skills using trend data, job market signals, and machine learning models. In a world where technology evolves faster than ever, knowing which skills to invest in — and which to pivot away from — is a critical career advantage.
            </p>
            <p style={{ color:'var(--muted)', lineHeight:1.8 }}>
              We combine Google Trends data, industry research, and AI language models to compute a <strong style={{color:'var(--accent)'}}>Relevance Score (0–100)</strong>, Risk Level, and actionable recommendations for every skill you query.
            </p>
          </Card>
        </motion.div>

        <motion.div {...fu(0.3)}>
          <h2 style={{ fontFamily:'Syne, sans-serif', fontWeight:700, marginBottom:'1rem' }}>Core Features</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1rem' }}>
            {features.map((f, i) => (
              <motion.div key={f.name} {...fu(0.3 + i * 0.07)}>
                <Card style={{ padding:'1.5rem', height:'100%' }}>
                  <div style={{ fontSize:'1.8rem', marginBottom:'0.75rem' }}>{f.icon}</div>
                  <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, marginBottom:'0.4rem' }}>{f.name}</div>
                  <div style={{ fontSize:'0.85rem', color:'var(--muted)', lineHeight:1.6 }}>{f.desc}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fu(0.6)}>
          <Card style={{ padding:'2rem', marginTop:'1.5rem', background:'rgba(124,58,237,0.06)', borderColor:'rgba(124,58,237,0.2)' }}>
            <h3 style={{ fontFamily:'Syne, sans-serif', fontWeight:700, marginBottom:'0.75rem' }}>🛠 Tech Stack</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {['React + Vite','Framer Motion','Recharts','Flask (Python)','HuggingFace API','Pytrends','Tailwind CSS'].map(t => (
                <span key={t} className="chip" style={{ cursor:'default' }}>{t}</span>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}