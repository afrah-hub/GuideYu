import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';

const UpgradeCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 text-[var(--text-primary)] shadow-2xl shadow-sm relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--bg-surface)]/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[var(--bg-surface)]/10 rounded-xl backdrop-blur-md border border-[var(--bg-surface)]/20">
            <Zap size={24} className="fill-white" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.3em]">Scale Your Path</h3>
        </div>
        <p className="text-[var(--text-primary)]/80 text-sm leading-relaxed font-medium">
          Get personalized mentorship and deep industry insights with <span className="text-[var(--text-primary)] font-black">GuidYu Pro</span>.
        </p>
        <button className="w-full py-4 bg-[var(--bg-surface)] text-[var(--accent-primary)] rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2">
          Upgrade Now <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </motion.div>
  );
};

export default UpgradeCard;
