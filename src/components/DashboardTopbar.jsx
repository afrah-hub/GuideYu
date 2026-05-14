import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User as UserIcon, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import { useTheme } from '../context/ThemeContext';

const DashboardTopbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <header className="h-[56px] flex items-center justify-between px-6 bg-[var(--bg-base)] border-b border-[var(--border-faint)] sticky top-0 z-30 transition-colors duration-500">
        {/* Modern Search Bar */}
        <div className="relative w-[340px] group">
          <input
            type="text"
            placeholder="Search resources, roles, or skills..."
            className="w-full bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:bg-[var(--bg-surface)] focus:border-[var(--accent-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary-subtle)] transition-all duration-300 shadow-sm"
          />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-accent)] transition-all shadow-sm flex items-center justify-center group"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </motion.div>
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <button className="relative text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-[6px] h-[6px] bg-[var(--color-danger)] rounded-full border border-[var(--bg-base)]" />
          </button>

          {/* Profile Area */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--gradient-brand)] flex items-center justify-center text-[var(--text-primary)] text-xs font-bold shrink-0">
                {user?.fullName?.[0] || 'U'}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {user?.fullName?.split(' ')[0] || 'User'}
                </span>
                <span className="text-[12px] text-[var(--text-tertiary)]">
                  {user?.role || 'Member'}
                </span>
              </div>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-3 dropdown"
                >
                  <div className="px-3 py-3 border-b border-[var(--border-faint)] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--gradient-brand)] flex items-center justify-center text-[var(--text-primary)] text-sm font-bold shrink-0">
                      {user?.fullName?.[0] || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {user?.fullName || 'User'}
                      </p>
                      <p className="text-[12px] text-[var(--text-tertiary)] truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/profile-settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 h-9 px-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)] transition-colors rounded-lg"
                    >
                      <UserIcon size={16} /> My Profile
                    </Link>

                    <Link
                      to="/profile-settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 h-9 px-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] hover:text-[var(--text-primary)] transition-colors rounded-lg"
                    >
                      <Settings size={16} /> Settings
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-[var(--border-faint)] mt-1">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsLogoutModalOpen(true);
                      }}
                      className="w-full flex items-center gap-3 h-9 px-3 text-sm text-[var(--text-secondary)] hover:bg-[var(--color-danger-subtle)] hover:text-[var(--color-danger)] transition-colors rounded-lg"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default DashboardTopbar;

