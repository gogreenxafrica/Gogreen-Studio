
import React from 'react';
import { AppScreen } from '../types';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: AppScreen.HOME, label: 'Home', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { id: AppScreen.TRANSACTIONS, label: 'History', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { id: AppScreen.REWARDS, label: 'Rewards', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
    )},
    { id: AppScreen.PROFILE, label: 'Profile', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )}
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#D4D3D3]/30 flex justify-around items-center py-4 z-40 max-w-md mx-auto rounded-t-[1.5rem]">
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.id;
        const color = isActive ? '#2DA437' : '#D4D3D3';
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)} className="flex flex-col items-center gap-1 transition-all active:scale-90">
            {tab.icon(color)}
            <span className={`text-[10px] font-bold tracking-widest ${isActive ? 'text-[#2DA437]' : 'text-[#D4D3D3]'}`}>
              {tab.label.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  );
};
