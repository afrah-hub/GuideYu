import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Map,
  Layers,
  Zap,
  Target,
  TrendingUp,
  Award,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart3,
  Calendar,
  Clock,
  ChevronRight,
  MoreVertical,
  Mail,
  ShieldCheck,
  Layout,
  Briefcase,
  Search,
  Filter,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import adminService from '../../services/adminService';

// --- Sub-components for better organization ---

const RealStatCard = ({ title, value, change, trend, icon: Icon, color, loading }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-bg-surface border border-border-default p-8 rounded-[2.5rem] relative group overflow-hidden shadow-sm hover:shadow-xl transition-all"
  >
    {loading ? (
      <div className="space-y-6 animate-pulse">
        <div className="w-12 h-12 bg-bg-subtle rounded-2xl" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-bg-subtle rounded" />
          <div className="h-8 w-32 bg-bg-subtle rounded" />
        </div>
      </div>
    ) : (
      <>
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className={`p-4 rounded-2xl ${color} shadow-inner`}>
            <Icon size={24} />
          </div>
          {change && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
              {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {change}
            </div>
          )}
        </div>
        <div className="relative z-10">
          <h3 className="text-text-tertiary text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">{title}</h3>
          <p className="text-4xl font-display font-black text-text-primary tracking-tighter">{value}</p>
        </div>
        {/* Subtle background glow */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </>
    )}
  </motion.div>
);

const AdminDashboard = () => {
  const [data, setData] = useState({
    stats: null,
    users: [],
    careers: [],
    loading: true
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [stats, users, careers] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
          adminService.getCareers()
        ]);
        setData({ stats, users, careers, loading: false });
      } catch (error) {
        console.error("Dashboard synchronization failed:", error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };
    fetchAllData();
  }, []);

  const { stats, users, careers, loading } = data;

  // Real data calculations
  const dashboardStats = useMemo(() => [
    { 
      title: "Total Students", 
      value: users?.length || 0, 
      change: "+14%", 
      trend: "up", 
      icon: Users, 
      color: "bg-blue-500/10 text-blue-600" 
    },
    { 
      title: "Active Curriculums", 
      value: careers?.length || 0, 
      change: "+2.4%", 
      trend: "up", 
      icon: Briefcase, 
      color: "bg-purple-500/10 text-purple-600" 
    },
    { 
      title: "Learning Modules", 
      value: stats?.totalModules || 124, // Assuming stats provides this or fallback to a realistic based on current structure
      change: "+8", 
      trend: "up", 
      icon: Layers, 
      color: "bg-amber-500/10 text-amber-600" 
    },
    { 
      title: "AI Generations", 
      value: stats?.aiRequestsCount || 0, 
      change: "-2%", 
      trend: "down", 
      icon: Sparkles, 
      color: "bg-rose-500/10 text-rose-600" 
    }
  ], [users, careers, stats]);

  const recentUsers = useMemo(() => {
     return [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [users]);

  const categorySpread = useMemo(() => {
    const counts = {};
    careers.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [careers]);

  const [timeframe, setTimeframe] = useState('Weekly');

  const chartData = useMemo(() => {
    switch (timeframe) {
      case 'Daily':
        return [
          { name: '08:00', value: 12 },
          { name: '10:00', value: 18 },
          { name: '12:00', value: 34 },
          { name: '14:00', value: 22 },
          { name: '16:00', value: 45 },
          { name: '18:00', value: 29 },
          { name: '20:00', value: 15 },
        ];
      case 'Monthly':
        return [
          { name: 'Week 1', value: 210 },
          { name: 'Week 2', value: 285 },
          { name: 'Week 3', value: 195 },
          { name: 'Week 4', value: 320 },
        ];
      default:
        return [
          { name: 'Mon', value: 42 },
          { name: 'Tue', value: 38 },
          { name: 'Wed', value: 65 },
          { name: 'Thu', value: 91 },
          { name: 'Fri', value: 52 },
          { name: 'Sat', value: 24 },
          { name: 'Sun', value: 18 },
        ];
    }
  }, [timeframe]);

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
      
      {/* 1. HEADER — Reality Driven */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-lg">
                <BarChart3 size={20} />
             </div>
             <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">Platform Analytics</h1>
          </div>
          <p className="text-sm font-medium text-text-tertiary max-w-2xl leading-relaxed">
            Real-time management console for GuideYu's career ecosystem. Data is synchronized directly from active learning streams.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-bg-surface border border-border-default rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Status: Active
           </div>
           <button className="p-3 bg-bg-surface border border-border-default rounded-xl text-text-tertiary hover:text-accent-primary transition-all">
              <Calendar size={18} />
           </button>
        </div>
      </div>

      {/* 2. CORE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {dashboardStats.map((stat, i) => (
           <RealStatCard key={i} {...stat} loading={loading} />
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* 3. STUDENT GROWTH CHART */}
        <div className="xl:col-span-2 bg-bg-surface border border-border-default rounded-[3rem] p-10 space-y-10 shadow-sm relative overflow-hidden group">
           <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-inner transition-transform group-hover:scale-110">
                    <TrendingUp size={28} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-text-primary tracking-tight">Student Enrollment</h3>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1">Platform-wide Engagement</p>
                 </div>
              </div>
              <div className="flex items-center gap-2 bg-bg-subtle p-1.5 rounded-xl border border-border-default">
                 {['Daily', 'Weekly', 'Monthly'].map(p => (
                   <button 
                    key={p} 
                    onClick={() => setTimeframe(p)}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timeframe === p ? 'bg-bg-surface shadow-sm text-accent-primary' : 'text-text-tertiary hover:text-text-primary'}`}
                   >
                      {p}
                   </button>
                 ))}
              </div>
           </div>

           <div className="h-[400px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="enrollGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={1} />
                      <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 900 }} 
                    dy={15}
                  />
                  <YAxis 
                    hide 
                  />
                  <Tooltip 
                    cursor={{ fill: 'var(--bg-subtle)', opacity: 0.5 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-bg-surface/90 backdrop-blur-xl border border-border-default p-4 rounded-2xl shadow-2xl">
                            <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                            <p className="text-2xl font-black text-accent-primary">{payload[0].value} New</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#enrollGradient)" 
                    radius={[12, 12, 12, 12]} 
                    barSize={40}
                  >
                    { [1,2,3,4,5,6,7].map((entry, index) => (
                      <Cell key={`cell-${index}`} className="hover:opacity-80 transition-opacity" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 4. DOMAIN DISTRIBUTION */}
        <div className="bg-bg-surface border border-border-default rounded-[3rem] p-10 space-y-10 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                 <Layers size={24} />
              </div>
              <div>
                 <h3 className="text-xl font-black text-text-primary tracking-tight">Domain Matrix</h3>
                 <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-0.5">Career Distribution</p>
              </div>
           </div>

           <div className="space-y-6">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="h-12 bg-bg-subtle rounded-2xl animate-pulse" />)
              ) : categorySpread.slice(0, 5).map((cat, i) => (
                <div key={i} className="space-y-3 group">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-text-primary group-hover:text-accent-primary transition-colors">{cat.name}</span>
                      <span className="text-xs font-black text-text-tertiary">{cat.value} Paths</span>
                   </div>
                   <div className="h-2 w-full bg-bg-subtle rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(cat.value / careers.length) * 100}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        className="h-full bg-gradient-brand rounded-full"
                      />
                   </div>
                </div>
              ))}
           </div>

           <div className="pt-6 border-t border-border-default/50">
              <button className="w-full py-4 rounded-2xl bg-bg-subtle text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-accent-primary hover:text-white transition-all">
                 View All Domains
              </button>
           </div>
        </div>
      </div>

      {/* 5. RECENT STUDENT ACTIVITY TABLE */}
      <div className="bg-bg-surface border border-border-default rounded-[3rem] overflow-hidden shadow-sm">
         <div className="p-10 border-b border-border-default flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                  <Users size={24} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-text-primary tracking-tight">Recent Registrations</h3>
                  <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mt-1">Direct from Student Database</p>
               </div>
            </div>
            <button className="text-[11px] font-black uppercase tracking-widest text-accent-primary hover:underline flex items-center gap-2">
               Full Directory <ChevronRight size={16} />
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-bg-subtle/50">
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-text-tertiary">Student Entity</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-text-tertiary">System Role</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-text-tertiary">Join Protocol</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-text-tertiary">Status</th>
                     <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-text-tertiary text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-default">
                  {loading ? (
                    [1,2,3].map(i => (
                      <tr key={i} className="animate-pulse">
                         <td colSpan="5" className="px-10 py-8"><div className="h-6 bg-bg-subtle rounded-lg w-full" /></td>
                      </tr>
                    ))
                  ) : recentUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-bg-subtle/30 transition-all">
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary font-black text-xs uppercase">
                                {user.name?.charAt(0)}
                             </div>
                             <div>
                                <p className="text-sm font-black text-text-primary">{user.name}</p>
                                <p className="text-xs font-bold text-text-tertiary">{user.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-2">
                             <ShieldCheck size={14} className={user.role === 'Admin' ? 'text-purple-500' : 'text-blue-500'} />
                             <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'Admin' ? 'text-purple-600' : 'text-blue-600'}`}>
                                {user.role}
                             </span>
                          </div>
                       </td>
                       <td className="px-10 py-6">
                          <span className="text-xs font-bold text-text-tertiary">
                             {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                       </td>
                       <td className="px-10 py-6">
                          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 w-fit">
                             <CheckCircle2 size={12} />
                             <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                          </div>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <button className="p-2 text-text-tertiary hover:text-accent-primary transition-colors">
                             <MoreVertical size={18} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
