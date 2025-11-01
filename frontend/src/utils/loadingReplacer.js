// Utility to replace all loading states with skeletons
import { 
  DashboardSkeleton, 
  LoginSkeleton, 
  ListSkeleton, 
  FormSkeleton, 
  CardGridSkeleton 
} from '../components/InstantSkeletons';

// Map loading contexts to appropriate skeletons
export const getSkeletonForContext = (context = 'default') => {
  const skeletonMap = {
    dashboard: DashboardSkeleton,
    login: LoginSkeleton,
    list: ListSkeleton,
    form: FormSkeleton,
    cards: CardGridSkeleton,
    default: DashboardSkeleton
  };
  
  const SkeletonComponent = skeletonMap[context] || skeletonMap.default;
  return SkeletonComponent;
};

// Replace loading spinner with skeleton
export const useSkeletonLoader = (isLoading, context = 'default') => {
  if (!isLoading) return null;
  
  const SkeletonComponent = getSkeletonForContext(context);
  return SkeletonComponent;
};

export default getSkeletonForContext;