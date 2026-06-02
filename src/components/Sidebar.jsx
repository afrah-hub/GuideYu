import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { prefetchUrl } from '../services/apiCache';
import {
  LayoutDashboard,
  Compass,
  Brain,
  BookOpen,
  Library,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  Bookmark,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';
import BrandLogo from './BrandLogo';

const Sidebar = ({ onExpandChange, isMobileOpen, onMobileClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  // Close mobile drawer on route change
  useEffect(() => {
    onMobileClose?.();
  }, [location.pathname]);

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Explore Careers', icon: Compass, path: '/explore-careers' },
    { name: 'Career Roadmap', icon: Brain, path: '/career-path' },
    { name: 'Study Materials', icon: Library, path: '/study-materials' },
    { name: 'Saved Paths', icon: Bookmark, path: '/saved-paths' },
  ];

  const handlePrefetch = (path) => {
    try {
      if (path === '/dashboard') {
        prefetchUrl('dashboard/overview');
        prefetchUrl('dashboard/metrics');
        prefetchUrl('dashboard/next-steps');
        prefetchUrl('dashboard/insights');
        prefetchUrl('dashboard/activity');
        prefetchUrl('careerpath/overview');
        prefetchUrl('recommendations/ai-careers');
      } else if (path === '/career-path') {
        prefetchUrl('careerpath/overview');
      } else if (path === '/study-materials') {
        prefetchUrl('careerpath/overview');
        prefetchUrl('recommendations/saved-career-maps');
      } else if (path === '/saved-paths') {
        prefetchUrl('recommendations/saved-career-maps');
      } else if (path === '/explore-careers') {
        prefetchUrl('recommendations/ai-careers');
      }
    } catch (e) {
      console.warn('[Sidebar] Prefetch failed:', e);
    }
  };

  const NavContent = ({ expanded, onClose }) => (
    <>
      {/* Header / Logo Section */}
      <div className="h-20 md:h-24 flex items-center px-4 md:px-6 overflow-hidden border-b border-border-default/30 shrink-0">
        <Link to="/" className="flex items-center gap-4 min-w-0 group justify-center mx-auto" onClick={onClose}>
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-accent-primary/20 blur-lg rounded-full group-hover:bg-accent-primary/40 transition-colors" />
            <BrandLogo size={48} className="relative rounded-xl shadow-2xl" />
          </div>
          <AnimatePresence mode="wait">
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="font-display font-black text-lg md:text-xl text-text-primary tracking-tight">GuideYu</span>
                <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] leading-tight opacity-80">Portal</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto p-1 text-text-tertiary hover:text-text-primary transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 md:px-4 py-8 md:py-10 space-y-2 md:space-y-3 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              onMouseEnter={() => handlePrefetch(item.path)}
              className={[
                'relative flex items-center rounded-2xl transition-all duration-300 group',
                expanded ? 'gap-3.5 px-3 md:px-4 py-3.5 md:py-4' : 'justify-center p-3.5',
                isActive
                  ? 'bg-accent-primary text-white shadow-[0_8px_20px_-4px_rgba(39,116,174,0.4)]'
                  : 'hover:bg-bg-subtle text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Icon size={20} className={isActive ? 'text-white' : 'text-accent-primary'} />
              </div>

              <AnimatePresence>
                {expanded && (
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

              {isActive && expanded && (
                <motion.div
                  layoutId="activeGlowUser"
                  className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                />
              )}

              {!expanded && (
                <div className="absolute left-full ml-6 px-3 py-2 bg-text-primary text-bg-surface text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Footer Area */}
      <div className="p-4 md:p-5 border-t border-border-default/30 bg-bg-surface/20 shrink-0">
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-4 md:mb-6 px-3 py-3 md:py-4 rounded-2xl bg-bg-subtle/40 border border-border-default/50 flex items-center gap-3"
            >
              <div className="relative shrink-0">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-primary-hover flex items-center justify-center text-white font-black text-sm shadow-lg">
                  {(user?.fullName || user?.FullName)?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-success border-2 border-bg-surface shadow-sm" />
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
              className="mb-4 md:mb-6 flex justify-center"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-bg-subtle/50 flex items-center justify-center text-text-tertiary">
                <Zap size={18} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">
          <Link
            to="/profile-settings"
            onClick={onClose}
            className={[
              'flex items-center gap-3.5 px-3 md:px-4 py-3 rounded-2xl text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-all group',
              !expanded ? 'justify-center' : '',
            ].join(' ')}
          >
            <Settings size={20} className="text-text-tertiary group-hover:text-accent-primary transition-colors" />
            {expanded && <span className="font-bold text-[13px] tracking-wide">Settings</span>}
            {!expanded && (
              <div className="absolute left-full ml-6 px-3 py-2 bg-text-primary text-bg-surface text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
                Settings
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={`
              w-full flex items-center gap-3.5 px-3 md:px-4 py-3 rounded-2xl text-danger hover:bg-danger/10 transition-all group
              ${!expanded ? 'justify-center' : ''}
            `}
          >
            <LogOut size={20} className="transition-transform group-hover:scale-110" />
            {expanded && <span className="font-black text-xs uppercase tracking-widest">Sign Out</span>}
            {!expanded && (
              <div className="absolute left-full ml-6 px-3 py-2 bg-text-primary text-bg-surface text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR (md and above) ── */}
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 280 : 64 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="hidden md:flex fixed left-0 top-0 h-screen bg-bg-surface/40 backdrop-blur-2xl border-r border-border-default/50 flex-col z-50 shadow-2xl overflow-hidden"
      >
        <NavContent expanded={isExpanded} onClose={undefined} />
      </motion.aside>

      {/* ── MOBILE DRAWER OVERLAY (below md) ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onMobileClose}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed left-0 top-0 h-screen w-[280px] bg-bg-surface backdrop-blur-2xl border-r border-border-default/50 flex flex-col z-50 shadow-2xl overflow-hidden"
            >
              <NavContent expanded={true} onClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

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
