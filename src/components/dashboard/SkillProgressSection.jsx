import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Code, Zap, Sparkles } from 'lucide-react';

const SkillProgressSection = ({ skills, loading }) => {
  if (loading) {
    return <div className="h-[400px] bg-[var(--bg-subtle)] rounded-[40px] animate-pulse" />;
  }

  if (!skills || skills.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 px-4">
        <div className="p-2.5 bg-[var(--accent-primary)]/20 rounded-xl text-[var(--text-accent)] shadow-[0_0_15px_rgba(30,58,138,0.3)]">
          <Cpu size={20} />
        </div>
        <h2 className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.4em]">Neural Growth Grid</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="p-8 rounded-[32px] bg-[var(--bg-surface)]/[0.02] border border-[var(--bg-surface)]/5 backdrop-blur-md hover:bg-[var(--bg-surface)]/[0.04] hover:border-blue-900/30 transition-all duration-500 group relative overflow-hidden"
          >
            {/* Subtle glow on hover */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-[var(--bg-surface)]0/5 blur-[80px] rounded-full group-hover:bg-[var(--accent-primary-subtle)] transition-colors" />

            <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
              <div className="flex items-center gap-5 md:w-72">
                <div className="p-4 bg-[var(--accent-primary-glow)]0 rounded-2xl text-[var(--text-accent)] group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-[0_8px_16px_-4px_rgba(30,58,138,0.2)]">
                  <Code size={24} />
                </div>
                <div>
                  <h4 className="font-black text-xl text-[var(--text-primary)] leading-tight tracking-tight">{skill.skillName}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Sparkles size={12} className="text-[var(--accent-primary)]" />
                    <span className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Level {Math.ceil(skill.proficiency / 20)} Mastery</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-amber-500 fill-amber-500/20" />
                    <span className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">{skill.proficiency}% Sync Strength</span>
                  </div>
                </div>

                <div className="h-3 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] w-full animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center justify-end md:w-32">
                <div className="text-right">
                  <span className="block text-3xl font-black text-[var(--text-primary)] tracking-tighter">+{Math.floor(Math.random() * 20 + 5)}%</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Velocity</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillProgressSection;
