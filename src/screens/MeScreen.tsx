import React, { useState } from 'react';
import { useAppContext } from '../../AppContext';
import { AppScreen, SignupData } from '../../types';
import { Icons } from '../../components/Icons';
import { getAvatarUrl } from '../constants/avatars';
import { BottomSheet } from '../../components/BottomSheet';

interface MeScreenProps {
  signupData: SignupData;
  walletBalance: number;
  pendingBalance: number;
  onNavigate: (screen: AppScreen) => void;
  hideBalance: boolean;
}

export const MeScreen: React.FC<MeScreenProps> = ({
  signupData,
  walletBalance,
  pendingBalance,
  onNavigate,
  hideBalance
}) => {
  const { setGlobalOverlay, setSupportInitialView, setIsSupportOpen, kycData } = useAppContext();
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const meItems = [
    { icon: <Icons.User />, label: 'Account Information', desc: 'Personal info, Username', screen: AppScreen.EDIT_PROFILE },
    { icon: <Icons.Bank />, label: 'Default Bank', desc: 'For automatic withdrawals', screen: AppScreen.BANK_DETAILS },
    { icon: <Icons.Coin />, label: 'Payment Settings', desc: 'Auto-withdrawal preference', screen: AppScreen.PAYMENT_SETTINGS },
    { icon: <Icons.Cog />, label: 'Account Settings', desc: 'Limits', screen: AppScreen.ACCOUNT_SETTINGS },
    { icon: <Icons.Shield />, label: 'Security', desc: 'Biometrics, Transaction PIN', screen: AppScreen.SECURITY },
    { icon: <Icons.Gift />, label: 'Reward', desc: 'Refer a friend', screen: AppScreen.REFERRAL },
    { icon: <Icons.Moon />, label: 'Dark Mode', desc: 'Toggle theme', screen: null, isComingSoon: true },
    { 
      icon: <Icons.Headphones />, 
      label: 'Help & Support', 
      desc: 'Guides, FAQs & Support', 
      screen: AppScreen.SUPPORT, 
      isGlobal: false,
      onClick: () => setSupportInitialView('HELP_CENTER'),
      isComingSoon: true
    },
    { icon: <Icons.Bulb />, label: 'Suggestion Box', desc: 'Help us improve', screen: AppScreen.SUGGESTION_BOX },
    { icon: <Icons.Star />, label: 'Rate Us', desc: 'On App Store', screen: null },
    { icon: <Icons.Bug />, label: 'Report a Bug', desc: 'Fix issues', screen: AppScreen.REPORT_BUG },
    { icon: <Icons.Refresh />, label: 'App Update', desc: 'Version 1.0.4', screen: AppScreen.APP_UPDATE },
    { icon: <Icons.LogOut />, label: 'Log Out', desc: 'Sign out of device', screen: AppScreen.WELCOME_BACK, color: 'text-red-500' },
    { icon: <Icons.Trash />, label: 'Delete Account', desc: 'Permanent removal', screen: AppScreen.DELETE_ACCOUNT, color: 'text-red-500' }
  ];

  return (
    <div className="flex-1 h-full flex flex-col bg-green-50/30 animate-fade-in overflow-hidden relative">
        {/* 1. FIXED TOP CONTAINER (Profile Header) */}
        <div className="bg-white/80 backdrop-blur-md relative overflow-hidden pt-4 flex-shrink-0 z-20 sticky top-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          
          <div className="w-full mx-auto px-6 pt-8 pb-6 md:pb-8 relative z-10">
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100">
                    <img src={signupData.profileImage || getAvatarUrl(signupData.username)} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">{signupData.fullName || "User"}</h3>
                      {kycData.status === 'VERIFIED' && <Icons.ShieldCheck className="w-6 h-6 text-blue-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">₦{(signupData.username || "USER").replace(/^[@₦]+/, '')}</span>
                    </div>
                  </div>
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2">
                  <div className="flex items-center gap-1.5">
                    {kycData.status === 'VERIFIED' || kycData.status === 'PENDING' ? (
                      <Icons.CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${kycData.status === 'VERIFIED' || kycData.status === 'PENDING' ? 'text-gray-700' : 'text-gray-400'}`}>Email</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {kycData.status === 'VERIFIED' || kycData.status === 'PENDING' ? (
                      <Icons.CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${kycData.status === 'VERIFIED' || kycData.status === 'PENDING' ? 'text-gray-700' : 'text-gray-400'}`}>Phone</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {kycData.status === 'VERIFIED' ? (
                      <Icons.CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${kycData.status === 'VERIFIED' ? 'text-gray-700' : 'text-gray-400'}`}>Identity</span>
                  </div>
                </div>
             </div>
          </div>
       </div>

       {/* 2. SEPARATE SCROLLABLE WIDGET (Settings List) */}
       <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth min-h-0">
         <div className="px-4 pt-0 pb-24 w-full space-y-2">
            {kycData.status !== 'VERIFIED' && (
              <div className="px-1 mb-2 md:mb-4">
                <div className="relative cursor-pointer group" onClick={() => setIsKycModalOpen(true)}>
                  {/* Back card 2 */}
                  <div className="absolute top-0 left-6 right-6 h-12 bg-gray-100/60 rounded-t-[24px] -mt-3 transition-all group-hover:-mt-4"></div>
                  {/* Back card 1 */}
                  <div className="absolute top-0 left-3 right-3 h-12 bg-gray-100 rounded-t-[24px] -mt-1.5 transition-all group-hover:-mt-2"></div>
                  
                  {/* Main card */}
                  <div className="relative bg-white rounded-[24px] px-4 py-3.5 md:px-6 md:py-5 flex items-center justify-between border border-gray-100 z-10">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center shrink-0">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#86d993" stroke="#86d993" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                          <path d="m9 12 2 2 4-4" stroke="#064e3b" strokeWidth="3" fill="none" />
                        </svg>
                      </div>
                      <span className="font-bold text-gray-700 text-[14px] md:text-[16px] truncate">Complete your kyc</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-100 group-hover:bg-gray-200 transition-colors px-3 py-1.5 md:px-4 md:py-2 rounded-full shrink-0 ml-2">
                      <span className="text-[12px] md:text-[14px] font-bold text-gray-700">Verify</span>
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gray-300/80 flex items-center justify-center">
                        <Icons.ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-[24px] p-1.5 border border-gray-100 shadow-sm overflow-hidden">
               {meItems.map((item: any, i) => (
                  <div key={i} onClick={() => {
                      if (item.isComingSoon) return;
                      if (item.onClick) item.onClick();
                      if (item.isGlobal) {
                          setGlobalOverlay(item.screen);
                      } else if (item.screen) {
                          onNavigate(item.screen);
                      }
                  }} className={`p-2.5 flex items-center gap-3 ${item.isComingSoon ? 'cursor-default opacity-40 blur-[1.2px]' : 'cursor-pointer active:bg-gray-50'} transition-all rounded-[18px] group ${i !== meItems.length - 1 ? 'mb-1' : ''}`}>
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${!item.isComingSoon && 'group-hover:scale-105 group-hover:rotate-2'} shadow-sm ${item.color ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <div className="w-4.5 h-4.5">
                           {item.icon}
                        </div>
                     </div>
                     <div className="flex-1">
                        <h4 className={`font-black text-[12px] tracking-tight ${item.color || 'text-gray-900'}`}>{item.label}</h4>
                        <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest mt-0.5 opacity-60">{item.desc}</p>
                     </div>
                     {item.label === 'Dark Mode' ? (
                        <div className="w-12 h-6 rounded-full bg-gray-200 relative shrink-0">
                           <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm"></div>
                        </div>
                     ) : (
                        <div className={`w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 ${!item.isComingSoon && 'group-hover:bg-primary/10 group-hover:text-primary group-hover:translate-x-1'} transition-all shrink-0`}>
                           <Icons.ChevronRight className="w-4 h-4" />
                        </div>
                     )}
                  </div>
               ))}
            </div>
       </div>
    </div>

    <BottomSheet isOpen={isKycModalOpen} onClose={() => setIsKycModalOpen(false)} title="Verification">
      <div className="p-4 w-full space-y-4 pb-24">
        <div className="bg-white rounded-[40px] p-2 border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden relative">
          
          {/* Top Section */}
          <div className="relative p-6 pb-12 rounded-[32px] bg-white mb-2 overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
                  {[kycData.bvn, kycData.nin, kycData.selfie].filter(Boolean).length}/3
                </h2>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-500 mt-3">
                  {kycData.status === 'PENDING' ? 'Verification Pending' : 'Active Tasks'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                <Icons.ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            
            {/* Green Glow at the bottom of the top section */}
            <div className="absolute -bottom-12 left-0 right-0 h-40 bg-gradient-to-t from-green-500/40 via-green-400/20 to-transparent blur-2xl pointer-events-none"></div>
          </div>

          {/* List Section */}
          <div className="space-y-1 relative z-10">
            {[
              { label: 'BVN Verification', completed: !!kycData.bvn, screen: AppScreen.KYC_BVN },
              { label: 'NIN Verification', completed: !!kycData.nin, screen: AppScreen.KYC_NIN },
              { label: 'Selfie Verification', completed: !!kycData.selfie, screen: AppScreen.KYC_SELFIE },
            ].map((task, i) => (
              <div 
                key={i} 
                onClick={() => {
                  if (task.completed) return;
                  setIsKycModalOpen(false);
                  if (kycData.status === 'PENDING') {
                    onNavigate(AppScreen.KYC_SUCCESS);
                  } else {
                    onNavigate(task.screen);
                  }
                }}
                className={`flex items-center gap-4 p-4 rounded-[28px] ${task.completed ? 'bg-gray-50/50 cursor-default' : 'bg-gray-50/80 hover:bg-gray-100 cursor-pointer'} transition-all group border border-transparent hover:border-gray-200`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200'}`}>
                  {task.completed && <Icons.Check className="w-3.5 h-3.5" />}
                </div>
                <span className={`flex-1 text-[13px] font-black tracking-tight ${task.completed ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-900'}`}>
                  {task.label}
                </span>
                {!task.completed && <Icons.ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  </div>
);
};
