// Instant component loader with aggressive caching
const componentCache = new Map();
const loadingPromises = new Map();

export const createInstantLoader = (importFn, fallback) => {
  return () => {
    const key = importFn.toString();
    
    // Return cached component immediately
    if (componentCache.has(key)) {
      return Promise.resolve(componentCache.get(key));
    }
    
    // Return existing loading promise
    if (loadingPromises.has(key)) {
      return loadingPromises.get(key);
    }
    
    // Create new loading promise
    const promise = importFn()
      .then(module => {
        componentCache.set(key, module);
        loadingPromises.delete(key);
        return module;
      })
      .catch(error => {
        loadingPromises.delete(key);
        console.error('Component loading failed:', error);
        return fallback || { default: () => null };
      });
    
    loadingPromises.set(key, promise);
    return promise;
  };
};

// Preload critical components immediately
export const preloadCriticalComponents = () => {
  const criticalImports = [
    () => import('../pages/HomePage'),
    () => import('../components/Student/StudentLogin'),
    () => import('../components/Institute/InstituteLogin'),
    () => import('../pages/StudentDashboard')
  ];
  
  criticalImports.forEach(importFn => {
    const loader = createInstantLoader(importFn);
    loader().catch(() => {}); // Silently fail preloads
  });
};

export default createInstantLoader;