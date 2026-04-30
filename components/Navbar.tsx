import React from 'react';
import { AppScreen, SignupData } from '../types';
import { Logo } from './Logo';
import { BrandPattern } from '../src/components/BrandPattern';
import { getAvatarUrl } from '../src/constants/avatars';
import { Icons } from './Icons';

interface NavbarProps {
  id?: string;
  currentScreen: AppScreen;
  activeTab: AppScreen;
  onNavigate: (screen: AppScreen, isFromNavBar?: boolean) => void;
  user: SignupData;
  hasUnreadNotifications: boolean;
}

export const Navbar = ({ id, currentScreen, activeTab, onNavigate, user, hasUnreadNotifications }: NavbarProps) => {
  const tabs = [
    { id: AppScreen.HOME, label: 'Home', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )},
    { id: AppScreen.SERVICES, label: 'Services', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    )},
    { id: AppScreen.TRANSACTION_HISTORY, label: 'History', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8v4l3 3"></path>
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    )},
    { id: AppScreen.CHAT, label: 'Chat', icon: (color: string) => (
      <svg className="w-6 h-6" fill="none" stroke={color} strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
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
           <Logo className="w-32 h-10" variant="color" />
        </div>
        
        <div className="flex-1 flex flex-col gap-2 px-4 relative z-10">
           {tabs.map((tab) => {
             const isActive = activeTab === tab.id;
             // Use scanner icon for desktop list, standard button look
             const color = isActive ? '#FFFFFF' : '#9CA3AF';
             const bgClass = isActive ? 'bg-primary shadow-md shadow-primary/20' : 'hover:bg-gray-50';
             
             return (
                <button 
                  key={tab.id} 
                  onClick={() => onNavigate(tab.id, true)} 
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
              <button 
                onClick={() => onNavigate(AppScreen.SUPPORT, false)}
                className="text-xs font-bold text-primary flex items-center gap-2"
              >
                 Contact Support 
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
              </button>
           </div>
        </div>
      </div>

      {/* Desktop Top Navigation (hidden lg:flex) */}
      <div className="hidden lg:flex fixed top-0 left-0 right-0 h-20 glass border-b border-white/10 z-40 bg-white/80 backdrop-blur-xl overflow-hidden">
        <div className="w-full h-full flex items-center px-8 justify-between relative">
          <BrandPattern opacity={0.03} size={40} animate={true} color="primary" className="absolute inset-0 pointer-events-none" />
          <div className="flex items-center gap-12 relative z-10">
             <Logo className="w-32 h-10" variant="color" />
             
             <div className="flex items-center gap-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const color = isActive ? '#FFFFFF' : '#6B7280';
                  const bgClass = isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900';
                  
                  return (
                     <button 
                       key={tab.id} 
                       onClick={() => onNavigate(tab.id, true)} 
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
            <button 
              onClick={() => onNavigate(AppScreen.NOTIFICATIONS)} 
              className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 relative active:scale-95 transition-transform hover:bg-gray-100"
            >
              <Icons.Bell className="w-5 h-5" />
              {hasUnreadNotifications && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              )}
            </button>
            
            <div 
              className="relative cursor-pointer active:scale-95 transition-transform" 
              onClick={() => onNavigate(AppScreen.ME)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100">
                <img 
                  src={user.profileImage || getAvatarUrl(user.username)} 
                  className="w-full h-full object-cover" 
                  alt="Avatar" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
