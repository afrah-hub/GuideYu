import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronRight,
  Briefcase,
  TrendingUp,
  Sparkles,
  Target,
  LayoutGrid,
  List,
  ArrowUpRight,
  Clock,
  Layers,
  X,
  PlusCircle,
  FileDown,
  Wand2,
  Activity,
  BarChart3,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Cpu,
  Globe,
  Zap,
  Brain,
  ShieldCheck,
  Users,
  ChevronDown,
  Monitor,
  Rocket
} from 'lucide-react';
import adminService from '../../services/adminService';

// --- Sub-components for premium aesthetics ---

const StatCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="glass-panel p-10 relative overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border-white/5 bg-bg-surface/40 backdrop-blur-3xl"
  >
    {/* Animated Corner Glow */}
    <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${stat.bg}`} />
    
    <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity rotate-12 group-hover:rotate-0 duration-700">
      <stat.icon size={140} />
    </div>

    <div className="flex items-start justify-between relative z-10">
      <div className={`w-16 h-16 rounded-[1.8rem] ${stat.bg} ${stat.color} flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border border-white/10`}>
        <stat.icon size={32} />
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <TrendingUp size={12} /> +12.4%
        </div>
      </div>
    </div>

    <div className="mt-10 relative z-10">
      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-text-tertiary mb-2 opacity-60">{stat.label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-4xl font-black text-text-primary tracking-tighter group-hover:text-accent-primary transition-colors duration-500">{stat.value}</h4>
        {stat.unit && <span className="text-xs font-black text-text-tertiary uppercase tracking-widest">{stat.unit}</span>}
      </div>
      <p className="text-[10px] font-bold text-text-tertiary uppercase mt-4 tracking-widest flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${stat.color} animate-pulse`} />
        {stat.sub}
      </p>
    </div>
  </motion.div>
);

const CareerCard = ({ career, onOpen, onEdit, onDelete, viewMode, stats }) => {
  const enrollment = stats?.popularCareers?.find(c => c.name === career.title || c.id === career.id);
  const studentCount = enrollment?.userCount || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -12 }}
      onClick={() => onOpen(career)}
      className={`group cursor-pointer glass-panel p-12 relative overflow-hidden transition-all duration-700 bg-bg-surface/30 backdrop-blur-3xl border-white/5 hover:border-accent-primary/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] ${
        viewMode === 'grid' ? 'flex flex-col' : 'flex items-center gap-12'
      }`}
    >
      {/* Immersive Glass Accent */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent-primary/5 blur-[100px] group-hover:bg-accent-primary/10 transition-all duration-1000" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-accent-primary/10 to-transparent transition-all group-hover:from-accent-primary/20 group-hover:scale-150 duration-1000" />

      <div className={`relative z-10 ${viewMode === 'grid' ? 'mb-12' : 'shrink-0'}`}>
        <div className="w-20 h-20 rounded-[2rem] bg-bg-base border border-border-default/50 p-4 flex items-center justify-center shadow-2xl group-hover:border-accent-primary/40 group-hover:rotate-6 transition-all duration-700 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
          {career.thumbnailUrl ? (
            <img src={career.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <div className="relative z-10">
              {career.category === 'Technology' ? <Cpu className="w-10 h-10 text-accent-primary" /> :
               career.category === 'Design' ? <Target className="w-10 h-10 text-purple-500" /> :
               career.category === 'Business' ? <TrendingUp className="w-10 h-10 text-amber-500" /> :
               <Monitor className="w-10 h-10 text-blue-500" />}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-7 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-accent-primary/10 text-accent-primary text-[10px] font-black rounded-full border border-accent-primary/20 uppercase tracking-[0.2em]">
              {career.category}
            </span>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-warning/5 text-warning text-[10px] font-black uppercase tracking-widest rounded-full border border-warning/20">
              <Sparkles size={14} className="animate-pulse" />
              {career.difficulty}
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             <div className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">
                <ShieldCheck size={12} /> Verified
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-3xl font-display font-black text-text-primary tracking-tighter leading-none group-hover:text-accent-primary transition-colors duration-500">
            {career.title}
          </h3>
          <p className="text-base font-medium text-text-secondary leading-relaxed line-clamp-2 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
            {career.description || "Synthesizing deep neural parameters for advanced career trajectory optimization."}
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-5">
            <div className="flex -space-x-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-9 h-9 rounded-full border-4 border-bg-surface bg-bg-subtle flex items-center justify-center shadow-lg transition-transform hover:scale-110 hover:z-20 cursor-pointer ${
                  i === 0 ? 'bg-blue-500/20 text-blue-600' : i === 1 ? 'bg-purple-500/20 text-purple-600' : 'bg-emerald-500/20 text-emerald-600'
                }`}>
                  <Users size={12} />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
               <span className="text-[11px] font-black text-text-primary uppercase tracking-tight">
                {studentCount > 0 ? `${studentCount}+ Active` : 'Syncing...'}
               </span>
               <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">
                Student Reach
               </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-accent-primary/5 px-4 py-2 rounded-2xl border border-accent-primary/10 text-accent-primary group-hover:bg-accent-primary group-hover:text-white transition-all duration-500 shadow-inner">
            <Layers size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Architect</span>
          </div>
        </div>
      </div>

      <div className={`relative z-10 flex items-center gap-4 ${viewMode === 'grid' ? 'mt-12 pt-10 border-t border-white/5 w-full justify-between' : 'ml-auto'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(career); }}
            className="w-12 h-12 rounded-2xl bg-bg-surface/50 backdrop-blur-xl border border-white/10 text-text-tertiary hover:text-accent-primary hover:border-accent-primary/40 hover:shadow-xl hover:shadow-accent-primary/10 transition-all duration-300 flex items-center justify-center"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(career.id); }}
            className="w-12 h-12 rounded-2xl bg-bg-surface/50 backdrop-blur-xl border border-white/10 text-text-tertiary hover:text-danger hover:border-danger/40 hover:shadow-xl hover:shadow-danger/10 transition-all duration-300 flex items-center justify-center"
          >
            <Trash2 size={18} />
          </button>
        </div>
        <div className="w-14 h-14 rounded-full bg-bg-base border border-white/10 flex items-center justify-center text-text-tertiary group-hover:bg-accent-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-45 transition-all duration-700 shadow-2xl">
          <ArrowUpRight size={22} />
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---

const AdminCareers = () => {
  const [careers, setCareers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [editingCareer, setEditingCareer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Intermediate',
    category: 'Technology',
    thumbnailUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [careersData, statsData] = await Promise.all([
        adminService.getCareers(),
        adminService.getStats()
      ]);
      setCareers(careersData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoadmaps = async (careerId) => {
    try {
      setRoadmapsLoading(true);
      const data = await adminService.getRoadmaps(careerId);
      setRoadmaps(data);
    } catch (error) {
      console.error("Failed to fetch roadmaps", error);
    } finally {
      setRoadmapsLoading(false);
    }
  };

  const handleOpenDrawer = (career) => {
    setSelectedCareer(career);
    setIsDrawerOpen(true);
    fetchRoadmaps(career.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCareer) {
        await adminService.updateCareer(editingCareer.id, formData);
      } else {
        await adminService.createCareer(formData);
      }
      setIsModalOpen(false);
      setEditingCareer(null);
      setFormData({ title: '', description: '', difficulty: 'Intermediate', category: 'Technology', thumbnailUrl: '' });
      fetchData();
    } catch (error) {
      alert("Failed to save career protocol");
    }
  };

  const handleEdit = (career) => {
    setEditingCareer(career);
    setFormData({
      title: career.title,
      description: career.description || '',
      difficulty: career.difficulty || 'Intermediate',
      category: career.category || 'Technology',
      thumbnailUrl: career.thumbnailUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Authorize permanent deletion of this sector protocol?")) {
      try {
        await adminService.deleteCareer(id);
        fetchData();
        if (selectedCareer?.id === id) setIsDrawerOpen(false);
      } catch (error) {
        alert("Failed to delete career sector");
      }
    }
  };

  const overviewStats = useMemo(() => {
    const total = careers.length;
    const categories = [...new Set(careers.map(c => c.category))].length;
    const recent = careers.length > 0 ? careers[careers.length - 1].title : "Analyzing...";
    return [
      { label: 'Neural Paths', value: total, unit: 'Sectors', icon: Brain, color: 'text-accent-primary', bg: 'bg-accent-primary/10', sub: 'Ecosystem Active' },
      { label: 'Knowledge Domains', value: categories, unit: 'Core', icon: Globe, color: 'text-purple-500', bg: 'bg-purple-500/10', sub: 'Global Taxonomy' },
      { label: 'Market Priority', value: recent, icon: Rocket, color: 'text-amber-500', bg: 'bg-amber-500/10', sub: 'Latest Deployment' },
      { label: 'Sync Status', value: '100%', unit: 'Live', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10', sub: 'Neural Stability' },
    ];
  }, [careers]);

  const filteredCareers = useMemo(() => {
    return careers.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || c.category === activeCategory;
      const matchesDifficulty = activeDifficulty === "All" || c.difficulty === activeDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [careers, searchTerm, activeCategory, activeDifficulty]);

  const categoriesList = ["All", ...new Set(careers.map(c => c.category))];

  return (
    <div className="max-w-[1700px] mx-auto space-y-16 pb-40">

      {/* 1. FUTURISTIC HERO SECTION */}
      <div className="relative p-12 md:p-20 rounded-[5rem] bg-bg-surface border border-white/5 overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]">
        {/* Deep Mesh Background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-bl from-accent-primary/20 via-transparent to-transparent blur-[120px] animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/10 via-transparent to-transparent blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-16">
          <div className="space-y-10">
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity } }}
                className="w-20 h-20 rounded-[2.5rem] bg-gradient-brand flex items-center justify-center text-white shadow-[0_20px_50px_rgba(39,116,174,0.4)] relative"
              >
                <Cpu size={36} className="relative z-10" />
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full animate-pulse" />
              </motion.div>
              <div className="h-14 w-[1px] bg-border-default/50" />
              <div className="space-y-1">
                <span className="px-5 py-2 bg-accent-primary/10 text-accent-primary rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-accent-primary/20 block">
                  Neural Architect v3.0
                </span>
                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Admin Control Console</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <h1 className="text-7xl font-display font-black text-text-primary tracking-tighter leading-[0.95] lowercase first-letter:uppercase">
                Career <span className="text-accent-primary">Intelligence</span>
              </h1>
              <p className="text-xl font-medium text-text-secondary max-w-3xl leading-relaxed opacity-80">
                Architect high-fidelity learning ecosystems, predictive roadmaps, and adaptive career progression paths with next-gen neural synchronization.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button className="flex items-center gap-4 px-10 py-6 rounded-[2rem] bg-bg-surface/50 backdrop-blur-2xl border border-white/10 text-[12px] font-black uppercase tracking-[0.25em] text-text-secondary hover:bg-bg-subtle transition-all shadow-xl">
              <FileDown size={22} /> Export Schema
            </button>
            <button
              onClick={() => { setEditingCareer(null); setFormData({ title: '', description: '', difficulty: 'Intermediate', category: 'Technology', thumbnailUrl: '' }); setIsModalOpen(true); }}
              className="flex items-center gap-5 px-14 py-7 rounded-[2rem] bg-gradient-brand text-white text-[12px] font-black uppercase tracking-[0.25em] shadow-[0_30px_60px_-15px_rgba(39,116,174,0.5)] hover:scale-105 active:scale-95 transition-all relative group/btn overflow-hidden"
            >
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <PlusCircle size={24} /> Initialize Path
            </button>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS MESH GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
        {overviewStats.map((stat, i) => (
          <StatCard key={i} stat={stat} index={i} />
        ))}
      </div>

      {/* 3. INTELLIGENT NAVIGATION HUB */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 sticky top-8 z-40 flex flex-col lg:flex-row gap-6 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] bg-bg-surface/60 backdrop-blur-3xl border-white/10"
      >
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-tertiary group-focus-within:text-accent-primary transition-colors" />
          <input
            type="text"
            placeholder="Search ecosystem database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-base/50 border border-border-default/50 rounded-[1.8rem] py-5 pl-16 pr-8 text-sm font-bold placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-8 focus:ring-accent-primary/5 transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-bg-base/50 p-2.5 rounded-[1.8rem] border border-border-default/50">
            {categoriesList.slice(0, 4).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${activeCategory === cat ? 'bg-bg-surface shadow-[0_10px_30px_rgba(0,0,0,0.1)] text-accent-primary' : 'text-text-tertiary hover:text-text-primary'}`}
              >
                {cat}
              </button>
            ))}
            <div className="h-8 w-[1px] bg-border-default/50 mx-2" />
            <button className="p-3 text-text-tertiary hover:text-text-primary hover:rotate-180 transition-all duration-700">
              <ChevronDown size={22} />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-bg-base/50 p-2 rounded-[1.5rem] border border-border-default/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-4 rounded-xl transition-all duration-500 ${viewMode === 'grid' ? 'bg-accent-primary shadow-lg shadow-accent-primary/20 text-white' : 'text-text-tertiary hover:text-text-primary'}`}
            >
              <LayoutGrid size={22} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-4 rounded-xl transition-all duration-500 ${viewMode === 'list' ? 'bg-accent-primary shadow-lg shadow-accent-primary/20 text-white' : 'text-text-tertiary hover:text-text-primary'}`}
            >
              <List size={22} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 4. SECTOR GRID — Grouped by Field */}
      <div className="space-y-24">
        {categoriesList.filter(cat => cat !== "All").map((category, catIdx) => {
          const categoryCareers = filteredCareers.filter(c => c.category === category).slice(0, 2);
          if (categoryCareers.length === 0) return null;

          return (
            <section key={category} className="space-y-12">
              <div className="flex items-center gap-10">
                 <div className="w-20 h-20 rounded-[2.5rem] bg-accent-primary/10 flex items-center justify-center text-accent-primary border border-accent-primary/20 shadow-inner group overflow-hidden relative">
                    <div className="absolute inset-0 bg-accent-primary/5 blur-2xl animate-pulse" />
                    {category === 'Technology' ? <Cpu size={36} className="relative z-10" /> : 
                     category === 'Design' ? <Target size={36} className="relative z-10" /> : 
                     category === 'Business' ? <TrendingUp size={36} className="relative z-10" /> : 
                     category === 'Healthcare' ? <Activity size={36} className="relative z-10" /> : <Briefcase size={36} className="relative z-10" />}
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-4xl font-display font-black text-text-primary tracking-tighter lowercase first-letter:uppercase">{category} Ecosystem</h3>
                    <div className="flex items-center gap-4">
                       <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.4em] opacity-60">Sectors Deployed: {categoryCareers.length}</p>
                       <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                       <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Active Sync</p>
                    </div>
                 </div>
                 <div className="flex-1 h-[1px] bg-gradient-to-r from-border-default to-transparent ml-6" />
              </div>

              <div className={`grid gap-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {categoryCareers.map((career) => (
                  <CareerCard 
                    key={career.id} 
                    career={career} 
                    viewMode={viewMode}
                    stats={stats}
                    onOpen={handleOpenDrawer}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* 5. DRAWER & MODAL — Enhanced Styling */}
      {/* (Kept existing functional logic but with modernized UI tokens in sub-components) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-text-primary/20 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 35, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-3xl bg-bg-surface/80 backdrop-blur-[60px] shadow-[-50px_0_150px_rgba(0,0,0,0.15)] z-[101] overflow-hidden flex flex-col border-l border-white/10"
            >
              {/* Modern Header for Drawer */}
              <div className="p-10 md:p-14 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-8">
                  <button onClick={() => setIsDrawerOpen(false)} className="w-14 h-14 bg-bg-base hover:bg-bg-subtle rounded-2xl transition-all flex items-center justify-center text-text-tertiary hover:rotate-12">
                    <ArrowLeft size={24} />
                  </button>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-primary block">Sector Diagnostic</span>
                    <h2 className="text-3xl font-display font-black text-text-primary tracking-tighter">{selectedUser?.fullName || selectedCareer?.title}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleEdit(selectedCareer)} className="w-12 h-12 hover:bg-white/10 rounded-2xl text-text-tertiary hover:text-accent-primary transition-all flex items-center justify-center"><Edit2 size={20} /></button>
                  <button onClick={() => setIsDrawerOpen(false)} className="w-12 h-12 hover:bg-white/10 rounded-2xl text-text-tertiary transition-all flex items-center justify-center"><X size={26} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 md:p-20 space-y-20 custom-scrollbar relative">
                 <div className="absolute top-0 left-24 bottom-0 w-[1px] bg-gradient-to-b from-accent-primary/20 via-border-default/30 to-transparent pointer-events-none" />
                 
                 <section className="space-y-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-start gap-12">
                       <div className="w-40 h-40 rounded-[4rem] bg-bg-base border border-white/10 flex items-center justify-center text-accent-primary shadow-[0_30px_60px_rgba(0,0,0,0.1)] relative group overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-brand opacity-5 group-hover:opacity-10 transition-opacity" />
                          {selectedCareer?.thumbnailUrl ? (
                            <img src={selectedCareer.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-[3.8rem]" />
                          ) : (
                            <Cpu size={64} className="relative z-10" />
                          )}
                       </div>
                       <div className="flex-1 space-y-8">
                          <div className="flex flex-wrap items-center gap-4">
                            <span className="px-6 py-2 bg-accent-primary/10 text-accent-primary text-[11px] font-black rounded-full border border-accent-primary/20 uppercase tracking-widest">{selectedCareer?.category}</span>
                            <span className="px-6 py-2 bg-warning/5 text-warning text-[11px] font-black rounded-full border border-warning/20 uppercase tracking-widest">{selectedCareer?.difficulty} Grade</span>
                          </div>
                          <h3 className="text-5xl font-display font-black text-text-primary leading-[1] tracking-tighter lowercase first-letter:uppercase">{selectedCareer?.title}</h3>
                          <div className="flex flex-wrap items-center gap-10 text-xs font-bold text-text-tertiary uppercase tracking-widest">
                            <span className="flex items-center gap-3"><Clock size={18} className="text-accent-primary" /> Deployed: 12.05.26</span>
                            <span className="flex items-center gap-3"><Globe size={18} className="text-purple-500" /> Availability: Global</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-12 rounded-[4rem] bg-bg-subtle/30 backdrop-blur-2xl border border-white/5 shadow-inner">
                       <p className="text-2xl font-medium text-text-secondary leading-relaxed italic opacity-90 tracking-tight">
                          "{selectedCareer?.description || "Career sector initialized with standard neural parameters for adaptive learning systems."}"
                       </p>
                    </div>
                 </section>

                 <section className="space-y-12 relative z-10">
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary border border-accent-primary/20 shadow-inner">
                             <Layers size={28} />
                          </div>
                          <div>
                             <h4 className="text-2xl font-black text-text-primary tracking-tighter uppercase">Ecosystem Map</h4>
                             <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mt-1">Architecture Diagnostics</p>
                          </div>
                       </div>
                       <button className="px-8 py-3 bg-gradient-brand text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">
                          <Plus size={18} /> New Roadmap
                       </button>
                    </div>

                    <div className="space-y-8">
                       {roadmapsLoading ? (
                         [1, 2].map(i => <div key={i} className="h-32 bg-white/5 rounded-[2.5rem] animate-pulse" />)
                       ) : roadmaps.length > 0 ? (
                         roadmaps.map((roadmap, idx) => (
                           <div key={roadmap.id} className="group p-10 bg-white/5 border border-white/5 rounded-[3rem] hover:border-accent-primary/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-accent-primary/5 flex items-center gap-10">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl text-xl font-black ${
                                idx === 0 ? 'bg-gradient-brand' : idx === 1 ? 'bg-purple-600' : 'bg-amber-600'
                              }`}>
                                 {idx + 1}
                              </div>
                              <div className="flex-1 space-y-2">
                                 <h5 className="text-xl font-black text-text-primary tracking-tight">{roadmap.title}</h5>
                                 <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-accent-primary uppercase tracking-widest">{roadmap.difficulty || 'Advanced'} Grade</span>
                                    <div className="w-1 h-1 bg-border-default rounded-full" />
                                    <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">12 Active Modules</span>
                                 </div>
                              </div>
                              <button className="w-14 h-14 rounded-2xl bg-bg-base hover:bg-accent-primary text-text-tertiary hover:text-white transition-all duration-500 flex items-center justify-center">
                                 <ArrowUpRight size={24} />
                              </button>
                           </div>
                         ))
                       ) : (
                         <div className="py-24 text-center glass-panel border-dashed border-2 space-y-8 bg-white/5">
                            <div className="w-24 h-24 bg-bg-subtle rounded-[2.5rem] flex items-center justify-center mx-auto text-text-tertiary/20 shadow-inner">
                               <Zap size={48} />
                            </div>
                            <div className="space-y-3">
                               <h5 className="text-2xl font-black text-text-primary uppercase tracking-tight">No Active Architecture</h5>
                               <p className="text-sm font-medium text-text-tertiary max-w-xs mx-auto">Initialize the first roadmap trajectory to start student synchronization.</p>
                            </div>
                            <button className="btn-primary py-4 px-10 text-[10px] font-black tracking-widest">DEPLOY TRAJECTORY</button>
                         </div>
                       )}
                    </div>
                 </section>
              </div>

              <div className="p-12 border-t border-white/5 bg-white/5 backdrop-blur-3xl grid grid-cols-2 gap-8">
                 <button onClick={() => handleDelete(selectedCareer?.id)} className="flex items-center justify-center gap-4 py-6 bg-bg-surface border border-danger/20 text-danger rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-danger/10 transition-all">
                    <Trash2 size={22} /> Archive Protocol
                 </button>
                 <button onClick={() => handleEdit(selectedCareer)} className="flex items-center justify-center gap-4 py-6 bg-text-primary text-bg-surface rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl">
                    <Rocket size={22} /> Update Deployment
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-text-primary/30 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-bg-surface/90 backdrop-blur-3xl p-14 md:p-20 rounded-[5rem] shadow-[0_100px_150px_-30px_rgba(0,0,0,0.4)] border border-white/10 overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-brand" />
               <div className="absolute -top-20 -right-20 opacity-[0.05] rotate-12"><Brain size={300} /></div>

               <div className="mb-16 flex items-center justify-between relative z-10">
                  <div className="space-y-3">
                     <h2 className="text-5xl font-display font-black text-text-primary tracking-tighter lowercase first-letter:uppercase">
                        {editingCareer ? 'Update' : 'Deploy'} Sector
                     </h2>
                     <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.4em] block">Neural Configuration Protocol</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-16 h-16 bg-bg-base hover:bg-bg-subtle rounded-3xl transition-all flex items-center justify-center text-text-tertiary hover:rotate-90 duration-500">
                     <X size={32} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                  <div className="space-y-4">
                     <label className="text-[12px] font-black text-text-tertiary uppercase tracking-[0.3em] ml-2">Sector Identity</label>
                     <input 
                        required
                        type="text"
                        placeholder="e.g. QUANTUM ARCHITECT"
                        className="w-full h-20 bg-bg-base border border-border-default rounded-[2rem] px-10 font-black text-lg uppercase tracking-widest focus:outline-none focus:border-accent-primary focus:ring-[12px] focus:ring-accent-primary/5 transition-all shadow-inner"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                     />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[12px] font-black text-text-tertiary uppercase tracking-[0.3em] ml-2">Mission Parameters</label>
                     <textarea 
                        rows={4}
                        placeholder="Detail the sector trajectory and synchronization goals..."
                        className="w-full py-8 px-10 bg-bg-base border border-border-default rounded-[2rem] font-bold text-lg leading-relaxed resize-none focus:outline-none focus:border-accent-primary focus:ring-[12px] focus:ring-accent-primary/5 transition-all shadow-inner"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[12px] font-black text-text-tertiary uppercase tracking-[0.3em] ml-2">Intensity</label>
                        <div className="relative">
                           <select 
                             className="w-full h-16 bg-bg-base border border-border-default rounded-[2rem] px-8 font-black text-xs uppercase tracking-widest appearance-none cursor-pointer focus:outline-none focus:border-accent-primary transition-all"
                             value={formData.difficulty}
                             onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                           >
                              <option>Beginner</option>
                              <option>Intermediate</option>
                              <option>Advanced</option>
                           </select>
                           <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={20} />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[12px] font-black text-text-tertiary uppercase tracking-[0.3em] ml-2">Domain</label>
                        <div className="relative">
                           <select 
                             className="w-full h-16 bg-bg-base border border-border-default rounded-[2rem] px-8 font-black text-xs uppercase tracking-widest appearance-none cursor-pointer focus:outline-none focus:border-accent-primary transition-all"
                             value={formData.category}
                             onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                           >
                              <option>Technology</option>
                              <option>Business</option>
                              <option>Design</option>
                              <option>Healthcare</option>
                           </select>
                           <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" size={20} />
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-8 pt-10">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-20 bg-bg-base border border-border-default text-text-tertiary rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-bg-subtle transition-all">Abort</button>
                     <button type="submit" className="flex-1 h-20 bg-text-primary text-bg-surface rounded-[2rem] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl hover:opacity-90 transition-all">Commit Sector</button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCareers;
