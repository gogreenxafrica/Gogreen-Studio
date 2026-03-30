import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../AppContext';
import { AppScreen, SignupData } from '../../types';
import { Icons } from '../components/Icons';
import { getAvatarUrl } from '../constants/avatars';
import { Button } from '../../components/Button';
import { PrivacyText } from '../../components/PrivacyText';
import { BottomSheet } from '../../components/BottomSheet';
import * as Constants from '../../constants';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { SecurityAnalytics } from '../components/SecurityAnalytics';

const BrandPattern = ({ size, color, animate }: { size: number, color: string, animate?: boolean }) => (
  <div className="absolute inset-0 pointer-events-none opacity-20">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="brand-pattern" x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
          <circle cx={size/2} cy={size/2} r={size/4} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#brand-pattern)" />
    </svg>
  </div>
);

interface HomeScreenProps {
  greeting: string;
  user: SignupData;
  hasUnreadNotifications: boolean;
  currency: 'NGN' | 'USD';
  setCurrency: (c: 'NGN' | 'USD') => void;
  hideBalance: boolean;
  setHideBalance: (b: boolean) => void;
  walletBalance: number;
  bonusClaimed: boolean;
  pendingBalance: number;
  onNavigate: (screen: AppScreen) => void;
  quickAccessIds: string[];
  showQuickAccessDropdown: boolean;
  setShowQuickAccessDropdown: (b: boolean) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = React.memo(({
  greeting,
  user,
  hasUnreadNotifications,
  currency,
  setCurrency,
  hideBalance,
  setHideBalance,
  walletBalance,
  bonusClaimed,
  pendingBalance,
  onNavigate,
  quickAccessIds,
  showQuickAccessDropdown,
  setShowQuickAccessDropdown,
}) => {
  const { checklist, setGlobalOverlay, setActiveModal, kycData, setGiftCardTradeType } = useAppContext();
  const allServices = Constants.ALL_SERVICES;

  const [loadingAction, setLoadingAction] = useState<AppScreen | null>(null);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  const handleActionClick = async (screen: AppScreen, isModal: boolean = false) => {
    setLoadingAction(screen);
    // Simulate a brief processing delay to show the "subtle loading indicator"
    await new Promise(resolve => setTimeout(resolve, 600));
    if (isModal) {
      setActiveModal(screen);
    }
    
    onNavigate(screen);
    
    setLoadingAction(null);
  };

  const swipeHandlers = useSwipeable({
    onSwipedDown: () => setShowQuickAccessDropdown(true),
    onSwipedUp: () => setShowQuickAccessDropdown(false),
    trackMouse: true
  });

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-in relative overflow-hidden w-full h-full min-h-0">
      
      {/* 1. FIXED TOP CONTAINER (Header) */}
      <header className="px-5 pt-6 pb-2 flex justify-between items-center w-full z-20 flex-shrink-0 sticky top-0 header-integrated">
        <div className="flex flex-col">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-0.5">{greeting} 👋</p>
            <h2 className="text-lg font-display font-bold text-gray-900 tracking-tight">{user.fullName || "User"}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate(AppScreen.NOTIFICATIONS)} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 relative active:scale-95 transition-transform shadow-sm hover:shadow-md">
            <Icons.Bell className="w-5 h-5" />
            {hasUnreadNotifications && <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>}
          </button>
          <div className="relative cursor-pointer active:scale-95 transition-transform" onClick={() => onNavigate(AppScreen.ME)}>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src={user.profileImage || getAvatarUrl(user.username)} className="w-full h-full object-cover" alt="Avatar" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. SEPARATE SCROLLABLE WIDGET (Main Content) */}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth min-h-0">
        <div className="px-5 pt-2 pb-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
            {kycData.status !== 'VERIFIED' && (
              <div className="px-1 mb-2 mt-2">
                <div className="relative cursor-pointer group" onClick={() => setIsKycModalOpen(true)}>
                  {/* Back card 2 */}
                  <div className="absolute top-0 left-6 right-6 h-12 bg-gray-100/60 rounded-t-[24px] -mt-3 transition-all group-hover:-mt-4"></div>
                  {/* Back card 1 */}
                  <div className="absolute top-0 left-3 right-3 h-12 bg-gray-100 rounded-t-[24px] -mt-1.5 transition-all group-hover:-mt-2"></div>
                  
                  {/* Main card */}
                  <div className="relative bg-white rounded-[24px] px-4 py-3.5 flex items-center justify-between shadow-sm border border-gray-100 z-10">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center shrink-0">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#86d993" stroke="#86d993" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                          <path d="m9 12 2 2 4-4" stroke="#064e3b" strokeWidth="3" fill="none" />
                        </svg>
                      </div>
                      <span className="font-bold text-gray-700 text-[14px] truncate">Complete your kyc</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-100 group-hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full shrink-0 ml-2">
                      <span className="text-[12px] font-bold text-gray-700">Verify</span>
                      <div className="w-4 h-4 rounded-full bg-gray-300/80 flex items-center justify-center">
                        <Icons.ChevronRight className="w-3 h-3 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Section - Bayfi Style */}
            <div 
              {...swipeHandlers}
              id="wallet-balance-card"
              className="px-1 mb-10"
            >
              <div className="bg-[#1a1a1a] py-8 pl-5 pr-6 rounded-[32px] text-white relative overflow-hidden shadow-2xl shadow-black/20 group">
                {/* Subtle Pattern Graphic */}
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                  <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-40 h-40 object-contain" />
                  <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-24 h-24 object-contain absolute -top-12 -left-12" />
                </div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full -ml-16 -mt-16 blur-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                      <div onClick={() => setHideBalance(!hideBalance)} className="cursor-pointer hover:text-emerald-400 transition-colors">
                        {hideBalance ? <Icons.EyeOff className="w-3.5 h-3.5 text-white/40" /> : <Icons.Eye className="w-3.5 h-3.5 text-white/40" />}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 whitespace-nowrap">Wallet Balance</p>
                    </div>
                    
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-sm ml-auto">
                      <button 
                        onClick={() => setCurrency('NGN')}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${currency === 'NGN' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white/60'}`}
                      >
                        NGN
                      </button>
                      <button 
                        className="px-3 py-1 rounded-lg text-[10px] font-black transition-all text-white/20 cursor-not-allowed relative"
                      >
                        USD
                        <span className="absolute -top-1 -right-1 bg-gray-600 text-[6px] font-black px-1 py-0.5 rounded uppercase text-white z-10 border border-gray-500 shadow-sm">Soon</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-emerald-500 font-black text-2xl">{currency === 'NGN' ? '₦' : '$'}</span>
                    <h3 className="text-4xl font-display font-black tracking-tighter text-white tabular-nums">
                      <PrivacyText hide={hideBalance}>
                        {(currency === 'NGN' ? (walletBalance + (bonusClaimed ? 3000 : 0)) : ((walletBalance + (bonusClaimed ? 3000 : 0)) / 1710)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </PrivacyText>
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Bayfi Style (Horizontal Row) */}
            <div className="px-2 mb-10">
              <div className="flex justify-between items-start">
                
                {/* Trade Giftcard */}
                <div className="flex flex-col items-center gap-3 flex-1">
                  <button 
                    onClick={() => handleActionClick(AppScreen.GIFT_CARD_TRADE_OPTIONS, true)}
                    disabled={loadingAction !== null}
                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-50 active:scale-90 transition-transform group relative"
                  >
                    {loadingAction === AppScreen.GIFT_CARD_TRADE_OPTIONS ? (
                      <Icons.Loader className="w-6 h-6 text-orange-500 animate-spin" />
                    ) : (
                      <div className="w-7 h-7 text-orange-500 group-hover:scale-110 transition-transform">
                        <Icons.Gift />
                      </div>
                    )}
                  </button>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center leading-tight">Trade<br/>Giftcard</span>
                </div>

                {/* Trade Crypto */}
                <div className="flex flex-col items-center gap-3 flex-1 relative">
                  <div className="absolute -top-1 right-2 bg-gray-100 text-[6px] font-black px-1.5 py-0.5 rounded uppercase text-gray-500 z-10 border border-gray-200 shadow-sm">Soon</div>
                  <button 
                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-50 opacity-60 cursor-not-allowed"
                  >
                    <div className="w-7 h-7 text-gray-400">
                      <Icons.Bitcoin />
                    </div>
                  </button>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">Trade<br/>Crypto</span>
                </div>

                {/* Withdraw */}
                <div className="flex flex-col items-center gap-3 flex-1">
                  <button 
                    onClick={() => handleActionClick(AppScreen.WITHDRAW_METHOD, true)}
                    disabled={loadingAction !== null}
                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-50 active:scale-90 transition-transform group relative"
                  >
                    {loadingAction === AppScreen.WITHDRAW_METHOD ? (
                      <Icons.Loader className="w-6 h-6 text-emerald-500 animate-spin" />
                    ) : (
                      <div className="w-7 h-7 text-emerald-500 group-hover:scale-110 transition-transform">
                        <Icons.Bank />
                      </div>
                    )}
                  </button>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center leading-tight">Withdraw<br/>Funds</span>
                </div>

              </div>
            </div>

            {/* Featured Promo Banner - Bayfi Style */}
            <div className="px-1 mb-10">
                <div 
                  onClick={() => handleActionClick(AppScreen.GIFT_CARD_TRADE_OPTIONS, true)}
                  className="bg-[#a5c9ff] rounded-[32px] p-6 relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all shadow-lg shadow-blue-100"
                >
                    <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
                        <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-32 h-32 object-contain" />
                        <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-24 h-24 object-contain absolute -top-8 -left-8" />
                    </div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div className="max-w-[70%]">
                            <h4 className="text-white font-black text-lg leading-tight mb-1">Sell your gift cards</h4>
                            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Instant payout to your naira wallet</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Icons.Gift className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>
                
            {/* Activity Cards - Secondary */}
            
        </div>

        {/* Side Column (Activity & Analytics) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Analytics - Bayfi Signature Vibe */}
          <div className="hidden lg:block">
             <SecurityAnalytics />
          </div>
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
});
