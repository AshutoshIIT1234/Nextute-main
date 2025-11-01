import { memo } from 'react';

// Minimal skeleton for instant loading
const InstantSkeleton = memo(() => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
));

// Login page skeleton
const LoginSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md animate-pulse">
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-10 bg-blue-200 rounded"></div>
      </div>
    </div>
  </div>
));

// Dashboard skeleton
const DashboardSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50">
    {/* Navbar skeleton */}
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32"></div>
          <div className="flex space-x-4">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Content skeleton */}
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

// List skeleton for institutes/teachers/batches
const ListSkeleton = memo(() => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
));

// Form skeleton
const FormSkeleton = memo(() => (
  <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="h-10 bg-blue-200 rounded w-32"></div>
    </div>
  </div>
));

// Card grid skeleton
const CardGridSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    ))}
  </div>
));

InstantSkeleton.displayName = 'InstantSkeleton';
LoginSkeleton.displayName = 'LoginSkeleton';
DashboardSkeleton.displayName = 'DashboardSkeleton';
ListSkeleton.displayName = 'ListSkeleton';
FormSkeleton.displayName = 'FormSkeleton';
CardGridSkeleton.displayName = 'CardGridSkeleton';

export {
  InstantSkeleton,
  LoginSkeleton,
  DashboardSkeleton,
  ListSkeleton,
  FormSkeleton,
  CardGridSkeleton
};

export default InstantSkeleton;