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
