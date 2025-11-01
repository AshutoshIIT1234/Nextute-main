import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  DashboardSkeleton, 
  LoginSkeleton, 
  ListSkeleton,
  CardGridSkeleton
} from './InstantSkeletons';

const getSkeletonForRoute = (pathname) => {
  if (pathname === '/') return <CardGridSkeleton />;
  if (pathname.includes('/dashboard')) return <DashboardSkeleton />;
  if (pathname.includes('/login') || pathname.includes('/signup')) return <LoginSkeleton />;
  if (pathname.includes('/institutes') || pathname.includes('/teachers') || pathname.includes('/batches')) return <ListSkeleton />;
  
  // Default skeleton for other pages
  return <DashboardSkeleton />;
};

const RouteBasedSkeleton = memo(() => {
  const location = useLocation();
  return getSkeletonForRoute(location.pathname);
});

RouteBasedSkeleton.displayName = 'RouteBasedSkeleton';

export default RouteBasedSkeleton;