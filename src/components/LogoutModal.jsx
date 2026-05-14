import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-[var(--bg-elevated)] rounded-[16px] p-8 shadow-2xl border border-[var(--border-strong)] overflow-hidden"
          >
            {/* Content */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[var(--color-danger-subtle)] rounded-xl flex items-center justify-center mb-6">
                <LogOut className="text-[var(--color-danger)]" size={24} />
              </div>

              <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-tight mb-2">
                Sign Out?
              </h3>
              <p className="text-[var(--text-secondary)] text-sm font-medium mb-8 leading-relaxed">
                Are you sure you want to end your session? You'll need to sign back in to access your dashboard.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={onConfirm}
                  className="btn-destructive w-full"
                >
                  Confirm Sign Out
                </button>
                <button
                  onClick={onClose}
                  className="btn-ghost w-full"
                >
                  Stay Logged In
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
