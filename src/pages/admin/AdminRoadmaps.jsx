import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Search, 
  Map, 
  ChevronRight, 
  Plus, 
  MoreVertical,
  Clock,
  Layout,
  Target,
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Activity,
  User,
  Filter,
  CheckCircle2,
  Lock,
  Loader2,
  ChevronDown,
  Sparkles,
  Mail,
  Zap,
  Check
} from 'lucide-react';
import adminService from '../../services/adminService';

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, color, bg, sub, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-panel p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-accent-primary/5 transition-all"
  >
    <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12 ${color}`}>
      <Icon size={120} />
    </div>
    <div className="flex items-start justify-between relative z-10">
      <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-inner transition-transform group-hover:scale-110`}>
        <Icon size={28} />
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
          <TrendingUp size={10} /> +12%
        </div>
      </div>
    </div>
    <div className="mt-8 relative z-10">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-text-tertiary mb-1.5">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-black text-text-primary tracking-tighter">{value}</h4>
      </div>
      <p className="text-[9px] font-bold text-text-tertiary uppercase mt-2 tracking-widest">{sub}</p>
    </div>
  </motion.div>
);

const UserCard = ({ user, isSelected, onClick }) => {
  // Use real user data from props
  const name = user.fullName || user.userName || "Unknown Learner";
  const email = user.email || "No email synchronized";
  const career = user.careerGoal || "Unassigned";
  const progress = user.completionPercentage || 0;
  
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(user)}
      className={`w-full text-left p-6 rounded-[2.5rem] transition-all relative overflow-hidden group mb-4 border ${
        isSelected 
          ? 'bg-accent-primary border-accent-primary text-white shadow-xl shadow-accent-primary/20' 
          : 'bg-bg-surface/40 border-border-default/50 hover:border-accent-primary/50 text-text-secondary hover:text-text-primary'
      }`}
    >
      <div className="flex items-center gap-5 relative z-10">
        <div className="relative">
          <div className={`w-16 h-16 rounded-[1.8rem] overflow-hidden border-2 ${isSelected ? 'border-white/30' : 'border-border-default/50'} transition-colors shadow-lg`}>
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-bg-subtle text-accent-primary'}`}>
                <User size={28} />
              </div>
            )}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-bg-surface shadow-sm ${user.isActive ? 'bg-emerald-500' : 'bg-text-tertiary'}`} />
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-black tracking-tight truncate uppercase leading-none">{name}</h4>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-accent-primary/10 text-accent-primary'}`}>
              {progress}% Sync
            </span>
          </div>
          <div className={`flex items-center gap-1.5 text-[9px] font-bold truncate opacity-80 ${isSelected ? 'text-white/80' : 'text-text-tertiary'}`}>
             <Mail size={10} /> {email}
          </div>
          <p className={`text-[10px] font-black truncate uppercase tracking-widest mt-1 ${isSelected ? 'text-white' : 'text-accent-primary'}`}>
            {career}
          </p>
        </div>
      </div>

      <div className="mt-5 h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${isSelected ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-accent-primary'}`} 
          />
      </div>
      
      {isSelected && (
        <motion.div 
          layoutId="activeUserGlow"
          className="absolute -right-10 -bottom-10 opacity-20"
        >
          <Sparkles size={100} />
        </motion.div>
      )}
    </motion.button>
  );
};

const TopicItem = ({ topic, status }) => {
  const Icon = status === 'Completed' ? Check : status === 'In Progress' ? Activity : Lock;
  const color = status === 'Completed' ? 'text-emerald-500' : status === 'In Progress' ? 'text-accent-primary' : 'text-text-tertiary';
  const bg = status === 'Completed' ? 'bg-emerald-500/10' : status === 'In Progress' ? 'bg-accent-primary/10' : 'bg-bg-subtle';

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-bg-surface/30 border border-border-default/40 group/topic hover:border-accent-primary/30 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-xl ${bg} ${color} flex items-center justify-center shadow-inner`}>
          <Icon size={14} />
        </div>
        <div>
          <p className="text-[11px] font-black text-text-primary tracking-tight">{topic.title || topic.name}</p>
          <p className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest">{status}</p>
        </div>
      </div>
      {status === 'Completed' && <CheckCircle2 size={16} className="text-emerald-500" />}
    </div>
  );
};

const ModuleNode = ({ module, index, total, userProgress }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  
  // Calculate module status based on user progress data
  const moduleProgress = userProgress?.modules?.[module.id]?.completionPercentage || 0;
  const isCompleted = moduleProgress >= 100;
  const isInProgress = moduleProgress > 0 && moduleProgress < 100;
  
  return (
    <div className="relative group">
      {/* Dynamic Connection Line */}
      {index < total - 1 && (
        <div className="absolute left-[39px] top-20 bottom-[-24px] w-[2px] bg-gradient-to-b from-accent-primary/20 via-border-default/30 to-transparent" />
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`bg-bg-surface/50 border rounded-[3rem] transition-all duration-500 overflow-hidden ${
          isExpanded ? 'border-accent-primary shadow-2xl shadow-accent-primary/5' : 'border-border-default/50 hover:border-accent-primary/30'
        }`}
      >
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-8 flex items-center gap-8 cursor-pointer"
        >
          <div className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center text-white shadow-2xl relative transition-transform group-hover:scale-105 ${
            isCompleted ? 'bg-emerald-500 shadow-emerald-500/20' : 
            isInProgress ? 'bg-accent-primary shadow-accent-primary/20 animate-pulse' : 
            'bg-bg-subtle text-text-tertiary'
          }`}>
            {isCompleted ? <CheckCircle2 size={32} /> : 
             isInProgress ? <Activity size={32} /> : 
             <Lock size={32} />}
             
             <div className="absolute -top-2 -right-2 w-9 h-9 rounded-2xl bg-bg-surface border border-border-default flex items-center justify-center text-[11px] font-black text-text-primary shadow-sm">
               {index + 1}
             </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xl font-display font-black text-text-primary tracking-tighter uppercase">{module.title}</h5>
              <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                 isCompleted ? 'bg-emerald-500/10 text-emerald-600' : 
                 isInProgress ? 'bg-accent-primary/10 text-accent-primary' : 
                 'bg-bg-subtle text-text-tertiary'
              }`}>
                {isCompleted ? 'Synchronized' : isInProgress ? 'In Progress' : 'Encrypted'}
              </div>
            </div>
            
            <p className="text-xs font-medium text-text-tertiary leading-relaxed line-clamp-1 opacity-80 uppercase tracking-wider">
              {module.description || "Intelligence protocol parameters initialized."}
            </p>
            
            <div className="flex items-center gap-4 pt-3">
              <div className="flex-1 h-1.5 bg-bg-subtle rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${moduleProgress}%` }}
                   className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-accent-primary'}`} 
                 />
              </div>
              <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">{moduleProgress}%</span>
            </div>
          </div>
          
          <motion.div 
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="p-3 bg-bg-base rounded-2xl text-text-tertiary"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-8 pb-8 pt-4 border-t border-border-default/30 bg-bg-base/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(module.topics || []).map((topic, i) => (
                  <TopicItem 
                    key={topic.id || i} 
                    topic={topic} 
                    status={isCompleted ? 'Completed' : (i === 0 && isInProgress) ? 'In Progress' : 'Locked'} 
                  />
                ))}
                {(module.topics || []).length === 0 && (
                  <p className="col-span-full text-center py-6 text-[10px] font-black text-text-tertiary uppercase tracking-widest">
                    No active topic streams synchronized.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const AdminRoadmaps = () => {
  // Global Data State
  const [users, setUsers] = useState([]);
  const [careers, setCareers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // User-Specific Data State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRoadmap, setUserRoadmap] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [userCareer, setUserCareer] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [showRoadmap, setShowRoadmap] = useState(false);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      const [usersData, careersData, statsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getCareers(),
        adminService.getStats()
      ]);
      setUsers(usersData);
      setCareers(careersData);
      setStats(statsData);
      
      if (usersData && Array.isArray(usersData) && usersData.length > 0) {
        // Pass careersData directly to ensure handleUserSelect has the fresh list
        handleUserSelect(usersData[0], careersData);
      }
    } catch (error) {
      console.error("Critical failure in dashboard synchronization", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (user, freshCareers = null) => {
    if (!user) return;
    setSelectedUser(user);
    setShowRoadmap(false); // Reset roadmap visibility on new user selection
    setDetailsLoading(true);
    try {
      const activeCareers = freshCareers || careers;
      
      // Parallel fetch for specific user intelligence
      const [careerData, roadmapData, progressData] = await Promise.all([
        adminService.getUserCareer(user.id).catch(() => null),
        adminService.getUserRoadmap(user.id).catch(() => null),
        adminService.getUserProgress(user.id).catch(() => null)
      ]);

      setUserCareer(careerData);
      setUserRoadmap(roadmapData);
      setUserProgress(progressData);

      // If specific endpoints fail or return null, fallback to cross-referencing global data
      if (!roadmapData && activeCareers.length > 0) {
         const globalCareer = activeCareers.find(c => c.title === user.careerGoal || c.id === user.careerId);
         if (globalCareer) {
            const roadmaps = await adminService.getRoadmaps(globalCareer.id);
            if (roadmaps && roadmaps.length > 0) {
               const modules = await adminService.getModules(roadmaps[0].id);
               setUserRoadmap({ ...roadmaps[0], modules });
            }
         }
      }
    } catch (error) {
      console.error("Failed to synchronize learner details", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    return users.filter(u => 
      (u.fullName || u.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.careerGoal || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const dashboardAnalytics = useMemo(() => [
    { label: 'Active Learners', value: users.length, icon: Users, color: 'text-accent-primary', bg: 'bg-accent-primary/10', sub: 'Synchronized Streams' },
    { label: 'Avg Completion', value: `${stats?.avgCompletion || '42'}%`, icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10', sub: 'Neural Mastery' },
    { label: 'Total Roadmaps', value: stats?.totalRoadmaps || '24', icon: Target, color: 'text-amber-500', bg: 'bg-amber-500/10', sub: 'Active Trajectories' },
    { label: 'Live Sessions', value: '18', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10', sub: 'Stabilized Links' },
  ], [users, stats]);

  return (
    <div className="max-w-[1700px] mx-auto space-y-16 pb-32">
      
      {/* 1. ANALYTICS COMMAND CENTER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        {dashboardAnalytics.map((stat, i) => (
          <StatCard key={i} {...stat} delay={i * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* 2. LEARNER DIRECTORY — Left Panel */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-10 sticky top-8">
           <div className="space-y-8">
              <div className="flex items-center justify-between px-4">
                 <div>
                    <h3 className="text-3xl font-display font-black text-text-primary tracking-tighter">Learners</h3>
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] mt-2">Active Intelligence Directory</p>
                 </div>
                 <button className="p-4 bg-bg-surface border border-border-default rounded-[1.5rem] text-text-tertiary hover:text-accent-primary hover:shadow-xl transition-all">
                    <Filter size={20} />
                 </button>
              </div>

              <div className="relative group mx-2">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-accent-primary transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Query registered minds..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-bg-surface/50 border border-border-default/50 rounded-[2rem] py-5 pl-14 pr-8 text-sm font-bold placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/5 transition-all shadow-inner"
                 />
              </div>
           </div>

           <div className="max-h-[900px] overflow-y-auto pr-4 custom-scrollbar space-y-2 px-2">
              {loading ? (
                [1,2,3,4,5].map(i => <div key={i} className="h-28 bg-bg-surface/30 rounded-[2.5rem] animate-pulse mb-6" />)
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <UserCard 
                    key={user.id} 
                    user={user} 
                    isSelected={selectedUser?.id === user.id} 
                    onClick={handleUserSelect}
                  />
                ))
              ) : (
                <div className="py-24 text-center space-y-6 glass-panel border-dashed">
                   <div className="w-20 h-20 bg-bg-subtle rounded-3xl flex items-center justify-center mx-auto text-text-tertiary/20">
                      <Search size={40} />
                   </div>
                   <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-loose">No active intelligence streams matching your filters.</p>
                </div>
              )}
           </div>
        </div>

        {/* 3. INTELLIGENCE DASHBOARD — Right Panel */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-12">
           {selectedUser ? (
             <motion.div
               key={selectedUser.id}
               initial={{ opacity: 0, x: 40 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-12"
             >
                            {/* Sleek Minimalist User Profile Card */}
                 <div className="glass-panel p-10 md:p-14 relative overflow-hidden border border-white/10 shadow-2xl bg-bg-surface/40 backdrop-blur-3xl rounded-[2.5rem]">
                    <div className="relative z-10 flex flex-col xl:flex-row gap-12 items-start xl:items-center">
                       
                       {/* Refined Avatar Assembly */}
                       <div className="relative shrink-0">
                          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border border-white/20 shadow-xl overflow-hidden bg-bg-subtle relative z-10">
                             {selectedUser.avatar ? (
                               <img src={selectedUser.avatar} alt="" className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-accent-primary bg-accent-primary/5">
                                 <User size={64} />
                               </div>
                             )}
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-2xl shadow-lg border-4 border-bg-surface flex items-center justify-center z-20">
                             <CheckCircle2 size={20} />
                          </div>
                       </div>
                       
                       {/* Core User Information */}
                       <div className="flex-1 space-y-8">
                          <div className="space-y-4 text-center xl:text-left">
                             <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                                <h2 className="text-4xl md:text-5xl font-display font-black text-text-primary tracking-tight">{selectedUser.fullName || selectedUser.userName}</h2>
                                <span className="px-4 py-1 bg-accent-primary/10 text-accent-primary text-[10px] font-black rounded-full border border-accent-primary/20 uppercase tracking-widest">
                                   Premium Member
                                </span>
                             </div>
                             
                             <div className="flex flex-wrap items-center justify-center xl:justify-start gap-6 text-sm font-medium text-text-tertiary">
                                <span className="flex items-center gap-2 hover:text-text-primary transition-colors cursor-default">
                                   <Mail size={16} /> {selectedUser.email}
                                </span>
                                <div className="hidden md:block w-1 h-1 bg-border-default rounded-full" />
                                <span className="flex items-center gap-2">
                                   <Map size={16} /> ID: {String(selectedUser.id || 'SYNC').slice(0, 8)}
                                </span>
                             </div>
                          </div>

                          {/* Skill & Interest Bento Grid */}
                          <div className="flex flex-wrap gap-8">
                             <div className="space-y-3">
                                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                                   <Zap size={12} className="text-purple-500" /> Key Skills
                                </p>
                                <div className="flex flex-wrap gap-2">
                                   {(selectedUser.skills ? (Array.isArray(selectedUser.skills) ? selectedUser.skills : selectedUser.skills.split(',')) : ["System Logic", "Cloud Infra"]).map((skill, i) => (
                                     <span key={i} className="px-3 py-1.5 bg-bg-surface/50 text-text-secondary text-[10px] font-bold rounded-xl border border-border-default/50">
                                       {skill.trim()}
                                     </span>
                                   ))}
                                </div>
                             </div>
                             <div className="space-y-3">
                                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest flex items-center gap-2">
                                   <Target size={12} className="text-amber-500" /> Focus Areas
                                </p>
                                <div className="flex flex-wrap gap-2">
                                   {(selectedUser.interests ? (Array.isArray(selectedUser.interests) ? selectedUser.interests : selectedUser.interests.split(',')) : ["AI Ethics", "ML Systems"]).map((interest, i) => (
                                     <span key={i} className="px-3 py-1.5 bg-bg-surface/50 text-text-secondary text-[10px] font-bold rounded-xl border border-border-default/50">
                                       {interest.trim()}
                                     </span>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </div>

                       {/* Action & Status Section */}
                       <div className="w-full xl:w-72 space-y-4">
                          <div className="bg-bg-base/30 p-6 rounded-3xl border border-border-default/50 space-y-4">
                             <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Progress</span>
                                <span className="text-sm font-black text-emerald-500">{selectedUser.completionPercentage || 0}%</span>
                             </div>
                             <div className="w-full h-1.5 bg-bg-subtle rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${selectedUser.completionPercentage || 0}%` }}
                                  className="h-full bg-emerald-500"
                                />
                             </div>
                          </div>

                          <button 
                            onClick={() => setShowRoadmap(!showRoadmap)}
                            className={`w-full p-6 rounded-3xl border transition-all flex flex-col items-start gap-2 group ${showRoadmap ? 'bg-accent-primary border-accent-primary text-white shadow-xl shadow-accent-primary/20' : 'bg-bg-surface hover:bg-bg-subtle border-border-default'}`}
                          >
                             <div className="flex items-center justify-between w-full">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${showRoadmap ? 'text-white/70' : 'text-text-tertiary'}`}>Active Domain</span>
                                <ChevronRight size={16} className={`transition-transform duration-300 ${showRoadmap ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                             </div>
                             <span className="text-sm font-black uppercase truncate tracking-tight">
                                {selectedUser.careerGoal || "Pending Selection"}
                             </span>
                          </button>
                       </div>

                    </div>
                 </div>

                {/* Detailed Intelligence Progress Path — Conditional Display */}
                <AnimatePresence>
                   {showRoadmap && (
                     <motion.div 
                       initial={{ opacity: 0, y: 20, height: 0 }}
                       animate={{ opacity: 1, y: 0, height: 'auto' }}
                       exit={{ opacity: 0, y: 20, height: 0 }}
                       className="space-y-16 overflow-hidden pt-12 border-t border-border-default/20"
                     >
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 px-6">
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-[2rem] bg-accent-primary/10 flex items-center justify-center text-accent-primary border border-accent-primary/20 shadow-inner">
                                <Layers size={32} />
                             </div>
                             <div>
                                <h4 className="text-3xl font-display font-black text-text-primary tracking-tighter">Path Architecture</h4>
                                <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.3em] mt-1">Ecosystem Status: 4 Stages Synchronized</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="px-6 py-3 bg-bg-surface/50 border border-border-default/50 rounded-2xl flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                   <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                   <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Done</span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <div className="w-3 h-3 bg-accent-primary rounded-full" />
                                   <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">Active</span>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-12 relative px-4">
                          {detailsLoading ? (
                            [1,2,3].map(i => <div key={i} className="h-44 bg-bg-surface/30 rounded-[3rem] animate-pulse mb-8" />)
                          ) : userRoadmap?.modules ? (
                            <div className="space-y-12">
                               {userRoadmap.modules.map((module, idx) => (
                                 <ModuleNode 
                                   key={module.id || idx}
                                   index={idx} 
                                   total={userRoadmap.modules.length} 
                                   module={module}
                                   userProgress={userProgress}
                                 />
                               ))}
                            </div>
                          ) : (
                            <div className="py-48 text-center glass-panel border-dashed border-2 space-y-10 bg-bg-surface/20">
                               <div className="w-32 h-32 bg-bg-subtle rounded-[3rem] flex items-center justify-center mx-auto text-text-tertiary/20 shadow-inner">
                                  <Map size={64} />
                               </div>
                               <div className="space-y-4">
                                  <h5 className="text-3xl font-display font-black text-text-primary tracking-tight">Intelligence Map Required</h5>
                                  <p className="text-lg font-medium text-text-tertiary max-w-lg mx-auto leading-relaxed">
                                     This learner's neural link is active, but no career roadmap has been architected yet.
                                  </p>
                               </div>
                               <button className="px-12 py-5 bg-gradient-brand text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-accent-primary/20 hover:scale-105 transition-all">
                                  Assign Intelligence Path
                               </button>
                            </div>
                          )}
                       </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </motion.div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center py-60 space-y-12">
                <motion.div
                  animate={{ 
                    y: [0, -30, 0],
                    rotate: [0, 8, -8, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="w-72 h-72 bg-gradient-brand/5 rounded-[5rem] flex items-center justify-center relative"
                >
                   <div className="absolute inset-0 bg-accent-primary/10 blur-[120px] rounded-full animate-pulse" />
                   <div className="w-56 h-56 bg-bg-surface border border-border-default rounded-[4rem] flex items-center justify-center shadow-2xl relative z-10">
                      <User size={100} className="text-accent-primary opacity-20" />
                   </div>
                   <div className="absolute -bottom-6 -right-6 p-8 bg-bg-surface border border-border-default rounded-[2.5rem] shadow-2xl relative z-20">
                      <Search size={48} className="text-accent-primary" />
                   </div>
                </motion.div>
                
                <div className="text-center space-y-6 max-w-md">
                   <h3 className="text-4xl font-display font-black text-text-primary tracking-tighter">Learner Synchronicity</h3>
                   <p className="text-lg font-medium text-text-tertiary leading-relaxed opacity-80">
                      Select a student from the intelligence directory to monitor their architectural progress and learning stability.
                   </p>
                </div>
                
                <div className="flex gap-6">
                   {[0, 1, 2].map(i => (
                     <div key={i} className="w-3 h-3 rounded-full bg-accent-primary animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminRoadmaps;
