import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  Sparkles,
  Zap,
  Target,
  Clock,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Lock,
  Brain,
  BarChart3,
  Calendar,
  Layout,
  Cpu,
  Trophy,
  Flame,
  Star,
  Activity,
  Award,
  TrendingUp,
  Settings,
  MoreVertical,
  Plus
} from 'lucide-react';
import { recommendationService } from '../services/recommendationService';

const LearningNexus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const targetCareerParam = new URLSearchParams(location.search).get('career');

  const [sections, setSections] = useState({
    plan: { data: null, loading: true, error: null },
    overview: { data: null, loading: true, error: null },
    insights: { data: null, loading: true, error: null },
    nextSteps: { data: null, loading: true, error: null }
  });

  const [stats, setStats] = useState({
    xp: 14250,
    level: 12,
    streak: 6,
    confidence: 85
  });

  useEffect(() => {
    const fetchAllData = async () => {
      const fetchSection = async (key, fetcher) => {
        try {
          const data = await fetcher();
          setSections(prev => ({ ...prev, [key]: { data, loading: false, error: null } }));
        } catch (err) {
          console.error(`Failed to fetch ${key}:`, err);
          setSections(prev => ({ ...prev, [key]: { data: null, loading: false, error: err.message } }));
        }
      };

      const dashboardFetcher = async (endpoint) => {
        const res = await fetch(`/api/dashboard/${endpoint}`, { credentials: 'include' });
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        return res.json();
      };

      // Concurrent fetching for progressive loading
      fetchSection('plan', () => recommendationService.getLearningPlan(targetCareerParam));
      fetchSection('overview', () => dashboardFetcher('overview'));
      fetchSection('insights', () => dashboardFetcher('insights'));
      fetchSection('nextSteps', () => dashboardFetcher('next-steps'));
    };

    fetchAllData();
  }, [targetCareerParam]);

  const plan = sections.plan.data;
  const insights = sections.insights.data || [];
  const tasks = sections.nextSteps.data || [];
  const currentSkill = plan?.skills?.find(s => s.status !== 'Completed') || plan?.skills?.[0];

  const SkeletonCard = ({ height = "h-64" }) => (
    <div className={`${height} w-full bg-[var(--bg-overlay)] rounded-[2.5rem] animate-pulse relative overflow-hidden`}>
       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 selection:bg-[var(--accent-primary-subtle)]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 space-y-12">
        
        {/* 1. TOP NAVIGATION & IDENTITY */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-accent)] transition-colors text-[10px] font-black uppercase tracking-[0.3em] group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                DASHBOARD HUB
              </button>
              <div className="space-y-1">
                <h1 className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tighter">
                  Adaptive <span className="text-gradient-brand">Learning Nexus</span>
                </h1>
                <p className="text-[var(--text-secondary)] font-bold text-sm tracking-tight">AI-POWERED CAREER MENTORSHIP SYSTEM</p>
              </div>
           </div>

           <div className="flex items-center gap-6 bg-white border border-[var(--border-default)] p-3 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 px-4 border-r border-[var(--border-default)]">
                 <div className="w-10 h-10 bg-[#EEF4F8] rounded-xl flex items-center justify-center text-[#2774AE]">
                    <Flame size={24} />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">STREAK</p>
                    <p className="text-lg font-black text-[#0F172A]">{stats.streak} DAYS</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 px-4">
                 <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center text-[#10B981]">
                    <Trophy size={24} />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">XP POINTS</p>
                    <p className="text-lg font-black text-[#0F172A]">{stats.xp.toLocaleString()}</p>
                 </div>
              </div>
           </div>
        </header>

        {/* 2. MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Active Path & Trajectory */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 2.1 Hero Hero Learning Card */}
            {sections.plan.loading ? <SkeletonCard height="h-[350px]" /> : (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[3rem] border border-[var(--border-default)] bg-[#002E5D] text-white p-10 lg:p-14 shadow-[0_30px_90px_rgba(0,46,93,0.3)]"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Cpu size={250} />
                </div>
                <div className="relative z-10 space-y-8">
                   <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">Neural Target</div>
                      <div className="h-[1px] w-20 bg-white/10" />
                   </div>
                   
                   <div className="space-y-4">
                      <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-none">
                        Mastering <br />
                        <span className="text-[var(--accent-primary)]">{plan?.targetCareer}</span>
                      </h2>
                      <p className="text-blue-100/70 text-lg font-medium max-w-xl leading-relaxed">
                        Your personalized growth engine is optimized for <strong>{currentSkill?.name}</strong>. Complete this module to unlock expert-level insights.
                      </p>
                   </div>

                   <div className="flex flex-wrap items-center gap-8 pt-4">
                      <button
                        onClick={() => navigate(`/syllabus?module=${encodeURIComponent(currentSkill?.name || '')}&career=${encodeURIComponent(plan?.targetCareer || '')}`)}
                        className="px-12 py-5 bg-[var(--accent-primary)] hover:bg-white hover:text-[#002E5D] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/50 transition-all flex items-center gap-4 group"
                      >
                        Resume Learning
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                           {[1,2,3].map(i => (
                             <div key={i} className="w-10 h-10 rounded-full border-2 border-[#002E5D] bg-blue-500/20 backdrop-blur-sm" />
                           ))}
                        </div>
                        <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">342 others studying now</p>
                      </div>
                   </div>
                </div>
              </motion.section>
            )}

            {/* 2.2 Neural Trajectory (Interactive Roadmap) */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white border border-[var(--border-default)] rounded-xl flex items-center justify-center text-[var(--accent-primary)] shadow-sm">
                       <Award size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#0F172A] tracking-tight">Skill Matrix Progress</h3>
                      <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">Sequential Learning Architecture</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-right">
                    <p className="text-2xl font-black text-[var(--accent-primary)]">{plan?.overallProgress}%</p>
                    <div className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase leading-tight">Overall<br/>Readiness</div>
                 </div>
              </div>

              {sections.plan.loading ? (
                <div className="space-y-4">
                  <SkeletonCard height="h-24" />
                  <SkeletonCard height="h-24" />
                  <SkeletonCard height="h-24" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plan?.skills?.map((skill, idx) => {
                    const isCompleted = skill.status === 'Completed';
                    const isActive = skill.name === currentSkill?.name;
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -5, scale: 1.02 }}
                        onClick={() => !(!isCompleted && !isActive) && navigate(`/syllabus?module=${encodeURIComponent(skill.name)}&career=${encodeURIComponent(plan?.targetCareer || '')}`)}
                        className={`p-6 rounded-[2.5rem] border transition-all duration-500 relative cursor-pointer ${
                          isActive ? 'bg-white border-[#2774AE] shadow-2xl z-10' :
                          isCompleted ? 'bg-white border-[var(--border-default)] opacity-90' :
                          'bg-[var(--bg-subtle)]/50 border-transparent opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                             isCompleted ? 'bg-[#F0FDF4] text-[#10B981]' :
                             isActive ? 'bg-[#EEF4F8] text-[#2774AE]' : 'bg-[var(--bg-overlay)]'
                           }`}>
                             {isCompleted ? <CheckCircle2 size={24} /> : isActive ? <Sparkles size={24} /> : <Lock size={20} />}
                           </div>
                           <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             skill.priority === 'High' ? 'bg-[#FFF1F2] text-[#E11D48]' : 'bg-[var(--bg-subtle)] text-[var(--text-tertiary)]'
                           }`}>
                             {skill.priority} Priority
                           </div>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-black text-[#0F172A]">{skill.name}</h4>
                          <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
                             <span>Progress</span>
                             <span>{isCompleted ? '100%' : isActive ? 'Active' : 'Locked'}</span>
                          </div>
                          <div className="h-1.5 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden mt-2">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: isCompleted ? '100%' : isActive ? '15%' : '0%' }}
                               className={`h-full rounded-full ${isCompleted ? 'bg-[#10B981]' : 'bg-[#2774AE]'}`}
                             />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Side: Analytics & Engagement */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* 2.3 XP & Level Status */}
            <section className="p-8 rounded-[3rem] bg-white border border-[var(--border-default)] shadow-xl space-y-8 relative overflow-hidden">
               <div className="absolute -top-10 -right-10 p-4 opacity-5">
                  <Star size={120} />
               </div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center text-white shadow-lg">
                     <span className="text-2xl font-black italic">{stats.level}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0F172A] tracking-widest uppercase">Skill Level</h3>
                    <p className="text-[10px] font-black text-[var(--text-tertiary)] uppercase">Advanced Practitioner</p>
                  </div>
               </div>

               <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                     <span>Rank: ELITE</span>
                     <span>9,250 / 15,000 XP</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        className="h-full bg-gradient-brand"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-[#F8FAFC] rounded-2xl border border-[var(--border-default)]">
                     <p className="text-lg font-black text-[#0F172A]">82%</p>
                     <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase">Accuracy</p>
                  </div>
                  <div className="text-center p-4 bg-[#F8FAFC] rounded-2xl border border-[var(--border-default)]">
                     <p className="text-lg font-black text-[#0F172A]">12h</p>
                     <p className="text-[9px] font-black text-[var(--text-tertiary)] uppercase">Focus Time</p>
                  </div>
               </div>
            </section>

            {/* 2.4 AI Confidence & Analytics */}
            <section className="p-8 rounded-[3rem] bg-[#2774AE]/[0.03] border border-[#2774AE]/10 space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#002E5D] uppercase tracking-[0.3em]">AI Confidence</h3>
                  <div className="p-2 bg-white rounded-lg border border-[var(--border-default)]">
                    <Activity size={16} className="text-[#2774AE]" />
                  </div>
               </div>

               <div className="flex items-center gap-8">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                       <circle className="text-blue-100 stroke-current" cx="18" cy="18" r="16" strokeWidth="4" fill="none" />
                       <motion.circle 
                         initial={{ strokeDasharray: "0, 100" }}
                         animate={{ strokeDasharray: `${stats.confidence}, 100` }}
                         transition={{ duration: 2 }}
                         className="text-[#2774AE] stroke-current" 
                         cx="18" cy="18" r="16" strokeWidth="4" strokeLinecap="round" fill="none" 
                       />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                       <span className="text-xl font-black text-[#002E5D]">{stats.confidence}%</span>
                    </div>
                  </div>
                  <div className="space-y-1 min-w-0">
                     <p className="text-xs font-black text-[#0F172A]">High Proficiency</p>
                     <p className="text-[10px] text-[#475569] font-medium leading-relaxed">The Neural Mentor predicts you are ready for advanced level certification.</p>
                  </div>
               </div>

               <div className="pt-4 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#002E5D]">Projected Growth</h4>
                  <div className="flex items-end gap-2 h-16">
                     {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ height: 0 }}
                         animate={{ height: `${h}%` }}
                         transition={{ delay: i * 0.1 }}
                         className="flex-1 bg-[#2774AE] rounded-t-sm opacity-20 hover:opacity-100 transition-opacity" 
                       />
                     ))}
                  </div>
               </div>
            </section>

            {/* 2.5 Daily Target Tasks */}
            <section className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em]">Learning Goals</h3>
                  <button className="text-[var(--accent-primary)] hover:scale-110 transition-transform"><Plus size={16}/></button>
               </div>
               <div className="space-y-3">
                  {sections.nextSteps.loading ? <SkeletonCard height="h-40" /> : (
                    tasks.map((task, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ x: 5 }}
                        className="p-5 bg-white border border-[var(--border-default)] rounded-2xl flex items-center gap-4 group cursor-pointer shadow-sm"
                      >
                         <div className="w-6 h-6 rounded-lg border-2 border-[var(--border-default)] flex items-center justify-center group-hover:border-[#2774AE] transition-colors">
                            <div className="w-3 h-3 bg-[#2774AE] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-xs font-black text-[#0F172A] truncate">{task.title || task.name}</p>
                           <p className="text-[9px] font-black text-[#10B981] uppercase tracking-tighter">+500 XP</p>
                         </div>
                         <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight size={14} className="text-[var(--text-tertiary)]" />
                         </div>
                      </motion.div>
                    ))
                  )}
               </div>
            </section>
          </div>
        </div>

        {/* 3. AI INSIGHTS BAR */}
        {sections.insights.loading ? <SkeletonCard height="h-24" /> : (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-[3rem] bg-white border border-[var(--border-default)] shadow-2xl flex flex-col md:flex-row items-center gap-8 overflow-hidden relative"
          >
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[var(--accent-primary-subtle)] via-transparent to-transparent pointer-events-none" />
             <div className="shrink-0 flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-[#EEF4F8] rounded-2xl flex items-center justify-center text-[#2774AE] shadow-inner">
                   <Brain size={28} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-[#0F172A] tracking-tight">Nexus Insights</h3>
                   <p className="text-[10px] font-black text-[#2774AE] uppercase tracking-widest">Real-time analysis</p>
                </div>
             </div>
             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {insights.slice(0, 3).map((insight, i) => (
                  <div key={i} className="flex gap-3 items-start">
                     <Sparkles size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                     <p className="text-xs font-medium text-[#475569] leading-relaxed line-clamp-2 italic">
                        {insight.text}
                     </p>
                  </div>
                ))}
             </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default LearningNexus;
