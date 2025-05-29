import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/Auth/LoginPage';
import { SignupPage } from './pages/Auth/SignupPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ClassDetailPage } from './pages/ClassDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { useAuthStore } from './lib/store';
import { useScrollToTop } from './lib/hooks';
import { useThemeStore } from './lib/store';

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function App() {
  const { checkAuth } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/classes/:id" element={<ClassDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/profile/:id" element={<EditProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;