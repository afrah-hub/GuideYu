import React from 'react';
import { TrendingUp, Target, Zap, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

import { motion } from 'framer-motion';

const iconMap = {
  TrendingUp,
  Target,
  Zap
};

const StatCard = ({ title, value, change, iconName, trendDirection, timeframe, index }) => {
  const Icon = iconMap[iconName] || TrendingUp;
  const isPositive = trendDirection === 'up';
  const isNegative = trendDirection === 'down';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative p-5 md:p-8 rounded-[24px] md:rounded-[32px] bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-default)] shadow-sm group transition-all duration-500"
    >
      {/* Trend Glow Background */}
      <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-[60px] opacity-10 transition-opacity group-hover:opacity-20 ${isPositive ? 'bg-emerald-500' : isNegative ? 'bg-rose-500' : 'bg-[var(--bg-subtle)]0'
        }`} />

      <div className="flex justify-between items-start relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${isPositive ? 'bg-[var(--color-success-subtle)] text-[var(--color-success)]' :
            isNegative ? 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]' :
              'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
          }`}>
          <Icon size={24} />
        </div>

        <div className={`text-[11px] font-black flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${isPositive ? 'bg-[var(--color-success-subtle)] text-[var(--color-success)] border-[var(--color-success-subtle)]' :
            isNegative ? 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)] border-[var(--color-danger-subtle)]' :
              'bg-[var(--bg-overlay)] text-[var(--text-tertiary)] border-[var(--border-faint)]'
          }`}>
          {isPositive ? <ArrowUpRight size={14} /> : isNegative ? <ArrowDownRight size={14} /> : <Minus size={14} />}
          <span className="uppercase tracking-widest">{change} {timeframe}</span>
        </div>
      </div>

      <div className="mt-8 relative z-10">
        <p className="text-[11px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] mb-2">
          {title}
        </p>
        <h4 className="text-[28px] md:text-[36px] font-black text-[var(--text-primary)] leading-none tracking-tighter">
          {value}
        </h4>
      </div>
    </motion.div>
  );
};

const MetricsCards = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[180px] bg-[var(--bg-overlay)] rounded-[32px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
      {data.map((metric, i) => (
        <StatCard key={i} {...metric} iconName={metric.icon} index={i} />
      ))}
    </div>
  );
};

export default MetricsCards;

