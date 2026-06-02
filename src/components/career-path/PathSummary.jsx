import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PathSummary = ({ summary, journey, loading }) => {
  const navigate = useNavigate();
  const [lastStopped, setLastStopped] = useState(null);

  useEffect(() => {
    const fetchLastStopped = async () => {
      try {
        const response = await fetch('/api/lessons/last-stopped', { credentials: 'include' });
        if (response.ok && response.status !== 204) {
          const data = await response.json();
          setLastStopped(data);
        }
      } catch (err) {
        console.error('Failed to fetch last stopped lesson:', err);
      }
    };
    fetchLastStopped();
  }, []);

  if (loading) {
    return (
      <div className="h-64 bg-[var(--bg-overlay)] animate-pulse rounded-[2rem]" />
    );
  }

  if (!summary) return null;

  const currentStage = journey?.find(s => s.isCurrent)?.roleName || summary.currentRole || 'Beginner';

  const handleContinueLearning = () => {
    if (lastStopped && lastStopped.career === summary.targetRole) {
      navigate(`/lessons/${lastStopped.roadmapId}/${lastStopped.moduleId}/${encodeURIComponent(lastStopped.topicId)}?career=${encodeURIComponent(lastStopped.career)}&module=${encodeURIComponent(lastStopped.moduleName)}`);
    } else {
      const params = new URLSearchParams();
      if (summary.targetRole) params.set('career', summary.targetRole);
      navigate(`/learning-path?${params.toString()}`);
    }
  };

  return (
    <div className="relative p-6 lg:p-8 rounded-[2rem] bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-sm overflow-hidden group">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--accent-primary-subtle)] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[var(--accent-primary-glow)] rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 opacity-50" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">

        {/* Left Content */}
        <div className="flex-1 space-y-5 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-faint)] backdrop-blur-sm">
            <Sparkles size={14} className="text-[var(--text-accent)] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-accent)]">
              Personalized Career Strategy
            </span>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight">
              Master the path to <span className="text-gradient-brand">{summary.targetRole}</span>
            </h1>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] font-medium max-w-lg leading-relaxed">
              You're currently at the <span className="text-[var(--text-primary)] font-bold">{currentStage}</span> stage.
              We've mapped out the exact skills you need.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueLearning}
              className="px-5 py-2.5 bg-[var(--accent-primary)] text-[var(--text-primary)] rounded-xl font-bold text-xs shadow-md transition-all hover:bg-[var(--accent-primary-hover)] flex items-center gap-2"
            >
              Continue Learning
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-overlay)' }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] rounded-xl font-bold text-xs transition-all flex items-center gap-2"
            >
              <BookOpen size={16} />
              Resources
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathSummary;
