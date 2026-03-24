import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { Card, VerdictPill, ChartTooltip } from '../components/UI';

const fu = (d=0) => ({ initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay:d} });

function avg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a,b) => a + b.value, 0) / arr.length);
}

export default function PredictionPage({ analysis, trends, navigate }) {
  if (!analysis) return (
    <div style={{ minHeight:'100vh', paddingTop:72, zIndex:1, position:'relative' }}>
      <div style={{ maxWidth:960, margin:'0 auto', padding:'3rem 2rem' }}>
        <p style={{ color:'var(--muted)' }}>No data. <button className="chip" onClick={()=>navigate('input')}>Analyze a skill</button></p>
      </div>
    </div>
  );

  const { skill, verdict, score, trajectory } = analysis;
  const trendData = trends?.trend_data || [];

  const historical = trendData.filter(d => d.type === 'historical');
  const future     = trendData.filter(d => d.type === 'future');

  // Combine into a unified chart dataset
  const combined = trendData.map(d => ({
    month: d.month,
    historical: d.type === 'historical' ? d.value : null,
    predicted:  d.type === 'future'     ? d.value : null,
  }));

  const histAvg = avg(historical);
  const futureAvg = avg(future);
  const delta = futureAvg - histAvg;

  const verdictColor = verdict === 'Future-Proof' ? '#10b981' : verdict === 'Evolving' ? '#f59e0b' : '#ef4444';
  const deltaColor   = delta >= 0 ? '#10b981' : '#ef4444';

  return (
    <div style={{ minHeight:'100vh', paddingTop:72, position:'relative', zIndex:1 }}>
      <div style={{ maxWidth:960, margin:'0 auto', padding:'3rem 2rem' }}>

        {/* Header */}
        <motion.div {...fu(0)} style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem' }}>
          <div>
            <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'2.5rem', letterSpacing:'-0.03em' }}>Prediction Timeline</h1>
            <p style={{ color:'var(--muted)', textTransform:'capitalize', marginTop:'0.35rem' }}>
              Past vs future for <strong style={{ color:'var(--accent)' }}>{skill}</strong>
            </p>
          </div>
          <button className="chip" onClick={() => navigate('results')}>← Results</button>
        </motion.div>

        {/* Verdict banner */}
        <motion.div {...fu(0.1)}>
          <Card style={{ padding:'1.5rem 2rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', background:'rgba(255,255,255,0.02)' }}>
            <div>
              <p style={{ color:'var(--muted)', fontSize:'0.78rem', marginBottom:'0.4rem', letterSpacing:'0.05em', textTransform:'uppercase' }}>Final Verdict</p>
              <VerdictPill verdict={verdict} />
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ color:'var(--muted)', fontSize:'0.78rem', marginBottom:'0.4rem' }}>12-Month Forecast</p>
              <p style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.4rem', color: score>=78?'#10b981':score>=50?'#f59e0b':'#ef4444' }}>
                {score >= 78 ? '↑ Strong Demand' : score >= 50 ? '→ Stable Demand' : '↓ Declining'}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Main timeline chart */}
        <motion.div {...fu(0.2)}>
          <Card style={{ padding:'1.5rem', marginBottom:'1.5rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', alignItems:'center', marginBottom:'1rem' }}>
              <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.1rem' }}>📅 24-Month Demand Timeline</div>
              <div style={{ display:'flex', gap:'1.5rem', fontSize:'0.8rem', color:'var(--muted)' }}>
                <span><span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:'#00e5ff', marginRight:6 }}/>Historical</span>
                <span><span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:'#7c3aed', marginRight:6 }}/>Predicted</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combined}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} interval={3} />
                <YAxis domain={[0,100]} tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine x="Feb '26" stroke="rgba(255,255,255,0.15)" strokeDasharray="5 4"
                  label={{ value:'NOW', fill:'#64748b', fontSize:10, position:'top' }} />
                <Line type="monotone" dataKey="historical" name="Historical" stroke="#00e5ff"
                  strokeWidth={2.5} dot={false} connectNulls={false} activeDot={{ r:4 }} />
                <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#7c3aed"
                  strokeWidth={2.5} dot={false} strokeDasharray="7 3" connectNulls={false} activeDot={{ r:4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Stats row */}
        <motion.div {...fu(0.3)} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
          {[
            { label:'Past 12mo Avg',    value:`${histAvg}/100`,   color:'var(--accent)' },
            { label:'Next 12mo Avg',    value:`${futureAvg}/100`, color:'var(--accent2)' },
            { label:'Δ Change',         value:`${delta >= 0 ? '+' : ''}${delta}`,  color:deltaColor },
            { label:'Trajectory',       value:trajectory,          color:'var(--text)' },
          ].map(s => (
            <Card key={s.label} style={{ padding:'1.25rem' }}>
              <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginBottom:'0.35rem' }}>{s.label}</div>
              <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.3rem', color:s.color, textTransform:'capitalize' }}>{s.value}</div>
            </Card>
          ))}
        </motion.div>

        {/* Interpretation */}
        <motion.div {...fu(0.4)}>
          <Card style={{ padding:'1.5rem', background:'rgba(124,58,237,0.04)', borderColor:'rgba(124,58,237,0.15)' }}>
            <h3 style={{ fontFamily:'Syne, sans-serif', fontWeight:700, marginBottom:'0.75rem' }}>🔭 Interpretation</h3>
            <p style={{ color:'var(--muted)', fontSize:'0.9rem', lineHeight:1.75 }}>
              Based on the 24-month trend analysis,{' '}
              <strong style={{ color:'var(--accent)', textTransform:'capitalize' }}>{skill}</strong>{' '}
              is projected to maintain a{' '}
              <strong style={{ color:verdictColor }}>{verdict.toLowerCase()}</strong>{' '}
              status over the next 12 months.
              {delta >= 2
                ? ` Demand is expected to grow by approximately ${delta} index points, signaling increasing market interest.`
                : delta <= -2
                ? ` Demand is expected to drop by approximately ${Math.abs(delta)} index points — consider upskilling in adjacent technologies.`
                : ` Demand is expected to remain relatively stable — a solid but not hyper-growing position in the market.`}
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}