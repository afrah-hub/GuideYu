import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Shield, 
  User as UserIcon,
  Mail,
  Calendar,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  TrendingUp,
  Map,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null, type: null });
  const [notification, setNotification] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showNotification(`Subject clearance updated: ${newRole} access granted.`, "success");
    } catch (error) {
      showNotification("Failed to update access level.", "error");
    }
  };

  const handleBlockAction = (user, type) => {
    setConfirmModal({ isOpen: true, user, type });
    setActiveMenuId(null);
  };

  const confirmBlockToggle = async () => {
    const { user, type } = confirmModal;
    setIsProcessing(true);
    try {
      if (type === 'block') {
        await adminService.blockUser(user.id);
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBlocked: true } : u));
        showNotification(`Entity ${user.fullName} has been restricted.`, "success");
      } else {
        await adminService.unblockUser(user.id);
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBlocked: false } : u));
        showNotification(`Entity ${user.fullName} restoration sequence complete.`, "success");
      }
      setConfirmModal({ isOpen: false, user: null, type: null });
    } catch (error) {
      showNotification(error.message || "Command execution failure.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">Identity Matrix</h1>
          <p className="text-text-tertiary font-medium mt-1">Manage entity permissions and security clearance</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary group-focus-within:text-accent-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Query entities..." 
              className="input pl-11 h-12 w-64 md:w-80 bg-bg-surface/30 backdrop-blur-md border-border-default/50 rounded-2xl font-bold text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden border border-border-default/50 shadow-2xl">
        {/* Table Header / Actions */}
        <div className="p-6 border-b border-border-default/30 flex flex-col md:flex-row gap-4 justify-between bg-bg-surface/10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-accent-primary/10 text-accent-primary text-[10px] font-black uppercase tracking-widest border border-accent-primary/20">
              {filteredUsers.length} Entities Loaded
            </span>
          </div>
          <div className="flex gap-2">
            <button className="btn-ghost py-2.5 px-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-bg-surface/20 border-border-default/50">
              <Filter className="w-3.5 h-3.5" />
              Role Logic
            </button>
            <button className="btn-ghost py-2.5 px-4 text-[10px] font-black uppercase tracking-widest bg-bg-surface/20 border-border-default/50">
              Sequence: Chrono
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-subtle/30 backdrop-blur-md">
                <th className="px-8 py-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Subject Profile</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Access Level</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Initialization</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Last Sync</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default/20">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    <td colSpan="5" className="px-8 py-6"><div className="h-12 skeleton rounded-2xl w-full" /></td>
                  </tr>
                ))
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-accent-primary/[0.03] transition-all duration-300 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bg-subtle to-bg-surface border border-border-default flex items-center justify-center text-text-primary font-black text-sm shadow-sm group-hover:border-accent-primary/50 transition-colors">
                          {user.fullName.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-bg-surface group-hover:scale-110 transition-transform ${user.isBlocked ? 'bg-error' : 'bg-success'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-text-primary tracking-tight group-hover:text-accent-primary transition-colors">{user.fullName}</div>
                        <div className="text-[10px] font-bold text-text-tertiary flex items-center gap-1.5 uppercase tracking-wider mt-0.5">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className={`
                        inline-flex items-center w-fit px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border
                        ${user.role === 'Admin' 
                          ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20 shadow-[0_0_12px_rgba(39,116,174,0.1)]' 
                          : 'bg-success/10 text-success border-success/20'}
                      `}>
                        {user.role}
                      </div>
                      {user.isBlocked ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-error/10 text-error border-error/20 w-fit">
                          <XCircle className="w-3 h-3" />
                          Restricted
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border bg-success/5 text-success/60 border-success/10 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[11px] font-bold text-text-secondary flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 opacity-50" />
                      {new Date(user.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-[11px] font-bold text-text-secondary flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 opacity-50" />
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : 'NULL'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        className="p-2.5 rounded-xl bg-bg-surface/50 border border-border-default/50 text-text-tertiary hover:text-accent-primary hover:border-accent-primary/50 transition-all shadow-sm"
                        title={user.role === 'Admin' ? "Demote to User" : "Promote to Admin"}
                      >
                        <Shield className="w-4.5 h-4.5" />
                      </button>
                      <div className="relative" ref={activeMenuId === user.id ? menuRef : null}>
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                          className={`p-2.5 rounded-xl border transition-all shadow-sm ${activeMenuId === user.id ? 'bg-accent-primary/10 border-accent-primary text-accent-primary' : 'bg-bg-surface/50 border-border-default/50 text-text-tertiary hover:text-text-primary hover:border-border-strong'}`}
                        >
                          <MoreVertical className="w-4.5 h-4.5" />
                        </button>
                        
                        <AnimatePresence>
                          {activeMenuId === user.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 mt-3 w-56 rounded-2xl bg-bg-surface border border-border-default shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                            >
                              <div className="p-2 space-y-1">
                                <div className="px-4 py-2 text-[9px] font-black text-text-tertiary uppercase tracking-widest border-b border-border-default/30 mb-1">
                                  Directive Logic
                                </div>
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 rounded-xl transition-all">
                                  <Eye className="w-4 h-4" />
                                  View Profile
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 rounded-xl transition-all">
                                  <TrendingUp className="w-4 h-4" />
                                  View Career
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 rounded-xl transition-all border-b border-border-default/30 pb-3 mb-1">
                                  <Map className="w-4 h-4" />
                                  View Roadmap
                                </button>
                                
                                {user.isBlocked ? (
                                  <button 
                                    onClick={() => handleBlockAction(user, 'unblock')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-success hover:bg-success/10 rounded-xl transition-all"
                                  >
                                    <Unlock className="w-4 h-4" />
                                    Unblock User
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleBlockAction(user, 'block')}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-error hover:bg-error/10 rounded-xl transition-all"
                                  >
                                    <Lock className="w-4 h-4" />
                                    Block User
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-6 border-t border-border-default/30 flex items-center justify-between bg-bg-surface/5">
          <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">
            Scan complete // <span className="text-text-secondary">{filteredUsers.length} Nodes</span>
          </p>
          <div className="flex gap-3">
            <button className="btn-ghost py-2 px-5 text-[10px] font-black uppercase tracking-widest bg-bg-surface/20 border-border-default/50 disabled:opacity-30" disabled>PREV</button>
            <button className="btn-ghost py-2 px-5 text-[10px] font-black uppercase tracking-widest bg-bg-surface/20 border-border-default/50 disabled:opacity-30" disabled>NEXT</button>
          </div>
        </div>
      </div>
    </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setConfirmModal({ isOpen: false, user: null, type: null })}
              className="absolute inset-0 bg-bg-base/80 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-bg-surface border border-border-default rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="p-10 text-center">
                <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 ${confirmModal.type === 'block' ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                  {confirmModal.type === 'block' ? <AlertTriangle className="w-10 h-10" /> : <Shield className="w-10 h-10" />}
                </div>
                <h3 className="text-2xl font-black text-text-primary tracking-tight mb-2 uppercase">
                  Security Override Required
                </h3>
                <p className="text-text-tertiary font-medium mb-8 text-sm">
                  Are you sure you want to {confirmModal.type === 'block' ? 'restrict' : 'restore'} access for <span className="text-text-primary font-bold">{confirmModal.user?.fullName}</span>? This action will be logged in the system audit.
                </p>
                <div className="flex gap-4">
                  <button 
                    disabled={isProcessing}
                    onClick={() => setConfirmModal({ isOpen: false, user: null, type: null })}
                    className="flex-1 h-14 rounded-2xl bg-bg-subtle border border-border-default text-text-tertiary font-black text-[11px] uppercase tracking-widest hover:bg-bg-surface transition-all disabled:opacity-50"
                  >
                    Abort
                  </button>
                  <button 
                    disabled={isProcessing}
                    onClick={confirmBlockToggle}
                    className={`flex-1 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 ${confirmModal.type === 'block' ? 'bg-error hover:bg-error-strong shadow-error/20' : 'bg-success hover:bg-success-strong shadow-success/20'}`}
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Execute Protocol</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[200] w-fit"
          >
            <div className={`px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-4 ${notification.type === 'success' ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/30 text-error'}`}>
              {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <span className="text-[11px] font-black uppercase tracking-[0.15em]">{notification.message}</span>
              <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminUsers;
