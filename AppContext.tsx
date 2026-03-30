import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
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
  
  // Navigation Logic State
  scannerTab: 'scan' | 'receive';
  setScannerTab: (tab: 'scan' | 'receive') => void;
  pendingRoute: AppScreen | null;
  setPendingRoute: (route: AppScreen | null) => void;
  navigate: (target: AppScreen, isFromNavBar?: boolean) => void;
  
  // PIN Modal State
  showPinModal: boolean;
  setShowPinModal: (show: boolean) => void;
  onPinSuccess: (() => void) | null;
  setOnPinSuccess: (callback: (() => void) | null) => void;
  onPinCancel: (() => void) | null;
  setOnPinCancel: (callback: (() => void) | null) => void;
  
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
  
  // Support State
  isSupportOpen: boolean;
  setIsSupportOpen: (isOpen: boolean) => void;
  supportInitialView: 'HELP_CENTER' | 'COMPLAINT_FORM' | 'CHAT' | 'CHAT_HISTORY';
  setSupportInitialView: (view: 'HELP_CENTER' | 'COMPLAINT_FORM' | 'CHAT' | 'CHAT_HISTORY') => void;
  
  // Rewards
  points: number;
  setPoints: (points: number) => void;

  // Gift Card State
  giftCardTradeType: 'BUY' | 'SELL' | null;
  setGiftCardTradeType: (type: 'BUY' | 'SELL' | null) => void;
  selectedGiftCard: any;
  setSelectedGiftCard: (card: any) => void;
  selectedGiftCardCountry: any;
  setSelectedGiftCardCountry: (country: any) => void;
  giftCardAmount: string;
  setGiftCardAmount: (amount: string) => void;
  giftCardCodeType: 'ECODE' | 'PHYSICAL' | null;
  setGiftCardCodeType: (type: 'ECODE' | 'PHYSICAL' | null) => void;

  // KYC State
  kycData: {
    bvn: string;
    nin: string;
    selfie: string | null;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NONE';
  };
  setKycData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<AppScreen>(AppScreen.HOME);
  const [activeModal, setActiveModal] = useState<AppScreen | null>(null);
  const [globalOverlay, setGlobalOverlay] = useState<AppScreen | null>(null);
 
  // Navigation Logic State
  const [scannerTab, setScannerTab] = useState<'scan' | 'receive'>('scan');
  const [pendingRoute, setPendingRoute] = useState<AppScreen | null>(null);

  // New states
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  const [bonusClaimed, setBonusClaimed] = useState<boolean>(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(true);
  const [quickAccessIds, setQuickAccessIds] = useState<string[]>(['withdraw', 'rewards', 'rates', 'pay_bills']);
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
  const [savedBeneficiaries, setSavedBeneficiaries] = useState<any[]>([]);
  const [underReviewData, setUnderReviewData] = useState<{ title: string, message: string } | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [supportInitialView, setSupportInitialView] = useState<'HELP_CENTER' | 'COMPLAINT_FORM' | 'CHAT' | 'CHAT_HISTORY'>('HELP_CENTER');
  
  const [giftCardTradeType, setGiftCardTradeType] = useState<'BUY' | 'SELL' | null>(null);
  const [selectedGiftCard, setSelectedGiftCard] = useState<any>(null);
  const [selectedGiftCardCountry, setSelectedGiftCardCountry] = useState<any>(null);
  const [giftCardAmount, setGiftCardAmount] = useState<string>('');
  const [giftCardCodeType, setGiftCardCodeType] = useState<'ECODE' | 'PHYSICAL' | null>(null);
  const [kycData, setKycData] = useState({
    bvn: '',
    nin: '',
    selfie: null,
    status: 'NONE' as const
  });
  const [notifications, setNotifications] = useState<any[]>(COINS.map((_, i) => ({
    id: i + 1,
    title: 'Welcome to Gogreen',
    desc: 'Start trading crypto with ease.',
    time: '2h ago',
    type: 'system',
    unread: i === 0
  })));

  const navigate = useCallback((target: AppScreen, isFromNavBar: boolean = false) => {
    if (target === AppScreen.SUPPORT) {
      if (screen === AppScreen.WELCOME_BACK || screen === AppScreen.LOGIN || screen === AppScreen.SIGNUP) {
        setIsSupportOpen(true);
      } else {
        setScreen(target);
        if (isFromNavBar) setActiveTab(AppScreen.SUPPORT);
      }
      return;
    }

    if (target === AppScreen.CHAT) {
      setScreen(AppScreen.CHAT);
      if (isFromNavBar) setActiveTab(AppScreen.CHAT);
      return;
    }
    
    if (isFromNavBar) setActiveTab(target);

    let finalTarget = target;

    // Crypto Wallet Generation Check
    if ([AppScreen.COIN_SELECTION, AppScreen.SWAP_AMOUNT, AppScreen.SWAP_SELECT_ASSET_FROM, AppScreen.SWAP_SELECT_ASSET_TO, AppScreen.SEND_SELECT_ASSET, AppScreen.COIN_DETAIL, AppScreen.CRYPTO_INVOICE].includes(finalTarget) && !areCryptoWalletsGenerated) {
       finalTarget = AppScreen.CRYPTO_WALLET_SETUP;
    }

    if (finalTarget === AppScreen.SCANNER) {
       setScannerTab('receive');
    }

    // PIN Verification Check for sensitive screens
    const requiresPin = [
      AppScreen.PAYMENT_SETTINGS,
      AppScreen.ACCOUNT_SETTINGS,
      AppScreen.SECURITY_SETTINGS,
      AppScreen.CHANGE_PIN,
      AppScreen.EDIT_PROFILE,
      AppScreen.DELETE_ACCOUNT,
      AppScreen.REFERRAL_WITHDRAW_CONFIRM,
      AppScreen.BANK_DETAILS,
      AppScreen.WITHDRAW_MONEY, // Added Withdraw to protected screens
    ];

    if (requiresPin.includes(finalTarget)) {
      setPendingRoute(finalTarget);
      setOnPinSuccess(() => {
        setScreen(finalTarget);
      });
      setShowPinModal(true);
      return;
    }

    setScreen(finalTarget);
  }, [screen, areCryptoWalletsGenerated, setScreen, setActiveTab, setIsSupportOpen, setOnPinSuccess, setShowPinModal]);

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
 
  // Checklist State
  const [checklist, setChecklist] = useState<{ id: string; completed: boolean }[]>([
    { id: 'fund', completed: false },
    { id: 'airtime', completed: false },
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
  }, [walletBalance]);

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
      navigate,
      scannerTab, setScannerTab,
      pendingRoute, setPendingRoute,
      showPinModal, setShowPinModal,
      onPinSuccess, setOnPinSuccess,
      onPinCancel, setOnPinCancel,
      walletBalance, setWalletBalance,
      pendingBalance, setPendingBalance,
      signupData, setSignupData,
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
      favoriteCoinIds, toggleFavoriteCoin,
      areCryptoWalletsGenerated, setAreCryptoWalletsGenerated,
      savedBeneficiaries, setSavedBeneficiaries,
      underReviewData, setUnderReviewData,
      isSupportOpen, setIsSupportOpen,
      supportInitialView, setSupportInitialView,
      giftCardTradeType, setGiftCardTradeType,
      selectedGiftCard, setSelectedGiftCard,
      selectedGiftCardCountry, setSelectedGiftCardCountry,
      giftCardAmount, setGiftCardAmount,
      giftCardCodeType, setGiftCardCodeType,
      kycData, setKycData,
      notifications, addNotification,
      triggerReview,
      points, setPoints
  }), [
      screen, previousScreen, navigate, scannerTab, pendingRoute, showPinModal, onPinSuccess, onPinCancel,
      walletBalance, pendingBalance, signupData, signupStep, loginData, isCaptchaVerified,
      theme, activeTab, activeModal, globalOverlay, currency, hideBalance, bonusClaimed, hasUnreadNotifications,
      quickAccessIds, showQuickAccessDropdown, isTxLoading, selectedTx,
      showReceiptOptionsModal, receiptTheme, showReferralWithdrawModal, pushNotificationsEnabled,
      pin, confirmPin, pinError, isLoading, showSplash, coins, coinsMap, sendAsset, sendRecipient,
      sendRecipientType, sendAmount, swapFromAsset, swapToAsset, swapAmount, withdrawAmount,
      referralBalance, selectedBillCategory, billDetails, selectedVoucher, biometricEnabled,
      transactionPin, checklist, favoriteCoinIds, areCryptoWalletsGenerated,
      savedBeneficiaries, underReviewData, isSupportOpen, supportInitialView,
      giftCardTradeType, selectedGiftCard, selectedGiftCardCountry, giftCardAmount, giftCardCodeType,
      kycData,
      points, notifications
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
