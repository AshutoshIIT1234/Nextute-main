import { memo } from 'react';

const SkeletonBox = ({ className = "", width = "100%", height = "20px" }) => (
  <div 
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    style={{ width, height }}
  />
);

const CardSkeleton = memo(() => (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
    <SkeletonBox height="24px" width="60%" />
    <SkeletonBox height="16px" width="100%" />
    <SkeletonBox height="16px" width="80%" />
    <div className="flex space-x-2">
      <SkeletonBox height="32px" width="80px" />
      <SkeletonBox height="32px" width="80px" />
    </div>
  </div>
));

const ListSkeleton = memo(({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg">
        <SkeletonBox width="60px" height="60px" className="rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBox height="20px" width="70%" />
          <SkeletonBox height="16px" width="50%" />
        </div>
      </div>
    ))}
  </div>
));

const NavbarSkeleton = memo(() => (
  <div className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <SkeletonBox width="120px" height="32px" />
        <div className="flex space-x-4">
          <SkeletonBox width="80px" height="32px" />
          <SkeletonBox width="80px" height="32px" />
          <SkeletonBox width="100px" height="32px" />
        </div>
      </div>
    </div>
  </div>
));

const HeroSkeleton = memo(() => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <SkeletonBox height="48px" width="60%" className="mx-auto mb-6" />
      <SkeletonBox height="24px" width="80%" className="mx-auto mb-8" />
      <SkeletonBox height="48px" width="200px" className="mx-auto" />
    </div>
  </div>
));

const DashboardSkeleton = memo(() => (
  <div className="min-h-screen bg-gray-50">
    <NavbarSkeleton />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <CardSkeleton />
          <ListSkeleton count={4} />
        </div>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  </div>
));

const HomePageSkeleton = memo(() => (
  <div className="min-h-screen">
    <NavbarSkeleton />
    <HeroSkeleton />
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  </div>
));

export {
  SkeletonBox,
  CardSkeleton,
  ListSkeleton,
  NavbarSkeleton,
  HeroSkeleton,
  DashboardSkeleton,
  HomePageSkeleton
};

export default CardSkeleton;