import React, { useState, useEffect } from 'react';
import { 
  User, GraduationCap, Briefcase, Wrench, Lock, Camera, 
  CheckCircle2, Mail, Shield, Save, ArrowLeft, Target, 
  Cpu, ChevronRight, Globe, Activity, Eye, EyeOff, AlertTriangle, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const ProfileSettings = () => {
  const { user, refreshUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('academic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    highestQualification: '',
    manualQualification: '',
    stream: '',
    institutionName: '',
    currentStatus: '',
    careerGoal: '',
    preferredIndustry: '',
    skills: '',
    skillLevels: '',
    interests: '',
    profileImageUrl: ''
  });

  const [isQualDropdownOpen, setIsQualDropdownOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        const standardQuals = ["High School", "Bachelor's", "Master's", "PhD"];
        const isStandard = standardQuals.includes(data.highestQualification);

        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          highestQualification: isStandard ? data.highestQualification : (data.highestQualification ? 'Others' : ''),
          manualQualification: isStandard ? '' : data.highestQualification,
          stream: data.stream || '',
          institutionName: data.institutionName || '',
          currentStatus: data.currentStatus || '',
          careerGoal: data.careerGoal || '',
          preferredIndustry: data.preferredIndustry || '',
          skills: data.skills || '',
          skillLevels: data.skillLevels || '',
          interests: data.interests || '',
          profileImageUrl: data.profileImageUrl || ''
        });
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, profileImageUrl: localUrl }));

    setIsSubmitting(true);
    try {
      const response = await authService.uploadPhoto(file);
      setFormData(prev => ({ ...prev, profileImageUrl: response.url }));
      await refreshUser();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Upload failed', error);
      setSaveStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSaveStatus(null);
    try {
      const submissionData = {
        ...formData,
        highestQualification: formData.highestQualification === 'Others'
          ? formData.manualQualification
          : formData.highestQualification
      };
      delete submissionData.manualQualification;
      await authService.updateProfile(submissionData);
      await refreshUser();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.changePassword(passwordData);
      setPasswordStatus('success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordStatus(null), 3000);
    } catch (error) {
      setPasswordStatus('error');
      setPasswordError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmAccountDeletion = async () => {
    setIsSubmitting(true);
    try {
      await authService.deleteAccount();
      await logout();
      window.location.href = '/';
    } catch (error) {
      alert('Failed to delete account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'academic', label: 'Academic', icon: <GraduationCap size={18} /> },
    { id: 'professional', label: 'Career', icon: <Briefcase size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Wrench size={18} /> },
    { id: 'account', label: 'Security', icon: <Lock size={18} /> },
  ];

  if (isLoading) {
    return <div className="max-w-4xl mx-auto py-20 skeleton rounded-2xl h-96" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header / Hero */}
      <div className="card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
            <label htmlFor="avatar-upload" className="relative block cursor-pointer">
              <div className="w-24 h-24 rounded-2xl bg-[var(--bg-overlay)] border-2 border-[var(--border-default)] overflow-hidden flex items-center justify-center group-hover:border-[var(--accent-primary)] transition-all">
                {formData.profileImageUrl ? (
                  <img src={formData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-[var(--accent-primary)]">{formData.fullName?.charAt(0)}</span>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight mb-1">{formData.fullName}</h1>
            <div className="flex items-center gap-3 text-[var(--text-secondary)] text-sm">
              <span className="flex items-center gap-1.5"><Mail size={14} /> {formData.email}</span>
              <span className="badge badge-indigo">Pro Tier</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className={`btn-primary px-8 h-12 ${saveStatus === 'success' ? 'bg-[var(--color-success)]' : ''}`}
        >
          {isSubmitting ? 'Syncing...' : saveStatus === 'success' ? 'Synced' : 'Update Profile'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-[var(--bg-surface)] text-[var(--accent-primary)] shadow-sm' 
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'academic' && (
          <div className="card space-y-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Academic Foundation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Highest Qualification</label>
                <div className="relative">
                  <select 
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    className="input appearance-none pr-10"
                  >
                    <option value="">Select Qualification</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="PhD">PhD</option>
                    <option value="Others">Others</option>
                  </select>
                  <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] rotate-90 pointer-events-none" />
                </div>
              </div>
              {formData.highestQualification === 'Others' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Specify Qualification</label>
                  <input 
                    type="text" 
                    value={formData.manualQualification}
                    onChange={(e) => setFormData(prev => ({ ...prev, manualQualification: e.target.value }))}
                    className="input" 
                    placeholder="e.g. Diploma"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Specialization Stream</label>
                <input type="text" name="stream" value={formData.stream} onChange={handleInputChange} className="input" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Institution</label>
                <input type="text" name="institutionName" value={formData.institutionName} onChange={handleInputChange} className="input" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="card space-y-8">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Career Trajectory</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {['Student', 'Professional', 'Job Seeker', 'Entrepreneur'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFormData(prev => ({ ...prev, currentStatus: status }))}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    formData.currentStatus === status 
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]' 
                      : 'border-[var(--border-default)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <Briefcase size={20} />
                  <span className="text-xs font-bold">{status}</span>
                </button>
              ))}
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Career Target</label>
                <input type="text" name="careerGoal" value={formData.careerGoal} onChange={handleInputChange} className="input" placeholder="e.g. AI Researcher" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Preferred Industry</label>
                <input type="text" name="preferredIndustry" value={formData.preferredIndustry} onChange={handleInputChange} className="input" placeholder="e.g. Technology" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card space-y-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2"><Cpu size={18} /> Skill Matrix</h3>
              <textarea name="skills" value={formData.skills} onChange={handleInputChange} rows="6" className="input resize-none" placeholder="List your skills..." />
            </div>
            <div className="card space-y-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2"><Target size={18} /> Proficiency</h3>
              <textarea name="skillLevels" value={formData.skillLevels} onChange={handleInputChange} rows="6" className="input resize-none" placeholder="e.g. React (Expert)..." />
            </div>
            <div className="card md:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2"><Activity size={18} /> Interests</h3>
              <textarea name="interests" value={formData.interests} onChange={handleInputChange} rows="4" className="input resize-none" placeholder="What drives you?" />
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="card space-y-8">
            <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2"><Lock size={20} /> Security & Account</h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest border-b border-[var(--border-faint)] pb-2">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-tertiary)]">Current Password</label>
                  <input type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="input" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-tertiary)]">New Password</label>
                  <input type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="input" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-tertiary)]">Confirm New</label>
                  <input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="input" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                {passwordError && <span className="text-xs font-bold text-[var(--color-danger)]">{passwordError}</span>}
                {passwordStatus === 'success' && <span className="text-xs font-bold text-[var(--color-success)]">Password updated!</span>}
                <button type="submit" className="btn-primary ml-auto">Update Password</button>
              </div>
            </form>

            <div className="pt-8 border-t border-[var(--border-faint)] flex items-center justify-between bg-[var(--color-danger-subtle)] p-6 rounded-xl">
              <div>
                <h4 className="font-bold text-[var(--color-danger)]">Delete Account</h4>
                <p className="text-sm text-[var(--text-secondary)]">This action is permanent and cannot be undone.</p>
              </div>
              <button onClick={() => setShowDeleteModal(true)} className="btn-destructive">Delete My Account</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card w-full max-w-lg space-y-6">
            <div className="w-12 h-12 bg-[var(--color-danger-subtle)] text-[var(--color-danger)] rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Delete Account?</h2>
              <p className="text-[var(--text-secondary)]">We're sorry to see you go. Please tell us why you're leaving.</p>
            </div>
            <select 
              value={deleteReason} 
              onChange={(e) => setDeleteReason(e.target.value)}
              className="input"
            >
              <option value="">Select a reason</option>
              <option value="Alternative">Found an alternative</option>
              <option value="Complex">Too complex to use</option>
              <option value="Privacy">Privacy concerns</option>
              <option value="Other">Other</option>
            </select>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="btn-ghost flex-1">Keep Account</button>
              <button onClick={confirmAccountDeletion} className="btn-destructive flex-1" disabled={!deleteReason}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
