import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useThemeStore } from '../../lib/store';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};