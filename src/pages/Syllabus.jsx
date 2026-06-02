import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  BookOpen, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  Layout,
  Terminal,
  Zap,
  Lock,
  ChevronRight,
  Info,
  Award,
  PlayCircle
} from 'lucide-react';
import { recommendationService } from '../services/recommendationService';

const Syllabus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleName = searchParams.get('module') || 'Core Module';
  const targetCareer = searchParams.get('career');
  const roadmapId = searchParams.get('roadmapId') || 0;
  const moduleId = searchParams.get('moduleId') || 0;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        setLoading(true);
        const result = await recommendationService.getSyllabus(moduleName, targetCareer);
        setData(result);
      } catch (err) {
        console.error('Failed to load syllabus:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSyllabus();
  }, [moduleName, targetCareer]);

  const SkeletonItem = () => (
    <div className="p-8 rounded-[2.5rem] bg-bg-surface border border-border-default animate-pulse space-y-6">
       <div className="flex gap-6">
          <div className="w-12 h-12 bg-bg-subtle rounded-2xl" />
          <div className="flex-1 space-y-3">
             <div className="h-6 w-1/3 bg-bg-subtle rounded-lg" />
             <div className="h-4 w-1/4 bg-bg-subtle rounded-lg" />
          </div>
       </div>
       <div className="h-4 w-full bg-bg-subtle rounded-lg" />
       <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-bg-subtle rounded-xl" />
          <div className="h-12 bg-bg-subtle rounded-xl" />
       </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-bg-surface p-12 rounded-[3rem] border border-border-default shadow-2xl text-center space-y-8 max-w-lg"
        >
          <div className="w-24 h-24 bg-[#FFF1F2] dark:bg-rose-950/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-[#E11D48] dark:text-rose-400 shadow-xl">
            <Info size={48} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-text-primary tracking-tight">Service Unavailable</h2>
            <p className="text-text-secondary font-medium text-lg leading-relaxed">{error}</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-5 bg-accent-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-accent-primary/20 hover:scale-[1.02] transition-all"
          >
            Retry Connection
          </button>
        </motion.div>
      </div>
    );
  }

  const completedTopicsCount = data?.topics?.filter(t => t.isCompleted || t.IsCompleted).length || 0;
  const totalTopicsCount = data?.topics?.length || 0;
  const progressPercentage = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg-base text-text-primary pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-accent-primary/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-accent-primary/[0.02] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-6 relative z-10 space-y-16">
        
        {/* HEADER AREA */}
        <header className="space-y-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-text-tertiary hover:text-accent-primary transition-all text-[11px] font-black uppercase tracking-[0.3em] group"
          >
            <div className="p-2 bg-bg-surface rounded-xl border border-border-default group-hover:-translate-x-1 transition-transform shadow-sm">
               <ChevronLeft size={16} />
            </div>
             Syllabus Overview
          </button>

          {loading ? (
             <div className="space-y-6">
                <div className="h-4 w-32 bg-bg-subtle rounded-full animate-pulse" />
                <div className="h-16 w-2/3 bg-bg-subtle rounded-[1.5rem] animate-pulse" />
                <div className="h-6 w-1/2 bg-bg-subtle rounded-lg animate-pulse" />
             </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-12"
            >
              <div className="space-y-6 flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-surface border border-border-default shadow-sm">
                  <Sparkles size={14} className="text-accent-primary animate-pulse" />
                  <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.2em]">Module Overview</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-text-primary tracking-tighter leading-[0.9]">
                  {data?.moduleName}
                </h1>
                <p className="text-lg lg:text-xl text-text-secondary font-medium max-w-2xl leading-relaxed">
                  Deep-dive architecture for <span className="text-accent-primary font-black italic">{targetCareer}</span>. Master these core topics to build your proficiency.
                </p>

                {totalTopicsCount > 0 && (
                  <div className="space-y-2 max-w-2xl pt-2">
                    <div className="flex justify-between text-xs font-bold text-text-secondary uppercase tracking-widest">
                      <span>Module Completion Progress</span>
                      <span>{progressPercentage}% ({completedTopicsCount}/{totalTopicsCount} Chapters)</span>
                    </div>
                    <div className="w-full bg-border-default h-3 rounded-full overflow-hidden border border-border-default/50 p-0.5">
                      <div 
                        className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 bg-bg-surface border border-border-default p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.2)] shrink-0">
                <div className="text-center px-4">
                  <span className="block text-4xl font-black text-accent-primary tracking-tighter">{totalTopicsCount}</span>
                  <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Chapters</span>
                </div>
                <div className="w-[1px] h-12 bg-border-default" />
                <div className="text-center px-4">
                  <span className="block text-4xl font-black text-text-primary tracking-tighter">
                    {data?.topics?.reduce((acc, t) => {
                       const time = parseInt(t.estimatedTime) || 30;
                       return acc + time;
                    }, 0)}m
                  </span>
                  <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Est. Duration</span>
                </div>
              </div>
            </motion.div>
          )}
        </header>

        {/* TOPICS WORKSPACE */}
        <div className="space-y-8">
           {loading ? (
             <div className="space-y-8">
                <SkeletonItem />
                <SkeletonItem />
                <SkeletonItem />
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-8">
               {data?.topics?.map((topic, idx) => {
                 const isTopicCompleted = topic.isCompleted || topic.IsCompleted;
                 return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`group relative bg-bg-surface border rounded-[3rem] p-10 lg:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-700 ${
                      isTopicCompleted 
                        ? 'border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_30px_90px_rgba(16,185,129,0.04)]' 
                        : 'border-border-default hover:border-accent-primary/30 hover:shadow-[0_30px_90px_rgba(39,116,174,0.04)] dark:hover:shadow-[0_30px_90px_rgba(0,0,0,0.3)]'
                    }`}
                  >
                     <div className="absolute top-0 right-0 p-10 opacity-[0.015] group-hover:opacity-[0.03] transition-opacity pointer-events-none">
                        <Zap size={200} />
                     </div>

                     <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                        <div className="shrink-0">
                           <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center font-black text-2xl shadow-inner transition-all duration-500 ${
                             isTopicCompleted 
                               ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10' 
                               : 'bg-bg-subtle border-accent-primary/10 text-accent-primary group-hover:bg-accent-primary group-hover:text-white'
                           }`}>
                              {isTopicCompleted ? <CheckCircle2 size={24} /> : idx + 1}
                           </div>
                        </div>

                        <div className="flex-1 space-y-8">
                           <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                              <div className="space-y-3">
                                 <div className="flex items-center gap-3">
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                       topic.difficulty === 'Beginner' ? 'bg-[#F0FDF4] text-[#10B981] dark:bg-emerald-950/20 dark:text-emerald-400' :
                                       topic.difficulty === 'Advanced' ? 'bg-[#FFF1F2] text-[#E11D48] dark:bg-rose-950/20 dark:text-rose-400' :
                                       'bg-[#FFFBEB] text-[#D97706] dark:bg-amber-950/20 dark:text-amber-400'
                                    }`}>
                                       {topic.difficulty}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                                       <Clock size={12} /> {topic.estimatedTime}
                                    </div>
                                    {isTopicCompleted && (
                                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                                        Completed
                                      </span>
                                    )}
                                 </div>
                                 <h3 className={`text-3xl font-black tracking-tight transition-colors ${
                                   isTopicCompleted 
                                     ? 'text-text-primary group-hover:text-emerald-500' 
                                     : 'text-text-primary group-hover:text-accent-primary'
                                 }`}>{topic.title}</h3>
                              </div>
                              
                              <button 
                                onClick={() => navigate(`/lessons/${roadmapId}/${moduleId}/${encodeURIComponent(topic.id || topic.title || idx)}?career=${encodeURIComponent(targetCareer || '')}&module=${encodeURIComponent(data?.moduleName || moduleName)}`)}
                                className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 ${
                                  isTopicCompleted
                                    ? 'bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-emerald-500/20'
                                    : 'bg-accent-primary-hover dark:bg-accent-primary text-white hover:bg-accent-primary dark:hover:bg-accent-primary-hover shadow-accent-primary/20'
                                }`}
                              >
                                {isTopicCompleted ? 'Review Lesson' : 'Start Lesson'}
                                <ChevronRight size={18} />
                              </button>
                           </div>

                           <p className="text-lg text-text-secondary font-medium leading-relaxed max-w-3xl">
                             {topic.description}
                           </p>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {topic.keyTakeaways?.map((takeaway, tidx) => (
                                <div key={tidx} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-bg-base border border-border-default group/takeaway hover:bg-bg-surface hover:border-accent-primary/20 transition-all">
                                   <div className="p-1.5 bg-bg-surface rounded-lg border border-border-default group-hover/takeaway:text-accent-primary group-hover/takeaway:border-accent-primary/30 transition-all">
                                      <CheckCircle2 size={16} className="shrink-0" />
                                   </div>
                                   <span className="text-xs font-bold text-text-secondary">{takeaway}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
                 );
               })}
             </div>
           )}
        </div>

        {/* CTA BANNER */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-16 rounded-[4rem] bg-accent-primary relative overflow-hidden shadow-[0_40px_100px_rgba(39,116,174,0.3)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.5)] text-center md:text-left"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-6">
                  <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-white shadow-inner">
                     <Award size={40} />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-4xl font-black text-white tracking-tight">Upgrade Your Skills</h2>
                    <p className="text-blue-50 text-xl font-medium max-w-xl opacity-90 leading-relaxed">
                      Complete this module to earn your proficiency badge and unlock the next milestone in your {targetCareer} roadmap.
                    </p>
                  </div>
               </div>
               <button className="px-12 py-6 bg-white dark:bg-bg-surface text-accent-primary rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                 UNLOCK BADGE
                 <Zap size={22} className="fill-current animate-pulse" />
               </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Syllabus;
