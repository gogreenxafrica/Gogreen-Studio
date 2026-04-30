import React from 'react';
import { useAppContext } from '../../AppContext';

export const BackHeader = ({ title, subtitle, onBack, theme = 'light', onHome, className, hideBack }: { title: string, subtitle?: string, onBack?: () => void, theme?: 'light' | 'dark', onHome?: () => void, className?: string, hideBack?: boolean }) => {
  const { goBack } = useAppContext();
  
  return (
    <header className={`px-4 pt-6 pb-8 sticky top-0 z-20 flex flex-col w-full max-w-full box-border overflow-x-hidden header-integrated ${className || ''}`}>
      <div className="flex items-center w-full">
        {!hideBack && (
          <button 
            onClick={onBack || onHome || goBack} 
            className={`w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-all ${theme === 'dark' ? 'bg-white/10 text-white border border-white/10 backdrop-blur-md' : 'bg-white text-gray-600 border border-gray-100 shadow-sm hover:bg-gray-50'}`}
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        <div className="flex-1 text-center">
          <h1 className={`font-bold tracking-tight text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
          {subtitle && <p className={`text-[8px] font-black uppercase tracking-[0.2em] mt-0.5 ${theme === 'dark' ? 'text-white/40' : 'text-primary/60'}`}>{subtitle}</p>}
        </div>
        <div className="w-9"></div>
      </div>
    </header>
  );
};
