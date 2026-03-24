import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSwipeable } from 'react-swipeable';
import { Toaster, toast as hotToast } from 'react-hot-toast';

import { ErrorBoundary } from './src/components/ErrorBoundary';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { FloatingNavBar } from './src/components/FloatingNavBar';
import { AppScreen } from './types';
import { Logo, FullLogo, LogoText } from './components/Logo';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { SkeletonScreen, Skeleton } from './components/Skeleton';
import { Navbar } from './components/Navbar';
import { getAvatarUrl } from './src/constants/avatars';
import { SwipeButton } from './components/SwipeButton';
import { SlideCaptcha } from './components/Captcha';
import { Receipt } from './src/components/Receipt';
import { Icons } from './components/Icons';
import { BrandPattern } from './src/components/BrandPattern';
import { LoadingScreen } from './components/LoadingScreen';
import { BottomSheet } from './components/BottomSheet';
import { HomeScreen } from './src/screens/HomeScreen';
import { MeScreen } from './src/screens/MeScreen';
import { SendScreen } from './src/screens/SendScreen';
import { SwapScreen } from './src/screens/SwapScreen';
import { WithdrawScreen } from './src/screens/WithdrawScreen';
import { BillPaymentScreen } from './src/screens/BillPaymentScreen';
import { SecurityScreen } from './src/screens/SecurityScreen';
import { BankDetailsScreen } from './src/screens/BankDetailsScreen';
import { USSDDepositScreen } from './src/screens/USSDDepositScreen';
import { SellScreen } from './src/screens/SellScreen';
import { CoinDetailScreen } from './src/screens/CoinDetailScreen';
import { CryptoInvoiceScreen } from './src/screens/CryptoInvoiceScreen';
import { RewardsScreen } from './src/screens/RewardsScreen';
import { SupportScreen } from './src/components/SupportScreen';
import { CryptoHubScreen } from './src/screens/CryptoHubScreen';
import { UnderReviewScreen } from './src/screens/UnderReviewScreen';
import { GuidesAndTutorialsScreen } from './src/screens/GuidesAndTutorialsScreen';
import { BackHeader } from './src/components/BackHeader';
import { EmailSuggestions } from './src/components/EmailSuggestions';
import { TutorialOverlay } from './src/components/TutorialOverlay';
import { useAppContext } from './AppContext';
import { SecurityService } from './src/services/SecurityService';
import QRCode from "react-qr-code";
import { Scanner } from '@yudiel/react-qr-scanner';
import * as Constants from './constants';




const MODAL_SCREENS = [
  AppScreen.SEND_SELECT_ASSET, AppScreen.SEND_RECIPIENT, AppScreen.SEND_AMOUNT, AppScreen.SEND_CONFIRM, AppScreen.SEND_PROCESSING, AppScreen.SEND_FAILED, AppScreen.SEND_REJECTED,
  AppScreen.ADD_MONEY,
  AppScreen.TRANSACTION_HISTORY,
  AppScreen.RATES,
  AppScreen.SUPPORT,
  AppScreen.NOTIFICATIONS,
  AppScreen.COIN_SELECTION,
  AppScreen.RECEIPT_OPTIONS,
  AppScreen.RECEIPT_IMAGE_PREVIEW,
  AppScreen.RECEIPT_PDF_PREVIEW,
  AppScreen.SWAP_SELECT_ASSET_FROM, AppScreen.SWAP_SELECT_ASSET_TO, AppScreen.SWAP_AMOUNT, AppScreen.SWAP_CONFIRM,
  AppScreen.WITHDRAW_MONEY,
  AppScreen.PAYMENT_SETTINGS,
  AppScreen.BILL_PAYMENT_DETAILS, AppScreen.BILL_PAYMENT_SUMMARY,
  AppScreen.AIRTIME,
  AppScreen.CRYPTO_INVOICE,
  AppScreen.CRYPTO_WALLET_SETUP,
  AppScreen.BANK_ACCOUNT_SETUP,
  AppScreen.VIRTUAL_ACCOUNT,
  AppScreen.USSD_DEPOSIT,
  AppScreen.SUGGESTION_BOX,
  AppScreen.REPORT_BUG,
  AppScreen.GUIDES_AND_TUTORIALS,
  AppScreen.REFER_FRIEND,
  AppScreen.REFERRAL_WITHDRAW_CONFIRM,
  AppScreen.CHANGE_PIN,
  AppScreen.CHANGE_PASSWORD,
  AppScreen.EDIT_PROFILE,
  AppScreen.APP_UPDATE,
  AppScreen.DELETE_ACCOUNT,
  AppScreen.SECURITY,
  AppScreen.LOGGED_IN_DEVICES,
  AppScreen.BANK_DETAILS,
  AppScreen.ADD_BANK,
  AppScreen.ACCOUNT_SETTINGS,
  AppScreen.COIN_DETAIL,
  AppScreen.SELL_CRYPTO,
  AppScreen.COIN_RECEIVE,
  AppScreen.NETWORK_SELECTION,
  AppScreen.SELL_SUMMARY,
  AppScreen.SELL_PROCESSING,
  AppScreen.SELL_FAILED,
  AppScreen.SELL_REJECTED
];



interface SwipedItem {
  id: number;
  direction: 'left' | 'right';
}

interface TransactionItemProps {
  tx: any;
  swipedItem: SwipedItem | null;
  onSwipe: (id: number, dir: 'left' | 'right' | null) => void;
  onTap: () => void;
  onDetails: () => void;
  onRepeat: () => void;
  hideBalance: boolean;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  tx, 
  swipedItem, 
  onSwipe, 
  onTap, 
  onDetails, 
  onRepeat,
  hideBalance
}) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipe(tx.id, 'left'),
    onSwipedRight: () => onSwipe(tx.id, 'right'),
    onTap: onTap,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const isSwiped = swipedItem?.id === tx.id;
  const direction = isSwiped ? swipedItem?.direction : null;

  return (
    <div className="relative overflow-hidden rounded-[16px]">
      {/* Repeat Button (Revealed on Swipe Right) */}
      <div 
        className="absolute inset-y-0 left-0 flex items-center bg-primary rounded-l-[16px] transition-transform duration-300 ease-out z-0" 
        style={{ transform: direction === 'right' ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onRepeat(); }} 
          className="h-full px-6 text-white text-[10px] font-black uppercase bg-primary hover:bg-green-600 transition-colors rounded-l-[16px]"
        >
          Repeat
        </button>
      </div>

      {/* Details Button (Revealed on Swipe Left) */}
      <div 
        className="absolute inset-y-0 right-0 flex items-center bg-blue-500 rounded-r-[16px] transition-transform duration-300 ease-out z-0" 
        style={{ transform: direction === 'left' ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); onDetails(); }} 
          className="h-full px-6 text-white text-[10px] font-black uppercase bg-primary hover:bg-primary/90 transition-colors rounded-r-[16px]"
        >
          Details
        </button>
      </div>

      {/* Main Content */}
      <div
        {...handlers}
        className={`p-1.5 bg-white rounded-[14px] flex items-center gap-2 border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:shadow-md relative z-10 transform transition-transform duration-300 ease-out ${
          direction === 'left' ? 'translate-x-[-70px]' : direction === 'right' ? 'translate-x-[70px]' : 'translate-x-0'
        }`}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white p-1.5 shadow-sm relative" style={{ backgroundColor: tx.color }}>
          {tx.icon}
          {(tx.status === 'Pending' || tx.status === 'Processing') && (
             <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center border border-white shadow-sm z-10">
                <Icons.Loader className="w-2.5 h-2.5 text-white" />
             </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-0">
            <p className="font-bold text-gray-900 text-[10px]">{tx.type}</p>
            <div className="text-right">
              <p className="font-bold text-gray-900 text-[10px]">{hideBalance ? '••••••' : tx.fiatAmount}</p>
              <p className="text-[7px] font-medium text-gray-400">{hideBalance ? '••••••' : tx.cryptoAmount}</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[7px] text-gray-400 font-medium">{tx.date} • {tx.time}</p>
            <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full ${tx.status === 'Success' ? 'bg-green-100 text-green-700' : tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {tx.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RatesScreen = ({ onSell, onProtectedNavigation, areCryptoWalletsGenerated }: { onSell?: (coin: any) => void, onProtectedNavigation: (screen: AppScreen) => void, areCryptoWalletsGenerated: boolean }) => {
  const { setScreen, coins, favoriteCoinIds, toggleFavoriteCoin } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  const cryptoRates = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    let rates = coins.filter(c => c.id !== 'ngn');

    if (query) {
      rates = rates.filter(coin => {
        const name = coin.name.toLowerCase();
        const symbol = coin.symbol.toLowerCase();
        const id = coin.id.toLowerCase();
        return name.includes(query) || symbol.includes(query) || id.includes(query);
      });
    }

    return rates.sort((a, b) => {
      const aFav = favoriteCoinIds.includes(a.id);
      const bFav = favoriteCoinIds.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [coins, favoriteCoinIds, searchQuery]);

  return (
    <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
      <div className="w-full max-w-2xl flex flex-col h-full bg-white">
        <div className="px-6 pt-8 pb-4">
          <button 
            onClick={() => setScreen(AppScreen.HOME)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors mb-4 -ml-2"
          >
            <Icons.ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Crypto rates</h1>
          
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm font-medium text-gray-500">Receiving currency</p>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm active:scale-95 transition-transform cursor-pointer">
              <span className="text-lg">🇳🇬</span>
              <span className="text-xs font-bold text-gray-900">NGN</span>
              <Icons.ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6">
          <div className="mb-6">
            <Input 
              placeholder="Search by name or symbol..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="glass-light"
              icon={<Icons.Search className="w-4 h-4 text-gray-400" />}
              className="!bg-gray-50 !border-gray-100"
              inputClassName="!text-gray-900 font-bold"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {cryptoRates.length > 0 ? (
              cryptoRates.map((coin, i) => (
                <div 
                  key={i} 
                  onClick={() => {
                    if (areCryptoWalletsGenerated) {
                      onSell && onSell(coin);
                    } else {
                      onProtectedNavigation(AppScreen.COIN_DETAIL);
                    }
                  }}
                  className={`flex items-center justify-between p-4 sm:p-5 ${i !== cryptoRates.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors group cursor-pointer`}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: coin.color }}>
                        {coin.id === 'btc' ? <Icons.Bitcoin className="w-5 h-5" /> : <span className="text-[10px] font-bold">{coin.symbol[0]}</span>}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 leading-none">{coin.symbol} → NGN</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1">1 {coin.symbol} = ₦{coin.rate.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button className="w-9 h-9 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-colors">
                    <Icons.Send className="w-5 h-5 rotate-[-45deg] translate-x-0.5 -translate-y-0.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <Icons.Search className="w-8 h-8" />
                </div>
                <p className="text-gray-900 font-bold text-lg">No assets found</p>
                <Button 
                  variant="ghost" 
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-primary"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
          <p className="text-[10px] text-gray-400 font-medium text-center mt-6 uppercase tracking-widest">Rates are updated in real-time</p>
        </div>
      </div>
    </div>
  );
};

export const App = () => {


  const {
    screen, setScreen, previousScreen, setPreviousScreen,
    globalOverlay, setGlobalOverlay,
    walletBalance, setWalletBalance,
    pendingBalance, setPendingBalance,
    signupData, setSignupData,
    kycLevel, setKycLevel,
    signupStep, setSignupStep,
    loginData, setLoginData,
    isCaptchaVerified, setIsCaptchaVerified,
    isLoading, setIsLoading,
    isTxLoading, setIsTxLoading,
    hideBalance, setHideBalance,
    bonusClaimed, setBonusClaimed,
    pinError, setPinError,
    selectedTx, setSelectedTx,
    hasUnreadNotifications, setHasUnreadNotifications,
    pushNotificationsEnabled, setPushNotificationsEnabled,
    receiptTheme, setReceiptTheme,
    quickAccessIds, setQuickAccessIds,
    showReceiptOptionsModal, setShowReceiptOptionsModal,
    showReferralWithdrawModal, setShowReferralWithdrawModal,
    currency, setCurrency,
    showQuickAccessDropdown, setShowQuickAccessDropdown,
    activeTab, setActiveTab,
    activeModal, setActiveModal,
    seenScreens, markScreenSeen, resetScreenSeen,
    favoriteCoinIds, toggleFavoriteCoin,
    completeChecklistTask,
    areCryptoWalletsGenerated, setAreCryptoWalletsGenerated,
    areBankAccountsGenerated, setAreBankAccountsGenerated,
    underReviewData, setUnderReviewData,
    triggerReview,
    addNotification
  } = useAppContext();

  // Global Interception State
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [pendingRoute, setPendingRoute] = useState<AppScreen | null>(null);
  const [isGeneratingCryptoWallets, setIsGeneratingCryptoWallets] = useState<boolean>(false);
  const [isGeneratingBankAccounts, setIsGeneratingBankAccounts] = useState<boolean>(false);

  // User State
  const [tradeVolume, setTradeVolume] = useState<number>(0); 
  const [transactionPin, setTransactionPin] = useState<string>('');
  const [tempPin, setTempPin] = useState<string>('');
  const [welcomePin, setWelcomePin] = useState<string>('');
  const [referralBalance, setReferralBalance] = useState<number>(15000);
  const [points, setPoints] = useState<number>(1250);
  
  // KYC State
  // const [kycData, setKycData] = useState({ bvn: '', nin: '' }); // Removed in favor of signupData
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Tutorial Trigger Logic
  useEffect(() => {
    // Only trigger the welcome tour once when the user first lands on the Home screen
    if (screen === AppScreen.HOME && !seenScreens['welcome_tour']) {
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1500); // Delay for initial animations
      return () => clearTimeout(timer);
    }
  }, [screen, seenScreens]);

  useEffect(() => {
    if ([AppScreen.HOME, AppScreen.PAY_BILLS, AppScreen.SCANNER, AppScreen.REWARDS, AppScreen.ME].includes(screen)) {
      setActiveTab(screen);
    }
  }, [screen, setActiveTab]);
  
  // Features State
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [sellAmount, setSellAmount] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleTransactions, setVisibleTransactions] = useState<number>(10);
  const [txFilterType, setTxFilterType] = useState<string>('All');
  const [txFilterDate, setTxFilterDate] = useState<string>('All Time');
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [selectedBillCategory, setSelectedBillCategory] = useState<any>(null);
  const [sellError, setSellError] = useState<string | null>(null);
  const [billDetails, setBillDetails] = useState({ provider: '', customerId: '', amount: '' });
  const [bugReport, setBugReport] = useState({ subject: '', description: '' });
  const [toastToShow, setToastToShow] = useState<any>(null);
  
  // Settings State
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
  const [showVouchers, setShowVouchers] = useState<boolean>(false);

  const allServices = Constants.ALL_SERVICES;

  // Transaction Signing State
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [onPinSuccess, setOnPinSuccess] = useState<(() => void) | null>(null);
  
  // Global Loading State
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [globalLoadingMessage, setGlobalLoadingMessage] = useState<string>('Processing...');

  // OTP State
  const [otpValue, setOtpValue] = useState('');
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Send Flow State
  const [sendAsset, setSendAsset] = useState<any>(null);
  const [sendRecipient, setSendRecipient] = useState<string>('');
  const [sendRecipientType, setSendRecipientType] = useState<'address' | 'gogreen_id' | 'email' | 'username'>('address');
  const [sendAmount, setSendAmount] = useState<string>('');

  // Swap Flow State
  const [swapFromAsset, setSwapFromAsset] = useState<any>(null);
  const [swapToAsset, setSwapToAsset] = useState<any>(null);
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [swapQuote, setSwapQuote] = useState<{ rate: number, fee: number, received: number } | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<{id: number, text: string, sender: 'user' | 'support', time: string}[]>([
    { id: 1, text: "Hello! How can we help you today?", sender: 'support', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screen === AppScreen.SUPPORT) {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, screen]);

  const handleSendMessage = useCallback(() => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      text: chatInput,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    // Simulate support response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Thanks for reaching out! A support agent will be with you shortly to assist with your inquiry.",
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  }, [chatInput, chatMessages.length]);

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const [kycFiles, setKycFiles] = useState<Record<string, string>>({});
  const [advancedKycData, setAdvancedKycData] = useState({
    country: 'Nigeria',
    streetAddress: '',
    state: '',
    city: '',
    postalCode: '',
    dob: '',
    phone: '+234'
  });
  const [advancedOtpValue, setAdvancedOtpValue] = useState('');
  const [scannerTab, setScannerTab] = useState<'scan' | 'receive'>('scan');
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<any>(null);
  const [showScanPaymentModal, setShowScanPaymentModal] = useState(false);
  const [swipedItem, setSwipedItem] = useState<SwipedItem | null>(null);
  const [scanAmount, setScanAmount] = useState('');

  const getPasswordStrength = useCallback((p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }, []);




  const coins = useMemo(() => Constants.COINS.map(c => ({
    ...c,
    balance: c.id === 'ngn' ? walletBalance : (c.id === 'btc' ? 0.005 : (c.id === 'eth' ? 0.12 : (c.id === 'usdt' ? 450.53 : 0)))
  })), [walletBalance]);

  const coinsMap = useMemo(() => {
    return coins.reduce((acc, coin) => {
      acc[coin.id] = coin;
      return acc;
    }, {} as Record<string, typeof coins[0]>);
  }, [coins]);

  const filteredCoins = useMemo(() => {
    let result = coins.filter(coin => {
        const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });
    
    // Sort by favorites
    return result.sort((a, b) => {
      const aFav = favoriteCoinIds.includes(a.id);
      const bFav = favoriteCoinIds.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [coins, searchQuery, favoriteCoinIds]);

  const transactions = useMemo(() => Constants.TRANSACTIONS, []);
  const notifications = useMemo(() => Constants.NOTIFICATIONS, []);
  const rewardHistory = useMemo(() => Constants.REWARD_HISTORY, []);
  const vouchers = useMemo(() => Constants.VOUCHERS, []);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  useEffect(() => {
    if (screen === AppScreen.SPLASH) {
      const timer = setTimeout(() => {
        if (!pushNotificationsEnabled) {
          setScreen(AppScreen.NOTIFICATION_PERMISSION);
        } else {
          setScreen(AppScreen.ONBOARDING_1);
        }
        setIsLoading(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [screen, pushNotificationsEnabled]);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // Handle OTP Focus
  useEffect(() => {
    if (screen === AppScreen.OTP_VERIFICATION || screen === AppScreen.WELCOME_BACK || screen === AppScreen.KYC_PIN_SETUP) {
      const timer = setTimeout(() => {
        otpInputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Handle Unrefreshable Screens
  useEffect(() => {
    const unrefreshableScreens = [
      AppScreen.SPLASH,
      AppScreen.ONBOARDING_1,
      AppScreen.ONBOARDING_2,
      AppScreen.ONBOARDING_3,
      AppScreen.SIGNUP,
      AppScreen.LOGIN,
      AppScreen.FORGOT_PASSWORD,
      AppScreen.CHANGE_PASSWORD,
      AppScreen.OTP_VERIFICATION,
      AppScreen.ACCOUNT_CREATED,
      AppScreen.WELCOME_BACK,
      AppScreen.KYC_PIN_SETUP,
      AppScreen.CRYPTO_WALLET_SETUP,
      AppScreen.BANK_ACCOUNT_SETUP,
      AppScreen.NOTIFICATION_PERMISSION,
      AppScreen.ACCOUNT_OPENING_INFO,
      AppScreen.WELCOME_TO_GOGREEN,
    ];

    const isUnrefreshable = unrefreshableScreens.includes(screen);

    if (isUnrefreshable) {
      document.body.style.overscrollBehaviorY = 'none';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
          e.preventDefault();
        }
        if (e.key === 'F5') {
          e.preventDefault();
        }
      };
      
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        document.body.style.overscrollBehaviorY = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } else {
      document.body.style.overscrollBehaviorY = 'auto';
    }
  }, [screen]);

  const showToast = useCallback((typeOrMessage: string, title?: string, message?: string) => {
    if (typeof typeOrMessage === 'string' && title === undefined) {
      // Handle showToast("Message")
      setToastToShow({ type: 'success', message: typeOrMessage });
    } else {
      // Handle showToast('success', 'Title', 'Message')
      setToastToShow({ type: typeOrMessage, message: message || title || typeOrMessage });
    }
  }, []);

  // Navigation Logic with Protection
  const handleProtectedNavigation = useCallback((target: AppScreen) => {
    // Withdraw and Bill Payments require virtual account to be generated
    const requiresVirtualAccount = [
      AppScreen.WITHDRAW_MONEY,
      AppScreen.PAY_BILLS,
      AppScreen.AIRTIME,
      AppScreen.BILL_PAYMENT_DETAILS,
      AppScreen.BILL_PAYMENT_SUMMARY
    ];

    let finalTarget = target;

    if (requiresVirtualAccount.includes(target) && !areBankAccountsGenerated) {
      showToast('error', 'Virtual Account Required', 'Please generate a virtual account first.');
      finalTarget = AppScreen.BANK_ACCOUNT_SETUP;
    }

    // Crypto Wallet Generation Check
    if ([AppScreen.COIN_SELECTION, AppScreen.SWAP_AMOUNT, AppScreen.SWAP_SELECT_ASSET_FROM, AppScreen.SWAP_SELECT_ASSET_TO, AppScreen.SEND_SELECT_ASSET, AppScreen.COIN_DETAIL, AppScreen.CRYPTO_INVOICE].includes(finalTarget) && !areCryptoWalletsGenerated) {
       finalTarget = AppScreen.CRYPTO_WALLET_SETUP;
    }

    // Bank Account Generation Check
    if (finalTarget === AppScreen.ADD_MONEY && !areBankAccountsGenerated) {
       finalTarget = AppScreen.BANK_ACCOUNT_SETUP;
    }

    // BVN and KYC checks for generation screens
    const generationScreens = [
      AppScreen.CRYPTO_WALLET_SETUP,
      AppScreen.BANK_ACCOUNT_SETUP
    ];

    if (generationScreens.includes(finalTarget)) {
      if (!signupData.bvn) {
        setPendingRoute(target); // Remember original target
        setScreen(AppScreen.KYC_BVN);
        return;
      }
      
      if (kycLevel < 2) {
        setPendingRoute(target); // Remember original target
        showToast('error', 'KYC Required', 'You need at least Tier 2 KYC to generate accounts.');
        setScreen(AppScreen.KYC_INTRO);
        return;
      }
    }

    if (finalTarget === AppScreen.SCANNER) {
       setScannerTab('receive');
    }

    if (finalTarget !== target) {
      setPendingRoute(target);
    }

    setScreen(finalTarget);
  }, [signupData.bvn, areCryptoWalletsGenerated, areBankAccountsGenerated, setScreen, setScannerTab, kycLevel, showToast]);

  useEffect(() => {
    if (toastToShow) {
      const { type, message } = toastToShow;
      switch (type) {
        case 'success':
          hotToast.success(message);
          break;
        case 'error':
          hotToast.error(message);
          break;
        case 'warning':
          hotToast.error(message); // Using error style for warning for now
          break;
        default:
          hotToast(message);
          break;
      }
      setToastToShow(null);
    }
  }, [toastToShow]);

    const copyToClipboard = useCallback((text: string, message: string = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text);
    showToast('info', 'Copied!', message);
  }, [showToast]);

  const navigateToHistory = useCallback(() => {
    setIsTxLoading(true);
    setScreen(AppScreen.TRANSACTION_HISTORY);
    setTimeout(() => {
      setIsTxLoading(false);
    }, 1200);
  }, [setScreen]);

  const handleSellCrypto = useCallback(async () => {
    setGlobalLoadingMessage('Processing Sale...');
    setIsGlobalLoading(true);
    setSellError(null);
    
    try {
      // Simulate API call
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });
      
      const outcomes: AppScreen[] = [
        AppScreen.SELL_SUCCESS,
        AppScreen.SELL_SUCCESS,
        AppScreen.SELL_SUCCESS, // Weighted towards success
        AppScreen.SELL_PROCESSING,
        AppScreen.SELL_FAILED,
        AppScreen.SELL_REJECTED
      ];
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      setScreen(randomOutcome);
      
      if (randomOutcome === AppScreen.SELL_SUCCESS) {
        showToast('success', 'Success!', 'Your crypto has been sold successfully.');
        completeChecklistTask('sell_crypto');
      }
    } catch (error: any) {
      setSellError(error.message || "An unexpected error occurred during the transaction.");
      showToast('error', 'Transaction Failed', 'Please try again later.');
    } finally {
      setIsGlobalLoading(false);
    }
  }, [setScreen, showToast]);

  const showNavbar = useMemo(() => [
    AppScreen.HOME,
    AppScreen.PAY_BILLS,
    AppScreen.SCANNER,
    AppScreen.REWARDS,
    AppScreen.ME,
    AppScreen.TRANSACTION_HISTORY,
    AppScreen.SUGGESTION_BOX,
    AppScreen.NOTIFICATIONS,
  ].includes(screen), [screen]);

  const signupSteps = Constants.SIGNUP_STEPS;

  const validateCurrentStep = useCallback(() => {
    const step = signupSteps[signupStep];
    const val = (signupData as any)[step.key];
    console.log('Validating step:', step.key, 'val:', val, 'signupData:', signupData);
    
    if (step.key === 'otp') return otpValue.length === 4;
    if (step.key === 'captcha') return isCaptchaVerified;
    if (step.key === 'selfie') return !!kycFiles['selfie'];
    if (step.key === 'nin') return String((signupData as any)['nin'] || '').length >= 11;
    if (step.key === 'autoWithdrawToBank') return true;
    if (step.key === 'country') return !!signupData.country;
    if (step.key === 'referralSource') return !!signupData.referralSource;
    if (step.key === 'referralCode') return true;
    if (step.key === 'confirmPassword') return val.length >= 8 && val === signupData.password;
    if (step.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (step.key === 'username') return val && val.length > 3 && val.startsWith('₦');
    if (step.key === 'password') return val && val.length >= 8;
    return val && val.length >= 2;
  }, [signupStep, signupSteps, signupData, isCaptchaVerified, otpValue, kycFiles]);

  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const handleNextSignup = useCallback(async () => {
    if (signupStep < signupSteps.length - 1) {
      setIsSignupLoading(true);
      // Small delay for feedback
      await new Promise(r => setTimeout(r, 600));
      setSignupStep(prev => prev + 1);
      setIsSignupLoading(false);
      
      // Feedback for the user
      if (signupSteps[signupStep].isFileUpload) {
        showToast('success', 'Document Uploaded', 'Moving to the next step...');
      }
    } else {
      triggerReview({
        title: "Your verification is now under review",
        message: "We'll notify you once it's complete.",
        notificationTitle: "KYC Verified",
        notificationDesc: "Your identity has been confirmed successfully.",
        nextScreen: AppScreen.SIGNUP_UNDER_REVIEW,
        onComplete: () => {
          // Upgrade logic for signup KYC (e.g., set KYC level)
          setKycLevel(2);
        }
      });
    }
  }, [signupStep, signupSteps.length, setScreen, signupSteps, triggerReview, setKycLevel]);

  const handleOtpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = (e.target.value ?? '').replace(/[^0-9]/g, '').slice(0, 4);
    setOtpValue(val);
  }, []);

  const handleWelcomePinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = (e.target.value ?? '').replace(/[^0-9]/g, '').slice(0, 4);
    setWelcomePin(val);
    if (pinError) setPinError(false);
    
    if (val.length === 4) {
      setTimeout(() => {
        if (val === (transactionPin || '1234')) {
          markScreenSeen('welcome_tour');
          setScreen(AppScreen.HOME);
        } else {
          showToast('error', 'Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
          setPinError(true);
          setWelcomePin('');
        }
      }, 500);
    }
  }, [pinError, transactionPin, setScreen, showToast, markScreenSeen]);

  const handlePinSetup = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = (e.target.value ?? '').replace(/[^0-9]/g, '').slice(0, 4);
    setTempPin(val);
  }, []);

  const handleCryptoWalletGeneration = useCallback(() => {
      setGlobalLoadingMessage('Generating Wallets...');
      setIsGlobalLoading(true);
      setTimeout(() => {
         setIsGlobalLoading(false);
         triggerReview({
            title: "Wallets under review",
            message: "Your unique blockchain addresses are being generated and secured. You'll be notified once they are ready.",
            notificationTitle: "Wallets Ready",
            notificationDesc: "Your crypto addresses have been generated successfully.",
            onComplete: () => setAreCryptoWalletsGenerated(true)
         });
      }, 2000);
  }, [triggerReview, setAreCryptoWalletsGenerated]);

  const handleBankAccountGeneration = useCallback(() => {
      if (!signupData.bvn || signupData.bvn.length < 11) {
        showToast('error', 'BVN Required', 'Please verify your BVN to generate a bank account.');
        setScreen(AppScreen.KYC_BVN);
        return;
      }

      setGlobalLoadingMessage('Generating Account...');
      setIsGlobalLoading(true);
      setTimeout(() => {
         setIsGlobalLoading(false);
         triggerReview({
            title: "Account under review",
            message: "Your virtual bank account is being provisioned by our partner bank. This usually takes a few minutes.",
            notificationTitle: "Bank Account Ready",
            notificationDesc: "Your virtual bank account is now active and ready for deposits.",
            onComplete: () => setAreBankAccountsGenerated(true)
         });
      }, 2000);
  }, [triggerReview, setAreBankAccountsGenerated, signupData.bvn, setScreen, showToast]);

  const handleRefresh = useCallback(async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Simulate data refresh
        showToast('success', 'Refreshed', 'Latest data fetched successfully.');
        resolve();
      }, 1500);
    });
  }, [showToast]);

  const handleShareReceipt = useCallback(async () => {
    if (navigator.share && selectedTx) {
      try {
        await navigator.share({
          title: 'Transaction Receipt',
          text: `Receipt for ${selectedTx.type} of ${selectedTx.amount}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing receipt:', error);
      }
    } else {
      showToast('error', 'Share Failed', 'Sharing is not supported on this device');
    }
  }, [selectedTx, showToast]);

  const handleDownloadPDF = useCallback(() => {
    showToast('success', 'PDF Downloaded', 'Receipt has been saved as PDF.');
  }, [showToast]);

  const handleKeypadPress = useCallback((num: string | number) => {
    if (num === 'del') {
      setWelcomePin(prev => prev.slice(0, -1));
      if (pinError) setPinError(false);
    } else if (num !== '' && welcomePin.length < 4) {
      const newVal = welcomePin + num;
      setWelcomePin(newVal);
      if (pinError) setPinError(false);
      
      if (newVal.length === 4) {
          setTimeout(() => {
            if (newVal === (transactionPin || '1234')) {
                setScreen(AppScreen.HOME);
            } else {
                showToast('error', 'Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
                setPinError(true);
                setWelcomePin('');
            }
          }, 300);
      }
    }
  }, [welcomePin, pinError, transactionPin, setScreen, showToast]);

  const handleTransactionPinPress = useCallback((num: string | number) => {
    if (num === 'del') {
      setPinInput(prev => prev.slice(0, -1));
    } else if (num !== '' && pinInput.length < 4) {
      const newPin = pinInput + num;
      setPinInput(newPin);
      if (newPin.length === 4) {
        setTimeout(() => {
          if (SecurityService.validatePin(newPin, transactionPin)) {
            setShowPinModal(false);
            setPinInput('');
            if (onPinSuccess) onPinSuccess();
          } else {
            showToast('error', 'Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
            setPinInput('');
          }
        }, 300);
      }
    }
  }, [pinInput, transactionPin, onPinSuccess, showToast]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Type Filter
      let matchesType = true;
      if (txFilterType !== 'All') {
        const typeLower = tx.type.toLowerCase();
        if (txFilterType === 'Buy') matchesType = typeLower.includes('bought') || typeLower.includes('buy');
        else if (txFilterType === 'Sell') matchesType = typeLower.includes('sold') || typeLower.includes('sell');
        else if (txFilterType === 'Add Fund') matchesType = typeLower.includes('add fund') || typeLower.includes('deposit') || typeLower.includes('funded');
        else if (txFilterType === 'Withdrawal') matchesType = typeLower.includes('withdrawal') || typeLower.includes('airtime') || typeLower.includes('data') || typeLower.includes('cable');
      }

      // Date Filter
      let matchesDate = true;
      if (txFilterDate !== 'All Time') {
        const txDate = new Date(tx.date);
        const now = new Date();
        if (txFilterDate === 'Today') {
          matchesDate = txDate.toDateString() === now.toDateString();
        } else if (txFilterDate === 'This Week') {
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          matchesDate = txDate >= weekAgo;
        } else if (txFilterDate === 'This Month') {
          matchesDate = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        }
      }

      return matchesType && matchesDate;
    });
  }, [transactions, txFilterType, txFilterDate]);

  const TransactionStatusScreen: React.FC<{
    status: 'processing' | 'success' | 'failed' | 'rejected';
    title: string;
    message: string;
    amount?: string;
    onDone: () => void;
    onRetry?: () => void;
    onViewReceipt?: () => void;
  }> = ({ status, title, message, amount, onDone, onRetry, onViewReceipt }) => {
    const config = {
      processing: { icon: <LoadingScreen message={message} />, color: 'bg-transparent', textColor: 'text-primary', shadow: 'shadow-none' },
      success: { icon: <Icons.Check />, color: 'bg-[#2da437]', textColor: 'text-[#2da437]', shadow: 'shadow-[#2da437]/30' },
      failed: { icon: <Icons.Alert />, color: 'bg-red-500', textColor: 'text-red-500', shadow: 'shadow-red-500/30' },
      rejected: { icon: <Icons.Trash />, color: 'bg-red-500', textColor: 'text-red-500', shadow: 'shadow-red-500/30' },
    }[status];

    if (status === 'processing') {
      return (
        <div className="flex-1 flex flex-col bg-white items-center justify-center animate-fade-in">
          {config.icon}
          <div className="mt-8 px-8 w-full max-w-md">
            <Button 
              variant="outline"
              className="w-full !h-14 !rounded-2xl"
              onClick={onDone}
            >
              Go to Home
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-white items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-full max-w-md">
          <div className={`w-24 h-24 ${config.color} rounded-full flex items-center justify-center mb-8 shadow-lg ${config.shadow} ${status === 'success' ? 'animate-epic-bounce' : (status === 'failed' || status === 'rejected') ? 'animate-shake' : ''} mx-auto text-white`}>
            <div className="w-12 h-12 flex items-center justify-center">
              {config.icon}
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-500 font-medium mb-12">{message}</p>
          
          {amount && (
            <div className="mb-12 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transaction Amount</p>
              <p className={`text-2xl font-black ${config.textColor}`}>{amount}</p>
            </div>
          )}
          
          <div className="space-y-3">
            {status === 'failed' && onRetry && (
              <Button className="w-full !h-14 !rounded-2xl" onClick={onRetry}>Try Again</Button>
            )}
            <Button 
              variant={status === 'failed' ? 'outline' : 'primary'}
              className={`w-full !h-14 !rounded-2xl ${status === 'success' ? '!bg-[#2da437] !text-white shadow-lg shadow-[#2da437]/20' : ''}`}
              onClick={onDone}
            >
              {status === 'processing' ? 'Go to Home' : 'Done'}
            </Button>
            {status === 'success' && onViewReceipt && (
              <button 
                className="w-full h-14 rounded-2xl bg-white border border-[#d4d3d3] text-gray-600 text-sm font-bold active:bg-gray-50 transition-colors"
                onClick={onViewReceipt}
              >
                View Receipt
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderScreenContent = (screenToRender: AppScreen) => {
    switch (screenToRender) {
      case AppScreen.SPLASH:
        return (
          <div className="fixed inset-0 z-50 bg-dark flex flex-col items-center justify-center animate-fade-in overflow-hidden">
             <div className="absolute top-12 left-6 opacity-20 animate-coin-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}>
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-yellow-900 font-bold shadow-lg shadow-yellow-500/50">฿</div>
             </div>
             <div className="absolute top-16 right-6 opacity-20 animate-coin-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/50">₦</div>
             </div>
             <div className="absolute bottom-32 left-8 opacity-20 animate-coin-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/50">Ξ</div>
             </div>
             <div className="absolute bottom-40 right-8 opacity-20 animate-coin-bounce" style={{ animationDuration: '2.5s', animationDelay: '1.5s' }}>
                <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/50">₮</div>
             </div>

             <div className="relative animate-coin-bounce px-8 z-10">
                <Logo className="w-64 h-24 mb-4 relative z-10" variant="premium" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-4 bg-primary/20 blur-xl rounded-full scale-x-150 animate-shadow-pulse" />
             </div>
             <div className="absolute bottom-16 text-white/60 text-[10px] tracking-[0.4em] font-black uppercase animate-pulse text-center z-10">Exchanging across continents.</div>
          </div>
        );

      case AppScreen.WELCOME_BACK:
        return (
          <div className="flex-1 flex flex-col bg-white p-8 animate-fade-in text-gray-900 relative overflow-hidden justify-center items-center">
             <div className="absolute top-4 right-4">
                <button onClick={() => setGlobalOverlay(AppScreen.SUPPORT)} className="text-primary font-bold text-sm">Get Help</button>
             </div>
             <div className="w-full max-w-xs mx-auto flex flex-col items-center">
               <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 mb-4 relative z-10">
                   <img src={signupData.profileImage || getAvatarUrl(signupData.username || 'hassan')} className="w-full h-full object-cover" alt="Avatar" />
               </div>
               <h3 className="text-lg font-black text-gray-900 mb-8 tracking-tight">Welcome back, {signupData.username || 'Hassan'}</h3>
               
               <div className="relative w-full flex flex-col items-center mb-8">
                   <div className={`flex gap-4 justify-center relative z-10 mb-12 ${pinError ? 'animate-shake' : ''}`}>
                     {[0, 1, 2, 3].map(i => {
                       const isFilled = welcomePin.length > i;
                       return (
                        <div 
                          key={i} 
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${isFilled ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                        </div>
                       );
                     })}
                   </div>

                   {/* Custom Keypad */}
                   <div className="grid grid-cols-3 gap-x-12 gap-y-8 w-full max-w-[240px]">
                       {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, idx) => (
                         <button 
                            key={idx}
                            onClick={() => {
                              if (num === 'del') {
                                setWelcomePin(prev => prev.slice(0, -1));
                              } else if (num !== '' && welcomePin.length < 4) {
                                const newPin = welcomePin + String(num);
                                setWelcomePin(newPin);
                                if (newPin.length === 4) {
                                  // Validate PIN
                                  if (newPin === transactionPin) {
                                    markScreenSeen('welcome_tour');
                                    setScreen(AppScreen.HOME);
                                    setWelcomePin('');
                                  } else {
                                    setPinError(true);
                                    setTimeout(() => {
                                      setPinError(false);
                                      setWelcomePin('');
                                    }, 500);
                                    showToast('error', 'Incorrect PIN');
                                  }
                                }
                              }
                            }}
                            className={`w-12 h-12 flex items-center justify-center text-xl font-medium active:scale-90 transition-transform ${
                               num === '' ? 'invisible' : 
                               num === 'del' ? 'text-gray-400 hover:text-red-500' : 
                               'text-gray-900 hover:bg-gray-50 rounded-full'
                            }`}
                         >
                            {num === 'del' ? <Icons.Delete className="w-5 h-5" /> : num}
                         </button>
                      ))}
                   </div>
                   
                   <button onClick={() => { /* Handle biometric */ }} className="mt-8 flex items-center gap-2 text-primary font-bold text-xs">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51.26 4"/><path d="M17 12a5 5 0 0 0-5-5 5 5 0 0 0-5 5"/><path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10"/><path d="M12 17a2 2 0 0 1 2-2c1.02 0 2.51.1 4-.26"/></svg>
                     <span>Biometric Login</span>
                   </button>
               </div>

               <div className="flex flex-col items-center gap-4 mt-8">
                 <button onClick={() => setScreen(AppScreen.LOGIN)} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600">Switch Account</button>
               </div>
             </div>
          </div>
        );

      case AppScreen.ONBOARDING_1:
      case AppScreen.ONBOARDING_2:
      case AppScreen.ONBOARDING_3:
        return <OnboardingScreen onComplete={() => setScreen(AppScreen.ACCOUNT_OPENING_INFO)} onLogin={() => setScreen(AppScreen.LOGIN)} />;
      
      case AppScreen.LOGIN:
          return (
            <div className="flex-1 flex flex-col bg-white p-8 animate-slide-up overflow-y-auto no-scrollbar items-center justify-center">
              <div className="w-full max-w-md">
                  <div className="flex justify-between items-center mb-12">
                    <button onClick={() => setScreen(AppScreen.ONBOARDING_3)} className="text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <Logo className="w-24 h-8" variant="premium" />
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-12">Login to your hub</p>
                  <div className="space-y-6">
                    <div className="flex flex-col">
                      <Input 
                        label="Email or Username" 
                        placeholder="kehindevhassan" 
                        prefix="₦-"
                        variant="default"
                        value={loginData.email} 
                        onChange={e => {
                            let newVal = e.target.value ?? '';
                            const raw = (newVal || '').replace(/^[₦-]+/, '').replace(/\s/g, '');
                            setLoginData({...loginData, email: '₦-' + raw});
                        }} 
                      />
                      <EmailSuggestions value={loginData.email} onSelect={(val) => setLoginData({...loginData, email: val})} />
                    </div>
                    <Input label="Password" type="password" placeholder="••••••••" variant="default" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value.replace(/\s/g, '')})} />
                    <div className="flex justify-end">
                      <Button variant="ghost" onClick={() => setScreen(AppScreen.FORGOT_PASSWORD)} className="!w-auto !h-8 !px-0 !text-gray-500">Forgot Password?</Button>
                    </div>
                    <Button onClick={() => { markScreenSeen('welcome_tour'); setScreen(AppScreen.HOME); }}>Login</Button>
                    <div className="text-center pt-4">
                      <Button variant="ghost" onClick={() => setScreen(AppScreen.SIGNUP)} className="!w-auto mx-auto opacity-60 hover:opacity-100 !text-gray-500">Don't have an account? <span className="text-primary ml-1">Sign Up</span></Button>
                    </div>
                  </div>
              </div>
            </div>
          );

      case AppScreen.FORGOT_PASSWORD:
        return (
          <div className="flex-1 flex flex-col bg-white p-8 animate-fade-in relative overflow-hidden items-center justify-center">
             <div className="w-full max-w-md">
                <button onClick={() => setScreen(AppScreen.LOGIN)} className="text-gray-400 mb-10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-4xl font-black text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-10">Enter your email to receive instructions</p>
                
                <div className="space-y-6">
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">Email Address</label>
                      <Input 
                        value={loginData.email} 
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        placeholder="name@example.com" 
                        type="email" 
                        variant="default"
                      />
                   </div>
                   <Button onClick={() => { showToast('success', 'Reset Link Sent', 'Please check your email for instructions.'); setScreen(AppScreen.LOGIN); }}>Send Reset Link</Button>
                </div>
             </div>
          </div>
        );

      case AppScreen.SIGNUP:
        const currentStep = signupSteps[signupStep];
        const isMismatchedPassword = currentStep.key === 'confirmPassword' && signupData.confirmPassword.length >= 8 && signupData.confirmPassword !== signupData.password;
        
        return (
          <div className="flex-1 flex flex-col bg-white p-8 animate-slide-up overflow-y-auto no-scrollbar items-center justify-center">
            <div className="w-full max-w-md">
                <button onClick={() => signupStep > 0 ? setSignupStep(signupStep - 1) : setScreen(AppScreen.ONBOARDING_3)} className="text-gray-400 mb-10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-4xl font-black text-gray-900 mb-2">Create Account</h2>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-10">Step {signupStep + 1} of {signupSteps.length}</p>
                
                <div className="space-y-6">
                  {currentStep.isDropdown ? (
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">{currentStep.label}</label>
                      <div 
                        onClick={() => setIsCountryOpen(!isCountryOpen)}
                        className={`w-full py-4 px-4 bg-gray-50 border ${isCountryOpen ? 'border-primary' : 'border-gray-200'} rounded-[20px] flex justify-between items-center text-gray-900 font-medium cursor-pointer active:bg-gray-100 transition-all`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🇳🇬</span>
                          <span>{signupData.country}</span>
                        </div>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      {isCountryOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[20px] overflow-hidden z-30 shadow-2xl animate-fade-in">
                          <div 
                            onClick={() => { setSignupData({...signupData, country: 'Nigeria'}); setIsCountryOpen(false); }}
                            className="p-4 hover:bg-gray-50 flex items-center gap-3 cursor-pointer border-b border-gray-50 last:border-0"
                          >
                            <span className="text-xl">🇳🇬</span>
                            <span className="text-gray-900 text-sm font-bold">Nigeria</span>
                          </div>
                        </div>
                      )}
                      <p className="text-[9px] text-gray-400 italic ml-1 mt-1">Gogreen currently supports Nigeria only.</p>
                    </div>
                  ) : currentStep.isSourceDropdown ? (
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">{currentStep.label}</label>
                      <div 
                        onClick={() => setIsSourceOpen(!isSourceOpen)}
                        className={`w-full py-4 px-4 bg-gray-50 border ${isSourceOpen ? 'border-primary' : 'border-gray-200'} rounded-[20px] flex justify-between items-center text-gray-900 font-medium cursor-pointer active:bg-gray-100 transition-all`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${!signupData.referralSource ? 'text-gray-400' : ''}`}>{signupData.referralSource || 'Select an option'}</span>
                        </div>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isSourceOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      {isSourceOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[20px] overflow-hidden z-30 shadow-2xl animate-fade-in max-h-60 overflow-y-auto">
                          {['Friends & Family', 'LinkedIn', 'Google', 'Gogreen Blog', 'X (formerly Twitter)', 'Instagram', 'YouTube', 'Influencers', 'Events', 'Communities', 'Others'].map((source) => (
                            <div 
                              key={source}
                              onClick={() => { setSignupData({...signupData, referralSource: source}); setIsSourceOpen(false); }}
                              className="p-4 hover:bg-gray-50 flex items-center gap-3 cursor-pointer border-b border-gray-50 last:border-0"
                            >
                              <span className="text-gray-900 text-sm font-bold">{source}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : currentStep.isPreference ? (
                    <div className="flex flex-col gap-4">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">{currentStep.label}</label>
                      <div className="space-y-3">
                        <div 
                          onClick={() => setSignupData({...signupData, autoWithdrawToBank: true})}
                          className={`p-5 rounded-[24px] border transition-all cursor-pointer flex items-center gap-4 ${signupData.autoWithdrawToBank ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(46,139,58,0.05)]' : 'border-gray-100 bg-gray-50'}`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${signupData.autoWithdrawToBank ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                            {signupData.autoWithdrawToBank && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-bold text-sm">Automatic Bank Payment</p>
                            <p className="text-gray-400 text-[10px]">Crypto deposits are paid directly to your bank.</p>
                          </div>
                        </div>
                        <div 
                          onClick={() => setSignupData({...signupData, autoWithdrawToBank: false})}
                          className={`p-5 rounded-[24px] border transition-all cursor-pointer flex items-center gap-4 ${!signupData.autoWithdrawToBank ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(46,139,58,0.05)]' : 'border-gray-100 bg-gray-50'}`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${!signupData.autoWithdrawToBank ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                            {!signupData.autoWithdrawToBank && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-bold text-sm">Store in Gogreen Balance</p>
                            <p className="text-gray-400 text-[10px]">Add Funds are kept in your wallet for manual withdrawal.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : currentStep.key === 'captcha' ? (
                    <SlideCaptcha isVerified={isCaptchaVerified} onVerify={() => setIsCaptchaVerified(true)} />
                  ) : currentStep.isOtp ? (
                    <div className="flex flex-col gap-4">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">{currentStep.label}</label>
                      <p className="text-primary/70 text-[9px] font-medium leading-relaxed italic">
                        *Check your <span className="underline">spam</span> or <span className="underline">promotion</span> folder if you can't find the OTP in your inbox.
                      </p>
                      <div 
                        className="flex gap-4 justify-between relative cursor-text"
                        onClick={() => otpInputRef.current?.focus()}
                      >
                        {[0, 1, 2, 3].map(i => (
                          <div 
                            key={i} 
                            className={`flex-1 aspect-square bg-gray-50 border ${otpValue.length === i ? 'border-primary shadow-[0_0_15px_rgba(26,93,34,0.1)]' : 'border-gray-200'} rounded-2xl flex items-center justify-center text-3xl font-black transition-all text-gray-900`}
                          >
                            {otpValue[i] || ''}
                            {otpValue.length === i && <div className="w-0.5 h-8 bg-primary animate-pulse ml-1" />}
                          </div>
                        ))}
                      </div>
                      <input
                        ref={otpInputRef}
                        type="text"
                        pattern="\d*"
                        inputMode="numeric"
                        value={otpValue}
                        onChange={handleOtpChange}
                        className="absolute inset-0 opacity-0 cursor-default"
                        autoComplete="one-time-code"
                        style={{ fontSize: '16px' }}
                      />
                      <Button variant="ghost" onClick={() => showToast('info', 'OTP Resent', 'A new verification code has been sent.')} className="mt-2 opacity-60 hover:opacity-100 !text-gray-500">
                        Resend Code in 0:45
                      </Button>
                    </div>
                  ) : currentStep.isFileUpload ? (
                    <div className="flex flex-col gap-4">
                       <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">{currentStep.label}</label>
                       <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                     setKycFiles(prev => ({ ...prev, [currentStep.key]: reader.result as string }));
                                  };
                                  reader.readAsDataURL(file);
                               }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={`w-full p-8 rounded-[32px] border-2 border-dashed ${kycFiles[currentStep.key] ? 'border-primary bg-primary/5' : 'border-gray-200 bg-gray-50'} flex flex-col items-center justify-center gap-3 transition-all`}>
                             {kycFiles[currentStep.key] ? (
                                <>
                                   <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary shadow-lg">
                                      <img src={kycFiles[currentStep.key]} className="w-full h-full object-cover" alt="Preview" />
                                   </div>
                                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">Document Attached</span>
                                   <button onClick={(e) => { e.preventDefault(); setKycFiles(prev => { const n = {...prev}; delete n[currentStep.key]; return n; }); }} className="z-20 px-4 py-2 bg-white rounded-xl shadow-sm text-red-500 text-[9px] font-black uppercase tracking-widest">Remove</button>
                                </>
                             ) : (
                                <>
                                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><Icons.Image /></div>
                                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tap to upload document</span>
                                </>
                             )}
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 relative">
                      {currentStep.key === 'fullName' && (
                        <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-4 flex gap-4 mb-4 animate-fade-in">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Icons.Info className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-gray-700 text-xs font-medium leading-relaxed">
                            Please enter your first and middle names exactly as they appear on your government-issued ID to avoid verification delays.
                          </p>
                        </div>
                      )}
                      <Input 
                        label={currentStep.label} 
                        type={currentStep.type || 'text'}
                        placeholder={currentStep.placeholder} 
                        variant="default"
                        value={(signupData as any)[currentStep.key] || ''} 
                        onPaste={currentStep.key === 'confirmPassword' ? (e) => e.preventDefault() : undefined}
                        onChange={e => {
                            let newVal = e.target.value ?? '';
                            if (currentStep.key === 'username' || currentStep.key === 'password' || currentStep.key === 'confirmPassword' || currentStep.key === 'referralCode') {
                                newVal = newVal.replace(/\s/g, '');
                            }
                            if (currentStep.key === 'username' || currentStep.key === 'referralCode') {
                                 const raw = (newVal || '').replace(/^[₦-]+/, '');
                                 newVal = '₦' + raw.replace(/-/g, '');
                            }
                            setSignupData({...signupData, [currentStep.key]: newVal});
                        }} 
                      />
                      {currentStep.type === 'email' && (
                        <EmailSuggestions value={signupData.email} onSelect={(val) => setSignupData({...signupData, email: val})} />
                      )}
                      {currentStep.key === 'password' && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          {[
                            { label: 'Minimum of 8 characters', valid: signupData.password.length >= 8 },
                            { label: 'Maximum of 64 characters', valid: signupData.password.length <= 64 && signupData.password.length > 0 },
                            { label: 'Upper case character', valid: /[A-Z]/.test(signupData.password) },
                            { label: 'Lower case character', valid: /[a-z]/.test(signupData.password) },
                            { label: 'At least one number', valid: /[0-9]/.test(signupData.password) },
                            { label: 'At least one special character', valid: /[^A-Za-z0-9]/.test(signupData.password) },
                          ].map((req, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.valid ? 'bg-primary text-white' : 'bg-gray-100 text-gray-300'}`}>
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              </div>
                              <span className={`text-[10px] font-medium transition-colors ${req.valid ? 'text-gray-900' : 'text-gray-400'}`}>{req.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {isMismatchedPassword && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 ml-1 animate-pulse">Passwords do not match</p>
                      )}
                    </div>
                  )}
                  <div className="pt-4">
                    <Button 
                      disabled={!validateCurrentStep() || isCountryOpen || isSignupLoading} 
                      onClick={handleNextSignup}
                    >
                      {isSignupLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : signupStep === signupSteps.length - 1 ? 'Continue' : 'Continue'}
                    </Button>
                  </div>
                </div>
            </div>
          </div>
        );
      
      case AppScreen.SIGNUP_UNDER_REVIEW:
        return (
          <div className="flex-1 flex flex-col bg-white items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden">
             <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                <div className="w-32 h-32 mb-8 flex items-center justify-center">
                   <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-600/20 animate-pulse">
                     <Icons.Hourglass className="w-12 h-12" />
                   </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-4 px-4 leading-tight">Your verification is now under review</h2>
                <p className="text-gray-500 text-sm font-medium mb-12">We'll notify you once it's complete.</p>
                <div className="w-full px-4">
                  <Button onClick={() => setScreen(AppScreen.KYC_PIN_SETUP)} className="w-full !h-14 !rounded-2xl !bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold !text-sm shadow-lg shadow-emerald-500/20">Continue</Button>
                </div>
                {/* Hidden button to simulate user coming back and being approved */}
                <button onClick={() => setScreen(AppScreen.KYC_PIN_SETUP)} className="absolute bottom-0 opacity-0 w-10 h-10"></button>
             </div>
          </div>
        );

      case AppScreen.OTP_VERIFICATION:
        return (
          <div className="flex-1 flex flex-col bg-white p-10 animate-fade-in text-gray-900 relative overflow-hidden items-center justify-center">
            <div className="w-full max-w-md">
                <h2 className="text-4xl font-black mb-2 mt-10">Verify Email</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">Enter the 4-digit code sent to you</p>
                <p className="text-primary/70 text-[9px] font-medium leading-relaxed mb-12 italic">
                  *Check your <span className="underline">spam</span> or <span className="underline">promotion</span> folder if you can't find the OTP in your inbox.
                </p>
                <div 
                  className="flex gap-4 justify-between mb-12 relative cursor-text"
                  onClick={() => otpInputRef.current?.focus()}
                >
                  {[0, 1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      className={`flex-1 aspect-square bg-gray-50 border ${otpValue.length === i ? 'border-primary shadow-[0_0_15px_rgba(26,93,34,0.1)]' : 'border-gray-200'} rounded-2xl flex items-center justify-center text-3xl font-black transition-all text-gray-900`}
                    >
                      {otpValue[i] || ''}
                      {otpValue.length === i && <div className="w-0.5 h-8 bg-primary animate-pulse ml-1" />}
                    </div>
                  ))}
                </div>
                <input
                  ref={otpInputRef}
                  type="text"
                  pattern="\d*"
                  inputMode="numeric"
                  value={otpValue}
                  onChange={handleOtpChange}
                  className="absolute inset-0 opacity-0 cursor-default"
                  autoComplete="one-time-code"
                  style={{ fontSize: '16px' }}
                />
                <Button 
                  disabled={otpValue.length < 4}
                  onClick={() => setScreen(AppScreen.KYC_INTRO)}
                  className="!bg-emerald-600 hover:!bg-emerald-700"
                >
                  Continue
                </Button>
                <Button variant="ghost" onClick={() => showToast("Verification code resent!")} className="mt-8 opacity-60 hover:opacity-100 !text-gray-500">
                  Resend Code in 0:45
                </Button>
            </div>
          </div>
        );
            case AppScreen.BIOMETRIC_ENABLE:
        return (
          <div className="flex-1 flex flex-col bg-white animate-fade-in items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
              <Icons.Fingerprint className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Instant and secure login with Touch ID</h2>
            <p className="text-gray-500 text-sm font-medium mb-12 max-w-[280px]">You can instantly and securely log in to your account using biometric data.</p>
            <Button onClick={() => { setBiometricEnabled(true); setScreen(AppScreen.SECURITY); }} className="w-full !h-14 !rounded-2xl mb-4">Enable</Button>
            <Button variant="ghost" onClick={() => setScreen(AppScreen.SECURITY)} className="w-full !h-14 !rounded-2xl">Skip for now</Button>
          </div>
        );

      case AppScreen.NOTIFICATION_PERMISSION:
        return (
          <div className="flex-1 flex flex-col bg-white animate-fade-in items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
              <Icons.Bell className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Instant notifications</h2>
            <p className="text-gray-500 text-sm font-medium mb-12 max-w-[280px]">We can notify you when something important happens, like your balance changes or there's a security alert.</p>
            <Button onClick={() => { setPushNotificationsEnabled(true); setScreen(AppScreen.ONBOARDING_1); }} className="w-full !h-14 !rounded-2xl mb-4">Turn on notifications</Button>
            <Button variant="ghost" onClick={() => setScreen(AppScreen.ONBOARDING_1)} className="w-full !h-14 !rounded-2xl">Skip for now</Button>
          </div>
        );

      case AppScreen.ACCOUNT_OPENING_INFO:
        return (
          <div className="flex-1 flex flex-col bg-white animate-fade-in p-8 pt-24">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-10">
              <Icons.FileText className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">Important account opening information</h2>
            <p className="text-gray-500 text-sm font-medium mb-12 text-justify leading-relaxed">To help the government fight the funding of terrorism and money laundering activities, Federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account.</p>
            <div className="flex items-start gap-3 mb-12">
              <div className="relative flex items-center justify-center shrink-0 mt-1">
                <input 
                  type="checkbox" 
                  className="peer appearance-none w-5 h-5 rounded border border-gray-300 checked:bg-emerald-600 checked:border-emerald-600 transition-all cursor-pointer" 
                />
                <Icons.Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <p className="text-gray-500 text-xs text-justify leading-relaxed">By proceeding, you authorize Gogreen and partners to verify your identity and access third-party information for compliance and fraud prevention.</p>
            </div>
            <div className="mt-auto">
              <Button onClick={() => setScreen(AppScreen.SIGNUP)} className="w-full !h-14 !rounded-2xl">Continue</Button>
            </div>
          </div>
        );

      case AppScreen.WELCOME_TO_GOGREEN:
        return (
          <div className="flex-1 flex flex-col bg-white animate-fade-in items-center justify-center p-8 text-center text-gray-900">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 backdrop-blur-md">
              <Icons.CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black mb-4">Welcome to Gogreen!</h2>
            <p className="text-gray-500 text-sm font-medium mb-12 max-w-[280px]">Your account setup is complete. What would you like to do next?</p>
            
            <div className="w-full max-w-md space-y-4">
              <button 
                onClick={() => setScreen(AppScreen.HOME)}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl flex items-center gap-4 text-left transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icons.Bank className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-bold text-sm leading-tight text-gray-900">Send your coin to your naira bank directly in minutes</p>
              </button>

              <button 
                onClick={() => setScreen(AppScreen.HOME)}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl flex items-center gap-4 text-left transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icons.TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-bold text-sm leading-tight text-gray-900">Grow your wealth by holding coins</p>
              </button>

              <button 
                onClick={() => setScreen(AppScreen.HOME)}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-2xl flex items-center gap-4 text-left transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icons.Wallet className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-bold text-sm leading-tight text-gray-900">Have your own wallet</p>
              </button>
            </div>
          </div>
        );

      case AppScreen.WELCOME_TO_GOGREEN_ALT:
        return (
          <div className="flex-1 flex flex-col bg-white animate-fade-in items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Welcome to Gogreen<br/>What would you like to do now?</h2>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
              <div className="p-4 border rounded-2xl flex flex-col items-center gap-2">
                <Icons.Bank className="w-8 h-8 text-indigo-600" />
                <p className="text-xs font-bold text-gray-900">Open bank account</p>
                <p className="text-[9px] text-gray-400">USD, GBP, EUR</p>
              </div>
              <div className="p-4 border rounded-2xl flex flex-col items-center gap-2">
                <Icons.Card className="w-8 h-8 text-indigo-600" />
                <p className="text-xs font-bold text-gray-900">Get USD card</p>
                <p className="text-[9px] text-gray-400">Spend anywhere</p>
              </div>
              <div className="p-4 border rounded-2xl flex flex-col items-center gap-2">
                <Icons.Send className="w-8 h-8 text-indigo-600" />
                <p className="text-xs font-bold text-gray-900">Send money</p>
                <p className="text-[9px] text-gray-400">Fast and low fees</p>
              </div>
              <div className="p-4 border rounded-2xl flex flex-col items-center gap-2">
                <Icons.TrendingUp className="w-8 h-8 text-indigo-600" />
                <p className="text-xs font-bold text-gray-900">Grow wealth</p>
                <p className="text-[9px] text-gray-400">Save and invest</p>
              </div>
              <div className="p-4 border rounded-2xl flex flex-col items-center gap-2">
                <Icons.Coin className="w-8 h-8 text-indigo-600" />
                <p className="text-xs font-bold text-gray-900">Stablecoin account</p>
                <p className="text-[9px] text-gray-400">USDC and USDT</p>
              </div>
            </div>
            <Button onClick={() => setScreen(AppScreen.HOME)} className="w-full !h-14 !rounded-2xl">Continue</Button>
          </div>
        );

      case AppScreen.KYC_INTRO:
        return (
          <div className="flex-1 flex flex-col bg-white animate-fade-in items-center justify-center p-8 text-center">
             <div className="w-full max-w-md">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 animate-pulse mx-auto border border-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                   <Icons.Shield className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3">Advanced Verification</h2>
                <p className="text-gray-500 text-xs font-medium mb-10 leading-relaxed max-w-[280px] mx-auto">
                   Upgrade to Advanced Level to unlock unlimited withdrawals and higher transaction limits.
                </p>
                
                <div className="space-y-4 mb-12 text-left bg-gray-50 p-6 rounded-[24px] border border-gray-100">
                   <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${kycLevel >= 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                        {kycLevel >= 2 ? <Icons.Check className="w-4 h-4" /> : '1'}
                      </div>
                      <div>
                         <h4 className="text-gray-900 text-sm font-bold">Tier 2 {kycLevel >= 2 ? 'Complete' : 'Pending'}</h4>
                         <p className="text-gray-500 text-[10px]">NIN & Selfie Verified</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${kycLevel >= 3 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>
                        {kycLevel >= 3 ? <Icons.Check className="w-4 h-4" /> : '2'}
                      </div>
                      <div>
                         <h4 className="text-gray-900 text-sm font-bold">Proof of Address</h4>
                         <p className="text-gray-500 text-[10px]">Utility Bill or Bank Statement</p>
                      </div>
                   </div>
                </div>

                <Button 
                   disabled={kycLevel < 2}
                   onClick={() => setScreen(AppScreen.KYC_ADVANCED_FORM)}
                >
                   {kycLevel < 2 ? 'Complete Tier 2 First' : 'Continue'}
                </Button>
                <p className="mt-6 text-[9px] text-gray-400 font-bold uppercase tracking-widest">Review takes 24-48 hours</p>
             </div>
          </div>
        );

       case AppScreen.KYC_BVN:
          return (
             <div className="flex-1 flex flex-col bg-white animate-slide-up items-center justify-center p-8">
                <div className="w-full max-w-md">
                   <BackHeader title="BVN Verification" onBack={() => setScreen(AppScreen.HOME)} theme="light" className="mb-8 bg-transparent" />
                   <p className="text-gray-500 text-xs font-medium mb-8">Enter your 11-digit Bank Verification Number to unlock virtual accounts and crypto addresses.</p>
                   
                   <div className="space-y-6">
                      <Input 
                         label="BVN" 
                         placeholder="12345678901" 
                         value={signupData.bvn || ''} 
                         onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                            setSignupData({...signupData, bvn: val});
                         }}
                         variant="default"
                         inputClassName="!text-lg !tracking-widest !font-mono"
                      />
                      <div className="bg-amber-50 p-4 rounded-[20px] border border-amber-100 flex gap-3 items-start">
                         <span className="text-amber-600 mt-0.5"><Icons.Lock className="w-4 h-4" /></span>
                         <p className="text-[10px] text-amber-800 leading-relaxed font-medium">Your BVN is encrypted and only used for identity verification. We do not have access to your bank accounts.</p>
                      </div>
                   </div>
  
                   <div className="mt-10">
                      <Button 
                         disabled={!signupData.bvn || signupData.bvn.length < 11} 
                         onClick={() => {
                            triggerReview({
                               title: "BVN under review",
                               message: "We are verifying your BVN with the national database. This usually takes a few moments.",
                               notificationTitle: "BVN Verified",
                               notificationDesc: "Your identity has been confirmed successfully.",
                               onComplete: () => {
                                  if (pendingRoute) {
                                     setScreen(pendingRoute);
                                     setPendingRoute(null);
                                  } else {
                                     setScreen(AppScreen.HOME);
                                  }
                               }
                            });
                         }}
                      >
                         Continue
                      </Button>
                   </div>
                </div>
             </div>
          );

      case AppScreen.KYC_ADVANCED_FORM:
         return (
            <div className="flex-1 flex flex-col bg-white animate-slide-up items-center p-8 overflow-y-auto no-scrollbar">
               <div className="w-full max-w-md mt-10">
                  <BackHeader title="Enter your home address" onBack={() => setScreen(AppScreen.KYC_INTRO)} theme="light" className="mb-8 bg-transparent" />
                  
                  <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-4 flex gap-4 mb-8 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icons.Info className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-gray-600 text-xs font-medium leading-relaxed">
                      Please enter your details exactly as they appear on your government-issued ID to avoid verification delays.
                    </p>
                  </div>

                  <div className="space-y-6">
                     <div className="flex flex-col gap-2 relative">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Country of residence</label>
                       <div className="w-full py-4 px-4 bg-gray-50 border border-gray-200 rounded-[20px] flex justify-between items-center text-gray-900 font-medium">
                         <div className="flex items-center gap-3">
                           <span className="text-xl">🇳🇬</span>
                           <span>{advancedKycData.country}</span>
                         </div>
                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                       </div>
                     </div>

                     <Input 
                        label="Street address" 
                        placeholder="e.g. 123 Main St" 
                        value={advancedKycData.streetAddress} 
                        onChange={(e) => setAdvancedKycData({...advancedKycData, streetAddress: e.target.value})}
                        variant="default"
                     />
                     <div className="flex flex-col gap-2 relative">
                       <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">State</label>
                       <div 
                         onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                         className={`w-full py-4 px-4 bg-gray-50 border ${isStateDropdownOpen ? 'border-primary' : 'border-gray-200'} rounded-[20px] flex justify-between items-center text-gray-900 font-medium cursor-pointer active:bg-gray-100 transition-all`}
                       >
                         <span className={`${!advancedKycData.state ? 'text-gray-400' : ''}`}>{advancedKycData.state || 'Select a state'}</span>
                         <svg className={`w-4 h-4 text-gray-400 transition-transform ${isStateDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                       </div>
                       {isStateDropdownOpen && (
                         <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-[20px] overflow-hidden z-30 shadow-2xl animate-fade-in max-h-60 overflow-y-auto">
                           <input 
                             type="text" 
                             placeholder="Search state..." 
                             className="w-full p-4 bg-gray-50 text-gray-900 border-b border-gray-100 outline-none"
                             value={stateSearchTerm}
                             onChange={(e) => setStateSearchTerm(e.target.value)}
                           />
                           {['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara']
                             .filter(state => state.toLowerCase().includes(stateSearchTerm.toLowerCase()))
                             .map((state) => (
                               <div 
                                 key={state}
                                 onClick={() => { setAdvancedKycData({...advancedKycData, state: state}); setIsStateDropdownOpen(false); setStateSearchTerm(''); }}
                                 className="p-4 hover:bg-gray-50 flex items-center gap-3 cursor-pointer border-b border-gray-50 last:border-0"
                               >
                                 <span className="text-gray-900 text-sm font-bold">{state}</span>
                               </div>
                           ))}
                         </div>
                       )}
                     </div>
                     <Input 
                        label="City" 
                        placeholder="e.g. Ikeja" 
                        value={advancedKycData.city} 
                        onChange={(e) => setAdvancedKycData({...advancedKycData, city: e.target.value})}
                        variant="default"
                     />
                     <Input 
                        label="Postal code" 
                        placeholder="e.g. 100001" 
                        value={advancedKycData.postalCode} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length <= 6) {
                            setAdvancedKycData({...advancedKycData, postalCode: val});
                          }
                        }}
                        variant="default"
                     />
                     <Input 
                        label="Date of Birth" 
                        placeholder="DD/MM/YYYY" 
                        type="date"
                        value={advancedKycData.dob} 
                        onChange={(e) => setAdvancedKycData({...advancedKycData, dob: e.target.value})}
                        variant="default"
                     />
                     <Input 
                        label="Phone Number" 
                        placeholder="+234 800 000 0000" 
                        type="tel"
                        value={advancedKycData.phone} 
                        onChange={(e) => {
                          let val = e.target.value;
                          if (!val.startsWith('+234')) {
                            val = '+234';
                          }
                          const rest = val.slice(4).replace(/[^0-9]/g, '');
                          setAdvancedKycData({...advancedKycData, phone: '+234' + rest});
                        }}
                        variant="default"
                     />
                  </div>

                  <div className="mt-10 mb-10">
                     <Button 
                        disabled={!advancedKycData.streetAddress || !advancedKycData.state || !advancedKycData.city || !advancedKycData.postalCode || !advancedKycData.dob || !advancedKycData.phone}
                        onClick={() => setScreen(AppScreen.KYC_PHONE_VERIFICATION)}
                     >
                        Continue
                     </Button>
                  </div>
               </div>
            </div>
         );

      case AppScreen.KYC_PHONE_VERIFICATION:
         return (
            <div className="flex-1 flex flex-col bg-white animate-slide-up items-center justify-center p-8">
               <div className="w-full max-w-md">
                  <BackHeader title="Verify your phone number" onBack={() => setScreen(AppScreen.KYC_ADVANCED_FORM)} theme="light" className="mb-8 bg-transparent" />
                  <p className="text-gray-500 text-xs font-medium mb-10 leading-relaxed">
                    Enter the security code sent to <br/><span className="text-gray-900 font-bold">{advancedKycData.phone}</span> to secure your account.
                  </p>
                  
                  <div className="flex justify-between gap-2 mb-12">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-12 h-14 bg-gray-50 border border-gray-200 rounded-[16px] text-center text-xl font-black text-gray-900 focus:border-primary focus:bg-emerald-50 transition-all outline-none"
                        value={advancedOtpValue[i] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val) {
                            const newOtp = advancedOtpValue.split('');
                            newOtp[i] = val;
                            setAdvancedOtpValue(newOtp.join(''));
                            if (i < 5) {
                              const nextInput = e.target.nextElementSibling as HTMLInputElement;
                              if (nextInput) nextInput.focus();
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace') {
                            const newOtp = advancedOtpValue.split('');
                            newOtp[i] = '';
                            setAdvancedOtpValue(newOtp.join(''));
                            if (i > 0) {
                              const prevInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                              if (prevInput) prevInput.focus();
                            }
                          }
                        }}
                      />
                    ))}
                  </div>

                  <div className="mt-10 space-y-4">
                     <Button 
                        disabled={advancedOtpValue.length < 6}
                        onClick={() => setScreen(AppScreen.KYC_UTILITY)}
                        className="!bg-emerald-600 hover:!bg-emerald-700"
                     >
                        Continue
                     </Button>
                     <Button variant="outline" className="w-full !border-gray-200 !text-gray-700">
                        Receive code by WhatsApp
                     </Button>
                  </div>
               </div>
            </div>
         );

      case AppScreen.KYC_UTILITY:
         return (
            <div className="flex-1 flex flex-col bg-white animate-slide-up items-center justify-center p-8">
               <div className="w-full max-w-md">
                  <BackHeader title="Proof of Address" onBack={() => setScreen(AppScreen.KYC_PHONE_VERIFICATION)} theme="light" className="mb-8 bg-transparent" />
                  <p className="text-gray-500 text-xs font-medium mb-10 leading-relaxed">
                    Please upload a clear photo of your Utility Bill (Electricity, Water) or a recent Bank Statement showing your address.
                  </p>
                  
                  <div className="space-y-6">
                     <div className="w-full h-48 rounded-[32px] border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-gray-100 transition-all group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <Icons.Upload className="w-8 h-8" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tap to upload document</p>
                     </div>
                     
                     <div className="bg-blue-50 p-4 rounded-[20px] border border-blue-100 flex gap-3 items-start">
                        <span className="text-blue-500 mt-0.5"><Icons.Shield className="w-4 h-4" /></span>
                        <p className="text-[10px] text-blue-800 leading-relaxed font-medium">Your documents are stored securely and only used for verification purposes.</p>
                     </div>
                  </div>

                  <div className="mt-10">
                     <Button 
                        className="!bg-emerald-600 hover:!bg-emerald-700"
                        onClick={() => {
                           triggerReview({
                              title: "Documents under review",
                              message: "Our compliance team is reviewing your proof of address. This usually takes 24-48 hours.",
                              notificationTitle: "KYC Verified",
                              notificationDesc: "Your proof of address has been approved. You now have higher limits.",
                              onComplete: () => {
                                 setKycLevel(3);
                                 setScreen(AppScreen.ACCOUNT_SETTINGS);
                              }
                           });
                        }}
                     >
                        Continue
                     </Button>
                  </div>
               </div>
            </div>
         );

      case AppScreen.KYC_PIN_SETUP:
         return (
            <div className="flex-1 flex flex-col bg-white animate-slide-up items-center justify-center p-8">
               <div className="w-full max-w-md flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6 border border-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                     <Icons.Lock />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Set Transaction PIN</h2>
                  <p className="text-gray-500 text-xs font-medium mb-10 text-center">Create a 4-digit PIN to secure your transactions.</p>
                  
                  <div className="flex gap-4 justify-center mb-10 w-full max-w-[240px]">
                     {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all ${tempPin.length > i ? 'border-primary bg-primary text-white shadow-[0_0_15px_rgba(46,139,58,0.2)]' : 'border-gray-200 bg-gray-50 text-gray-400'}`}>
                           {tempPin.length > i ? '•' : ''}
                        </div>
                     ))}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, idx) => (
                        <button 
                           key={idx}
                           onClick={() => {
                              if (num === 'del') {
                                 setTempPin(prev => prev.slice(0, -1));
                              } else if (num !== '' && tempPin.length < 4) {
                                 const newPin = tempPin + num;
                                 setTempPin(newPin);
                                 if (newPin.length === 4) {
                                    setTimeout(() => {
                                       setTransactionPin(newPin);
                                       setTempPin('');
                                       showToast("PIN Set Successfully!");
                                       setScreen(AppScreen.ONBOARDING_ADD_BANK);
                                    }, 500);
                                 }
                              }
                           }}
                           className={`h-16 rounded-2xl flex items-center justify-center text-xl font-bold active:scale-90 transition-transform ${num === '' ? 'invisible' : num === 'del' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100'}`}
                        >
                           {num === 'del' ? <Icons.Trash /> : num}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         );

      case AppScreen.ONBOARDING_ADD_BANK:
         return (
            <div className="flex-1 flex flex-col bg-white animate-slide-up items-center justify-center p-8">
               <div className="w-full max-w-md flex flex-col h-full">
                  <div className="flex justify-between items-center mb-8">
                     <h2 className="text-3xl font-black text-gray-900">Add Bank</h2>
                     <button onClick={() => setScreen(AppScreen.ACCOUNT_CREATED)} className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-900 transition-colors">Skip</button>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                     <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Select Bank</label>
                           <select className="w-full p-4 rounded-[20px] bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary text-sm font-bold text-gray-900 appearance-none">
                              <option className="text-gray-900">Select a bank...</option>
                              <option className="text-gray-900">Access Bank</option>
                              <option className="text-gray-900">Guaranty Trust Bank</option>
                              <option className="text-gray-900">United Bank for Africa</option>
                              <option className="text-gray-900">Zenith Bank</option>
                              <option className="text-gray-900">Kuda Bank</option>
                              <option className="text-gray-900">Opay</option>
                              <option className="text-gray-900">PalmPay</option>
                           </select>
                        </div>

                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Account Number</label>
                           <input 
                              type="tel" 
                              placeholder="0123456789" 
                              className="w-full p-4 rounded-[20px] bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary text-sm font-mono font-bold text-gray-900 placeholder:text-gray-400" 
                              maxLength={10}
                              onInput={(e) => {
                                 const target = e.target as HTMLInputElement;
                                 target.value = (target.value ?? '').replace(/[^0-9]/g, '');
                              }}
                           />
                        </div>

                        <div className="bg-amber-50 p-4 rounded-[20px] border border-amber-100 flex gap-3 items-start">
                           <span className="text-amber-600 mt-0.5"><Icons.Alert /></span>
                           <p className="text-xs text-amber-800 leading-relaxed font-medium">Please ensure the bank account name matches your verified identity name <span className="font-bold text-amber-900">({signupData.fullName || 'Hassan Kehinde'})</span>.</p>
                        </div>
                     </div>

                     <div className="mt-10">
                        <Button className="!bg-emerald-600 hover:!bg-emerald-700" onClick={() => { showToast("Bank Account Added!"); setScreen(AppScreen.ACCOUNT_CREATED); }}>Continue</Button>
                     </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.ACCOUNT_CREATED:
        return (
          <div className="flex-1 flex flex-col bg-white items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-full max-w-md">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 animate-epic-bounce shadow-[0_0_50px_rgba(16,185,129,0.2)] border-4 border-emerald-50 mx-auto">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-2">Welcome Home</h2>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-12">Your Gogreen Africa Dashboard is ready</p>
                <Button onClick={() => { setScreen(AppScreen.WELCOME_TO_GOGREEN); }}>Continue</Button>
            </div>
          </div>
        );

      case AppScreen.KYC_UPLOADING:
        return (
          <div className="flex-1 flex flex-col bg-white items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-full max-w-md flex flex-col items-center">
              <div className="w-32 h-32 mb-8 relative">
                <div className="absolute inset-0 bg-emerald-50 rounded-full animate-ping opacity-20"></div>
                <div className="relative z-10 w-full h-full bg-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/10">
                  <Logo className="w-20 h-20 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Uploading Documents</h2>
              <p className="text-gray-500 text-sm font-medium">Please wait while we securely upload your details...</p>
              
              <div className="mt-12 w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className="h-full bg-emerald-600"
                />
              </div>
            </div>
          </div>
        );

      case AppScreen.UNDER_REVIEW:
         return (
           <UnderReviewScreen 
             title={underReviewData?.title}
             message={underReviewData?.message}
             onBackToHome={() => setScreen(AppScreen.HOME)} 
           />
         );

      case AppScreen.CRYPTO_WALLET_SETUP:
         return (
          <div className="flex-1 flex flex-col bg-white items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)] pointer-events-none" />
             <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 border border-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                   <div className={`w-10 h-10 text-emerald-600 ${isGlobalLoading ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                      <Icons.Lock />
                   </div>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3">Secure Wallet Setup</h2>
                <p className="text-gray-500 text-xs font-medium mb-10 max-w-[280px] leading-relaxed">
                   Generating unique blockchain addresses for your account. This is a one-time process.
                </p>
                {isGlobalLoading ? (
                   <div className="space-y-3 w-full max-w-[280px]">
                      <div className="flex justify-between text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-1">
                         <span>Encrypting...</span>
                         <span className="animate-pulse">100% Secure</span>
                      </div>
                      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-600 animate-pulse w-2/3 rounded-full"></div>
                      </div>
                   </div>
                ) : (
                   <Button onClick={handleCryptoWalletGeneration} className="w-full max-w-[280px]">Generate Addresses</Button>
                )}
             </div>
          </div>
         );

      case AppScreen.BANK_ACCOUNT_SETUP:
         return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-[#051a08] to-black items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(46,139,58,0.15),transparent_70%)] pointer-events-none" />
             <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_30px_rgba(46,139,58,0.2)]">
                   <div className={`w-10 h-10 text-white ${isGlobalLoading ? 'animate-pulse' : ''}`}>
                      <Icons.Bank />
                   </div>
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Virtual Bank Account</h2>
                <p className="text-white/40 text-xs font-medium mb-10 max-w-[280px] leading-relaxed">
                   Generating a dedicated virtual bank account for your Naira deposits.
                </p>
                {isGlobalLoading ? (
                   <div className="space-y-3 w-full max-w-[280px]">
                      <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-widest px-1">
                         <span>Connecting to Bank...</span>
                         <span className="animate-pulse">Secure</span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-primary animate-pulse w-2/3 rounded-full"></div>
                      </div>
                   </div>
                ) : (
                   <Button onClick={handleBankAccountGeneration} className="w-full max-w-[280px]">Generate Account</Button>
                )}
             </div>
          </div>
         );

      case AppScreen.CRYPTO_HUB:
        return <CryptoHubScreen onNavigate={setScreen} onProtectedNavigation={handleProtectedNavigation} />;
      
      case AppScreen.GUIDES_AND_TUTORIALS:
        return <GuidesAndTutorialsScreen onNavigate={setScreen} />;

      case AppScreen.HOME:
        return (
          <HomeScreen
            onRefresh={handleRefresh}
            greeting={getGreeting()}
            user={signupData}
            hasUnreadNotifications={hasUnreadNotifications}
            kycLevel={kycLevel}
            currency={currency}
            setCurrency={setCurrency}
            hideBalance={hideBalance}
            setHideBalance={setHideBalance}
            walletBalance={walletBalance}
            bonusClaimed={bonusClaimed}
            pendingBalance={pendingBalance}
            onNavigate={setScreen}
            onProtectedNavigation={handleProtectedNavigation}
            quickAccessIds={quickAccessIds}
            showQuickAccessDropdown={showQuickAccessDropdown}
            setShowQuickAccessDropdown={setShowQuickAccessDropdown}
            isTxLoading={isTxLoading}
            setSelectedTx={setSelectedTx}
            navigateToHistory={navigateToHistory}
          />
        );

      /* ==========================================================================================
         1) CRYPTO INVOICE SCREEN
         ========================================================================================== */
      case AppScreen.CRYPTO_INVOICE:
        return <CryptoInvoiceScreen />;

      /* ==========================================================================================
         2) TRANSACTION HISTORY SCREEN
         ========================================================================================== */
      case AppScreen.TRANSACTION_HISTORY:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in overflow-hidden items-center">
            <div className="w-full max-w-4xl flex flex-col h-full">
                <BackHeader title="Transactions" subtitle="History" />
                
                {/* Filters */}
                <div className="px-2 py-0.5 flex gap-1.5 overflow-x-auto no-scrollbar">
                  <select 
                    value={txFilterType} 
                    onChange={(e) => setTxFilterType(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-700 text-[8px] font-bold rounded-full px-2 py-0.5 outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="All">All Types</option>
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                    <option value="Add Fund">Add Fund</option>
                    <option value="Withdrawal">Withdrawal</option>
                  </select>

                  <select 
                    value={txFilterDate} 
                    onChange={(e) => setTxFilterDate(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-700 text-[8px] font-bold rounded-full px-2 py-0.5 outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="All Time">All Time</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                  </select>
                </div>

                <div className="flex-1 px-3 pb-3 overflow-y-auto no-scrollbar">
                  {isTxLoading ? (
                    <SkeletonScreen type="list" />
                  ) : (
                    <div className="space-y-1 pt-1">
                      {filteredTransactions.length > 0 ? (
                        <>
                          {filteredTransactions.slice(0, visibleTransactions).map(tx => (
                            <TransactionItem 
                              key={tx.id}
                              tx={tx}
                              swipedItem={swipedItem}
                              onSwipe={(id: number, dir: 'left' | 'right' | null) => setSwipedItem(dir ? { id, direction: dir } : null)}
                              onTap={() => { setSelectedTx(tx); setScreen(AppScreen.TRANSACTION_DETAILS); }}
                              onDetails={() => { setSelectedTx(tx); setScreen(AppScreen.TRANSACTION_DETAILS); setSwipedItem(null); }}
                              onRepeat={() => { showToast('info', 'Repeat Transaction', `Repeating transaction ${tx.type}`); setSwipedItem(null); }}
                              hideBalance={hideBalance}
                            />
                          ))}
                          {visibleTransactions < filteredTransactions.length && (
                            <Button onClick={() => setVisibleTransactions(prev => prev + 10)} className="w-full mt-1.5 !h-8 text-[9px]">Load More</Button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-inner">
                             <Icons.FileText className="w-8 h-8 opacity-50" />
                          </div>
                          <h3 className="text-lg font-black text-gray-900 mb-2 tracking-tight">No Transaction Yet</h3>
                          <p className="text-xs text-gray-400 max-w-[240px] font-medium leading-relaxed">Looks like there's no recent activity to show here. Get started by making a transaction.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
            </div>
          </div>
        );

      /* ==========================================================================================
         2) TRANSACTION DETAILS SCREEN
         ========================================================================================== */
      case AppScreen.TRANSACTION_DETAILS:
        if (!selectedTx) return <div />;
        return (
           <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
              <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Details" subtitle={selectedTx.status} onBack={() => setScreen(AppScreen.TRANSACTION_HISTORY)} />
                  <div className="p-3 overflow-y-auto no-scrollbar pb-6">
                    <div className="bg-white rounded-[16px] p-3 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        
                        {/* Status Badge */}
                        <div className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 ${selectedTx.status === 'Success' ? 'bg-green-100 text-green-700' : selectedTx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {selectedTx.status}
                        </div>

                        {/* Big Amounts */}
                        <h2 className="text-xl font-black text-gray-900 mb-0.5">{hideBalance ? '••••••' : selectedTx.fiatAmount}</h2>
                        <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-6">{hideBalance ? '••••••' : selectedTx.cryptoAmount}</p>

                        {/* Transaction Progress */}
                        <div className="w-full bg-gray-50 rounded-xl p-4 text-left border border-gray-100 mb-4">
                            <h3 className="text-[11px] font-black text-gray-900 mb-4">{selectedTx.status === 'Success' ? 'Completed' : 'In Progress'}</h3>
                            <div className="pl-8">
                                {/* Step 1 */}
                                <div className="relative pb-5">
                                    <div className={`absolute -left-[21px] top-6 bottom-0 w-0.5 ${selectedTx.status === 'Success' || selectedTx.status === 'Pending' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <div className="absolute -left-[32px] top-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">1</div>
                                    <p className="text-[11px] font-bold text-gray-900 leading-tight">
                                      {selectedTx.type.includes('Sold') ? `Incoming deposit of ${selectedTx.cryptoAmount}` : 
                                       selectedTx.type.includes('Withdrawal') ? `Withdrawal request of ${selectedTx.fiatAmount}` :
                                       `Initiated ${selectedTx.type}`}
                                    </p>
                                    <p className="text-[9px] font-medium text-gray-500 mt-0.5">{selectedTx.time}</p>
                                </div>
                                
                                {/* Step 2 */}
                                <div className="relative pb-5">
                                    <div className={`absolute -left-[21px] top-6 bottom-0 w-0.5 ${selectedTx.status === 'Success' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                    <div className={`absolute -left-[32px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${selectedTx.status === 'Success' || selectedTx.status === 'Pending' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                    <p className="text-[11px] font-bold text-gray-900 leading-tight">
                                      {selectedTx.type.includes('Sold') ? `Converted ${selectedTx.cryptoAmount} to ${selectedTx.fiatAmount}` : 
                                       selectedTx.type.includes('Withdrawal') ? `Processing ${selectedTx.fiatAmount}` :
                                       `Processing transaction`}
                                    </p>
                                    <p className="text-[9px] font-medium text-gray-500 mt-0.5">{selectedTx.time}</p>
                                </div>

                                {/* Step 3 */}
                                <div className="relative">
                                    <div className={`absolute -left-[32px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${selectedTx.status === 'Success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                                    <p className="text-[11px] font-bold text-gray-900 leading-tight">
                                      {selectedTx.type.includes('Sold') ? `${selectedTx.fiatAmount} has been deposited` : 
                                       selectedTx.type.includes('Withdrawal') ? `Sent to ${selectedTx.bankName}` :
                                       `Transaction ${selectedTx.status.toLowerCase()}`}
                                    </p>
                                    <p className="text-[9px] font-medium text-gray-500 mt-0.5">{selectedTx.time}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Destination Account */}
                        {selectedTx.bankName !== 'N/A' && (
                          <div className="w-full bg-gray-50 rounded-xl p-2.5 text-left border border-gray-100 mb-4">
                              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Destination Account</p>
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="text-[11px] font-bold text-gray-900">{selectedTx.bankName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-[11px] font-mono text-gray-600">{selectedTx.accountNumber}</span>
                              </div>
                          </div>
                        )}

                        {/* Funding Source (Auto-Swap) */}
                        {selectedTx.fundingSource && (
                          <div className="w-full bg-gray-50 rounded-xl p-3 text-left border border-gray-100 mb-4">
                              <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">Funding Source (Auto-Swap)</p>
                              {selectedTx.fundingSource.map((source: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center mb-1 last:mb-0">
                                  <span className="text-[10px] font-bold text-gray-600">{source.asset}</span>
                                  <span className="text-[10px] font-black text-gray-900">{source.amount}</span>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Breakdown */}
                        <div className="w-full space-y-2">
                          <div className="flex justify-between py-1 border-b border-gray-50">
                              <span className="text-gray-400 text-[9px] font-medium">Reference</span>
                              <span className="text-gray-900 text-[9px] font-bold font-mono">{selectedTx.ref}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-gray-50">
                              <span className="text-gray-400 text-[9px] font-medium">Network</span>
                              <span className="text-gray-900 text-[9px] font-bold">{selectedTx.network}</span>
                          </div>
                          
                          {selectedTx.coinName && (
                            <>
                              <div className="flex justify-between py-1 border-b border-gray-50">
                                  <span className="text-gray-400 text-[9px] font-medium">Coin Name</span>
                                  <span className="text-gray-900 text-[9px] font-bold">{selectedTx.coinName}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-gray-50">
                                  <span className="text-gray-400 text-[9px] font-medium">Amount (Units)</span>
                                  <span className="text-gray-900 text-[9px] font-bold">{selectedTx.unitAmount}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-gray-50">
                                  <span className="text-gray-400 text-[9px] font-medium">Add Fund Date</span>
                                  <span className="text-gray-900 text-[9px] font-bold">{selectedTx.depositDate}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-gray-50">
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-400 text-[9px] font-medium">Service Fee</span>
                                    <button onClick={() => showToast("Fee: 1% (Capped at $10)")} className="text-gray-300 hover:text-primary transition-colors">
                                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </button>
                                  </div>
                                  <span className="text-gray-900 text-[9px] font-bold">{selectedTx.platformFee}</span>
                              </div>
                              {selectedTx.explorerLink && (
                                <div className="flex justify-between py-1 border-b border-gray-50">
                                    <span className="text-gray-400 text-[9px] font-medium">Blockchain Record</span>
                                    <a href={selectedTx.explorerLink} target="_blank" rel="noopener noreferrer" className="text-primary text-[9px] font-bold underline">View on Explorer</a>
                                </div>
                              )}
                            </>
                          )}

                          {!selectedTx.coinName && (
                            <div className="flex justify-between py-1 border-b border-gray-50">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-400 text-[9px] font-medium">Platform Fee</span>
                                  <button onClick={() => showToast("Standard platform processing fee")} className="text-gray-300 hover:text-primary transition-colors">
                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  </button>
                                </div>
                                <span className="text-green-600 text-[9px] font-bold">{selectedTx.platformFee}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between py-1.5 border-b border-gray-50">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400 text-[10px] font-medium">Network Fee</span>
                                <button onClick={() => showToast("Fee charged by the blockchain network")} className="text-gray-300 hover:text-primary transition-colors">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </button>
                              </div>
                              <span className="text-gray-900 text-[10px] font-bold">{selectedTx.networkFee}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-gray-50">
                              <span className="text-gray-400 text-[10px] font-medium">Exchange Rate</span>
                              <span className="text-gray-900 text-[10px] font-bold">{selectedTx.exchangeRate}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-gray-50">
                              <span className="text-gray-400 text-[10px] font-medium">Date & Time</span>
                              <span className="text-gray-900 text-[10px] font-bold">{selectedTx.date}, {selectedTx.time}</span>
                          </div>
                        </div>


                    </div>
                    
                    <div className="mt-4 flex gap-3">
                        <Button variant="secondary" className="flex-1 !h-10 !bg-gray-50 !text-gray-900 !border-gray-200 text-xs" onClick={() => setShowReceiptOptionsModal(true)}>Share Receipt</Button>
                        <Button variant="secondary" className="flex-1 !h-10 !bg-red-50 !text-red-500 !border-red-100 text-xs" onClick={() => setScreen(AppScreen.REPORT_BUG)}>Report Issue</Button>
                    </div>
                  </div>
              </div>
           </div>
        );

      /* ==========================================================================================
         3) SHARE RECEIPT BOTTOM SHEET
         ========================================================================================== */
      
      case AppScreen.RECEIPT_IMAGE_PREVIEW:
         if (!selectedTx) return <div />;
         return (
            <div className="flex-1 flex flex-col bg-dark animate-fade-in overflow-hidden relative items-center justify-center">
               <div className="w-full max-w-md h-full flex flex-col relative">
                  <div className="absolute top-4 left-4 z-20">
                      <button onClick={() => setScreen(AppScreen.TRANSACTION_DETAILS)} className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>

                  {/* Receipt Container - Premium Design */}
                  <div className="flex-1 flex flex-col items-center justify-center p-4">
                      <p className="text-white/50 text-xs mb-4">Swipe left/right to change theme</p>
                      <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, { offset, velocity }) => {
                          if (Math.abs(offset.x) > 50) {
                            setReceiptTheme(receiptTheme === 'light' ? 'dark' : 'light');
                          }
                        }}
                        className="cursor-grab"
                      >
                        <Receipt theme={receiptTheme} tx={selectedTx} username={signupData.username} email={signupData.email} />
                      </motion.div>
                  </div>

                  <div className="p-4 flex gap-3">
                      <Button variant="glass" className="flex-1 !h-10 text-xs" onClick={() => showToast("Image Saved to Gallery")}>Save Image</Button>
                      <Button variant="primary" className="flex-1 !h-10 text-xs" onClick={handleShareReceipt}>Share Receipt</Button>
                  </div>
               </div>
            </div>
         );

      /* ==========================================================================================
         5) PDF RECEIPT PREVIEW SCREEN
         ========================================================================================== */
      case AppScreen.RECEIPT_PDF_PREVIEW:
         if (!selectedTx) return <div />;
         return (
            <div className="flex-1 flex flex-col bg-gray-200 animate-fade-in overflow-hidden relative items-center">
               <div className="w-full max-w-4xl h-full flex flex-col relative">
                  <div className="absolute top-4 left-4 z-20">
                      <button onClick={() => setScreen(AppScreen.TRANSACTION_DETAILS)} className="w-9 h-9 bg-dark/10 rounded-full flex items-center justify-center text-dark hover:bg-dark/20 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>

                  {/* PDF A4 Paper Mockup */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
                      <p className="text-gray-500 text-xs mb-4">Swipe left/right to change theme</p>
                      <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, { offset, velocity }) => {
                          if (Math.abs(offset.x) > 50) {
                            setReceiptTheme(receiptTheme === 'light' ? 'dark' : 'light');
                          }
                        }}
                        className="cursor-grab w-full max-w-[595px] min-h-[842px] shadow-xl relative"
                      >
                        <Receipt theme={receiptTheme} tx={selectedTx} username={signupData.username} email={signupData.email} />
                      </motion.div>
                  </div>
                  
                  <div className="p-4">
                      <Button onClick={handleDownloadPDF} variant="primary" className="!h-10 text-xs w-full">Download PDF</Button>
                  </div>
               </div>
            </div>
         );

      /* ==========================================================================================
         6) REWARDS SCREEN
         ========================================================================================== */
      case AppScreen.REWARDS:
        return <RewardsScreen />;


      case AppScreen.COIN_SELECTION:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
            <div className="w-full max-w-2xl flex flex-col h-full">
              <BackHeader title="Assets" subtitle="Manage Portfolio" onBack={() => setScreen(AppScreen.HOME)} />
              
              <div className="px-4 pt-2 pb-1 space-y-2">
                  {/* Search */}
                  <div className="w-full">
                        <Input 
                            placeholder="Search assets..." 
                            value={searchQuery}
                            variant="glass-light"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={<div className="w-3 h-3"><Icons.Search /></div>}
                            inputClassName="!h-8 !text-[10px] !text-gray-900"
                        />
                  </div>
              </div>
              <div className="p-3 space-y-2 overflow-y-auto no-scrollbar">
                {filteredCoins.length > 0 ? (
                  filteredCoins.map((coin, index) => (
                    <div 
                       key={coin.id} 
                       onClick={() => { 
                          setSelectedCoin(coin); 
                          setSellError(null);
                          setScreen(AppScreen.COIN_DETAIL);
                       }} 
                       className="p-2.5 glass-card rounded-[16px] flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:border-primary/30"
                    >
                      <div className="flex items-center gap-3">
                         <div 
                           onClick={(e) => {
                             e.stopPropagation();
                             toggleFavoriteCoin(coin.id);
                           }}
                           className={`w-6 h-6 flex items-center justify-center ${favoriteCoinIds.includes(coin.id) ? 'text-yellow-400' : 'text-gray-400'}`}
                         >
                           <Icons.Star 
                             className="w-5 h-5" 
                             fill={favoriteCoinIds.includes(coin.id) ? "currentColor" : "none"} 
                           />
                         </div>
                         <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base font-bold shadow-sm" style={{ backgroundColor: coin.color }}>{coin.symbol[0]}</div>
                         <div>
                           <p className="font-bold text-gray-900 text-[13px] tracking-tight mb-0">{coin.name}</p>
                           <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{coin.symbol} • {coin.network}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-gray-900 text-[11px] tracking-tight">
                           {currency === 'NGN' ? '₦' : '$'} {hideBalance ? '••••••' : (currency === 'NGN' ? (coin.balance * coin.rate).toLocaleString() : ((coin.balance * coin.rate) / 1710).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}
                         </p>
                         <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{hideBalance ? '••••••' : coin.balance} {coin.symbol}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-60 relative overflow-hidden rounded-[32px]">
                     <BrandPattern opacity={0.05} size={40} animate={true} className="absolute inset-0 pointer-events-none" />
                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 relative z-10">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                     </div>
                     <p className="text-sm font-bold text-gray-900 relative z-10">No coins found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case AppScreen.NETWORK_SELECTION:
         if (!selectedCoin) return <div/>;
         
         const networks = selectedCoin.id === 'usdt' 
            ? [
                { id: 'bep20', name: 'BEP20', address: '0x1234567890abcdef1234567890abcdef12345678' },
                { id: 'base', name: 'Base', address: '0xabcdef1234567890abcdef1234567890abcdef12' },
                { id: 'trc20', name: 'TRC20', address: 'T9yD14Nj9j7xAB4dbGeiX9h8zzDXDr6' },
                { id: 'sol', name: 'Solana', address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH' }
              ]
            : [
                { id: 'base', name: 'Base', address: '0xabcdef1234567890abcdef1234567890abcdef12' },
                { id: 'sol', name: 'Solana', address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH' }
              ];

         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title={`Select Network`} subtitle={selectedCoin.symbol} onBack={() => setScreen(AppScreen.COIN_DETAIL)} />
                  <div className="p-3 overflow-y-auto no-scrollbar pb-6">
                      
                      <div className="bg-blue-50 p-2.5 rounded-[16px] border border-blue-100 flex gap-2.5 items-start mb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <div>
                              <h4 className="font-bold text-blue-900 text-[11px] mb-0">Important Notice</h4>
                              <p className="text-[9px] text-blue-800 leading-relaxed font-medium">Please select the correct network for your deposit. Sending assets on the wrong network will result in permanent loss.</p>
                          </div>
                      </div>

                      <h3 className="text-[11px] font-black text-gray-900 mb-2 px-2 tracking-tight">Available Networks</h3>
                      <div className="space-y-2">
                          {networks.map(net => (
                              <div 
                                  key={net.id}
                                  onClick={() => {
                                      setSelectedCoin({
                                          ...selectedCoin,
                                          network: net.name,
                                          address: net.address
                                      });
                                      setScreen(AppScreen.COIN_RECEIVE);
                                  }}
                                  className="p-2.5 bg-white rounded-[16px] border border-gray-100 flex items-center justify-between cursor-pointer hover:border-primary/30 active:scale-[0.98] transition-all shadow-sm"
                              >
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                      </div>
                                      <div>
                                          <p className="font-bold text-gray-900 text-[11px]">{net.name}</p>
                                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0">Fee: ~0.1%</p>
                                      </div>
                                  </div>
                                  <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                  </div>
                              </div>
                          ))}
                      </div>
                   </div>
                </div>
             </div>
          );
    
          case AppScreen.COIN_RECEIVE: {
         if (!selectedCoin) return <div />;
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader 
                    title={`Receive ${selectedCoin.symbol}`} 
                    subtitle={`${selectedCoin.network} Network`} 
                    onBack={() => setScreen(selectedCoin.id === 'usdt' || selectedCoin.id === 'usdc' ? AppScreen.NETWORK_SELECTION : AppScreen.COIN_DETAIL)} 
                  />
                  
                  <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto no-scrollbar">
                    {/* Coin Info Card */}
                    <div className="w-full bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm mb-6 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4" style={{ backgroundColor: selectedCoin.color }}>
                            {selectedCoin.symbol[0]}
                        </div>
                        <h3 className="text-lg font-black text-gray-900">{selectedCoin.name}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedCoin.network} Network</p>
                    </div>

                    {/* QR Code Card */}
                    <div className="bg-white p-6 rounded-[40px] shadow-2xl mb-8 border border-gray-100 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 bg-white p-4 rounded-[24px] shadow-inner border border-gray-50">
                            <QRCode 
                                value={selectedCoin.address || '0x1234567890abcdef1234567890abcdef12345678'}
                                size={200}
                                level="H"
                                fgColor="#000000"
                                bgColor="#FFFFFF"
                            />
                        </div>
                    </div>
                    
                    {/* Address Card */}
                    <div className="w-full bg-white rounded-[24px] p-4 border border-gray-100 shadow-sm mb-8">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 text-center">Your {selectedCoin.symbol} Address</p>
                        <div className="bg-gray-50 p-4 rounded-[16px] border border-gray-100 break-all text-center">
                            <p className="text-xs font-mono font-bold text-gray-900 leading-relaxed">
                                {selectedCoin.address || '0x1234567890abcdef1234567890abcdef12345678'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 w-full">
                        <Button variant="secondary" className="flex-1 !bg-white !text-gray-900 border border-gray-100 gap-2 shadow-sm" onClick={() => copyToClipboard(selectedCoin.address || '0x1234567890abcdef1234567890abcdef12345678', 'Address copied!')}>
                            <Icons.Copy className="w-4 h-4" /> Copy
                        </Button>
                        <Button variant="secondary" className="flex-1 !bg-white !text-gray-900 border border-gray-100 gap-2 shadow-sm" onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: `My ${selectedCoin.symbol} Address`,
                                    text: `Here is my ${selectedCoin.symbol} address on ${selectedCoin.network} network: ${selectedCoin.address}`,
                                }).catch(console.error);
                            } else {
                                showToast("Sharing is not supported on this device");
                            }
                        }}>
                            <Icons.Share className="w-4 h-4" /> Share
                        </Button>
                    </div>

                    <div className="mt-8 bg-yellow-50 p-4 rounded-[24px] border border-yellow-100 flex gap-3 items-start">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 shrink-0">
                            <Icons.Alert className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] text-yellow-800 leading-relaxed font-medium">
                            Only send <span className="font-black">{selectedCoin.symbol}</span> to this address via the <span className="font-black">{selectedCoin.network}</span> network. Sending any other asset or using a different network will result in permanent loss of funds.
                        </p>
                    </div>
                  </div>
               </div>
            </div>
         );
      }

      case AppScreen.COIN_DETAIL:
         return (
            <CoinDetailScreen 
               selectedCoin={selectedCoin}
            />
         );

      case AppScreen.SELL_CRYPTO:
         return (
            <SellScreen 
               selectedCoin={selectedCoin}
               sellAmount={sellAmount}
               setSellAmount={setSellAmount}
            />
         );

      case AppScreen.SELL_SUMMARY:
         return (
            <div className="flex-1 flex flex-col bg-white animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Review & Confirm" subtitle="Transaction Details" onBack={() => setScreen(AppScreen.COIN_DETAIL)} />
                  <div className="p-6 flex-1 flex flex-col">
                      <div className="bg-white border border-[#d4d3d3] p-6 rounded-2xl mb-6 shadow-sm">
                        <div className="flex justify-between items-center pb-4 border-b border-[#d4d3d3]/50">
                            <span className="text-xs font-medium text-gray-500">Selling</span>
                            <span className="text-sm font-black text-gray-900">{sellAmount} {selectedCoin?.symbol}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-[#d4d3d3]/50">
                            <span className="text-xs font-medium text-gray-500">Exchange Rate</span>
                            <span className="text-sm font-bold text-gray-900">₦ {selectedCoin?.rate.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-[#d4d3d3]/50">
                            <span className="text-xs font-medium text-gray-500">Network Fee</span>
                            <span className="text-sm font-bold text-[#2da437]">₦ 0.00</span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-xs font-bold text-gray-500">You Receive</span>
                            <span className="text-2xl font-black text-[#2da437]">{hideBalance ? '••••••' : `₦ ${(parseFloat(sellAmount) * (selectedCoin?.rate || 0)).toLocaleString()}`}</span>
                        </div>
                      </div>

                      <div className="mt-auto space-y-4">
                        <SwipeButton text="Swipe to Sell" onComplete={() => {
                           setOnPinSuccess(() => handleSellCrypto);
                           setShowPinModal(true);
                        }} />
                        
                        {sellError && (
                           <div className="bg-red-50 border border-red-100 p-3 rounded-xl animate-shake">
                              <div className="flex items-center gap-2 text-red-600 mb-1">
                                 <div className="w-3.5 h-3.5"><Icons.Alert /></div>
                                 <span className="text-[9px] font-black uppercase tracking-widest">Transaction Error</span>
                              </div>
                              <p className="text-[10px] text-red-500 font-medium leading-relaxed">{sellError}</p>
                           </div>
                        )}
                      </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.SELL_SUCCESS:
         return (
           <TransactionStatusScreen 
             status="success"
             title="Sale Successful!"
             message={`₦${(parseFloat(sellAmount) * (selectedCoin?.rate || 0)).toLocaleString()} has been added to your Naira Wallet.`}
             onDone={() => {
               setSellAmount('');
               setTradeVolume(prev => prev + 50);
               setPoints(prev => prev + 1);
               setScreen(AppScreen.HOME);
             }}
             onViewReceipt={() => {
               const tx = {
                 id: Date.now().toString(),
                 type: `Sold ${selectedCoin?.symbol || 'Crypto'}`,
                 amount: `+₦${(parseFloat(sellAmount) * (selectedCoin?.rate || 0)).toLocaleString()}`,
                 fiatAmount: `+₦${(parseFloat(sellAmount) * (selectedCoin?.rate || 0)).toLocaleString()}`,
                 cryptoAmount: `${sellAmount} ${selectedCoin?.symbol}`,
                 date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                 time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                 status: 'Success',
                 ref: `TXN-${Math.floor(Math.random() * 1000000000)}`,
                 bankName: 'N/A',
                 accountNumber: 'N/A',
                 network: selectedCoin?.network || 'N/A',
                 coinName: selectedCoin?.name,
                 unitAmount: `1 ${selectedCoin?.symbol} = ₦${selectedCoin?.rate?.toLocaleString()}`,
                 depositDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                 platformFee: 'FREE',
                 explorerLink: 'https://etherscan.io'
               };
               setSelectedTx(tx);
               setScreen(AppScreen.RECEIPT_IMAGE_PREVIEW);
             }}
           />
         );

      case AppScreen.SELL_PROCESSING:
         return (
           <TransactionStatusScreen 
             status="processing"
             title="Processing Sale"
             message="We are verifying your transaction on the blockchain. This usually takes a few minutes."
             onDone={() => setScreen(AppScreen.HOME)}
           />
         );

      case AppScreen.SELL_FAILED:
         return (
           <TransactionStatusScreen 
             status="failed"
             title="Transaction Failed"
             message="Something went wrong while processing your sale. Please try again or contact support."
             onDone={() => setScreen(AppScreen.HOME)}
             onRetry={() => setScreen(AppScreen.SELL_SUMMARY)}
           />
         );

      case AppScreen.SELL_REJECTED:
         return (
           <TransactionStatusScreen 
             status="rejected"
             title="Transaction Rejected"
             message="This transaction was rejected by the security system. Please ensure your account is verified."
             onDone={() => setScreen(AppScreen.HOME)}
           />
         );

      case AppScreen.SCANNER:
        return (
          <div className="flex-1 flex flex-col bg-black animate-fade-in items-center relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex flex-col gap-4 z-20">
              <div className="flex justify-between items-center">
                <button onClick={() => { setScreen(AppScreen.HOME); setScannerError(null); }} className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10">
                  <button 
                    onClick={() => setScannerTab('scan')}
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${scannerTab === 'scan' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    Scan
                  </button>
                  <button 
                    onClick={() => setScannerTab('receive')}
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${scannerTab === 'receive' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                  >
                    My QR
                  </button>
                </div>

                <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                  <Icons.Zap className="w-4 h-4" />
                </div>
              </div>
            </div>

            {scannerTab === 'scan' ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                    {!scannerError ? (
                      <Scanner
                        onScan={(result) => {
                          if (result && result.length > 0) {
                            const scannedValue = result[0].rawValue;
                            let recipient = scannedValue;
                            let type: 'address' | 'gogreen_id' | 'email' | 'username' = 'address';
                            
                            if (scannedValue.startsWith('gogreen:')) {
                              recipient = scannedValue.replace('gogreen:', '');
                              type = 'gogreen_id';
                            } else if (scannedValue.includes('@')) {
                              type = 'email';
                            } else if (/^\+?\d+$/.test(scannedValue)) {
                              type = 'username'; // Treat phone numbers as username/id for now
                            } else {
                              type = 'gogreen_id';
                            }
                            
                            setSendRecipient(recipient);
                            setSendRecipientType(type);
                            setScreen(AppScreen.SEND_RECIPIENT);
                            showToast('success', 'QR Code Scanned', 'Recipient details filled.');
                          }
                        }}
                        onError={(error) => {
                          console.error('Scanner Error:', error);
                          const errorMsg = error instanceof Error ? error.message : String(error);
                          setScannerError(errorMsg);
                          if (errorMsg.includes('Permission') || errorMsg.includes('dismissed') || errorMsg.includes('NotAllowedError')) {
                            showToast('error', 'Camera Access Required', 'Please allow camera access in your browser settings to use the scanner.');
                          } else {
                            showToast('error', 'Scanner Error', 'Could not access camera. Please check your settings.');
                          }
                        }}
                        constraints={{ facingMode: isBackCamera ? 'environment' : 'user' }}
                        components={{
                          finder: false,
                        }}
                        styles={{
                          container: { width: '100%', height: '100%' },
                          video: { objectFit: 'cover' }
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-2">
                          <Icons.Alert className="w-8 h-8" />
                        </div>
                        <h3 className="text-white font-bold">Camera Error</h3>
                        <p className="text-white/60 text-xs max-w-[240px]">
                          {scannerError.includes('Permission') || scannerError.includes('dismissed') || scannerError.includes('NotAllowedError')
                            ? 'Camera access was denied. Please allow camera access in your browser settings and try again.'
                            : 'Could not access the camera. Please ensure no other app is using it and try again.'}
                        </p>
                        <Button onClick={() => setScannerError(null)} className="mt-4">
                          Retry Camera
                        </Button>
                      </div>
                    )}
                    
                    {!scannerError && (
                      <div className="w-48 h-48 border-2 border-primary/50 rounded-[24px] relative z-10 pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-primary rounded-tl-xl shadow-[0_0_15px_rgba(46,139,58,0.5)]"></div>
                        <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-primary rounded-tr-xl shadow-[0_0_15px_rgba(46,139,58,0.5)]"></div>
                        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-primary rounded-bl-xl shadow-[0_0_15px_rgba(46,139,58,0.5)]"></div>
                        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-primary rounded-br-xl shadow-[0_0_15px_rgba(46,139,58,0.5)]"></div>
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/50 animate-scan-line shadow-[0_0_20px_rgba(46,139,58,0.8)]"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center gap-3 z-10">
                  <p className="text-white/60 text-[9px] font-medium text-center max-w-[180px]">Align the QR code within the frame to pay instantly</p>
                  <div className="flex gap-5">
                    <button className="flex flex-col items-center gap-1.5 group">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-active:scale-90 transition-transform border border-white/5">
                        <div className="w-4.5 h-4.5"><Icons.Image /></div>
                      </div>
                      <span className="text-[8px] text-white/60 font-black uppercase tracking-widest group-hover:text-white transition-colors">Gallery</span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 group">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-active:scale-90 transition-transform border border-white/5">
                        <div className="w-4.5 h-4.5"><Icons.Zap /></div>
                      </div>
                      <span className="text-[8px] text-white/60 font-black uppercase tracking-widest group-hover:text-white transition-colors">Flash</span>
                    </button>
                    <button 
                      onClick={() => setIsBackCamera(!isBackCamera)}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-active:scale-90 transition-transform border border-white/5">
                        <div className="w-4.5 h-4.5"><Icons.Refresh /></div>
                      </div>
                      <span className="text-[8px] text-white/60 font-black uppercase tracking-widest group-hover:text-white transition-colors">Switch</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 w-full flex flex-col items-center justify-center p-4 pt-16 bg-dark">
                <div className="bg-white p-5 rounded-[20px] shadow-2xl flex flex-col items-center gap-3 w-full max-w-xs animate-scale-in relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-green-400 to-primary"></div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
                      <img src={signupData.profileImage || getAvatarUrl(signupData.username || 'hassan')} className="w-full h-full object-cover" alt="Avatar" />
                    </div>
                    <h3 className="text-base font-black text-gray-900 tracking-tight">{signupData.username || 'User'}</h3>
                    <p className="text-[9px] text-gray-400 font-medium">Scan to pay me directly</p>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <QRCode 
                      value={`gogreen:${signupData.username || 'user'}`}
                      size={150}
                      level="H"
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                  </div>

                  <div className="w-full flex gap-2.5">
                    <Button variant="outline" className="flex-1 !text-[9px] !h-8" onClick={() => copyToClipboard(`gogreen:${signupData.username}`, "Wallet address copied!")}>
                      Copy ID
                    </Button>
                    <Button className="flex-1 !text-[9px] !h-8" onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'My GoGreen QR Code',
                          text: `Scan my QR code to send me money! My username is ${signupData.username}`,
                          url: window.location.href
                        }).catch(console.error);
                      } else {
                        showToast("Sharing is not supported on this device");
                      }
                    }}>
                      Share QR
                    </Button>
                  </div>
                </div>
                <p className="text-white/30 text-[8px] font-black uppercase tracking-widest mt-5 text-center max-w-[240px]">
                  This QR code accepts payments from any Gogreen user instantly.
                </p>
              </div>
            )}

            {/* Payment Modal */}
            {showScanPaymentModal && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-fade-in">
                <div className="bg-white w-full max-w-sm rounded-[20px] p-4 animate-slide-up shadow-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-black text-gray-900">Confirm Payment</h3>
                    <button onClick={() => setShowScanPaymentModal(false)} className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-[16px] mb-3 border border-gray-100">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-lg">🏪</div>
                    <div>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Paying to</p>
                      <p className="text-sm font-black text-gray-900">{scannedData?.name}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-5">
                    <Input 
                      label="Amount (NGN)" 
                      placeholder="0.00" 
                      value={scanAmount} 
                      onChange={(e) => setScanAmount(e.target.value)}
                      prefix="₦"
                      type="number"
                      inputClassName="!h-9 !text-xs"
                    />
                    <Input 
                      label="Note (Optional)" 
                      placeholder="What's this for?" 
                      value="" 
                      onChange={() => {}}
                      inputClassName="!h-9 !text-xs"
                    />
                  </div>

                  <Button 
                    onClick={() => {
                      setGlobalLoadingMessage('Processing Payment...');
                      setIsGlobalLoading(true);
                      setTimeout(() => {
                        setIsGlobalLoading(false);
                        setShowScanPaymentModal(false);
                        setScanAmount('');
                        setScreen(AppScreen.SELL_SUCCESS); // Reuse success screen or create new one
                        showToast(`Paid ₦${scanAmount || '0'} to ${scannedData?.name}`);
                      }, 2000);
                    }}
                    disabled={!scanAmount}
                    className="!h-10 !text-xs"
                  >
                    Pay ₦{scanAmount || '0.00'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case AppScreen.PAY_BILLS:
      case AppScreen.BILL_PAYMENT_DETAILS:
      case AppScreen.BILL_PAYMENT_SUMMARY:
      case AppScreen.BILL_PAYMENT_SUCCESS:
        return <BillPaymentScreen setIsGlobalLoading={setIsGlobalLoading} setGlobalLoadingMessage={setGlobalLoadingMessage} />;

      case AppScreen.SUGGESTION_BOX:
        return (
           <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
              <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Feedback" subtitle="Suggestion Box" />
                  <div className="p-3">
                    <h2 className="text-base font-black mb-1.5 text-gray-900">We're listening.</h2>
                    <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">Have an idea? Found a bug? Let us know how we can improve Gogreen for you.</p>
                    <textarea className="w-full h-28 p-3.5 rounded-[16px] bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-[11px] font-bold resize-none mb-3 text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-300" placeholder="Type your suggestion here..."></textarea>
                    <Button onClick={() => { showToast("Feedback Sent!"); setScreen(AppScreen.HOME); }} className="!h-9 !text-xs">Submit Feedback</Button>
                  </div>
              </div>
           </div>
        );

      case AppScreen.REPORT_BUG:
        return (
           <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
              <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Support" subtitle="Report a Bug" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-4">
                    <div className="bg-red-50 p-3 rounded-[20px] border border-red-100 flex gap-3 items-start mb-4">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-lg shrink-0 p-1.5 text-red-500"><Icons.Bug /></div>
                        <div>
                          <h3 className="font-bold text-red-900 text-xs">Found an issue?</h3>
                          <p className="text-[10px] text-red-700/80 leading-relaxed mt-0.5">Please describe the bug in detail so our engineering team can fix it as soon as possible.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <Input 
                           label="Issue Subject"
                           value={bugReport.subject}
                           onChange={(e) => setBugReport({...bugReport, subject: e.target.value})}
                           placeholder="e.g. App crashes on login" 
                           variant="glass-light"
                           className="!h-10 !text-sm"
                           inputClassName="!text-gray-900"
                        />

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Description</label>
                          <textarea 
                            value={bugReport.description}
                            onChange={(e) => setBugReport({...bugReport, description: e.target.value})}
                            className="w-full h-32 p-4 rounded-[24px] bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-xs font-bold resize-none text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-300" 
                            placeholder="Describe what happened..."
                          ></textarea>
                        </div>

                        <div className="flex flex-col gap-1.5">
                           <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Screenshot (Optional)</label>
                           <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                   const file = e.target.files?.[0];
                                   if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                         setUploadedFile(reader.result as string);
                                      };
                                      reader.readAsDataURL(file);
                                   }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                              <div className={`w-full p-3 rounded-[20px] border border-dashed ${uploadedFile ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50'} flex items-center justify-center gap-2 transition-all`}>
                                 {uploadedFile ? (
                                    <>
                                       <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
                                          <img src={uploadedFile} className="w-full h-full object-cover" alt="Preview" />
                                       </div>
                                       <span className="text-[10px] font-bold text-primary">Image Attached</span>
                                       <button onClick={(e) => { e.preventDefault(); setUploadedFile(null); }} className="z-20 p-1 bg-white rounded-full shadow-sm text-red-500"><Icons.Trash /></button>
                                    </>
                                 ) : (
                                    <>
                                       <div className="text-gray-400"><Icons.Image /></div>
                                       <span className="text-[10px] font-bold text-gray-400">Tap to upload screenshot</span>
                                    </>
                                 )}
                              </div>
                           </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button 
                          disabled={!bugReport.subject || !bugReport.description}
                          onClick={() => { 
                            showToast("Bug Report Submitted. Thank you!"); 
                            setBugReport({ subject: '', description: '' });
                            setScreen(AppScreen.ME); 
                          }}
                          className="!h-10 !text-xs"
                        >
                          Submit Report
                        </Button>
                    </div>
                  </div>
              </div>
           </div>
        );

      case AppScreen.ME:
        return (
          <MeScreen
            onRefresh={handleRefresh}
            signupData={signupData}
            kycLevel={kycLevel}
            currency={currency}
            setCurrency={setCurrency}
            walletBalance={walletBalance}
            pendingBalance={pendingBalance}
            onNavigate={setScreen}
            hideBalance={hideBalance}
          />
        );

      case AppScreen.NOTIFICATIONS:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
            <div className="w-full max-w-2xl flex flex-col h-full">
                <BackHeader title="Notifications" subtitle="Alerts" />
                <div className="p-3 space-y-2.5 h-full pb-24 overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map(note => (
                        <div 
                          key={note.id} 
                          onClick={() => {
                            if (note.target) {
                              if (note.txId) {
                                const tx = Constants.TRANSACTIONS.find(t => t.id === note.txId);
                                if (tx) setSelectedTx(tx);
                              }
                              setScreen(note.target);
                            }
                          }}
                          className="bg-white p-3.5 rounded-[16px] shadow-sm border border-gray-100 flex gap-3 items-start cursor-pointer active:scale-[0.98] transition-all hover:border-primary/30"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center p-2 ${note.type === 'security' ? 'bg-red-50 text-red-500' : note.type === 'reward' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                            <div className="w-4 h-4">
                              {note.type === 'security' ? <Icons.Shield /> : note.type === 'reward' ? <Icons.Gift /> : <Icons.Wallet />}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-0.5">
                              <h4 className="font-black text-gray-900 text-[11px]">{note.title}</h4>
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{note.time}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{note.desc}</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="ghost" className="mt-2 text-[10px] !h-8" onClick={() => { setHasUnreadNotifications(false); showToast("All marked as read"); }}>Mark all as read</Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center h-full opacity-30">
                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                       </div>
                       <h3 className="text-base font-black text-gray-900 mb-1">All Caught Up</h3>
                       <p className="text-[11px] text-gray-400 max-w-[200px] font-medium">You have no new notifications at the moment.</p>
                    </div>
                  )}
                </div>
            </div>
          </div>
        );

      case AppScreen.ADD_MONEY:
         return (
            <div className="flex-1 flex flex-col bg-white animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Add Money" subtitle="Choose a deposit method" onBack={() => setScreen(AppScreen.HOME)} />
                  <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto pb-24">
                      {[
                        { id: 'naira_wallet', title: 'Naira Wallet', desc: 'Fund via your virtual account', icon: <Icons.Wallet />, action: () => setScreen(AppScreen.VIRTUAL_ACCOUNT), active: true },
                        { id: 'ussd', title: 'USSD', desc: 'Dial a code to fund your wallet', icon: <Icons.Phone />, action: () => setScreen(AppScreen.USSD_DEPOSIT), active: true },
                        { id: 'crypto', title: 'Crypto Invoice', desc: 'Receive crypto via invoice', icon: <Icons.QrCode />, action: () => setScreen(AppScreen.CRYPTO_INVOICE), active: true },
                        { id: 'intl', title: 'International Add Funds', desc: 'Payment from outside Nigeria', icon: <Icons.Globe />, action: () => {}, active: false },
                        { id: 'card', title: 'Card Add Fund', desc: 'Fund instantly with your debit card', icon: <Icons.CreditCard />, action: () => {}, active: false },
                        { id: 'cash', title: 'Cash Add Fund', desc: 'Add Fund cash at a partner location', icon: <Icons.Bank />, action: () => {}, active: false },
                        { id: 'request', title: 'Request Money', desc: 'Ask a friend for money', icon: <Icons.Send />, action: () => {}, active: false },
                      ].map((method) => (
                        <div 
                          key={method.id} 
                          onClick={method.active ? method.action : undefined}
                          className={`bg-white border border-gray-100 p-4 rounded-2xl flex items-center gap-4 shadow-sm transition-all ${method.active ? 'cursor-pointer hover:border-primary/50 hover:shadow-md active:scale-[0.98]' : 'opacity-50 grayscale cursor-not-allowed'}`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.active ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-900">{method.title}</h3>
                            <p className="text-[11px] text-gray-500 font-medium mt-0.5">{method.desc}</p>
                          </div>
                          {method.active ? (
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                              <Icons.ArrowRight className="w-4 h-4" />
                            </div>
                          ) : (
                            <span className="text-[9px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-md uppercase tracking-wider">Soon</span>
                          )}
                        </div>
                      ))}
                  </div>
               </div>
            </div>
         );

      case AppScreen.VIRTUAL_ACCOUNT:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Naira Wallet" subtitle="Manage your funds" onBack={() => setScreen(AppScreen.ADD_MONEY)} />
                  <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-24">
                      {/* Balance Card */}
                      <div className="bg-primary p-8 rounded-[40px] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-white/20 transition-all duration-700"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2 opacity-60">
                                <Icons.Wallet className="w-3.5 h-3.5" />
                                <p className="text-[9px] font-black uppercase tracking-[0.3em]">Total Balance</p>
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter mb-8">
                                ₦ {hideBalance ? '••••••' : walletBalance.toLocaleString()}
                            </h2>
                            
                            <div className="flex gap-3">
                                <Button variant="white" className="flex-1 !h-11 !rounded-2xl !text-[10px] font-black uppercase tracking-widest !bg-white/20 !text-white backdrop-blur-md border border-white/10" onClick={() => handleProtectedNavigation(AppScreen.WITHDRAW_MONEY)}>Withdraw</Button>
                                <Button variant="white" className="flex-1 !h-11 !rounded-2xl !text-[10px] font-black uppercase tracking-widest" onClick={() => showToast("Transfer feature coming soon")}>Transfer</Button>
                            </div>
                        </div>
                      </div>

                      {/* Virtual Account Details */}
                      <div className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <Icons.Bank className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 tracking-tight">Virtual Account</h3>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Fund your wallet instantly</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center group cursor-pointer active:scale-[0.98] transition-all" onClick={() => copyToClipboard("9028371920", "Account number copied!")}>
                                <div>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Number</p>
                                    <p className="text-lg font-mono font-black text-gray-900 tracking-widest">9028371920</p>
                                </div>
                                <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Icons.Copy className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Bank Name</p>
                                    <p className="text-sm font-black text-gray-900">Wema Bank / Gogreen</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Name</p>
                                    <p className="text-sm font-black text-gray-900">Gogreen - {signupData.fullName || 'User'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3 items-start">
                            <div className="w-5 h-5 text-blue-500 mt-0.5"><Icons.Alert /></div>
                            <p className="text-[10px] text-blue-800 leading-relaxed font-medium">Funds transferred to this account will reflect in your Gogreen Naira Wallet within 30 seconds.</p>
                        </div>
                      </div>

                      {/* Recent Transactions */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Recent Activity</h3>
                            <button className="text-[9px] font-black text-primary uppercase tracking-widest">View All</button>
                        </div>
                        <div className="bg-white rounded-[40px] p-2 border border-gray-100 shadow-sm">
                            <div className="p-10 text-center opacity-40">
                                <Icons.FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No recent transactions</p>
                            </div>
                        </div>
                      </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.USSD_DEPOSIT:
         return <USSDDepositScreen onBack={() => setScreen(AppScreen.ADD_MONEY)} accountNumber="9028371920" />;

      case AppScreen.SECURITY:
      case AppScreen.CHANGE_PIN:
      case AppScreen.LOGGED_IN_DEVICES:
        return <SecurityScreen />;

      case AppScreen.BANK_DETAILS:
        return <BankDetailsScreen />;

      case AppScreen.ADD_BANK:
        return <BankDetailsScreen />;








      case AppScreen.ACCOUNT_SETTINGS:
        return (
           <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
              <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Settings" subtitle="Preferences" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-4 space-y-4">
                     <div className="bg-white p-4 rounded-[16px] border border-gray-100 shadow-sm">
                        <h3 className="font-black text-gray-900 text-[11px] mb-3 uppercase tracking-wide">Account Limits</h3>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-gray-500">Current Level</span>
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                {kycLevel >= 3 ? 'Advanced' : kycLevel >= 2 ? 'Tier 2' : 'Tier 1'}
                              </span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-gray-500">Daily Withdrawal</span>
                              <span className="text-[10px] font-black text-gray-900">₦ {kycLevel >= 3 ? 'Unlimited' : kycLevel >= 2 ? '5,000,000' : '500,000'}</span>
                           </div>
                           <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                              <div className={`bg-primary h-full rounded-full transition-all duration-500 ${kycLevel >= 3 ? 'w-full' : kycLevel >= 2 ? 'w-2/3' : 'w-1/3'}`}></div>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-gray-500">Daily Crypto Sell</span>
                              <span className="text-[10px] font-black text-gray-900">Unlimited</span>
                           </div>
                        </div>
                        {kycLevel < 3 && (
                          <Button variant="outline" className="w-full mt-4 !h-8 !text-[10px]" onClick={() => setScreen(AppScreen.KYC_INTRO)}>Upgrade to Advanced Level</Button>
                        )}
                     </div>

                     <div className="bg-white p-4 rounded-[16px] border border-gray-100 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="font-bold text-gray-900 text-xs">Push Notifications</h4>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Alerts & Updates</p>
                           </div>
                           <div className="relative inline-block w-9 h-5 align-middle select-none transition duration-200 ease-in">
                               <input 
                                 type="checkbox" 
                                 name="toggle" 
                                 id="notif-toggle" 
                                 checked={pushNotificationsEnabled}
                                 onChange={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
                                 className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white shadow-sm appearance-none cursor-pointer top-0.5 left-0.5 checked:translate-x-4 transition-transform duration-200 ease-in-out" 
                               />
                               <label htmlFor="notif-toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${pushNotificationsEnabled ? 'bg-primary' : 'bg-gray-200'}`}></label>
                           </div>
                        </div>
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="font-bold text-gray-900 text-xs">Hide Balance</h4>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">hide all balance and transactions</p>
                           </div>
                           <div className="relative inline-block w-9 h-5 align-middle select-none transition duration-200 ease-in">
                               <input 
                                 type="checkbox" 
                                 name="toggle" 
                                 id="hide-balance-toggle" 
                                 checked={hideBalance}
                                 onChange={() => setHideBalance(!hideBalance)}
                                 className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white shadow-sm appearance-none cursor-pointer top-0.5 left-0.5 checked:translate-x-4 transition-transform duration-200 ease-in-out" 
                               />
                               <label htmlFor="hide-balance-toggle" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${hideBalance ? 'bg-primary' : 'bg-gray-200'}`}></label>
                           </div>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                           <div>
                              <h4 className="font-bold text-gray-900 text-xs">Currency</h4>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Default Fiat</p>
                           </div>
                           <span className="text-[10px] font-black text-gray-900">NGN (₦)</span>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                           <div>
                              <h4 className="font-bold text-gray-900 text-xs">Language</h4>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">App Language</p>
                           </div>
                           <span className="text-[10px] font-black text-gray-900">English (UK)</span>
                        </div>
                     </div>
                  </div>
              </div>
           </div>
        );

      case AppScreen.EDIT_PROFILE:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Edit Profile" subtitle="Personal Info" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-4 flex-1 flex flex-col">
                     <div className="flex justify-center mb-6 relative">
                        <div className="w-20 h-20 rounded-[24px] overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative">
                           <img src={signupData.profileImage || getAvatarUrl(signupData.username)} className="w-full h-full object-cover" />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <Input 
                           label="Full Name"
                           value={signupData.fullName}
                           variant="glass-light"
                           inputClassName="opacity-60 !h-9 !text-xs !text-gray-900"
                           disabled
                        />
                        <p className="text-[8px] text-gray-400 font-bold ml-1 -mt-2">Name cannot be changed after verification.</p>

                        <Input 
                           label="Username"
                           value={signupData.username}
                           variant="glass-light"
                           inputClassName="!h-9 !text-xs !text-gray-900"
                           onChange={(e) => setSignupData({...signupData, username: '₦' + e.target.value.replace(/-/g, '').replace(/^₦/, '').replace(/\s/g, '')})}
                        />

                        <Input 
                           label="Email Address"
                           value={signupData.email}
                           variant="glass-light"
                           inputClassName="!h-9 !text-xs !text-gray-900"
                           onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        />

                        <Input 
                           label="Phone Number"
                           placeholder="+234 800 000 0000"
                           value={signupData.phone || ''}
                           variant="glass-light"
                           inputClassName="!h-9 !text-xs !text-gray-900"
                           onChange={(e) => setSignupData({...signupData, phone: e.target.value.replace(/\s/g, '')})}
                        />
                     </div>

                     <div className="mt-auto pt-6">
                        <Button onClick={() => { showToast("Profile Updated!"); setScreen(AppScreen.ME); }} className="!h-9 !text-xs">Save Changes</Button>
                     </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.PAYMENT_SETTINGS:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Payment Settings" subtitle="Preferences" onBack={() => setScreen(AppScreen.ME)} onHome={() => setScreen(AppScreen.HOME)} />
                  <div className="p-3 flex-1 flex flex-col">
                      <div className="bg-white p-3.5 rounded-[16px] border border-gray-100 shadow-sm mb-3">
                          <div className="flex items-center justify-between mb-2">
                              <div>
                                  <h3 className="font-black text-gray-900 text-xs">Auto-Withdrawal</h3>
                                  <p className="text-[9px] text-gray-400">Directly to bank account</p>
                              </div>
                              <button 
                                id="tutorial-auto-withdrawal"
                                onClick={() => setSignupData(prev => ({ ...prev, autoWithdrawToBank: !prev.autoWithdrawToBank }))}
                                className={`w-9 h-4.5 rounded-full transition-all relative ${signupData.autoWithdrawToBank ? 'bg-primary' : 'bg-gray-200'}`}
                              >
                                <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${signupData.autoWithdrawToBank ? 'left-5' : 'left-0.5'}`} />
                              </button>
                          </div>
                          <p className="text-[8px] text-gray-400 leading-relaxed">
                              When enabled, all crypto deposits will be automatically converted to Naira and sent to your default bank account. When disabled, funds are stored in your Gogreen balance.
                          </p>
                      </div>

                      <div className="mt-auto">
                          <Button onClick={() => { showToast("Settings Saved!"); setScreen(AppScreen.ME); }} className="!h-9 !text-xs">Save Settings</Button>
                      </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.APP_UPDATE:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="App Update" subtitle="Version Info" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                     <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center mb-4 shadow-sm border border-primary/20">
                        <Logo className="w-10 h-10" variant="color" />
                     </div>
                     <h2 className="text-lg font-black text-gray-900 mb-0.5">Gogreen Crypto</h2>
                     <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">Version 1.0.4 (Build 202)</p>
                     
                     <div className="bg-white p-4 rounded-[24px] border border-gray-100 w-full mb-6 text-left">
                        <h3 className="font-bold text-gray-900 text-xs mb-3">What's New</h3>
                        <ul className="space-y-2">
                           <li className="flex gap-2 text-[10px] text-gray-600 font-medium">
                              <span className="text-primary">•</span>
                              <span>Added support for USDT TRC20 withdrawals</span>
                           </li>
                           <li className="flex gap-2 text-[10px] text-gray-600 font-medium">
                              <span className="text-primary">•</span>
                              <span>Improved biometric login speed</span>
                           </li>
                           <li className="flex gap-2 text-[10px] text-gray-600 font-medium">
                              <span className="text-primary">•</span>
                              <span>Fixed bug in transaction history filter</span>
                           </li>
                        </ul>
                     </div>

                     <Button onClick={() => showToast("You are on the latest version")} className="!h-10 !text-xs">Check for Updates</Button>
                  </div>
               </div>
            </div>
         );

      case AppScreen.DELETE_ACCOUNT:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Delete Account" subtitle="Danger Zone" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-4 flex-1 flex flex-col">
                     <div className="bg-red-50 p-3.5 rounded-[16px] border border-red-100 mb-5 text-center shadow-sm">
                        <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-lg mx-auto mb-2.5">
                           <div className="w-5 h-5"><Icons.Alert /></div>
                        </div>
                        <h3 className="text-base font-black text-red-900 mb-1">Are you sure?</h3>
                        <p className="text-[11px] text-red-800/80 leading-relaxed">
                           This action is permanent and cannot be undone. All your data, transaction history, and remaining wallet balance will be permanently deleted.
                        </p>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">Type "DELETE" to confirm</label>
                        <input 
                           type="text" 
                           placeholder="DELETE"
                           className="w-full p-2.5 rounded-[12px] bg-white border border-gray-200 focus:outline-none focus:border-red-500 text-xs font-black text-red-500 placeholder:text-gray-300 shadow-sm"
                           onChange={(e) => {
                              if (e.target.value === 'DELETE') {
                                 showToast("Account Scheduled for Deletion");
                                 setTimeout(() => setScreen(AppScreen.SPLASH), 1500);
                              }
                           }}
                        />
                     </div>

                     <div className="mt-auto flex flex-col gap-1.5">
                        <Button variant="danger" onClick={() => { showToast("Account Scheduled for Deletion"); setTimeout(() => setScreen(AppScreen.SPLASH), 1500); }} className="!h-9 !text-xs">Yes, delete my account</Button>
                        <Button variant="ghost" className="!text-gray-500 !h-9 !text-xs" onClick={() => setScreen(AppScreen.ME)}>Cancel, keep my account</Button>
                     </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.SUPPORT:
         return null;

      case AppScreen.RATES:
         return <RatesScreen areCryptoWalletsGenerated={areCryptoWalletsGenerated} onProtectedNavigation={handleProtectedNavigation} onSell={(coin) => {
             setSelectedCoin(coin);
             setSellAmount('');
             handleProtectedNavigation(AppScreen.COIN_DETAIL);
         }} />;

      case AppScreen.REFER_FRIEND:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Refer & Earn" subtitle="Earn Money" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                     <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                        <div className="w-8 h-8"><Icons.Gift /></div>
                     </div>
                     <h3 className="text-lg font-black text-gray-900 mb-1.5">Invite Friends, Earn ₦3,000!</h3>
                     <p className="text-[11px] text-gray-500 max-w-[240px] leading-relaxed mb-5">Earn a ₦3,000 voucher + 50% trade fee commission for 1 year when your friend deposits at least $2. (Min. $2 balance required)</p>
                     <div className="bg-gray-50 p-2.5 rounded-[16px] border border-gray-200 w-full max-w-[260px] flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm" onClick={() => copyToClipboard('HASSAN23', 'Referral code copied!')}>
                         <div className="flex-1 font-mono font-bold text-gray-900 tracking-widest text-center text-sm">HASSAN23</div>
                         <div className="text-[8px] font-black uppercase text-primary bg-white px-2.5 py-1 rounded-lg shadow-sm">Copy</div>
                     </div>
                      <Button variant="outline" className="mt-5 w-full max-w-[260px] !h-9 !text-xs" onClick={() => showToast("Sharing options coming soon!")}>Share Now</Button>
                  </div>
               </div>
            </div>
         );

      case AppScreen.WITHDRAW_MONEY:
      case AppScreen.WITHDRAW_SUCCESS:
      case AppScreen.WITHDRAW_PROCESSING:
      case AppScreen.WITHDRAW_FAILED:
      case AppScreen.WITHDRAW_REJECTED:
        return (
          <WithdrawScreen 
            setIsGlobalLoading={setIsGlobalLoading}
            setGlobalLoadingMessage={setGlobalLoadingMessage}
          />
        );

      /* ==========================================================================================
         SEND FLOW
         ========================================================================================== */
      case AppScreen.SEND_DESTINATION:
      case AppScreen.SEND_NEW_RECEIVER:
      case AppScreen.SEND_GOGREEN_SEARCH:
      case AppScreen.SEND_BANK_ACCOUNT:
      case AppScreen.SEND_SELECT_ASSET:
      case AppScreen.SEND_RECIPIENT:
      case AppScreen.SEND_AMOUNT:
      case AppScreen.SEND_CONFIRM:
      case AppScreen.SEND_SUCCESS:
      case AppScreen.SEND_PROCESSING:
      case AppScreen.SEND_FAILED:
      case AppScreen.SEND_REJECTED:
        return (
          <SendScreen
            setShowPinModal={setShowPinModal}
            setOnPinSuccess={setOnPinSuccess}
            setGlobalLoadingMessage={setGlobalLoadingMessage}
            setIsGlobalLoading={setIsGlobalLoading}
          />
        );

      /* ==========================================================================================
         SWAP FLOW
         ========================================================================================== */
      case AppScreen.SWAP_SELECT_ASSET_FROM:
      case AppScreen.SWAP_SELECT_ASSET_TO:
      case AppScreen.SWAP_AMOUNT:
      case AppScreen.SWAP_CONFIRM:
      case AppScreen.SWAP_SUCCESS:
        return (
          <SwapScreen
            setShowPinModal={setShowPinModal}
            setOnPinSuccess={setOnPinSuccess}
            setGlobalLoadingMessage={setGlobalLoadingMessage}
            setIsGlobalLoading={setIsGlobalLoading}
          />
        );

      default: {
        if (screenToRender && screenToRender.toString().startsWith('KYC')) {
           const kycSteps = [
             { id: 1, title: 'Tier 1', desc: 'Phone, Bank & PIN', status: kycLevel >= 1 ? 'Completed' : 'Pending' },
             { id: 2, title: 'Tier 2', desc: 'Govt ID & Face Capture', status: kycLevel >= 2 ? 'Completed' : kycLevel === 1 ? 'Next' : 'Locked' },
             { id: 3, title: 'Tier 3', desc: 'Utility Bill', status: kycLevel >= 3 ? 'Completed' : kycLevel === 2 ? 'Next' : 'Locked' }
           ];

           return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Verification" subtitle="KYC Status" onBack={() => setScreen(AppScreen.HOME)} />
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-3xl mb-4 p-4 text-primary">
                          <Icons.Shield />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 mb-1">Account Verification</h2>
                        <p className="text-gray-500 text-xs px-4 mb-6">Complete verification tiers to unlock higher limits and features.</p>
                        
                        <div className="w-full space-y-3 text-left">
                          {kycSteps.map((step) => (
                              <div key={step.id} className={`flex items-center justify-between p-3 bg-white rounded-2xl border ${step.status === 'Completed' ? 'border-green-200 bg-green-50' : step.status === 'Next' ? 'border-primary shadow-md' : 'border-gray-100 opacity-60'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step.status === 'Completed' ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                      {step.status === 'Completed' ? '✓' : step.id}
                                    </div>
                                    <div>
                                      <span className="font-bold text-gray-900 text-xs block">{step.title}</span>
                                      <span className="text-[9px] text-gray-500 font-medium">{step.desc}</span>
                                    </div>
                                </div>
                                {step.status === 'Next' && <span className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">Start</span>}
                              </div>
                          ))}
                        </div>
                    </div>
                    <Button onClick={() => {
                        const nextLevel = kycLevel + 1;
                        if (nextLevel <= 3) {
                          setKycLevel(nextLevel);
                          showToast(`Tier ${nextLevel} Verified Successfully!`);
                        } else {
                          showToast("You are fully verified!");
                        }
                        setScreen(AppScreen.HOME);
                    }} className="!h-10 !text-xs">
                        {kycLevel >= 3 ? 'Fully Verified' : `Verify Tier ${kycLevel + 1}`}
                    </Button>
                  </div>
               </div>
            </div>
           );
        }
        return <div className="p-20 text-center font-black opacity-20 uppercase tracking-widest">Gogreen Hub</div>;
      }
    }
  };

  const isModal = MODAL_SCREENS.includes(screen);

  return (
    <>
      <div className="min-h-screen bg-ghost flex font-sans">
      {/* Sidebar / Navbar - Conditional Rendering */}
      {showNavbar && (
        <>
          <FloatingNavBar currentScreen={screen} onNavigate={(s) => {
            if (s === AppScreen.TRANSACTION_HISTORY) navigateToHistory();
            else handleProtectedNavigation(s);
          }} />
          <Navbar id="nav-bar" currentScreen={screen} onNavigate={(s) => {
            if (s === AppScreen.TRANSACTION_HISTORY) navigateToHistory();
            else handleProtectedNavigation(s);
          }} />
        </>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen relative flex flex-col ${showNavbar ? 'md:pl-64 lg:pl-0 lg:pt-20' : ''}`}>
        <div 
          className={`flex-1 w-full max-w-md mx-auto flex flex-col relative bg-white shadow-2xl overflow-hidden ${isModal ? 'scale-[0.98] rounded-[32px] transition-all duration-300' : 'scale-100 rounded-none transition-all duration-300'}`}
        >
          <ErrorBoundary>
            {renderScreenContent(isModal ? activeTab : screen)}
          </ErrorBoundary>

        </div>
      </main>

      <BottomSheet isOpen={isModal} onClose={() => setScreen(activeTab)}>
         {isModal && renderScreenContent(screen)}
      </BottomSheet>

      {/* Global Overlay Layer */}
      {globalOverlay && (
        <div className="fixed inset-0 z-[100] bg-white animate-fade-in">
          {globalOverlay === AppScreen.SUPPORT && <SupportScreen onBack={() => setGlobalOverlay(null)} />}
          {globalOverlay === AppScreen.GUIDES_AND_TUTORIALS && <GuidesAndTutorialsScreen onNavigate={(s) => { setScreen(s); setGlobalOverlay(null); }} />}
        </div>
      )}

      {/* Transaction PIN Modal - Moved outside main to be on top of everything */}
      <BottomSheet isOpen={showPinModal} onClose={() => { setShowPinModal(false); setPinInput(''); }} title="Enter PIN">
         <div className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
               <Icons.Lock />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">Enter PIN</h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">Authorize Transaction</p>
            
            <div className="flex gap-3 justify-center mb-6">
               {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg font-black transition-all ${pinInput.length > i ? 'border-primary bg-primary text-white' : 'border-gray-100 bg-gray-50 text-gray-900'}`}>
                     {pinInput.length > i ? '•' : ''}
                  </div>
               ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, idx) => (
                  <button 
                     key={idx}
                     onClick={() => handleTransactionPinPress(num)}
                     className={`h-12 rounded-xl flex items-center justify-center text-lg font-bold active:scale-90 transition-transform ${num === '' ? 'invisible' : num === 'del' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                  >
                     {num === 'del' ? <Icons.Trash /> : num}
                  </button>
               ))}
            </div>
         </div>
      </BottomSheet>

      {showTutorial && (
        <TutorialOverlay 
          onNavigate={setScreen}
          onComplete={() => {
            setShowTutorial(false);
            markScreenSeen('welcome_tour');
          }}
        />
      )}

      {/* Global Loading Modal - Placed at the very end to be on top of everything */}
      <BottomSheet isOpen={isGlobalLoading} onClose={() => {}}>
        <LoadingScreen message={globalLoadingMessage} />
      </BottomSheet>

      {/* Receipt Options Modal */}
      <BottomSheet isOpen={showReceiptOptionsModal} onClose={() => setShowReceiptOptionsModal(false)}>
         <div className="p-5 pb-10 w-full max-w-md mx-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <h3 className="text-lg font-black text-gray-900 mb-4 text-center">Share Receipt</h3>
            <div className="space-y-2">
               <button onClick={() => { setShowReceiptOptionsModal(false); setScreen(AppScreen.RECEIPT_IMAGE_PREVIEW); }} className="w-full p-3 rounded-[16px] bg-gray-50 border border-gray-100 flex items-center gap-3 active:scale-[0.98] transition-all">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm text-base text-primary p-2">
                     <Icons.Image />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-xs text-gray-900">Share as Image</p>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Optimized for Instagram/WhatsApp</p>
                  </div>
               </button>
               <button onClick={() => { setShowReceiptOptionsModal(false); setScreen(AppScreen.RECEIPT_PDF_PREVIEW); }} className="w-full p-3 rounded-[16px] bg-gray-50 border border-gray-100 flex items-center gap-3 active:scale-[0.98] transition-all">
                  <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm text-base text-primary p-2">
                     <Icons.FileText />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-xs text-gray-900">Download as PDF</p>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Official Document Format</p>
                  </div>
               </button>
               <button onClick={() => setShowReceiptOptionsModal(false)} className="w-full p-3 rounded-[16px] text-gray-500 font-bold text-xs mt-2">
                  Cancel
               </button>
            </div>
         </div>
      </BottomSheet>

      {/* Referral Withdraw Confirm Modal */}
      <BottomSheet isOpen={showReferralWithdrawModal} onClose={() => setShowReferralWithdrawModal(false)}>
        <div className="p-5 pb-8 w-full max-w-md mx-auto">
          <div className="w-8 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
          <h3 className="text-base font-black text-gray-900 mb-3 text-center">Confirm Withdrawal</h3>
          <div className="space-y-2 text-center">
            <p className="text-[11px] text-gray-500">You are about to withdraw:</p>
            <h2 className="text-2xl font-black text-primary">₦ {hideBalance ? '••••••' : referralBalance.toLocaleString()}</h2>
            <p className="text-[9px] text-gray-400 max-w-[200px] mx-auto">These funds will be transferred to your Naira Wallet immediately.</p>
          </div>
          <div className="mt-5 flex gap-2.5">
            <Button variant="secondary" className="flex-1 !bg-gray-50 !text-gray-900 !border-gray-200 !h-9 !text-xs" onClick={() => setShowReferralWithdrawModal(false)}>Cancel</Button>
            <Button className="flex-1 !h-9 !text-xs" onClick={() => {
                if (referralBalance >= 3000) {
                    setGlobalLoadingMessage('Processing Withdrawal...');
                    setIsGlobalLoading(true);
                    setTimeout(() => {
                        setWalletBalance(prev => prev + referralBalance);
                        setReferralBalance(0);
                        setIsGlobalLoading(false);
                        showToast("Referral Earnings Withdrawn to Wallet!");
                        setShowReferralWithdrawModal(false);
                    }, 2000);
                } else {
                    showToast("Minimum withdrawal is ₦3,000");
                    setShowReferralWithdrawModal(false);
                }
            }}>Confirm Withdraw</Button>
          </div>
        </div>
      </BottomSheet>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes coin-bounce { 
          0%, 100% { transform: translateY(0) scale(1); } 
          50% { transform: translateY(-35px) scale(1.05); } 
        }
        @keyframes shadow-pulse { 
          0%, 100% { transform: scaleX(1.5); opacity: 0.3; } 
          50% { transform: scaleX(1.1); opacity: 0.1; } 
        }
        @keyframes epic-bounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.4); }
          75% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes echo-wave {
          0% { box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.4); transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-echo { animation: echo-wave 2s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        
        @keyframes slide-down {
          0% { transform: translate(-50%, -100%); opacity: 0; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-down { animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-coin-bounce { animation: coin-bounce 2.8s infinite ease-in-out; }
        .animate-shadow-pulse { animation: shadow-pulse 2.8s infinite ease-in-out; }
        .animate-epic-bounce { animation: epic-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
    </>
  );
};