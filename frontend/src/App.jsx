import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import AnalyzerSection from './components/AnalyzerSection';
import ResultsDashboard from './components/ResultsDashboard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [view, setView] = useState('landing'); // 'landing' or 'analyzer'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async ({ file, jobDescription }) => {
    setLoading(true);
    setError('');

    if (window.innerWidth < 1024) {
      document.getElementById('results-view')?.scrollIntoView({ behavior: 'smooth' });
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (requestError) {
      console.error('Analysis Error:', requestError);
      setError(requestError.response?.data?.detail || 'Analysis failed. Please ensure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnalyzing = () => {
    setView('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setView('landing');
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Landing Page View
  if (view === 'landing') {
    return <LandingPage onStartAnalyzing={handleStartAnalyzing} />;
  }

  // Analyzer View
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary selection:bg-indigo/10 selection:text-indigo">
      <Header onBack={handleBackToLanding} showBackButton={true} />

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col gap-16">
        {/* Back Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleBackToLanding}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </motion.button>

        <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-6 py-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
          >
            Analyze your <span className="text-indigo">resume</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl font-medium text-slate-500 leading-relaxed max-w-2xl"
          >
            Upload your resume and paste the job description to get instant AI-powered insights and compatibility scoring.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Private & Encrypted
            </span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span>AI-Powered Insights</span>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-8 h-full">
            <AnalyzerSection onAnalyze={handleAnalyze} isLoading={loading} />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-semibold flex items-start gap-3 shadow-sm"
                >
                  <InlineAlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div id="results-view" className="lg:col-span-7 h-full min-h-[600px] xl:sticky xl:top-32">
            <ResultsDashboard result={result} isLoading={loading} />
          </div>
        </div>

        <div className="fixed top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo/[0.03] rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo/[0.02] rounded-full blur-[80px] -ml-40 -mb-40 pointer-events-none" />
      </main>

      <footer className="py-10 border-t border-gray-100 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>© 2026 AI Resume Analyzer</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Built with Precision</span>
          </div>
          <div className="flex items-center gap-8">
            <button 
              onClick={handleBackToLanding}
              className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo transition-colors"
            >
              Home
            </button>
            <a href="#" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo transition-colors flex items-center gap-1.5 group">
              Support
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const InlineAlertCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default App;
