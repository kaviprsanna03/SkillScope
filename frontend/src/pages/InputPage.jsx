import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Spinner } from '../components/UI';
import { analyzeSkill, fetchTrends, fetchRecs, POPULAR_SKILLS } from '../utils/api';

const fu = (d=0) => ({ initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay:d} });

export default function InputPage({ navigate, setAnalysis, setTrends, setRecommendations }) {
  const [skill, setSkill]   = useState('');
  const [loading, setLoading] = useState('');
  const [error, setError]   = useState('');

  const run = async (s) => {
    const val = (s || skill).trim();
    if (!val) { setError('Please enter a skill name.'); return; }
    setError('');
    setLoading('Analyzing skill with AI...');

    try {
      setLoading('Running trend analysis...');
      const [analysis, trendsData, recs] = await Promise.all([
        analyzeSkill(val),
        fetchTrends(val),
        fetchRecs(val),
      ]);
      setAnalysis(analysis);
      setTrends(trendsData);
      setRecommendations(recs);
      navigate('results');
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div style={{ minHeight:'100vh', paddingTop:72, position:'relative', zIndex:1 }}>
      <div style={{ maxWidth:680, margin:'0 auto', padding:'3rem 2rem' }}>

        <motion.h1 {...fu(0)} style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'2.5rem', letterSpacing:'-0.03em', marginBottom:'0.5rem' }}>
          Analyze a Skill
        </motion.h1>
        <motion.p {...fu(0.1)} style={{ color:'var(--muted)', marginBottom:'2.5rem' }}>
          Enter any technical skill to get your AI-powered obsolescence report
        </motion.p>

        <motion.div {...fu(0.2)}>
          <Card style={{ padding:'2rem' }}>
            {/* Input row */}
            <div style={{ display:'flex', gap:'0.75rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'0.5rem 0.5rem 0.5rem 1.25rem', transition:'border-color 0.3s' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
              <input
                type="text" value={skill} placeholder="e.g. Machine Learning, React, COBOL..."
                onChange={e => setSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && run()}
                disabled={!!loading}
                style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:'DM Sans, sans-serif', fontSize:'1rem', color:'var(--text)' }}
              />
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="btn-primary"
                style={{ padding:'0.6rem 1.5rem', fontSize:'0.9rem', opacity: loading ? 0.7 : 1 }}
                onClick={() => !loading && run()}
                disabled={!!loading}>
                {loading ? 'Analyzing...' : 'Analyze →'}
              </motion.button>
            </div>

            {error && (
              <motion.p initial={{opacity:0}} animate={{opacity:1}} style={{ color:'var(--red)', marginTop:'0.75rem', fontSize:'0.9rem' }}>
                ⚠ {error}
              </motion.p>
            )}

            {loading && <Spinner />}
          </Card>
        </motion.div>

        {/* Popular chips */}
        <motion.div {...fu(0.3)}>
          <p style={{ color:'var(--muted)', fontSize:'0.82rem', marginTop:'1.5rem', marginBottom:'0.75rem' }}>🔥 Popular searches</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
            {POPULAR_SKILLS.map(s => (
              <motion.button key={s} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="chip" onClick={() => !loading && run(s)} disabled={!!loading}>
                {s}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Info box */}
        <motion.div {...fu(0.4)} style={{ marginTop:'2rem' }}>
          <Card style={{ padding:'1.25rem', background:'rgba(0,229,255,0.03)', borderColor:'rgba(0,229,255,0.12)' }}>
            <p style={{ fontSize:'0.85rem', color:'var(--muted)', lineHeight:1.7 }}>
              💡 <strong style={{color:'var(--text)'}}>How it works:</strong> We cross-reference Google Trends data, job market signals, and AI analysis to compute a relevance score and forecast demand for any technical skill over the next 12 months.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}