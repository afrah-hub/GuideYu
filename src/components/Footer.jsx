import React from 'react';
import { Compass, MessageCircle, Monitor, Briefcase, Heart, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const FooterComponent = () => {
  return (
    <footer className="relative bg-transparent border-t border-[var(--border-default)]  pt-20 pb-10 overflow-hidden font-poppins mt-auto z-10 transition-colors duration-500">
      {/* Premium Subterranean Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[var(--accent-primary-subtle)] blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand & Manifesto Column */}
          <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-3 mb-5 group cursor-pointer w-fit">
              <BrandLogo size={40} className="transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(0,93,195,0.4)]" />
              <div className="text-2xl sm:text-[1.8rem] font-extrabold tracking-tight flex items-baseline transition-transform duration-300 group-hover:scale-[1.02]">
                <span className="text-[var(--text-primary)]  transition-colors duration-300">Guide</span>
                <span className="text-blue-800 ">Yu</span>
              </div>
            </Link>
            <p className="text-[var(--text-tertiary)]  font-medium mb-8 max-w-sm leading-relaxed">
              Pioneering the next era of intelligent career navigation. Powered by AI to precision-guide your professional future.
            </p>

            {/* Social Glass Icons */}
            <div className="flex gap-4">
              {[MessageCircle, Monitor, Briefcase, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] /5 border border-[var(--border-default)]  flex items-center justify-center text-[var(--text-tertiary)]  hover:text-blue-800  hover:border-blue-200  hover:bg-[var(--bg-surface)]  transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md  ">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer Column (Desktop) */}
          <div className="hidden lg:block lg:col-span-2"></div>

          {/* Links Columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-10">
            {/* Platform */}
            <div className="flex flex-col items-start">
              <h4 className="text-[var(--text-primary)]  font-bold mb-6 text-sm tracking-widest uppercase">Platform</h4>
              <nav className="flex flex-col gap-4 font-medium text-[var(--text-tertiary)]  text-sm">
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">Intelligent Routing</a>
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">DNA Analysis</a>
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">Live Integrations</a>
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">Global Pricing</a>
              </nav>
            </div>

            {/* Resources */}
            <div className="flex flex-col items-start">
              <h4 className="text-[var(--text-primary)]  font-bold mb-6 text-sm tracking-widest uppercase">Resources</h4>
              <nav className="flex flex-col gap-4 font-medium text-[var(--text-tertiary)]  text-sm">
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">Documentation</a>
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">Enterprise API</a>
                <a href="#" className="hover:text-blue-800  flex items-center gap-2 hover:translate-x-1 transition-all duration-300">Nexus Blog <span className="bg-blue-800/20 text-blue-800 text-[9px] px-1.5 py-0.5 rounded border border-blue-800/30">NEW</span></a>
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">Community</a>
              </nav>
            </div>

            {/* Hub */}
            <div className="flex flex-col items-start">
              <h4 className="text-[var(--text-primary)]  font-bold mb-6 text-sm tracking-widest uppercase">Hub</h4>
              <nav className="flex flex-col gap-4 font-medium text-[var(--text-tertiary)]  text-sm">
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">About Us</a>
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">Careers</a>
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">Legal Center</a>
                <a href="#" className="hover:text-blue-800  hover:translate-x-1 transition-all duration-300">Contact Support</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-[var(--border-default)]  flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-tertiary)]  text-sm font-medium flex items-center gap-1.5">
            © {new Date().getFullYear()} GuideYu. Crafted with <Heart size={14} className="text-rose-500 fill-rose-500/20" /> in the Cloud.
          </p>

          <div className="flex items-center gap-3 glass-panel p-4 py-2 border-[var(--border-default)]  rounded-full shadow-inner bg-[var(--bg-surface)] ">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-primary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-800"></span>
            </div>
            <span className="text-xs font-semibold tracking-wider text-[var(--text-secondary)]  uppercase">All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
