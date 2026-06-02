import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Users,
  Settings,
  BarChart3,
  Zap,
  ChevronLeft,
  LogOut,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../BrandLogo';

const menuItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/careers', icon: Map, label: 'Careers' },
  { path: '/admin/roadmaps', icon: Layers, label: 'Roadmaps' },
  { path: '/admin/modules', icon: BookOpen, label: 'Modules' },
  { path: '/admin/users', icon: Users, label: 'Users' },
];

const AdminSidebar = ({ isMobileOpen, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '84px' : '280px');
  }, [isCollapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    onMobileClose?.();
  }, [location.pathname]);

  const NavContent = ({ expanded, onClose }) => (
    <>
      {/* Header */}
      <div className="h-16 md:h-20 flex items-center px-5 md:px-6 justify-between overflow-hidden border-b border-[var(--border-default)] shrink-0">
        <Link to="/" className="flex items-center gap-4 min-w-0 group" onClick={onClose}>
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-[#F97316]/20 blur-lg rounded-full group-hover:bg-[#F97316]/40 transition-colors" />
            <BrandLogo size={32} className="relative rounded-xl shadow-2xl" />
          </div>
          <AnimatePresence mode="wait">
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="font-display font-black text-lg md:text-xl text-[var(--sidebar-brand-text)] tracking-tight">GuideYu</span>
                <span className="text-[10px] font-black text-[var(--sidebar-brand-sub)] uppercase tracking-[0.3em] leading-tight opacity-95">Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile close */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-xl hover:bg-[var(--sidebar-item-hover-bg)] text-[var(--sidebar-text-inactive)] hover:text-[var(--sidebar-text-active)] transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {/* Desktop collapse */}
          {!onClose && expanded && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden md:flex p-2 rounded-xl hover:bg-[var(--sidebar-item-hover-bg)] text-[var(--sidebar-text-inactive)] hover:text-[var(--sidebar-text-active)] transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 md:px-4 py-6 md:py-8 space-y-2 md:space-y-3 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `
              relative flex items-center gap-3.5 px-4 py-3.5 md:py-4 rounded-xl transition-all duration-300 group border
              ${isActive
                ? 'bg-[var(--sidebar-item-active-bg)] border-[var(--sidebar-item-active-border)] text-[var(--sidebar-text-active)] shadow-[0_0_20px_-3px_rgba(249,115,22,0.15)]'
                : 'hover:bg-[var(--sidebar-item-hover-bg)] border-transparent text-[var(--sidebar-text-inactive)] hover:text-[var(--sidebar-text-hover)]'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0 ${!expanded ? 'mx-auto' : ''} ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--sidebar-text-inactive)] group-hover:text-[var(--sidebar-text-hover)]'}`} />
                {expanded && (
                  <span className={`font-semibold text-[13.5px] tracking-wide transition-colors ${isActive ? 'text-[var(--sidebar-text-active)]' : 'text-[var(--sidebar-text-inactive)] group-hover:text-[var(--sidebar-text-hover)]'}`}>
                    {item.label}
                  </span>
                )}
                {isActive && expanded && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute right-3.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]"
                  />
                )}
                {!expanded && (
                  <div className="absolute left-full ml-6 px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 md:p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)]/10 shrink-0">
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-4 py-3 md:py-3.5 rounded-2xl text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)] transition-all duration-300 group
            ${!expanded ? 'justify-center' : ''}
          `}
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:scale-110 text-[var(--color-danger)] shrink-0" />
          {expanded && <span className="font-black text-xs uppercase tracking-widest text-[var(--color-danger)]">Terminate Session</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ── DESKTOP SIDEBAR (md and above) ── */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 84 : 280 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        className="hidden md:flex fixed left-0 top-0 bottom-0 bg-[var(--bg-sidebar)] border-r border-[var(--border-default)] flex-col z-[100] shadow-2xl overflow-hidden"
      >
        <NavContent expanded={!isCollapsed} onClose={undefined} />
      </motion.aside>

      {/* ── MOBILE DRAWER (below md) ── */}
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
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-[var(--bg-sidebar)] border-r border-[var(--border-default)] flex flex-col z-[100] shadow-2xl overflow-hidden"
            >
              <NavContent expanded={true} onClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;
