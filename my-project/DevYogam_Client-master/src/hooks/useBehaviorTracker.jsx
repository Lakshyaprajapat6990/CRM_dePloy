import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  trackPageView, 
  trackClick, 
  trackScroll, 
  trackTimeSpent, 
  trackExit,
  trackForm
} from '../services/userBehaviorService';

/**
 * Custom hook for tracking user behavior on the website
 * Automatically tracks page views and provides methods for tracking other actions
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.trackPageViews - Whether to auto-track page views (default: true)
 * @param {boolean} options.trackClicks - Whether to auto-track clicks (default: true)
 * @param {boolean} options.trackScroll - Whether to track scroll depth (default: true)
 * @param {boolean} options.trackExit - Whether to track exit events (default: true)
 */
function useBehaviorTracker(options = {}) {
  const {
    trackPageViews = true,
    trackClicks = true,
    trackScroll: enableScrollTracking = true,
    trackExit: enableExitTracking = true,
  } = options;

  const location = useLocation();
  const previousPageRef = useRef(null);
  const pageStartTimeRef = useRef(null);
  const maxScrollDepthRef = useRef(0);
  const scrollTrackedRef = useRef({});

  // Track page view on route change
  useEffect(() => {
    if (trackPageViews && location.pathname) {
      const currentPage = location.pathname;
      
      // Track time spent on previous page
      if (previousPageRef.current && pageStartTimeRef.current) {
        const timeSpent = Date.now() - pageStartTimeRef.current;
        trackTimeSpent(timeSpent, previousPageRef.current);
      }

      // Track new page view
      trackPageView(currentPage);
      
      // Reset scroll tracking for new page
      maxScrollDepthRef.current = 0;
      scrollTrackedRef.current = {};
      pageStartTimeRef.current = Date.now();
      previousPageRef.current = currentPage;
    }
  }, [location.pathname, trackPageViews]);

  // Track exit on page leave
  useEffect(() => {
    if (enableExitTracking) {
      const handleBeforeUnload = () => {
        if (previousPageRef.current) {
          trackExit(previousPageRef.current);
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [enableExitTracking]);

  // Track clicks
  const handleClick = useCallback((event) => {
    if (!trackClicks) return;

    const target = event.target;
    const element = target.tagName.toLowerCase();
    
    // Get meaningful element info
    let elementInfo = element;
    if (target.id) elementInfo += `#${target.id}`;
    if (target.className && typeof target.className === 'string') {
      const classes = target.className.split(' ').slice(0, 2).join('.');
      if (classes) elementInfo += `.${classes}`;
    }
    
    // Track button and link clicks
    if (element === 'button' || element === 'a') {
      const text = target.textContent?.trim().slice(0, 50);
      trackClick(elementInfo, text || '');
    } else {
      trackClick(elementInfo, '');
    }
  }, [trackClicks]);

  // Attach click listener
  useEffect(() => {
    if (trackClicks) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [handleClick, trackClicks]);

  // Track scroll depth
  useEffect(() => {
    if (!enableScrollTracking) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      const currentPage = location.pathname;
      
      // Track at 25%, 50%, 75%, 100% depth
      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !scrollTrackedRef.current[currentPage]?.[milestone]) {
          trackScroll(milestone, currentPage);
          
          if (!scrollTrackedRef.current[currentPage]) {
            scrollTrackedRef.current[currentPage] = {};
          }
          scrollTrackedRef.current[currentPage][milestone] = true;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enableScrollTracking, location.pathname]);

  // Track form interactions
  const trackFormStart = useCallback((formName) => {
    trackForm(formName, true);
  }, []);

  const trackFormSubmit = useCallback((formName) => {
    trackForm(formName, false);
  }, []);

  // Manual tracking methods for custom usage
  return {
    trackPageView,
    trackClick,
    trackScroll,
    trackTimeSpent,
    trackExit,
    trackFormStart,
    trackFormSubmit,
  };
}

export default useBehaviorTracker;
