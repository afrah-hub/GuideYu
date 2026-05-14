import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Sparkles, ArrowRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ data, loading }) => {
  const navigate = useNavigate();
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (data?.pathProgress !== undefined && !hasAnimated) {
      const controls = animate(count, data.pathProgress, { duration: 2, ease: "easeOut" });
      setHasAnimated(true);
      return controls.stop;
    }
  }, [data?.pathProgress, count, hasAnimated]);

  if (loading) {
    return <div className="w-full h-[300px] bg-[var(--bg-overlay)] rounded-[40px] animate-pulse" />;
  }

  if (!data) return null;

  // Smart Status Logic
  const getStatus = (progress) => {
    if (progress <= 30) return { label: "Getting Started", color: "text-[var(--text-accent)]", bg: "bg-[var(--accent-primary)]/10", border: "border-[var(--accent-primary)]/20" };
    if (progress <= 70) return { label: "In Progress", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" };
    return { label: "Career Ready", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" };
  };

  const getAIFeedback = (progress) => {
    if (progress <= 30) return "You are laying the foundation. Focus on core concepts to build momentum.";
    if (progress <= 70) return "You are progressing steadily. Complete advanced modules to improve readiness.";
    return "Optimal alignment achieved. You are highly prepared for this career trajectory.";
  };

  const progress = data.pathProgress || 0;
  const status = getStatus(progress);
  const domain = data.targetRole || "your selected career";

  return (
    <header className="relative w-full rounded-[40px] overflow-hidden border border-[var(--border-default)] bg-[var(--bg-elevated)] backdrop-blur-3xl shadow-2xl transition-all duration-700">
      {/* Premium Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-base)] to-[var(--bg-subtle)] opacity-80" />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-[var(--accent-primary-glow)] rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-20 w-[600px] h-[600px] bg-[var(--accent-primary-subtle)] rounded-full blur-[140px]"
        />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 p-8 md:p-10">
        {/* Left Side: Greeting & Summary */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-[40px] md:text-[48px] font-black text-[var(--text-primary)] leading-[1.1] tracking-tighter">
              Welcome back, <br />
              <span className="text-[var(--text-accent)] drop-shadow-[0_0_20px_rgba(39,116,174,0.4)]">
                {data.firstName}.
              </span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg font-medium max-w-xl leading-relaxed">
              {data.targetRole ? (
                <>Your readiness for <span className="text-[var(--text-primary)] font-bold">{domain}</span> is <span className="text-[var(--text-accent)] font-bold">{progress}%</span>.</>
              ) : (
                <>Ready to architect your future? Start exploring paths tailored to your potential.</>
              )}
            </p>
          </div>

          {/* AI Insight Block */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[20px] p-4 flex items-start gap-4 backdrop-blur-xl transition-all cursor-pointer shadow-sm shadow-[var(--border-strong)]"
          >
            <div className="p-2.5 bg-[var(--bg-subtle)] rounded-lg mt-0.5">
              <Sparkles size={20} className="text-[var(--text-accent)]" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-[var(--text-accent)] uppercase tracking-[0.3em]">Nexus Intelligence Summary</p>
                {data.targetRole && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${status.bg} ${status.border} ${status.color}`}>
                    {status.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                {data.targetRole
                  ? getAIFeedback(progress)
                  : "Neural engine initialized. Awaiting user profile completion to generate insights."
                }
              </p>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              onClick={() => navigate('/learning-nexus')}
              className="px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-primary)] rounded-full font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              Resume Module
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/career-path')}
              className="px-6 py-3 border border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-full font-black text-xs uppercase tracking-widest transition-all"
            >
              View Roadmap
            </button>
          </div>
        </motion.div>

        {/* Right Side: Dynamic Readiness Stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex items-center justify-center lg:w-1/4"
        >
          <div className="w-64 h-64 rounded-full border-[12px] border-[var(--border-default)] flex items-center justify-center relative bg-[var(--bg-surface)] backdrop-blur-md shadow-sm">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="110"
                fill="none"
                stroke="var(--border-strong)"
                strokeWidth="12"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="110"
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="12"
                strokeDasharray="690"
                initial={{ strokeDashoffset: 690 }}
                animate={{ strokeDashoffset: 690 - (690 * progress) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center relative z-10">
              <div className="flex items-start">
                <motion.span className="text-[64px] font-black text-[var(--text-primary)] tracking-tighter leading-none">
                  {rounded}
                </motion.span>
                <span className="text-2xl font-black text-[var(--text-accent)] mt-1">%</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 bg-[var(--bg-subtle)] px-3 py-1 rounded-full border border-[var(--border-faint)]">
                <Activity size={12} className="text-[var(--text-accent)]" />
                <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em]">Readiness</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default HeroSection;

