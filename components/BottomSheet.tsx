import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icons } from './Icons';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, children, title }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-white/60 backdrop-blur-sm z-40"
        />
      )}
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 40, stiffness: 300, mass: 1 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[40px] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
          style={{ willChange: 'transform' }}
        >
          {/* Header (Optional) */}
          {title && (
            <div className="px-6 py-4 flex justify-between items-center border-b border-brand-gray">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">{title}</h3>
              <button onClick={onClose} className="p-2 bg-brand-gray/20 rounded-full hover:bg-brand-gray/40 transition-colors">
                <Icons.X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
