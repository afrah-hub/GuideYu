import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Modular Components
import HeroSection from '../components/dashboard/HeroSection';
import NextStepsPanel from '../components/dashboard/NextStepsPanel';
import AIInsights from '../components/dashboard/AIInsights';
import SkillProgressSection from '../components/dashboard/SkillProgressSection';
import CareerRecommendations from '../components/dashboard/CareerRecommendations';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(' ')[0] || 'User';

  const [sections, setSections] = useState({
    overview: { data: null, loading: true },
    metrics: { data: null, loading: true },
    progress: { data: null, loading: true },
    nextSteps: { data: null, loading: true },
    insights: { data: null, loading: true },
    activity: { data: null, loading: true },
    careerPath: { data: null, loading: true },
    recommendations: { data: null, loading: true }
  });

  useEffect(() => {
    const fetchSection = async (sectionName, endpoint) => {
      try {
        const url = endpoint.startsWith('/') ? endpoint : `/api/dashboard/${endpoint}`;
        const response = await fetch(url, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error(`Failed to fetch ${sectionName}`);
        const data = await response.json();
        setSections(prev => ({
          ...prev,
          [sectionName]: { data, loading: false }
        }));
      } catch (err) {
        console.error(err);
        setSections(prev => ({
          ...prev,
          [sectionName]: { data: null, loading: false }
        }));
      }
    };

    const fetchAll = async () => {
      await Promise.all([
        fetchSection('overview', 'overview'),
        fetchSection('metrics', 'metrics'),
        fetchSection('nextSteps', 'next-steps'),
        fetchSection('insights', 'insights'),
        fetchSection('activity', 'activity'),
        fetchSection('careerPath', '/api/careerpath/overview'),
        fetchSection('recommendations', '/api/recommendations/ai-careers')
      ]);
    };

    fetchAll();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-10">
      {/* 1. Hero Section */}
      <HeroSection
        data={sections.overview.data ? { ...sections.overview.data, firstName } : null}
        loading={sections.overview.loading}
      />

      {/* 3. Career Recommendations (Full Width) */}
      <div className="w-full">
        <CareerRecommendations
          data={sections.recommendations.data}
          loading={sections.recommendations.loading}
        />
      </div>

      {/* 4. Action Plan & Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        <div className="xl:col-span-2">
          <NextStepsPanel
            data={sections.nextSteps.data}
            loading={sections.nextSteps.loading}
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-[0.2em] px-2">Activity Timeline</h3>
          <ActivityFeed
            data={sections.activity.data}
            loading={sections.activity.loading}
          />
        </div>
      </div>

      {/* 5. Neural Growth Grid (Bottom) */}
      <div className="w-full">
        <SkillProgressSection
          skills={sections.careerPath.data?.skills}
          loading={sections.careerPath.loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;

