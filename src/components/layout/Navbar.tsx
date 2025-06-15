import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Search, Sun, Moon, Home, Settings, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { useAuthStore, useThemeStore, useNotificationStore } from '../../lib/store';
import { Avatar } from '../ui/Avatar';
import { Logo } from '../ui/Logo';
import { SlidePanel } from '../ui/SlidePanel';
import { LocationPicker } from '../ui/LocationPicker';
import { NotificationCenter } from '../features/NotificationCenter';
import { Badge } from '../ui/Badge';
import { supabase } from '../../lib/supabase';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { unreadCount, subscribeToNotifications } = useNotificationStore();
  
  // Subscribe to real-time notifications
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const unsubscribe = subscribeToNotifications();
      return unsubscribe;
    }
  }, [isAuthenticated, user, subscribeToNotifications]);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      if (useAuthStore.persist.clearStorage) {
        await useAuthStore.persist.clearStorage();
      }
      navigate('/');
      setIsUserPanelOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 ml-4">
            <Logo />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search classes, trainers, or locations"
                className="w-full pl-10 pr-4 py-3 rounded-full border border-input bg-background shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user?.role === 'instructor' ? (
              <Link to="/instructor" className="text-sm font-medium hover:text-primary-500 whitespace-nowrap">
                Manage
              </Link>
            ) : (
              <Link to="/discover" className="text-sm font-medium hover:text-primary-500 whitespace-nowrap">
                Discover Classes
              </Link>
            )}
            <LocationPicker />
            {isAuthenticated ? (
              <button
                className="flex items-center space-x-2 p-2 rounded-full border border-input hover:shadow-md transition-all"
                onClick={() => setIsUserPanelOpen(true)}
              >
                <Menu className="h-4 w-4" />
                <div className="relative">
                  {unreadCount > 0 && (
                    <Badge 
                      variant="error" 
                      size="sm" 
                      className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 text-xs flex items-center justify-center p-0"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                <Avatar src={user?.profileImage} name={user?.name} size="sm" />
                </div>
              </button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="whitespace-nowrap">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="whitespace-nowrap">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-full p-2 hover:bg-muted mr-4"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`fixed inset-0 z-50 ${isDarkMode ? 'bg-background' : 'bg-white'} md:hidden`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-20 px-4 border-b border-border">
              <Link to="/" onClick={closeMenu} className="ml-4">
                <Logo />
              </Link>
              <button
                className="rounded-full p-2 hover:bg-muted mr-4"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {/* Location Picker - Mobile */}
              <div className="mb-6">
                <LocationPicker />
              </div>
              
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search classes, trainers, or locations"
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                {user?.role === 'instructor' ? (
                  <Link
                    to="/instructor"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted whitespace-nowrap"
                    onClick={closeMenu}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Manage</span>
                  </Link>
                ) : (
                  <Link
                    to="/discover"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted whitespace-nowrap"
                    onClick={closeMenu}
                  >
                    <Search className="h-5 w-5" />
                    <span>Discover Classes</span>
                  </Link>
                )}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted whitespace-nowrap"
                      onClick={closeMenu}
                    >
                      <Home className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to={`/profile/${user?.id}`}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted whitespace-nowrap"
                      onClick={closeMenu}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-muted whitespace-nowrap"
                    >
                      {isDarkMode ? (
                        <>
                          <Sun className="h-5 w-5" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-muted text-error whitespace-nowrap"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted whitespace-nowrap"
                      onClick={closeMenu}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Log In</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 whitespace-nowrap"
                      onClick={closeMenu}
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Panel */}
      <SlidePanel isOpen={isUserPanelOpen} onClose={() => setIsUserPanelOpen(false)}>
        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4 text-foreground">
            <Avatar src={user?.profileImage} name={user?.name} size="lg" />
            <div>
              <h3 className="font-semibold text-lg">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="border-t border-border -mx-6 px-6 py-4">

          {/* Notifications Section */}
          <div className="border-b border-border pb-6 mb-3">
            <NotificationCenter />
          </div>

            
            <div className="space-y-3">
              {user?.role === 'instructor' && (
                <Link
                  to="/instructor"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground whitespace-nowrap"
                  onClick={() => setIsUserPanelOpen(false)}
                >
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Manage Classes</span>
                </Link>
              )}
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground whitespace-nowrap"
                onClick={() => setIsUserPanelOpen(false)}
              >
                <Home className="h-5 w-5 text-muted-foreground" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/discover"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground whitespace-nowrap"
                onClick={() => setIsUserPanelOpen(false)}
              >
                <Search className="h-5 w-5 text-muted-foreground" />
                <span>Discover Classes</span>
              </Link>
              <Link
                to={`/profile/${user?.id}`}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground whitespace-nowrap"
                onClick={() => setIsUserPanelOpen(false)}
              >
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Profile Settings</span>
              </Link>
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted text-foreground whitespace-nowrap"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-5 w-5 text-muted-foreground" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 text-muted-foreground" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted text-error whitespace-nowrap"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </SlidePanel>
    </header>
  );
};
