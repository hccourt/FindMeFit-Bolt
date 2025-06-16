import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Search, Sun, Moon, Home, ChevronUp, ChevronDown, LogIn, UserPlus } from 'lucide-react';
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
import { cn } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [areButtonsCollapsed, setAreButtonsCollapsed] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { unreadCount, subscribeToNotifications } = useNotificationStore();
  
  React.useEffect(() => {
    if (isAuthenticated && user?.id) {
      const unsubscribe = subscribeToNotifications();
      return unsubscribe;
    }
  }, [isAuthenticated, user?.id, subscribeToNotifications]);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleButtonsCollapse = () => setAreButtonsCollapsed(!areButtonsCollapsed);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      if (useAuthStore.persist.clearStorage) {
        await useAuthStore.persist.clearStorage();
      }
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleLogin = () => {
    navigate('/login');
    closeMenu();
  };

  const handleSignup = () => {
    navigate('/signup');
    closeMenu();
  };

  const mainButtons = [
    {
      id: 'dashboard',
      icon: <Home className="h-5 w-5" />,
      text: 'Dashboard',
      to: '/dashboard',
      visible: isAuthenticated
    },
    {
      id: 'discover',
      icon: <Search className="h-5 w-5" />,
      text: 'Discover Classes',
      to: '/discover',
      visible: true
    },
    {
      id: 'profile',
      icon: <User className="h-5 w-5" />,
      text: 'Profile Settings',
      to: `/profile/${user?.id}`,
      visible: isAuthenticated && !!user?.id
    },
    {
      id: 'theme',
      icon: isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />,
      text: isDarkMode ? 'Light Mode' : 'Dark Mode',
      onClick: toggleDarkMode,
      visible: true
    }
  ];

  const renderPanelContent = (onClose: () => void) => (
    <div className="flex flex-col h-full">
      <div className="space-y-3 flex-1 overflow-y-auto">
        <div className="px-2 pt-2">
          <div className="flex items-center space-x-3 text-foreground">
            <Avatar name={isAuthenticated ? user?.name || 'User' : 'Anony Moose'} size="lg" />
            <div>
              <h3 className="font-semibold text-lg">
                {isAuthenticated ? user?.name || 'User' : 'Anony Moose'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isAuthenticated ? user?.email || '' : 'Sign in to access all features'}
              </p>
            </div>
          </div>
        </div>

        <div className="px-2">
          <div className="border-t border-border pt-3">
            <NotificationCenter />
          </div>
        </div>
      </div>

      <div className="px-2">
        <div className={cn(
          "border-t border-border pt-3",
          areButtonsCollapsed ? "pb-0" : "pb-3"
        )}>
          <div className="flex items-center justify-between px-1 mb-2">
            <LocationPicker modal />
            <button
              onClick={toggleButtonsCollapse}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label={areButtonsCollapsed ? 'Expand menu' : 'Collapse menu'}
            >
              {areButtonsCollapsed ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className={cn(
            'space-y-2 transition-all duration-200 overflow-hidden',
            areButtonsCollapsed ? 'max-h-0' : 'max-h-96'
          )}>
            {user?.role === 'instructor' && (
              <Link
                to="/instructor"
                className="flex items-center justify-center space-x-3 h-10 px-4 rounded-full border border-input hover:bg-muted text-foreground whitespace-nowrap"
                onClick={onClose}
              >
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Manage Classes</span>
              </Link>
            )}

            {mainButtons.filter(btn => btn.visible).map((button) => (
              button.to ? (
                <Link
                  key={button.id}
                  to={button.to}
                  className="flex items-center justify-center space-x-3 h-10 px-4 rounded-full border border-input hover:bg-muted text-foreground whitespace-nowrap"
                  onClick={onClose}
                >
                  {button.icon}
                  <span>{button.text}</span>
                </Link>
              ) : (
                <button
                  key={button.id}
                  onClick={button.onClick}
                  className="flex items-center justify-center space-x-3 w-full h-10 px-4 rounded-full border border-input hover:bg-muted text-foreground whitespace-nowrap"
                >
                  {button.icon}
                  <span>{button.text}</span>
                </button>
              )
            ))}

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-3 w-full h-10 px-4 rounded-full bg-error-500 text-white hover:bg-error-600 whitespace-nowrap"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            )}
            
            {!isAuthenticated && (
              <>
                <button
                  onClick={handleLogin}
                  className="flex items-center justify-center space-x-3 w-full h-10 px-4 rounded-full bg-primary-500 text-white hover:bg-primary-600 whitespace-nowrap"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={handleSignup}
                  className="flex items-center justify-center space-x-3 w-full h-10 px-4 rounded-full border border-primary-500 text-primary-500 hover:bg-primary-50 whitespace-nowrap"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Sign Up</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <Container>
        <nav className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 ml-4">
            <Logo />
          </Link>

          <div className="flex items-center space-x-4">
            {user?.role === 'instructor' ? (
              <Link to="/instructor" className="hidden md:block text-sm font-medium hover:text-primary-500 whitespace-nowrap">
                Manage
              </Link>
            ) : (
              <Link to="/discover" className="hidden md:block text-sm font-medium hover:text-primary-500 whitespace-nowrap">
                Discover Classes
              </Link>
            )}
            
            <button
              className="flex items-center space-x-2 p-2 rounded-full border border-input hover:shadow-md transition-all mr-4 relative"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <div className="relative">
                {(unreadCount > 0 || !isAuthenticated) && (
                  <Badge 
                    variant="warning" 
                    size="sm" 
                    className="absolute -top-2 -right-2 min-w-[1.25rem] w-5 h-5 text-xs flex items-center justify-center p-0 z-[10] rounded-full"
                  >
                    {!isAuthenticated ? '1' : unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
                <Avatar src={user?.profileImage} name={isAuthenticated ? user?.name || 'User' : 'Anony Moose'} size="sm" />
              </div>
            </button>
          </div>
        </nav>
      </Container>

      <SlidePanel 
        isOpen={isMenuOpen} 
        onClose={closeMenu}
        side="right"
      >
        {renderPanelContent(closeMenu)}
      </SlidePanel>
    </header>
  );
};
