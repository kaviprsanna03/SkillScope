import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import InputPage from './pages/InputPage';
import ResultsPage from './pages/ResultsPage';
import DashboardPage from './pages/DashboardPage';
import RecommendationsPage from './pages/RecommendationsPage';
import PredictionPage from './pages/PredictionPage';

/**
 * SkillScope — AI Skill Obsolescence Predictor
 * Root application component. Manages global state and client-side routing.
 */
export default function App() {
  // ── Simple string-based router ──
  const [page, setPage] = useState('home');

  // ── Global analysis state (shared across pages) ──
  const [analysis, setAnalysis]           = useState(null);
  const [trends, setTrends]               = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const navigate = (dest) => {
    setPage(dest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Shared props for pages that need analysis data
  const analysisProps = { analysis, trends, recommendations, navigate };
  const inputProps    = { navigate, setAnalysis, setTrends, setRecommendations };

  const renderPage = () => {
    switch (page) {
      case 'home':            return <HomePage navigate={navigate} />;
      case 'about':           return <AboutPage />;
      case 'input':           return <InputPage {...inputProps} />;
      case 'results':         return <ResultsPage {...analysisProps} />;
      case 'dashboard':       return <DashboardPage {...analysisProps} />;
      case 'recommendations': return <RecommendationsPage {...analysisProps} />;
      case 'prediction':      return <PredictionPage {...analysisProps} />;
      default:                return <HomePage navigate={navigate} />;
    }
  };

  return (
    <>
      <Navbar page={page} setPage={navigate} hasAnalysis={!!analysis} />
      {renderPage()}
    </>
  );
}