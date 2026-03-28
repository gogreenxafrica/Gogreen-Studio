import React from 'react';
import { motion } from 'motion/react';

export const SecurityAnalytics: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden relative group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Security Rating</h3>
          <p className="text-[10px] font-bold text-gray-400 mt-1">Real-time account protection</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-100">
          98.4% SAFE
        </div>
      </div>

      <div className="h-32 w-full relative flex items-end gap-1">
        {[40, 55, 45, 60, 75, 65, 85, 70, 90, 80, 95, 88].map((height, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
            className={`flex-1 rounded-t-sm ${i === 10 ? 'bg-primary' : 'bg-gray-100 group-hover:bg-gray-200'} transition-colors`}
          />
        ))}
        
        {/* Overlay Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
           <motion.path 
             d="M0,100 Q50,80 100,60 T200,40 T300,70 T400,20" 
             fill="none" 
             stroke="rgba(16, 185, 129, 0.2)" 
             strokeWidth="2"
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 2 }}
           />
        </svg>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">History</span>
          </div>
        </div>
        <span className="text-[10px] font-black text-gray-900">MAR 2026</span>
      </div>
    </div>
  );
};
