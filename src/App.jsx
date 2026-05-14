import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import FooterComponent from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import CareerPath from './pages/CareerPath';
import ExploreCareers from './pages/ExploreCareers';
import LearningNexus from './pages/LearningNexus';
import LearningPath from './pages/LearningPath';
import StudyMaterials from './pages/StudyMaterials';
import Syllabus from './pages/Syllabus';
import LessonsScreen from './pages/LessonsScreen';
import ProfileSettings from './pages/ProfileSettings';
import DashboardLayout from './components/DashboardLayout';
import { useLocation } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'framer-motion';
import CursorAura from './components/CursorAura';

import ForgotPassword from './pages/ForgotPassword';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCareers from './pages/admin/AdminCareers';
import AdminRoadmaps from './pages/admin/AdminRoadmaps';
import AdminModules from './pages/admin/AdminModules';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAiSettings from './pages/admin/AdminAiSettings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/profile-setup', '/forgot-password', '/reset-password'].includes(location.pathname);
  const dashboardRoutes = ['/dashboard', '/career-path', '/explore-careers', '/skills', '/learning', '/profile-settings', '/learning-nexus', '/learning-path', '/analyze-path', '/study-materials', '/syllabus', '/lessons'];
  const isDashboardPage = dashboardRoutes.some(route => location.pathname.startsWith(route));
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-poppins transition-colors duration-500 overflow-x-hidden mesh-gradient-theme">
      <CursorAura />
      {!isAuthPage && !isDashboardPage && !isAdminPage && <Navbar />}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
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

            <Route path="/learning-nexus" element={
              <ProtectedRoute>
                <DashboardLayout><LearningNexus /></DashboardLayout>
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
            <Route path="/admin/ai-settings" element={
              <AdminProtectedRoute>
                <AdminLayout><AdminAiSettings /></AdminLayout>
              </AdminProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAuthPage && !isDashboardPage && !isAdminPage && <FooterComponent />}
    </div>
  );
}

import { ThemeProvider } from './context/ThemeContext';

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
