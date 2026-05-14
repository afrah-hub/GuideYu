import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../services/recommendationService';

import { motion, AnimatePresence } from 'framer-motion';

const ExploreCareers = () => {
  const navigate = useNavigate();
  const [aiCareers, setAiCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAICareers = async () => {
      try {
        setLoading(true);
        const response = await recommendationService.getAICareers();
        setAiCareers(response.careers || []);
      } catch (err) {
        console.error('Failed to load AI suggestions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAICareers();
  }, []);

  const filters = ['All', 'Development', 'Cloud', 'Design', 'Strategy', 'Security'];

  const filteredCareers = aiCareers.filter(career => {
    const matchesFilter = activeFilter === 'All' ||
      career.type?.toLowerCase() === activeFilter.toLowerCase() ||
      career.skills?.some(s => s.toLowerCase().includes(activeFilter.toLowerCase()));

    const matchesSearch = career.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.reason.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10 space-y-12">
      {/* Header Section */}
      <header className="space-y-10">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 text-[var(--text-tertiary)] hover:text-[var(--text-accent)] transition-colors text-[11px] font-black uppercase tracking-[0.3em]"
        >
          <ChevronLeft size={16} />
          Back to Command Center
        </motion.button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[56px] md:text-[64px] font-black text-[var(--text-primary)] leading-none tracking-tighter"
            >
              Career <span className="text-[var(--text-accent)] drop-shadow-[0_0_15px_rgba(39,116,174,0.4)]">Matrix</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[var(--text-secondary)] text-xl font-medium max-w-2xl leading-relaxed"
            >
              Analyze and synchronize with the most optimal career trajectories identified by our neural engine.
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
          className="flex flex-wrap gap-3"
        >
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${activeFilter === filter
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
            {filteredCareers.map((career, index) => (
              <motion.div
                layout
                key={career.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="p-10 rounded-[40px] bg-[var(--bg-surface)] border border-[var(--border-default)] backdrop-blur-3xl flex flex-col justify-between group transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-md"
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

                <div className="pt-10 relative z-10">
                  <button
                    onClick={() => navigate(`/career-path?career=${encodeURIComponent(career.name)}`)}
                    className="w-full py-4 bg-[var(--accent-primary-subtle)] hover:bg-[var(--accent-primary)] text-[var(--text-accent)] hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 group/btn hover:scale-105 active:scale-95"
                  >
                    Analyze Path
                    <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {filteredCareers.length === 0 && !loading && (
        <div className="py-20 text-center space-y-4">
          <p className="text-[var(--text-tertiary)] font-bold uppercase tracking-widest">No matching trajectories found</p>
          <button onClick={() => { setActiveFilter('All'); setSearchQuery('') }} className="text-[var(--text-accent)] font-black uppercase text-xs tracking-widest hover:underline">
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreCareers;

