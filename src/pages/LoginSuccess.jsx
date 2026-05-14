import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginSuccess = () => {
  const navigate = useNavigate();
 
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);
 
  return (
    <div className="min-h-screen mesh-gradient-theme flex items-center justify-center font-poppins transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-br var(--gradient-brand) rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.5)] relative z-10"
        >
          <CheckCircle size={40} className="text-[var(--text-primary)]" />
        </motion.div>
        
        <h1 className="text-3xl font-black text-[var(--text-primary)]  mb-2 relative z-10 tracking-tight">Login Successful!</h1>
        <p className="text-[var(--text-secondary)]  font-medium relative z-10">
          Syncing your neural profile...
        </p>
      </motion.div>
    </div>
  );
};

export default LoginSuccess;
