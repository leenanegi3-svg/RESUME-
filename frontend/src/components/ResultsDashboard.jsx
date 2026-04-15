import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { 
  CheckCircle2, 
  TrendingUp, 
  Info, 
  Sparkles, 
  Wand2, 
  AlertCircle, 
  FileDown, 
  LoaderCircle,
  Award,
  Target,
  Zap,
  ArrowUpRight,
  Star
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const ResultsDashboard = ({ result, isLoading }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const strengths = useMemo(() => result?.strengths ?? [], [result]);
  const missingKeywords = useMemo(() => result?.missing_keywords ?? [], [result]);
  const improvementTips = useMemo(() => result?.improvement_tips ?? [], [result]);

  const downloadPDF = async () => {
    if (!result || isExporting) {
      return;
    }

    try {
      setIsExporting(true);
      setExportError('');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;
      let cursorY = 20;

      const ensureSpace = (neededHeight = 8) => {
        if (cursorY + neededHeight > pageHeight - margin) {
          pdf.addPage();
          cursorY = 20;
        }
      };

      const addWrappedText = (text, options = {}) => {
        const {
          size = 11,
          color = '#475569',
          indent = 0,
          gapAfter = 6,
          maxWidth = contentWidth - indent,
          weight = 'normal',
        } = options;

        pdf.setFont('helvetica', weight);
        pdf.setFontSize(size);
        pdf.setTextColor(color);

        const lines = pdf.splitTextToSize(String(text ?? ''), maxWidth);
        const lineHeight = size * 0.45 + 1.8;
        ensureSpace(lines.length * lineHeight + gapAfter);
        pdf.text(lines, margin + indent, cursorY);
        cursorY += lines.length * lineHeight + gapAfter;
      };

      const addSectionTitle = (title) => {
        ensureSpace(12);
        pdf.setDrawColor('#e2e8f0');
        pdf.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 8;
        addWrappedText(title, {
          size: 13,
          color: '#0f172a',
          weight: 'bold',
          gapAfter: 5,
        });
      };

      const addBulletList = (items, emptyMessage) => {
        if (!items.length) {
          addWrappedText(emptyMessage, { size: 10.5, color: '#64748b' });
          return;
        }

        items.forEach((item) => {
          addWrappedText(`• ${item}`, {
            size: 10.5,
            color: '#334155',
            gapAfter: 4,
          });
        });
      };

      pdf.setFillColor(79, 70, 229);
      pdf.roundedRect(margin, 12, contentWidth, 22, 4, 4, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor('#ffffff');
      pdf.text('ATS Scorecard', margin + 6, 21);
      pdf.setFontSize(10);
      pdf.text(`Score: ${result.ats_score}%`, margin + 6, 28);
      cursorY = 44;

      addWrappedText(result.summary || 'No summary available.', {
        size: 11,
        color: '#475569',
        gapAfter: 8,
      });

      addSectionTitle('Strengths Identified');
      addBulletList(strengths, 'No standout strengths were returned for this scan.');

      addSectionTitle('Keyword Analysis');
      addBulletList(missingKeywords, 'No major keyword gaps detected.');

      addSectionTitle('Neural Recommendations');
      if (improvementTips.length) {
        improvementTips.forEach((tip, index) => {
          const [title, ...rest] = String(tip).split(':');
          const heading = rest.length ? title : `Recommendation ${index + 1}`;
          const body = rest.length ? rest.join(':').trim() : tip;
          addWrappedText(`${index + 1}. ${heading}`, {
            size: 11,
            color: '#0f172a',
            weight: 'bold',
            gapAfter: 2,
          });
          addWrappedText(body, {
            size: 10.5,
            color: '#475569',
            indent: 4,
            gapAfter: 5,
          });
        });
      } else {
        addWrappedText('No actionable recommendations were returned for this scan.', {
          size: 10.5,
          color: '#64748b',
        });
      }

      pdf.save(`ATS-Scorecard-${result.ats_score}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      setExportError('Could not generate the PDF. Please try downloading again.');
    } finally {
      setIsExporting(false);
    }
  };

  const SkeletonState = () => (
    <div className="relative h-full flex flex-col p-8 opacity-50 pointer-events-none select-none">
      <div className="flex items-center justify-between mb-10">
        <div className="flex-1 space-y-4">
          <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-16 w-full bg-slate-100 rounded-2xl animate-pulse" />
        </div>
        <div className="w-40 h-40 rounded-full border-8 border-slate-100 flex-shrink-0" />
      </div>
      <div className="grid grid-cols-2 gap-6 mb-10">
        <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
      <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
    </div>
  );

  if (!result && !isLoading) {
    return (
      <motion.div 
        className="relative h-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <SkeletonState />
        <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center p-8">
          <motion.div 
            className="p-8 text-center flex flex-col items-center gap-6 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-50 shadow-lg flex items-center justify-center text-indigo">
              <Target className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Analysis Awaits</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Upload your resume and paste the job description to see your comprehensive ATS compatibility report with AI-powered insights.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                ATS Score
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                Keyword Gaps
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                AI Tips
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div 
        className="h-full bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center justify-center p-12 text-center gap-8 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10"
        >
          <div className="w-28 h-28 border-[5px] border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-indigo" />
            </motion.div>
          </div>
        </motion.div>

        <div className="space-y-3 relative z-10">
          <h3 className="text-xl font-bold text-slate-900">AI Analyzing Your Resume</h3>
          <div className="flex flex-col gap-2 font-mono text-xs text-slate-500">
            <motion.p 
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Parsing resume content
            </motion.p>
            <motion.p 
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
              Calculating ATS score
            </motion.p>
            <motion.p 
              className="flex items-center justify-center gap-2 text-slate-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
              Generating recommendations
            </motion.p>
          </div>
        </div>
      </motion.div>
    );
  }

  const data = [
    { name: 'Match', value: result.ats_score },
    { name: 'Gap', value: 100 - result.ats_score },
  ];
  const colors = ['#4f46e5', 'rgba(79, 70, 229, 0.05)'];

  return (
    <motion.div
      className="linear-card h-full p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col gap-8 md:gap-10 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between xl:gap-10">
        <div className="flex-1">
          <div className="flex flex-col items-start gap-3 mb-4 sm:flex-row sm:items-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Analysis Verified
            </motion.div>

            <button
              onClick={downloadPDF}
              disabled={isExporting}
              className="no-print inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 hover:border-indigo-soft hover:text-indigo transition-all shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              {isExporting ? 'Preparing PDF...' : 'Download PDF'}
            </button>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4" style={{ color: '#0F172A' }}>
            ATS Scorecard
          </h2>
          <p className="text-sm font-medium text-slate-500 leading-relaxed italic border-l-4 pl-5" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>
            "{result.summary}"
          </p>
          {exportError ? (
            <p className="no-print mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              {exportError}
            </p>
          ) : null}
        </div>

        <div className="w-40 h-40 sm:w-44 sm:h-44 flex-shrink-0 relative self-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index]} cornerRadius={index === 0 ? 10 : 0} />
                ))}
                <Label
                  value={`${result.ats_score}%`}
                  position="center"
                  fill="#1e293b"
                  className="text-4xl font-extrabold tracking-tighter"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h4 className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 mb-5" style={{ color: '#64748B' }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: '#22C55E' }} />
            Strengths Identified
          </h4>
          <div className="space-y-2.5">
            {strengths.length ? strengths.map((strength, index) => (
              <motion.div
                key={`${strength}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 group transition-all"
                style={{ backgroundColor: '#F8FAFC', borderColor: '#F1F5F9' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4F46E5' }} />
                <span className="text-sm font-semibold text-slate-700" style={{ color: '#334155' }}>
                  {strength}
                </span>
              </motion.div>
            )) : (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-500">
                No standout strengths were returned for this scan.
              </div>
            )}
          </div>
        </section>

        <section>
          <h4 className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 mb-5" style={{ color: '#64748B' }}>
            <AlertCircle className="w-4 h-4" style={{ color: '#F59E0B' }} />
            Keyword Analysis
          </h4>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.length ? missingKeywords.map((keyword, index) => (
              <motion.span
                key={`${keyword}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + (index * 0.05) }}
                className="px-4 py-2 bg-white border rounded-xl text-xs font-bold"
                style={{ borderColor: '#E2E8F0', color: '#475569' }}
              >
                {keyword}
              </motion.span>
            )) : (
              <span className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                No major keyword gaps detected.
              </span>
            )}
          </div>
        </section>
      </div>

      <div className="p-6 md:p-8 rounded-[32px] relative overflow-hidden group" style={{ backgroundColor: '#F5F3FF', borderColor: '#DDD6FE', borderWidth: '1px' }}>
        <div className="absolute top-0 right-0 p-10 transition-all" style={{ color: '#4F46E5', opacity: 0.05 }}>
          <Wand2 className="w-24 h-24 rotate-[15deg]" />
        </div>

        <h4 className="text-sm font-extrabold uppercase tracking-[0.2em] flex items-center gap-2.5 mb-8 relative z-10" style={{ color: '#4F46E5' }}>
          <Info className="w-5 h-5" />
          Neural Recommendations
        </h4>
        <div className="grid grid-cols-1 gap-5 relative z-10">
          {improvementTips.length ? improvementTips.map((tip, index) => {
            const [title, ...rest] = tip.split(':');
            const formattedTip = rest.length ? rest.join(':').trim() : tip;

            return (
              <motion.div
                key={`${title}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="flex items-start gap-5 p-5 bg-white rounded-2xl border shadow-sm transition-all"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#EEF2FF', borderWidth: '1px' }}
              >
                <div className="mt-1 w-7 h-7 rounded-lg text-white flex items-center justify-center text-[10px] font-extrabold flex-shrink-0" style={{ backgroundColor: '#4F46E5' }}>
                  {index + 1}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5" style={{ color: '#0F172A' }}>
                    {rest.length ? title : 'Insight'}
                  </h5>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed" style={{ color: '#64748B' }}>
                    {formattedTip}
                  </p>
                </div>
              </motion.div>
            );
          }) : (
            <div className="rounded-2xl border border-white/80 bg-white px-5 py-6 text-sm font-medium text-slate-600">
              Improvement suggestions will appear here once the analysis returns actionable recommendations.
            </div>
          )}
        </div>
      </div>

      {/* Score Badge */}
      <motion.div 
        className="flex items-center justify-center gap-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
            <Award className="w-6 h-6 text-indigo" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-500 uppercase">ATS Score</p>
            <p className="text-2xl font-bold text-slate-900">{result.ats_score}%</p>
          </div>
        </div>
        <div className="w-px h-12 bg-indigo-200" />
        <div className="text-left">
          <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
          <p className={`text-sm font-bold ${result.ats_score >= 80 ? 'text-green-600' : result.ats_score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
            {result.ats_score >= 80 ? 'Excellent' : result.ats_score >= 60 ? 'Good' : 'Needs Work'}
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-auto pt-4 text-center no-print">
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo transition-all"
          whileHover={{ y: -2 }}
        >
          <ArrowUpRight className="w-4 h-4" />
          Back to top
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultsDashboard;
