import React from 'react';
import { motion } from 'motion/react';
import { AppScreen } from '../../types';
import { BrandPattern } from './BrandPattern';

export const FloatingNavBar: React.FC<{ currentScreen: AppScreen, onNavigate: (screen: AppScreen) => void }> = ({ currentScreen, onNavigate }) => {
  const handleNavigate = (screen: AppScreen) => {
    onNavigate(screen);
  };

  return (
    <div className="md:hidden fixed bottom-2 left-0 right-0 flex justify-center px-4 pointer-events-none z-50 font-sans">
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="glass rounded-full px-6 py-3 flex items-center justify-between w-full max-w-[360px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] relative pointer-events-auto border border-white/40"
      >
        
        {/* Home */}
        <div 
          onClick={() => handleNavigate(AppScreen.HOME)}
          className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95 relative z-10 w-12"
        >
          <svg className="transition-colors duration-300" width="24" height="24" viewBox="0 0 24 24" fill={currentScreen === AppScreen.HOME ? "currentColor" : "none"} stroke={currentScreen === AppScreen.HOME ? "#00D54B" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className={`text-[10px] font-bold transition-colors duration-300 ${currentScreen === AppScreen.HOME ? 'text-primary' : 'text-gray-400'}`}>Home</span>
        </div>

        {/* Coin */}
        <div 
          onClick={() => handleNavigate(AppScreen.COIN_DETAIL)}
          className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95 relative z-10 w-12"
        >
          <svg className="transition-colors duration-300" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={currentScreen === AppScreen.COIN_DETAIL ? "#00D54B" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v8M8 12h8"></path>
          </svg>
          <span className={`text-[10px] font-bold transition-colors duration-300 ${currentScreen === AppScreen.COIN_DETAIL ? 'text-primary' : 'text-gray-400'}`}>Coin</span>
        </div>

        {/* Center Action Button (Send) */}
        <div 
          onClick={() => handleNavigate(AppScreen.SEND_DESTINATION)}
          className="relative cursor-pointer group -mt-8 transition-transform active:scale-95 z-10"
        >
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-white text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </div>
        </div>

        {/* History */}
        <div 
          onClick={() => handleNavigate(AppScreen.TRANSACTION_HISTORY)}
          className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95 relative z-10 w-12"
        >
          <svg className="transition-colors duration-300" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={currentScreen === AppScreen.TRANSACTION_HISTORY ? "#00D54B" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
          <span className={`text-[10px] font-bold transition-colors duration-300 ${currentScreen === AppScreen.TRANSACTION_HISTORY ? 'text-primary' : 'text-gray-400'}`}>History</span>
        </div>

        {/* More */}
        <div 
          onClick={() => handleNavigate(AppScreen.ME)}
          className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95 relative z-10 w-12"
        >
          <svg className="transition-colors duration-300" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={currentScreen === AppScreen.ME ? "#00D54B" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
          <span className={`text-[10px] font-bold transition-colors duration-300 ${currentScreen === AppScreen.ME ? 'text-primary' : 'text-gray-400'}`}>More</span>
        </div>

      </motion.div>
    </div>
  );
};
