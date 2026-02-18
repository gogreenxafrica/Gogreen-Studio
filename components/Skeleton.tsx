
import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = "h-4 w-full" }) => (
  <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />
);

export const SkeletonScreen: React.FC<{ type?: 'home' | 'list' }> = ({ type = 'list' }) => {
  if (type === 'home') {
    return (
      <div className="flex flex-col gap-6 p-6 h-full w-full max-w-md mx-auto bg-white">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 p-6 h-full w-full max-w-md mx-auto bg-white">
      <Skeleton className="h-10 w-32" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
