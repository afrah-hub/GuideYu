import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Mail, Lock, ArrowLeft, Apple, Compass, ArrowRight, Brain, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import BrandLogo from '../components/BrandLogo';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const InteractiveVisuals = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    { title: "Quantum Analysis", desc: "AI maps your professional DNA to perfect real-world roles." },
    { title: "Market Intelligence", desc: "Real-time industry insights power your next career leap." },
    { title: "Neural Sync", desc: "Automatically match your skills with top global opportunities." }
  ];

  useEffect(() => {
    const interval = setInterval(() => setCurrentFeature(prev => (prev + 1) % features.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12 lg:p-20 overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Glow Effects */}
        <div className="absolute w-[400px] h-[400px] bg-[var(--accent-primary-subtle)]  rounded-full blur-[60px]  pointer-events-none transition-colors duration-700" />
        <div className="absolute w-[300px] h-[300px] bg-[var(--accent-primary-glow)]  rounded-full blur-[60px]  pointer-events-none translate-x-20 -translate-y-20 transition-colors duration-700" />

        {/* Orbit Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] border border-[var(--accent-primary)]  rounded-full border-dashed transition-colors duration-700"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] border border-[var(--accent-primary)]  rounded-full border-dashed transition-colors duration-700"
        />

        {/* Core Modern Element - Compass matches Home.jsx */}
        <div className="absolute w-[120px] h-[120px] bg-gradient-to-br from-blue-900 via-blue-950 to-blue-900 rounded-full blur-[30px] opacity-70 animate-pulse" />
        <div className="relative z-10 w-[80px] h-[80px] bg-[var(--bg-surface)]  backdrop-blur-md border border-[var(--border-strong)]  rounded-full shadow-2xl shadow-sm flex items-center justify-center transition-all duration-700 hover:scale-110">
          <Brain size={32} className="text-[var(--text-accent)]  drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-colors duration-700" />
        </div>

        {/* Floating Features Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-6 rounded-[2rem] w-full max-w-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="flex items-center gap-4 mb-3 relative z-10">
                <div className="flex items-center justify-center">
                  <BrandLogo size={24} className="" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]  tracking-tight font-poppins">{features[currentFeature].title}</h3>
              </div>
              <p className="text-[var(--text-tertiary)]  text-sm leading-relaxed relative z-10">{features[currentFeature].desc}</p>

              {/* Progress Indicators */}
              <div className="flex gap-2 mt-5 relative z-10">
                {features.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentFeature ? 'w-8 bg-[var(--accent-primary)] shadow-[0_0_8px_rgba(30,58,138,0.8)]' : 'w-2 bg-[var(--bg-surface)]/20'}`} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, googleLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const userRole = user.role || user.Role;
      if (userRole === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);



  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsSubmitting(true);
        const result = await googleLogin(tokenResponse.access_token);
        const userRole = result.user?.role || result.user?.Role;
        
        if (result.user?.isNewUser) {
          navigate('/profile-setup');
        } else if (userRole === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        setError(err.message || 'Google Login failed');
      } finally {
        setIsSubmitting(false);
      }
    },
    onNonOAuthError: (error) => {
      console.error('Non-OAuth Error:', error);
      setError(`Google configuration error: ${error.type}`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login({ email: email.trim(), password });
      const userRole = result.role || result.Role;

      if (userRole === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient-theme flex font-poppins relative overflow-hidden">

      {/* Back to Home - Absolute overlay for mobile/desktop */}
      <Link to="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]   transition-all group p-2 bg-[var(--bg-surface)]  border border-[var(--border-default)]  backdrop-blur-md rounded-lg sm:bg-transparent sm:border-transparent sm: sm: shadow-sm sm:shadow-none">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase">Back<span className="hidden sm:inline"> to Home</span></span>
      </Link>

      <div className="w-full flex">
        {/* Left Side: Immersive Visual Section (Hidden on small screens) */}
        <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden border-r border-[var(--border-default)]  transition-colors duration-700">
          <InteractiveVisuals />
        </div>

        {/* Right Side: Glassmorphism Form Layer */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 pt-16 sm:pt-8 relative z-10 w-full">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[430px] bg-[var(--bg-surface)]  backdrop-blur-2xl border border-[var(--border-default)]  p-8 rounded-[40px] relative overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-sm"
          >
            {/* Subtle card glow overlay */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent-primary-subtle)] blur-[50px] rounded-full pointer-events-none" />

            <div className="mb-8 text-center relative z-10">
              <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)]  tracking-tighter mb-2 font-poppins">
                Welcome <span className="text-[var(--text-accent)]       drop-shadow-[0_0_30px_rgba(0,93,195,0.3)]">Back.</span>
              </h1>
              <p className="text-slate-400  font-bold text-[10px] uppercase tracking-[0.3em]">Neural Interface Online</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-[var(--color-danger-subtle)] border border-[var(--color-danger)] text-[var(--color-danger)]  text-sm font-medium relative z-10">
                {error}
              </div>
            )}

            <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email Input */}
                <div className="relative group">
                  <input
                    type="email"
                    id="email-login"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer w-full bg-[var(--bg-subtle)]  border border-[var(--border-default)]  rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary-subtle)] focus:border-[var(--accent-primary)] transition-all duration-300 font-medium text-[var(--text-primary)]  placeholder-transparent"
                    placeholder="Email Address"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 peer-focus:text-[var(--text-accent)] transition-colors duration-300" />
                  <label htmlFor="email-login" className="absolute left-12 top-2 text-[10px] font-bold text-[var(--text-tertiary)]  uppercase tracking-widest transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[var(--text-accent)]  pointer-events-none">
                    Email Address
                  </label>
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password-login"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full bg-[var(--bg-subtle)]  border border-[var(--border-default)]  rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[var(--accent-primary-subtle)] focus:border-[var(--accent-primary)] transition-all duration-300 font-medium text-[var(--text-primary)]  placeholder-transparent"
                    placeholder="Password"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 peer-focus:text-[var(--text-accent)] transition-colors duration-300" />
                  <label htmlFor="password-login" className="absolute left-12 top-2 text-[10px] font-bold text-[var(--text-tertiary)]  uppercase tracking-widest transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:normal-case peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[var(--text-accent)]  pointer-events-none">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--accent-primary)] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-[10px] font-bold text-[var(--text-tertiary)] hover:text-[var(--accent-primary)]  dark:hover:text-[var(--accent-primary)] uppercase tracking-widest transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full relative group overflow-hidden px-8 py-4 bg-[var(--bg-base)]  rounded-2xl text-[var(--text-primary)]  font-bold text-sm uppercase tracking-widest shadow-2xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-sm ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? 'Authenticating...' : 'Sign In'} {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary-hover)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute w-full border-t border-[var(--border-default)]  transition-colors duration-700"></div>
                <span className="relative bg-[var(--bg-surface)]  px-4 text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-widest rounded-full shadow-sm  transition-colors duration-700">Or connect with</span>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="flex items-center justify-center gap-2 py-3 border border-[var(--border-default)]  rounded-2xl bg-[var(--bg-surface)] /[0.03] hover:bg-[var(--bg-surface)]  active:scale-[0.98] transition-all duration-300 text-[var(--text-primary)]  font-bold text-[10px] tracking-widest shadow-sm hover:shadow-md"
                >
                  <GoogleIcon /> GOOGLE
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-[var(--border-default)]  rounded-2xl bg-[var(--bg-surface)] /[0.03] hover:bg-[var(--bg-surface)]  active:scale-[0.98] transition-all duration-300 text-[var(--text-primary)]  font-bold text-[10px] tracking-widest shadow-sm hover:shadow-md">
                  <Apple size={18} /> APPLE
                </button>
              </div>
            </form>

            <p className="text-center mt-6 text-[var(--text-tertiary)]  text-[10px] font-bold uppercase tracking-widest relative z-10">
              No identity profile yet? <Link to="/register" className="text-[var(--text-accent)]  font-black hover:underline underline-offset-4 ml-1">Create Account</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
