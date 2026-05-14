import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Lock,
  Sparkles,
  Zap,
  Brain,
  MessageSquare,
  HelpCircle,
  PlayCircle,
  Clock,
  Layout,
  ArrowLeft,
  MoreVertical,
  Check,
  RefreshCw,
  Target,
  Search,
  Trophy,
  Flame,
  Star,
  Bookmark,
  StickyNote,
  Maximize2,
  Minimize2,
  Info,
  Lightbulb,
  FileText,
  Activity,
  Award,
  AlertCircle,
  Glasses,
  Image as ImageIcon,
  Table as TableIcon,
  List,
  PenTool,
  Quote
} from 'lucide-react';

const LessonsScreen = () => {
  const { roadmapId, moduleId, topicId } = useParams();
  const [searchParams] = useSearchParams();
  const career = searchParams.get('career') || "Software Engineer";
  const navigate = useNavigate();
  
  // State
  const [roadmap, setRoadmap] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedModules, setExpandedModules] = useState({});
  const [activeSection, setActiveSection] = useState('learn'); // learn, practice, quiz
  const [readingProgress, setReadingProgress] = useState(0);

  const contentRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: contentRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track reading progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => setReadingProgress(Math.round(v * 100)));
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 1. Fetch Roadmap
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await fetch(`/api/lessons/roadmap/${roadmapId}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setRoadmap(data);
          const currentM = data.find(m => m.Topics?.some(t => (t.Id || t.id)?.toString() === topicId || (t.Title || t.title) === topicId || (t.TopicKey || t.topicKey) === topicId));
          if (currentM) {
            setExpandedModules(prev => ({ ...prev, [currentM.Id || currentM.id]: true }));
          }
        }
      } catch (err) {
        console.error("[LessonsScreen] Failed to fetch roadmap:", err);
      }
    };
    fetchRoadmap();
  }, [roadmapId, topicId]);

  // 2. Fetch Lesson Content
  useEffect(() => {
    const fetchLessonContent = async () => {
      if (!roadmap.length) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let currentTopic = null;
        for (const m of roadmap) {
          const t = m.Topics?.find(top => 
            (top.Id || top.id)?.toString() === topicId || 
            (top.TopicKey || top.topicKey) === topicId || 
            (top.Title || top.title) === topicId
          );
          if (t) {
            currentTopic = t;
            break;
          }
        }

        if (!currentTopic) {
          if (roadmapId === "0" || roadmapId === 0) {
            currentTopic = {
              title: decodeURIComponent(topicId),
              topicKey: topicId,
              difficulty: "Intermediate"
            };
            console.log("[LessonsScreen] Dynamic Mode: Created virtual topic from URL:", currentTopic);
          } else {
            setLoading(false);
            setError("Topic not found in your learning path.");
            return;
          }
        }

        const topicIdenfier = currentTopic.TopicKey || currentTopic.topicKey || currentTopic.Title || currentTopic.title;
        const topicTitle = currentTopic.Title || currentTopic.title;
        const topicDifficulty = currentTopic.Difficulty || currentTopic.difficulty || "Intermediate";

        const url = `/api/lessons/content?topic=${encodeURIComponent(topicIdenfier)}&career=${encodeURIComponent(career)}&difficulty=${encodeURIComponent(topicDifficulty)}`;
        console.log("[LessonsScreen] Fetching lesson from:", url);

        const res = await fetch(url, { credentials: 'include' });
        
        if (res.ok) {
          const data = await res.json();
          setLesson({
            title: data?.title || topicTitle || "Untitled Lesson",
            content: data?.content || "",
            keyConcepts: data?.keyConcepts || [],
            examples: data?.examples || [],
            summary: data?.summary || "",
            difficulty: data?.difficulty || topicDifficulty,
            practicalApps: data?.practicalApps || [
               "Implementing core patterns in modern frameworks",
               "Scalability analysis for enterprise systems",
               "Security audit and compliance verification"
            ]
          });
          setError(null);
        } else {
          const errData = await res.json().catch(() => ({}));
          setError(errData.message || "AI Mentor is currently busy. Please try again.");
        }
      } catch (err) {
        console.error("[LessonsScreen] Fetch Exception:", err);
        setError("Neural connection lost. Please check your internet.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonContent();
  }, [topicId, roadmap, career]);

  const currentModule = roadmap.find(m => m.Topics?.some(t => (t.Id || t.id)?.toString() === topicId || (t.Title || t.title) === topicId || (t.TopicKey || t.topicKey) === topicId));
  const currentIndex = currentModule?.Topics?.findIndex(t => (t.Id || t.id)?.toString() === topicId || (t.Title || t.title) === topicId || (t.TopicKey || t.topicKey) === topicId) || 0;

  const handleAction = async (actionType) => {
    try {
      setAiLoading(true);
      setAiAssistantOpen(true);
      const res = await fetch(`/api/lessons/ai/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          actionType, 
          context: lesson?.content,
          targetCareer: career 
        }),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.response);
      }
    } catch (err) {
      console.error("[LessonsScreen] AI Action failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const toggleModule = (id) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const LessonSkeleton = () => (
    <div className="space-y-12 py-10">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-64 bg-[var(--bg-subtle)] animate-pulse rounded-lg" />
            <div className="h-3 w-40 bg-[var(--bg-subtle)] animate-pulse rounded-lg" />
          </div>
        </div>
        <div className="h-[300px] w-full bg-[var(--bg-subtle)] animate-pulse rounded-[3rem]" />
        <div className="grid grid-cols-2 gap-6">
           <div className="h-40 bg-[var(--bg-subtle)] animate-pulse rounded-3xl" />
           <div className="h-40 bg-[var(--bg-subtle)] animate-pulse rounded-3xl" />
        </div>
      </div>
    </div>
  );

  const SectionCard = ({ icon: Icon, title, children, color = "text-[#2774AE]", bg = "bg-[#EEF4F8]" }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-10 rounded-[2.5rem] bg-white border border-[var(--border-default)] shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${bg} ${color}`}>
            <Icon size={24} />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[#0F172A]">{title}</h3>
        </div>
        <MoreVertical size={18} className="text-[var(--text-tertiary)]" />
      </div>
      <div className="relative z-10 prose prose-slate max-w-none">
        {children}
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen bg-[#F8FAFC] flex overflow-hidden selection:bg-[var(--accent-primary-subtle)]">
      
      {/* 1. LEFT SIDEBAR — ADAPTIVE SYLLABUS */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 320 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="h-full bg-white border-r border-[var(--border-default)] flex flex-col relative z-40"
      >
        <div className="p-6 border-b border-[var(--border-default)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-[#0F172A] tracking-widest uppercase flex items-center gap-2">
              <List size={16} /> Course Path
            </h2>
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-[var(--bg-subtle)] rounded-lg transition-colors">
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <div className="p-4 bg-gradient-brand rounded-2xl text-white space-y-3 mb-6">
             <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase opacity-80">Module Status</p>
                <div className="px-2 py-0.5 bg-white/20 rounded-md text-[9px] font-bold">ACTIVE</div>
             </div>
             <p className="text-xs font-black leading-tight">{currentModule?.Title || currentModule?.title || "Career Roadmap"}</p>
             <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentIndex / (currentModule?.Topics?.length || 1)) * 100}%` }}
                  className="h-full bg-white" 
                />
             </div>
          </div>

          {roadmap.map((module) => (
            <div key={module.Id || module.id} className="space-y-2">
              <button 
                onClick={() => toggleModule(module.Id || module.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${expandedModules[module.Id || module.id] ? 'bg-[#EEF4F8] border-[#2774AE]/20' : 'bg-white border-[var(--border-default)] hover:border-[#2774AE]/30'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${expandedModules[module.Id || module.id] ? 'bg-[#2774AE] text-white' : 'bg-[var(--bg-subtle)] text-[var(--text-tertiary)]'}`}>
                    {module.Topics?.length || 0}
                  </div>
                  <span className="text-xs font-black text-[#0F172A] text-left leading-tight">{module.Title || module.title}</span>
                </div>
              </button>
              
              <AnimatePresence>
                {expandedModules[module.Id || module.id] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-1 pl-2"
                  >
                    {module.Topics?.map((topic) => {
                       const isActive = (topic.Id || topic.id)?.toString() === topicId || (topic.Title || topic.title) === topicId || (topic.TopicKey || topic.topicKey) === topicId;
                       return (
                        <button
                          key={topic.Id || topic.id}
                          onClick={() => navigate(`/lessons/${roadmapId}/${module.Id || module.id}/${encodeURIComponent(topic.id || topic.Title || topic.title)}?career=${encodeURIComponent(career)}`)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${isActive ? 'bg-white shadow-md border border-[#2774AE]/20' : 'hover:bg-white/50'}`}
                        >
                           <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#2774AE] shadow-[0_0_8px_rgba(39,116,174,0.5)]' : topic.IsCompleted ? 'bg-emerald-500' : 'bg-[var(--border-strong)] opacity-30 group-hover:opacity-100'}`} />
                           <span className={`text-[11px] font-bold text-left leading-tight ${isActive ? 'text-[#0F172A]' : 'text-[#64748B] group-hover:text-[#0F172A]'}`}>{topic.Title || topic.title}</span>
                        </button>
                       );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* 2. CENTER CONTENT AREA — AI LEARNING WORKSPACE */}
      <div className="flex-1 h-full relative bg-[#F8FAFC] flex flex-col overflow-hidden">
        
        {/* Scroll Progress Overlay */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--bg-subtle)] z-50">
           <motion.div 
             className="h-full bg-gradient-brand origin-left"
             style={{ scaleX: scrollYProgress }}
           />
        </div>

        {!sidebarOpen && (
          <button 
            onClick={() => setSidebarOpen(true)}
            className="absolute top-12 left-6 z-40 p-3 bg-white border border-[var(--border-default)] rounded-2xl shadow-xl hover:scale-105 transition-all text-[var(--accent-primary)]"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* 2.1 Premium Workspace Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-[var(--border-default)] px-8 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-6 min-w-0">
            <Link to={`/syllabus?module=${encodeURIComponent(currentModule?.Title || currentModule?.title || '')}&career=${encodeURIComponent(career)}`} className="p-2 hover:bg-[var(--bg-subtle)] rounded-xl transition-colors text-[var(--text-tertiary)]">
              <ArrowLeft size={20} />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest truncate">
                <span>{career}</span>
                <ChevronRight size={10} />
                <span className="text-[var(--accent-primary)]">{lesson?.title || 'Neural Stream'}</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                 <h1 className="text-base font-black text-[#0F172A] truncate">
                   {lesson?.title || 'Synchronizing...'}
                 </h1>
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[var(--bg-subtle)] rounded-full border border-[var(--border-default)]">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase text-[var(--text-tertiary)]">AI Active</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-[var(--bg-subtle)] rounded-2xl border border-[var(--border-default)]">
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black uppercase tracking-tighter text-[var(--text-tertiary)]">Module Progress</span>
                   <span className="text-xs font-black text-[var(--accent-primary)]">{readingProgress}%</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[var(--accent-primary)] shadow-sm">
                   <Target size={20} />
                </div>
             </div>
             <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className="p-2.5 hover:bg-[var(--bg-subtle)] rounded-xl transition-colors text-[var(--text-tertiary)]">
               <Activity size={20} />
             </button>
          </div>
        </header>

        {/* 2.2 Learning Flow Navigation */}
        <div className="h-14 bg-white border-b border-[var(--border-default)] px-8 flex items-center gap-8 z-20 shrink-0">
           {[
             { id: 'learn', label: '1. Learn', icon: BookOpen },
             { id: 'practice', label: '2. Practice', icon: PenTool },
             { id: 'quiz', label: '3. Mini Quiz', icon: HelpCircle },
             { id: 'reflection', label: '4. Reflection', icon: Brain }
           ].map(step => (
             <button 
               key={step.id}
               onClick={() => setActiveSection(step.id)}
               className={`flex items-center gap-2 h-full px-2 border-b-2 transition-all text-xs font-black uppercase tracking-widest ${activeSection === step.id ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
             >
               <step.icon size={14} />
               {step.label}
             </button>
           ))}
        </div>

        {/* 2.3 Main Scrollable Workspace */}
        <main 
          ref={contentRef} 
          className="flex-1 overflow-y-auto scroll-smooth relative min-h-0 bg-[#F8FAFC]"
        >
          <div className="max-w-4xl mx-auto px-8 py-12 lg:px-12 space-y-12 pb-40">
            
            {loading ? (
              <LessonSkeleton />
            ) : error ? (
              <div className="py-20 text-center space-y-8">
                <div className="w-24 h-24 bg-[var(--color-danger-subtle)] text-[var(--color-danger)] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl">
                   <AlertCircle size={48} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-[#0F172A]">Neural Mentor Interrupted</h2>
                  <p className="text-[var(--text-secondary)] max-w-md mx-auto text-lg font-medium">{error}</p>
                </div>
                <button onClick={() => window.location.reload()} className="px-10 py-4 bg-[var(--accent-primary)] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                   Retry Generation
                </button>
              </div>
            ) : (
              <div className="space-y-16">
                
                {/* LEARN SECTION */}
                {activeSection === 'learn' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    {/* Overview Header */}
                    <header className="space-y-6">
                       <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-200">{lesson?.difficulty}</span>
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-200">15 MINS READ</span>
                       </div>
                       <h2 className="text-5xl font-black tracking-tight text-[#0F172A] leading-tight">{lesson?.title}</h2>
                       <p className="text-xl text-[#475569] font-medium leading-relaxed max-w-2xl">
                          Dive into the core foundations and architectural principles of this domain.
                       </p>
                    </header>

                    {/* Lesson Body Cards */}
                    <div className="space-y-8">
                       {lesson?.content?.split('\n\n').map((para, i) => (
                         <div key={i} className="group relative p-10 bg-white rounded-[2.5rem] border border-[var(--border-default)] hover:border-[var(--accent-primary-subtle)] transition-all shadow-sm">
                            {i === 0 && <div className="absolute -top-4 left-10 px-4 py-2 bg-[#002E5D] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Introduction</div>}
                            <p className="text-xl leading-[1.8] text-[#475569] font-medium">
                               {para}
                            </p>
                            <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => handleAction('Simplify')} className="p-2 bg-[var(--bg-subtle)] rounded-lg text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all"><Glasses size={16}/></button>
                               <button onClick={() => handleAction('Summarize')} className="p-2 bg-[var(--bg-subtle)] rounded-lg text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all"><FileText size={16}/></button>
                            </div>
                         </div>
                       ))}
                    </div>

                    {/* Key Concepts Grid */}
                    <section className="space-y-8">
                       <div className="flex items-center gap-4">
                          <div className="h-[1px] flex-1 bg-[var(--border-default)]" />
                          <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-tertiary)]">Core Principles</h3>
                          <div className="h-[1px] flex-1 bg-[var(--border-default)]" />
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {lesson?.keyConcepts?.map((concept, i) => (
                             <motion.div 
                               key={i} 
                               whileHover={{ scale: 1.02 }}
                               className="p-6 bg-white border border-[var(--border-default)] rounded-3xl flex items-start gap-4 group cursor-pointer hover:border-[var(--accent-primary)]"
                             >
                                <div className="w-10 h-10 rounded-2xl bg-[#EEF4F8] flex items-center justify-center text-[#2774AE] group-hover:bg-[#2774AE] group-hover:text-white transition-all">
                                   <Zap size={20} />
                                </div>
                                <div className="space-y-1">
                                   <p className="text-sm font-black text-[#0F172A]">{concept}</p>
                                   <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Core Concept</p>
                                </div>
                             </motion.div>
                          ))}
                       </div>
                    </section>

                    {/* Visual Support Callout */}
                    <div className="p-12 rounded-[3rem] bg-[#002E5D] text-white space-y-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12"><Brain size={300} /></div>
                       <div className="space-y-4 relative z-10">
                          <div className="flex items-center gap-3">
                             <ImageIcon className="text-[var(--accent-primary)]" size={24} />
                             <h4 className="text-sm font-black uppercase tracking-widest">Mental Model Illustration</h4>
                          </div>
                          <div className="aspect-video rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center flex-col space-y-4">
                             <TableIcon size={48} className="text-white/20" />
                             <p className="text-sm font-bold text-white/40">Visual structure dynamically synthesized by AI...</p>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {/* PRACTICE SECTION */}
                {activeSection === 'practice' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                     <SectionCard icon={PenTool} title="Hands-on Exercise" color="text-purple-600" bg="bg-purple-50">
                        <p className="text-xl font-medium text-[#475569] leading-relaxed">
                           Based on your {career} roadmap, here is a practical application of these concepts. Try to architect a solution for the following scenario:
                        </p>
                        <div className="mt-8 p-8 bg-[#F8FAFC] border-2 border-dashed border-[var(--border-default)] rounded-3xl">
                           <ul className="space-y-4">
                              {lesson?.practicalApps?.map((app, i) => (
                                 <li key={i} className="flex items-center gap-4 text-sm font-bold text-[#0F172A]">
                                    <Check size={18} className="text-emerald-500" /> {app}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </SectionCard>
                  </motion.div>
                )}

                {/* QUIZ SECTION */}
                {activeSection === 'quiz' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                     <div className="p-12 rounded-[3rem] bg-white border border-[var(--border-default)] space-y-10 shadow-xl">
                        <div className="text-center space-y-4">
                           <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                              <HelpCircle size={40} />
                           </div>
                           <h3 className="text-3xl font-black text-[#0F172A]">Neural Knowledge Check</h3>
                           <p className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Verify your mastery of this lesson</p>
                        </div>
                        <button onClick={() => handleAction('Generate Quiz')} className="w-full py-5 bg-[#2774AE] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                           Start AI Mini Quiz
                        </button>
                     </div>
                  </motion.div>
                )}

                {/* REFLECTION SECTION */}
                {activeSection === 'reflection' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                     <section className="p-12 rounded-[3rem] bg-gradient-to-br from-[#EEF4F8] to-white border border-[#2774AE]/20 shadow-inner space-y-8">
                        <div className="flex items-center gap-3">
                           <Quote size={24} className="text-[#2774AE]" />
                           <h4 className="text-xs font-black uppercase tracking-widest text-[#002E5D]">Lesson Synthesis</h4>
                        </div>
                        <p className="text-3xl font-black text-[#002E5D] leading-tight italic">
                           "{lesson?.summary}"
                        </p>
                        <div className="pt-8 border-t border-[#2774AE]/10 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white border border-[#2774AE]/20 flex items-center justify-center text-[#2774AE]">
                                 <Brain size={24} />
                              </div>
                              <div>
                                 <p className="text-xs font-black text-[#0F172A]">Neural Reflection</p>
                                 <p className="text-[10px] font-bold text-[#64748B] uppercase">Completed on Neural Stream</p>
                              </div>
                           </div>
                           <CheckCircle2 size={32} className="text-emerald-500" />
                        </div>
                     </section>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* 2.4 Bottom Action Bar */}
        <footer className="h-20 bg-white border-t border-[var(--border-default)] px-8 flex items-center justify-between z-40 shrink-0">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[var(--border-default)] text-xs font-black uppercase tracking-widest hover:bg-[var(--bg-subtle)] transition-all">
              <ChevronLeft size={16} /> Previous
            </button>
            <div className="h-6 w-[1px] bg-[var(--border-default)]" />
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[var(--border-default)] text-xs font-black uppercase tracking-widest hover:bg-[var(--bg-subtle)] transition-all">
              Next Lesson <ChevronRight size={16} />
            </button>
          </div>
          
          <button className="px-10 py-3 bg-[#2774AE] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#2774AE]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
             Complete Lesson
             <CheckCircle2 size={18} />
          </button>
        </footer>
      </div>

      {/* 3. RIGHT PANEL — DYNAMIC SMART TRACKER */}
      <motion.aside 
        initial={false}
        animate={{ width: rightPanelOpen ? 320 : 0, opacity: rightPanelOpen ? 1 : 0 }}
        className="h-full bg-white border-l border-[var(--border-default)] flex flex-col relative z-40"
      >
        <div className="p-6 border-b border-[var(--border-default)] flex items-center justify-between">
           <h2 className="text-sm font-black text-[#0F172A] tracking-widest uppercase flex items-center gap-2">
              <Activity size={18} /> Live Matrix
           </h2>
           <button onClick={() => setRightPanelOpen(false)} className="p-1.5 hover:bg-[var(--bg-subtle)] rounded-lg transition-colors">
              <ChevronRight size={18} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
           {/* Dynamic XP Section */}
           <div className="p-6 rounded-3xl bg-[#0F172A] text-white relative overflow-hidden group">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 p-12 opacity-5"
              >
                 <Trophy size={140}/>
              </motion.div>
              <div className="relative z-10 space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Lesson Potential</p>
                 <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black italic tracking-tighter">+{Math.round(readingProgress * 2.5)}</p>
                    <p className="text-xs font-black text-[var(--accent-primary)] uppercase">XP</p>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 uppercase">
                    <Flame size={12} /> Optimized Velocity
                 </div>
              </div>
           </div>

           {/* Lesson Context Skills */}
           <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#64748B] flex items-center justify-between">
                 Context Skills
                 <span className="text-emerald-500">+{lesson?.keyConcepts?.length || 0}</span>
              </h3>
              <div className="space-y-3">
                 {lesson?.keyConcepts?.slice(0, 4).map(skill => (
                   <motion.div 
                     key={skill} 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex items-center gap-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[var(--border-default)] group hover:border-[#2774AE] transition-all"
                   >
                      <div className="w-2 h-2 rounded-full bg-[#2774AE]" />
                      <span className="text-xs font-bold text-[#0F172A]">{skill}</span>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* Live Mastery Circle */}
           <div className="p-8 rounded-[2.5rem] border border-[#2774AE]/10 bg-[#2774AE]/[0.02] space-y-6">
              <div className="text-center space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-[#002E5D]">Neural Mastery</p>
                 <p className="text-xs font-bold text-[#64748B]">Real-time synchronization</p>
              </div>
              <div className="relative w-32 h-32 mx-auto">
                 <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle className="text-blue-100 stroke-current" cx="18" cy="18" r="16" strokeWidth="3" fill="none" />
                    <motion.circle 
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${readingProgress}, 100` }}
                      className="text-[#2774AE] stroke-current" 
                      cx="18" cy="18" r="16" strokeWidth="3" strokeLinecap="round" fill="none" 
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-[#002E5D]">{readingProgress}%</span>
                    <span className="text-[8px] font-black uppercase opacity-60">Sync</span>
                 </div>
              </div>
           </div>
        </div>
      </motion.aside>

      {/* 4. AI FLOATING COMMANDER */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-[450px] bg-white border border-[var(--border-default)] rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] z-[60] flex flex-col overflow-hidden"
          >
             <div className="p-8 bg-[#002E5D] text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[var(--accent-primary)]"><Brain size={28}/></div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest">Neural Stream</p>
                      <p className="text-[9px] text-blue-200 uppercase font-black tracking-tighter opacity-60">AI Contextual Processor</p>
                   </div>
                </div>
                <button onClick={() => setAiAssistantOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><ChevronDown size={24}/></button>
             </div>
             
             <div className="flex-1 p-8 overflow-y-auto custom-scrollbar max-h-[450px] space-y-6">
                {aiLoading ? (
                   <div className="flex flex-col items-center justify-center py-20 space-y-6">
                      <motion.div 
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
                        transition={{ duration: 2, repeat: Infinity }} 
                        className="text-[#2774AE]"
                      >
                         <RefreshCw size={48}/>
                      </motion.div>
                      <p className="text-xs font-black text-[#64748B] uppercase tracking-widest animate-pulse">Processing context...</p>
                   </div>
                ) : aiResponse ? (
                   <div className="space-y-6">
                      <div className="p-6 rounded-3xl bg-[#F8FAFC] border border-[var(--border-default)]">
                         <p className="text-base font-medium leading-relaxed text-[#475569]">{aiResponse}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => setAiResponse(null)} className="text-[10px] font-black uppercase tracking-widest text-[#2774AE] hover:underline">Clear Stream</button>
                         <div className="h-[1px] flex-1 bg-[var(--border-default)]" />
                      </div>
                   </div>
                ) : (
                   <div className="text-center space-y-6 py-12">
                      <div className="w-20 h-20 bg-[#EEF4F8] rounded-[2.5rem] flex items-center justify-center mx-auto text-[#2774AE] shadow-inner"><HelpCircle size={40}/></div>
                      <div className="space-y-2">
                         <p className="text-sm font-black text-[#0F172A]">AI Context Assistant</p>
                         <p className="text-xs font-bold text-[#64748B] max-w-[200px] mx-auto leading-relaxed">Select a paragraph or use the actions below to process the lesson content.</p>
                      </div>
                   </div>
                )}
             </div>

             <div className="p-8 border-t border-[var(--border-default)] grid grid-cols-2 gap-4">
                <button onClick={() => handleAction('Explain Simpler')} className="p-4 bg-[#F8FAFC] border border-[var(--border-default)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#2774AE] hover:bg-blue-50 transition-all flex items-center gap-3 justify-center">
                   <Glasses size={18} className="text-blue-500"/> Simplify
                </button>
                <button onClick={() => handleAction('Give Example')} className="p-4 bg-[#F8FAFC] border border-[var(--border-default)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[#2774AE] hover:bg-orange-50 transition-all flex items-center gap-3 justify-center">
                   <Lightbulb size={18} className="text-orange-500"/> Example
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#2774AE] text-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(39,116,174,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[70] group"
      >
        <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
      </button>

    </div>
  );
};

export default LessonsScreen;
