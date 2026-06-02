import React, { useState, useEffect } from 'react';
import { Compass, Trophy, Target, TrendingUp, UserPlus, Zap, ArrowRight, Flame, ChevronRight, LayoutList, BookOpen, Brain, BookMarked, Fingerprint, Network, Route } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import BrandLogo from '../components/BrandLogo';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);

  const [currentRoleIdx, setCurrentRoleIdx] = useState(0);
  const roles = [
    "Product Manager",
    "Financial Analyst",
    "Graphic Designer",
    "Marketing Director",
    "Nurse Practitioner",
    "HR Specialist",
    "Operations Manager",
    "Content Strategist"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIdx((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mesh-gradient-theme overflow-hidden w-full font-poppins selection:bg-[var(--accent-primary-subtle)]">
      {/* Premium Noise Overlay */}
      <div className="absolute inset-0 noise-overlay opacity-[0.05] pointer-events-none z-0" />

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--accent-primary)12_1px,transparent_1px),linear-gradient(to_bottom,var(--accent-primary)12_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* TailBot Style Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[10%] w-[800px] h-[800px] bg-[var(--accent-primary-subtle)] rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-[var(--accent-primary-subtle)] rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-[var(--accent-primary-glow)] rounded-full blur-[130px]"
        />
      </div>

      {/* Hero Section - Majestic Cyan Dark Layout */}
      <section className="relative w-full max-w-7xl mx-auto px-6 md:px-10 pt-24 sm:pt-32 md:pt-36 pb-16 flex flex-col md:flex-row items-center gap-12 sm:gap-16 z-10">

        {/* Left Side: Text Content */}
        <div className="flex-[1.2] text-center md:text-left">

          {/* Modern Ultra-Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--bg-surface)]  border border-[var(--accent-primary-subtle)]  mb-8 shadow-sm"
          >
            <span className="text-[12px] font-extrabold text-[var(--text-accent)] uppercase tracking-[0.2em] flex items-center gap-2">
              <Compass size={14} className="text-[var(--text-accent)]" />
              AI-Powered Career Guidance
            </span>
          </motion.div>

          {/* Headline - Premium Typography */}
          <div className="relative mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1] font-poppins"
            >
              Your Career <br />
              Journey, <br />
              <span className="text-[var(--text-accent)] tracking-[-0.04em]">Redefined.</span>
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-1 bg-[var(--accent-primary)] rounded-full mt-4"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] mb-12 max-w-2xl font-medium leading-relaxed"
          >
            Take control of your professional future. Our <span className="text-[var(--text-accent)] font-bold">intelligent guidance engine</span> analyzes your skills and aspirations to personalize your next career move.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
          >
            <Link
              to="/login"
              className="px-8 py-4 bg-[var(--accent-primary)] rounded-full text-[var(--text-primary)] font-bold text-lg shadow-xl shadow-[var(--accent-primary-subtle)] hover:bg-[var(--accent-primary-hover)] transition-all flex items-center gap-3 hover:scale-105 active:scale-95"
            >
              Get Started Now <ArrowRight size={20} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 flex items-center gap-3"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[var(--bg-surface)]  bg-[var(--bg-subtle)] overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${i + 15}`} alt="User" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-[var(--text-tertiary)]">Supporting over <span className="font-bold text-[var(--text-primary)] dark:text-[var(--text-primary)]">3,000,000</span> users worldwide</p>
          </motion.div>
        </div>

        {/* Right Side: High-Fidelity Floating UI */}
        <div className="flex-1 relative hidden md:block min-h-[550px]">
          {/* Floating Spheres */}
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-10 left-0 w-16 h-16 bg-[var(--accent-primary-subtle)] rounded-full blur-2xl" />
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-10 right-0 w-24 h-24 bg-[var(--accent-primary-glow)] rounded-full blur-3xl" />

          {/* Target Role Card - Tucked Behind Neural Match */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: -20, rotateZ: 5 }}
            animate={{
              opacity: 1,
              x: 0,
              y: [0, -8, 0],
              rotateZ: 0
            }}
            transition={{
              opacity: { duration: 0.8 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            whileHover={{ scale: 1.05, rotateY: 10, z: 50 }}
            className="absolute top-20 right-0 z-10 w-[280px] bg-[var(--bg-surface)] backdrop-blur-xl p-6 rounded-[24px] shadow-[0_20px_40px_-10px_rgba(30,58,138,0.15)] border border-[var(--border-default)] flex flex-col gap-4 cursor-pointer perspective-1000"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center text-[var(--text-primary)] shadow-lg shadow-blue-900/30">
                <Target size={20} />
              </div>
              <p className="text-[12px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Target Role</p>
            </div>
            <div className="h-7 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h4
                  key={currentRoleIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-[var(--text-primary)] font-bold text-lg"
                >
                  {roles[currentRoleIdx]}
                </motion.h4>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Main Neural Match Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, 15, 0]
            }}
            transition={{
              opacity: { duration: 0.6 },
              scale: { type: "spring", stiffness: 100 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            }}
            whileHover={{ scale: 1.02, rotateX: 5, rotateY: 5, z: 100 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[420px] bg-[var(--bg-surface)] p-10 rounded-[40px] shadow-[0_40px_80px_-20px_rgba(30,58,138,0.15)] border border-slate-200  cursor-pointer perspective-1000"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface)]  flex items-center justify-center text-[var(--text-accent)] dark:text-[var(--accent-primary)] shadow-inner">
                  <Brain size={28} />
                </div>
                <h4 className="font-extrabold text-slate-950 dark:text-[var(--text-primary)] text-xl tracking-tight">Skill Compatibility</h4>
              </div>
              <div className="text-[var(--text-accent)] dark:text-[var(--accent-primary)] font-black text-5xl">98%</div>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Technical Fit', val: 95 },
                { label: 'Culture Alignment', val: 90 },
                { label: 'Growth Potential', val: 92 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-extrabold text-[var(--text-tertiary)] uppercase tracking-widest">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-subtle)] dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      transition={{ duration: 1.5, delay: idx * 0.2 }}
                      className="h-full bg-[var(--accent-primary)] rounded-full shadow-[0_0_8px_rgba(30,58,138,0.4)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Career Trajectory Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateZ: -5 }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
              rotateZ: 0
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.2 },
              y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 },
              rotateZ: { duration: 0.8, delay: 0.2 }
            }}
            whileHover={{ scale: 1.05, rotateY: 10, z: 50 }}
            className="absolute bottom-10 left-0 z-30 w-[240px] bg-[var(--bg-surface)] backdrop-blur-xl p-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(30,58,138,0.15)] border border-[var(--border-default)] flex items-center gap-4 cursor-pointer perspective-1000"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--color-success-subtle)] flex items-center justify-center text-[var(--color-success)] shadow-sm">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[12px] font-extrabold text-[var(--text-tertiary)]  uppercase tracking-wider">Growth Rate</p>
              <p className="text-[var(--color-success)] font-black text-lg">+145%</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Futuristic Particle Overlay (Hero Only) */}
      <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: ((i * 37) % 1000) }}
            animate={{
              opacity: [0, 0.4, 0],
              y: [null, ((i * 13) % 600) * -1],
              x: [null, (((i * 29) % 100) / 100 - 0.5) * 150]
            }}
            transition={{
              duration: ((i * 7) % 12) + 6,
              repeat: Infinity,
              ease: "linear",
              delay: ((i * 11) % 10)
            }}
            className="absolute w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full blur-[1px]"
            style={{
              left: `${(i * 23) % 100}%`,
              top: `${(i * 31) % 100}%`
            }}
          />
        ))}
      </div>

      {/* Features Section - TailBot Light Showcase Style */}
      <section id="features" className="relative py-32 md:py-48 bg-transparent scroll-mt-24 overflow-hidden">
        {/* Abstract Background for Light Section */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <div className="flex flex-col items-center gap-4 mb-8">
              <span className="text-[12px] font-black uppercase tracking-[0.4em] text-[var(--text-accent)] dark:text-[var(--accent-primary)]">✨ Core Features</span>
              <div className="w-12 h-1 bg-[var(--accent-primary)] rounded-full" />
            </div>
            <h3 className="text-4xl sm:text-5xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter mb-8 font-poppins leading-tight">              Unlock Your <br />
              <span className="text-[var(--text-accent)]">Career Potential.</span>
            </h3>
          </motion.div>
          <div className="flex justify-center items-center">
            <BookFeatureShowcase />
          </div>
        </div>
      </section>

      {/* How it Works Section - Future of Intelligent Growth */}
      <section id="how-it-works" className="relative py-32 md:py-56 bg-transparent scroll-mt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-28 md:mb-40 text-center"
          >
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--text-accent)] dark:text-[var(--accent-primary)] mb-8">How it works</h2>
            <h3 className="text-4xl sm:text-6xl md:text-7xl font-black text-[var(--text-primary)] tracking-tighter leading-[1.05] mb-8 font-poppins">
              Your Personalized <br />
              <span className="text-[var(--text-accent)]">Growth Strategy.</span>
            </h3>
            <p className="text-lg md:text-2xl text-[var(--text-secondary)] font-semibold max-w-3xl mx-auto leading-relaxed">
              Achieve your career goals with a clear, step-by-step development plan.
            </p>
          </motion.div>

          <div className="flex justify-center items-center perspective-[2000px]">
            <div className="relative w-full max-w-5xl">
              {/* Central Glowing Oracle Line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 hidden sm:block overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent" />
                <motion.div
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-indigo-900 to-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-24">
                {[
                  {
                    step: "01",
                    title: "Skill Profile Analysis",
                    desc: "We analyze your current technical skills, experience, and interests to establish a solid baseline.",
                    icon: <Fingerprint size={32} />,
                    color: "text-[var(--text-accent)]",
                    bg: "bg-blue-100/30 ",
                    align: "md:text-left"
                  },
                  {
                    step: "02",
                    title: "Target Career Mapping",
                    desc: "Our intelligent matching recommends structured pathways tailored to the career goals you select.",
                    icon: <Network size={32} />,
                    color: "text-[var(--text-accent)]",
                    bg: "bg-blue-100/30 ",
                    align: "md:text-left"
                  },
                  {
                    step: "03",
                    title: "Personalized Roadmap",
                    desc: "Receive a step-by-step roadmap that dynamically updates as you complete key modules.",
                    icon: <Route size={32} />,
                    color: "text-[var(--text-accent)]",
                    bg: "bg-blue-100/30 ",
                    align: "md:text-left"
                  },
                  {
                    step: "04",
                    title: "Continuous Progress Tracking",
                    desc: "Get insights and targeted practice recommendations to ensure you stay on track to success.",
                    icon: <Brain size={32} />,
                    color: "text-[var(--text-accent)]",
                    bg: "bg-blue-100/30 ",
                    align: "md:text-left"
                  }
                ]
                  .map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="relative p-10 bg-[var(--bg-surface)] backdrop-blur-[32px] border border-slate-200 dark:border-[var(--bg-surface)]/10 rounded-[48px] transition-all duration-700 shadow-[0_24px_48px_-12px_rgba(30,58,138,0.08)] hover:shadow-[0_32px_64px_-16px_rgba(30,58,138,0.15)] group overflow-hidden hover:-translate-y-3"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-900/10 to-indigo-900/10 blur opacity-0 group-hover:opacity-100 transition duration-1000" />
                      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-950/5 to-transparent blur-3xl" />
                      <div className="flex flex-col h-full relative z-10">
                        <div className="flex items-center justify-between mb-8">
                          <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                            <div className={item.color}>{item.icon}</div>
                          </div>
                          <span className="text-4xl sm:text-5xl font-black text-[var(--text-tertiary)] dark:text-[var(--text-primary)]/10 font-poppins">{item.step}</span>
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-4 tracking-tight font-poppins">{item.title}</h4>
                        <p className="text-lg text-[var(--text-secondary)] font-semibold leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 md:py-40 flex justify-center w-full px-5 md:px-10 overflow-hidden">
        <div className="max-w-5xl w-full glass-panel p-8 sm:p-12 md:p-24 text-center relative overflow-hidden transition-all duration-700 hover:shadow-indigo-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--accent-primary-subtle)]  via-transparent to-transparent pointer-events-none transition-colors duration-700" />

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-[5rem] font-black text-[var(--text-primary)] dark:text-[var(--text-primary)] tracking-tighter mb-8 font-poppins leading-[1.1]"
          >
            Ready to shape<br className="hidden sm:block" /> your <span className="text-[var(--text-accent)] dark:text-[var(--accent-primary)]">future?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-[var(--text-secondary)] mb-10 sm:mb-12 max-w-2xl mx-auto relative z-10 font-semibold leading-relaxed"
          >
            Join professionals who are building in-demand skills and achieving their career goals using <span className="text-[var(--text-accent)] dark:text-[var(--accent-primary)] font-extrabold">GuideYu.</span>
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 relative z-10">
            <Link to="/login" className="px-10 py-5 bg-[var(--accent-primary)] text-[var(--text-primary)] rounded-full font-black text-xl shadow-xl shadow-sm hover:bg-[var(--accent-primary-hover)] transition-all flex items-center justify-center gap-3 group">
              Get Started Now <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const BookFeatureShowcase = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      title: "Career Recommendations",
      desc: "Receive personalized suggestions for high-growth fields that align with your professional background.",
      icon: <Compass size={48} className="text-blue-950" />,
      accent: "from-blue-950 to-blue-900"
    },
    {
      title: "Skill Gap Analysis",
      desc: "Identify the exact skills and technical modules required to qualify for your target role.",
      icon: <Brain size={48} className="text-blue-950" />,
      accent: "from-blue-950 to-indigo-950"
    },
    {
      title: "Learning Path",
      desc: "Access structured, step-by-step modules designed to guide you through key industry topics.",
      icon: <BookMarked size={48} className="text-blue-950" />,
      accent: "from-blue-950 to-slate-900"
    },
    {
      title: "Dashboard Insights",
      desc: "Track your learning progress, completed milestones, and overall preparation level in real time.",
      icon: <LayoutList size={48} className="text-blue-950" />,
      accent: "from-blue-950 to-blue-800"
    },
    {
      title: "Profile Management",
      desc: "Consolidate your certifications, completed roadmaps, and career targets into a single profile.",
      icon: <UserPlus size={48} className="text-blue-950" />,
      accent: "from-blue-950 to-blue-900"
    }
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % features.length);
    }, 2000); // Auto-rotation every 2 seconds
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % features.length);
  };

  return (
    <>
      {/* Universal 3D Book Layout for All Devices */}
      <div className="flex relative group w-[calc(100%-2rem)] sm:w-full max-w-4xl h-auto min-h-[420px] sm:min-h-[550px] flex-col items-center mx-auto mt-6 sm:mt-0">
        {/* Shadow under book */}
        <div className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-8 md:h-12 bg-[var(--bg-surface)]0/10 blur-xl md:blur-2xl rounded-full pointer-events-none" />

        <div
          className="w-full h-full relative perspective-[2000px] md:perspective-[2500px] flex justify-center items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >


          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ rotateY: 90, opacity: 0, originX: 0, scale: 0.95 }}
              animate={{ rotateY: 0, opacity: 1, originX: 0, scale: 1 }}
              exit={{ rotateY: -90, opacity: 0, originX: 1, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full max-w-[500px] min-h-[400px] sm:min-h-[500px] glass-panel relative flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden hover:-translate-y-2 transition-all duration-300 group/book"
            >
              <div className="absolute inset-0 bg-[var(--bg-base)] opacity-90 z-0 pointer-events-none transition-colors duration-700" />

              <div className={`absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br ${features[currentPage].accent} opacity-15  blur-[60px] sm:blur-[80px] rounded-full transition-all duration-700`} />

              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`w-16 h-16 sm:w-28 sm:h-28 rounded-[1.5rem] sm:rounded-[2rem] bg-[var(--bg-subtle)] border border-[var(--border-default)] flex items-center justify-center mb-6 sm:mb-10 shadow-md  group flex-shrink-0 transition-transform duration-300 hover:scale-110`}
                >
                  <div className="text-[var(--text-accent)] scale-[1] sm:scale-[1.2]">
                    {features[currentPage].icon}
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl sm:text-3xl font-black text-[var(--text-primary)] dark:text-[var(--text-primary)] mb-3 sm:mb-6 font-poppins"
                >
                  {features[currentPage].title}
                </motion.h3>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-lg text-[var(--text-secondary)] font-semibold leading-relaxed max-w-sm"
                >
                  {features[currentPage].desc}
                </motion.p>
              </div>

              <div className={`absolute left-0 top-0 bottom-0 w-3 sm:w-4 bg-gradient-to-r ${features[currentPage].accent} opacity-20  border-r border-slate-100  transition-all duration-700`} style={{ maskImage: 'linear-gradient(to right, black, transparent)', WebkitMaskImage: 'linear-gradient(to right, black, transparent)' }} />
            </motion.div>
          </AnimatePresence>


        </div>

        {/* Navigation Dots */}
        <div className="flex gap-3 sm:gap-4 mt-8 sm:mt-12 relative z-20">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${currentPage === i ? 'w-8 sm:w-10 bg-[var(--accent-primary)] shadow-[0_0_10px_rgba(30,58,138,0.5)]' : 'h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[var(--bg-overlay)] hover:bg-[var(--border-default)]'}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
