import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/Auth/LoginPage'
import { SignupPage } from './pages/Auth/SignupPage'
import { EmailConfirmationPage } from './pages/Auth/EmailConfirmationPage'
import { DiscoverPage } from './pages/DiscoverPage'
import { ClassDetailPage } from './pages/ClassDetailPage'
import { DashboardPage } from './pages/DashboardPage'
import { EditProfilePage } from './pages/EditProfilePage'
import { InstructorDashboard } from './pages/InstructorDashboard'
import { AboutPage } from './pages/AboutPage'
import { BlogPage } from './pages/BlogPage'
import { PressPage } from './pages/PressPage'
import { HelpPage } from './pages/HelpPage'
import { InstructorsPage } from './pages/InstructorsPage'
import { ClientsPage } from './pages/ClientsPage'
import { CommunityPage } from './pages/CommunityPage'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { CookiesPage } from './pages/CookiesPage'
import { useAuthStore } from './lib/store'
import { useScrollToTop } from './lib/hooks'
import { useThemeStore } from './lib/store'
import { useLocationStore } from './lib/store'
import { ToastContainer } from './components/ui/ToastContainer'

function ScrollToTop() {
  useScrollToTop()
  return null
}

function App() {
  const { checkAuth } = useAuthStore()
  const { isDarkMode } = useThemeStore()
  const { requestUserLocation } = useLocationStore()
  
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])
  
  React.useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  React.useEffect(() => {
    // Request user location when the app loads
    requestUserLocation()
  }, [requestUserLocation])
  
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/confirm" element={<EmailConfirmationPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/classes/:id" element={<ClassDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/profile/:id" element={<EditProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/instructors" element={<InstructorsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  )
}

export default App
