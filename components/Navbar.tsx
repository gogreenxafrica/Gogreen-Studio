
import React from 'react';
import { AppScreen } from '../types';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: AppScreen.HOME, label: 'Home', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { id: AppScreen.PAY_BILLS, label: 'Pay bills', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    )},
    { id: AppScreen.SCANNER, label: '', isScanner: true },
    { id: AppScreen.REWARDS, label: 'Rewards', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
    )},
    { id: AppScreen.ME, label: 'Me', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )}
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-accent/20 flex justify-between items-center px-4 pb-8 pt-4 z-40 max-w-md mx-auto rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      {tabs.map((tab, idx) => {
        if (tab.isScanner) {
          return (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} className="relative -top-10 transition-transform active:scale-90">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/30 border-4 border-white">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M9 7h6m-6 4h6m-6 4h6" />
                </svg>
              </div>
            </button>
          );
        }

        const isActive = currentScreen === tab.id;
        const color = isActive ? '#2DA437' : '#D4D3D3';
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)} className="flex flex-col items-center gap-1 w-16 transition-all active:scale-90">
            {tab.icon && tab.icon(color)}
            <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'text-primary' : 'text-accent'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
