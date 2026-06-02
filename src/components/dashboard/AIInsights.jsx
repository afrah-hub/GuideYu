import React from 'react';
import { BrainCircuit, Lightbulb, TrendingUp, Sparkles, Zap, ShieldCheck } from 'lucide-react';

import { motion } from 'framer-motion';

const AIInsights = ({ data, loading }) => {
  if (loading) {
    return <div className="h-[400px] bg-[var(--bg-overlay)] rounded-3xl animate-pulse" />;
  }

  const insights = data || [];

  if (insights.length === 0) {
    return (
      <div className="p-10 rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border-default)] backdrop-blur-md flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
        <div className="p-4 bg-[var(--bg-subtle)] rounded-full text-[var(--text-accent)]">
          <BrainCircuit size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Generating Insights...</h3>
          <p className="text-[var(--text-tertiary)] text-sm max-w-xs mt-2">Complete more modules to unlock personalized AI career suggestions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-4">
        <div className="p-2.5 bg-[var(--bg-subtle)] rounded-xl text-[var(--text-accent)] shadow-sm">
          <BrainCircuit size={20} />
        </div>
        <h2 className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.4em]">Career Insights</h2>
      </div>

      <div className="space-y-6">
        {insights.map((insight, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ x: 5 }}
            className="p-5 md:p-8 rounded-[24px] md:rounded-[32px] bg-[var(--bg-surface)] border border-[var(--border-default)] backdrop-blur-md hover:bg-[var(--bg-subtle)] hover:border-[var(--accent-primary-subtle)] transition-all duration-500 group shadow-sm"
          >
            <div className="flex items-start gap-4 md:gap-6">
              <div className="p-4 bg-[var(--accent-primary)] rounded-2xl text-[var(--text-primary)] group-hover:scale-110 transition-transform shadow-sm">
                {insight.icon || <Lightbulb size={24} />}
              </div>
              <div className="flex-1 space-y-3">
                <span className="text-[10px] font-black text-[var(--text-accent)] uppercase tracking-[0.3em]">{insight.type}</span>
                <p className="text-sm md:text-[17px] font-semibold text-[var(--text-secondary)] leading-relaxed italic">
                  "{insight.text}"
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Call to Action Card */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="relative p-6 md:p-10 bg-[var(--accent-primary)] border border-[var(--accent-primary-hover)] rounded-[28px] md:rounded-[40px] overflow-hidden shadow-xl shadow-[var(--accent-primary-subtle)] group cursor-pointer"
        >
          {/* Animated Background Pulse */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--bg-surface)] rounded-full blur-[100px] opacity-[0.05] -mr-40 -mt-40 group-hover:opacity-10 transition-opacity duration-1000" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black/20 rounded-2xl text-[var(--text-primary)] backdrop-blur-md">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-100">Priority Action</h3>
            </div>
            
            <h4 className="text-[28px] md:text-[40px] font-black text-[var(--text-primary)] leading-[1.05] tracking-tighter">
              Expand Your <br />
              <span className="text-blue-200">Skills &amp; Experience.</span>
            </h4>
            
            <button className="px-6 md:px-10 py-4 md:py-5 bg-[var(--bg-surface)] text-[var(--accent-primary-hover)] rounded-full font-black text-xs md:text-sm uppercase tracking-widest hover:bg-[var(--bg-subtle)] transition-all transform group-hover:scale-105 active:scale-95 shadow-lg">
              Get Started
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIInsights;
