import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback, useRef, useEffect } from 'react';
import { AppScreen, SignupData, Coin, Transaction, Notification, GiftCard, GiftCardRegion } from './types';
import { COINS, NOTIFICATIONS } from './constants';
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
  signupStep: number;
  setSignupStep: (step: number) => void;
  loginData: { email: string; password: string };
  setLoginData: (data: { email: string; password: string }) => void;
  isCaptchaVerified: boolean;
  setIsCaptchaVerified: (verified: boolean) => void;
  
  // Navigation State
  activeTab: AppScreen;
  setActiveTab: (tab: AppScreen) => void;
  activeModal: AppScreen | null;
  setActiveModal: (modal: AppScreen | null) => void;
  globalOverlay: AppScreen | null;
  setGlobalOverlay: (overlay: AppScreen | null) => void;
  
  // Navigation Logic State
  scannerTab: 'scan' | 'receive';
  setScannerTab: (tab: 'scan' | 'receive') => void;
  pendingRoute: AppScreen | null;
  setPendingRoute: (route: AppScreen | null) => void;
  navigate: (target: AppScreen, isFromNavBar?: boolean) => void;
  
  // PIN Modal State
  showPinModal: boolean;
  setShowPinModal: (show: boolean) => void;
  pinMode: 'verify' | 'setup' | 'confirm';
  setPinMode: (mode: 'verify' | 'setup' | 'confirm') => void;
  onPinSuccess: (() => void) | null;
  setOnPinSuccess: (callback: (() => void) | null) => void;
  onPinCancel: (() => void) | null;
  setOnPinCancel: (callback: (() => void) | null) => void;
  
  isPinSetupRequired: boolean;
  setIsPinSetupRequired: (b: boolean) => void;
  // New states
  currency: 'GG' | 'USD';
  setCurrency: (c: 'GG' | 'USD') => void;
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
  selectedTx: Transaction | null;
  setSelectedTx: (tx: Transaction | null) => void;
  selectedChatId: number | undefined;
  setSelectedChatId: (id: number | undefined) => void;
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
  coins: Coin[];
  coinsMap: Record<string, Coin>;

  // Send Flow State
  sendAsset: Coin | null;
  setSendAsset: (asset: Coin | null) => void;
  sendRecipient: string;
  setSendRecipient: (recipient: string) => void;
  sendRecipientType: string;
  setSendRecipientType: (type: string) => void;
  sendAmount: string;
  setSendAmount: (amount: string) => void;

  // Withdraw Flow State
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;

  // Bill Payment State
  selectedBillCategory: { id: string; name: string; icon: any } | null;
  setSelectedBillCategory: (category: { id: string; name: string; icon: any } | null) => void;
  billDetails: { provider: string; customerId: string; amount: string; plan?: string };
  setBillDetails: (details: any) => void;
  selectedVoucher: { id: number; title: string; desc: string; color: string; minOrderAmount: number } | null;
  setSelectedVoucher: (voucher: { id: number; title: string; desc: string; color: string; minOrderAmount: number } | null) => void;

  // Security State
  biometricEnabled: boolean;
  setBiometricEnabled: (enabled: boolean) => void;
  transactionPin: string;
  setTransactionPin: (pin: string) => void;

  // Checklist State
  checklist: { id: string; completed: boolean }[];
  completeChecklistTask: (id: string) => void;
  requestAuthorization: () => Promise<boolean>;
  
  // Favorites State
  savedBeneficiaries: { id: string; name: string; accountNumber: string; bankName: string }[];
  setSavedBeneficiaries: (beneficiaries: { id: string; name: string; accountNumber: string; bankName: string }[] | ((prev: { id: string; name: string; accountNumber: string; bankName: string }[]) => { id: string; name: string; accountNumber: string; bankName: string }[])) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Partial<Notification>) => void;
  markAllNotificationsAsRead: () => void;
  markNotificationAsRead: (id: number) => void;
  triggerReview: (options: { 
    title: string, 
    message: string, 
    notificationTitle: string, 
    notificationDesc: string,
    onComplete: () => void 
  }) => void;
  
  goBack: () => void;
  
  underReviewData: { title: string, message: string } | null;
  setUnderReviewData: (data: { title: string, message: string } | null) => void;
  
  // Support State
  isSupportOpen: boolean;
  setIsSupportOpen: (isOpen: boolean) => void;
  supportInitialView: 'HELP_CENTER' | 'COMPLAINT_FORM' | 'CHAT' | 'CHAT_HISTORY';
  setSupportInitialView: (view: 'HELP_CENTER' | 'COMPLAINT_FORM' | 'CHAT' | 'CHAT_HISTORY') => void;
  
  // Rewards
  points: number;
  setPoints: (points: number) => void;

  // Gift Card State
  kycData: {
    bvn: string;
    nin: string;
    selfie: string | null;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NONE';
  };
  setKycData: (data: {
    bvn: string;
    nin: string;
    selfie: string | null;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NONE';
  }) => void;
  
  // Username check
  isUsernameTaken: boolean;
  setIsUsernameTaken: (taken: boolean) => void;
  isCheckingUsername: boolean;
  setIsCheckingUsername: (checking: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [screen, _setScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [previousScreen, setPreviousScreen] = useState<AppScreen | null>(null);
  
  const setScreen = useCallback((newScreen: AppScreen) => {
    _setScreen(prev => {
      if (prev !== newScreen) {
        setPreviousScreen(prev);
      }
      return newScreen;
    });
  }, []);

  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinMode, setPinMode] = useState<'verify' | 'setup' | 'confirm'>('verify');
  const [onPinSuccess, _setOnPinSuccess] = useState<(() => void) | null>(null);
  const [onPinCancel, _setOnPinCancel] = useState<(() => void) | null>(null);

  const setOnPinSuccess = useCallback((callback: (() => void) | null) => {
    _setOnPinSuccess(() => callback);
  }, []);

  const setOnPinCancel = useCallback((callback: (() => void) | null) => {
    _setOnPinCancel(() => callback);
  }, []);

  const [walletBalance, setWalletBalance] = useState<number>(1326890);
  const [pendingBalance, setPendingBalance] = useState<number>(45000);
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
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<AppScreen>(AppScreen.HOME);
  const [activeModal, setActiveModal] = useState<AppScreen | null>(null);
  const [globalOverlay, setGlobalOverlay] = useState<AppScreen | null>(null);
 
  // Navigation Logic State
  const [scannerTab, setScannerTab] = useState<'scan' | 'receive'>('scan');
  const [pendingRoute, setPendingRoute] = useState<AppScreen | null>(null);

  // New states
  const [currency, setCurrency] = useState<'GG' | 'USD'>('GG');
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [bonusClaimed, setBonusClaimed] = useState<boolean>(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(true);
  const [quickAccessIds, setQuickAccessIds] = useState<string[]>(['withdraw', 'rewards', 'rates', 'pay_bills']);
  const [showQuickAccessDropdown, setShowQuickAccessDropdown] = useState<boolean>(true);
  const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number | undefined>(undefined);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(true);
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '']);
  const [pinError, setPinError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isPinSetupRequired, setIsPinSetupRequired] = useState<boolean>(false);
  const [savedBeneficiaries, setSavedBeneficiaries] = useState<{ id: string; name: string; accountNumber: string; bankName: string }[]>([]);
  const [underReviewData, setUnderReviewData] = useState<{ title: string, message: string } | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [supportInitialView, setSupportInitialView] = useState<'HELP_CENTER' | 'COMPLAINT_FORM' | 'CHAT' | 'CHAT_HISTORY'>('HELP_CENTER');
  
  const [giftCardTradeType, setGiftCardTradeType] = useState<'BUY' | 'SELL' | null>(null);
  const [kycData, setKycData] = useState({
    bvn: '',
    nin: '',
    selfie: null,
    status: 'NONE' as const
  });

  const [isUsernameTaken, setIsUsernameTaken] = useState<boolean>(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const navigate = useCallback((target: AppScreen, isFromNavBar: boolean = false) => {
    if (target === AppScreen.SUPPORT) {
      setScreen(target);
      if (isFromNavBar) setActiveTab(AppScreen.SUPPORT);
      return;
    }

    if (target === AppScreen.CHAT) {
      setScreen(AppScreen.CHAT);
      if (isFromNavBar) setActiveTab(AppScreen.CHAT);
      return;
    }
    
    if (isFromNavBar) setActiveTab(target);

    setScreen(target);
  }, [screen, setScreen, setActiveTab]);
  
  const addNotification = (notification: Partial<Notification>) => {
    setNotifications(prev => [{
      id: Date.now(),
      title: 'Notification',
      desc: '',
      time: 'Just now',
      unread: true,
      type: 'system',
      ...notification
    } as Notification, ...prev]);
    setHasUnreadNotifications(true);
  };

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setHasUnreadNotifications(false);
  }, []);

  const markNotificationAsRead = useCallback((id: number) => {
    setNotifications(prev => {
      const newNotifications = prev.map(n => n.id === id ? { ...n, unread: false } : n);
      const hasUnread = newNotifications.some(n => n.unread);
      setHasUnreadNotifications(hasUnread);
      return newNotifications;
    });
  }, []);

  const goBack = useCallback(() => {
    if (previousScreen) {
      // Use _setScreen directly to avoid updating previousScreen again
      // Or just use setScreen, but it will set previousScreen to current
      _setScreen(previousScreen);
      setPreviousScreen(null); // Clear it or handle stack
    } else {
      _setScreen(AppScreen.HOME);
    }
  }, [previousScreen]);

  const triggerReview = (options: { 
    title: string, 
    message: string, 
    notificationTitle: string, 
    notificationDesc: string,
    onComplete: () => void,
    nextScreen?: AppScreen
  }) => {
    setUnderReviewData({ title: options.title, message: options.message });
    setScreen(options.nextScreen || AppScreen.UNDER_REVIEW);
    
    // Simulate partner webhook after a longer delay (e.g., 15 seconds)
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
  };
 
  // Send Flow State
  const [sendAsset, setSendAsset] = useState<Coin | null>(null);
  const [sendRecipient, setSendRecipient] = useState<string>('');
  const [sendRecipientType, setSendRecipientType] = useState<string>('username');
  const [sendAmount, setSendAmount] = useState<string>('');
 
  // Swap Flow State
  const [swapFromAsset, setSwapFromAsset] = useState<Coin | null>(null);
  const [swapToAsset, setSwapToAsset] = useState<Coin | null>(null);
  const [swapAmount, setSwapAmount] = useState<string>('');
 
  // Withdraw Flow State
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
 
  // Bill Payment State
  const [selectedBillCategory, setSelectedBillCategory] = useState<{ id: string; name: string; icon: any } | null>(null);
  const [billDetails, setBillDetails] = useState<{ provider: string; customerId: string; amount: string; plan?: string }>({ provider: '', customerId: '', amount: '' });
  const [selectedVoucher, setSelectedVoucher] = useState<{ id: number; title: string; desc: string; color: string; minOrderAmount: number } | null>(null);
 
  // Security State
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
  const [transactionPin, setTransactionPin] = useState<string>('');
 
  // Checklist State
  const [checklist, setChecklist] = useState<{ id: string; completed: boolean }[]>([
    { id: 'fund', completed: false },
    { id: 'airtime', completed: false },
    { id: 'sell_crypto', completed: false },
  ]);

  const completeChecklistTask = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: true } : item));
  };
 
  const resetFlows = useCallback(() => {
    setSendAsset(null);
    setSendRecipient('');
    setSendRecipientType('username');
    setSendAmount('');
    setWithdrawAmount('');
    setGiftCardTradeType(null);
  }, [setSendAsset, setSendRecipient, setSendRecipientType, setSendAmount, setWithdrawAmount, setGiftCardTradeType]);

  useEffect(() => {
    const flowEntryPoints = [
      AppScreen.SEND_DESTINATION,
      AppScreen.GIFT_CARD_TRADE_OPTIONS,
      AppScreen.WITHDRAW_METHOD
    ];

    if (flowEntryPoints.includes(screen)) {
      resetFlows();
    }
  }, [screen, resetFlows]);
 
  const [favoriteCoinIds, setFavoriteCoinIds] = useState<string[]>(['btc', 'usdt']);
  const toggleFavoriteCoin = (id: string) => {
    setFavoriteCoinIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

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
      navigate,
      scannerTab, setScannerTab,
      pendingRoute, setPendingRoute,
      showPinModal, setShowPinModal,
      pinMode, setPinMode,
      onPinSuccess, setOnPinSuccess,
      onPinCancel, setOnPinCancel,
      walletBalance, setWalletBalance,
      pendingBalance, setPendingBalance,
      signupData, setSignupData,
      signupStep, setSignupStep,
      loginData, setLoginData,
      isCaptchaVerified, setIsCaptchaVerified,
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
      selectedChatId, setSelectedChatId,
      pushNotificationsEnabled, setPushNotificationsEnabled,
      pin, setPin,
      confirmPin, setConfirmPin,
      pinError, setPinError,
      isLoading, setIsLoading,
      showSplash, setShowSplash,
      isPinSetupRequired, setIsPinSetupRequired,
      coins, coinsMap,
      sendAsset, setSendAsset,
      sendRecipient, setSendRecipient,
      sendRecipientType, setSendRecipientType,
      sendAmount, setSendAmount,
      withdrawAmount, setWithdrawAmount,
      selectedBillCategory, setSelectedBillCategory,
      billDetails, setBillDetails,
      selectedVoucher, setSelectedVoucher,
      biometricEnabled, setBiometricEnabled,
      transactionPin, setTransactionPin,
      checklist, completeChecklistTask,
      savedBeneficiaries, setSavedBeneficiaries,
      underReviewData, setUnderReviewData,
      isSupportOpen, setIsSupportOpen,
      supportInitialView, setSupportInitialView,
      giftCardTradeType, setGiftCardTradeType,
      kycData, setKycData,
      isUsernameTaken, setIsUsernameTaken,
      isCheckingUsername, setIsCheckingUsername,
      notifications, addNotification,
      markAllNotificationsAsRead, markNotificationAsRead,
      triggerReview,
      goBack,
      points, setPoints
  }), [
      screen, previousScreen, navigate, scannerTab, pendingRoute, showPinModal, onPinSuccess, onPinCancel,
      walletBalance, pendingBalance, signupData, signupStep, loginData, isCaptchaVerified,
      activeTab, activeModal, globalOverlay, currency, hideBalance, bonusClaimed, hasUnreadNotifications,
      quickAccessIds, showQuickAccessDropdown, isTxLoading, selectedTx, selectedChatId,
      pushNotificationsEnabled,
      pin, confirmPin, pinError, isLoading, showSplash, coins, coinsMap, sendAsset, sendRecipient,
      sendRecipientType, sendAmount, withdrawAmount,
      selectedBillCategory, billDetails, selectedVoucher, biometricEnabled,
      transactionPin, checklist,
      savedBeneficiaries, underReviewData, isSupportOpen, supportInitialView,
      giftCardTradeType,
      kycData, isUsernameTaken, isCheckingUsername,
      points, notifications, addNotification,
      markAllNotificationsAsRead, markNotificationAsRead,
      goBack
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
