import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Smooth animated scroll to top function
function animatedScrollToTop(duration: number = 600) {
  const startPosition = window.pageYOffset;
  const startTime = performance.now();
  
  function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
  
  function animateScroll(currentTime: number) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    
    const currentPosition = startPosition * (1 - easedProgress);
    window.scrollTo(0, currentPosition);
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  
  requestAnimationFrame(animateScroll);
}

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Wait for DOM to be fully rendered before scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Use our custom animated scroll for better control and consistency
        animatedScrollToTop(500);
      });
    });
  }, [pathname]);
}
