import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  BookOpen, 
  GripVertical, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal,
  Target,
  FileText,
  Layers
} from 'lucide-react';
import adminService from '../../services/adminService';

const AdminModules = () => {
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [modules, setModules] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    fetchCareers();
  }, []);

  useEffect(() => {
    if (selectedCareer) {
      fetchRoadmaps(selectedCareer.id);
    }
  }, [selectedCareer]);

  useEffect(() => {
    if (selectedRoadmap) {
      fetchModules(selectedRoadmap.id);
    }
  }, [selectedRoadmap]);

  const fetchCareers = async () => {
    try {
      const data = await adminService.getCareers();
      setCareers(data);
      if (data.length > 0) setSelectedCareer(data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoadmaps = async (careerId) => {
    try {
      const data = await adminService.getRoadmaps(careerId);
      setRoadmaps(data);
      if (data.length > 0) setSelectedRoadmap(data[0]);
      else {
        setSelectedRoadmap(null);
        setModules([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchModules = async (roadmapId) => {
    try {
      const data = await adminService.getModules(roadmapId);
      setModules(data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleModule = (id) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">Sequence Architect</h1>
          <p className="text-text-tertiary font-medium mt-1">Orchestrate the logical flow of knowledge modules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1 bg-bg-surface/10 rounded-[32px] border border-border-default/50 backdrop-blur-md">
        <div className="p-6 space-y-3">
          <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">Target Sector</label>
          <select 
            className="input h-14 bg-bg-surface/50 border-border-default/50 rounded-2xl font-black text-sm uppercase tracking-wider cursor-pointer"
            value={selectedCareer?.id || ''}
            onChange={(e) => setSelectedCareer(careers.find(c => c.id === parseInt(e.target.value)))}
          >
            {careers.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div className="p-6 space-y-3">
          <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] ml-1">Active Roadmap</label>
          <select 
            className="input h-14 bg-bg-surface/50 border-border-default/50 rounded-2xl font-black text-sm uppercase tracking-wider cursor-pointer"
            value={selectedRoadmap?.id || ''}
            onChange={(e) => setSelectedRoadmap(roadmaps.find(r => r.id === parseInt(e.target.value)))}
          >
            {roadmaps.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
            {roadmaps.length === 0 && <option>No roadmaps initialized</option>}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-primary" />
          Module Hierarchy
        </h3>
        <button className="btn-primary h-10 px-5 rounded-xl flex items-center gap-2 shadow-[0_8px_20px_-4px_rgba(39,116,174,0.4)]">
          <Plus className="w-4 h-4" />
          <span className="font-black uppercase tracking-widest text-[10px]">Add Component</span>
        </button>
      </div>

      <div className="space-y-5">
        {modules.map((module, index) => (
          <div key={module.id} className="glass-panel overflow-hidden border border-border-default/50 hover:border-accent-primary/30 transition-all duration-300">
            <div 
              className={`p-6 flex items-center gap-5 cursor-pointer transition-colors ${expandedModules[module.id] ? 'bg-bg-surface/40' : 'hover:bg-bg-surface/20'}`}
              onClick={() => toggleModule(module.id)}
            >
              <div className="p-2 rounded-lg bg-bg-subtle/50 text-text-tertiary cursor-grab hover:text-text-primary transition-colors">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-primary/10 to-accent-primary/20 border border-accent-primary/20 flex items-center justify-center text-accent-primary font-black shadow-inner">
                {index + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-black text-text-primary tracking-tight group-hover:text-accent-primary transition-colors">{module.title}</h4>
                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.15em] mt-1">Component Payload: {module.topics?.length || 0} Nodes</p>
              </div>
              <div className={`p-2 rounded-xl transition-all duration-300 ${expandedModules[module.id] ? 'bg-accent-primary text-white rotate-180' : 'bg-bg-subtle/50 text-text-tertiary'}`}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>

            <AnimatePresence>
              {expandedModules[module.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-border-default/30 bg-bg-subtle/20 backdrop-blur-md"
                >
                  <div className="p-8 space-y-4">
                    {module.topics?.map((topic, tIndex) => (
                      <motion.div 
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: tIndex * 0.05 }}
                        key={topic.id} 
                        className="flex items-center gap-4 p-4 rounded-2xl bg-bg-surface/40 border border-border-default/50 shadow-sm group hover:border-accent-primary/30 transition-all"
                      >
                        <div className="w-8 h-8 rounded-xl bg-bg-subtle/50 border border-border-default flex items-center justify-center text-[10px] font-black text-text-tertiary group-hover:text-accent-primary group-hover:border-accent-primary/30 transition-all">
                          {tIndex + 1}
                        </div>
                        <span className="text-sm font-bold text-text-secondary flex-1 tracking-tight group-hover:text-text-primary transition-colors">{topic.title}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2 rounded-xl bg-bg-surface/50 border border-border-default/50 text-text-tertiary hover:text-accent-primary transition-all">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    <button className="w-full py-5 rounded-[20px] border-2 border-dashed border-border-default/50 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] hover:border-accent-primary hover:text-accent-primary hover:bg-accent-primary/5 transition-all flex items-center justify-center gap-3">
                      <Plus className="w-4 h-4" />
                      Inject Node into Module
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {modules.length === 0 && (
          <div className="py-24 text-center glass-panel border-dashed border-2 border-border-default/50 bg-bg-subtle/10">
            <div className="w-20 h-20 rounded-full bg-bg-subtle/50 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-text-tertiary opacity-20" />
            </div>
            <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em]">No operational modules found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModules;
