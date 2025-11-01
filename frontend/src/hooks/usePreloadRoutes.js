import { useEffect } from 'react';
import { preloadCriticalComponents } from '../utils/instantLoader';

export const usePreloadRoutes = () => {
  useEffect(() => {
    // Preload immediately, no delay
    preloadCriticalComponents();
    
    // Preload additional routes after user interaction
    const preloadAdditional = () => {
      const additionalRoutes = [
        () => import('../pages/StudentDashboard'),
        () => import('../pages/InstituteDashBoard'),
        () => import('../pages/AboutUsPage'),
        () => import('../pages/ServicesPage')
      ];
      
      additionalRoutes.forEach(route => {
        route().catch(() => {});
      });
    };
    
    // Preload on first user interaction
    const events = ['mousedown', 'touchstart', 'keydown'];
    const handleInteraction = () => {
      preloadAdditional();
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
    
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { once: true, passive: true });
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);
};

export default usePreloadRoutes;