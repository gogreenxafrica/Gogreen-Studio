
import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = "h-4 w-full" }) => (
  <div className={`bg-accent/20 animate-pulse rounded-card ${className}`} />
);

export const SkeletonScreen: React.FC<{ type?: 'home' | 'transactions' | 'rewards' | 'profile' | 'list' }> = ({ type = 'list' }) => {
  const containerStyles = "flex flex-col gap-8 p-6 h-full w-full max-w-md mx-auto bg-white overflow-hidden";
  
  if (type === 'home') {
    return (
      <div className={containerStyles}>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Skeleton className="h-44 w-full rounded-card" />
        <Skeleton className="h-24 w-full rounded-card" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'transactions') {
    return (
      <div className={containerStyles}>
        <div className="flex flex-col items-center gap-2">
           <Skeleton className="h-8 w-40" />
           <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-50">
           <Skeleton className="w-16 h-16 rounded-full" />
           <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (type === 'rewards') {
    return (
      <div className={containerStyles}>
        <div className="flex flex-col items-center gap-2">
           <Skeleton className="h-8 w-40" />
           <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-56 w-full rounded-card" />
        <div className="space-y-4">
           <Skeleton className="h-20 w-full rounded-card" />
           <Skeleton className="h-20 w-full rounded-card" />
        </div>
      </div>
    );
  }

  if (type === 'profile') {
    return (
      <div className={containerStyles}>
        <div className="flex items-center gap-6 mt-4">
           <Skeleton className="w-20 h-20 rounded-[24px]" />
           <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-20" />
           </div>
        </div>
        <div className="space-y-4 mt-8">
           {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-card" />)}
        </div>
        <div className="mt-auto flex justify-center">
           <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  // Default List / Coin Selection style
  return (
    <div className={containerStyles}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-40" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex gap-4 items-center p-4 border border-accent/20 rounded-card">
            <Skeleton className="h-12 w-12 rounded-xl" />
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
