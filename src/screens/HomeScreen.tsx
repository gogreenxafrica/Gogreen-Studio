import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../AppContext';
import { AppScreen, SignupData } from '../../types';
import { Icons } from '../components/Icons';
import { getAvatarUrl } from '../constants/avatars';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/Skeleton';
import { PrivacyText } from '../../components/PrivacyText';
import * as Constants from '../../constants';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Receipt, ShieldCheck, ArrowLeftRight, BellRing, TrendingUp } from 'lucide-react';
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
  onProtectedNavigation: (screen: AppScreen) => void;
  quickAccessIds: string[];
  showQuickAccessDropdown: boolean;
  setShowQuickAccessDropdown: (b: boolean) => void;
  isTxLoading: boolean;
  setSelectedTx: (tx: any) => void;
  navigateToHistory: () => void;
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
  onProtectedNavigation,
  quickAccessIds,
  showQuickAccessDropdown,
  setShowQuickAccessDropdown,
  isTxLoading,
  setSelectedTx,
  navigateToHistory
}) => {
  const { checklist, setGlobalOverlay, setActiveModal, setScreen } = useAppContext();
  const allServices = Constants.ALL_SERVICES;
  const transactions = Constants.TRANSACTIONS;

  const [checkedTransactions, setCheckedTransactions] = useState<Set<number>>(new Set());
  const [loadingAction, setLoadingAction] = useState<AppScreen | null>(null);

  const handleActionClick = async (screen: AppScreen, isModal: boolean = false) => {
    setLoadingAction(screen);
    // Simulate a brief processing delay to show the "subtle loading indicator"
    await new Promise(resolve => setTimeout(resolve, 600));
    if (isModal) {
      setActiveModal(screen);
    }
    
    // Use onProtectedNavigation for withdrawals to trigger PIN verification
    if (screen === AppScreen.WITHDRAW_MONEY) {
      onProtectedNavigation(screen);
    } else {
      setScreen(screen);
    }
    
    setLoadingAction(null);
  };

  const swipeHandlers = useSwipeable({
    onSwipedDown: () => setShowQuickAccessDropdown(true),
    onSwipedUp: () => setShowQuickAccessDropdown(false),
    trackMouse: true
  });

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-in relative overflow-hidden">
      
      {/* 1. FIXED TOP CONTAINER (Header) */}
      <header className="px-5 pt-6 pb-2 flex justify-between items-center w-full z-20 flex-shrink-0 sticky top-0 header-integrated">
        <div className="flex flex-col">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-0.5">{greeting} 👋</p>
            <h2 className="text-xl font-display font-bold text-gray-900 tracking-tight">{user.username}</h2>
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
            {/* Portfolio Section - Bayfi Style */}
            <div 
              {...swipeHandlers}
              id="wallet-balance-card"
              className="px-1 mb-10"
            >
              <div className="bg-[#1a1a1a] py-8 pl-5 pr-6 rounded-[32px] text-white relative overflow-hidden shadow-2xl shadow-black/20 group">
                {/* Subtle Pattern Graphic */}
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                  <Icons.Coin className="w-48 h-48" />
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
                        onClick={() => setCurrency('USD')}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${currency === 'USD' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white/60'}`}
                      >
                        USD
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
                    onClick={() => handleActionClick(AppScreen.WITHDRAW_MONEY)}
                    disabled={loadingAction !== null}
                    className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-50 active:scale-90 transition-transform group relative"
                  >
                    {loadingAction === AppScreen.WITHDRAW_MONEY ? (
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
                <div className="bg-[#a5c9ff] rounded-[32px] p-6 relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all shadow-lg shadow-blue-100">
                    <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
                        <Icons.Coin className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10 flex justify-between items-center">
                        <div className="max-w-[70%]">
                            <h4 className="text-white font-black text-lg leading-tight mb-1">Buy and sell your gift cards</h4>
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

          <div className="space-y-5">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-display font-black text-gray-900 text-xs uppercase tracking-[0.2em]">Recent Activity</h3>
              <button onClick={navigateToHistory} className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary-dark transition-colors">View All</button>
            </div>
            <div className="space-y-3">
            {isTxLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 bg-white rounded-2xl flex items-center gap-4 border border-gray-100">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24 rounded-md" />
                      <Skeleton className="h-4 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-3 w-12 rounded-md opacity-60" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {transactions.slice(0, 6).map(tx => {
                  const isFailedOrCancelled = tx.status === 'Failed' || tx.status === 'Cancelled';
                  const isChecked = checkedTransactions.has(tx.id);
                  const isPending = tx.status === 'Pending' || tx.status === 'Processing';

                  return (
                    <div 
                      key={tx.id} 
                      onClick={() => { 
                        if (isFailedOrCancelled && !isChecked) {
                           setCheckedTransactions(prev => new Set(prev).add(tx.id));
                        }
                        setSelectedTx(tx); 
                        onNavigate(AppScreen.TRANSACTION_DETAILS); 
                      }} 
                      className={`p-3.5 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer hover:border-gray-200 border border-transparent hover:shadow-sm group ${
                        isFailedOrCancelled && !isChecked ? 'bg-gray-100' : 'bg-white'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform relative" style={{ backgroundColor: isFailedOrCancelled && !isChecked ? '#9CA3AF' : tx.color }}>
                        {tx.icon}
                        {isPending && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm z-10">
                              <Icons.Loader className="w-2.5 h-2.5 text-orange-500 animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className={`font-bold text-[13px] tracking-tight truncate ${isFailedOrCancelled && isChecked ? 'line-through text-gray-400' : 'text-gray-900'}`}>{tx.type}</p>
                          <p className={`font-bold text-[13px] tabular-nums ${tx.type === 'Add Fund' ? 'text-green-600' : 'text-gray-900'} ${isFailedOrCancelled && isChecked ? 'line-through text-gray-400' : ''}`}>
                            {tx.type === 'Add Fund' ? '+' : ''}
                            <PrivacyText hide={hideBalance}>{tx.fiatAmount}</PrivacyText>
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-gray-400 font-medium">{tx.date}</p>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${tx.status === 'Success' ? 'bg-green-50 text-green-600' : tx.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>{tx.status}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        </div>
      </div>
    </div>
  </div>
);
});
