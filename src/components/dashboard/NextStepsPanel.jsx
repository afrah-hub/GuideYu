import React from 'react';
import { ChevronRight, Target } from 'lucide-react';

import { motion } from 'framer-motion';

const NextStepsPanel = ({ data, loading }) => {
  if (loading) {
    return <div className="h-[250px] bg-[var(--bg-overlay)] rounded-[32px] animate-pulse" />;
  }

  const currentGoal = data?.currentGoal;

  if (!currentGoal) {
    return (
      <div className="p-10 rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border-default)] backdrop-blur-3xl flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-[24px] bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-accent)]">
          <Target size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">No Active Objective</h3>
          <p className="text-[var(--text-tertiary)] text-sm max-w-xs mt-2 mx-auto">Set a target career in the Explore section to begin your journey.</p>
        </div>
        <button className="px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-primary)] rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-md">
          Browse Careers
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-10 rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border-default)] backdrop-blur-3xl shadow-sm space-y-10 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span className="text-[11px] font-black text-[var(--text-accent)] uppercase tracking-[0.4em]">Active Objective</span>
          </div>
          <h3 className="text-3xl font-black text-[var(--text-primary)] leading-tight tracking-tighter">{currentGoal.title}</h3>
        </div>
        <div className="w-16 h-16 rounded-[24px] bg-[var(--bg-subtle)] border border-[var(--border-faint)] text-[var(--text-accent)] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm">
          <Target size={32} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em]">Synchronizing Path</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[var(--text-primary)]">{currentGoal.progress}</span>
            <span className="text-sm font-bold text-[var(--text-accent)]">%</span>
          </div>
        </div>
        <div className="h-4 w-full bg-[var(--bg-overlay)] rounded-full overflow-hidden p-1 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentGoal.progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-brand rounded-full relative shadow-sm"
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] w-full animate-[shimmer_2s_infinite]" />
          </motion.div>
        </div>
      </div>

      <div className="pt-4">
        <p className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] mb-4">Critical Next Action</p>
        <motion.div
          whileHover={{ x: 5, scale: 1.01 }}
          className="bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[24px] p-6 flex items-center justify-between group cursor-pointer transition-all shadow-sm"
        >
          <span className="text-[17px] font-semibold text-[var(--text-primary)] tracking-tight">{currentGoal.nextStep}</span>
          <div className="w-10 h-10 rounded-full bg-[var(--bg-overlay)] flex items-center justify-center text-[var(--text-accent)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--text-primary)] transition-all">
            <ChevronRight size={20} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NextStepsPanel;

