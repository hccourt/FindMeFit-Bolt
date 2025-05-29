import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Search, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { useAuthStore, useThemeStore } from '../../lib/store';
import { Avatar } from '../ui/Avatar';
import { Logo } from '../ui/Logo';
import { SlidePanel } from '../ui/SlidePanel';
import { LocationPicker } from '../ui/LocationPicker';
import { supabase } from '../../lib/supabase';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear auth store state
      logout();
      
      // Clear any persisted state
      if (useAuthStore.persist.clearStorage) {
        await useAuthStore.persist.clearStorage();
      }
      
      // Navigate to home
      navigate('/');
      setIsUserPanelOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user?.role === 'instructor' ? (
              <Link to="/instructor\" className="text-sm font-medium hover:text-primary-500">
                Manage
              </Link>
            ) : (
              <Link to="/discover" className="text-sm font-medium hover:text-primary-500">
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
                <Avatar src={user?.profileImage} name={user?.name} size="sm" />
              </button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-full p-2 hover:bg-muted"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <Link to="/" onClick={closeMenu}>
                <Logo />
              </Link>
              <button
                className="rounded-full p-2 hover:bg-neutral-100"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Location Picker - Mobile */}
              <div className="mb-4">
                <LocationPicker />
              </div>
              
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search classes, trainers, or locations"
                  className="w-full pl-10 pr-4 py-3 rounded-full border border-neutral-300"
                />
              </div>
              <div className="space-y-4">
                {user?.role === 'instructor' ? (
                  <Link
                    to="/instructor"
                    className="block p-3 rounded-lg hover:bg-neutral-50"
                    onClick={closeMenu}
                  >
                    Manage
                  </Link>
                ) : (
                  <Link
                    to="/discover"
                    className="block p-3 rounded-lg hover:bg-neutral-50"
                    onClick={closeMenu}
                  >
                    Discover Classes
                  </Link>
                )}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block p-3 rounded-lg hover:bg-neutral-50"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={`/profile/${user?.id}`}
                      className="block p-3 rounded-lg hover:bg-neutral-50"
                      onClick={closeMenu}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left p-3 rounded-lg hover:bg-neutral-50 text-error-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block p-3 rounded-lg hover:bg-neutral-50"
                      onClick={closeMenu}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      className="block p-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                      onClick={closeMenu}
                    >
                      Sign Up
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
          <div className="flex items-center space-x-4 text-foreground">
            <Avatar src={user?.profileImage} name={user?.name} size="lg" />
            <div>
              <h3 className="font-semibold text-lg">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <div className="border-t border-border -mx-6 px-6 py-4">
            <div className="space-y-3">
              {user?.role === 'instructor' && (
                <Link
                  to="/instructor"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground"
                  onClick={() => setIsUserPanelOpen(false)}
                >
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Manage Classes</span>
                </Link>
              )}
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground"
                onClick={() => setIsUserPanelOpen(false)}
              >
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/discover"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground"
                onClick={() => setIsUserPanelOpen(false)}
              >
                <Search className="h-5 w-5 text-muted-foreground" />
                <span>Discover Classes</span>
              </Link>
              <Link
                to={`/profile/${user?.id}`}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted text-foreground"
                onClick={() => setIsUserPanelOpen(false)}
              >
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Profile Settings</span>
              </Link>
              <button
                onClick={toggleDarkMode}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted text-foreground"
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
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted text-error-600"
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