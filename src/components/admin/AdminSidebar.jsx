import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
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
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../BrandLogo';

const menuItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/careers', icon: Map, label: 'Careers' },
  { path: '/admin/roadmaps', icon: Layers, label: 'Roadmaps' },
  { path: '/admin/modules', icon: BookOpen, label: 'Modules' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/ai-settings', icon: Sparkles, label: 'AI Settings' },
];

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '84px' : '280px');
  }, [isCollapsed]);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 84 : 280 }}
      className="fixed left-0 top-0 bottom-0 bg-bg-surface/40 backdrop-blur-2xl border-r border-border-default/50 flex flex-col transition-all duration-500 ease-[0.16, 1, 0.3, 1] z-[100] shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="h-20 flex items-center px-6 justify-between overflow-hidden border-b border-border-default/30">
        <Link to="/" className="flex items-center gap-4 min-w-0 group">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-primary/20 blur-lg rounded-full group-hover:bg-accent-primary/40 transition-colors" />
            <BrandLogo size={36} className="relative rounded-xl shadow-2xl" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="font-display font-black text-xl text-text-primary tracking-tight">GuideYu</span>
                <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] leading-tight opacity-80">Matrix</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 rounded-xl hover:bg-bg-subtle/50 text-text-tertiary hover:text-accent-primary transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${isActive 
                ? 'bg-accent-primary text-white shadow-[0_8px_20px_-4px_rgba(39,116,174,0.4)]' 
                : 'hover:bg-bg-subtle/60 text-text-secondary hover:text-text-primary'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : ''}`} />
                {!isCollapsed && (
                  <span className={`font-bold text-[13px] tracking-wide ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-text-primary'}`}>
                    {item.label}
                  </span>
                )}
                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-6 px-3 py-2 bg-text-primary text-bg-surface text-[11px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl z-50">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border-default/30 bg-bg-surface/20">
        {!isCollapsed ? (
          <div className="mb-6 px-3 py-4 rounded-2xl bg-bg-subtle/40 border border-border-default/50 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-primary-hover flex items-center justify-center text-white font-black text-sm shadow-lg">
                {(user?.fullName || user?.FullName)?.charAt(0) || 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-bg-surface shadow-sm" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-text-primary truncate">
                {user?.fullName || user?.FullName || 'Admin User'}
              </span>
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                Overlord
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex justify-center">
            <button 
              onClick={() => setIsCollapsed(false)}
              className="p-3 rounded-xl bg-bg-subtle/50 text-text-tertiary hover:text-accent-primary transition-all"
            >
              <Zap className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-danger hover:bg-danger/10 transition-all duration-300 group
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
          {!isCollapsed && <span className="font-black text-xs uppercase tracking-widest">Terminate Session</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
