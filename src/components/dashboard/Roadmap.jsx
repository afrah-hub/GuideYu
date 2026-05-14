import React from 'react';
import { motion } from 'framer-motion';
import { Map, ArrowRight, CheckCircle2, CircleDot, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Roadmap = ({ journey, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="space-y-8">
        <div className="h-6 w-48 bg-[var(--bg-overlay)] animate-pulse rounded-full" />
        <div className="h-[200px] bg-[var(--bg-overlay)] animate-pulse rounded-[2.5rem]" />
      </section>
    );
  }

  if (!journey || journey.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[var(--accent-primary)] rounded-full" />
          <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-[0.3em]">Career Path Preview</h3>
        </div>
        <button
          onClick={() => navigate('/career-path')}
          className="text-[11px] font-black text-[var(--text-accent)] uppercase tracking-widest transition-colors flex items-center gap-2 hover:opacity-80"
        >
          Full Path <ArrowRight size={14} />
        </button>
      </div>

      <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[2.5rem] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary-subtle)] blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {journey.map((step, i) => (
            <React.Fragment key={i}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col items-center flex-1 w-full text-center group/step ${step.isCurrent ? 'scale-110 origin-center' : ''}`}
              >
                <div className={`mb-4 w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${step.status === 'Completed' ? 'bg-[var(--color-success-subtle)] border-[var(--color-success-subtle)] text-[var(--color-success)]' :
                    step.isCurrent ? 'bg-[var(--accent-primary)] text-[var(--text-primary)] border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary-subtle)]' :
                      'bg-[var(--bg-subtle)] border-[var(--border-default)] text-[var(--text-tertiary)]'
                  }`}>
                  {step.status === 'Completed' ? <CheckCircle2 size={24} /> :
                    step.isCurrent ? <CircleDot size={24} /> : <Circle size={24} />}
                </div>
                <h4 className={`text-xs font-black tracking-tight mb-1 ${step.isCurrent ? 'text-[var(--text-accent)]' : 'text-[var(--text-primary)]'}`}>
                  {step.roleName}
                </h4>
                <span className={`text-[9px] uppercase tracking-widest font-black ${step.status === 'Completed' ? 'text-[var(--color-success)]' :
                    step.isCurrent ? 'text-[var(--text-accent)]' : 'text-[var(--text-tertiary)]'
                  }`}>
                  {step.status}
                </span>
              </motion.div>

              {i < journey.length - 1 && (
                <div className="hidden md:block w-16 h-0.5 bg-[var(--bg-overlay)] rounded-full relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: step.status === 'Completed' || step.isCurrent ? '100%' : '0%' }}
                    transition={{ delay: i * 0.2 + 0.5, duration: 0.5 }}
                    className="absolute top-0 left-0 h-full bg-[var(--accent-primary)] rounded-full"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
