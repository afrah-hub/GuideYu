import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Save, Trash2, Plus, X, Briefcase, GraduationCap,
  Code, Award, Link as LinkIcon, Globe,
  MapPin, Mail, Phone, User, Sparkles, Loader2, CheckCircle2,
  Eye, Download, Edit3, ArrowLeft
} from 'lucide-react';
import { resumeService } from '../services/resumeService';

// InputField component defined outside to prevent re-mounting
const InputField = ({ label, icon: Icon, name, value, onChange, type = "text", placeholder, multiline = false, rows = 3 }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] flex items-center gap-2">
      {Icon && <Icon size={14} className="text-[var(--text-accent)]" />}
      {label}
    </label>
    {multiline ? (
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-accent)] focus:ring-1 focus:ring-[var(--text-accent)] outline-none transition-all resize-y font-medium ${rows <= 2 ? 'min-h-[60px]' : 'min-h-[80px]'}`}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-accent)] focus:ring-1 focus:ring-[var(--text-accent)] outline-none transition-all font-medium"
      />
    )}
  </div>
);

const ResumeBuilder = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [message, setMessage] = useState(null);
  const [mode, setMode] = useState('edit'); // 'edit' or 'preview'
  const resumeRef = useRef();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    professionalSummary: '',
    skills: '',
    education: '',
    projects: '',
    experience: '',
    certifications: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    careerId: null
  });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const data = await resumeService.getMyResume();
      if (data) {
        setResumeId(data.id);
        setFormData({
          fullName: data.fullName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          location: data.location || '',
          professionalSummary: data.professionalSummary || '',
          skills: data.skills || '',
          education: data.education || '',
          projects: data.projects || '',
          experience: data.experience || '',
          certifications: data.certifications || '',
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          portfolioUrl: data.portfolioUrl || '',
          careerId: data.careerId
        });
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (resumeId) {
        await resumeService.updateResume(resumeId, formData);
        setMessage({ type: 'success', text: 'Resume updated successfully!' });
      } else {
        const result = await resumeService.createResume(formData);
        setResumeId(result.id);
        setMessage({ type: 'success', text: 'Resume created successfully!' });
      }
      setTimeout(() => setMessage(null), 3000);
      return true;
    } catch (error) {
      console.error("Error saving resume:", error);
      setMessage({ type: 'error', text: 'Failed to save resume. Please try again.' });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // 1. Save changes first
      const saved = await handleSave();
      if (!saved) return;

      // 2. Trigger backend download
      const blob = await resumeService.downloadResume();

      // 3. Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formData.fullName || 'Resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading resume:", error);
      setMessage({ type: 'error', text: 'Failed to download resume. Please try again.' });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[var(--text-accent)] animate-spin" />
        <p className="mt-4 text-[var(--text-secondary)] font-medium">Loading your profile...</p>
      </div>
    );
  }

  const PreviewSection = ({ title, icon: Icon, content }) => {
    if (!content) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
          {Icon && <Icon size={16} className="text-gray-400" />}
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 md:p-3 bg-[var(--accent-primary)]/10 rounded-xl md:rounded-2xl border border-[var(--accent-primary)]/20">
              <FileText className="text-[var(--text-accent)]" size={20} />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-[var(--text-primary)] tracking-tighter">
              Resume <span className="text-[var(--text-accent)]">{mode === 'edit' ? 'Builder' : 'Preview'}</span>
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            {mode === 'edit'
              ? 'Build your professional resume for the modern job market.'
              : 'Review your professional profile before downloading.'}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {mode === 'edit' ? (
            <>
              <button
                onClick={() => setMode('preview')}
                className="px-6 py-3 border border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-primary)] rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-[var(--accent-primary)]/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {resumeId ? 'Update' : 'Create'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setMode('edit')}
                className="px-6 py-3 border border-[var(--border-strong)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Edit3 size={16} />
                Edit Resume
              </button>
              <button
                onClick={handleDownload}
                disabled={downloading || saving}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-2xl flex items-center gap-3 border no-print ${message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
            <p className="text-sm font-bold">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {mode === 'edit' ? (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
          {/* Left Column: Contact & Profile */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[32px] p-6 space-y-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-[var(--border-default)] pb-4">
                <User size={18} className="text-[var(--text-accent)]" />
                <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)]">Personal Details</h2>
              </div>

              <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" icon={User} />
              <InputField label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john@example.com" icon={Mail} />
              <InputField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+1 (555) 000-0000" icon={Phone} />
              <InputField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="San Francisco, CA" icon={MapPin} multiline={true} rows={2} />
            </section>

            <section className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[32px] p-6 space-y-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-[var(--border-default)] pb-4">
                <LinkIcon size={18} className="text-[var(--text-accent)]" />
                <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)]">Social Links</h2>
              </div>

              <InputField label="GitHub URL" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/username" icon={LinkIcon} />
              <InputField label="LinkedIn URL" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/username" icon={LinkIcon} />
              <InputField label="Portfolio URL" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="https://yourportfolio.com" icon={Globe} />
            </section>
          </div>

          {/* Right Column: Professional Content */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-[32px] p-8 space-y-8 backdrop-blur-xl">
              <div className="flex items-center gap-3 border-b border-[var(--border-default)] pb-4">
                <Sparkles size={18} className="text-[var(--text-accent)]" />
                <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)]">Professional Content</h2>
              </div>

              <InputField
                label="Professional Summary"
                name="professionalSummary"
                value={formData.professionalSummary}
                onChange={handleChange}
                placeholder="High-energy software engineer with 5+ years of experience..."
                multiline
                icon={FileText}
              />

              <InputField
                label="Skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, Python, AWS, Docker, System Design..."
                multiline
                icon={Code}
              />

              <InputField
                label="Work Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Describe your career history, roles, and achievements..."
                multiline
                icon={Briefcase}
              />

              <InputField
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="List your degrees, institutions, and graduation years..."
                multiline
                icon={GraduationCap}
              />

              <InputField
                label="Projects"
                name="projects"
                value={formData.projects}
                onChange={handleChange}
                placeholder="Highlight key projects, technologies used, and outcomes..."
                multiline
                icon={Code}
              />

              <InputField
                label="Certifications"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                placeholder="AWS Certified Solutions Architect, Google Professional Cloud Developer..."
                multiline
                icon={Award}
              />
            </section>
          </div>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white text-gray-900 shadow-2xl rounded-none md:rounded-[4px] p-12 min-h-[1100px] w-full max-w-4xl mx-auto border border-gray-200 resume-paper"
          id="resume-content"
        >
          {/* Resume Header */}
          <div className="text-center space-y-4 border-b-2 border-gray-900 pb-8 mb-8">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-gray-900">{formData.fullName || 'Your Name'}</h2>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-gray-600">
              {formData.email && <div className="flex items-center gap-1.5"><Mail size={14} /> {formData.email}</div>}
              {formData.phoneNumber && <div className="flex items-center gap-1.5"><Phone size={14} /> {formData.phoneNumber}</div>}
              {formData.location && <div className="flex items-center gap-1.5"><MapPin size={14} /> {formData.location}</div>}
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-black uppercase tracking-widest text-[var(--text-accent)]">
              {formData.linkedinUrl && <a href={formData.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline"><LinkIcon size={12} /> LinkedIn</a>}
              {formData.githubUrl && <a href={formData.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline"><LinkIcon size={12} /> GitHub</a>}
              {formData.portfolioUrl && <a href={formData.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline"><Globe size={12} /> Portfolio</a>}
            </div>
          </div>

          {/* Resume Body */}
          <div className="grid grid-cols-1 gap-10">
            <PreviewSection title="Professional Summary" content={formData.professionalSummary} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <PreviewSection title="Experience" icon={Briefcase} content={formData.experience} />
              <PreviewSection title="Education" icon={GraduationCap} content={formData.education} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <PreviewSection title="Skills" icon={Code} content={formData.skills} />
              <PreviewSection title="Projects" icon={Code} content={formData.projects} />
            </div>

            <PreviewSection title="Certifications" icon={Award} content={formData.certifications} />
          </div>
        </motion.div>
      )}

      {/* Print-only styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-content, #resume-content * {
            visibility: visible;
          }
          #resume-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
          nav, aside, header, footer, .sidebar, .topbar {
            display: none !important;
          }
          @page {
            margin: 0;
            size: auto;
          }
        }
      `}} />
    </div>
  );
};

export default ResumeBuilder;
