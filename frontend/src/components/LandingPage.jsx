import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap, 
  Target, 
  FileText, 
  BarChart3, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award,
  Brain,
  Clock,
  Lock
} from 'lucide-react';

const LandingPage = ({ onStartAnalyzing }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Analysis",
      description: "Neural engine trained on thousands of successful resumes to identify what recruiters actually look for."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "ATS Optimization",
      description: "Get past Applicant Tracking Systems with keyword matching and formatting recommendations."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Compatibility Score",
      description: "See exactly how well your resume matches the job description with detailed percentage breakdowns."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Insights",
      description: "Receive actionable recommendations in seconds, not hours. No waiting, no guessing."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Private & Secure",
      description: "Your resume data is encrypted and never stored. Complete privacy guaranteed."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Proven Results",
      description: "Users report 3x more interview callbacks after implementing our AI suggestions."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      description: "Drag and drop your PDF resume or click to browse files from your device."
    },
    {
      number: "02",
      title: "Paste Job Description",
      description: "Copy and paste the job posting you're targeting for precise compatibility analysis."
    },
    {
      number: "03",
      title: "Get AI Insights",
      description: "Our neural engine analyzes your resume and generates a comprehensive scorecard."
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo flex items-center justify-center text-white shadow-lg shadow-indigo/25">
              <Target className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Resume<span className="text-indigo">AI</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo transition-colors">How It Works</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-indigo transition-colors">Testimonials</a>
          </div>

          <motion.button
            onClick={onStartAnalyzing}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo text-white rounded-full font-semibold text-sm shadow-lg shadow-indigo/25 hover:bg-indigo-600 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Analyze Resume
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-50/80 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-indigo" />
                <span className="text-sm font-semibold text-indigo">AI-Powered Resume Analysis</span>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6"
              >
                Land your dream job with an{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo to-purple-600">
                  ATS-optimized
                </span>{" "}
                resume
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Our neural engine analyzes your resume against job descriptions to boost your interview chances by 3x. Get instant compatibility scores and actionable insights.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  onClick={onStartAnalyzing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo/25 hover:bg-indigo-600 transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze My Resume
                </motion.button>
                
                <a 
                  href="#how-it-works"
                  className="flex items-center gap-2 px-6 py-4 text-slate-600 font-semibold hover:text-indigo transition-colors"
                >
                  See How It Works
                  <ChevronRight className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                className="flex items-center gap-6 mt-10 justify-center lg:justify-start"
              >
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Free to use
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  No signup required
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Instant results
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Hero Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
                <div className="absolute -top-3 -right-3 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  92% Match
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Resume Analysis</h3>
                    <p className="text-sm text-slate-500">Software Engineer Position</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-medium text-slate-600">ATS Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[92%] h-full bg-gradient-to-r from-indigo to-purple-500 rounded-full" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">92%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-bold text-green-700 uppercase">Strengths</span>
                      </div>
                      <p className="text-sm text-green-800">Strong technical skills match</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-amber-700 uppercase">Gaps</span>
                      </div>
                      <p className="text-sm text-amber-800">Add cloud certifications</p>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-indigo" />
                      <span className="text-xs font-bold text-indigo uppercase">AI Recommendation</span>
                    </div>
                    <p className="text-sm text-slate-700">
                      "Consider adding AWS certification and quantifying your project impact with metrics."
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-slate-100"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Interview Rate</p>
                    <p className="text-lg font-bold text-slate-900">+147%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-100"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-purple-200 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-pink-200 border-2 border-white" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">10k+ users</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { value: "50K+", label: "Resumes Analyzed" },
              { value: "3x", label: "More Interviews" },
              { value: "98%", label: "Accuracy Rate" },
              { value: "2min", label: "Avg. Analysis Time" }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
              <Zap className="w-4 h-4 text-indigo" />
              <span className="text-sm font-semibold text-indigo">Powerful Features</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Everything you need to land interviews
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600">
              Our AI-powered platform provides comprehensive resume analysis with actionable insights.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-4">
              <Clock className="w-4 h-4 text-indigo" />
              <span className="text-sm font-semibold text-indigo">Simple Process</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Three steps to success
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600">
              Get your resume analyzed in less than 2 minutes
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative"
              >
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-full">
                  <span className="text-5xl font-extrabold text-indigo/10">{step.number}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-4 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={onStartAnalyzing}
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo/25 hover:bg-indigo-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Analyzing Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo to-purple-700" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
              Ready to boost your interview chances?
            </h2>
            <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of job seekers who have optimized their resumes with our AI. It's free, fast, and incredibly effective.
            </p>
            
            <motion.button
              onClick={onStartAnalyzing}
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo rounded-2xl font-bold text-lg shadow-xl hover:bg-slate-50 transition-all"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-5 h-5" />
              Analyze My Resume Free
            </motion.button>

            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-indigo-200 text-sm">
                <Lock className="w-4 h-4" />
                Private & Secure
              </div>
              <div className="flex items-center gap-2 text-indigo-200 text-sm">
                <Clock className="w-4 h-4" />
                Takes 2 minutes
              </div>
              <div className="flex items-center gap-2 text-indigo-200 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Free forever
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo flex items-center justify-center text-white">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">
                Resume<span className="text-indigo">AI</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-500">
              © 2026 ResumeAI. Built with precision for job seekers worldwide.
            </p>

            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-500 hover:text-indigo transition-colors">Privacy</a>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo transition-colors">Terms</a>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
