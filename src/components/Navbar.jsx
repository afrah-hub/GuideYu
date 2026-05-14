import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, X, Home, LayoutList, Info, LogIn, ChevronRight, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Features', path: '#features', icon: <LayoutList size={20} /> },
    { name: 'How it Works', path: '#how-it-works', icon: <Info size={20} /> }
  ];

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-40 flex justify-center transition-all duration-500 ease-out ${scrolled ? 'pt-2 sm:pt-4' : 'pt-0'}`}>
        <div
          className={`w-full transition-all duration-500 ease-out flex items-center justify-between px-4 sm:px-6 md:px-10 h-16 sm:h-20 ${scrolled
            ? 'max-w-[1200px] mx-auto rounded-[20px] sm:rounded-[24px] bg-[var(--bg-surface)]  backdrop-blur-md border border-gray-200  shadow-xl shadow-blue-900/5 '
            : 'max-w-[1400px] mx-auto bg-transparent border-transparent'
            }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group z-50">
            <BrandLogo size={36} className="transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_20px_40px_-10px_rgba(30,58,138,0.15)]" />
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tighter flex items-baseline transition-transform duration-300 group-hover:scale-[1.02]">
              <span className="text-[var(--text-primary)] ">Guide</span>
              <span className="text-[var(--text-accent)] ">Yu</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className={`relative px-2 py-1 text-[15px] font-bold transition-all duration-300 ${location.pathname === '/' && link.name === 'Home'
                  ? 'text-[var(--text-accent)] '
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]  '
                  }`}
              >
                <span>{link.name}</span>
                {location.pathname === '/' && link.name === 'Home' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] rounded-full"
                  />
                )}
              </a>
            ))}
          </div>

          {/* Auth & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-4 z-50 relative">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-accent)] transition-all shadow-sm flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link to="/login" className="px-6 py-2 bg-[var(--accent-primary)]  text-[var(--text-primary)] rounded-full font-bold text-sm transition-all hover:bg-[var(--accent-primary-hover)] shadow-lg shadow-blue-900/20 hover:scale-105 active:scale-95">
              Get Started
            </Link>

            <button
              className="md:hidden p-2 text-[var(--text-secondary)]  bg-[var(--bg-surface)]  backdrop-blur-md rounded-xl hover:bg-[var(--bg-surface)]/80 dark:hover:bg-slate-800/80 hover:shadow-md shadow-sm transition-all duration-300 border border-[var(--bg-surface)]/50 /50 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div animate={{ rotate: mobileMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Bubble Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Invisible backdrop for closing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden bg-[var(--bg-base)]/10 backdrop-blur-[2px]"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Floating Bubble Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -15, transformOrigin: "top right" }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="fixed top-[4.5rem] sm:top-[5.5rem] right-4 sm:right-6 w-[280px] bg-[var(--bg-surface)]  backdrop-blur-3xl border border-[var(--bg-surface)]  shadow-2xl shadow-sm z-50 md:hidden rounded-[2.5rem] p-3 flex flex-col gap-1.5 overflow-hidden"
            >
              {navLinks.map((link) => (
                <a
                  href={link.path}
                  key={link.name}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-lg transition-all duration-300 hover:bg-[var(--bg-subtle)]/80 dark:hover:bg-[var(--accent-primary-subtle)] hover:scale-[1.02] ${location.pathname === link.path && link.path === '/'
                    ? 'text-[var(--text-accent)]  bg-[var(--bg-surface)]/50 '
                    : 'text-[var(--text-secondary)]  hover:text-[var(--text-accent)] '
                    }`}
                >
                  <div className="text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {link.icon}
                  </div>
                  {link.name}
                </a>
              ))}

              <div className="h-px bg-[var(--bg-subtle)]/60  my-2 mx-4" />

              <div className="h-px bg-[var(--bg-subtle)]/60  my-2 mx-4" />

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 mt-2 px-5 py-4 rounded-[1.6rem] bg-[var(--bg-base)]  text-[var(--text-primary)]  font-black text-lg shadow-xl shadow-sm hover:shadow-blue-900/20 hover:scale-[1.03] transition-all duration-300"
              >
                Get Started Now
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
