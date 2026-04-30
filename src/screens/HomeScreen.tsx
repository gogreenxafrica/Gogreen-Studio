import React, { useMemo, useState, useEffect, useRef } from 'react';
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
import { RecentTransactions } from '../components/RecentTransactions';

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
  currency: 'GG' | 'USD';
  setCurrency: (c: 'GG' | 'USD') => void;
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
  const promoSliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isInteracting = false;
    const interval = setInterval(() => {
      if (promoSliderRef.current && !isInteracting) {
        const { scrollLeft, scrollWidth, clientWidth } = promoSliderRef.current;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 50;
        const nextScroll = isAtEnd ? 0 : scrollLeft + clientWidth;
        
        promoSliderRef.current.scrollTo({ 
          left: nextScroll, 
          behavior: 'smooth' 
        });
      }
    }, 5000);

    const handleInteractionStart = () => { isInteracting = true; };
    const handleInteractionEnd = () => { isInteracting = false; };

    const slider = promoSliderRef.current;
    if (slider) {
      // Pause auto-scroll on interaction
      slider.addEventListener('mouseenter', handleInteractionStart);
      slider.addEventListener('mouseleave', handleInteractionEnd);
      slider.addEventListener('touchstart', handleInteractionStart, { passive: true });
      slider.addEventListener('touchend', handleInteractionEnd);
      
      // Grab to scroll logic for desktop
      let isDown = false;
      let startX: number;
      let scrollLeftPos: number;

      const onMouseDown = (e: MouseEvent) => {
        isDown = true;
        slider.classList.add('active');
        slider.style.scrollBehavior = 'auto';
        slider.style.scrollSnapType = 'none';
        startX = e.pageX - slider.offsetLeft;
        scrollLeftPos = slider.scrollLeft;
        isInteracting = true;
      };

      const onMouseLeave = () => {
        isDown = false;
        slider.classList.remove('active');
        slider.style.scrollBehavior = 'smooth';
        slider.style.scrollSnapType = 'x mandatory';
        isInteracting = false;
      };

      const onMouseUp = () => {
        isDown = false;
        slider.classList.remove('active');
        slider.style.scrollBehavior = 'smooth';
        slider.style.scrollSnapType = 'x mandatory';
        isInteracting = false;
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeftPos - walk;
      };

      slider.addEventListener('mousedown', onMouseDown);
      slider.addEventListener('mouseleave', onMouseLeave);
      slider.addEventListener('mouseup', onMouseUp);
      slider.addEventListener('mousemove', onMouseMove);
    }

    return () => {
      clearInterval(interval);
      if (slider) {
        slider.removeEventListener('mouseenter', handleInteractionStart);
        slider.removeEventListener('mouseleave', handleInteractionEnd);
        slider.removeEventListener('touchstart', handleInteractionStart);
        slider.removeEventListener('touchend', handleInteractionEnd);
      }
    };
  }, []);

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
      <header className="px-5 pt-6 pb-2 flex justify-between items-center w-full mx-auto z-20 flex-shrink-0 sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-50/50">
        <div className="flex flex-col">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-0.5">{greeting} 👋</p>
            <h2 className="text-lg font-display font-bold text-gray-900 tracking-tight">{user.fullName || "User"}</h2>
        </div>
        <div className="flex items-center gap-3 lg:hidden">
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
        <div className="px-5 pt-2 pb-24 w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8 md:space-y-12 w-full mx-auto lg:mx-0">
            {kycData.status !== 'VERIFIED' && (
              <div className="px-1 mb-2 mt-2 md:mb-6 md:mt-4">
                <motion.div 
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.1}
                  className="relative cursor-pointer group" 
                  onClick={() => setIsKycModalOpen(true)}
                >
                  {/* Back card 2 */}
                  <div className="absolute top-0 left-6 right-6 h-12 bg-gray-100/60 rounded-t-[24px] -mt-3 transition-all group-hover:-mt-4"></div>
                  {/* Back card 1 */}
                  <div className="absolute top-0 left-3 right-3 h-12 bg-gray-100 rounded-t-[24px] -mt-1.5 transition-all group-hover:-mt-2"></div>
                  
                  {/* Main card */}
                  <div className="relative bg-white rounded-[24px] px-4 py-3.5 md:px-6 md:py-5 flex items-center justify-between shadow-sm border border-gray-100 z-10">
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
                </motion.div>
              </div>
            )}

            {/* Portfolio Section - Bayfi Style */}
            <div 
              {...swipeHandlers}
              id="wallet-balance-card"
              className="px-1 mb-10 md:mb-14"
            >
              <motion.div 
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.05}
                className="bg-[#1a1a1a] py-8 pl-5 pr-6 md:py-12 md:px-8 rounded-[32px] text-white relative overflow-hidden shadow-2xl shadow-black/20 group cursor-grab active:cursor-grabbing"
              >
                {/* Subtle Pattern Graphic */}
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                  <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-40 h-40 object-contain" />
                  <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-24 h-24 object-contain absolute -top-12 -left-12" />
                </div>
                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full -ml-16 -mt-16 blur-3xl"></div>
                
                <div className="relative z-10 pointer-events-none">
                  <div className="flex justify-between items-center mb-8 pointer-events-auto">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                      <div onClick={() => setHideBalance(!hideBalance)} className="cursor-pointer hover:text-emerald-400 transition-colors">
                        {hideBalance ? <Icons.EyeOff className="w-3.5 h-3.5 text-white/40" /> : <Icons.Eye className="w-3.5 h-3.5 text-white/40" />}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 whitespace-nowrap">Wallet Balance</p>
                    </div>
                    
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-sm ml-auto">
                      <button 
                        onClick={() => setCurrency('GG')}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${currency === 'GG' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white/60'}`}
                      >
                        GG
                      </button>
                      <div className="relative">
                        <button 
                          className="px-3 py-1 rounded-lg text-[10px] font-black transition-all text-white/20 cursor-default relative opacity-40 blur-[0.8px]"
                        >
                          USD
                        </button>
                        <div className="absolute -top-2 -right-2 bg-gray-200 text-gray-600 text-[6px] font-black px-1 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap opacity-100 blur-none z-20">
                          Soon
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-emerald-500 font-black text-2xl">{currency === 'GG' ? 'GG' : '$'}</span>
                    <h3 className="text-4xl font-display font-black tracking-tighter text-white tabular-nums">
                      <PrivacyText hide={hideBalance}>
                        {(currency === 'GG' ? (walletBalance + (bonusClaimed ? 3000 : 0)) : ((walletBalance + (bonusClaimed ? 3000 : 0)) / 1710)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </PrivacyText>
                    </h3>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons - Bayfi Style (Horizontal Row) */}
            <div className="px-2 mb-10 md:mb-14">
              <div className="flex justify-between lg:justify-center lg:gap-16 items-start">
                
                {/* Trade Giftcard */}
                <div className="flex flex-col items-center gap-3 flex-1">
                  <button 
                    onClick={() => handleActionClick(AppScreen.GIFT_CARD_TRADE_OPTIONS, true)}
                    disabled={loadingAction !== null}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-50 active:scale-90 transition-transform group relative"
                  >
                    {loadingAction === AppScreen.GIFT_CARD_TRADE_OPTIONS ? (
                      <Icons.Loader className="w-6 h-6 md:w-8 md:h-8 text-orange-500 animate-spin" />
                    ) : (
                      <div className="w-7 h-7 md:w-9 md:h-9 text-orange-500 group-hover:scale-110 transition-transform flex items-center justify-center">
                        <Icons.Gift />
                      </div>
                    )}
                  </button>
                  <span className="text-[10px] md:text-[12px] font-black text-gray-500 uppercase tracking-widest text-center leading-tight">Trade<br/>Giftcard</span>
                </div>

                {/* Deposit Funds */}
                <div className="flex flex-col items-center gap-3 flex-1 opacity-40 blur-[1.2px] cursor-default">
                  <div className="relative">
                    <button 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-50"
                    >
                      <div className="w-7 h-7 md:w-9 md:h-9 text-gray-400 flex items-center justify-center">
                        <Icons.ArrowDown />
                      </div>
                    </button>
                  </div>
                  <span className="text-[10px] md:text-[12px] font-black text-gray-400 uppercase tracking-widest text-center leading-tight">Deposit<br/>Funds</span>
                </div>

                {/* Withdraw */}
                <div className="flex flex-col items-center gap-3 flex-1">
                  <button 
                    onClick={() => handleActionClick(AppScreen.WITHDRAW_METHOD, true)}
                    disabled={loadingAction !== null}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-50 active:scale-90 transition-transform group relative"
                  >
                    {loadingAction === AppScreen.WITHDRAW_METHOD ? (
                      <Icons.Loader className="w-6 h-6 md:w-8 md:h-8 text-emerald-500 animate-spin" />
                    ) : (
                      <div className="w-7 h-7 md:w-9 md:h-9 text-emerald-500 group-hover:scale-110 transition-transform flex items-center justify-center">
                        <Icons.Bank />
                      </div>
                    )}
                  </button>
                  <span className="text-[10px] md:text-[12px] font-black text-gray-500 uppercase tracking-widest text-center leading-tight">Withdraw<br/>Funds</span>
                </div>

              </div>
            </div>

            {/* Featured Promo Banner Slider */}
            <div className="px-1 mb-10 md:mb-14">
              <div 
                ref={promoSliderRef} 
                className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none"
              >
                
                {/* Banner 1: Sell Gift Cards */}
                <div 
                  onClick={() => handleActionClick(AppScreen.GIFT_CARD_TRADE_OPTIONS, true)}
                  className="min-w-full shrink-0 snap-center bg-[#a5c9ff] rounded-[32px] p-6 md:p-10 relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all shadow-lg shadow-blue-100"
                >
                    <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12 pointer-events-none">
                        <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
                        <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-24 h-24 md:w-36 md:h-36 object-contain absolute -top-8 -left-8" />
                    </div>
                    <div className="relative z-10 flex justify-between items-center pointer-events-none">
                        <div className="max-w-[70%]">
                            <h4 className="text-white font-black text-lg md:text-2xl leading-tight mb-1 md:mb-2">Sell your gift cards</h4>
                            <p className="text-white/80 text-[10px] md:text-[12px] font-bold uppercase tracking-widest">Instant payout to your naira wallet</p>
                        </div>
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Icons.Gift className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Banner 2: Referral Ads */}
                <div 
                  onClick={() => handleActionClick(AppScreen.REFERRAL, true)}
                  className="min-w-full shrink-0 snap-center bg-primary rounded-[32px] p-6 md:p-10 relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all shadow-lg shadow-emerald-100"
                >
                    <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12 pointer-events-none">
                        <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
                        <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-24 h-24 md:w-36 md:h-36 object-contain absolute -top-8 -left-8" />
                    </div>
                    <div className="relative z-10 flex justify-between items-center pointer-events-none">
                        <div className="max-w-[70%]">
                            <h4 className="text-white font-black text-lg md:text-2xl leading-tight mb-1 md:mb-2">Refer & Earn</h4>
                            <p className="text-white/80 text-[10px] md:text-[12px] font-bold uppercase tracking-widest">Get rewarded for inviting friends</p>
                        </div>
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Icons.Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                    </div>
                </div>

                {/* Banner 3: Trade to Earn */}
                <div 
                  onClick={() => handleActionClick(AppScreen.REWARDS, true)}
                  className="min-w-full shrink-0 snap-center bg-purple-500 rounded-[32px] p-6 md:p-10 relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all shadow-lg shadow-purple-100"
                >
                    <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12 pointer-events-none">
                        <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
                        <img src="/assets/logos/gogreen-white-logomark.png" alt="GoGreen" className="w-24 h-24 md:w-36 md:h-36 object-contain absolute -top-8 -left-8" />
                    </div>
                    <div className="relative z-10 flex justify-between items-center pointer-events-none">
                        <div className="max-w-[70%]">
                            <h4 className="text-white font-black text-lg md:text-2xl leading-tight mb-1 md:mb-2">Trade to Earn</h4>
                            <p className="text-white/80 text-[10px] md:text-[12px] font-bold uppercase tracking-widest">Earn GG bonus on every trade</p>
                        </div>
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Icons.TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                    </div>
                </div>

              </div>
            </div>
                
            {/* Activity Cards - Secondary */}
            
        </div>

        {/* Side Column (Activity & Analytics) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Analytics - Bayfi Signature Vibe */}
          <div className="hidden lg:block space-y-8">
             <RecentTransactions />
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
