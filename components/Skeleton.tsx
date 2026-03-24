import React from 'react';
import { motion } from 'motion/react';

export const Skeleton = ({ className = "h-4 w-full" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-accent/60 ${className}`}>
    <motion.div
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
    />
    <div className="absolute inset-0 bg-accent animate-pulse" />
  </div>
);

export const SkeletonScreen = ({ type = 'list' }: { type?: 'home' | 'transactions' | 'rewards' | 'profile' | 'list' }) => {
  const containerStyles = "flex flex-col h-full w-full animate-fade-in";
  
  if (type === 'home') {
    return (
      <div className={containerStyles}>
        {/* Header Section */}
        <div className="px-6 pt-10 pb-6 flex justify-between items-center">
          <div className="flex flex-col gap-2">
             <Skeleton className="h-3 w-20 rounded-full opacity-60" />
             <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-[18px]" />
          </div>
        </div>

        <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <div className="w-full p-8 rounded-[36px] bg-surface border border-line flex flex-col items-center gap-6 shadow-sm">
               <Skeleton className="h-3 w-24 rounded-full opacity-50" />
               <Skeleton className="h-10 w-48 rounded-xl" />
               <Skeleton className="h-6 w-32 rounded-full opacity-40" />
               <div className="flex gap-4 w-full mt-2">
                  <Skeleton className="h-14 flex-1 rounded-[24px]" />
                  <Skeleton className="h-14 flex-1 rounded-[24px]" />
               </div>
            </div>

            {/* Banner Carousel */}
            <div className="flex gap-4 overflow-hidden">
               <Skeleton className="h-44 w-[85%] shrink-0 rounded-[32px]" />
               <Skeleton className="h-44 w-[10%] shrink-0 rounded-l-[32px]" />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
             {/* Recent Transactions List */}
             <div className="flex justify-between items-center px-2">
               <Skeleton className="h-4 w-32 rounded-full" />
               <Skeleton className="h-3 w-16 rounded-full" />
             </div>
             <div className="space-y-3">
               {[1, 2, 3, 4, 5].map(i => (
                 <div key={i} className="p-4 bg-surface rounded-[24px] flex items-center gap-4 border border-line shadow-sm">
                   <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                   <div className="flex-1 space-y-2">
                     <div className="flex justify-between">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-4 w-20 rounded-md" />
                     </div>
                     <div className="flex justify-between">
                        <Skeleton className="h-3 w-32 rounded-md opacity-60" />
                        <Skeleton className="h-3 w-12 rounded-full opacity-60" />
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Generic List View
  if (type === 'transactions' || type === 'list') {
    return (
      <div className={containerStyles}>
        <div className="px-6 py-6 sticky top-0 z-20 flex items-center">
           <Skeleton className="w-10 h-10 rounded-full shrink-0" />
           <div className="flex-1 flex flex-col items-center pr-10 gap-1">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-3 w-20 rounded-md opacity-60" />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-10 space-y-4">
           {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="p-5 bg-surface rounded-[28px] flex items-center gap-4 border border-line shadow-sm">
                 <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
                 <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                       <Skeleton className="h-4 w-24 rounded-md" />
                       <div className="flex flex-col items-end gap-1">
                          <Skeleton className="h-4 w-20 rounded-md" />
                          <Skeleton className="h-2 w-16 rounded-md opacity-60" />
                       </div>
                    </div>
                    <div className="flex justify-between items-center">
                       <Skeleton className="h-3 w-28 rounded-md opacity-60" />
                       <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    );
  }

  // Rewards View
  if (type === 'rewards') {
    return (
      <div className={containerStyles}>
        <div className="p-8 rounded-b-[40px] bg-surface border-b border-line shadow-sm flex flex-col gap-6 relative overflow-hidden mb-6">
            <div className="flex justify-between items-center">
               <Skeleton className="h-6 w-32 rounded-md" />
               <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex items-end gap-2">
               <Skeleton className="h-12 w-40 rounded-xl" />
               <Skeleton className="h-6 w-10 rounded-md mb-2" />
            </div>
            <Skeleton className="h-3 w-32 rounded-full opacity-50" />
            <div className="flex gap-4 mt-2">
               <Skeleton className="h-10 w-24 rounded-[18px]" />
               <Skeleton className="h-10 w-24 rounded-[18px]" />
            </div>
        </div>

        <div className="px-6 space-y-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="p-6 bg-surface rounded-[32px] border border-line shadow-sm">
              <Skeleton className="w-12 h-12 rounded-2xl mb-4" />
              <Skeleton className="h-6 w-48 rounded-md mb-2" />
              <Skeleton className="h-3 w-full max-w-[200px] rounded-md mb-4 opacity-60" />
              <Skeleton className="h-12 w-full rounded-xl" />
           </div>

           <div className="flex gap-4 overflow-hidden">
              <Skeleton className="h-32 w-56 shrink-0 rounded-[28px]" />
              <Skeleton className="h-32 w-56 shrink-0 rounded-[28px]" />
           </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className={containerStyles}>
      <div className="px-6 py-8 border-b border-line bg-surface">
         <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-20 h-20 rounded-[28px]" />
            <div className="flex-1 space-y-2">
               <Skeleton className="h-8 w-40 rounded-lg" />
               <Skeleton className="h-5 w-24 rounded-full" />
            </div>
         </div>
      </div>
      <div className="p-6 space-y-3">
         {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-4 bg-surface rounded-[24px] border border-line flex items-center gap-4">
               <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
               <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md opacity-60" />
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};