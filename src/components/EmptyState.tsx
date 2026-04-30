import React from 'react';
import { motion } from 'motion/react';
import { Icons } from './Icons';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  action,
  className = "" 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      <div className="w-20 h-20 rounded-[32px] bg-gray-50 flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-primary/5 rounded-[32px] animate-pulse"></div>
        {icon || <Icons.Search className="w-8 h-8 text-gray-300 relative z-10" />}
      </div>
      
      <h3 className="text-lg font-black text-gray-900 tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-[13px] text-gray-500 font-medium max-w-[240px] leading-relaxed mb-8">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="px-8 h-12 bg-primary text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};
