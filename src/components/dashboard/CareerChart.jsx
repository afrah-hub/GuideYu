import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-surface)]  border border-[var(--border-default)]  p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest mb-2">{label}</p>
        <p className="text-xl font-black text-[var(--accent-primary)] tracking-tighter">
          {payload[0].value}% <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest ml-1">Growth</span>
        </p>
      </div>
    );
  }
  return null;
};

const CareerChart = ({ data, loading }) => {
  if (loading) {
    return <div className="h-[250px] md:h-[450px] bg-[var(--bg-subtle)] /5 animate-pulse rounded-[2rem] md:rounded-[2.5rem]" />;
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-1.5 h-6 bg-[var(--accent-primary)] rounded-full" />
        <h3 className="text-xs font-black text-[var(--text-primary)]  uppercase tracking-[0.3em]">Career Growth Momentum</h3>
      </div>
      <div className="h-[250px] sm:h-[320px] md:h-[400px] w-full p-4 md:p-8 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[2rem] md:rounded-[2.5rem] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
              dy={15}
            />
            <YAxis 
              hide={true}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="velocity" 
              stroke="var(--accent-primary)" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorVelocity)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default CareerChart;
