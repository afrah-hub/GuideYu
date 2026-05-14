import React from 'react';

const ActivityFeed = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 skeleton" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="relative pl-6 border-l border-[var(--border-default)] space-y-6">
      {data.map((item, i) => {
        const dotColor = item.type === 'Award' ? 'var(--color-warning)' : 
                         item.type === 'Zap' ? 'var(--accent-primary)' : 
                         'var(--color-success)';
        return (
          <div key={i} className="relative">
            {/* Dot */}
            <div 
              className="absolute -left-[30px] top-3 w-[8px] h-[8px] rounded-full border-2 border-[var(--bg-base)]"
              style={{ backgroundColor: dotColor }}
            />
            
            <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[10px] p-[10px_14px] shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">
                  {item.title}
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)] whitespace-nowrap">
                  {item.timeAgo}
                </span>
              </div>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                {item.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;

