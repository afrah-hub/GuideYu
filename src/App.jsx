import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import FooterComponent from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './components/DashboardLayout';
import { useLocation } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'framer-motion';
import CursorAura from './components/CursorAura';
import { ThemeProvider } from './context/ThemeContext';

// Lazy Loaded Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CareerPath = lazy(() => import('./pages/CareerPath'));
const ExploreCareers = lazy(() => import('./pages/ExploreCareers'));
const LearningPath = lazy(() => import('./pages/LearningPath'));
const StudyMaterials = lazy(() => import('./pages/StudyMaterials'));
const Syllabus = lazy(() => import('./pages/Syllabus'));
const LessonsScreen = lazy(() => import('./pages/LessonsScreen'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
const SavedPaths = lazy(() => import('./pages/SavedPaths'));

// Admin Imports & Lazy Loaded Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCareers = lazy(() => import('./pages/admin/AdminCareers'));
const AdminRoadmaps = lazy(() => import('./pages/admin/AdminRoadmaps'));
const AdminModules = lazy(() => import('./pages/admin/AdminModules'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

// Beautiful glassmorphic fallback loader
const RouteFallback = () => (
  <div className="w-full min-h-[60vh] flex flex-col items-center justify-center space-y-6">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-accent-primary/20 animate-pulse" />
      <div className="absolute inset-0 rounded-full border-4 border-t-accent-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-tertiary animate-pulse">Syncing Space...</span>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  const userRole = user.role || user.Role;
  const careerGoal = user.careerGoal || user.CareerGoal;

  if (userRole !== 'Admin' && !careerGoal) {
    return <Navigate to="/profile-setup" />;
  }

  return children;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/profile-setup', '/forgot-password', '/reset-password'].includes(location.pathname);
  const dashboardRoutes = ['/dashboard', '/career-path', '/explore-careers', '/skills', '/learning', '/profile-settings', '/learning-path', '/analyze-path', '/study-materials', '/syllabus', '/lessons', '/resume-builder', '/saved-paths'];
  const isDashboardPage = dashboardRoutes.some(route => location.pathname.startsWith(route));
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-poppins transition-colors duration-500 overflow-x-hidden mesh-gradient-theme">
      <CursorAura />
      {!isAuthPage && !isDashboardPage && !isAdminPage && <Navbar />}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location} key={location.pathname}>
              {/* Public Landing */}
              <Route path="/" element={<Home />} />

              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Dashboard Pages */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout><Dashboard /></DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/career-path" element={
                <ProtectedRoute>
                  <DashboardLayout><CareerPath /></DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/explore-careers" element={
                <ProtectedRoute>
                  <DashboardLayout><ExploreCareers /></DashboardLayout>
                </ProtectedRoute>
              } />


              <Route path="/learning-path" element={
                <ProtectedRoute>
                  <DashboardLayout><LearningPath /></DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/analyze-path" element={
                <ProtectedRoute>
                  <DashboardLayout><LearningPath /></DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/study-materials" element={
                <ProtectedRoute>
                  <DashboardLayout><StudyMaterials /></DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/syllabus" element={
                <ProtectedRoute>
                  <DashboardLayout><Syllabus /></DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/lessons/:roadmapId/:moduleId/:topicId" element={
                <ProtectedRoute>
                  <LessonsScreen />
                </ProtectedRoute>
              } />

              <Route path="/profile-settings" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfileSettings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/resume-builder" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ResumeBuilder />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              <Route path="/saved-paths" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SavedPaths />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <AdminProtectedRoute>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/careers" element={
                <AdminProtectedRoute>
                  <AdminLayout><AdminCareers /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/roadmaps" element={
                <AdminProtectedRoute>
                  <AdminLayout><AdminRoadmaps /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/modules" element={
                <AdminProtectedRoute>
                  <AdminLayout><AdminModules /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <AdminProtectedRoute>
                  <AdminLayout><AdminUsers /></AdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <AdminProtectedRoute>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </AdminProtectedRoute>
              } />

            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      {!isAuthPage && !isDashboardPage && !isAdminPage && <FooterComponent />}
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="979217253661-kou7vkl01ssesi58mmrj28dm5rhk9hi1.apps.googleusercontent.com">
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <SmoothScroll>
              <AppContent />
            </SmoothScroll>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
