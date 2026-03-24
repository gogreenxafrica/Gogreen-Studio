import React from 'react';
import { AppScreen } from '../types';
import { Logo } from './Logo';
import { BrandPattern } from '../src/components/BrandPattern';

interface NavbarProps {
  id?: string;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const Navbar = ({ id, currentScreen, onNavigate }: NavbarProps) => {
  const tabs = [
    { id: AppScreen.HOME, label: 'Home', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { id: AppScreen.COIN_DETAIL, label: 'Coin', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v8M8 12h8"></path>
      </svg>
    )},
    { id: AppScreen.SEND_DESTINATION, label: 'Send', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    )},
    { id: AppScreen.TRANSACTION_HISTORY, label: 'History', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3"></path>
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    )},
    { id: AppScreen.ME, label: 'More', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
    )}
  ];

  return (
    <div id={id}>
      {/* Tablet Left Sidebar (md:flex lg:hidden) */}
      <div className="hidden md:flex lg:hidden fixed top-0 left-0 bottom-0 w-64 glass border-r border-white/10 flex-col py-8 z-40 overflow-hidden">
        <BrandPattern opacity={0.03} size={40} animate={true} color="primary" className="absolute inset-0 pointer-events-none" />
        <div className="px-8 mb-12 relative z-10">
           <Logo className="w-32 h-10" variant="premium" />
        </div>
        
        <div className="flex-1 flex flex-col gap-2 px-4 relative z-10">
           {tabs.map((tab) => {
             const isActive = currentScreen === tab.id;
             // Use scanner icon for desktop list, standard button look
             const color = isActive ? '#FFFFFF' : '#9CA3AF';
             const bgClass = isActive ? 'bg-primary shadow-md shadow-primary/20' : 'hover:bg-gray-50';
             
             return (
                <button 
                  key={tab.id} 
                  onClick={() => onNavigate(tab.id)} 
                  className={`flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-200 group relative overflow-hidden ${bgClass}`}
                >
                  {isActive && (
                    <BrandPattern opacity={0.15} size={24} animate={true} color="white" className="absolute inset-0 pointer-events-none" />
                  )}
                  <div className={`relative z-10 w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    {tab.icon ? tab.icon(color) : (
                      // Fallback icon for scanner in sidebar list
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M9 7h6m-6 4h6m-6 4h6" /></svg>
                    )}
                  </div>
                  <span className={`relative z-10 text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>
                    {tab.label}
                  </span>
                  {isActive && <div className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
             );
           })}
        </div>

        <div className="px-8 relative z-10">
           <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Need Help?</p>
              <button className="text-xs font-bold text-primary flex items-center gap-2">
                 Contact Support 
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
              </button>
           </div>
        </div>
      </div>

      {/* Desktop Top Navigation (hidden lg:flex) */}
      <div className="hidden lg:flex fixed top-0 left-0 right-0 h-20 glass border-b border-white/10 items-center px-8 z-40 justify-between bg-white/80 backdrop-blur-xl overflow-hidden">
        <BrandPattern opacity={0.03} size={40} animate={true} color="primary" className="absolute inset-0 pointer-events-none" />
        <div className="flex items-center gap-12 relative z-10">
           <Logo className="w-32 h-10" variant="premium" />
           
           <div className="flex items-center gap-2">
              {tabs.map((tab) => {
                const isActive = currentScreen === tab.id;
                const color = isActive ? '#FFFFFF' : '#6B7280';
                const bgClass = isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900';
                
                return (
                   <button 
                     key={tab.id} 
                     onClick={() => onNavigate(tab.id)} 
                     className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden ${bgClass}`}
                   >
                     {isActive && (
                       <BrandPattern opacity={0.15} size={24} animate={true} color="white" className="absolute inset-0 pointer-events-none" />
                     )}
                     <div className="relative z-10 w-5 h-5">
                       {tab.icon ? tab.icon(color) : (
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M9 7h6m-6 4h6m-6 4h6" /></svg>
                       )}
                     </div>
                     <span className="relative z-10 text-sm font-bold tracking-tight">
                       {tab.label}
                     </span>
                   </button>
                );
              })}
           </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-gray-500 rounded-full border border-white"></div>
           </button>
           
           <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
           
           <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate(AppScreen.ME)}>
              <div className="text-right hidden xl:block">
                 <p className="text-sm font-bold text-gray-900">User Account</p>
                 <p className="text-[10px] font-medium text-gray-500">Verified</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20">
                 ME
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
