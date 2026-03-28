import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';

interface UnderReviewScreenProps {
  title?: string;
  message?: string;
  onBackToHome: () => void;
}

export const UnderReviewScreen: React.FC<UnderReviewScreenProps> = ({ 
  title = "Under review", 
  message = "Your request is almost ready. Please look out for a notification with the status update.",
  onBackToHome 
}) => {
  return (
    <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center justify-center px-8 text-center">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Hourglass 3D Asset Placeholder */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-48 h-48 mb-8 relative"
        >
          <img 
            src="https://cdn3d.iconscout.com/3d/premium/thumb/hourglass-4035911-3342589.png" 
            alt="Under Review" 
            className="w-full h-full object-contain animate-float"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <h2 className="text-2xl font-black text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 font-bold leading-relaxed mb-12">
          {message}
        </p>

        <Button 
          onClick={onBackToHome}
          className="px-12 !bg-primary !text-white !rounded-2xl shadow-lg shadow-primary/20"
        >
          Back to home
        </Button>
      </div>
    </div>
  );
};
