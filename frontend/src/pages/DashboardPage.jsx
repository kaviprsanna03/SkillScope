import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, ChartTooltip } from '../components/UI';

const fu = (d=0) => ({ initial:{opacity:0,y:24}, animate:{opacity:1,y:0}, transition:{duration:0.5,delay:d} });

export default function DashboardPage({ analysis, trends, navigate }) {
  if (!analysis) return (
    <div style={{ minHeight:'100vh', paddingTop:72, zIndex:1, position:'relative' }}>
      <div style={{ maxWidth:960, margin:'0 auto', padding:'3rem 2rem' }}>
        <p style={{ color:'var(--muted)' }}>No data. <button className="chip" onClick={()=>navigate('input')}>Analyze a skill</button></p>
      </div>
    </div>
  );

  const { skill, score, risk, trajectory } = analysis;
  const trendData = trends?.trend_data || [];
  const historical = trendData.filter(d => d.type === 'historical');
  const barData = historical.slice(-6).map(d => ({ month: d.month.split(" ")[0], value: d.value }));

  const kpis = [
    { label:'Relevance Score', value:`${score}/100`, color: score>=75?'#10b981':score>=50?'#f59e0b':'#ef4444' },
    { label:'Risk Level',      value:risk,            color: risk==='Low'?'#10b981':risk==='Medium'?'#f59e0b':'#ef4444' },
    { label:'Trajectory',      value:trajectory,      color:'var(--accent)' },
    { label:'Data Points',     value:trendData.length,color:'var(--accent2)' },
  ];

  return (
    <div style={{ minHeight:'100vh', paddingTop:72, position:'relative', zIndex:1 }}>
      <div style={{ maxWidth:960, margin:'0 auto', padding:'3rem 2rem' }}>

        <motion.div {...fu(0)} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem' }}>
          <div>
            <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'2.5rem', letterSpacing:'-0.03em', textTransform:'capitalize' }}>{skill} Dashboard</h1>
            <p style={{ color:'var(--muted)' }}>Real-time demand metrics & trend analysis</p>
          </div>
          <button className="chip" onClick={() => navigate('results')}>← Results</button>
        </motion.div>

        {/* KPI row */}
        <motion.div {...fu(0.1)} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
          {kpis.map(k => (
            <Card key={k.label} style={{ padding:'1.25rem' }}>
              <div style={{ fontSize:'0.72rem', color:'var(--muted)', marginBottom:'0.4rem' }}>{k.label}</div>
              <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.4rem', color:k.color, textTransform:'capitalize' }}>{k.value}</div>
            </Card>
          ))}
        </motion.div>

        {/* Historical area chart */}
        <motion.div {...fu(0.2)}>
          <Card style={{ padding:'1.5rem', marginBottom:'1.5rem' }}>
            <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.1rem', marginBottom:'1.5rem' }}>📈 Historical Demand (12 months)</div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={historical}>
                <defs>
                  <linearGradient id="gH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00e5ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false} interval={2} />
                <YAxis domain={[0,100]} tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="value" name="Demand" stroke="#00e5ff" strokeWidth={2.5} fill="url(#gH)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Bar chart */}
        <motion.div {...fu(0.3)}>
          <Card style={{ padding:'1.5rem' }}>
            <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:'1.1rem', marginBottom:'1.5rem' }}>📊 Recent Monthly Demand Index</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fill:'#64748b', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" name="Demand" fill="#7c3aed" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}