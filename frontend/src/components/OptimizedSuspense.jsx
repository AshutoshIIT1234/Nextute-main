import { Suspense } from 'react';

const MinimalLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const OptimizedSuspense = ({ children, fallback = <MinimalLoader /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

export default OptimizedSuspense;