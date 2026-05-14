import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Compass,
  Brain,
  BookOpen,
  Library,
  Settings,
  LogOut,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';
import BrandLogo from './BrandLogo';

const Sidebar = ({ onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Explore Careers', icon: Compass, path: '/explore-careers' },
    { name: 'Career Roadmap', icon: Brain, path: '/career-path' },
    { name: 'Skill Training', icon: BookOpen, path: '/learning-nexus' },
    { name: 'Study Materials', icon: Library, path: '/study-materials' },
  ];

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 280 : 84 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="fixed left-0 top-0 h-screen bg-bg-surface/40 backdrop-blur-2xl border-r border-border-default/50 flex flex-col z-50 shadow-2xl overflow-hidden"
      >
        {/* Header / Logo Section */}
        <div className="h-20 flex items-center px-6 overflow-hidden border-b border-border-default/30">
          <Link to="/" className="flex items-center gap-4 min-w-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-primary/20 blur-lg rounded-full group-hover:bg-accent-primary/40 transition-colors" />
              <BrandLogo size={36} className="relative rounded-xl shadow-2xl" />
            </div>
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <span className="font-display font-black text-xl text-text-primary tracking-tight">GuideYu</span>
                  <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] leading-tight opacity-80">Portal</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-accent-primary text-white shadow-[0_8px_20px_-4px_rgba(39,116,174,0.4)]' 
                    : 'hover:bg-bg-subtle/60 text-text-secondary hover:text-text-primary'}
                `}
              >
                <div className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${!isExpanded ? 'mx-auto' : ''}`}>
                  <Icon size={20} className={isActive ? 'text-white' : 'text-accent-primary/80'} />
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className={`font-bold text-[13px] tracking-wide whitespace-nowrap ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-text-primary'}`}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && isExpanded && (
                  <motion.div 
                    layoutId="activeGlowUser"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
                
                {!isExpanded && (
                  <div className="absolute left-full ml-6 px-3 py-2 bg-text-primary text-bg-surface text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Footer Area */}
        <div className="p-4 border-t border-border-default/30 bg-bg-surface/20">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-6 px-3 py-4 rounded-2xl bg-bg-subtle/40 border border-border-default/50 flex items-center gap-3"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-primary-hover flex items-center justify-center text-white font-black text-sm shadow-lg">
                    {(user?.fullName || user?.FullName)?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-bg-surface shadow-sm" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black text-text-primary truncate">
                    {user?.fullName || user?.FullName || 'User'}
                  </span>
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                    Learner
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 flex justify-center"
              >
                <div className="w-10 h-10 rounded-xl bg-bg-subtle/50 flex items-center justify-center text-text-tertiary">
                  <Zap size={20} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <Link
              to="/profile-settings"
              className={`
                flex items-center gap-3.5 px-4 py-3 rounded-2xl text-text-secondary hover:bg-bg-subtle/60 hover:text-text-primary transition-all group
                ${!isExpanded ? 'justify-center' : ''}
              `}
            >
              <Settings size={20} className="text-text-tertiary group-hover:text-accent-primary transition-colors" />
              {isExpanded && <span className="font-bold text-[13px] tracking-wide">Settings</span>}
              {!isExpanded && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-text-primary text-bg-surface text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
                  Settings
                </div>
              )}
            </Link>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className={`
                w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-danger hover:bg-danger/10 transition-all group
                ${!isExpanded ? 'justify-center' : ''}
              `}
            >
              <LogOut size={20} className="transition-transform group-hover:scale-110" />
              {isExpanded && <span className="font-black text-xs uppercase tracking-widest">Sign Out</span>}
              {!isExpanded && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-text-primary text-bg-surface text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
                  Sign Out
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          logout();
          setIsLogoutModalOpen(false);
        }}
      />
    </>
  );
};

export default Sidebar;

