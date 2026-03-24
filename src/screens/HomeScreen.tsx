import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../AppContext';
import { AppScreen, SignupData } from '../../types';
import { Icons } from '../../components/Icons';
import { getAvatarUrl } from '../constants/avatars';
import { Button } from '../../components/Button';
import { Skeleton } from '../../components/Skeleton';
import * as Constants from '../../constants';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Receipt, ShieldCheck, ArrowLeftRight, BellRing, TrendingUp } from 'lucide-react';

interface HomeScreenProps {
  onRefresh: () => Promise<void>;
  greeting: string;
  user: SignupData;
  hasUnreadNotifications: boolean;
  kycLevel: number;
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
  onRefresh,
  greeting,
  user,
  hasUnreadNotifications,
  kycLevel,
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
  const { checklist, setGlobalOverlay } = useAppContext();
  const allServices = Constants.ALL_SERVICES;
  const transactions = Constants.TRANSACTIONS;

  const [checkedTransactions, setCheckedTransactions] = useState<Set<number>>(new Set());

  const swipeHandlers = useSwipeable({
    onSwipedDown: () => setShowQuickAccessDropdown(true),
    onSwipedUp: () => setShowQuickAccessDropdown(false),
    trackMouse: true
  });

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-in pb-24 relative overflow-y-auto no-scrollbar">
      
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex justify-between items-center w-full relative z-10">
        <div className="flex flex-col">
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-0.5">{greeting} 👋</p>
            <h2 className="text-xl font-display font-bold text-gray-900 tracking-tight">{user.username}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate(AppScreen.NOTIFICATIONS)} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 relative active:scale-95 transition-transform shadow-sm hover:shadow-md">
            <Icons.Bell className="w-5 h-5" />
            {hasUnreadNotifications && <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>}
          </button>
          <button onClick={() => setGlobalOverlay(AppScreen.SUPPORT)} className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-transform shadow-sm hover:shadow-md">
            <div className="w-5 h-5"><Icons.Headphones /></div>
          </button>
          <div className="relative cursor-pointer active:scale-95 transition-transform" onClick={() => onNavigate(AppScreen.ME)}>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src={user.profileImage || getAvatarUrl(user.username)} className="w-full h-full object-cover" alt="Avatar" />
            </div>
            {kycLevel >= 3 && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-primary text-white w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-5 pb-5 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
            {/* Portfolio Card */}
            <div 
              {...swipeHandlers}
              id="wallet-balance-card"
              className="relative flex flex-col"
            >
              <div className="relative z-20">
                <div className="bg-white p-6 rounded-3xl text-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group">
                  
                  <div className="relative z-10 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 opacity-60">
                           <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Balance</p>
                           <div onClick={() => setHideBalance(!hideBalance)} className="cursor-pointer hover:text-primary transition-colors">
                                {hideBalance ? <Icons.EyeOff className="w-3.5 h-3.5" /> : <Icons.Eye className="w-3.5 h-3.5" />}
                           </div>
                        </div>
                        
                        {/* Currency Toggle */}
                        <div className="flex bg-gray-100/50 p-1 rounded-lg border border-gray-200/50">
                           <button onClick={() => setCurrency('NGN')} className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${currency === 'NGN' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>NGN</button>
                           <button onClick={() => setCurrency('USD')} className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${currency === 'USD' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>USD</button>
                        </div>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-6">
                      <h3 className="text-3xl lg:text-5xl font-display font-bold tracking-tight text-gray-900 tabular-nums">
                        {currency === 'NGN' ? '₦' : '$'}{hideBalance ? '••••••' : (currency === 'NGN' ? (walletBalance + (bonusClaimed ? 3000 : 0)) : ((walletBalance + (bonusClaimed ? 3000 : 0)) / 1710)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h3>
                      {!hideBalance && (
                          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                            <TrendingUp size={12} /> +2.4%
                          </span>
                      )}
                    </div>

                    {/* Action Buttons - Pro Style */}
                    <div className="grid grid-cols-4 gap-4">
                        <button id="tutorial-add-money" onClick={() => onProtectedNavigation(AppScreen.ADD_MONEY)} className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-active:scale-95 transition-all">
                                <Icons.Plus className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-600 group-hover:text-primary transition-colors">Add Fund</span>
                        </button>
                        <button onClick={() => onProtectedNavigation(AppScreen.WITHDRAW_MONEY)} className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-900 border border-gray-200 flex items-center justify-center group-active:scale-95 transition-all hover:bg-gray-100">
                                <Icons.Bank className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Withdraw</span>
                        </button>
                        <button onClick={() => onProtectedNavigation(AppScreen.COIN_SELECTION)} className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-900 border border-gray-200 flex items-center justify-center group-active:scale-95 transition-all hover:bg-gray-100">
                                <Icons.Wallet className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Wallet</span>
                        </button>
                        <button onClick={() => onProtectedNavigation(AppScreen.SCANNER)} className="flex flex-col items-center gap-2 group">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-900 border border-gray-200 flex items-center justify-center group-active:scale-95 transition-all hover:bg-gray-100">
                                <Icons.QrCode className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-bold text-gray-600 group-hover:text-gray-900 transition-colors">QR Code</span>
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
                
            {/* Quick Access Grid - Clean & Uniform */}
            <div id="quick-actions-grid" className="grid grid-cols-4 gap-3 px-1">
              {quickAccessIds.slice(0, 4).map((id, i) => {
                const item = allServices.find(s => s.id === id);
                if (!item) return null;
                
                return (
                  <div key={i} onClick={() => onProtectedNavigation(item.screen)} className="flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 transition-transform group p-2 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 relative">
                    {item.id === 'withdraw' && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[6px] font-black px-1 py-0.5 rounded-full shadow-sm z-10 animate-pulse">HOT</div>
                    )}
                    <div className="w-6 h-6 text-primary">
                      {item.icon}
                    </div>
                    <span className="text-[9px] font-bold text-gray-600 text-center leading-tight">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Activity Cards */}
            <div className="pt-4 space-y-3">
                <h3 className="font-display font-bold text-gray-900 text-base tracking-tight px-1">Gogreen Activity</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div onClick={() => onNavigate(AppScreen.BILL_PAYMENT_DETAILS)} className="bg-green-50/50 p-5 rounded-3xl border border-green-100/50 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] relative overflow-hidden h-40">
                        <div className="flex flex-col">
                            <h4 className="font-bold text-gray-900 text-sm">Trade Giftcards</h4>
                            <p className="text-[10px] text-gray-500 mt-1 max-w-[60%]">Buy & sell all kinds of gift cards</p>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-24 h-24">
                            <img src="/assets/avatars/giftcard.svg" alt="Trade Giftcards" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                    </div>
                    <div onClick={() => onNavigate(AppScreen.CRYPTO_HUB)} className="bg-green-50/50 p-5 rounded-3xl border border-green-100/50 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] relative overflow-hidden h-40">
                        <div className="flex flex-col">
                            <h4 className="font-bold text-gray-900 text-sm">Trade Crypto</h4>
                            <p className="text-[10px] text-gray-500 mt-1 max-w-[60%]">Crypto (BTC, USDT, ETH)</p>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-24 h-24">
                            <img src="/assets/avatars/bitcoin.svg" alt="Trade Crypto" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* Side Column (Activity) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-display font-bold text-gray-900 text-base tracking-tight">Recent Activity</h3>
            <button onClick={navigateToHistory} className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">View All</button>
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
                          <p className={`font-bold text-[13px] tabular-nums ${tx.type === 'Add Fund' ? 'text-green-600' : 'text-gray-900'} ${isFailedOrCancelled && isChecked ? 'line-through text-gray-400' : ''}`}>{tx.type === 'Add Fund' ? '+' : ''}{hideBalance ? '••••••' : tx.fiatAmount}</p>
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
  );
});
