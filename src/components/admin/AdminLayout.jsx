import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { motion } from 'framer-motion';
import { Sun, Moon, Menu } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('admin-theme-preference') || 'dark';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('admin-theme-preference', theme);
  }, [theme]);


  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`admin-theme ${theme === 'dark' ? 'admin-dark' : 'admin-light'} flex min-h-screen bg-bg-base mesh-gradient-theme transition-all duration-500`}>
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 relative transition-all duration-500 min-w-0 md:ml-[var(--sidebar-width)]">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-accent-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none transition-all duration-500" />

        {/* Header */}
        <header className="h-14 md:h-20 px-4 md:px-8 flex items-center justify-between border-b border-border-default/50 bg-bg-surface/40 backdrop-blur-xl sticky top-0 z-40 transition-all duration-500 gap-3">

          {/* Left: hamburger (mobile) + title */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex-shrink-0 w-9 h-9 rounded-xl bg-bg-subtle border border-border-default text-text-tertiary hover:text-text-primary flex items-center justify-center transition-all"
              aria-label="Open admin navigation"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-1.5 h-5 md:h-6 bg-accent-primary rounded-full transition-all duration-500" />
              <div>
                <h2 className="font-display font-bold text-base md:text-xl text-text-primary tracking-tight transition-all duration-500">
                  Control Center
                </h2>
                <p className="hidden sm:block text-[10px] font-bold text-text-tertiary uppercase tracking-widest -mt-0.5 transition-all duration-500">
                  System Intelligence Unit
                </p>
              </div>
            </div>
          </div>

          {/* Right: status + actions */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-bg-surface/50 border border-border-default shadow-sm transition-all duration-500">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider transition-all duration-500">
                System Optimal
              </span>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-border-default/80 bg-bg-surface/60 hover:bg-bg-subtle text-text-secondary hover:text-accent-primary transition-all duration-300 shadow-sm relative overflow-hidden group flex items-center justify-center cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Admin Theme`}
              >
                <div className="relative z-10 flex items-center justify-center">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-accent-primary transition-all duration-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-accent-primary transition-all duration-500" />
                  )}
                </div>
                <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <div className="px-2 md:px-3 py-1.5 rounded-xl bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] shadow-sm transition-all duration-500">
                Live Console
              </div>
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="p-4 md:p-8 max-w-[1600px] mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
