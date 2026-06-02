import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ChevronLeft, Target, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../services/recommendationService';

import { motion, AnimatePresence } from 'framer-motion';

const ExploreCareers = () => {
  const navigate = useNavigate();
  const [aiCareers, setAiCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(15);
  const [savedCareer, setSavedCareer] = useState(null);
  const [savingCareer, setSavingCareer] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchAICareers = async () => {
      try {
        setLoading(true);
        const response = await recommendationService.getAICareers(15);
        setAiCareers(response.careers || []);
      } catch (err) {
        console.error('Failed to load AI suggestions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAICareers();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSetGoal = async (careerName) => {
    try {
      setSavingCareer(careerName);
      const res = await fetch(
        `/api/careerpath/select?targetCareer=${encodeURIComponent(careerName)}`,
        { method: 'POST', credentials: 'include' }
      );
      if (res.ok) {
        setSavedCareer(careerName);
        showToast(`🎯 Career goal set to "${careerName}"! View it on your dashboard.`);
      } else {
        showToast('Failed to save career goal. Please try again.', 'error');
      }
    } catch (e) {
      console.error('Error setting career goal:', e);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setSavingCareer(null);
    }
  };

  const filters = ['All', 'Development', 'Cloud', 'Design', 'Strategy', 'Security'];

  // Static career data for each specific category tab
  const staticCareerData = {
    Development: [
      { name: 'Frontend Developer', reason: 'Build modern web interfaces.', skills: ['React', 'HTML', 'CSS'] },
      { name: 'Backend Developer', reason: 'Create robust server-side logic.', skills: ['Node.js', 'C#', 'SQL'] },
      { name: 'Full Stack Developer', reason: 'Handle end‑to‑end development.', skills: ['React', 'Node.js', 'Azure'] },
      { name: 'React Developer', reason: 'Specialize in React ecosystem.', skills: ['React', 'Redux', 'Hooks'] },
      { name: '.NET Developer', reason: 'Build applications with .NET.', skills: ['C#', '.NET', 'ASP.NET'] },
      { name: 'Mobile App Developer', reason: 'Develop mobile solutions.', skills: ['React Native', 'Flutter', 'Kotlin'] },
      { name: 'Software Engineer', reason: 'Design scalable software.', skills: ['Algorithms', 'Design Patterns', 'Testing'] },
      { name: 'Web Developer', reason: 'Create responsive websites.', skills: ['HTML', 'CSS', 'JavaScript'] },
      { name: 'API Developer', reason: 'Design and implement APIs.', skills: ['REST', 'GraphQL', 'Node.js'] },
      { name: 'Java Developer', reason: 'Develop Java applications.', skills: ['Java', 'Spring', 'Maven'] },
    ],
    Cloud: [
      { name: 'Cloud Engineer', reason: 'Manage cloud infrastructure.', skills: ['AWS', 'Azure', 'GCP'] },
      { name: 'AWS Engineer', reason: 'Specialize in AWS services.', skills: ['EC2', 'S3', 'Lambda'] },
      { name: 'Azure Engineer', reason: 'Focus on Microsoft Azure.', skills: ['Azure VM', 'AKS', 'Functions'] },
      { name: 'DevOps Engineer', reason: 'Bridge development and operations.', skills: ['CI/CD', 'Docker', 'Kubernetes'] },
      { name: 'Site Reliability Engineer', reason: 'Ensure reliability of services.', skills: ['Monitoring', 'Alerting', 'Automation'] },
      { name: 'Cloud Architect', reason: 'Design cloud solutions.', skills: ['Architecture', 'Cost Optimization', 'Security'] },
      { name: 'Kubernetes Engineer', reason: 'Manage container orchestration.', skills: ['K8s', 'Helm', 'Service Mesh'] },
      { name: 'Infrastructure Engineer', reason: 'Build underlying infrastructure.', skills: ['Terraform', 'IaC', 'Networking'] },
      { name: 'Platform Engineer', reason: 'Develop internal platforms.', skills: ['Platform Services', 'APIs', 'Automation'] },
      { name: 'Cloud Security Engineer', reason: 'Secure cloud environments.', skills: ['IAM', 'Encryption', 'Compliance'] },
    ],
    Design: [
      { name: 'UI Designer', reason: 'Design user interfaces.', skills: ['Figma', 'Sketch', 'Adobe XD'] },
      { name: 'UX Designer', reason: 'Improve user experience.', skills: ['User Research', 'Wireframes', 'Prototyping'] },
      { name: 'Product Designer', reason: 'End‑to‑end product design.', skills: ['Design Thinking', 'User Flow', 'Testing'] },
      { name: 'Visual Designer', reason: 'Create visual assets.', skills: ['Illustrator', 'Photoshop', 'Branding'] },
      { name: 'Graphic Designer', reason: 'Design graphics for media.', skills: ['Illustrator', 'InDesign', 'Typography'] },
      { name: 'Motion Designer', reason: 'Animate UI elements.', skills: ['After Effects', 'Motion Graphics'] },
      { name: 'Interaction Designer', reason: 'Design interactive experiences.', skills: ['Prototyping', 'Microinteractions'] },
      { name: 'UX Researcher', reason: 'Gather user insights.', skills: ['Surveys', 'Interviews', 'Usability Testing'] },
      { name: 'Web Designer', reason: 'Design for the web.', skills: ['HTML', 'CSS', 'Responsive Design'] },
      { name: 'Brand Designer', reason: 'Develop brand identity.', skills: ['Brand Strategy', 'Logo Design'] },
    ],
    Strategy: [
      { name: 'Product Manager', reason: 'Own product vision.', skills: ['Roadmapping', 'Stakeholder Management'] },
      { name: 'Business Analyst', reason: 'Analyze business needs.', skills: ['Requirements', 'Process Modeling'] },
      { name: 'IT Consultant', reason: 'Advise on technology solutions.', skills: ['Strategy', 'Implementation'] },
      { name: 'Technical Project Manager', reason: 'Manage technical projects.', skills: ['Agile', 'Scrum'] },
      { name: 'Scrum Master', reason: 'Facilitate Scrum processes.', skills: ['Facilitation', 'Coaching'] },
      { name: 'Operations Analyst', reason: 'Optimize operations.', skills: ['Data Analysis', 'Process Improvement'] },
      { name: 'Digital Strategist', reason: 'Plan digital initiatives.', skills: ['SEO', 'Content Strategy'] },
      { name: 'Solution Consultant', reason: 'Design solutions for clients.', skills: ['Solution Design', 'Client Interaction'] },
      { name: 'Innovation Strategist', reason: 'Drive innovation.', skills: ['Ideation', 'Trend Analysis'] },
      { name: 'Technology Advisor', reason: 'Guide technology decisions.', skills: ['Tech Evaluation', 'Roadmaps'] },
    ],
    Security: [
      { name: 'Ethical Hacker', reason: 'Identify vulnerabilities.', skills: ['Penetration Testing', 'Security Audits'] },
      { name: 'Penetration Tester', reason: 'Test system defenses.', skills: ['Exploitation', 'Reporting'] },
      { name: 'SOC Analyst', reason: 'Monitor security events.', skills: ['SIEM', 'Incident Detection'] },
      { name: 'Cybersecurity Engineer', reason: 'Build secure systems.', skills: ['Firewalls', 'Encryption'] },
      { name: 'Security Researcher', reason: 'Research security threats.', skills: ['Threat Hunting', 'Malware Analysis'] },
      { name: 'Red Team Operator', reason: 'Simulate attacks.', skills: ['Adversary Emulation'] },
      { name: 'Vulnerability Researcher', reason: 'Find new vulnerabilities.', skills: ['Research', 'Exploit Development'] },
      { name: 'Network Security Engineer', reason: 'Secure network infrastructure.', skills: ['Network Segmentation', 'IDS/IPS'] },
      { name: 'Incident Response Analyst', reason: 'Handle security incidents.', skills: ['Forensics', 'Containment'] },
      { name: 'Malware Analyst', reason: 'Analyze malicious software.', skills: ['Reverse Engineering', 'Static Analysis'] },
    ],
  };

  // Determine the source list based on the active tab
  const sourceList = activeFilter === 'All' ? aiCareers : (staticCareerData[activeFilter] || []);

  // Apply search filtering (keeps UI consistent)
  const filteredCareers = sourceList.filter(career => {
    const matchesSearch = career.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-10 space-y-8 md:space-y-12">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl backdrop-blur-xl border flex items-center gap-3 ${
              toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {toast.type !== 'error' && <CheckCircle2 size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header Section */}
      <header className="space-y-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 text-[var(--text-tertiary)] hover:text-[var(--text-accent)] transition-colors text-[11px] font-black uppercase tracking-[0.3em]"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </motion.button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-3 md:space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] font-black text-[var(--text-primary)] leading-none tracking-tighter"
            >
              Career <span className="text-[var(--text-accent)] drop-shadow-[0_0_15px_rgba(39,116,174,0.4)]">Recommendations</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[var(--text-secondary)] text-base md:text-xl font-medium max-w-2xl leading-relaxed"
            >
              Explore and plan the best career paths identified by our AI assistant.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-full lg:w-[400px]"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={20} />
            <input
              type="text"
              placeholder="Filter by role or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-2xl py-4 pl-12 pr-6 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] focus:bg-[var(--bg-surface)] transition-all shadow-sm"
            />
          </motion.div>
        </div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 md:gap-3"
        >
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all ${activeFilter === filter
                ? 'bg-[var(--accent-primary)] text-white shadow-md shadow-[var(--accent-primary-subtle)]'
                : 'bg-[var(--bg-overlay)] text-[var(--text-tertiary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>
      </header>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 bg-[var(--bg-overlay)] rounded-[40px] animate-pulse" />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredCareers.length > 0 && (
              <>
                {filteredCareers.slice(0, displayCount).map((career, index) => (
                  <motion.div
                    layout
                    key={career.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="p-6 md:p-10 rounded-[28px] md:rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border-default)] backdrop-blur-3xl flex flex-col justify-between group transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-md"
                  >
                    {/* Accent Glow */}
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-[var(--accent-primary-subtle)] blur-[80px] rounded-full group-hover:bg-[var(--accent-primary-glow)] transition-colors" />

                    <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-black text-[var(--text-primary)] leading-tight tracking-tight group-hover:text-[var(--text-accent)] transition-colors">
                          {career.name}
                        </h3>
                        <div className="px-3 py-1 bg-[var(--bg-subtle)] border border-[var(--border-faint)] rounded-full text-[11px] font-black text-[var(--text-accent)]">
                          {career.matchScore || 85}%
                        </div>
                      </div>

                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium line-clamp-3">
                        {career.reason}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {career.skills?.slice(0, 3).map((skill, si) => (
                          <span key={si} className="px-3 py-1.5 bg-[var(--bg-overlay)] border border-[var(--border-faint)] rounded-lg text-[10px] font-black text-[var(--text-tertiary)] uppercase tracking-widest">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 md:pt-10 relative z-10 space-y-3">
                      {/* Set as Goal Button */}
                      {savedCareer === career.name ? (
                        <div className="w-full py-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                          <CheckCircle2 size={14} />
                          Goal Set!
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSetGoal(career.name)}
                          disabled={savingCareer === career.name}
                          className="w-full py-3.5 border border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary)]/10 text-[var(--text-accent)] rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                        >
                          {savingCareer === career.name ? (
                            <><span className="w-3.5 h-3.5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" /> Saving…</>
                          ) : (
                            <><Target size={14} /> Set as My Goal</>
                          )}
                        </button>
                      )}

                      {/* Analyze Path Button */}
                      <button
                        onClick={async () => {
                          try {
                            const plan = await recommendationService.getLearningPlan(career.name);
                            navigate(`/career-path?career=${encodeURIComponent(career.name)}`, { state: { learningPlan: plan } });
                          } catch (e) {
                            console.error('Failed to prefetch learning plan', e);
                            navigate(`/career-path?career=${encodeURIComponent(career.name)}`);
                          }
                        }}
                        className="w-full py-4 bg-[var(--accent-primary-subtle)] hover:bg-[var(--accent-primary)] text-[var(--text-accent)] hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 group/btn hover:scale-105 active:scale-95"
                      >
                        Analyze Path
                        <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {displayCount < filteredCareers.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setDisplayCount(prev => Math.min(prev + 6, filteredCareers.length))}
                      className="px-6 py-2 bg-[var(--accent-primary-subtle)] hover:bg-[var(--accent-primary)] text-[var(--text-accent)] rounded-full font-black text-sm uppercase tracking-widest transition"
                    >
                      Explore More
                    </button>
                  </div>
                )}
              </>
            )}
          </AnimatePresence>
        )}
      </div>

      {filteredCareers.length === 0 && !loading && (
        <div className="py-20 text-center space-y-4">
          <p className="text-[var(--text-tertiary)] font-bold uppercase tracking-widest">No matching career paths found</p>
          <button onClick={() => { setActiveFilter('All'); setSearchQuery('') }} className="text-[var(--text-accent)] font-black uppercase text-xs tracking-widest hover:underline">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreCareers;

