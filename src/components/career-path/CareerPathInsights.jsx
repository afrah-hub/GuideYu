import React from 'react';
import { Settings, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CareerPathInsights = ({ insights, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-[var(--bg-overlay)] rounded-[2rem] animate-pulse" />
        ))}
      </div>
    );
  }

  const navigate = useNavigate();

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Dynamic AI Insights */}
      <div className="space-y-4">
        {(insights && insights.length > 0 ? insights : [
          { text: "Completing technical certifications increases matching by 15%", impactValue: "15%" },
          { text: "Industry networking reduces time-to-hire by 3 months", impactValue: "20%" }
        ]).map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-[2rem] bg-[var(--bg-surface)] border border-[var(--border-default)] relative overflow-hidden group shadow-sm"
          >
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-accent)]">
                <Sparkles size={18} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed italic">
                  "{insight.text}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-md bg-[var(--color-success-subtle)] text-[var(--color-success)] text-[10px] font-black uppercase tracking-widest">
                    +{insight.impactValue} Impact
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Switch Path Action */}
      <section
        onClick={() => navigate('/explore-careers')}
        className="mt-auto p-6 bg-[var(--accent-primary)] rounded-[2rem] flex items-center justify-between group cursor-pointer hover:bg-[var(--accent-primary-hover)] transition-all shadow-md shadow-[var(--accent-primary-subtle)]"
      >
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[var(--bg-surface)]/10 text-[var(--text-primary)] group-hover:scale-110 transition-all">
            <Settings size={22} />
          </div>
          <div>
            <h4 className="text-base font-bold text-[var(--text-primary)] tracking-tight">Switch Career Path</h4>
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mt-0.5 opacity-70">Explore Roles</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-[var(--text-primary)] group-hover:translate-x-1 transition-all" />
      </section>
    </div>
  );
};

export default CareerPathInsights;
