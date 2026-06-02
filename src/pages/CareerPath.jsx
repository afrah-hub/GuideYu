import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Save, CheckCircle } from 'lucide-react';

// Modular Components
import PathSummary from '../components/career-path/PathSummary';
import PathJourney from '../components/career-path/PathJourney';
import CareerPathInsights from '../components/career-path/CareerPathInsights';

const CareerPath = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const targetCareer = searchParams.get('career');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = targetCareer
          ? `/api/careerpath/overview?targetCareer=${encodeURIComponent(targetCareer)}`
          : '/api/careerpath/overview';

        const response = await fetch(url, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch career path data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [targetCareer]);

  const handleSavePath = async () => {
    if (!targetCareer || !data) return;
    try {
      setSaving(true);

      // Save full trajectory to DB
      const saveResponse = await fetch('/api/careerpath/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        console.error('Save failed:', saveResponse.status, errorText);
        throw new Error('Failed to save full career path');
      }

      // Update user active goal
      const formData = new FormData();
      formData.append('CareerGoal', targetCareer);

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile update failed:', response.status, errorText);
        throw new Error('Failed to update user goal');
      }

      setSaved(true);
      setTimeout(() => {
        // Remove the query param to reflect that it is now the saved path
        setSearchParams({});
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error('Error saving path:', err);
      alert('Could not save the career path: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
        <div className="p-4 rounded-full bg-[var(--color-danger-subtle)] text-[var(--color-danger)] mb-6">
          <svg width={48} height={48} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Something went wrong</h2>
        <p className="text-[var(--text-secondary)] max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-[var(--accent-primary)] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[var(--accent-primary-hover)] transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
      {/* Save Action Banner for Unsaved Suggestions */}
      {targetCareer && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-2xl p-4 px-4 md:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 backdrop-blur-md shadow-sm"
        >
          <div className="min-w-0">
            <h3 className="text-sm md:text-base font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 shrink-0 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              <span className="truncate">Analyzing: {targetCareer}</span>
            </h3>
            <p className="text-[var(--text-secondary)] text-xs font-medium mt-0.5 ml-4">AI-generated preview. Save to make it your active goal.</p>
          </div>
          <button
            onClick={handleSavePath}
            disabled={saving || saved}
            className={`px-5 md:px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto ${saved
                ? 'bg-[var(--color-success)] text-white shadow-sm'
                : 'bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-sm shadow-[var(--accent-primary-subtle)] hover:scale-105 active:scale-95'
              }`}
          >
            {saving ? (
              <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
            ) : saved ? (
              <><CheckCircle size={16} />Path Saved</>
            ) : (
              <><Save size={16} />Save Career Path</>
            )}
          </button>
        </motion.div>
      )}

      <div className="space-y-8 md:space-y-12">
        {/* 1. Summary Section */}
        <PathSummary
          summary={data?.summary}
          loading={loading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start">
          {/* LEFT COLUMN (70%) */}
          <div className="lg:col-span-8 space-y-10 md:space-y-16">
            <PathJourney
              journey={data?.journey}
              loading={loading}
            />
          </div>

          {/* RIGHT COLUMN (30%) */}
          <div className="lg:col-span-4 space-y-8 md:space-y-12">
            <CareerPathInsights
              insights={data?.insights || []}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPath;
