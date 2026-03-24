/**
 * API utility — communicates with the Flask backend.
 * Falls back to mock data if the backend is offline.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Popular skills for quick-select chips
export const POPULAR_SKILLS = [
  'Machine Learning', 'React', 'Python', 'Kubernetes', 'Rust',
  'TypeScript', 'LLM', 'Data Engineering', 'Cybersecurity', 'PHP',
  'Docker', 'FastAPI', 'Web3', 'COBOL', 'Next.js',
];

// ─── Core fetch wrapper ───────────────────────────
async function post(endpoint, body) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    console.warn(`[SkillScope] Backend offline — using mock data for ${endpoint}`);
    return getMockData(endpoint, body);
  }
}

export const analyzeSkill  = (skill) => post('/analyze',   { skill });
export const fetchTrends   = (skill) => post('/trends',    { skill });
export const fetchRecs     = (skill) => post('/recommend', { skill });

export const fetchAllSkills = async () => {
  try {
    const res = await fetch(`${API_BASE}/skills`);
    return await res.json();
  } catch {
    return { skills: POPULAR_SKILLS.map(s => s.toLowerCase()) };
  }
};

// ─── Mock data (offline / demo mode) ─────────────
function getMockData(endpoint, body) {
  const skill = body?.skill || 'Unknown';
  const seed  = [...skill.toLowerCase()].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const score = Math.min(98, Math.max(8, (seed * 37 + 40) % 100));
  const risk  = score >= 75 ? 'Low' : score >= 50 ? 'Medium' : 'High';
  const traj  = score >= 85 ? 'surging' : score >= 72 ? 'rising' : score >= 55 ? 'stable' : score >= 35 ? 'declining' : 'obsolete';
  const verdict = score >= 78 ? 'Future-Proof' : score >= 50 ? 'Evolving' : 'Obsolete Soon';
  const cat   = 'General';

  const explanations = {
    surging:  `${skill} is experiencing explosive growth driven by the AI revolution. With a score of ${score}/100, demand far outpaces supply. Organizations everywhere are hiring — this is a premium investment.`,
    rising:   `${skill} shows strong upward momentum (score: ${score}/100). Industry adoption is accelerating and job postings continue growing. This is a high-confidence career investment.`,
    stable:   `${skill} maintains steady demand (score: ${score}/100). Deeply embedded in enterprise stacks. Pair it with emerging tech to maximize optionality.`,
    declining:`${skill} is losing ground (score: ${score}/100). Newer alternatives are absorbing market share. Consider pivoting to adjacent higher-growth skills.`,
    obsolete: `${skill} is effectively obsolete (score: ${score}/100). Superseded by modern alternatives. An immediate skill pivot is strongly recommended.`,
  };

  if (endpoint === '/analyze') {
    return { skill, score, risk, trajectory: traj, verdict, category: cat, explanation: explanations[traj] };
  }

  if (endpoint === '/trends') {
    const months = [
      "Mar '25","Apr '25","May '25","Jun '25","Jul '25","Aug '25",
      "Sep '25","Oct '25","Nov '25","Dec '25","Jan '26","Feb '26",
      "Mar '26","Apr '26","May '26","Jun '26","Jul '26","Aug '26",
      "Sep '26","Oct '26","Nov '26","Dec '26","Jan '27","Feb '27",
    ];
    const slopes = { surging:0.025, rising:0.012, stable:0.002, declining:-0.015, obsolete:-0.04 };
    const slope = slopes[traj] || 0.004;
    let val = score - 12 * Math.abs(slope) * 100;
    const rng = (n) => Math.sin(n * seed) * 2.5; // deterministic pseudo-random

    const trend_data = months.map((m, i) => {
      val = Math.max(5, Math.min(100, val * (1 + slope) + rng(i)));
      return { month: m, value: Math.round(val * 10) / 10, type: i >= 12 ? 'future' : 'historical' };
    });
    return { skill, trend_data, trajectory: traj };
  }

  if (endpoint === '/recommend') {
    const pools = {
      General: ['MLOps','Platform Engineering','Cloud Security','Data Engineering','Rust'],
      AI: ['LLM Fine-tuning','Vector Databases','AI Safety','MLOps','Agentic Systems'],
    };
    const rec_skills = pools.General;
    const recommendations = rec_skills.map((s, i) => ({
      skill: s, score: 78 + i * 3, trajectory: 'rising', category: 'Emerging',
      why: `High demand in the modern tech ecosystem with rising trajectory and strong hiring activity.`,
    }));
    return { input_skill: skill, recommendations };
  }
  return {};
}