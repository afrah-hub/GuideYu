import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Plus, 
  Save, 
  Settings2, 
  Terminal, 
  History, 
  Eye, 
  CheckCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import adminService from '../../services/adminService';

const AdminAiSettings = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', templateText: '', category: 'Lesson Generation' });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await adminService.getTemplates();
      setTemplates(data);
      if (data.length > 0 && !selectedTemplate) {
        setSelectedTemplate(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch templates", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;
    try {
      await adminService.updateTemplate(selectedTemplate.id, selectedTemplate);
      alert("Template saved successfully");
    } catch (error) {
      alert("Failed to save template");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newTemplate = await adminService.createTemplate(formData);
      setTemplates([...templates, newTemplate]);
      setIsModalOpen(false);
      setFormData({ name: '', templateText: '', category: 'Lesson Generation' });
      setSelectedTemplate(newTemplate);
    } catch (error) {
      alert("Failed to create template");
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">AI Control Center</h1>
          <p className="text-text-tertiary font-medium mt-1">Configure prompt templates and neural behavior models</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-ghost py-2.5 px-5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-bg-surface/20 border-border-default/50">
            <History className="w-4 h-4" />
            Revision Logs
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary h-12 px-6 rounded-2xl flex items-center gap-2.5 shadow-[0_8px_20px_-4px_rgba(39,116,174,0.4)]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-black uppercase tracking-widest text-[11px]">Inject Template</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Template List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 px-2">
            <Terminal className="w-4 h-4 text-accent-primary" />
            <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Prompt Modules</h3>
          </div>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  selectedTemplate?.id === template.id 
                    ? 'bg-accent-primary text-white shadow-xl shadow-accent-primary-subtle' 
                    : 'hover:bg-bg-subtle/50 text-text-secondary border border-transparent hover:border-border-default/50'
                }`}
              >
                <div className="flex flex-col gap-1 relative z-10">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${selectedTemplate?.id === template.id ? 'text-white/60' : 'text-accent-primary'}`}>
                    {template.category}
                  </span>
                  <span className="text-sm font-black truncate tracking-tight">{template.name}</span>
                </div>
                {selectedTemplate?.id === template.id && (
                  <motion.div 
                    layoutId="activeTemplateIndicator"
                    className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" 
                  />
                )}
              </button>
            ))}
            {templates.length === 0 && !loading && (
              <div className="p-8 text-center glass-panel border-dashed border-2 border-border-default/50">
                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">No modules initialized</p>
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3">
          {selectedTemplate ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel p-1 relative overflow-hidden"
            >
              <div className="p-8 bg-bg-surface/30 backdrop-blur-md rounded-[31px]">
                <div className="flex items-center justify-between mb-10 pb-8 border-b border-border-default/30">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary/10 to-accent-primary/20 border border-accent-primary/20 flex items-center justify-center text-accent-primary shadow-inner">
                      <Settings2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-black text-text-primary tracking-tight">{selectedTemplate.name}</h3>
                      <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-1">{selectedTemplate.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="btn-ghost py-3 px-6 text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 bg-bg-surface/20 border-border-default/50">
                      <Eye className="w-4 h-4" />
                      Simulation
                    </button>
                    <button 
                      onClick={handleSave}
                      className="btn-primary h-12 px-6 rounded-xl flex items-center gap-2.5 shadow-[0_8px_20px_-4px_rgba(39,116,174,0.4)]"
                    >
                      <Save className="w-4.5 h-4.5" />
                      <span className="font-black uppercase tracking-widest text-[10px]">Commit Changes</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2">
                        Neural Instruction Matrix
                        <HelpCircle className="w-3.5 h-3.5 opacity-50" />
                      </label>
                      <div className="flex items-center gap-2 px-2 py-1 rounded bg-bg-subtle/50 border border-border-default/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                        <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Model: GPT-4-Vision</span>
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-accent-primary/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                      <textarea 
                        className="input font-mono text-[13px] leading-relaxed min-h-[500px] p-8 bg-bg-subtle/30 backdrop-blur-sm border-border-default/50 rounded-[24px] relative z-10 focus:ring-0 focus:border-accent-primary/50 transition-all"
                        value={selectedTemplate.templateText}
                        onChange={(e) => setSelectedTemplate({...selectedTemplate, templateText: e.target.value})}
                        spellCheck={false}
                      />
                    </div>
                  </div>

                  <div className="p-6 rounded-[20px] bg-accent-primary/5 border border-accent-primary/10 flex gap-4 items-start shadow-inner">
                    <Info className="w-5 h-5 text-accent-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-text-secondary leading-relaxed uppercase tracking-wider opacity-80">
                      Utilize <code className="px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary font-black">{`{{topic}}`}</code>, 
                      <code className="px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary font-black">{`{{difficulty}}`}</code>, and 
                      <code className="px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary font-black">{`{{userSkills}}`}</code> as dynamic injection vectors.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 glass-panel border-dashed border-2 border-border-default/50">
              <div className="w-24 h-24 rounded-full bg-bg-subtle/50 flex items-center justify-center mb-8">
                <Sparkles className="w-10 h-10 text-accent-primary opacity-20" />
              </div>
              <h3 className="text-xl font-display font-black text-text-primary tracking-tight mb-3">No Template Selected</h3>
              <p className="text-xs font-black text-text-tertiary uppercase tracking-widest max-w-xs leading-loose">Select a prompt module from the matrix to initialize the neural editor.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Template Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-bg-base/60 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-xl glass-panel p-10 shadow-[0_32px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <div className="mb-10">
                <h2 className="text-3xl font-display font-black text-text-primary tracking-tight">Create AI Template</h2>
                <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mt-2">Initialize new behavior module</p>
              </div>
              <form onSubmit={handleCreate} className="space-y-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Module Designation</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. SYLLABUS GENESIS"
                    className="input h-14 bg-bg-subtle/50 rounded-2xl border-border-default/50 font-black text-sm uppercase tracking-wider"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Category Domain</label>
                  <select 
                    className="input h-12 bg-bg-subtle/50 rounded-2xl border-border-default/50 font-black text-xs uppercase tracking-widest cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Lesson Generation</option>
                    <option>Syllabus Construction</option>
                    <option>Quiz Design</option>
                    <option>Career Guidance</option>
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Initial Logic Matrix</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Paste initial prompt instructions..."
                    className="input py-4 bg-bg-subtle/50 rounded-2xl border-border-default/50 font-bold text-sm leading-relaxed resize-none"
                    value={formData.templateText}
                    onChange={(e) => setFormData({...formData, templateText: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost flex-1 h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em]">Abort</button>
                  <button type="submit" className="btn-primary flex-1 h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_8px_20px_-4px_rgba(39,116,174,0.4)]">Commit Module</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAiSettings;
