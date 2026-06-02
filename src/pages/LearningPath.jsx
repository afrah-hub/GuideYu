import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendationService } from '../services/recommendationService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  Rocket,
  CheckCircle2,
  Zap,
  Lock,
  Clock,
  BookOpen,
  PlayCircle,
  Trophy,
  ArrowRight,
  Target,
  Sparkles
} from 'lucide-react';

const staticFallbackJourneys = {
  "Frontend Developer": [
    { roleName: "Junior Frontend Developer", status: "Current", isCurrent: true, order: 1, skills: [{ name: "HTML & CSS Core", learningTime: "10h" }, { name: "JavaScript Fundamentals", learningTime: "15h" }] },
    { roleName: "Mid Frontend Developer", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "React Essentials", learningTime: "25h" }, { name: "State Management & Context", learningTime: "12h" }] },
    { roleName: "Senior Frontend Developer", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "Performance & Architecture", learningTime: "30h" }, { name: "CI/CD & Testing", learningTime: "18h" }] }
  ],
  "Backend Developer": [
    { roleName: "Junior Backend Developer", status: "Current", isCurrent: true, order: 1, skills: [{ name: "Node.js Basics", learningTime: "12h" }, { name: "Databases & SQL", learningTime: "15h" }] },
    { roleName: "Mid Backend Developer", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "REST APIs & Express", learningTime: "20h" }, { name: "Authentication & Security", learningTime: "14h" }] },
    { roleName: "Senior Backend Developer", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "System Architecture", learningTime: "35h" }, { name: "Microservices & Docker", learningTime: "25h" }] }
  ],
  "Full Stack Developer": [
    { roleName: "Junior Developer", status: "Current", isCurrent: true, order: 1, skills: [{ name: "Web Foundations", learningTime: "15h" }, { name: "JavaScript & Node.js", learningTime: "20h" }] },
    { roleName: "Mid Developer", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "React Frontends", learningTime: "25h" }, { name: "Database Design", learningTime: "15h" }] },
    { roleName: "Senior Developer", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "Full Stack Deployment", learningTime: "30h" }, { name: "Docker & Kubernetes", learningTime: "25h" }] }
  ],
  "React Developer": [
    { roleName: "Junior React Developer", status: "Current", isCurrent: true, order: 1, skills: [{ name: "Modern JavaScript", learningTime: "12h" }, { name: "React Basics", learningTime: "18h" }] },
    { roleName: "Mid React Developer", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "Hooks & Custom Hooks", learningTime: "15h" }, { name: "Redux Toolkit", learningTime: "20h" }] },
    { roleName: "Senior React Developer", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "React Native Mobile", learningTime: "30h" }, { name: "Next.js SSR & Server Actions", learningTime: "25h" }] }
  ],
  ".NET Developer": [
    { roleName: "Junior .NET Developer", status: "Current", isCurrent: true, order: 1, skills: [{ name: "C# Essentials", learningTime: "15h" }, { name: ".NET Core Fundamentals", learningTime: "20h" }] },
    { roleName: "Mid .NET Developer", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "Entity Framework Core", learningTime: "18h" }, { name: "ASP.NET Core Web APIs", learningTime: "22h" }] },
    { roleName: "Senior .NET Developer", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "Azure Integration", learningTime: "25h" }, { name: "Microservices Architecture", learningTime: "30h" }] }
  ],
  "Cloud Engineer": [
    { roleName: "Associate Cloud Engineer", status: "Current", isCurrent: true, order: 1, skills: [{ name: "Cloud Core Concepts", learningTime: "10h" }, { name: "Linux & Shell Scripting", learningTime: "15h" }] },
    { roleName: "Professional Cloud Engineer", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "AWS/Azure Deployment", learningTime: "25h" }, { name: "Terraform & IaC", learningTime: "20h" }] },
    { roleName: "Lead Cloud Architect", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "Containerization (Docker/K8s)", learningTime: "30h" }, { name: "Cloud Security & IAM", learningTime: "22h" }] }
  ],
  "DevOps Engineer": [
    { roleName: "Junior DevOps Associate", status: "Current", isCurrent: true, order: 1, skills: [{ name: "Systems Administration", learningTime: "15h" }, { name: "Git & Version Control", learningTime: "8h" }] },
    { roleName: "DevOps Engineer", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "CI/CD & Automation", learningTime: "25h" }, { name: "Docker & Kubernetes", learningTime: "30h" }] },
    { roleName: "Lead DevOps Architect", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "Monitoring & Observability", learningTime: "18h" }, { name: "Infrastructure as Code", learningTime: "25h" }] }
  ],
  "UI Designer": [
    { roleName: "Junior UI Designer", status: "Current", isCurrent: true, order: 1, skills: [{ name: "UI Fundamentals", learningTime: "10h" }, { name: "Figma Essentials", learningTime: "15h" }] },
    { roleName: "Visual Designer", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "Design Systems & Components", learningTime: "20h" }, { name: "Prototyping & Flows", learningTime: "18h" }] },
    { roleName: "Senior Art Director", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "Advanced Motion & Microinteractions", learningTime: "25h" }, { name: "Visual Handoff & Assets", learningTime: "12h" }] }
  ],
  "UX Designer": [
    { roleName: "Junior UX Designer", status: "Current", isCurrent: true, order: 1, skills: [{ name: "UX Research Basics", learningTime: "15h" }, { name: "Information Architecture", learningTime: "12h" }] },
    { roleName: "Interaction Designer", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "Wireframing & Prototyping", learningTime: "18h" }, { name: "Usability Testing & Interviews", learningTime: "20h" }] },
    { roleName: "Senior UX Architect", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "Product Design Strategy", learningTime: "25h" }, { name: "Stakeholder Alignment", learningTime: "15h" }] }
  ],
  "Product Manager": [
    { roleName: "Associate PM", status: "Current", isCurrent: true, order: 1, skills: [{ name: "Product Discovery", learningTime: "12h" }, { name: "Market Research", learningTime: "15h" }] },
    { roleName: "Product Manager", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "Agile Scrum & PRDs", learningTime: "25h" }, { name: "Prioritization Frameworks", learningTime: "15h" }] },
    { roleName: "Director of Product", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "Growth Strategy & Metrics", learningTime: "30h" }, { name: "Stakeholder Management", learningTime: "20h" }] }
  ],
  "Ethical Hacker": [
    { roleName: "Security Analyst", status: "Current", isCurrent: true, order: 1, skills: [{ name: "Networking Fundamentals", learningTime: "15h" }, { name: "Basic Cryptography", learningTime: "12h" }] },
    { roleName: "Penetration Tester", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "Vulnerability Scanning", learningTime: "20h" }, { name: "Exploit Development", learningTime: "25h" }] },
    { roleName: "Red Team Leader", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "Adversary Emulation", learningTime: "30h" }, { name: "Advanced Forensic Incident", learningTime: "22h" }] }
  ]
};

const getFallbackJourney = (careerName) => {
  const keys = Object.keys(staticFallbackJourneys);
  const matchedKey = keys.find(k => k.toLowerCase().includes((careerName || '').toLowerCase()) || (careerName || '').toLowerCase().includes(k.toLowerCase()));
  if (matchedKey) {
    return staticFallbackJourneys[matchedKey];
  }
  return [
    { roleName: "Beginner Stage", status: "Current", isCurrent: true, order: 1, skills: [{ name: "Foundational Concepts", learningTime: "10h" }, { name: "Primary Tools & Workflows", learningTime: "12h" }] },
    { roleName: "Intermediate Stage", status: "Upcoming", isCurrent: false, order: 2, skills: [{ name: "Advanced Implementation", learningTime: "20h" }, { name: "Practical Mini-Projects", learningTime: "15h" }] },
    { roleName: "Expert Stage", status: "Upcoming", isCurrent: false, order: 3, skills: [{ name: "Scalability & Architecture", learningTime: "25h" }, { name: "Security & Deployment", learningTime: "18h" }] }
  ];
};

const LearningPath = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetCareer = searchParams.get('career');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedModule, setSelectedModule] = useState(null);
  const [syllabusModules, setSyllabusModules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = targetCareer
          ? `/api/careerpath/overview?targetCareer=${encodeURIComponent(targetCareer)}`
          : '/api/careerpath/overview';

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch learning path');
        const result = await response.json();
        setData(result);

        const loadedJourney = result.journey || [];
        // Find current step index
        const currentIndex = loadedJourney.findIndex(s => s.status === 'Current' || s.status === 'Active');
        setActiveStep(currentIndex >= 0 ? currentIndex : 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [targetCareer]);

  const journey = useMemo(() => {
    return (data?.journey && data.journey.length > 0) ? data.journey : getFallbackJourney(targetCareer);
  }, [data?.journey, targetCareer]);

  // Fetch syllabus for the active step when it changes
  useEffect(() => {
    const fetchSyllabus = async () => {
      if (!journey?.[activeStep]) return;
      const moduleName = journey[activeStep].roleName;
      if (!moduleName) return;
      try {
        const syllabus = await recommendationService.getSyllabus(moduleName, targetCareer);
        // Robust key resolution for topics/modules/skills
        const modulesList = syllabus?.topics || syllabus?.Topics || syllabus?.modules || syllabus?.skills || [];
        setSyllabusModules(modulesList);
      } catch (err) {
        console.error('Failed to fetch syllabus:', err);
        setSyllabusModules([]);
      }
    };
    fetchSyllabus();
  }, [journey, activeStep, targetCareer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary-subtle)] border-t-[var(--accent-primary)] rounded-full animate-spin" />
          <p className="text-[var(--text-accent)] font-black text-xs uppercase tracking-[0.3em] animate-pulse">Loading Path</p>
        </div>
      </div>
    );
  }

  const currentPath = data?.summary?.targetRole || targetCareer || "Career Path";

  const handleStepChange = (idx) => {
    setActiveStep(idx);
    setSelectedModule(null); // Reset selected module when step changes
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-poppins">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent-primary-subtle)] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent-primary-glow)] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 relative z-10">
        {/* Top Header */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-3 md:space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-accent)] transition-colors text-xs font-bold uppercase tracking-widest group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Return to Roadmap
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--bg-subtle)] rounded-lg">
                  <Target size={18} className="text-[var(--text-accent)]" />
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter">
                  Learning <span className="text-gradient-brand">Path</span>
                </h1>
              </div>
              <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium max-w-xl">
                A step-by-step execution plan to master <span className="text-[var(--text-primary)] font-bold">{currentPath}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 bg-[var(--bg-surface)] border border-[var(--border-default)] p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-xl shadow-sm self-start">
            <div className="text-center">
              <span className="block text-xl md:text-2xl font-black text-[var(--text-accent)]">{journey.length}</span>
              <span className="text-[9px] md:text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Milestones</span>
            </div>
            <div className="w-px h-6 md:h-8 bg-[var(--border-faint)]" />
            <div className="text-center">
              <span className="block text-xl md:text-2xl font-black text-[var(--text-primary)]">{data?.summary?.completionTime || '12-18m'}</span>
              <span className="text-[9px] md:text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Estimated</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start">
          {/* Timeline Sidebar (LHS) */}
          <div className="lg:col-span-4 space-y-3 md:space-y-4">
            <h3 className="text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] px-2 mb-6">Mission Stages</h3>
            <div className="space-y-3 relative">
              {/* Vertical line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-[var(--bg-overlay)]" />

              {journey.map((step, idx) => {
                const isActive = idx === activeStep;
                const isCompleted = step.status === 'Completed';
                const isLocked = !isCompleted && !isActive && idx > activeStep;

                return (
                  <button
                    key={idx}
                    onClick={() => handleStepChange(idx)}
                    className={`w-full group relative flex items-center gap-6 p-4 rounded-2xl border transition-all duration-300 text-left ${isActive
                        ? 'bg-[var(--accent-primary-subtle)] border-[var(--accent-primary)] shadow-sm'
                        : 'border-transparent hover:bg-[var(--bg-overlay)]'
                      }`}
                  >
                    <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white' :
                        isActive ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-sm' :
                          'bg-[var(--bg-subtle)] border-[var(--border-default)] text-[var(--text-tertiary)]'
                      }`}>
                      {isCompleted ? <CheckCircle2 size={14} /> :
                        idx === activeStep ? <Zap size={14} className="animate-pulse" /> :
                          idx + 1}
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-sm font-bold tracking-tight ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                        {step.roleName}
                      </h4>
                      <p className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest mt-0.5">
                        {step.status}
                      </p>
                    </div>

                    {isLocked && <Lock size={14} className="text-[var(--text-tertiary)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Content (RHS) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[2rem] p-6 md:p-8 relative overflow-hidden backdrop-blur-3xl shadow-sm"
              >
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary-subtle)] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 space-y-6">
                  {/* Step Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-faint)]">
                        <Sparkles size={12} className="text-[var(--text-accent)]" />
                        <span className="text-[10px] font-black text-[var(--text-accent)] uppercase tracking-widest">
                          Stage {activeStep + 1} Plan
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] tracking-tighter">
                        {journey[activeStep]?.roleName}
                      </h2>
                      <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl">
                        {journey[activeStep]?.description || "Master the core competencies required to excel in this role. This phase focuses on building a solid foundation and practical experience."}
                      </p>
                    </div>

                    {journey[activeStep]?.status === 'Completed' ? (
                      <div className="bg-[var(--color-success-subtle)] border border-[var(--color-success-subtle)] p-4 rounded-2xl text-center shrink-0">
                        <Trophy size={24} className="text-[var(--color-success)] mx-auto mb-1" />
                        <span className="block text-[9px] font-black text-[var(--color-success)] uppercase tracking-[0.2em]">Mastered</span>
                      </div>
                    ) : (
                      <div className="bg-[var(--bg-subtle)] border border-[var(--border-faint)] p-4 rounded-2xl text-center shrink-0">
                        <Rocket size={24} className="text-[var(--text-accent)] mx-auto mb-1" />
                        <span className="block text-[9px] font-black text-[var(--text-accent)] uppercase tracking-[0.2em]">In Progress</span>
                      </div>
                    )}
                  </div>

                  {/* Skills / Modules */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] flex items-center gap-2">
                      <BookOpen size={16} />
                      Curriculum Modules
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                      {(syllabusModules.length > 0 ? syllabusModules : (journey[activeStep]?.skills || [])).map((skill, si) => {
                        const skillName = skill.name || skill.title || skill.Name || skill.Title || "Module";
                        const skillTime = skill.learningTime || skill.estimatedTime || skill.LearningTime || skill.EstimatedTime || '2h 30m';
                        
                        const totalCh = skill.totalChaptersCount || skill.TotalChaptersCount || 0;
                        const compCh = skill.completedChaptersCount || skill.CompletedChaptersCount || 0;
                        const hasChapters = totalCh > 0;
                        const isSkillCompleted = skill.isCompleted || skill.IsCompleted || (hasChapters && compCh === totalCh);

                        return (
                          <div key={si} className="space-y-2">
                            <motion.div
                              onClick={() => navigate(`/study-materials?module=${encodeURIComponent(skillName)}&career=${encodeURIComponent(currentPath)}`)}
                              className={`p-4 rounded-xl bg-[var(--bg-surface)] border transition-all cursor-pointer group shadow-sm ${
                                isSkillCompleted 
                                  ? 'border-emerald-500/20 hover:border-emerald-500/40' 
                                  : 'border-[var(--border-default)] hover:border-[var(--accent-primary)]'
                              }`}
                            >
                              <div className="flex flex-col">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                      isSkillCompleted
                                        ? 'bg-emerald-500/10 text-emerald-500'
                                        : 'bg-[var(--bg-subtle)] text-[var(--text-accent)] group-hover:bg-[var(--accent-primary)] group-hover:text-white'
                                    }`}>
                                      {isSkillCompleted ? <CheckCircle2 size={16} /> : <PlayCircle size={16} />}
                                    </div>
                                    <div>
                                      <h4 className={`text-sm font-bold transition-colors ${
                                        isSkillCompleted 
                                          ? 'text-[var(--text-primary)] group-hover:text-emerald-500' 
                                          : 'text-[var(--text-primary)] group-hover:text-[var(--text-accent)]'
                                      }`}>{skillName}</h4>
                                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                        <div className="flex items-center gap-1">
                                          <Clock size={10} className="text-[var(--text-tertiary)]" />
                                          <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase">{skillTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {isSkillCompleted ? (
                                            <CheckCircle2 size={10} className="text-emerald-500" />
                                          ) : (
                                            <CheckCircle2 size={10} className="text-[var(--text-tertiary)]" />
                                          )}
                                          {hasChapters ? (
                                            <span className={`text-[9px] font-black uppercase ${
                                              isSkillCompleted ? 'text-emerald-500' : 'text-[var(--text-accent)]'
                                            }`}>
                                              {compCh}/{totalCh} Chapters Completed
                                            </span>
                                          ) : (
                                            <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase">
                                              View Syllabus
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <ArrowRight size={16} className={`transition-all ${
                                    isSkillCompleted 
                                      ? 'text-emerald-500/50 group-hover:text-emerald-500 group-hover:translate-x-1' 
                                      : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-accent)] group-hover:translate-x-1'
                                  }`} />
                                </div>

                                {hasChapters && (
                                  <div className="w-full bg-[var(--bg-overlay)] h-1 rounded-full overflow-hidden mt-3 p-0.5 border border-border-default/10">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-500 ${
                                        isSkillCompleted ? 'bg-emerald-500' : 'bg-[var(--accent-primary)]'
                                      }`} 
                                      style={{ width: `${(compCh / totalCh) * 100}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-6 border-t border-[var(--border-faint)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--bg-surface)] bg-[var(--bg-overlay)] flex items-center justify-center text-[9px] font-bold text-[var(--text-primary)]">
                            U{i}
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Join 420+ others in this stage</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
