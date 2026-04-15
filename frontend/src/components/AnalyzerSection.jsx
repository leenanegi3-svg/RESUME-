import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  CloudUpload, 
  FileEdit, 
  CheckCircle2, 
  RotateCcw, 
  Zap, 
  Target, 
  FileText, 
  Sparkles,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnalyzerSection = ({ onAnalyze, isLoading }) => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [fileError, setFileError] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setFileError('');
    
    if (rejectedFiles.length > 0) {
      setFileError('Please upload a PDF file only.');
      return;
    }
    
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      if (uploadedFile.size > 10 * 1024 * 1024) {
        setFileError('File size must be less than 10MB.');
        return;
      }
      setFile(uploadedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const handleAnalyze = () => {
    if (file && jobDescription.trim()) {
      onAnalyze({ file, jobDescription: jobDescription.trim() });
    }
  };

  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const isReady = file && jobDescription.trim().length > 50;

  return (
    <motion.div 
      className="flex flex-col gap-6 md:gap-8 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 1. Drag & Drop Zone */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo text-white text-xs font-bold">1</div>
          Upload Resume (PDF)
        </label>
        
        <div 
          {...getRootProps()} 
          className={`relative h-56 border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer overflow-hidden group
            ${isDragActive && !isDragReject ? 'border-indigo bg-indigo-50 scale-[1.01]' : ''}
            ${isDragReject ? 'border-red-400 bg-red-50' : ''}
            ${!isDragActive && !file ? 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50' : ''}
            ${file ? 'border-green-400 bg-green-50/30' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <AnimatePresence mode='wait'>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="laser-line" 
              />
            )}
          </AnimatePresence>

          {!file ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
              >
                {isDragReject ? (
                  <AlertCircle className="w-8 h-8 text-red-500" />
                ) : (
                  <CloudUpload className="w-8 h-8" />
                )}
              </motion.div>
              <div>
                <p className={`text-base font-bold ${isDragReject ? 'text-red-600' : 'text-slate-800'}`}>
                  {isDragActive ? 'Drop your resume here' : isDragReject ? 'Invalid file type' : 'Drag & Drop Resume'}
                </p>
                <p className="text-sm text-slate-400 mt-1">or click to browse PDF files</p>
              </div>
              <span className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-medium text-slate-500 rounded-full">
                Max Size: 10MB • PDF only
              </span>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-5"
            >
              <div className="relative group">
                <motion.div 
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center text-green-600"
                  whileHover={{ rotate: 6, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FileText className="w-10 h-10" />
                </motion.div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center border-2 border-white shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5px]" />
                </motion.div>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-base font-bold text-slate-900 max-w-[260px] truncate">{file.name}</p>
                <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Ready for analysis
                </p>
              </div>
              <motion.button 
                onClick={(e) => { e.stopPropagation(); setFile(null); setFileError(''); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Change File
              </motion.button>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {fileError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p className="text-xs font-medium">{fileError}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Job Description Input */}
      <div className="flex flex-col gap-3 flex-grow">
        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo text-white text-xs font-bold">2</div>
          Target Job Description
        </label>
        
        <div className="relative">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job requirements, responsibilities, and qualifications here. The more details you provide, the better our AI can analyze your compatibility..."
            className="w-full flex-grow modern-input inner-shadow text-sm leading-relaxed p-5 resize-none min-h-[180px] md:min-h-[200px] pr-20"
          />
          <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
            <span className={`text-xs font-medium ${wordCount > 50 ? 'text-green-600' : 'text-slate-400'}`}>
              {wordCount} words
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            {jobDescription.trim().length > 0 && jobDescription.trim().length < 50 && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Add at least 50 characters for better results
              </span>
            )}
            {wordCount >= 50 && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-green-600 flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3" />
                Good amount of detail
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Sparkles className="w-3 h-3 text-amber-400" />
            AI-Powered Analysis
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <AnimatePresence>
        {isReady && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Ready to analyze</p>
              <p className="text-xs text-green-600">Click the button below to start</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Analyze Button */}
      <motion.button
        disabled={isLoading || !file || !jobDescription.trim()}
        onClick={handleAnalyze}
        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 group transition-all relative overflow-hidden
          ${isLoading || !file || !jobDescription.trim() 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
            : 'bg-gradient-to-r from-indigo to-purple-600 text-white shadow-xl shadow-indigo/25 hover:shadow-indigo/40 active:scale-[0.98]'}
        `}
        whileHover={!isLoading && file && jobDescription.trim() ? { scale: 1.01 } : {}}
        whileTap={!isLoading && file && jobDescription.trim() ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode='wait'>
          {isLoading ? (
            <motion.div 
              key="loading" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="uppercase tracking-wider text-sm">AI Analyzing...</span>
            </motion.div>
          ) : (
            <motion.div 
              key="ready" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span className="uppercase tracking-wider text-sm">Analyze Resume</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default AnalyzerSection;
