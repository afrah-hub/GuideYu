import React from 'react';
import AdminSidebar from './AdminSidebar';
import { motion } from 'framer-motion';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-bg-base mesh-gradient-theme">
      <AdminSidebar />
      <main 
        className="flex-1 relative transition-all duration-500"
        style={{ marginLeft: 'var(--sidebar-width)' }}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <header className="h-20 px-8 flex items-center justify-between border-b border-border-default/50 bg-bg-surface/40 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-accent-primary rounded-full" />
            <div>
              <h2 className="font-display font-bold text-xl text-text-primary tracking-tight">
                Control Center
              </h2>
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest -mt-0.5">
                System Intelligence Unit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-bg-surface/50 border border-border-default shadow-sm">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                System Optimal
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-[10px] font-black uppercase tracking-[0.15em] shadow-sm">
                Live Console
              </div>
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 max-w-[1600px] mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
