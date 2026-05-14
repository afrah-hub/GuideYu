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
    <div className="p-8 rounded-[2.5rem] bg-white border border-[var(--border-default)] animate-pulse space-y-6">
       <div className="flex gap-6">
          <div className="w-12 h-12 bg-[var(--bg-subtle)] rounded-2xl" />
          <div className="flex-1 space-y-3">
             <div className="h-6 w-1/3 bg-[var(--bg-subtle)] rounded-lg" />
             <div className="h-4 w-1/4 bg-[var(--bg-subtle)] rounded-lg" />
          </div>
       </div>
       <div className="h-4 w-full bg-[var(--bg-subtle)] rounded-lg" />
       <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-[var(--bg-subtle)] rounded-xl" />
          <div className="h-12 bg-[var(--bg-subtle)] rounded-xl" />
       </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] border border-[var(--border-default)] shadow-2xl text-center space-y-8 max-w-lg"
        >
          <div className="w-24 h-24 bg-[#FFF1F2] rounded-[2.5rem] flex items-center justify-center mx-auto text-[#E11D48] shadow-xl">
            <Info size={48} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">Intelligence Offline</h2>
            <p className="text-[#475569] font-medium text-lg leading-relaxed">{error}</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-5 bg-[#2774AE] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#2774AE]/20 hover:scale-[1.02] transition-all"
          >
            Retry Neural Link
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-32">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-[#2774AE]/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-[#2774AE]/[0.02] rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12 relative z-10 space-y-16">
        
        {/* HEADER AREA */}
        <header className="space-y-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-[#64748B] hover:text-[#2774AE] transition-all text-[11px] font-black uppercase tracking-[0.3em] group"
          >
            <div className="p-2 bg-white rounded-xl border border-[var(--border-default)] group-hover:-translate-x-1 transition-transform shadow-sm">
               <ChevronLeft size={16} />
            </div>
            Neural Path Overview
          </button>

          {loading ? (
             <div className="space-y-6">
                <div className="h-4 w-32 bg-[var(--bg-subtle)] rounded-full animate-pulse" />
                <div className="h-16 w-2/3 bg-[var(--bg-subtle)] rounded-[1.5rem] animate-pulse" />
                <div className="h-6 w-1/2 bg-[var(--bg-subtle)] rounded-lg animate-pulse" />
             </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-12"
            >
              <div className="space-y-6 flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--border-default)] shadow-sm">
                  <Sparkles size={14} className="text-[#2774AE] animate-pulse" />
                  <span className="text-[10px] font-black text-[#2774AE] uppercase tracking-[0.2em]">Module Intelligence</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-[#0F172A] tracking-tighter leading-[0.9]">
                  {data?.moduleName}
                </h1>
                <p className="text-lg lg:text-xl text-[#475569] font-medium max-w-2xl leading-relaxed">
                  Deep-dive architecture for <span className="text-[#2774AE] font-black italic">{targetCareer}</span>. Master these core topics to evolve your proficiency.
                </p>
              </div>

              <div className="flex items-center gap-6 bg-white border border-[var(--border-default)] p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] shrink-0">
                <div className="text-center px-4">
                  <span className="block text-4xl font-black text-[#2774AE] tracking-tighter">{data?.topics?.length}</span>
                  <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">Chapters</span>
                </div>
                <div className="w-[1px] h-12 bg-[var(--border-default)]" />
                <div className="text-center px-4">
                  <span className="block text-4xl font-black text-[#0F172A] tracking-tighter">
                    {data?.topics?.reduce((acc, t) => {
                       const time = parseInt(t.estimatedTime) || 30;
                       return acc + time;
                    }, 0)}m
                  </span>
                  <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">Est. Duration</span>
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
               {data?.topics?.map((topic, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: idx * 0.1 }}
                   whileHover={{ y: -5 }}
                   className="group relative bg-white border border-[var(--border-default)] rounded-[3rem] p-10 lg:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:border-[#2774AE]/30 hover:shadow-[0_30px_90px_rgba(0,0,0,0.04)] transition-all duration-700"
                 >
                    <div className="absolute top-0 right-0 p-10 opacity-[0.015] group-hover:opacity-[0.03] transition-opacity pointer-events-none">
                       <Zap size={200} />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                       <div className="shrink-0">
                          <div className="w-16 h-16 rounded-2xl bg-[#EEF4F8] border border-[#2774AE]/10 flex items-center justify-center text-[#2774AE] font-black text-2xl shadow-inner group-hover:bg-[#2774AE] group-hover:text-white transition-all duration-500">
                             {idx + 1}
                          </div>
                       </div>

                       <div className="flex-1 space-y-8">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                             <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                   <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                      topic.difficulty === 'Beginner' ? 'bg-[#F0FDF4] text-[#10B981]' :
                                      topic.difficulty === 'Advanced' ? 'bg-[#FFF1F2] text-[#E11D48]' :
                                      'bg-[#FFFBEB] text-[#D97706]'
                                   }`}>
                                      {topic.difficulty}
                                   </div>
                                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                                      <Clock size={12} /> {topic.estimatedTime}
                                   </div>
                                </div>
                                <h3 className="text-3xl font-black text-[#0F172A] tracking-tight group-hover:text-[#2774AE] transition-colors">{topic.title}</h3>
                             </div>
                             
                             <button 
                               onClick={() => navigate(`/lessons/${roadmapId}/${moduleId}/${encodeURIComponent(topic.id || topic.title || idx)}?career=${encodeURIComponent(targetCareer || '')}`)}
                               className="px-10 py-5 bg-[#002E5D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#2774AE] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                             >
                               Start Lesson
                               <ChevronRight size={18} />
                             </button>
                          </div>

                          <p className="text-lg text-[#475569] font-medium leading-relaxed max-w-3xl">
                            {topic.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {topic.keyTakeaways?.map((takeaway, tidx) => (
                               <div key={tidx} className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-[#F8FAFC] border border-[var(--border-default)] group/takeaway hover:bg-white hover:border-[#2774AE]/20 transition-all">
                                  <div className="p-1.5 bg-white rounded-lg border border-[var(--border-default)] group-hover/takeaway:text-[#2774AE] group-hover/takeaway:border-[#2774AE]/30 transition-all">
                                     <CheckCircle2 size={16} className="shrink-0" />
                                  </div>
                                  <span className="text-xs font-bold text-[#475569]">{takeaway}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ))}
             </div>
           )}
        </div>

        {/* CTA BANNER */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-16 rounded-[4rem] bg-[#2774AE] relative overflow-hidden shadow-[0_40px_100px_rgba(39,116,174,0.3)] text-center md:text-left"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-6">
                  <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-white shadow-inner">
                     <Award size={40} />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-4xl font-black text-white tracking-tight">Evolve Your Skill Matrix</h2>
                    <p className="text-blue-50 text-xl font-medium max-w-xl opacity-90 leading-relaxed">
                      Complete this module to earn your proficiency badge and unlock the next evolution stage in your {targetCareer} roadmap.
                    </p>
                  </div>
               </div>
               <button className="px-12 py-6 bg-white text-[#2774AE] rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
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
