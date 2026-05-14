import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLogo from '../components/BrandLogo';
import {
  GraduationCap,
  Briefcase,
  Wrench,
  Target,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Building2,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [isQualDropdownOpen, setIsQualDropdownOpen] = useState(false);
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen mesh-gradient-theme flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
      </div>
    );
  }

  if (!user) return null;

  const [formData, setFormData] = useState({
    highestQualification: '',
    manualQualification: '',
    stream: '',
    institutionName: '',
    currentStatus: '',
    careerGoal: '',
    preferredIndustry: '',
    skills: '',
    skillLevels: '',
    interests: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        highestQualification: formData.highestQualification === 'Others'
          ? formData.manualQualification
          : formData.highestQualification
      };
      // Remove the temporary field before sending
      delete submissionData.manualQualification;

      await authService.updateProfile(submissionData);
      await refreshUser(); // Sync the global state with new profile data
      setStep(4); // Success step
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect to dashboard after 2 seconds
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { title: 'Academic', icon: <GraduationCap size={20} /> },
    { title: 'Professional', icon: <Briefcase size={20} /> },
    { title: 'Skills', icon: <Wrench size={20} /> }
  ];

  return (
    <div className="min-h-screen mesh-gradient-theme flex items-center justify-center p-4 py-12 relative overflow-hidden transition-colors duration-500">
      {/* Premium Noise Overlay */}
      <div className="absolute inset-0 noise-overlay opacity-[0.05] pointer-events-none z-0" />

      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--accent-primary-subtle)] rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--accent-primary-glow)] rounded-full blur-[120px] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl glass-panel relative z-10 overflow-hidden"
      >
        {/* Progress Header */}
        <div className="p-10 pb-8 border-b border-[var(--border-default)]">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-2 font-poppins tracking-tighter">
                Welcome, <span className="text-[var(--text-accent)]">{user?.fullName?.split(' ')?.[0] || 'Guest'}</span>!
              </h1>
              <p className="text-[var(--text-secondary)] font-medium tracking-tight">Let's decode your professional DNA.</p>
            </div>
            <div className="flex items-center justify-center mb-6 group hover:rotate-12 transition-transform duration-500">
              <BrandLogo className="group-hover:scale-110 transition-transform" size={48} />
            </div>
          </div>

          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-6 left-0 right-0 h-1 bg-[var(--bg-overlay)] z-0 rounded-full" />
            <motion.div
              className="absolute top-6 left-0 h-1 bg-gradient-to-r var(--gradient-brand) z-0 origin-left rounded-full shadow-[0_0_15px_rgba(0,93,195,0.4)]"
              animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.6, ease: "circOut" }}
            />

            {steps.map((s, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${step > idx + 1 ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary-subtle)]' :
                  step === idx + 1 ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)] text-[var(--accent-primary)] shadow-xl shadow-[var(--accent-primary-subtle)]' :
                    'bg-[var(--bg-subtle)] border-[var(--border-faint)] text-slate-400'
                  }`}>
                  {step > idx + 1 ? <CheckCircle2 size={20} /> : s.icon}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-[0.25em] transition-colors duration-300 ${step === idx + 1 ? 'text-[var(--accent-primary)]' : 'text-slate-400'
                  }`}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 pt-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Highest Qualification</label>
                    <AnimatePresence mode="wait">
                      {formData.highestQualification !== 'Others' ? (
                        <motion.div
                          key="select-mode"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="relative"
                        >
                          <div 
                            onClick={() => setIsQualDropdownOpen(!isQualDropdownOpen)}
                            className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] cursor-pointer font-bold flex items-center justify-between hover:border-[var(--accent-primary)] transition-all group"
                          >
                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] group-hover:text-[var(--text-accent)] transition-colors" size={18} />
                            <span className={formData.highestQualification ? 'text-[var(--text-primary)]' : 'text-slate-400'}>
                              {formData.highestQualification || 'Select Qualification'}
                            </span>
                            <motion.div
                              animate={{ rotate: isQualDropdownOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <BrandLogo size={16} className="" />
                            </motion.div>
                          </div>

                          <AnimatePresence>
                            {isQualDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 right-0 mt-3 bg-[var(--bg-surface)] backdrop-blur-3xl border border-[var(--border-default)] rounded-2xl shadow-2xl z-50 overflow-hidden py-2"
                              >
                                {[
                                  "High School",
                                  "Bachelor's",
                                  "Master's",
                                  "PhD",
                                  "Others"
                                ].map((option) => (
                                  <div
                                    key={option}
                                    onClick={() => {
                                      handleInputChange({ target: { name: 'highestQualification', value: option } });
                                      setIsQualDropdownOpen(false);
                                    }}
                                    className={`px-6 py-3.5 text-sm font-bold cursor-pointer transition-all flex items-center justify-between group/opt ${
                                      formData.highestQualification === option 
                                        ? 'bg-[var(--accent-primary)] text-white' 
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)]'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                       <div className={`w-1.5 h-1.5 rounded-full transition-all ${formData.highestQualification === option ? 'bg-white scale-150' : 'bg-[var(--bg-overlay)] group-hover/opt:bg-[var(--accent-primary)]'}`} />
                                       {option === 'Others' ? 'Others (Manual Entry)' : option}
                                    </div>
                                    {formData.highestQualification === option && <CheckCircle2 size={16} />}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="input-mode"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="relative group"
                        >
                          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${formData.manualQualification ? 'text-emerald-500' : 'text-[var(--accent-primary)]'}`}>
                            {formData.manualQualification ? <CheckCircle2 size={18} className="animate-bounce" /> : <BrandLogo size={18} className="animate-pulse" />}
                          </div>
                          <input
                            type="text"
                            name="manualQualification"
                            value={formData.manualQualification}
                            onChange={handleInputChange}
                            placeholder="Type your qualification..."
                            autoFocus
                            className={`w-full bg-[var(--bg-surface)] border-2 rounded-2xl py-4 pl-12 pr-20 text-[var(--text-primary)] outline-none transition-all font-bold placeholder:text-slate-400 ${
                              formData.manualQualification 
                                ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10' 
                                : 'border-[var(--accent-primary)]/30 focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-primary-subtle)]'
                            }`}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {formData.manualQualification && (
                              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Selected</span>
                            )}
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, highestQualification: '', manualQualification: '' }))}
                              className="p-1.5 bg-[var(--bg-overlay)] rounded-lg text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-all"
                              title="Back to list"
                            >
                              <ArrowLeft size={14} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Specialization / Stream</label>
                    <div className="relative group">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                      <input
                        type="text"
                        name="stream"
                        value={formData.stream}
                        onChange={handleInputChange}
                        placeholder="e.g. Computer Science"
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-primary-subtle)] focus:border-[var(--accent-primary)] transition-all font-bold placeholder-[var(--text-tertiary)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Institution Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                    <input
                      type="text"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleInputChange}
                      placeholder="University or College Name"
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-primary-subtle)] focus:border-[var(--accent-primary)] transition-all font-bold placeholder-[var(--text-tertiary)]"
                    />
                  </div>
                </div>



                <button
                  onClick={nextStep}
                  disabled={
                    !formData.highestQualification ||
                    (formData.highestQualification === 'Others' && !formData.manualQualification) ||
                    !formData.stream
                  }
                  className="w-full relative group overflow-hidden px-8 py-5 bg-[var(--accent-primary)] text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[var(--accent-primary-subtle)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--accent-primary-subtle)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Continue to Career <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r var(--gradient-brand) opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Current Status</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Student', 'Professional', 'Job Seeker', 'Entrepreneur'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFormData(prev => ({ ...prev, currentStatus: status }))}
                        className={`py-5 rounded-2xl border transition-all duration-500 font-black text-[10px] uppercase tracking-widest ${formData.currentStatus === status
                          ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--text-accent)] shadow-lg shadow-[var(--accent-primary-subtle)]'
                          : 'bg-[var(--bg-surface)] border-[var(--border-default)] text-[var(--text-tertiary)] hover:border-[var(--accent-primary)]'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Career Goal</label>
                  <div className="relative group">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                    <input
                      type="text"
                      name="careerGoal"
                      value={formData.careerGoal}
                      onChange={handleInputChange}
                      placeholder="What is your dream job?"
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-primary-subtle)] focus:border-[var(--accent-primary)] transition-all font-bold placeholder-[var(--text-tertiary)]"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Preferred Industry</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                    <input
                      type="text"
                      name="preferredIndustry"
                      value={formData.preferredIndustry}
                      onChange={handleInputChange}
                      placeholder="e.g. Technology, Healthcare..."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-primary-subtle)] focus:border-[var(--accent-primary)] transition-all font-bold placeholder-[var(--text-tertiary)]"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 py-5 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-[2rem] text-[var(--text-secondary)] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-[var(--border-default)] flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!formData.currentStatus || !formData.careerGoal}
                    className="flex-[2] relative group overflow-hidden px-8 py-5 bg-[var(--accent-primary)] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-[var(--accent-primary-subtle)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--accent-primary-subtle)] disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Next: Skills <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r var(--gradient-brand) opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Core Skills / Skill Matrix</label>
                  <div className="relative group">
                    <Cpu className="absolute left-4 top-5 text-slate-400 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                    <textarea
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="e.g. React, Node.js, Python, UI/UX Design..."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[2rem] py-5 pl-12 pr-4 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-primary-subtle)] focus:border-[var(--accent-primary)] transition-all font-bold placeholder-[var(--text-tertiary)] resize-none"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Skill Proficiency Levels</label>
                  <div className="relative group">
                    <Target className="absolute left-4 top-5 text-slate-400 group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
                    <textarea
                      name="skillLevels"
                      value={formData.skillLevels}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="e.g. React (Expert), Node.js (Intermediate)..."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[2rem] py-5 pl-12 pr-4 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-primary-subtle)] focus:border-[var(--accent-primary)] transition-all font-bold placeholder-[var(--text-tertiary)] resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Areas of Interest</label>
                  <div className="relative group">
                    <BrandLogo className="absolute left-4 top-5 transition-colors" size={18} />
                    <textarea
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="e.g. Artificial Intelligence, Web Development..."
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[2rem] py-5 pl-12 pr-4 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent-primary-subtle)] focus:border-[var(--accent-primary)] transition-all font-bold placeholder-[var(--text-tertiary)] resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 py-5 bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-[2rem] text-[var(--text-secondary)] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-[var(--border-default)] flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.skills}
                    className="flex-[2] relative group overflow-hidden px-8 py-5 bg-[var(--accent-primary)] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-[var(--accent-primary-subtle)] flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[var(--accent-primary-subtle)] transition-all duration-500 disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        >
                          <BrandLogo size={20} className="" />
                        </motion.div>
                      ) : (
                        <>Finalize Profile <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform duration-300" /></>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r var(--gradient-brand) opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-8"
              >
                <div className="w-32 h-32 bg-[var(--accent-primary)]/10 rounded-[2.5rem] flex items-center justify-center relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                  >
                    <CheckCircle2 className="text-[var(--accent-primary)]" size={72} />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 border-2 border-[var(--accent-primary)]/30 rounded-[2.5rem]"
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tighter leading-tight">Profile Setup<br />Complete!</h2>
                  <p className="text-[var(--text-secondary)] font-medium max-w-sm mx-auto leading-relaxed">
                    Welcome to the future of career guidance. Redirecting you to your neural dashboard...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;

