const fs = require('fs');
const file = 'c:/Users/afrah/Documents/SingleProject/GuideYu/src/pages/LessonsScreen.jsx';
let content = fs.readFileSync(file, 'utf8');

const returnStart = content.indexOf('  return (');
const exportStart = content.indexOf('};\n\nexport default LessonsScreen;');

const before = content.slice(0, returnStart);
const after = content.slice(exportStart);

const newReturn = \  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-300 overflow-x-hidden relative selection:bg-cyan-900 font-sans">
      
      {/* 1. AMBIENT BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[25%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAuNWg0ME0wLjUgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] opacity-50" />
      </div>

      {/* Global Scroll Progress */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[100]">
        <motion.div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 origin-left" style={{ scaleX: scrollYProgress }} />
      </div>

      {/* 2. FLOATING OVERLAY ROADMAP (Command Palette Style) */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-0">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ y: -20, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: -20, opacity: 0, scale: 0.95 }} 
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-2xl max-h-[70vh] bg-[#18181b] border border-zinc-800 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset] flex flex-col overflow-hidden"
            >
              <div className="flex items-center px-6 py-5 border-b border-zinc-800 bg-zinc-900/50">
                <Search size={20} className="text-zinc-500 mr-4" />
                <input type="text" placeholder="Search course modules..." className="flex-1 bg-transparent border-none outline-none text-zinc-200 placeholder-zinc-500 text-sm font-medium" />
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                {roadmap.map((module) => {
                  const isExpanded = expandedModules[module.Id || module.id];
                  return (
                    <div key={module.Id || module.id} className="bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden">
                      <button onClick={() => toggleModule(module.Id || module.id)} className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-[11px] font-black text-zinc-400">
                            {module.Topics?.length || 0}
                          </div>
                          <span className="text-sm font-bold text-zinc-300 text-left">{module.Title || module.title}</span>
                        </div>
                        <ChevronDown size={16} className={\	ext-zinc-500 transition-transform \\} />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-zinc-800/50">
                            <div className="p-2 space-y-1">
                              {module.Topics?.map((topic) => {
                                const isActive = (topic.Id || topic.id)?.toString() === topicId || (topic.Title || topic.title) === topicId || (topic.TopicKey || topic.topicKey) === topicId;
                                return (
                                  <button key={topic.Id || topic.id} onClick={() => { navigate(\/lessons/\/\/\?career=\\); setSidebarOpen(false); }} className={\w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all \\}>
                                    <div className={\w-1.5 h-1.5 rounded-full \\} />
                                    <span className="text-sm font-medium text-left">{topic.Title || topic.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. CORE WORKSPACE */}
      <div className="relative z-10 max-w-[1200px] mx-auto pt-20 pb-64 px-6 md:px-12 flex flex-col items-center">
        
        {/* State Management Overlays */}
        {loading ? (
          <div className="w-full max-w-4xl space-y-12 py-20 animate-pulse">
             <div className="h-12 w-3/4 bg-zinc-800/50 rounded-2xl" />
             <div className="h-64 w-full bg-zinc-800/50 rounded-[2rem]" />
             <div className="h-40 w-full bg-zinc-800/50 rounded-[2rem]" />
          </div>
        ) : error ? (
           <div className="w-full max-w-lg mt-32 p-12 bg-zinc-900/50 border border-rose-900/50 rounded-[2rem] text-center space-y-6 backdrop-blur-xl">
             <AlertCircle size={40} className="mx-auto text-rose-500" />
             <h2 className="text-xl font-bold text-zinc-200">System Error</h2>
             <p className="text-zinc-500 text-sm">{error}</p>
             <button onClick={() => window.location.reload()} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">Retry Connection</button>
           </div>
        ) : (
          <div className="w-full">
             
             {/* LEARN SECTION */}
             {activeSection === 'learn' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center space-y-24">
                 
                 {/* Spatial Header */}
                 <header className="text-center space-y-8 max-w-3xl pt-12">
                   <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{career}</span>
                      <ChevronRight size={12} className="text-zinc-600" />
                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{currentModule?.Title || "Module Focus"}</span>
                   </div>
                   
                   <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] drop-shadow-2xl">
                     {lesson?.title}
                   </h1>
                   
                   <div className="flex flex-wrap justify-center gap-2 pt-4">
                     {lesson?.keyConcepts?.map((skill, i) => (
                       <span key={i} className="px-4 py-2 bg-zinc-900/80 text-zinc-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-zinc-800 shadow-sm flex items-center gap-2 backdrop-blur-md">
                         <div className="w-1 h-1 rounded-full bg-purple-500" /> {skill}
                       </span>
                     ))}
                   </div>
                 </header>

                 {/* Immersive Modular Nodes */}
                 <div className="w-full space-y-12">
                   {lesson?.content?.split('\\n\\n').map((para, i) => (
                     <div key={i} className="flex flex-col lg:flex-row items-stretch gap-6 w-full group">
                        
                        {/* The Knowledge Node */}
                        <div className="flex-[3] p-10 bg-[#121214] backdrop-blur-3xl border border-zinc-800/80 rounded-[2rem] hover:border-zinc-700 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group/node">
                           <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500/50 to-transparent opacity-0 group-hover/node:opacity-100 transition-opacity" />
                           <p className={\	ext-[17px] leading-[1.9] text-zinc-300 font-light \\}>
                             {para}
                           </p>
                        </div>

                        {/* The Contextual AI Intelligence Node */}
                        <div className="flex-[2] p-8 bg-[#18181b]/60 backdrop-blur-md border border-zinc-800/50 rounded-[2rem] hover:border-zinc-700/80 hover:bg-[#18181b]/90 transition-all flex flex-col justify-center gap-6 relative overflow-hidden">
                           <div className="flex items-center gap-3">
                             <div className="p-2 bg-zinc-800/50 rounded-lg text-cyan-400"><Brain size={16}/></div>
                             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Context</span>
                           </div>
                           
                           <div className="flex flex-col gap-3">
                             <button onClick={() => { setAiAssistantOpen(true); handleAction('Explain Simpler'); }} className="w-full px-5 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-cyan-950/30 hover:border-cyan-900 hover:text-cyan-400 text-xs font-bold text-zinc-400 transition-all flex items-center justify-between group/btn shadow-inner">
                               <span className="flex items-center gap-3"><Glasses size={16}/> Break Down</span>
                               <ChevronRight size={14} className="opacity-0 group-hover/btn:opacity-100 transition-all translate-x-[-10px] group-hover/btn:translate-x-0" />
                             </button>
                             <button onClick={() => { setAiAssistantOpen(true); handleAction('Give Example'); }} className="w-full px-5 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-purple-950/30 hover:border-purple-900 hover:text-purple-400 text-xs font-bold text-zinc-400 transition-all flex items-center justify-between group/btn shadow-inner">
                               <span className="flex items-center gap-3"><Lightbulb size={16}/> Applied Example</span>
                               <ChevronRight size={14} className="opacity-0 group-hover/btn:opacity-100 transition-all translate-x-[-10px] group-hover/btn:translate-x-0" />
                             </button>
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>

                 {/* Seamless Transition to Next Phase */}
                 <div className="w-full mt-12 p-12 bg-gradient-to-br from-cyan-950/40 to-purple-950/40 border border-zinc-800 rounded-[3rem] backdrop-blur-xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
                   
                   <div className="relative z-10 space-y-4">
                     <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Knowledge Integration Complete</p>
                     <div className="flex items-baseline justify-center gap-3">
                       <p className="text-6xl font-black text-white tracking-tighter">+{Math.round(readingProgress * 2.5)}</p>
                       <p className="text-2xl font-black text-cyan-400">XP</p>
                     </div>
                     <p className="text-sm font-medium text-zinc-400">Neural pathways established. Ready for practical synthesis?</p>
                   </div>
                   
                   <button onClick={() => setActiveSection('practice')} className="relative z-10 px-10 py-5 bg-white text-zinc-950 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                     Initialize Practice <Zap size={16} className="text-cyan-600" />
                   </button>
                 </div>
               </motion.div>
             )}

             {/* PRACTICE SECTION */}
             {activeSection === 'practice' && (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-12 pt-12">
                 <div className="w-full bg-[#121214] border border-zinc-800 rounded-[3rem] p-12 md:p-16 shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAuNWg0ME0wLjUgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIi8+PC9zdmc+')] opacity-30 pointer-events-none" />
                   
                   <div className="flex flex-col md:flex-row gap-16 relative z-10">
                     <div className="flex-1 space-y-8">
                       <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner">
                         <PenTool size={28} />
                       </div>
                       <div className="space-y-4">
                         <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white">Interactive Sandbox</h3>
                         <p className="text-lg text-zinc-400 font-light leading-relaxed">
                           Synthesize your knowledge. Based on the <strong>{career}</strong> architectural paradigm, approach the following scenarios:
                         </p>
                       </div>
                     </div>
                     <div className="flex-[1.2] bg-[#09090b] border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-inner space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-3 h-3 rounded-full bg-rose-500/50 border border-rose-500" />
                          <div className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-500" />
                          <div className="w-3 h-3 rounded-full bg-emerald-500/50 border border-emerald-500" />
                          <span className="ml-4 text-[10px] font-mono text-zinc-500">task_runner.sh</span>
                        </div>
                        <ul className="space-y-5">
                          {lesson?.practicalApps?.map((app, i) => (
                            <li key={i} className="flex items-start gap-4 text-sm font-medium text-zinc-300 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                              <Check size={18} className="text-emerald-400 shrink-0 mt-0.5" /> 
                              <span className="leading-relaxed">{app}</span>
                            </li>
                          ))}
                        </ul>
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}

             {/* QUIZ SECTION */}
             {activeSection === 'quiz' && (
               <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full pt-12">
                 <div className="w-full py-32 px-12 rounded-[3rem] bg-[#121214] border border-zinc-800 text-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col items-center">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
                   
                   <div className="w-28 h-28 bg-orange-500/10 text-orange-400 rounded-[2.5rem] flex items-center justify-center border border-orange-500/20 shadow-inner mb-10 relative z-10">
                     <Brain size={48} />
                   </div>
                   
                   <h3 className="text-5xl font-black text-white tracking-tighter mb-4 relative z-10">Neural Evaluation</h3>
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-12 relative z-10">Verify Pattern Recognition & Mastery</p>
                   
                   <button onClick={() => handleAction('Generate Quiz')} className="relative z-10 px-12 py-6 bg-white text-zinc-950 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                     <Brain size={24} className="text-orange-600" /> Start Diagnostics
                   </button>
                 </div>
               </motion.div>
             )}

             {/* REFLECTION SECTION */}
             {activeSection === 'reflection' && (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full pt-12">
                 <section className="w-full p-16 md:p-24 rounded-[3rem] bg-[#121214] border border-zinc-800 space-y-16 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
                   <div className="flex items-center gap-6 relative z-10">
                     <div className="p-5 rounded-[1.5rem] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner">
                       <Quote size={32} />
                     </div>
                     <h4 className="text-sm font-black uppercase tracking-widest text-zinc-500">Lesson Synthesis</h4>
                   </div>
                   <p className="text-3xl md:text-5xl font-light text-zinc-200 leading-[1.5] italic relative z-10 border-l-2 border-zinc-800 pl-8 md:pl-12">
                     "{lesson?.summary}"
                   </p>
                   <div className="pt-12 border-t border-zinc-800/50 flex flex-col md:flex-row items-start md:items-center justify-between relative z-10 gap-6">
                     <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-[1.5rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400 shadow-inner">
                         <Brain size={28} />
                       </div>
                       <div className="space-y-1.5">
                         <p className="text-xl font-bold text-white tracking-tight">Pattern Recognized</p>
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Processing Complete</p>
                       </div>
                     </div>
                     <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm">
                       <CheckCircle2 size={32} />
                     </div>
                   </div>
                 </section>
               </motion.div>
             )}
          </div>
        )}
      </div>

      {/* 4. FLOATING AI MENTOR WINDOW (OS Style Widget) */}
      <AnimatePresence>
        {aiAssistantOpen && (
          <motion.div initial={{ y: 20, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.95 }} className="fixed bottom-32 right-12 w-[450px] bg-zinc-900/90 backdrop-blur-3xl border border-zinc-700/50 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-[70] flex flex-col overflow-hidden max-h-[60vh]">
            
            {/* OS Window Header */}
            <div className="h-14 bg-zinc-800/50 flex items-center justify-between px-6 border-b border-zinc-700/50">
               <div className="flex items-center gap-3">
                 <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-600 shadow-inner cursor-pointer hover:bg-rose-400" onClick={()=>setAiAssistantOpen(false)} />
                 <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-600 shadow-inner" />
                 <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-600 shadow-inner" />
               </div>
               <span className="text-[10px] font-mono text-zinc-400 font-bold tracking-widest uppercase">Neural_Mentor.exe</span>
               <div className="w-10" />
            </div>

            <div data-lenis-prevent className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-black/20">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-12 space-y-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="text-cyan-400">
                    <RefreshCw size={32} />
                  </motion.div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest animate-pulse font-mono">Computing...</p>
                </div>
              ) : aiResponse ? (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 text-[14px] font-light leading-[1.8] text-zinc-300 shadow-sm prose prose-invert">
                    {aiResponse}
                  </div>
                  <div className="flex items-center justify-end">
                    <button onClick={() => setAiResponse(null)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">Clear Buffer</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center space-y-6">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto text-cyan-400 border border-cyan-500/20"><Sparkles size={28} /></div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-white tracking-tight">Intelligence Standby</p>
                    <p className="text-xs font-medium text-zinc-500 max-w-[200px] mx-auto leading-relaxed">Select a Neural Context action from any knowledge node.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. FLOATING COMMAND DOCK (Bottom Center Arc/Linear Style) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90]">
        <div className="flex items-center gap-1.5 p-2 bg-zinc-900/90 backdrop-blur-3xl border border-zinc-800 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
          
          <button onClick={handleBack} className="p-4 hover:bg-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all mx-1 active:scale-95" title="Exit Workspace">
            <ArrowLeft size={18} />
          </button>
          <button onClick={() => setSidebarOpen(true)} className="p-4 hover:bg-zinc-800 rounded-2xl text-zinc-400 hover:text-white transition-all mx-1 active:scale-95" title="Command Navigator">
            <Search size={18} />
          </button>

          <div className="w-[1px] h-8 bg-zinc-800 mx-2" />

          {[
            { id: 'learn', label: 'Learn', icon: BookOpen },
            { id: 'practice', label: 'Practice', icon: PenTool },
            { id: 'quiz', label: 'Evaluate', icon: Target },
            { id: 'reflection', label: 'Synthesis', icon: Sparkles }
          ].map(step => {
            const isActive = activeSection === step.id;
            return (
              <button key={step.id} onClick={() => setActiveSection(step.id)} className={\elative flex items-center gap-2.5 py-4 px-6 rounded-[1.25rem] transition-all duration-300 \\}>
                <step.icon size={16} className={isActive ? 'text-zinc-950' : ''} />
                <span className="text-[11px] font-black uppercase tracking-widest hidden md:inline">{step.label}</span>
              </button>
            );
          })}

          <div className="w-[1px] h-8 bg-zinc-800 mx-2" />

          <button className="p-4 hover:bg-emerald-500/10 rounded-2xl text-zinc-400 hover:text-emerald-400 transition-all mx-1 group flex items-center gap-2 active:scale-95">
            <CheckCircle2 size={20} />
            <span className="text-[11px] font-black uppercase tracking-widest w-0 overflow-hidden group-hover:w-[75px] transition-all duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 hidden md:block">Complete</span>
          </button>
        </div>
      </div>

    </main>
  );
\;

fs.writeFileSync(file, before + newReturn + after);
console.log('Successfully updated layout via node script');
