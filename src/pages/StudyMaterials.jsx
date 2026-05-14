import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink, 
  Clock, 
  ChevronRight, 
  Search,
  Sparkles,
  ArrowRight,
  Library,
  ChevronLeft,
  Filter,
  Layers,
  Zap,
  PlayCircle
} from 'lucide-react';
import { recommendationService } from '../services/recommendationService';

const StudyMaterials = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const materials = await recommendationService.getStudyMaterials();
        setData(materials);
      } catch (err) {
        console.error('Failed to load study materials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return <Video size={20} />;
      case 'article': return <FileText size={20} />;
      case 'e-book': return <BookOpen size={20} />;
      default: return <Library size={20} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return 'text-[#E11D48] bg-[#FFF1F2] border-[#FDA4AF]/20';
      case 'article': return 'text-[#059669] bg-[#F0FDF4] border-[#6EE7B7]/20';
      case 'e-book': return 'text-[#D97706] bg-[#FFFBEB] border-[#FCD34D]/20';
      default: return 'text-[#2774AE] bg-[#EEF4F8] border-[#2774AE]/10';
    }
  };

  const SkeletonItem = () => (
    <div className="p-10 rounded-[3rem] bg-white border border-[var(--border-default)] animate-pulse space-y-6">
       <div className="flex justify-between">
          <div className="w-14 h-14 bg-[var(--bg-subtle)] rounded-2xl" />
          <div className="w-20 h-6 bg-[var(--bg-subtle)] rounded-full" />
       </div>
       <div className="space-y-3">
          <div className="h-6 w-2/3 bg-[var(--bg-subtle)] rounded-lg" />
          <div className="h-4 w-full bg-[var(--bg-subtle)] rounded-lg" />
          <div className="h-4 w-5/6 bg-[var(--bg-subtle)] rounded-lg" />
       </div>
       <div className="h-8 w-1/4 bg-[var(--bg-subtle)] rounded-lg pt-4" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-32">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 space-y-16">
        
        {/* HEADER AREA */}
        <header className="relative p-12 lg:p-16 rounded-[4rem] bg-[#002E5D] text-white overflow-hidden shadow-[0_40px_100px_rgba(0,46,93,0.3)]">
           <div className="absolute top-0 right-0 p-12 opacity-10">
              <Library size={300} />
           </div>
           <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--accent-primary)] rounded-full blur-[100px] opacity-20" />
           
           <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                 <Sparkles size={16} className="text-[var(--accent-primary)] animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Knowledge Matrix</span>
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                 <div className="space-y-4">
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
                      Study <span className="text-[var(--accent-primary)]">Materials</span>
                    </h1>
                    <p className="text-xl text-blue-100/70 font-medium max-w-xl leading-relaxed">
                      Advanced learning assets curated for <span className="text-white font-black underline decoration-[var(--accent-primary)] decoration-4 underline-offset-8">{data?.targetCareer || 'your roadmap'}</span>.
                    </p>
                 </div>
                 
                 <div className="relative w-full lg:w-[450px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search neural database..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/10 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all backdrop-blur-xl text-sm font-medium"
                    />
                 </div>
              </div>
           </div>
        </header>

        {/* NAVIGATION & FILTERING */}
        <div className="flex flex-wrap items-center justify-between gap-6 px-2">
           <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveCategory('All')}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === 'All' ? 'bg-[#2774AE] text-white shadow-lg' : 'bg-white border border-[var(--border-default)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                All Resources
              </button>
              {data?.categories?.map((cat, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveCategory(cat.categoryName)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat.categoryName ? 'bg-[#2774AE] text-white shadow-lg' : 'bg-white border border-[var(--border-default)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  {cat.categoryName}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-3 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
              <Filter size={16} />
              <span>Neural Filtering Active</span>
           </div>
        </div>

        {/* ASSETS GRID */}
        <div className="space-y-20">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               <SkeletonItem />
               <SkeletonItem />
               <SkeletonItem />
            </div>
          ) : (
            data?.categories?.filter(c => activeCategory === 'All' || c.categoryName === activeCategory).map((category, idx) => (
              <section key={idx} className="space-y-10">
                <div className="flex items-center gap-6 px-4">
                  <div className="w-1.5 h-10 bg-[#2774AE] rounded-full shadow-lg shadow-[#2774AE]/20" />
                  <div className="space-y-0.5">
                    <h2 className="text-3xl font-black text-[#0F172A] tracking-tight">{category.categoryName}</h2>
                    <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.3em]">Curated Intelligence Cluster</p>
                  </div>
                  <div className="h-[1px] flex-1 bg-[var(--border-default)] mx-6 hidden md:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {category.materials?.filter(m => 
                    m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    m.description.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((material, midx) => (
                    <motion.div
                      key={midx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -10 }}
                      className="group relative bg-white border border-[var(--border-default)] rounded-[3rem] p-10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:border-[#2774AE]/30 hover:shadow-[0_30px_100px_rgba(0,0,0,0.05)] transition-all duration-700"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#EEF4F8] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[3rem]" />
                      
                      <div className="relative z-10 space-y-8">
                        <div className="flex justify-between items-start">
                          <div className={`p-4 rounded-2xl border ${getTypeColor(material.type)} shadow-sm transition-all duration-500 group-hover:scale-110`}>
                            {getTypeIcon(material.type)}
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[var(--border-default)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[#64748B] shadow-sm">
                            <Clock size={12} />
                            {material.estimatedTime}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-2xl font-black text-[#0F172A] leading-tight group-hover:text-[#2774AE] transition-colors">
                            {material.title}
                          </h3>
                          <p className="text-sm text-[#475569] font-medium leading-[1.8] line-clamp-3">
                            {material.description}
                          </p>
                        </div>

                        <div className="pt-6 border-t border-[var(--border-default)] flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-[#64748B] uppercase tracking-[0.3em]">Resource Format</span>
                            <span className="text-[10px] font-black text-[#002E5D] uppercase tracking-widest">{material.type}</span>
                          </div>
                          <a 
                            href={material.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-[#EEF4F8] text-[#2774AE] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2774AE] hover:text-white transition-all shadow-sm flex items-center gap-2"
                          >
                            Launch
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* CUSTOM REQUEST BANNER */}
        {!loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 lg:p-20 rounded-[4rem] bg-[#2774AE] relative overflow-hidden shadow-[0_50px_120px_rgba(39,116,174,0.3)] text-center lg:text-left"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="space-y-6">
                 <div className="w-20 h-20 bg-white/10 rounded-[2rem] border border-white/20 flex items-center justify-center text-white shadow-inner">
                    <Sparkles size={40} />
                 </div>
                 <div className="space-y-3">
                   <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">Missing a specific asset?</h2>
                   <p className="text-blue-50 text-xl font-medium max-w-2xl opacity-90 leading-relaxed">
                     Our AI Mentor can synthesize a custom deep-dive guide or find specific documentation for any tool in the <span className="text-white font-black underline decoration-white/30 decoration-4 underline-offset-8">{data?.targetCareer}</span> stack.
                   </p>
                 </div>
              </div>
              <button className="px-12 py-6 bg-white text-[#2774AE] rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group">
                TALK TO NEXUS AI
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterials;
