import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { AppScreen, SignupData } from './types';
import { COINS } from './constants';
import toast from 'react-hot-toast';

interface AppContextType {
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  previousScreen: AppScreen | null;
  setPreviousScreen: (screen: AppScreen | null) => void;
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
  pendingBalance: number;
  setPendingBalance: (balance: number) => void;
  signupData: SignupData;
  setSignupData: (data: SignupData | ((prev: SignupData) => SignupData)) => void;
  kycLevel: number;
  setKycLevel: (level: number) => void;
  signupStep: number;
  setSignupStep: (step: number) => void;
  loginData: any;
  setLoginData: (data: any) => void;
  isCaptchaVerified: boolean;
  setIsCaptchaVerified: (verified: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Navigation State
  activeTab: AppScreen;
  setActiveTab: (tab: AppScreen) => void;
  activeModal: AppScreen | null;
  setActiveModal: (modal: AppScreen | null) => void;
  globalOverlay: AppScreen | null;
  setGlobalOverlay: (overlay: AppScreen | null) => void;
  
  // New states
  currency: 'NGN' | 'USD';
  setCurrency: (c: 'NGN' | 'USD') => void;
  hideBalance: boolean;
  setHideBalance: (b: boolean) => void;
  bonusClaimed: boolean;
  setBonusClaimed: (b: boolean) => void;
  hasUnreadNotifications: boolean;
  setHasUnreadNotifications: (b: boolean) => void;
  quickAccessIds: string[];
  setQuickAccessIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  showQuickAccessDropdown: boolean;
  setShowQuickAccessDropdown: (b: boolean) => void;
  isTxLoading: boolean;
  setIsTxLoading: (b: boolean) => void;
  selectedTx: any;
  setSelectedTx: (tx: any) => void;
  showReceiptOptionsModal: boolean;
  setShowReceiptOptionsModal: (b: boolean) => void;
  receiptTheme: 'light' | 'dark';
  setReceiptTheme: (t: 'light' | 'dark') => void;
  showReferralWithdrawModal: boolean;
  setShowReferralWithdrawModal: (b: boolean) => void;
  pushNotificationsEnabled: boolean;
  setPushNotificationsEnabled: (b: boolean) => void;
  pin: string[];
  setPin: (pin: string[]) => void;
  confirmPin: string[];
  setConfirmPin: (pin: string[]) => void;
  pinError: boolean;
  setPinError: (error: boolean) => void;
  isLoading: boolean;
  setIsLoading: (b: boolean) => void;
  showSplash: boolean;
  setShowSplash: (b: boolean) => void;

  // Derived Data
  coins: any[];
  coinsMap: Record<string, any>;

  // Send Flow State
  sendAsset: any;
  setSendAsset: (asset: any) => void;
  sendRecipient: string;
  setSendRecipient: (recipient: string) => void;
  sendRecipientType: string;
  setSendRecipientType: (type: string) => void;
  sendAmount: string;
  setSendAmount: (amount: string) => void;

  // Swap Flow State
  swapFromAsset: any;
  setSwapFromAsset: (asset: any) => void;
  swapToAsset: any;
  setSwapToAsset: (asset: any) => void;
  swapAmount: string;
  setSwapAmount: (amount: string) => void;

  // Withdraw Flow State
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  referralBalance: number;
  setReferralBalance: (balance: number) => void;

  // Bill Payment State
  selectedBillCategory: any;
  setSelectedBillCategory: (category: any) => void;
  billDetails: { provider: string; customerId: string; amount: string; plan?: string };
  setBillDetails: (details: any) => void;
  selectedVoucher: any;
  setSelectedVoucher: (voucher: any) => void;

  // Security State
  biometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
  transactionPin: string;
  setTransactionPin: (pin: string) => void;

  // Tutorial State
  seenScreens: Record<string, boolean>;
  markScreenSeen: (screenName: string) => void;
  resetScreenSeen: (screenName: string) => void;

  // Checklist State
  checklist: { id: string; completed: boolean }[];
  completeChecklistTask: (id: string) => void;
  requestAuthorization: () => Promise<boolean>;
  
  // Favorites State
  favoriteCoinIds: string[];
  toggleFavoriteCoin: (id: string) => void;
  
  // Wallet Generation State
  areCryptoWalletsGenerated: boolean;
  setAreCryptoWalletsGenerated: (val: boolean) => void;
  areBankAccountsGenerated: boolean;
  setAreBankAccountsGenerated: (val: boolean) => void;
  
  // Beneficiaries
  savedBeneficiaries: any[];
  setSavedBeneficiaries: (beneficiaries: any[] | ((prev: any[]) => any[])) => void;
  
  // Notifications
  notifications: any[];
  addNotification: (notification: any) => void;
  triggerReview: (options: { 
    title: string, 
    message: string, 
    notificationTitle: string, 
    notificationDesc: string,
    onComplete: () => void 
  }) => void;
  
  underReviewData: { title: string, message: string } | null;
  setUnderReviewData: (data: { title: string, message: string } | null) => void;
  
  // Rewards
  points: number;
  setPoints: (points: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [previousScreen, setPreviousScreen] = useState<AppScreen | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(1326890);
  const [pendingBalance, setPendingBalance] = useState<number>(45000);
  const [referralBalance, setReferralBalance] = useState<number>(15000);
  const [points, setPoints] = useState<number>(1250);
  const [signupStep, setSignupStep] = useState<number>(0);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState<SignupData>({
    username: '₦', 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    referralCode: '', 
    referralSource: '',
    country: 'Nigeria',
    profileImage: null,
    phone: '',
    autoWithdrawToBank: false
  });
  const [kycLevel, setKycLevel] = useState<number>(1);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<AppScreen>(AppScreen.HOME);
  const [activeModal, setActiveModal] = useState<AppScreen | null>(null);
  const [globalOverlay, setGlobalOverlay] = useState<AppScreen | null>(null);
 
  // New states
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [bonusClaimed, setBonusClaimed] = useState<boolean>(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(true);
  const [quickAccessIds, setQuickAccessIds] = useState<string[]>(['withdraw', 'history', 'rewards', 'rates']);
  const [showQuickAccessDropdown, setShowQuickAccessDropdown] = useState<boolean>(true);
  const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [showReceiptOptionsModal, setShowReceiptOptionsModal] = useState<boolean>(false);
  const [receiptTheme, setReceiptTheme] = useState<'light' | 'dark'>('dark');
  const [showReferralWithdrawModal, setShowReferralWithdrawModal] = useState<boolean>(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(true);
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '']);
  const [pinError, setPinError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [areCryptoWalletsGenerated, setAreCryptoWalletsGenerated] = useState<boolean>(false);
  const [areBankAccountsGenerated, setAreBankAccountsGenerated] = useState<boolean>(false);
  const [savedBeneficiaries, setSavedBeneficiaries] = useState<any[]>([]);
  const [underReviewData, setUnderReviewData] = useState<{ title: string, message: string } | null>(null);
  const [notifications, setNotifications] = useState<any[]>(COINS.map((_, i) => ({
    id: i + 1,
    title: 'Welcome to Gogreen',
    desc: 'Start trading crypto with ease.',
    time: '2h ago',
    type: 'system',
    unread: i === 0
  })));

  const addNotification = (notification: any) => {
    setNotifications(prev => [{
      id: Date.now(),
      time: 'Just now',
      unread: true,
      ...notification
    }, ...prev]);
    setHasUnreadNotifications(true);
  };

  const triggerReview = (options: { 
    title: string, 
    message: string, 
    notificationTitle: string, 
    notificationDesc: string,
    onComplete: () => void,
    nextScreen?: AppScreen
  }) => {
    setUnderReviewData({ title: options.title, message: options.message });
    setScreen(AppScreen.KYC_UPLOADING);
    
    // 1. Show uploading screen for 4 seconds
    setTimeout(() => {
      // 2. Go to the under review screen
      setScreen(options.nextScreen || AppScreen.UNDER_REVIEW);
      
      // 3. Simulate KYC partner webhook after a longer delay (e.g., 15 seconds)
      // The user can navigate away during this time, and the upgrade will happen in the background.
      setTimeout(() => {
        options.onComplete();
        addNotification({
          title: options.notificationTitle,
          desc: options.notificationDesc,
          type: 'system'
        });
        toast.success(options.notificationTitle, {
          style: { background: '#10B981', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
        });
      }, 15000);
    }, 4000);
  };
 
  // Send Flow State
  const [sendAsset, setSendAsset] = useState<any>(null);
  const [sendRecipient, setSendRecipient] = useState<string>('');
  const [sendRecipientType, setSendRecipientType] = useState<string>('username');
  const [sendAmount, setSendAmount] = useState<string>('');
 
  // Swap Flow State
  const [swapFromAsset, setSwapFromAsset] = useState<any>(null);
  const [swapToAsset, setSwapToAsset] = useState<any>(null);
  const [swapAmount, setSwapAmount] = useState<string>('');
 
  // Withdraw Flow State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
 
  // Bill Payment State
  const [selectedBillCategory, setSelectedBillCategory] = useState<any>(null);
  const [billDetails, setBillDetails] = useState<{ provider: string; customerId: string; amount: string; plan?: string }>({ provider: '', customerId: '', amount: '' });
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
 
  // Security State
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
  const [transactionPin, setTransactionPin] = useState<string>('');
 
  // Tutorial State
  const [seenScreens, setSeenScreens] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('gogreen_seen_screens');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });
 
  const markScreenSeen = (screenName: string) => {
    setSeenScreens(prev => {
      const next = { ...prev, [screenName]: true };
      try { localStorage.setItem('gogreen_seen_screens', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };
 
  const resetScreenSeen = (screenName: string) => {
    setSeenScreens(prev => {
      const newScreens = { ...prev };
      delete newScreens[screenName];
      try { localStorage.setItem('gogreen_seen_screens', JSON.stringify(newScreens)); } catch (e) {}
      return newScreens;
    });
  };
 
  // Checklist State
  const [checklist, setChecklist] = useState<{ id: string; completed: boolean }[]>([
    { id: 'fund', completed: false },
    { id: 'airtime', completed: false },
    { id: 'advanced_kyc', completed: false },
    { id: 'sell_crypto', completed: false },
  ]);

  const completeChecklistTask = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: true } : item));
  };
 
  // Favorites State
  const [favoriteCoinIds, setFavoriteCoinIds] = useState<string[]>(['btc', 'usdt']);
  const toggleFavoriteCoin = (id: string) => {
    setFavoriteCoinIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Auto-update checklist based on state
  React.useEffect(() => {
    if (walletBalance > 0) completeChecklistTask('fund');
    if (kycLevel >= 3) completeChecklistTask('advanced_kyc');
  }, [kycLevel, walletBalance]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const coins = useMemo(() => COINS.map(c => ({
    ...c,
    balance: c.id === 'ngn' ? walletBalance : (c.id === 'btc' ? 0.005 : (c.id === 'eth' ? 0.12 : (c.id === 'usdt' ? 450.53 : 0)))
  })), [walletBalance]);

  const coinsMap = useMemo(() => {
    return coins.reduce((acc, coin) => {
      acc[coin.id] = coin;
      return acc;
    }, {} as Record<string, typeof coins[0]>);
  }, [coins]);

  const contextValue = useMemo(() => ({
      screen, setScreen,
      previousScreen, setPreviousScreen,
      walletBalance, setWalletBalance,
      pendingBalance, setPendingBalance,
      signupData, setSignupData,
      kycLevel, setKycLevel,
      signupStep, setSignupStep,
      loginData, setLoginData,
      isCaptchaVerified, setIsCaptchaVerified,
      theme, toggleTheme,
      activeTab, setActiveTab,
      activeModal, setActiveModal,
      globalOverlay, setGlobalOverlay,
      currency, setCurrency,
      hideBalance, setHideBalance,
      bonusClaimed, setBonusClaimed,
      hasUnreadNotifications, setHasUnreadNotifications,
      quickAccessIds, setQuickAccessIds,
      showQuickAccessDropdown, setShowQuickAccessDropdown,
      isTxLoading, setIsTxLoading,
      selectedTx, setSelectedTx,
      showReceiptOptionsModal, setShowReceiptOptionsModal,
      receiptTheme, setReceiptTheme,
      showReferralWithdrawModal, setShowReferralWithdrawModal,
      pushNotificationsEnabled, setPushNotificationsEnabled,
      pin, setPin,
      confirmPin, setConfirmPin,
      pinError, setPinError,
      isLoading, setIsLoading,
      showSplash, setShowSplash,
      coins, coinsMap,
      sendAsset, setSendAsset,
      sendRecipient, setSendRecipient,
      sendRecipientType, setSendRecipientType,
      sendAmount, setSendAmount,
      swapFromAsset, setSwapFromAsset,
      swapToAsset, setSwapToAsset,
      swapAmount, setSwapAmount,
      withdrawAmount, setWithdrawAmount,
      referralBalance, setReferralBalance,
      selectedBillCategory, setSelectedBillCategory,
      billDetails, setBillDetails,
      selectedVoucher, setSelectedVoucher,
      biometricEnabled, setBiometricEnabled,
      transactionPin, setTransactionPin,
      checklist, completeChecklistTask,
      seenScreens, markScreenSeen, resetScreenSeen,
      favoriteCoinIds, toggleFavoriteCoin,
      areCryptoWalletsGenerated, setAreCryptoWalletsGenerated,
      areBankAccountsGenerated, setAreBankAccountsGenerated,
      savedBeneficiaries, setSavedBeneficiaries,
      underReviewData, setUnderReviewData,
      notifications, addNotification,
      triggerReview,
      points, setPoints
  }), [
      screen, walletBalance, pendingBalance, signupData, kycLevel, signupStep, loginData, isCaptchaVerified,
      theme, activeTab, activeModal, globalOverlay, currency, hideBalance, bonusClaimed, hasUnreadNotifications,
      quickAccessIds, showQuickAccessDropdown, isTxLoading, selectedTx,
      showReceiptOptionsModal, receiptTheme, showReferralWithdrawModal, pushNotificationsEnabled,
      pin, confirmPin, pinError, isLoading, showSplash, coins, coinsMap, sendAsset, sendRecipient,
      sendRecipientType, sendAmount, swapFromAsset, swapToAsset, swapAmount, withdrawAmount,
      referralBalance, selectedBillCategory, billDetails, selectedVoucher, biometricEnabled,
      transactionPin, checklist, seenScreens, favoriteCoinIds, areCryptoWalletsGenerated,
      areBankAccountsGenerated, savedBeneficiaries, underReviewData, points, notifications
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
