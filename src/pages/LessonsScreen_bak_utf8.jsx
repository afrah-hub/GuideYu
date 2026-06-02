import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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

  const handleBack = () => {
    navigate(`/study-materials?module=${encodeURIComponent(currentModule?.Title || currentModule?.title || '')}&career=${encodeURIComponent(career)}`);
  };

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
        setError("Connection lost. Please check your internet connection.");
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
    <div className="space-y-8 py-8 animate-pulse">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-slate-100" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-slate-100 rounded-lg" />
            <div className="h-3 w-32 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="h-[200px] w-full bg-slate-100 rounded-[2rem]" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-slate-100 rounded-3xl" />
          <div className="h-32 bg-slate-100 rounded-3xl" />
        </div>
      </div>
    </div>
  );

  const SectionCard = ({ icon: Icon, title, children, color = "text-[#2774AE]", bg = "bg-blue-50/50" }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
            <Icon size={18} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{title}</h3>
        </div>
        <MoreVertical size={16} className="text-slate-400" />
      </div>
      <div className="relative z-10 prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed font-medium">
        {children}
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen bg-[#F8FAFC] flex overflow-hidden selection:bg-blue-50 selection:text-[#2774AE] font-poppins">

      {/* 1. LEFT SIDEBAR â€” ADAPTIVE SYLLABUS */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 320 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col relative z-40"
      >
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
              <List size={14} /> Course Path
            </h2>
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <div className="relative p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white space-y-4 mb-4 shadow-lg shadow-slate-900/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#2774AE]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Module Status</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[8px] font-black tracking-wider uppercase">Active</span>
            </div>
            <p className="text-xs font-black leading-snug tracking-tight text-white">{currentModule?.Title || currentModule?.title || "Career Roadmap"}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] font-bold text-slate-400">
                <span>COMPLETION</span>
                <span>{Math.round((currentIndex / (currentModule?.Topics?.length || 1)) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentIndex / (currentModule?.Topics?.length || 1)) * 100}%` }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-[#2774AE]"
                />
              </div>
            </div>
          </div>

          {roadmap.map((module) => {
            const isExpanded = expandedModules[module.Id || module.id];
            return (
              <div key={module.Id || module.id} className="space-y-2">
                <button
                  onClick={() => toggleModule(module.Id || module.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${isExpanded
                      ? 'bg-slate-50/80 border-slate-200/80 shadow-sm'
                      : 'bg-white border-slate-100 hover:bg-slate-50/50 hover:border-slate-200'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${isExpanded ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                      {module.Topics?.length || 0}
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 text-left leading-snug">{module.Title || module.title}</span>
                  </div>
                  <ChevronRight size={12} className={`text-slate-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-90 text-slate-700' : ''}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1 pl-2 relative border-l border-slate-100 ml-4 py-1"
                    >
                      {module.Topics?.map((topic) => {
                        const isActive = (topic.Id || topic.id)?.toString() === topicId || (topic.Title || topic.title) === topicId || (topic.TopicKey || topic.topicKey) === topicId;
                        return (
                          <button
                            key={topic.Id || topic.id}
                            onClick={() => navigate(`/lessons/${roadmapId}/${module.Id || module.id}/${encodeURIComponent(topic.id || topic.Title || topic.title)}?career=${encodeURIComponent(career)}`)}
                            className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-white shadow-sm border border-slate-200/80 text-slate-900 font-extrabold translate-x-0.5' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'}`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-[#2774AE] scale-125 shadow-[0_0_8px_rgba(39,116,174,0.6)]' : topic.IsCompleted ? 'bg-emerald-500' : 'bg-slate-300 opacity-60 group-hover:opacity-100'}`} />
                            <span className="text-[11px] font-semibold text-left leading-tight transition-colors">{topic.Title || topic.title}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.aside>

      {/* 2. CENTER CONTENT AREA â€” AI LEARNING WORKSPACE */}
      <div className="flex-1 h-full relative bg-[#F8FAFC] flex flex-col overflow-hidden">

        {/* Scroll Progress Overlay */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-50">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-[#2774AE] origin-left"
            style={{ scaleX: scrollYProgress }}
          />
        </div>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-12 left-6 z-40 p-2.5 bg-white border border-slate-200/80 rounded-2xl shadow-md hover:scale-105 transition-all text-[#2774AE] flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* 2.1 Premium Workspace Header */}
        <header className="h-20 bg-white/65 backdrop-blur-lg border-b border-slate-100 px-8 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-5 min-w-0">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4.5 py-2 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all text-slate-500 hover:text-slate-900 bg-white font-bold text-[10px] uppercase tracking-wider shrink-0"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">
                <span>{career}</span>
                <ChevronRight size={8} className="text-slate-350" />
                <span className="text-[#2774AE]">{lesson?.title || 'Lesson Content'}</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-sm font-black text-slate-950 truncate tracking-tight">
                  {lesson?.title || 'Loading...'}
                </h1>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/50">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black tracking-wider uppercase">AI Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3.5 px-4 py-2 bg-slate-50/80 border border-slate-100 rounded-2xl shadow-inner">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Reading Progress</span>
                <span className="text-xs font-black text-[#2774AE]">{readingProgress}%</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#2774AE] shadow-sm">
                <Target size={16} />
              </div>
            </div>
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className={`p-2.5 rounded-2xl border transition-all duration-300 flex items-center justify-center shrink-0 ${rightPanelOpen
                  ? 'bg-[#EEF4F8] border-[#2774AE]/20 text-[#2774AE]'
                  : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
            >
              <Activity size={16} />
            </button>
          </div>
        </header>

        {/* 2.2 Learning Flow Navigation */}
        <div className="h-16 bg-white/40 border-b border-slate-100 px-8 flex items-center z-20 shrink-0">
          <div className="flex bg-slate-100/80 p-1 rounded-2xl gap-1.5">
            {[
              { id: 'learn', label: 'Learn', icon: BookOpen },
              { id: 'practice', label: 'Practice', icon: PenTool },
              { id: 'quiz', label: 'Mini Quiz', icon: HelpCircle },
              { id: 'reflection', label: 'Reflection', icon: Brain }
            ].map(step => {
              const isActive = activeSection === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveSection(step.id)}
                  className={`relative flex items-center gap-2 py-2 px-5 rounded-xl transition-all duration-300 text-[10px] font-black uppercase tracking-wider ${isActive
                      ? 'bg-white text-[#2774AE] shadow-sm font-extrabold'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                >
                  <step.icon size={12} className={isActive ? 'text-[#2774AE]' : 'text-slate-400'} />
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2.3 Main Scrollable Workspace */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto scroll-smooth relative min-h-0 bg-[#F8FAFC]"
        >
          <div className="max-w-3xl mx-auto px-8 py-10 space-y-10 pb-40">

            {loading ? (
              <LessonSkeleton />
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-4 max-w-md mx-auto"
              >
                <div className="relative p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.015)] text-center space-y-8 overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-rose-100/50">
                    <AlertCircle size={28} className="animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Connection Offline</h2>
                    <p className="text-xs font-semibold text-slate-400 leading-relaxed max-w-xs mx-auto">
                      {error || "We're having trouble loading this learning module. Let's rebuild the connection to your AI Mentor."}
                    </p>
                  </div>

                  <button
                    onClick={() => window.location.reload()}
                    className="w-full px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-md transition-all active:scale-[0.98]"
                  >
                    Retry Connection
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-12">

                {/* LEARN SECTION */}
                {activeSection === 'learn' && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {/* Overview Header */}
                    <header className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-emerald-100/50">{lesson?.difficulty}</span>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-wider border border-blue-100/50">15 MINS READ</span>
                      </div>
                      <h2 className="text-3xl font-black tracking-tight text-slate-950 leading-tight">{lesson?.title}</h2>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
                        Dive into the core foundations and architectural principles of this domain.
                      </p>
                    </header>

                    {/* Lesson Body Cards */}
                    <div className="space-y-6">
                      {lesson?.content?.split('\n\n').map((para, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="group relative p-8 bg-white border border-slate-100 rounded-3xl hover:border-slate-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-500"
                        >
                          {i === 0 && (
                            <div className="inline-flex px-3 py-1 bg-slate-950 text-white rounded-xl text-[8px] font-black uppercase tracking-wider mb-5">
                              Introduction
                            </div>
                          )}
                          <p className="text-sm leading-relaxed text-slate-600 font-medium">
                            {para}
                          </p>
                          <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => handleAction('Simplify')}
                              title="Simplify Text"
                              className="p-2 bg-slate-50 border border-slate-100 text-slate-500 hover:text-[#2774AE] hover:bg-blue-50/50 hover:border-blue-100 rounded-xl transition-all"
                            >
                              <Glasses size={14} />
                            </button>
                            <button
                              onClick={() => handleAction('Summarize')}
                              title="Summarize Content"
                              className="p-2 bg-slate-50 border border-slate-100 text-slate-500 hover:text-[#2774AE] hover:bg-blue-50/50 hover:border-blue-100 rounded-xl transition-all"
                            >
                              <FileText size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Key Concepts Grid */}
                    <section className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-slate-100" />
                        <h3 className="text-[9px] font-black uppercase tracking-wider text-slate-400">Core Principles</h3>
                        <div className="h-[1px] flex-1 bg-slate-100" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lesson?.keyConcepts?.map((concept, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ y: -2 }}
                            className="p-5 bg-white border border-slate-100 rounded-2xl flex items-start gap-4 group cursor-pointer hover:border-slate-200 transition-all duration-300"
                          >
                            <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#2774AE] group-hover:text-white transition-all">
                              <Zap size={16} />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-black text-slate-800">{concept}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Core Concept</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    {/* Visual Support Callout */}
                    <div className="p-8 rounded-[2rem] bg-slate-950 text-white space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12 pointer-events-none"><Brain size={250} /></div>
                      <div className="space-y-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="text-[#2774AE]" size={18} />
                          <h4 className="text-[9px] font-black uppercase tracking-wider">Mental Model Illustration</h4>
                        </div>
                        <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-col space-y-3">
                          <TableIcon size={36} className="text-white/20" />
                          <p className="text-xs font-bold text-white/40">Visual structure dynamically generated by AI...</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PRACTICE SECTION */}
                {activeSection === 'practice' && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <SectionCard icon={PenTool} title="Hands-on Exercise" color="text-purple-600" bg="bg-purple-50">
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        Based on your {career} roadmap, here is a practical application of these concepts. Try to architect a solution for the following scenario:
                      </p>
                      <div className="mt-6 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl">
                        <ul className="space-y-3">
                          {lesson?.practicalApps?.map((app, i) => (
                            <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-800">
                              <Check size={14} className="text-emerald-500 shrink-0" /> {app}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </SectionCard>
                  </motion.div>
                )}

                {/* QUIZ SECTION */}
                {activeSection === 'quiz' && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                    <div className="p-10 rounded-[2rem] bg-white border border-slate-100 space-y-8 text-center">
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-orange-100/50">
                          <HelpCircle size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Knowledge Check</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verify your mastery of this lesson</p>
                      </div>
                      <button onClick={() => handleAction('Generate Quiz')} className="w-full max-w-xs mx-auto py-4 bg-[#2774AE] text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Start AI Mini Quiz
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* REFLECTION SECTION */}
                {activeSection === 'reflection' && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <section className="p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 space-y-6">
                      <div className="flex items-center gap-2">
                        <Quote size={16} className="text-[#2774AE]" />
                        <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-800">Lesson Synthesis</h4>
                      </div>
                      <p className="text-xl font-black text-slate-900 leading-snug italic">
                        "{lesson?.summary}"
                      </p>
                      <div className="pt-6 border-t border-slate-200/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[#2774AE]">
                            <Brain size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">Lesson Reflection</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">Lesson Completed</p>
                          </div>
                        </div>
                        <CheckCircle2 size={24} className="text-emerald-500" />
                      </div>
                    </section>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* 2.4 Bottom Action Bar */}
        <footer className="h-20 bg-white/60 backdrop-blur-md border-t border-slate-100 px-8 flex items-center justify-between z-40 shrink-0">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all">
              <ChevronLeft size={14} /> Previous
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            <button className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all">
              Next Lesson <ChevronRight size={14} />
            </button>
          </div>

          <button className="px-8 py-3 bg-[#2774AE] hover:bg-[#2774AE]/90 text-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-md shadow-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
            Complete Lesson
            <CheckCircle2 size={16} />
          </button>
        </footer>
      </div>

      {/* 3. RIGHT PANEL â€” DYNAMIC SMART TRACKER */}
      <motion.aside
        initial={false}
        animate={{ width: rightPanelOpen ? 320 : 0, opacity: rightPanelOpen ? 1 : 0 }}
        className="h-full bg-white border-l border-slate-200/50 flex flex-col relative z-40"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-[10px] font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
            <Activity size={14} /> Live Progress
          </h2>
          <button onClick={() => setRightPanelOpen(false)} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* Dynamic XP Section */}
          <div className="p-6 rounded-3xl bg-slate-950 text-white relative overflow-hidden shadow-lg shadow-slate-950/5 group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/80 via-slate-950 to-slate-950" />
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#2774AE]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <p className="text-[8px] font-black uppercase tracking-wider text-slate-500">Lesson Potential</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-black italic tracking-tight text-white">+{Math.round(readingProgress * 2.5)}</p>
                <p className="text-[10px] font-black text-[#2774AE] uppercase tracking-wider">XP</p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/10">
                <Flame size={10} /> Optimized Growth
              </div>
            </div>
          </div>

          {/* Lesson Context Skills */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
              Context Skills
              <span className="text-emerald-500">+{lesson?.keyConcepts?.length || 0}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {lesson?.keyConcepts?.slice(0, 6).map(skill => (
                <motion.div
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-50 border border-slate-100/80 text-[10px] font-bold text-slate-600 shadow-sm transition-colors hover:border-[#2774AE]/30"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2774AE]/70" />
                  <span>{skill}</span>
                </motion.div>
              ))}
              {(!lesson?.keyConcepts || lesson.keyConcepts.length === 0) && (
                <div className="text-slate-400 text-[10px] font-bold py-2">No skills indexed.</div>
              )}
            </div>
          </div>

          {/* Live Mastery Circle */}
          <div className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 space-y-6">
            <div className="text-center space-y-1">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-800">Mastery Level</p>
              <p className="text-[10px] font-semibold text-slate-400">Real-time progress</p>
            </div>
            <div className="relative w-28 h-28 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle className="text-slate-200 stroke-current" cx="18" cy="18" r="16" strokeWidth="2.5" fill="none" />
                <motion.circle
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${readingProgress}, 100` }}
                  className="text-[#2774AE] stroke-current"
                  cx="18" cy="18" r="16" strokeWidth="2.5" strokeLinecap="round" fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 tracking-tight">{readingProgress}%</span>
                <span className="text-[7px] font-black uppercase text-slate-400">Progress</span>
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
            className="fixed bottom-24 right-8 w-[380px] bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)] z-[60] flex flex-col overflow-hidden"
          >
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-cyan-400"><Brain size={20} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider">Lesson Context</p>
                  <p className="text-[8px] text-slate-400 uppercase font-black tracking-tighter opacity-80">AI Learning Assistant</p>
                </div>
              </div>
              <button onClick={() => setAiAssistantOpen(false)} className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors shrink-0">
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar max-h-[300px] space-y-6">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="text-[#2774AE]"
                  >
                    <RefreshCw size={36} />
                  </motion.div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider animate-pulse">Processing context...</p>
                </div>
              ) : aiResponse ? (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold leading-relaxed text-slate-600">
                    {aiResponse}
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setAiResponse(null)} className="text-[9px] font-black uppercase tracking-wider text-[#2774AE] hover:underline">Clear Context</button>
                    <div className="h-[1px] flex-1 bg-slate-100" />
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 py-8">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-[#2774AE] shadow-inner border border-slate-100"><HelpCircle size={28} /></div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-800">AI Learning Assistant</p>
                    <p className="text-[10px] font-semibold text-slate-400 max-w-[200px] mx-auto leading-relaxed">Select a paragraph or use the actions below to process the lesson content.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 grid grid-cols-2 gap-3">
              <button onClick={() => handleAction('Explain Simpler')} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-wider hover:border-blue-150 hover:bg-blue-50/50 transition-all flex items-center gap-2 justify-center text-slate-600 hover:text-[#2774AE]">
                <Glasses size={14} className="text-blue-500" /> Simplify
              </button>
              <button onClick={() => handleAction('Give Example')} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-wider hover:border-orange-150 hover:bg-orange-50/50 transition-all flex items-center gap-2 justify-center text-slate-600 hover:text-orange-500">
                <Lightbulb size={14} className="text-orange-500" /> Example
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
        className="fixed bottom-10 right-10 w-14 h-14 bg-gradient-to-tr from-slate-950 to-slate-800 hover:from-slate-900 hover:to-slate-750 text-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex items-center justify-center hover:scale-110 hover:-rotate-6 active:scale-95 transition-all z-[70] group border border-slate-800/80"
      >
        <MessageSquare size={22} className="group-hover:scale-110 transition-all text-cyan-400" />
      </button>

    </div>
  );
};

export default LessonsScreen;
