import React from 'react';
import { Target, ArrowUpRight, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = ({ onBack, showBackButton = false }) => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50 px-6 py-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && onBack && (
            <motion.button
              onClick={onBack}
              className="mr-2 p-2 text-slate-500 hover:text-indigo hover:bg-indigo-50 rounded-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          )}
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo/25">
              <Target className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">
                Resume<span className="text-indigo">AI</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                AI-Powered ATS Scorer
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex items-center gap-2">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-indigo hover:bg-indigo-50 rounded-full transition-all"
          >
            GitHub
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <div className="h-4 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full text-[10px] font-bold text-green-600 uppercase tracking-widest border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </span>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
