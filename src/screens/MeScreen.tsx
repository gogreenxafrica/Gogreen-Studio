import React from 'react';
import { useAppContext } from '../../AppContext';
import { AppScreen, SignupData } from '../../types';
import { Icons } from '../../components/Icons';
import { getAvatarUrl } from '../constants/avatars';

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
  const meSections = [
    ...(kycData.status !== 'VERIFIED' ? [{
      title: 'Verification',
      items: [
        { 
          icon: <Icons.ShieldCheck />, 
          label: kycData.status === 'PENDING' ? 'Verification Pending' : 'Verify Identity', 
          desc: kycData.status === 'PENDING' ? 'Under review' : 'BVN, NIN & Selfie', 
          screen: kycData.status === 'PENDING' ? AppScreen.KYC_SUCCESS : AppScreen.KYC_INTRO,
          color: kycData.status === 'PENDING' ? 'text-orange-500' : 'text-primary'
        },
      ]
    }] : []),
    {
      title: 'Account',
      items: [
        { icon: <Icons.User />, label: 'Edit Profile', desc: 'Personal info, Username', screen: AppScreen.EDIT_PROFILE },
        { icon: <Icons.Bank />, label: 'Default Bank', desc: 'For automatic withdrawals', screen: AppScreen.BANK_DETAILS },
        { icon: <Icons.Coin />, label: 'Payment Settings', desc: 'Auto-withdrawal preference', screen: AppScreen.PAYMENT_SETTINGS },
        { icon: <Icons.Cog />, label: 'Account Settings', desc: 'Limits', screen: AppScreen.ACCOUNT_SETTINGS },
      ]
    },
    {
      title: 'Security',
      items: [
        { icon: <Icons.Shield />, label: 'Security', desc: 'Biometrics, Transaction PIN', screen: AppScreen.SECURITY },
      ]
    },
    {
      title: 'Community',
      items: [
        { icon: <Icons.Bulb />, label: 'Suggestion Box', desc: 'Help us improve', screen: AppScreen.SUGGESTION_BOX },
        { icon: <Icons.RealRocket />, label: 'Refer a Friend', desc: 'Earn rewards', screen: AppScreen.REFER_FRIEND },
        { icon: <Icons.Star />, label: 'Rate Us', desc: 'On App Store', screen: null },
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          icon: <Icons.Headphones />, 
          label: 'Help Center', 
          desc: 'Guides, FAQs & Support', 
          screen: AppScreen.SUPPORT, 
          isGlobal: false,
          onClick: () => setSupportInitialView('HELP_CENTER')
        },
        { icon: <Icons.Bug />, label: 'Report a Bug', desc: 'Fix issues', screen: AppScreen.REPORT_BUG },
        { icon: <Icons.Refresh />, label: 'App Update', desc: 'Version 1.0.4', screen: AppScreen.APP_UPDATE },
      ]
    },
    {
      title: 'Danger Zone',
      items: [
        { icon: <Icons.LogOut />, label: 'Log Out', desc: 'Sign out of device', screen: AppScreen.WELCOME_BACK, color: 'text-gray-500' },
        { icon: <Icons.Trash />, label: 'Delete Account', desc: 'Permanent removal', screen: AppScreen.DELETE_ACCOUNT, color: 'text-gray-500' }
      ]
    }
  ];

  return (
    <div className="flex-1 h-full flex flex-col bg-green-50/30 animate-fade-in overflow-hidden relative">
        {/* 1. FIXED TOP CONTAINER (Profile Header) */}
        <div className="bg-white/80 backdrop-blur-md relative overflow-hidden pt-4 flex-shrink-0 z-20 sticky top-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          
          <div className="w-full mx-auto px-6 py-8 relative z-10">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                   <div className="relative">
                     <div className="w-18 h-18 rounded-[28px] overflow-hidden bg-white border-4 border-white shadow-2xl ring-1 ring-gray-100">
                        <img src={signupData.profileImage || getAvatarUrl(signupData.username)} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
                     </div>
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">{signupData.username || "User"}</h2>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm ${
                          kycData.status === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-100' :
                          kycData.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                          'bg-red-50 text-red-700 border-red-100'
                       }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                             kycData.status === 'VERIFIED' ? 'bg-green-500 animate-pulse' :
                             kycData.status === 'PENDING' ? 'bg-orange-500 animate-pulse' :
                             'bg-red-500'
                          }`}></div>
                          {kycData.status === 'VERIFIED' ? 'Fully Verified' : kycData.status === 'PENDING' ? 'Verification Pending' : 'Unverified'}
                      </div>
                   </div>
                </div>
                
                <div></div>
             </div>
          </div>
       </div>

       {/* 2. SEPARATE SCROLLABLE WIDGET (Settings List) */}
       <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth min-h-0">
         <div className="p-4 w-full space-y-4 pb-24">
          {meSections.map((section, idx) => (
             <div key={idx} className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">{section.title}</h3>
                <div className="bg-white rounded-[40px] p-2 border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden">
                   {section.items.map((item: any, i) => (
                      <div key={i} onClick={() => {
                          if (item.onClick) item.onClick();
                          if (item.isGlobal) {
                              setGlobalOverlay(item.screen);
                          } else if (item.screen) {
                              onNavigate(item.screen);
                          }
                      }} className={`p-4 flex ${section.title === 'Verification' ? 'flex-col items-center text-center' : 'items-center gap-4'} cursor-pointer active:bg-gray-50 transition-all rounded-[28px] group ${i !== section.items.length - 1 ? 'mb-1' : ''}`}>
                         <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm ${item.color ? 'bg-gray-50 text-gray-500' : 'bg-gray-50 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'} ${section.title === 'Verification' ? 'mb-2' : ''}`}>
                            <div className="w-5 h-5">
                               {item.icon}
                            </div>
                         </div>
                         <div className={section.title === 'Verification' ? '' : 'flex-1'}>
                            <h4 className={`font-black text-[13px] tracking-tight ${item.color || 'text-gray-900'}`}>{item.label}</h4>
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5 opacity-60">{item.desc}</p>
                         </div>
                         <div className={section.title === 'Verification' ? 'hidden' : 'w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0'}>
                            {section.title !== 'Verification' && <Icons.ChevronRight className="w-4 h-4" />}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          ))}
       </div>
    </div>
  </div>
);
};
