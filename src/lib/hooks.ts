import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use multiple requestAnimationFrame calls to ensure DOM is fully rendered
    // and then use instant scroll to guarantee we reach the top
    const scrollToTop = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // First try instant scroll to ensure we get to the top
          window.scrollTo(0, 0);
          
          // Then add a small delay and do a smooth scroll for better UX
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          }, 10);
        });
      });
    };
    
    scrollToTop();
  }, [pathname]);
}