import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, PlayCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SkillGapAnalysis = ({ skills, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="h-64 bg-[var(--bg-subtle)] animate-pulse rounded-[2rem]" />
    );
  }

  if (!skills) return null;

  const missingSkills = skills.filter(s => s.category === 'Missing' || s.progress === 0);

  return (
    <div className="p-8 bg-[var(--bg-surface)] border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] h-full flex flex-col">
      <div className="flex items-center gap-3 mb-10 px-1">
        <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
          <XCircle size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-widest">Skill Gaps</h3>
          <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-1">What you're missing</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {missingSkills.map((skill, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}
            onClick={() => navigate('/skills')}
            className="p-5 rounded-3xl border border-slate-50 bg-[var(--bg-subtle)]/30 flex items-center justify-between group cursor-pointer hover:border-rose-100 hover:bg-[var(--bg-surface)] transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-rose-500 rounded-full group-hover:h-12 transition-all duration-300" />
              <div>
                <span className="text-base font-bold text-[var(--text-primary)] block tracking-tight">
                  {skill.name}
                </span>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1 inline-block">Gap Identified</span>
              </div>
            </div>

            <button className="p-3.5 rounded-2xl bg-[var(--bg-surface)] border border-slate-100 text-slate-300 group-hover:text-rose-600 group-hover:border-rose-200 shadow-sm transition-all duration-300">
              <PlayCircle size={20} strokeWidth={2.5} />
            </button>
          </motion.div>
        ))}

        {missingSkills.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-3xl bg-[var(--bg-subtle)]/50">
            <AlertCircle size={32} className="text-slate-300 mb-3" />
            <p className="text-[var(--text-tertiary)] font-bold text-sm tracking-tight">Your skillset is optimized.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
