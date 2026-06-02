import Sidebar from './Sidebar';
import DashboardTopbar from './DashboardTopbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

const DashboardLayout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const marginLeft = isDesktop ? (isSidebarExpanded ? 280 : 64) : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex transition-colors duration-500 font-sans selection:bg-[var(--accent-primary)]/30">
      <Sidebar
        onExpandChange={setIsSidebarExpanded}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div
        className="flex-1 relative flex flex-col min-w-0 transition-[margin] duration-[0.25s] ease-in-out"
        style={{ marginLeft }}
      >
        <DashboardTopbar onMenuToggle={() => setIsMobileMenuOpen(prev => !prev)} />

        <main className="relative z-10 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
