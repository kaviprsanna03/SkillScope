"""
SkillScope - AI Skill Obsolescence Predictor
Flask Backend API
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import math
import time
import os
import json

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests from React frontend

# ─────────────────────────────────────────────
# Knowledge base: skill categories + metadata
# ─────────────────────────────────────────────
SKILL_DATA = {
    # AI/ML skills — very future-proof
    "machine learning": {"base_score": 92, "trajectory": "rising", "category": "AI/ML"},
    "deep learning": {"base_score": 90, "trajectory": "rising", "category": "AI/ML"},
    "llm": {"base_score": 97, "trajectory": "surging", "category": "AI/ML"},
    "prompt engineering": {"base_score": 85, "trajectory": "rising", "category": "AI/ML"},
    "mlops": {"base_score": 88, "trajectory": "rising", "category": "AI/ML"},
    "computer vision": {"base_score": 87, "trajectory": "rising", "category": "AI/ML"},
    "nlp": {"base_score": 89, "trajectory": "rising", "category": "AI/ML"},
    "tensorflow": {"base_score": 78, "trajectory": "stable", "category": "AI/ML"},
    "pytorch": {"base_score": 88, "trajectory": "rising", "category": "AI/ML"},
    "reinforcement learning": {"base_score": 83, "trajectory": "rising", "category": "AI/ML"},

    # Cloud/DevOps — strong demand
    "kubernetes": {"base_score": 88, "trajectory": "rising", "category": "DevOps"},
    "docker": {"base_score": 85, "trajectory": "stable", "category": "DevOps"},
    "aws": {"base_score": 87, "trajectory": "stable", "category": "Cloud"},
    "azure": {"base_score": 84, "trajectory": "rising", "category": "Cloud"},
    "gcp": {"base_score": 82, "trajectory": "rising", "category": "Cloud"},
    "terraform": {"base_score": 86, "trajectory": "rising", "category": "DevOps"},
    "ci/cd": {"base_score": 84, "trajectory": "stable", "category": "DevOps"},
    "devops": {"base_score": 83, "trajectory": "stable", "category": "DevOps"},
    "ansible": {"base_score": 72, "trajectory": "stable", "category": "DevOps"},

    # Web Development
    "react": {"base_score": 88, "trajectory": "stable", "category": "Frontend"},
    "vue": {"base_score": 76, "trajectory": "stable", "category": "Frontend"},
    "angular": {"base_score": 68, "trajectory": "declining", "category": "Frontend"},
    "next.js": {"base_score": 90, "trajectory": "rising", "category": "Frontend"},
    "typescript": {"base_score": 89, "trajectory": "rising", "category": "Frontend"},
    "javascript": {"base_score": 82, "trajectory": "stable", "category": "Frontend"},
    "html": {"base_score": 60, "trajectory": "stable", "category": "Frontend"},
    "css": {"base_score": 62, "trajectory": "stable", "category": "Frontend"},
    "tailwind": {"base_score": 85, "trajectory": "rising", "category": "Frontend"},
    "graphql": {"base_score": 78, "trajectory": "stable", "category": "Backend"},
    "node.js": {"base_score": 80, "trajectory": "stable", "category": "Backend"},
    "django": {"base_score": 72, "trajectory": "stable", "category": "Backend"},
    "flask": {"base_score": 70, "trajectory": "stable", "category": "Backend"},
    "fastapi": {"base_score": 83, "trajectory": "rising", "category": "Backend"},
    "rust": {"base_score": 85, "trajectory": "rising", "category": "Systems"},
    "go": {"base_score": 84, "trajectory": "rising", "category": "Backend"},
    "python": {"base_score": 90, "trajectory": "rising", "category": "General"},
    "java": {"base_score": 72, "trajectory": "stable", "category": "Backend"},
    "php": {"base_score": 45, "trajectory": "declining", "category": "Backend"},
    "ruby": {"base_score": 48, "trajectory": "declining", "category": "Backend"},
    "cobol": {"base_score": 15, "trajectory": "obsolete", "category": "Legacy"},
    "flash": {"base_score": 2, "trajectory": "obsolete", "category": "Legacy"},

    # Data
    "sql": {"base_score": 78, "trajectory": "stable", "category": "Data"},
    "spark": {"base_score": 80, "trajectory": "stable", "category": "Data"},
    "pandas": {"base_score": 82, "trajectory": "stable", "category": "Data"},
    "data science": {"base_score": 85, "trajectory": "rising", "category": "Data"},
    "data engineering": {"base_score": 87, "trajectory": "rising", "category": "Data"},
    "tableau": {"base_score": 68, "trajectory": "declining", "category": "Data"},
    "power bi": {"base_score": 72, "trajectory": "stable", "category": "Data"},
    "dbt": {"base_score": 83, "trajectory": "rising", "category": "Data"},

    # Emerging
    "web3": {"base_score": 55, "trajectory": "declining", "category": "Blockchain"},
    "blockchain": {"base_score": 52, "trajectory": "declining", "category": "Blockchain"},
    "solidity": {"base_score": 50, "trajectory": "declining", "category": "Blockchain"},
    "cybersecurity": {"base_score": 89, "trajectory": "rising", "category": "Security"},
    "zero trust": {"base_score": 86, "trajectory": "rising", "category": "Security"},
    "quantum computing": {"base_score": 70, "trajectory": "rising", "category": "Emerging"},
    "edge computing": {"base_score": 78, "trajectory": "rising", "category": "Emerging"},
    "iot": {"base_score": 74, "trajectory": "stable", "category": "Emerging"},
}

# Recommendation map: for a given skill, suggest related future-proof skills
RECOMMENDATIONS = {
    "AI/ML": ["MLOps", "LLM Fine-tuning", "AI Safety & Alignment", "Vector Databases", "Agentic AI Systems"],
    "Frontend": ["Next.js", "TypeScript", "Edge Functions", "Web Components", "AI-Powered UI"],
    "Backend": ["Rust", "Go", "FastAPI", "Event-Driven Architecture", "Serverless"],
    "DevOps": ["Platform Engineering", "FinOps", "GitOps", "Chaos Engineering", "AI-Assisted Ops"],
    "Cloud": ["Multi-Cloud Architecture", "Cloud FinOps", "Serverless", "Edge Computing", "Cloud Security"],
    "Data": ["dbt", "Data Mesh", "Real-Time Analytics", "Feature Engineering", "LLM Data Pipelines"],
    "Security": ["Zero Trust", "AI Security", "Cloud Security", "DEVSECOPS", "Threat Intelligence"],
    "Legacy": ["Python", "Cloud Migration", "API Modernization", "Microservices", "DevOps"],
    "Blockchain": ["AI Integration", "Cloud Architecture", "Data Engineering", "Cybersecurity", "Platform Engineering"],
    "General": ["AI/ML", "Cloud Architecture", "System Design", "Data Engineering", "DevSecOps"],
    "default": ["AI/ML Engineering", "Cloud Architecture", "Cybersecurity", "Data Engineering", "Platform Engineering"],
}

def normalize_skill(skill: str) -> str:
    """Normalize skill name for lookup."""
    return skill.lower().strip()

def get_skill_info(skill: str) -> dict:
    """Get skill data or generate defaults for unknown skills."""
    key = normalize_skill(skill)

    # Direct lookup
    if key in SKILL_DATA:
        return SKILL_DATA[key]

    # Partial match
    for k, v in SKILL_DATA.items():
        if k in key or key in k:
            return v

    # Unknown skill — generate plausible defaults
    seed = sum(ord(c) for c in key)
    random.seed(seed)
    base = random.randint(45, 80)
    trajectories = ["stable", "rising", "declining", "stable"]
    traj = trajectories[seed % len(trajectories)]
    return {"base_score": base, "trajectory": traj, "category": "General"}

def score_to_risk(score: int) -> str:
    """Convert numeric score to risk label."""
    if score >= 75:
        return "Low"
    elif score >= 50:
        return "Medium"
    else:
        return "High"

def generate_explanation(skill: str, score: int, risk: str, trajectory: str) -> str:
    """Generate a human-readable AI explanation."""
    skill_cap = skill.title()

    if trajectory == "surging":
        return (f"{skill_cap} is experiencing explosive growth driven by the generative AI revolution. "
                f"With a relevance score of {score}/100, demand is outpacing supply significantly. "
                f"Organizations across every industry are actively hiring for this skill, and the trajectory "
                f"shows no signs of plateauing. Investing deeply in {skill_cap} now offers exceptional ROI.")

    elif trajectory == "rising":
        return (f"{skill_cap} is on a strong upward trajectory with a relevance score of {score}/100. "
                f"Industry adoption is accelerating, and job postings continue to grow quarter over quarter. "
                f"Modern engineering teams increasingly require this skill, and it pairs well with AI/ML workloads. "
                f"Building expertise in {skill_cap} is a high-confidence career investment.")

    elif trajectory == "stable":
        return (f"{skill_cap} maintains steady demand with a relevance score of {score}/100. "
                f"While not experiencing hypergrowth, it remains deeply embedded in enterprise stacks and "
                f"hiring pipelines. The risk level is {risk.lower()} — this skill won't disappear soon, "
                f"but pairing it with emerging technologies will maximize your career optionality.")

    elif trajectory == "declining":
        return (f"{skill_cap} shows declining momentum with a relevance score of {score}/100. "
                f"Newer frameworks, tools, and paradigms are absorbing its market share. Job postings have "
                f"decreased over the past 18 months. While existing {skill_cap} engineers remain employed, "
                f"new entrants should prioritize transitioning to adjacent, higher-growth skills.")

    elif trajectory == "obsolete":
        return (f"{skill_cap} is effectively obsolete in the modern tech landscape (score: {score}/100). "
                f"This technology has been superseded by more capable, maintainable alternatives. "
                f"Continuing to invest time here carries significant career risk. We strongly recommend "
                f"an immediate skill pivot to relevant modern equivalents.")

    else:
        return (f"Analysis of {skill_cap} yields a relevance score of {score}/100 with {risk.lower()} risk. "
                f"This skill sits in an evolving space — continued monitoring is recommended as the market matures.")

def generate_trend_data(skill: str, base_score: int, trajectory: str) -> list:
    """
    Generate 24 months of simulated trend data (past 12 + future 12).
    Returns list of {month, value, type} dicts.
    """
    months_labels = [
        "Mar '25","Apr '25","May '25","Jun '25","Jul '25","Aug '25",
        "Sep '25","Oct '25","Nov '25","Dec '25","Jan '26","Feb '26",
        "Mar '26","Apr '26","May '26","Jun '26","Jul '26","Aug '26",
        "Sep '26","Oct '26","Nov '26","Dec '26","Jan '27","Feb '27",
    ]

    # Trajectory multipliers
    slopes = {
        "surging":  0.025,
        "rising":   0.012,
        "stable":   0.002,
        "declining": -0.015,
        "obsolete": -0.04,
    }
    slope = slopes.get(trajectory, 0.005)

    seed = sum(ord(c) for c in skill.lower())
    random.seed(seed)

    data = []
    val = max(10, base_score - 12 * abs(slope) * 100)

    for i, label in enumerate(months_labels):
        noise = random.uniform(-3, 3)
        val = val * (1 + slope) + noise
        val = max(5, min(100, val))
        is_future = i >= 12
        data.append({
            "month": label,
            "value": round(val, 1),
            "predicted": round(val * (1 + slope * 2 + random.uniform(-0.01, 0.01)), 1) if not is_future else None,
            "type": "future" if is_future else "historical",
        })

    return data

def get_verdict(score: int, trajectory: str) -> str:
    """Return final verdict string."""
    if score >= 78 and trajectory in ["rising", "surging", "stable"]:
        return "Future-Proof"
    elif score >= 50:
        return "Evolving"
    else:
        return "Obsolete Soon"

# ─────────────────────────────────────────────
# API Endpoints
# ─────────────────────────────────────────────

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "SkillScope API running", "version": "1.0.0"})


@app.route("/analyze", methods=["POST"])
def analyze():
    """
    POST /analyze
    Body: { "skill": "machine learning" }
    Returns: relevance score, risk level, explanation, verdict
    """
    data = request.get_json()
    if not data or "skill" not in data:
        return jsonify({"error": "Missing 'skill' in request body"}), 400

    skill = data["skill"].strip()
    if not skill:
        return jsonify({"error": "Skill cannot be empty"}), 400

    info = get_skill_info(skill)
    # Add slight randomness for realism
    score = min(100, max(1, info["base_score"] + random.randint(-3, 3)))
    risk = score_to_risk(score)
    trajectory = info["trajectory"]
    explanation = generate_explanation(skill, score, risk, trajectory)
    verdict = get_verdict(score, trajectory)

    return jsonify({
        "skill": skill,
        "score": score,
        "risk": risk,
        "trajectory": trajectory,
        "explanation": explanation,
        "verdict": verdict,
        "category": info["category"],
    })


@app.route("/trends", methods=["POST"])
def trends():
    """
    POST /trends
    Body: { "skill": "react" }
    Returns: 24 months of trend data (historical + future prediction)
    """
    data = request.get_json()
    if not data or "skill" not in data:
        return jsonify({"error": "Missing 'skill'"}), 400

    skill = data["skill"].strip()
    info = get_skill_info(skill)
    trend_data = generate_trend_data(skill, info["base_score"], info["trajectory"])

    return jsonify({
        "skill": skill,
        "trend_data": trend_data,
        "trajectory": info["trajectory"],
    })


@app.route("/recommend", methods=["POST"])
def recommend():
    """
    POST /recommend
    Body: { "skill": "php" }
    Returns: list of 5 recommended future-proof skills
    """
    data = request.get_json()
    if not data or "skill" not in data:
        return jsonify({"error": "Missing 'skill'"}), 400

    skill = data["skill"].strip()
    info = get_skill_info(skill)
    category = info.get("category", "General")

    recs = RECOMMENDATIONS.get(category, RECOMMENDATIONS["default"])

    # Build rich recommendation objects
    result = []
    for rec_skill in recs[:5]:
        rec_info = get_skill_info(rec_skill)
        result.append({
            "skill": rec_skill,
            "score": rec_info["base_score"],
            "trajectory": rec_info["trajectory"],
            "category": rec_info["category"],
            "why": f"High demand in the {rec_info['category']} space with {rec_info['trajectory']} trajectory.",
        })

    return jsonify({
        "input_skill": skill,
        "recommendations": result,
    })


@app.route("/skills", methods=["GET"])
def list_skills():
    """GET /skills — returns all known skill names (for autocomplete)."""
    return jsonify({"skills": sorted(SKILL_DATA.keys())})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 SkillScope API starting on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)