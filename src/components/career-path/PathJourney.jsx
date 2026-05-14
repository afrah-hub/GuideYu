import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Lock, ChevronDown, Rocket, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PathJourney = ({ journey, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-[var(--bg-overlay)] rounded-[32px] animate-pulse" />)}
      </div>
    );
  }

  if (!journey || journey.length === 0) return null;

  const handleResume = (step) => {
    navigate('/learning-path');
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-[var(--bg-subtle)] rounded-2xl text-[var(--text-accent)] shadow-sm">
          <Compass size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tighter">Strategic Roadmap</h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Your optimized trajectory to career mastery.</p>
        </div>
      </div>

      <div className="relative pl-10 ml-4 lg:ml-8">
        {/* Glowing track line */}
        <div className="absolute left-[20px] lg:left-[28px] top-4 bottom-4 w-1 bg-[var(--bg-overlay)] rounded-full overflow-hidden">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="w-full bg-[var(--gradient-brand)]"
          />
        </div>

        <div className="space-y-12">
          {journey.map((step, i) => {
            const isCompleted = step.status === 'Completed';
            const isActive = step.status === 'Current' || step.status === 'Active';
            const isLocked = step.status === 'Locked' || step.status === 'Upcoming';
            const isTarget = i === journey.length - 1;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className={`relative group ${isLocked ? 'opacity-50 grayscale-[50%]' : ''}`}
              >
                {/* Node Marker */}
                <div
                  className={`absolute -left-[45px] lg:-left-[53px] top-6 w-14 h-14 rounded-full border-[4px] flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110 ${isTarget ? 'bg-[var(--accent-primary)] border-[var(--border-default)] text-[var(--text-primary)] shadow-md shadow-[var(--accent-primary-subtle)]' :
                      isCompleted ? 'bg-[var(--color-success-subtle)] border-[var(--color-success)] text-[var(--color-success)] shadow-sm' :
                        isActive ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)] text-[var(--text-accent)] shadow-md shadow-[var(--accent-primary-subtle)]' :
                          'bg-[var(--bg-subtle)] border-[var(--border-default)] text-[var(--text-tertiary)]'
                    }`}
                >
                  {isTarget ? <Rocket size={20} /> :
                    isCompleted ? <Check size={20} /> :
                      isActive ? (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                          <Zap size={20} />
                        </motion.div>
                      ) :
                        <Lock size={18} />}
                </div>

                {/* Content Card */}
                <div className={`p-8 rounded-[32px] bg-[var(--bg-surface)] backdrop-blur-xl border transition-all duration-500 ${isTarget ? 'border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary-subtle)] bg-[var(--accent-primary-subtle)]' :
                    isCompleted ? 'border-[var(--color-success-subtle)] hover:border-[var(--color-success)]' :
                      isActive ? 'border-[var(--border-default)] hover:border-[var(--accent-primary)] shadow-sm' :
                        'border-[var(--border-faint)] hover:border-[var(--border-default)]'
                  }`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        {isTarget && <span className="px-3 py-1 bg-[var(--accent-primary)] text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">Target Role</span>}
                        {isCompleted && <span className="px-3 py-1 bg-[var(--color-success-subtle)] text-[var(--color-success)] border border-[var(--color-success)] text-[10px] font-black uppercase tracking-widest rounded-full">Completed</span>}
                        {isActive && <span className="px-3 py-1 bg-[var(--bg-subtle)] text-[var(--text-accent)] border border-[var(--border-faint)] text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" /> Active Stage</span>}

                        <h4 className="text-2xl font-black text-[var(--text-primary)] tracking-tighter w-full mt-2">
                          {step.roleName}
                        </h4>
                      </div>

                      <p className="text-[15px] text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl">
                        {step.description || `Milestone to establish foundational mastery for ${step.roleName}.`}
                      </p>
                    </div>

                    {isActive && (
                      <button
                        onClick={() => handleResume(step)}
                        className="px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-primary)] rounded-xl font-black text-xs uppercase tracking-widest shadow-sm transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
                      >
                        Resume
                        <ChevronDown size={16} className="-rotate-90" />
                      </button>
                    )}
                  </div>

                  {step.skills && step.skills.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-[var(--border-faint)]">
                      <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-3">Key Competencies</p>
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill, si) => (
                          <span key={si} className="bg-[var(--bg-overlay)] border border-[var(--border-faint)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-secondary)] font-medium">
                            {skill.name || skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PathJourney;

