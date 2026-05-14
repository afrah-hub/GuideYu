import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, BookOpen, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearningPlan = ({ skills, loading }) => {
  if (loading) {
    return (
      <div className="h-64 bg-[var(--bg-subtle)] animate-pulse rounded-[2rem]" />
    );
  }

  const actionableSkills = skills.filter(s => s.category !== 'Completed');

  return (
    <div className="p-8 bg-[var(--bg-surface)] border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-10 px-1">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-[var(--accent-primary)]">
            <Zap size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-widest">Growth Units</h3>
            <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">Recommended for you</p>
          </div>
        </div>
        <Link to="/learning" className="p-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-all group">
          <ChevronRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 flex-1">
        {actionableSkills.slice(0, 2).map((skill, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}
            className="p-6 bg-[var(--bg-subtle)]/30 border border-slate-50 rounded-3xl flex flex-col justify-between group hover:border-indigo-100 hover:bg-[var(--bg-surface)] transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-[var(--bg-surface)] border border-slate-100 text-[var(--accent-primary)] shadow-sm">
                <BookOpen size={20} strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-1.5">Difficulty</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black uppercase tracking-widest ${parseInt(skill.learningTime) > 10 ? 'text-rose-600' : parseInt(skill.learningTime) > 5 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                    {parseInt(skill.learningTime) > 10 ? 'Hard' : parseInt(skill.learningTime) > 5 ? 'Medium' : 'Easy'}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full ${parseInt(skill.learningTime) > 10 ? 'bg-rose-500' : parseInt(skill.learningTime) > 5 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                </div>
              </div>
            </div>

            <h4 className="text-lg font-bold text-[var(--text-primary)] mb-6 tracking-tight">{skill.name}</h4>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-[var(--accent-primary)] text-[var(--text-primary)] rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-[var(--accent-primary)] transition-all"
            >
              <PlayCircle size={18} strokeWidth={2.5} />
              {skill.category === 'InProgress' ? 'Continue' : 'Start'}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LearningPlan;
