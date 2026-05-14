import Sidebar from './Sidebar';
import DashboardTopbar from './DashboardTopbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const DashboardLayout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex transition-colors duration-500 font-sans selection:bg-[var(--accent-primary)]/30">
      <Sidebar onExpandChange={setIsSidebarExpanded} />

      <div 
        className={`flex-1 relative flex flex-col transition-[margin] duration-[0.25s] ease-in-out ${isSidebarExpanded ? 'ml-[220px]' : 'ml-[64px]'}`}
      >
        <DashboardTopbar />

        <main className="relative z-10 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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

