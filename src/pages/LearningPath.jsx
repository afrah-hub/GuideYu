import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const LearningPath = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetCareer = searchParams.get('career');
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedModule, setSelectedModule] = useState(null);

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
        
        // Find current step index
        const currentIndex = result.journey?.findIndex(s => s.status === 'Current' || s.status === 'Active') || 0;
        setActiveStep(currentIndex >= 0 ? currentIndex : 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [targetCareer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[var(--accent-primary-subtle)] border-t-[var(--accent-primary)] rounded-full animate-spin" />
          <p className="text-[var(--text-accent)] font-black text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Path</p>
        </div>
      </div>
    );
  }

  const journey = data?.journey || [];
  const currentPath = data?.summary?.targetRole || "Career Path";

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Top Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
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
                  <Target size={20} className="text-[var(--text-accent)]" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
                  Learning <span className="text-gradient-brand">Trajectory</span>
                </h1>
              </div>
              <p className="text-[var(--text-secondary)] font-medium max-w-xl">
                A step-by-step execution plan to master <span className="text-[var(--text-primary)] font-bold">{currentPath}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-[2rem] backdrop-blur-xl shadow-sm">
            <div className="text-center">
              <span className="block text-2xl font-black text-[var(--text-accent)]">{journey.length}</span>
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Milestones</span>
            </div>
            <div className="w-px h-8 bg-[var(--border-faint)]" />
            <div className="text-center">
              <span className="block text-2xl font-black text-[var(--text-primary)]">{data?.summary?.completionTime || '12-18m'}</span>
              <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Estimated</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Timeline Sidebar (LHS) */}
          <div className="lg:col-span-4 space-y-4">
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
                    className={`w-full group relative flex items-center gap-6 p-4 rounded-2xl border transition-all duration-300 text-left ${
                      isActive 
                        ? 'bg-[var(--accent-primary-subtle)] border-[var(--accent-primary)] shadow-sm' 
                        : 'border-transparent hover:bg-[var(--bg-overlay)]'
                    }`}
                  >
                    <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white' :
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
                className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[3rem] p-8 md:p-12 relative overflow-hidden backdrop-blur-3xl shadow-sm"
              >
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary-subtle)] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 space-y-10">
                  {/* Step Header */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-faint)]">
                        <Sparkles size={12} className="text-[var(--text-accent)]" />
                        <span className="text-[10px] font-black text-[var(--text-accent)] uppercase tracking-widest">
                          Stage {activeStep + 1} Execution
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tighter">
                        {journey[activeStep]?.roleName}
                      </h2>
                      <p className="text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl">
                        {journey[activeStep]?.description || "Master the core competencies required to excel in this role. This phase focuses on building a solid foundation and practical experience."}
                      </p>
                    </div>
                    
                    {journey[activeStep]?.status === 'Completed' ? (
                      <div className="bg-[var(--color-success-subtle)] border border-[var(--color-success-subtle)] p-6 rounded-[2rem] text-center shrink-0">
                        <Trophy size={32} className="text-[var(--color-success)] mx-auto mb-2" />
                        <span className="block text-[10px] font-black text-[var(--color-success)] uppercase tracking-[0.2em]">Mastered</span>
                      </div>
                    ) : (
                      <div className="bg-[var(--bg-subtle)] border border-[var(--border-faint)] p-6 rounded-[2rem] text-center shrink-0">
                        <Rocket size={32} className="text-[var(--text-accent)] mx-auto mb-2" />
                        <span className="block text-[10px] font-black text-[var(--text-accent)] uppercase tracking-[0.2em]">In Progress</span>
                      </div>
                    )}
                  </div>

                  {/* Skills / Modules */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-[var(--text-tertiary)] uppercase tracking-[0.3em] flex items-center gap-2">
                      <BookOpen size={16} />
                      Curriculum Modules
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {(journey[activeStep]?.skills && journey[activeStep]?.skills.length > 0 ? journey[activeStep].skills : [
                        { name: "Foundational Concepts", learningTime: "1h 30m" },
                        { name: "Practical Application", learningTime: "3h 45m" },
                        { name: "Advanced Frameworks", learningTime: "5h 20m" },
                        { name: "Professional Portfolio", learningTime: "2h 15m" }
                      ]).map((skill, si) => (
                        <div key={si} className="space-y-2">
                          <motion.div 
                            onClick={() => navigate(`/syllabus?module=${encodeURIComponent(skill.name)}&career=${encodeURIComponent(currentPath)}`)}
                            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--accent-primary)] transition-all cursor-pointer group shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-accent)] flex items-center justify-center group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-all">
                                  <PlayCircle size={20} />
                                </div>
                                <div>
                                  <h4 className="text-[var(--text-primary)] font-bold group-hover:text-[var(--text-accent)] transition-colors">{skill.name}</h4>
                                  <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1.5">
                                      <Clock size={12} className="text-[var(--text-tertiary)]" />
                                      <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase">{skill.learningTime || '2h 30m'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <CheckCircle2 size={12} className="text-[var(--text-tertiary)]" />
                                      <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase">View Syllabus</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <ArrowRight size={20} className="text-[var(--text-tertiary)] group-hover:text-[var(--text-accent)] group-hover:translate-x-1 transition-all" />
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-8 border-t border-[var(--border-faint)] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-surface)] bg-[var(--bg-overlay)] flex items-center justify-center text-[10px] font-bold text-[var(--text-primary)]">
                            U{i}
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Join 420+ others in this stage</span>
                    </div>
                    
                    <button className="w-full sm:w-auto px-10 py-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-md transition-all flex items-center justify-center gap-3 group">
                      Resume Module
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
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
