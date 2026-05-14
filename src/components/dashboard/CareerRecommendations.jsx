import React from 'react';
import { ArrowUpRight, Compass, Briefcase, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

const CareerRecommendations = ({ data, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 px-4">
          <div className="p-2.5 bg-[var(--bg-subtle)] rounded-xl text-[var(--text-accent)]">
            <Compass size={20} className="animate-spin-slow" />
          </div>
          <h2 className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.4em]">Neural Engine Scanning...</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-10 rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border-default)] backdrop-blur-3xl h-[400px] relative overflow-hidden">
              {/* Scanning Bar Animation */}
              <motion.div
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary-subtle)] to-transparent z-20"
              />

              <div className="space-y-6 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-[var(--bg-overlay)] rounded-2xl" />
                  <div className="w-32 h-6 bg-[var(--bg-overlay)] rounded-full" />
                </div>
                <div className="space-y-4">
                  <div className="w-full h-10 bg-[var(--bg-overlay)] rounded-xl" />
                  <div className="w-3/4 h-10 bg-[var(--bg-overlay)] rounded-xl" />
                </div>
                <div className="space-y-2 pt-4">
                  <div className="w-full h-4 bg-[var(--bg-overlay)] rounded-full" />
                  <div className="w-full h-4 bg-[var(--bg-overlay)] rounded-full" />
                  <div className="w-1/2 h-4 bg-[var(--bg-overlay)] rounded-full" />
                </div>
              </div>

              <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between pt-8 border-t border-[var(--border-faint)]">
                <div className="w-32 h-12 bg-[var(--bg-overlay)] rounded-full" />
                <div className="flex gap-1">
                  {[1, 2, 3].map(j => <div key={j} className="w-4 h-4 bg-[var(--bg-overlay)] rounded-full" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Get top 4 careers for the "featured boxes" style
  const careers = data?.careers?.slice(0, 4) || [];

  if (careers.length === 0) {
    return (
      <div className="p-10 rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border-default)] backdrop-blur-md flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
        <div className="p-4 bg-[var(--bg-subtle)] rounded-full text-[var(--text-accent)]">
          <Compass size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Searching for Opportunities...</h3>
          <p className="text-[var(--text-tertiary)] text-sm max-w-xs mt-2">Our AI is analyzing the global market to find your perfect synchronization.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[var(--bg-subtle)] rounded-xl text-[var(--text-accent)] shadow-sm">
            <Compass size={20} />
          </div>
          <h2 className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.4em]">Career Recommendation</h2>
        </div>
        <button
          onClick={() => navigate('/explore-careers')}
          className="px-5 py-2 bg-[var(--bg-subtle)] hover:bg-[var(--bg-overlay)] text-[var(--text-accent)] rounded-full text-[11px] font-black uppercase tracking-widest transition-all border border-[var(--border-faint)]"
        >
          Explore All Suggestions
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {careers.map((career, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="p-10 rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border-default)] backdrop-blur-3xl shadow-sm space-y-8 group transition-all duration-500 overflow-hidden relative"
          >
            {/* Background Accent */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--accent-primary-subtle)] blur-[60px] rounded-full group-hover:bg-[var(--accent-primary-glow)] transition-colors" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-start justify-between">
                <div className="p-4 bg-[var(--accent-primary)] rounded-2xl text-[var(--text-primary)] shadow-sm">
                  <Briefcase size={28} />
                </div>
                <div className="px-4 py-2 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                  <span className="text-[11px] font-black text-[var(--text-accent)] uppercase tracking-widest">
                    {career.matchScore || 90}% Synchronization
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-black text-[var(--text-primary)] leading-[1.1] tracking-tighter mb-4 group-hover:text-[var(--text-accent)] transition-colors">
                  {career.name}
                </h3>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed font-medium line-clamp-3">
                  "{career.reason}"
                </p>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between border-t border-[var(--border-faint)] relative z-10">
              <button
                onClick={() => navigate(`/career-path?career=${encodeURIComponent(career.name)}`)}
                className="px-8 py-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-primary)] rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 hover:scale-105 active:scale-95 shadow-md shadow-[var(--accent-primary-subtle)]"
              >
                Sync Path
                <ArrowUpRight size={18} />
              </button>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} className={i <= 4 ? "text-[var(--color-warning)] fill-[var(--color-warning)]" : "text-[var(--text-tertiary)]"} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CareerRecommendations;
