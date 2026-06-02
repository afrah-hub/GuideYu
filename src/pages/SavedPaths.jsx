import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, ArrowRight, Library, Calendar, Inbox } from 'lucide-react';

const SavedPaths = () => {
  const navigate = useNavigate();
  const [savedPaths, setSavedPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedPaths();
  }, []);

  const fetchSavedPaths = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recommendations/saved-career-maps', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch saved career maps');
      }
      const data = await response.json();
      setSavedPaths(data);
    } catch (err) {
      console.error('Error fetching saved paths:', err);
      setError(err.message || 'Failed to load saved paths.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (id, e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!window.confirm('Are you sure you want to unsave this career path?')) return;

    try {
      const response = await fetch(`/api/recommendations/saved-career-maps/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setSavedPaths((prev) => prev.filter((path) => path.id !== id));
      } else {
        throw new Error('Failed to delete saved path');
      }
    } catch (err) {
      console.error('Error unsaving path:', err);
      alert(err.message || 'An error occurred while unsaving.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-bg-base px-8 py-12 lg:px-16 lg:py-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-surface border border-border-default shadow-sm">
            <Bookmark size={14} className="text-accent-primary fill-current" />
            <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.2em]">Saved Collections</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-text-primary tracking-tighter leading-[0.9]">
            My Career Paths
          </h1>
          <p className="text-lg lg:text-xl text-text-tertiary font-medium max-w-2xl leading-relaxed">
            Access your saved custom career paths and syllabus roadmaps instantly from the database without re-generating with AI.
          </p>
        </header>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-64 rounded-[2.5rem] bg-bg-surface border border-border-default animate-pulse p-8 space-y-6">
                <div className="h-6 w-1/3 bg-bg-subtle rounded-lg" />
                <div className="h-10 w-2/3 bg-bg-subtle rounded-lg" />
                <div className="h-4 w-full bg-bg-subtle rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-[2.5rem] bg-red-50/50 border border-red-200/50 text-red-700 text-center max-w-xl mx-auto space-y-4">
            <h3 className="text-xl font-bold">Something went wrong</h3>
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={fetchSavedPaths}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all"
            >
              Retry
            </button>
          </div>
        ) : savedPaths.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-16 rounded-[3rem] bg-bg-surface border border-border-default max-w-2xl mx-auto text-center space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.02)]"
          >
            <div className="w-20 h-20 bg-bg-subtle rounded-[2rem] flex items-center justify-center text-text-tertiary">
              <Inbox size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-text-primary tracking-tight">No saved career paths yet</h3>
              <p className="text-sm text-text-tertiary font-medium max-w-md leading-relaxed">
                When you generate a custom learning syllabus for a career, click "Save Career Path" to keep it here for quick access.
              </p>
            </div>
            <button
              onClick={() => navigate('/study-materials')}
              className="px-8 py-4 bg-accent-primary-hover dark:bg-accent-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent-primary-hover/10 dark:shadow-accent-primary/10 hover:bg-accent-primary dark:hover:bg-accent-primary-hover hover:scale-105 active:scale-95 transition-all"
            >
              Generate a Syllabus
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {savedPaths.map((path) => (
                <motion.div
                  key={path.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() =>
                    navigate(
                      `/study-materials?module=${encodeURIComponent(path.moduleName)}&career=${encodeURIComponent(path.careerName)}&savedMapId=${path.id}`
                    )
                  }
                  onMouseEnter={() => {
                    const url = `/api/recommendations/syllabus?moduleName=${encodeURIComponent(path.moduleName)}&targetCareer=${encodeURIComponent(path.careerName)}&savedMapId=${path.id}`;
                    window.fetch(url, { credentials: 'include' }).catch(() => {});
                  }}
                  className="group relative flex flex-col justify-between p-8 rounded-[2.5rem] bg-bg-surface border border-border-default shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(39,116,174,0.08)] dark:hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:border-accent-primary/30 cursor-pointer transition-all duration-500 overflow-hidden"
                >
                  {/* Subtle gradient glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-accent-primary/15 transition-all duration-500" />

                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-start gap-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-bg-subtle border border-accent-primary/10 text-xs font-black text-accent-primary tracking-wide">
                        <Library size={12} />
                        {path.moduleName}
                      </div>
                      <button
                        onClick={(e) => handleUnsave(path.id, e)}
                        className="p-2 rounded-xl text-text-tertiary hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 border border-transparent hover:border-red-100 dark:hover:border-red-950/30 transition-all"
                        title="Unsave Path"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-text-primary tracking-tight group-hover:text-accent-primary transition-colors duration-300 leading-snug">
                        {path.careerName}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                        <Calendar size={12} />
                        <span>Saved {formatDate(path.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border-default flex items-center justify-between text-xs font-black text-accent-primary uppercase tracking-widest group-hover:text-accent-primary-hover transition-colors">
                    <span>Open Syllabus</span>
                    <div className="p-2 bg-bg-subtle rounded-xl group-hover:bg-accent-primary group-hover:text-white transition-all">
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPaths;
