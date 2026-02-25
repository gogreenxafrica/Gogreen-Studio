import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Toaster, toast as hotToast } from 'react-hot-toast';

import { AppScreen } from './types';
import { Logo, FullLogo, LogoText } from './components/Logo';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { SkeletonScreen, Skeleton } from './components/Skeleton';
import { Navbar } from './components/Navbar';
import { SwipeButton } from './components/SwipeButton';
import { SlideCaptcha } from './components/Captcha';
import { Icons } from './components/Icons';
import QRCode from "react-qr-code";
import * as Constants from './constants';


const BackHeader = ({ title, subtitle, onBack, theme = 'light', onHome }: { title: string, subtitle?: string, onBack?: () => void, theme?: 'light' | 'dark', onHome?: () => void }) => (
  <header className={`px-6 py-6 sticky top-0 z-20 flex flex-col w-full ${theme === 'dark' ? 'bg-dark' : 'bg-ghost'}`}>
    <div className="flex items-center">
      <button 
        onClick={onBack || onHome} 
        className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-90 transition-all ${theme === 'dark' ? 'bg-white/10 text-white border border-white/10 backdrop-blur-md' : 'bg-primary/5 text-primary border border-primary/10 backdrop-blur-sm'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <div className="flex-1 text-center pr-10">
        <h1 className={`font-bold tracking-tight text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
        {subtitle && <p className={`text-[9px] font-black uppercase tracking-[0.2em] mt-0.5 ${theme === 'dark' ? 'text-white/40' : 'text-primary/60'}`}>{subtitle}</p>}
      </div>
    </div>
  </header>
);

const EmailSuggestions = ({ value, onSelect }: { value: string, onSelect: (val: string) => void }) => {
  if (!value.includes('@')) return null;
  const parts = value.split('@');
  const prefix = parts[0];
  const suffix = parts[1] || '';
  if (!prefix) return null;

  const filtered = Constants.DOMAINS.filter(d => d.startsWith(suffix)).slice(0, 5);
  if (filtered.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-dark border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl animate-fade-in glass-dark">
      {filtered.map(domain => (
        <div
          key={domain}
          onClick={() => onSelect(`${prefix}@${domain}`)}
          className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 text-sm text-white/70 hover:text-white transition-colors"
        >
          {prefix}@{domain}
        </div>
      ))}
    </div>
  );
};

const TutorialOverlay = ({ step, onNext, onSkip }: { step: number, onNext: () => void, onSkip: () => void }) => {
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const steps = [
    {
      id: "tutorial-sell-crypto",
      title: "Sell Crypto Instantly",
      desc: "Tap here to convert your Bitcoin, Ethereum, or USDT to Naira in seconds.",
      arrow: "bottom-full left-1/2 -translate-x-1/2 mb-2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white",
    },
    {
      id: "tutorial-pay-bills",
      title: "Pay Bills Easily",
      desc: "Top up airtime, buy data, or pay for cable TV directly from your balance.",
      arrow: "bottom-full left-1/2 -translate-x-1/2 mb-2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white",
    },
    {
      id: "tutorial-check-rates",
      title: "Check Live Rates",
      desc: "See the current exchange rates for all supported coins and calculate your earnings.",
      arrow: "bottom-full left-1/2 -translate-x-1/2 mb-2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white",
    },
    {
      id: "tutorial-auto-withdrawal",
      title: "Auto Withdrawal",
      desc: "Enable this to have your crypto sales sent directly to your bank account automatically.",
      arrow: "bottom-full left-1/2 -translate-x-1/2 mb-2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white",
    }
  ];

  const current = steps[step];

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 10;

    const updatePosition = () => {
      const el = document.getElementById(current.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        
        // If element has no size yet, retry
        if (rect.width === 0 && retryCount < maxRetries) {
          retryCount++;
          setTimeout(updatePosition, 100);
          return;
        }

        setHighlightStyle({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
          opacity: 1,
        });

        // Position tooltip below the highlight, or above if too low
        const tooltipTop = rect.bottom + 24;
        const windowHeight = window.innerHeight;
        
        if (tooltipTop + 250 > windowHeight) {
          setTooltipStyle({
            bottom: (windowHeight - rect.top) + 24,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 1,
          });
        } else {
          setTooltipStyle({
            top: tooltipTop,
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: 1,
          });
        }
      } else if (retryCount < maxRetries) {
        retryCount++;
        setTimeout(updatePosition, 200);
      }
    };

    // Longer delay to allow screen transitions to complete, especially for screen switches
    const timer = setTimeout(updatePosition, 800);
    window.addEventListener('resize', updatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, [step, current.id]);

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Backdrop with hole */}
      <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={onSkip} />
      
      {/* Highlight Hole (Visual only) */}
      <div 
        className="absolute rounded-3xl border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] transition-all duration-500 opacity-0"
        style={highlightStyle}
      />

      {/* Tooltip Card */}
      <div 
        className="absolute w-[85%] max-w-sm bg-white rounded-[32px] p-6 shadow-2xl pointer-events-auto transition-all duration-500 animate-slide-up opacity-0"
        style={tooltipStyle}
      >
        <div className={`absolute ${current.arrow}`} />
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-gray-100'}`} />
            ))}
          </div>
          <button onClick={onSkip} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Skip</button>
        </div>
        
        <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{current.title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-6">{current.desc}</p>
        
        <Button onClick={onNext}>
          {step === steps.length - 1 ? 'Got it!' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export const App = () => {


  const [screen, setScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [walletBalance, setWalletBalance] = useState<number>(125000.00);
  const [pendingBalance, setPendingBalance] = useState<number>(25000.00);
  const [signupData, setSignupData] = useState<any>({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    country: 'Nigeria',
    profileImage: '',
    phone: '',
    autoWithdrawToBank: false
  });
  const [kycLevel, setKycLevel] = useState<number>(0);
  const [signupStep, setSignupStep] = useState<number>(0);
  const [loginData, setLoginData] = useState<any>({ email: '', password: '' });
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTxLoading, setIsTxLoading] = useState<boolean>(false);
  const [hideBalance, setHideBalance] = useState<boolean>(false);

  // Global Interception State
  const [showKycModal, setShowKycModal] = useState<boolean>(false);
  const [areCryptoWalletsGenerated, setAreCryptoWalletsGenerated] = useState<boolean>(false);
  const [areBankAccountsGenerated, setAreBankAccountsGenerated] = useState<boolean>(false);
  const [pendingRoute, setPendingRoute] = useState<AppScreen | null>(null);
  const [isGeneratingCryptoWallets, setIsGeneratingCryptoWallets] = useState<boolean>(false);
  const [isGeneratingBankAccounts, setIsGeneratingBankAccounts] = useState<boolean>(false);

  // User State
  const [bonusClaimed, setBonusClaimed] = useState<boolean>(false);
  const [tradeVolume, setTradeVolume] = useState<number>(0); 
  const [transactionPin, setTransactionPin] = useState<string>('');
  const [tempPin, setTempPin] = useState<string>('');
  const [welcomePin, setWelcomePin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [referralBalance, setReferralBalance] = useState<number>(15000);
  const [points, setPoints] = useState<number>(1250);
  
  // KYC State
  const [kycData, setKycData] = useState({ bvn: '', nin: '' });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  
  // Features State
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [sellAmount, setSellAmount] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedTx, setSelectedTx] = useState<any>(null);
  const [visibleTransactions, setVisibleTransactions] = useState<number>(10);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [selectedBillCategory, setSelectedBillCategory] = useState<any>(null);
  const [sellError, setSellError] = useState<string | null>(null);
  const [billDetails, setBillDetails] = useState({ provider: '', customerId: '', amount: '' });
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(true);
  const [bugReport, setBugReport] = useState({ subject: '', description: '' });
  const [toastToShow, setToastToShow] = useState<any>(null);
  
  // Settings State
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(true);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
  const [quickAccessIds, setQuickAccessIds] = useState<string[]>(['data', 'rates', 'withdraw', 'cable']);
  const [showQuickAccessModal, setShowQuickAccessModal] = useState<boolean>(false);
  const [showVouchers, setShowVouchers] = useState<boolean>(false);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');

  const allServices = Constants.ALL_SERVICES;

  const toggleQuickAccess = (id: string) => {
    setQuickAccessIds(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 4) return prev; // Max 4 for grid
      return [...prev, id];
    });
  };

  // Transaction Signing State
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [onPinSuccess, setOnPinSuccess] = useState<(() => void) | null>(null);
  
  // OTP State
  const [otpValue, setOtpValue] = useState('');
  const otpInputRef = useRef<HTMLInputElement>(null);

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
  const [scannerTab, setScannerTab] = useState<'scan' | 'receive'>('scan');
  const [scannedData, setScannedData] = useState<any>(null);
  const [showScanPaymentModal, setShowScanPaymentModal] = useState(false);
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

  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

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

  const transactions = useMemo(() => Constants.TRANSACTIONS, []);
  const notifications = useMemo(() => Constants.NOTIFICATIONS, []);
  const rewardHistory = useMemo(() => Constants.REWARD_HISTORY, []);
  const vouchers = useMemo(() => Constants.VOUCHERS, []);

  const carouselSlides = useMemo(() => [
    { id: 1, title: 'Pay Bills with Crypto', desc: 'Instant utilities at zero stress.', color: 'bg-white', icon: <Icons.Zap /> },
    { id: 2, title: 'Direct Bank Deposit', desc: 'Wallet to Bank in 30 seconds.', color: 'bg-gray-50', icon: <Icons.Bank /> },
    { id: 3, title: 'Suggestion Box', desc: 'Tell us how to improve Gogreen.', color: 'bg-white', icon: <Icons.Bulb />, action: () => setScreen(AppScreen.SUGGESTION_BOX) }
  ], []);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  useEffect(() => {
    if (screen === AppScreen.SPLASH) {
      const timer = setTimeout(() => {
        setScreen(AppScreen.ONBOARDING_1);
        setIsLoading(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
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

  // Navigation Logic with Protection
  const handleProtectedNavigation = useCallback((target: AppScreen) => {
    // Check KYC for sensitive actions
    if (kycLevel < 1) {
      const protectedScreens = [
        AppScreen.ADD_MONEY, 
        AppScreen.COIN_SELECTION, 
        AppScreen.PAY_BILLS,
        AppScreen.AIRTIME,
        AppScreen.CRYPTO_WALLET_SETUP,
        AppScreen.BANK_ACCOUNT_SETUP
      ];
      
      if (protectedScreens.includes(target)) {
        setPendingRoute(target);
        setShowKycModal(true);
        return;
      }
    }

    // Crypto Wallet Generation Check
    if (target === AppScreen.COIN_SELECTION && !areCryptoWalletsGenerated) {
       setPendingRoute(target);
       setScreen(AppScreen.CRYPTO_WALLET_SETUP);
       return;
    }

    // Bank Account Generation Check
    if (target === AppScreen.ADD_MONEY && !areBankAccountsGenerated) {
       setPendingRoute(target);
       setScreen(AppScreen.BANK_ACCOUNT_SETUP);
       return;
    }

    setScreen(target);
  }, [kycLevel, areCryptoWalletsGenerated, areBankAccountsGenerated, setScreen]);

  const showToast = useCallback((type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    setToastToShow({ type, message });
  }, []);

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
    setIsTxLoading(true);
    setSellError(null);
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 10% chance of failure for demo purposes
          if (Math.random() < 0.1) {
            reject(new Error("Transaction failed due to network congestion. Please try again."));
          } else {
            resolve(true);
          }
        }, 2000);
      });
      
      setScreen(AppScreen.SELL_SUCCESS);
      showToast('success', 'Success!', 'Your crypto has been sold successfully.');
    } catch (error: any) {
      setSellError(error.message || "An unexpected error occurred during the transaction.");
      showToast('error', 'Transaction Failed', 'Please try again later.');
    } finally {
      setIsTxLoading(false);
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
    
    if (step.key === 'captcha') return isCaptchaVerified;
    if (step.key === 'autoWithdrawToBank') return true;
    if (step.key === 'country') return !!signupData.country;
    if (step.key === 'referralCode') return true;
    if (step.key === 'confirmPassword') return val.length >= 8 && val === signupData.password;
    if (step.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (step.key === 'username') return val.length > 3 && val.startsWith('₦-');
    if (step.key === 'password') return val && val.length >= 8;
    return val && val.length >= 2;
  }, [signupStep, signupSteps, signupData, isCaptchaVerified]);

  const handleNextSignup = useCallback(() => {
    if (signupStep < signupSteps.length - 1) {
      setSignupStep(signupStep + 1);
    } else {
      setScreen(AppScreen.OTP_VERIFICATION);
    }
  }, [signupStep, signupSteps.length, setSignupStep, setScreen]);

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
          setScreen(AppScreen.HOME);
        } else {
          showToast('error', 'Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
          setPinError(true);
          setWelcomePin('');
        }
      }, 500);
    }
  }, [pinError, transactionPin, setScreen, showToast]);

  const handlePinSetup = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = (e.target.value ?? '').replace(/[^0-9]/g, '').slice(0, 4);
    setTempPin(val);
  }, []);

  const handleCryptoWalletGeneration = useCallback(() => {
     setIsGeneratingCryptoWallets(true);
     setTimeout(() => {
        setIsGeneratingCryptoWallets(false);
        setAreCryptoWalletsGenerated(true);
        if (pendingRoute) {
            setScreen(pendingRoute);
            setPendingRoute(null);
        } else {
            setScreen(AppScreen.HOME);
        }
        showToast('success', 'Wallets Generated', 'Your new crypto addresses are ready.');
     }, 3000);
  }, [pendingRoute, setScreen, showToast]);

  const handleBankAccountGeneration = useCallback(() => {
     setIsGeneratingBankAccounts(true);
     setTimeout(() => {
        setIsGeneratingBankAccounts(false);
        setAreBankAccountsGenerated(true);
        if (pendingRoute) {
            setScreen(pendingRoute);
            setPendingRoute(null);
        } else {
            setScreen(AppScreen.HOME);
        }
        showToast('success', 'Bank Account Ready', 'Your virtual bank account is active.');
     }, 3000);
  }, [pendingRoute, setScreen, showToast]);

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
          if (newPin === (transactionPin || '1234')) {
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

  const renderScreen = () => {
    switch (screen) {
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
          <div className="flex-1 flex flex-col bg-dark p-10 animate-fade-in text-white relative overflow-hidden justify-center items-center">
             <div className="w-full max-w-sm mx-auto flex flex-col items-center">
               <div className="w-24 h-24 rounded-[28px] overflow-hidden bg-white border border-white/20 mb-6 shadow-2xl">
                   <img src={signupData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupData.username || 'hassan'}`} className="w-full h-full object-cover" alt="Avatar" />
               </div>
               <h2 className="text-3xl font-black mb-1">Welcome Back,</h2>
               <h3 className="text-xl font-medium opacity-60 mb-12">{signupData.username || 'Hassan'}</h3>
               
               <div className="relative w-full flex flex-col items-center mb-8">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-6">Enter Transaction PIN</p>
                   
                   <div className={`flex gap-4 justify-center relative z-10 mb-8 ${pinError ? 'animate-shake' : ''}`}>
                     {[0, 1, 2, 3].map(i => {
                       const isActive = welcomePin.length === i;
                       const isFilled = welcomePin.length > i;
                       return (
                        <div 
                          key={i} 
                          className={`w-12 h-12 bg-white/5 border ${pinError ? 'border-red-500 bg-red-500/10 text-red-500' : isFilled ? 'border-primary bg-primary text-white' : isActive ? 'border-primary/50 bg-white/10' : 'border-white/10'} rounded-full flex items-center justify-center text-xl font-black transition-all relative`}
                        >
                          {isFilled && '•'}
                          {isActive && !pinError && (
                            <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20"></div>
                          )}
                        </div>
                       );
                     })}
                   </div>

                   {/* Custom Keypad */}
                   <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
                       {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, idx) => (
                         <button 
                            key={idx}
                            onClick={() => handleKeypadPress(num)}
                            className={`h-16 rounded-2xl flex items-center justify-center text-2xl font-bold active:scale-90 transition-transform ${
                               num === '' ? 'invisible' : 
                               num === 'del' ? 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white' : 
                               'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                            }`}
                         >
                            {num === 'del' ? <Icons.Trash className="w-6 h-6" /> : num}
                         </button>
                      ))}
                   </div>
               </div>

               <Button variant="ghost" onClick={() => showToast('info', 'Reset Link Sent', 'A password reset link has been sent to your email.')} className="!w-auto !px-6 mb-4">Forgot PIN?</Button>
               <Button variant="ghost" onClick={() => setScreen(AppScreen.LOGIN)} className="!w-auto !px-6 !text-white/30">Switch Account</Button>
             </div>
          </div>
        );

      case AppScreen.ONBOARDING_1:
      case AppScreen.ONBOARDING_2:
      case AppScreen.ONBOARDING_3:
        const data = {
          [AppScreen.ONBOARDING_1]: { title: "Sell Crypto, Get Naira.", desc: "The fastest automated bridge from digital assets to your Nigerian bank account.", step: 1 },
          [AppScreen.ONBOARDING_2]: { title: "Unmatched Security.", desc: "Grade-A encryption for every transaction. We value your trust above all else.", step: 2 },
          [AppScreen.ONBOARDING_3]: { title: "Simple, Sleek, Secure.", desc: "Experience pure fintech ease built specifically for Nigeria.", step: 3 },
        }[screen as keyof typeof data];

        return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-[#051a08] to-black animate-fade-in text-white overflow-hidden items-center justify-center">
            <div className="w-full max-w-md h-full flex flex-col relative">
                <div className="h-[45%] flex items-center justify-center relative px-8 pt-12">
                  <div className="absolute inset-0 bg-primary/5 rounded-b-[60px]" />
                  <Logo className="w-72 h-32 relative z-10" variant="premium" />
                </div>
                <div className="p-10 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h1 className="text-4xl font-black leading-tight tracking-tight">{data.title}</h1>
                    <p className="text-white/40 text-base font-medium leading-relaxed">{data.desc}</p>
                    <div className="flex gap-2 pt-2">
                      <div className={`h-1 rounded-full transition-all duration-300 ${data.step === 1 ? 'w-10 bg-primary' : 'w-2 bg-white/10'}`} />
                      <div className={`h-1 rounded-full transition-all duration-300 ${data.step === 2 ? 'w-10 bg-primary' : 'w-2 bg-white/10'}`} />
                      <div className={`h-1 rounded-full transition-all duration-300 ${data.step === 3 ? 'w-10 bg-primary' : 'w-2 bg-white/10'}`} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {screen === AppScreen.ONBOARDING_3 ? (
                      <div className="flex flex-col gap-4">
                        <SwipeButton text="Swipe to create account" onComplete={() => setScreen(AppScreen.SIGNUP)} />
                        <Button variant="ghost" onClick={() => setScreen(AppScreen.LOGIN)} className="!text-white/30 mt-2">Login to Account</Button>
                      </div>
                    ) : (
                      <Button onClick={() => setScreen(screen === AppScreen.ONBOARDING_1 ? AppScreen.ONBOARDING_2 : AppScreen.ONBOARDING_3)}>Next</Button>
                    )}
                  </div>
                </div>
            </div>
          </div>
        );
      
      case AppScreen.LOGIN:
          return (
            <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-[#051a08] to-black p-8 animate-slide-up overflow-y-auto no-scrollbar items-center justify-center">
              <div className="w-full max-w-md">
                  <div className="flex justify-between items-center mb-12">
                    <button onClick={() => setScreen(AppScreen.ONBOARDING_3)} className="text-white/40">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <Logo className="w-24 h-8" variant="premium" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-2">Welcome Back</h2>
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-12">Login to your hub</p>
                  <div className="space-y-6">
                    <div className="flex flex-col">
                      <Input 
                        label="Email or Username" 
                        placeholder="kehindevhassan" 
                        prefix="₦-"
                        variant="glass"
                        value={loginData.email} 
                        onChange={e => {
                            let newVal = e.target.value ?? '';
                            const raw = newVal.replace(/^[₦-]+/, '');
                            setLoginData({...loginData, email: '₦-' + raw});
                        }} 
                      />
                      <EmailSuggestions value={loginData.email} onSelect={(val) => setLoginData({...loginData, email: val})} />
                    </div>
                    <Input label="Password" type="password" placeholder="••••••••" variant="glass" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} />
                    <div className="flex justify-end">
                      <Button variant="ghost" onClick={() => setScreen(AppScreen.FORGOT_PASSWORD)} className="!w-auto !h-8 !px-0">Forgot Password?</Button>
                    </div>
                    <Button onClick={() => setScreen(AppScreen.HOME)}>Login</Button>
                    <div className="text-center pt-4">
                      <Button variant="ghost" onClick={() => setScreen(AppScreen.SIGNUP)} className="!w-auto mx-auto !text-white/30">Don't have an account? <span className="text-primary ml-1">Sign Up</span></Button>
                    </div>
                  </div>
              </div>
            </div>
          );

      case AppScreen.FORGOT_PASSWORD:
        return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-[#051a08] to-black p-8 animate-fade-in relative overflow-hidden items-center justify-center">
             <div className="w-full max-w-md">
                <button onClick={() => setScreen(AppScreen.LOGIN)} className="text-white/40 mb-10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-4xl font-black text-white mb-2">Reset Password</h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-10">Enter your email to receive instructions</p>
                
                <div className="space-y-6">
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Email Address</label>
                      <Input 
                        value={loginData.email} 
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        placeholder="name@example.com" 
                        type="email" 
                        className="!bg-white/5 !border-white/10 !text-white placeholder:text-white/20" 
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
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-[#051a08] to-black p-8 animate-slide-up overflow-y-auto no-scrollbar items-center justify-center">
            <div className="w-full max-w-md">
                <button onClick={() => signupStep > 0 ? setSignupStep(signupStep - 1) : setScreen(AppScreen.ONBOARDING_3)} className="text-white/40 mb-10">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-4xl font-black text-white mb-2">Create Account</h2>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-10">Step {signupStep + 1} of {signupSteps.length}</p>
                
                <div className="space-y-6">
                  {currentStep.isDropdown ? (
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">{currentStep.label}</label>
                      <div 
                        onClick={() => setIsCountryOpen(!isCountryOpen)}
                        className={`w-full py-4 px-4 glass-dark border ${isCountryOpen ? 'border-primary' : 'border-white/10'} rounded-[20px] flex justify-between items-center text-white font-medium cursor-pointer active:bg-white/10 transition-all`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🇳🇬</span>
                          <span>{signupData.country}</span>
                        </div>
                        <svg className={`w-4 h-4 text-white/30 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      {isCountryOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-dark border border-white/10 rounded-[20px] overflow-hidden z-30 shadow-2xl animate-fade-in glass-dark">
                          <div 
                            onClick={() => { setSignupData({...signupData, country: 'Nigeria'}); setIsCountryOpen(false); }}
                            className="p-4 hover:bg-white/5 flex items-center gap-3 cursor-pointer border-b border-white/5 last:border-0"
                          >
                            <span className="text-xl">🇳🇬</span>
                            <span className="text-white text-sm font-bold">Nigeria</span>
                          </div>
                        </div>
                      )}
                      <p className="text-[9px] text-white/20 italic ml-1 mt-1">Gogreen currently supports Nigeria only.</p>
                    </div>
                  ) : currentStep.isPreference ? (
                    <div className="flex flex-col gap-4">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">{currentStep.label}</label>
                      <div className="space-y-3">
                        <div 
                          onClick={() => setSignupData({...signupData, autoWithdrawToBank: true})}
                          className={`p-5 rounded-[24px] border transition-all cursor-pointer flex items-center gap-4 ${signupData.autoWithdrawToBank ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(46,139,58,0.1)]' : 'border-white/10 bg-white/5'}`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${signupData.autoWithdrawToBank ? 'border-primary bg-primary' : 'border-white/20'}`}>
                            {signupData.autoWithdrawToBank && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-bold text-sm">Automatic Bank Payment</p>
                            <p className="text-white/40 text-[10px]">Crypto deposits are paid directly to your bank.</p>
                          </div>
                        </div>
                        <div 
                          onClick={() => setSignupData({...signupData, autoWithdrawToBank: false})}
                          className={`p-5 rounded-[24px] border transition-all cursor-pointer flex items-center gap-4 ${!signupData.autoWithdrawToBank ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(46,139,58,0.1)]' : 'border-white/10 bg-white/5'}`}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${!signupData.autoWithdrawToBank ? 'border-primary bg-primary' : 'border-white/20'}`}>
                            {!signupData.autoWithdrawToBank && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-bold text-sm">Store in Gogreen Balance</p>
                            <p className="text-white/40 text-[10px]">Deposits are kept in your wallet for manual withdrawal.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : currentStep.key === 'captcha' ? (
                    <SlideCaptcha isVerified={isCaptchaVerified} onVerify={() => setIsCaptchaVerified(true)} />
                  ) : (
                    <div className="flex flex-col gap-1 relative">
                      <Input 
                        label={currentStep.label} 
                        type={currentStep.type || 'text'}
                        placeholder={currentStep.placeholder} 
                        variant="glass"
                        value={(signupData as any)[currentStep.key]} 
                        onPaste={currentStep.key === 'confirmPassword' ? (e) => e.preventDefault() : undefined}
                        onChange={e => {
                            let newVal = e.target.value;
                            if (currentStep.key === 'username' || currentStep.key === 'referralCode') {
                                 const raw = newVal.replace(/^[₦-]+/, '');
                                 newVal = '₦-' + raw;
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
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.valid ? 'bg-primary text-white' : 'bg-white/10 text-white/20'}`}>
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              </div>
                              <span className={`text-[10px] font-medium transition-colors ${req.valid ? 'text-white' : 'text-white/40'}`}>{req.label}</span>
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
                    <Button disabled={!validateCurrentStep() || isCountryOpen} onClick={handleNextSignup}>
                      {signupStep === signupSteps.length - 1 ? 'Complete Signup' : 'Continue'}
                    </Button>
                  </div>
                </div>
            </div>
          </div>
        );
      
      case AppScreen.OTP_VERIFICATION:
        return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-[#051a08] to-black p-10 animate-fade-in text-white relative overflow-hidden items-center justify-center">
            <div className="w-full max-w-md">
                <h2 className="text-4xl font-black mb-2 mt-10">Verify Email</h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Enter the 4-digit code sent to you</p>
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
                      className={`flex-1 aspect-square glass-dark border ${otpValue.length === i ? 'border-primary shadow-[0_0_15px_rgba(26,93,34,0.3)]' : 'border-white/10'} rounded-2xl flex items-center justify-center text-3xl font-black transition-all`}
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
                  onClick={() => setScreen(AppScreen.KYC_PIN_SETUP)}
                >
                  Verify Now
                </Button>
                <Button variant="ghost" onClick={() => showToast("Verification code resent!")} className="mt-8 !text-white/30">
                  Resend Code in 0:45
                </Button>
            </div>
          </div>
        );
            case AppScreen.KYC_PIN_SETUP:
         return (
            <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-[#051a08] to-black animate-slide-up items-center justify-center p-8">
               <div className="w-full max-w-md flex flex-col items-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 border border-primary/20 shadow-[0_0_30px_rgba(46,139,58,0.2)]">
                     <Icons.Lock />
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">Set Transaction PIN</h2>
                  <p className="text-white/40 text-xs font-medium mb-10 text-center">Create a 4-digit PIN to secure your transactions.</p>
                  
                  <div className="flex gap-4 justify-center mb-10 w-full max-w-[240px]">
                     {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all ${tempPin.length > i ? 'border-primary bg-primary text-white shadow-[0_0_15px_rgba(46,139,58,0.4)]' : 'border-white/10 bg-white/5 text-white'}`}>
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
                           className={`h-16 rounded-2xl flex items-center justify-center text-xl font-bold active:scale-90 transition-transform ${num === '' ? 'invisible' : num === 'del' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
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
            <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-[#051a08] to-black animate-slide-up items-center justify-center p-8">
               <div className="w-full max-w-md flex flex-col h-full">
                  <div className="flex justify-between items-center mb-8">
                     <h2 className="text-3xl font-black text-white">Add Bank</h2>
                     <button onClick={() => setScreen(AppScreen.ACCOUNT_CREATED)} className="text-white/40 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Skip</button>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                     <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Select Bank</label>
                           <select className="w-full p-4 rounded-[20px] bg-white/5 border border-white/10 focus:outline-none focus:border-primary text-sm font-bold text-white appearance-none">
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
                           <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Account Number</label>
                           <input 
                              type="tel" 
                              placeholder="0123456789" 
                              className="w-full p-4 rounded-[20px] bg-white/5 border border-white/10 focus:outline-none focus:border-primary text-sm font-mono font-bold text-white placeholder:text-white/20" 
                              maxLength={10}
                              onInput={(e) => {
                                 const target = e.target as HTMLInputElement;
                                 target.value = target.value.replace(/[^0-9]/g, '');
                              }}
                           />
                        </div>

                        <div className="bg-yellow-500/10 p-4 rounded-[20px] border border-yellow-500/20 flex gap-3 items-start">
                           <span className="text-yellow-500 mt-0.5"><Icons.Alert /></span>
                           <p className="text-xs text-yellow-200/80 leading-relaxed font-medium">Please ensure the bank account name matches your verified identity name <span className="font-bold text-yellow-200">({signupData.fullName || 'Hassan Kehinde'})</span>.</p>
                        </div>
                     </div>

                     <div className="mt-10">
                        <Button onClick={() => { showToast("Bank Account Added!"); setScreen(AppScreen.ACCOUNT_CREATED); }}>Verify & Save</Button>
                     </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.ACCOUNT_CREATED:
        return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-[#051a08] to-black items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-full max-w-md">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-8 animate-epic-bounce shadow-[0_0_50px_rgba(26,93,34,0.4)] border-4 border-white/10 mx-auto">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2 className="text-4xl font-black text-white mb-2">Welcome Home</h2>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-12">Your Gogreen Africa Dashboard is ready</p>
                <Button onClick={() => { setTutorialStep(0); setShowTutorial(true); setScreen(AppScreen.HOME); }}>Take a Quick Tour</Button>
                <Button variant="ghost" onClick={() => setScreen(AppScreen.HOME)} className="mt-4 !text-white/30">Skip Tour</Button>
            </div>
          </div>
        );

      case AppScreen.CRYPTO_WALLET_SETUP:
         return (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-900 via-[#051a08] to-black items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(46,139,58,0.15),transparent_70%)] pointer-events-none" />
             <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20 shadow-[0_0_30px_rgba(46,139,58,0.2)]">
                   <div className={`w-10 h-10 text-white ${isGeneratingCryptoWallets ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                      <Icons.Lock />
                   </div>
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Secure Wallet Setup</h2>
                <p className="text-white/40 text-xs font-medium mb-10 max-w-[280px] leading-relaxed">
                   Generating unique blockchain addresses for your account. This is a one-time process.
                </p>
                {isGeneratingCryptoWallets ? (
                   <div className="space-y-3 w-full max-w-[280px]">
                      <div className="flex justify-between text-[10px] font-bold text-primary uppercase tracking-widest px-1">
                         <span>Encrypting...</span>
                         <span className="animate-pulse">100% Secure</span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-primary animate-pulse w-2/3 rounded-full"></div>
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
                   <div className={`w-10 h-10 text-white ${isGeneratingBankAccounts ? 'animate-pulse' : ''}`}>
                      <Icons.Bank />
                   </div>
                </div>
                <h2 className="text-3xl font-black text-white mb-3">Virtual Bank Account</h2>
                <p className="text-white/40 text-xs font-medium mb-10 max-w-[280px] leading-relaxed">
                   Generating a dedicated virtual bank account for your Naira deposits.
                </p>
                {isGeneratingBankAccounts ? (
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

      case AppScreen.HOME:
        return (
           <div className="flex-1 flex flex-col bg-ghost overflow-y-auto no-scrollbar animate-fade-in pb-10 relative">
            
            {/* Background Design Elements */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full pointer-events-none"></div>
            
            <header className="px-6 pt-10 pb-6 flex justify-between items-center max-w-7xl mx-auto w-full relative z-10">
              <div className="flex flex-col">
                 <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{getGreeting()}</p>
                 <h2 className="text-2xl font-black text-gray-900 tracking-tight">{signupData.username}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setScreen(AppScreen.NOTIFICATIONS)} className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-600 relative active:scale-95 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  {hasUnreadNotifications && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>}
                </button>
                <div className="relative cursor-pointer" onClick={() => setScreen(AppScreen.ME)}>
                  <div className="w-10 h-10 rounded-[18px] overflow-hidden glass p-0.5">
                    <img src={signupData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupData.username}`} className="w-full h-full object-cover rounded-[16px]" alt="Avatar" />
                  </div>
                  {kycLevel >= 3 && (
                    <div className="absolute -bottom-1 -right-1 bg-secondary text-white w-3 h-3 rounded-full border border-ghost flex items-center justify-center shadow-sm">
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Grid Layout for Tablet/Desktop */}
            <div className="px-6 pb-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              
              {/* Main Column */}
              <div className="lg:col-span-8 space-y-6">
                  {/* Portfolio Card */}
                  <div className="bg-primary p-8 rounded-[40px] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                    {/* Background Design using Logo Mark Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ 
                           backgroundImage: `url('/assets/logos/gogreen-white-logomark.png')`,
                           backgroundSize: '40px',
                           backgroundRepeat: 'repeat'
                         }}>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-full flex justify-center items-start mb-2 px-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-2">Total Balance</p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-3 mb-1 w-full relative">
                        <div className="flex items-center gap-3">
                          <h3 className="text-4xl lg:text-6xl font-black tracking-tighter">
                            {currency === 'NGN' ? '₦' : '$'} {hideBalance ? '••••••' : (currency === 'NGN' ? (walletBalance + (bonusClaimed ? 3000 : 0)) : ((walletBalance + (bonusClaimed ? 3000 : 0)) / 1710)).toLocaleString(undefined, { minimumFractionDigits: currency === 'USD' ? 2 : 0, maximumFractionDigits: currency === 'USD' ? 2 : 0 })}
                          </h3>
                          <button onClick={() => setHideBalance(!hideBalance)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm active:scale-90 transition-all border border-white/10"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                        </div>

                        {/* Currency Selector aligned with balance */}
                        <div className="absolute right-0 hidden lg:flex flex-col items-center gap-1">
                          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/10 flex flex-col gap-1">
                            <button 
                              onClick={() => setCurrency('USD')}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${currency === 'USD' ? 'bg-white text-primary shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                              $
                            </button>
                            <button 
                              onClick={() => setCurrency('NGN')}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${currency === 'NGN' ? 'bg-white text-primary shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                              ₦
                            </button>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{currency}</span>
                        </div>
                      </div>
                      {pendingBalance > 0 && (
                        <div className="mb-8 flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            <p className="text-[10px] font-bold text-white/80">Pending: ₦ {pendingBalance.toLocaleString()}</p>
                        </div>
                      )}
                      {pendingBalance === 0 && <div className="mb-8" />}

                      <div className="flex gap-3 w-full max-w-sm mx-auto">
                        <Button id="tutorial-sell-crypto" noShine variant="glass" className="flex-1 !h-12 sm:!h-14 bg-white/20 !border-white/10 !overflow-visible animate-echo relative z-10 text-[10px] sm:text-xs font-black uppercase tracking-widest" onClick={() => handleProtectedNavigation(AppScreen.COIN_SELECTION)}>Sell Crypto</Button>
                        <Button variant="secondary" className="flex-1 !h-12 sm:!h-14 text-[10px] sm:text-xs font-black uppercase tracking-widest" onClick={() => handleProtectedNavigation(AppScreen.ADD_MONEY)}>Add Money</Button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Access Services */}
                  <div className="grid grid-cols-4 gap-4">
                      {allServices.filter(s => quickAccessIds.includes(s.id)).map((item, i) => (
                        <div 
                          key={i} 
                          id={item.id === 'rates' ? 'tutorial-check-rates' : item.id === 'airtime' ? 'tutorial-pay-bills' : undefined}
                          onClick={() => setScreen(item.screen)} 
                          className="flex flex-col items-center gap-2 group cursor-pointer"
                        >
                            <div className={`w-14 h-14 ${item.color} border rounded-2xl flex items-center justify-center p-4 shadow-sm group-active:scale-90 transition-all hover:border-current/10`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</span>
                        </div>
                      ))}
                  </div>

                  {/* Rate Calculator Link Card - Removed as it's now in Quick Access */}



                  {/* Complete Account Setup Card - Only if Unverified */}
                  {kycLevel < 1 && (
                    <div onClick={() => setScreen(AppScreen.KYC_INTRO)} className="glass-card rounded-[28px] p-5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group">
                        <div className="absolute left-0 top-4 bottom-4 w-1 bg-red-500 rounded-r-full"></div>
                        <div className="flex items-center gap-4 pl-2">
                          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl animate-pulse shadow-sm group-active:scale-90 transition-transform">
                              <Icons.Alert />
                          </div>
                          <div>
                              <h3 className="font-black text-gray-900 text-sm">Account Action Required</h3>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-1">Complete Tier 1 to unlock trades</p>
                          </div>
                        </div>
                        <div className="w-10 h-10 bg-gray-50/50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-gray-100 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </div>
                    </div>
                  )}

                  {/* Welcome Bonus Card */}
                  {!bonusClaimed && signupData.referralCode && kycLevel < 1 && (
                    <div onClick={() => setScreen(AppScreen.KYC_INTRO)} className="w-full glass-card rounded-[28px] p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all">
                      <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-full flex items-center justify-center animate-pulse p-2">
                          <Icons.Gift />
                      </div>
                      <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">Claim ₦3,000 Bonus</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Finish setup to unlock</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                    </div>
                  )}

                  {/* Banner Carousel */}
                  <div className="pt-2 pb-4">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                        {carouselSlides.map(slide => (
                          <div key={slide.id} onClick={slide.action} className={`snap-center shrink-0 w-[85%] md:w-[45%] ${slide.color} rounded-[32px] p-6 text-gray-900 relative overflow-hidden shadow-sm border border-gray-100 active:scale-[0.98] transition-all cursor-pointer`}>
                              <div className="absolute right-0 bottom-0 w-32 h-32 opacity-[0.03] -rotate-12 translate-x-4 translate-y-4 text-black">{slide.icon}</div>
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm border border-gray-50 mb-8 text-primary">{slide.icon}</div>
                              <h3 className="font-black text-xl mb-1 tracking-tight">{slide.title}</h3>
                              <p className="text-gray-500 text-sm font-medium pr-10 leading-snug">{slide.desc}</p>
                          </div>
                        ))}
                    </div>
                  </div>
              </div>

              {/* Side Column (Activity) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="font-black text-gray-900 tracking-tight">Recent Activity</h3>
                  <Button variant="ghost" onClick={navigateToHistory} className="!w-auto !h-auto !p-0 !text-primary flex items-center gap-1.5">View All</Button>
                </div>
                <div className="space-y-3">
                  {isTxLoading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="p-4 glass-card rounded-[24px] flex items-center gap-4 border border-gray-100/50">
                        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
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
                      {transactions.slice(0, 5).map(tx => (
                        <div key={tx.id} onClick={() => { setSelectedTx(tx); setScreen(AppScreen.TRANSACTION_DETAILS); }} className="p-4 glass-card rounded-[24px] flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer hover:border-primary/20">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold p-2.5" style={{ backgroundColor: tx.color }}>{tx.icon}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start"><p className="font-bold text-gray-900 text-sm tracking-tight">{tx.type}</p><p className="font-bold text-gray-900 text-sm">{tx.fiatAmount}</p></div>
                            <p className="text-[10px] text-gray-400 font-medium mt-0.5">{tx.date}</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="ghost" onClick={navigateToHistory} className="w-full !text-gray-400 hover:!text-primary">See complete history</Button>
                    </>
                  )}
                </div>
              </div>

            </div>
            
            <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-30">
               <div onClick={() => setScreen(AppScreen.SUPPORT)} className="w-14 h-14 bg-dark rounded-full flex items-center justify-center text-white shadow-2xl shadow-black/20 animate-bounce cursor-pointer border-4 border-white p-3.5 hover:bg-primary transition-colors">
                  <Icons.Headphones />
               </div>
            </div>
          </div>
        );

      /* ==========================================================================================
         1) TRANSACTION HISTORY SCREEN
         ========================================================================================== */
      case AppScreen.TRANSACTION_HISTORY:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in overflow-hidden items-center">
            <div className="w-full max-w-4xl flex flex-col h-full">
                <BackHeader title="Transactions" subtitle="History" />
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-10">
                  {isTxLoading ? (
                    <SkeletonScreen type="list" />
                  ) : (
                    <div className="space-y-4 pt-4">
                      {transactions.length > 0 ? (
                        <>
                          {transactions.slice(0, visibleTransactions).map(tx => (
                            <div key={tx.id} onClick={() => { setSelectedTx(tx); setScreen(AppScreen.TRANSACTION_DETAILS); }} className="p-5 bg-white rounded-[28px] flex items-center gap-4 border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:shadow-md">
                              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white p-3 shadow-sm" style={{ backgroundColor: tx.color }}>
                                {tx.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="font-bold text-gray-900 text-sm">{tx.type}</p>
                                  <div className="text-right">
                                    <p className="font-bold text-gray-900 text-sm">{tx.fiatAmount}</p>
                                    <p className="text-[10px] font-medium text-gray-400">{tx.cryptoAmount}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-[10px] text-gray-400 font-medium">{tx.date} • {tx.time}</p>
                                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${tx.status === 'Success' ? 'bg-green-100 text-green-700' : tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    {tx.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          {visibleTransactions < transactions.length && (
                            <Button onClick={() => setVisibleTransactions(prev => prev + 10)} className="w-full mt-4">Load More</Button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 relative">
                             <div className="absolute inset-0 border-2 border-dashed border-gray-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
                             <div className="w-10 h-10"><Icons.Empty /></div>
                          </div>
                          <h3 className="text-xl font-black text-gray-900 mb-2">No Transactions Yet</h3>
                          <p className="text-sm text-gray-400 max-w-[250px] font-medium leading-relaxed">Your financial journey begins here. Make your first trade or deposit.</p>
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
                  <div className="p-6 overflow-y-auto no-scrollbar pb-10">
                    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                        
                        {/* Status Badge */}
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 ${selectedTx.status === 'Success' ? 'bg-green-100 text-green-700' : selectedTx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {selectedTx.status}
                        </div>

                        {/* Big Amounts */}
                        <h2 className="text-3xl font-black text-gray-900 mb-1">{selectedTx.fiatAmount}</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">{selectedTx.cryptoAmount}</p>
                        
                        {/* Destination Account */}
                        {selectedTx.bankName !== 'N/A' && (
                          <div className="w-full bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 mb-8">
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Destination Account</p>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-900">{selectedTx.bankName}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-mono text-gray-600">{selectedTx.accountNumber}</span>
                              </div>
                          </div>
                        )}

                        {/* Breakdown */}
                        <div className="w-full space-y-5">
                          <div className="flex justify-between py-2 border-b border-gray-50">
                              <span className="text-gray-400 text-xs font-medium">Reference</span>
                              <span className="text-gray-900 text-xs font-bold font-mono">{selectedTx.ref}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-50">
                              <span className="text-gray-400 text-xs font-medium">Network</span>
                              <span className="text-gray-900 text-xs font-bold">{selectedTx.network}</span>
                          </div>
                          
                          {selectedTx.coinName && (
                            <>
                              <div className="flex justify-between py-2 border-b border-gray-50">
                                  <span className="text-gray-400 text-xs font-medium">Coin Name</span>
                                  <span className="text-gray-900 text-xs font-bold">{selectedTx.coinName}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-50">
                                  <span className="text-gray-400 text-xs font-medium">Amount (Units)</span>
                                  <span className="text-gray-900 text-xs font-bold">{selectedTx.unitAmount}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-50">
                                  <span className="text-gray-400 text-xs font-medium">Deposit Date</span>
                                  <span className="text-gray-900 text-xs font-bold">{selectedTx.depositDate}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-gray-50">
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-400 text-xs font-medium">Service Fee</span>
                                    <button onClick={() => showToast("Fee: 1% (Capped at $10)")} className="text-gray-300 hover:text-primary transition-colors">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </button>
                                  </div>
                                  <span className="text-gray-900 text-xs font-bold">{selectedTx.platformFee}</span>
                              </div>
                              {selectedTx.explorerLink && (
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span className="text-gray-400 text-xs font-medium">Blockchain Record</span>
                                    <a href={selectedTx.explorerLink} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-bold underline">View on Explorer</a>
                                </div>
                              )}
                            </>
                          )}

                          {!selectedTx.coinName && (
                            <div className="flex justify-between py-2 border-b border-gray-50">
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-400 text-xs font-medium">Platform Fee</span>
                                  <button onClick={() => showToast("Standard platform processing fee")} className="text-gray-300 hover:text-primary transition-colors">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  </button>
                                </div>
                                <span className="text-green-600 text-xs font-bold">{selectedTx.platformFee}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between py-2 border-b border-gray-50">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400 text-xs font-medium">Network Fee</span>
                                <button onClick={() => showToast("Fee charged by the blockchain network")} className="text-gray-300 hover:text-primary transition-colors">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </button>
                              </div>
                              <span className="text-gray-900 text-xs font-bold">{selectedTx.networkFee}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-50">
                              <span className="text-gray-400 text-xs font-medium">Exchange Rate</span>
                              <span className="text-gray-900 text-xs font-bold">{selectedTx.exchangeRate}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-50">
                              <span className="text-gray-400 text-xs font-medium">Date & Time</span>
                              <span className="text-gray-900 text-xs font-bold">{selectedTx.date}, {selectedTx.time}</span>
                          </div>
                        </div>


                    </div>
                    
                    <div className="mt-6 flex gap-4">
                        <Button variant="secondary" className="flex-1 !bg-gray-50 !text-gray-900 !border-gray-200" onClick={() => setScreen(AppScreen.RECEIPT_OPTIONS)}>Share Receipt</Button>
                        <Button variant="secondary" className="flex-1 !bg-red-50 !text-red-500 !border-red-100" onClick={() => setScreen(AppScreen.REPORT_BUG)}>Report Issue</Button>
                    </div>
                  </div>
              </div>
           </div>
        );

      /* ==========================================================================================
         3) SHARE RECEIPT BOTTOM SHEET
         ========================================================================================== */
      case AppScreen.RECEIPT_OPTIONS:
         return (
            <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in items-center">
               <div className="bg-white rounded-t-[32px] p-6 pb-12 animate-slide-up w-full max-w-md">
                  <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8"></div>
                  <h3 className="text-xl font-black text-gray-900 mb-6 text-center">Share Receipt</h3>
                  <div className="space-y-3">
                     <button onClick={() => setScreen(AppScreen.RECEIPT_IMAGE_PREVIEW)} className="w-full p-4 rounded-[20px] bg-gray-50 border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-lg text-primary p-2.5">
                           <Icons.Image />
                        </div>
                        <div className="text-left">
                           <p className="font-bold text-sm text-gray-900">Share as Image</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Optimized for Instagram/WhatsApp</p>
                        </div>
                     </button>
                     <button onClick={() => setScreen(AppScreen.RECEIPT_PDF_PREVIEW)} className="w-full p-4 rounded-[20px] bg-gray-50 border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-lg text-primary p-2.5">
                           <Icons.FileText />
                        </div>
                        <div className="text-left">
                           <p className="font-bold text-sm text-gray-900">Download as PDF</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Official Document Format</p>
                        </div>
                     </button>
                     <button onClick={() => setScreen(AppScreen.TRANSACTION_DETAILS)} className="w-full p-4 rounded-[20px] text-gray-500 font-bold text-sm mt-4">
                        Cancel
                     </button>
                  </div>
               </div>
            </div>
         );

      /* ==========================================================================================
         4) IMAGE RECEIPT PREVIEW SCREEN
         ========================================================================================== */
      case AppScreen.RECEIPT_IMAGE_PREVIEW:
         if (!selectedTx) return <div />;
         return (
            <div className="flex-1 flex flex-col bg-dark animate-fade-in overflow-hidden relative items-center justify-center">
               <div className="w-full max-w-md h-full flex flex-col relative">
                  <div className="absolute top-6 left-6 z-20">
                      <button onClick={() => setScreen(AppScreen.TRANSACTION_DETAILS)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>

                  {/* Receipt Container - Premium Design */}
                  <div className="flex-1 flex items-center justify-center p-6">
                      <div className="bg-[#111] w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative border border-white/10">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(46,139,58,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(46,139,58,0.1) 0%, transparent 40%)' }}></div>
                        
                        <div className="p-8 flex flex-col items-center relative z-10">
                            <div className="mb-8">
                              <Logo className="w-32 h-10" variant="white" />
                            </div>
                            
                            <div className="text-center mb-8">
                              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Total Amount</p>
                              <h1 className="text-4xl font-black text-white tracking-tight">{selectedTx.fiatAmount}</h1>
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-4 ${selectedTx.status === 'Success' ? 'bg-green-500/20 text-green-400' : selectedTx.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedTx.status === 'Success' ? 'bg-green-400' : selectedTx.status === 'Pending' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">{selectedTx.status} Transaction</span>
                              </div>
                            </div>

                            <div className="w-full bg-white/5 rounded-2xl p-6 space-y-4 mb-6 border border-white/5 backdrop-blur-sm">
                              <div className="flex justify-between items-center">
                                  <span className="text-xs text-white/40 font-medium">Date</span>
                                  <span className="text-xs text-white font-bold">{selectedTx.date}, {selectedTx.time}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                  <span className="text-xs text-white/40 font-medium">Reference</span>
                                  <span className="text-xs text-white font-bold font-mono">{selectedTx.ref}</span>
                              </div>
                              <div className="w-full h-px bg-white/10 my-2"></div>
                              <div className="flex justify-between items-center">
                                  <span className="text-xs text-white/40 font-medium">Type</span>
                                  <span className="text-xs text-white font-bold">{selectedTx.type}</span>
                              </div>
                              {selectedTx.bankName !== 'N/A' && (
                                <>
                                  <div className="flex justify-between items-center">
                                      <span className="text-xs text-white/40 font-medium">Bank</span>
                                      <span className="text-xs text-white font-bold">{selectedTx.bankName}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                      <span className="text-xs text-white/40 font-medium">Account</span>
                                      <span className="text-xs text-white font-bold">{selectedTx.accountNumber}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="flex items-center justify-center gap-2 opacity-30">
                              <Icons.Shield />
                              <span className="text-[10px] font-medium text-white uppercase tracking-widest">Secured by Gogreen</span>
                            </div>
                        </div>
                        
                        {/* Bottom decorative edge */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-green-400 to-primary"></div>
                      </div>
                  </div>

                  <div className="p-6 flex gap-4">
                      <Button variant="glass" className="flex-1" onClick={() => showToast("Image Saved to Gallery")}>Save Image</Button>
                      <Button variant="primary" className="flex-1" onClick={() => showToast("Sharing Options Opened")}>Share Receipt</Button>
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
                  <div className="absolute top-6 left-6 z-20">
                      <button onClick={() => setScreen(AppScreen.TRANSACTION_DETAILS)} className="w-10 h-10 bg-dark/10 rounded-full flex items-center justify-center text-dark hover:bg-dark/20 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>

                  {/* PDF A4 Paper Mockup */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start">
                      <div className="bg-white w-full max-w-[595px] min-h-[842px] shadow-xl p-10 relative text-gray-800">
                        <div className="flex justify-between items-start mb-12 border-b-2 border-primary pb-8">
                            <div>
                              <LogoText className="h-8 mb-2" variant="primary" />
                              <p className="text-xs text-gray-500 mt-2">123 Innovation Drive,<br/>Lekki Phase 1, Lagos.</p>
                            </div>
                            <div className="text-right">
                              <h1 className="text-2xl font-black text-primary uppercase tracking-widest mb-1">Receipt</h1>
                              <p className="text-sm font-bold text-gray-900">#{selectedTx.ref}</p>
                              <p className="text-xs text-gray-500">{selectedTx.date}</p>
                            </div>
                        </div>

                        <div className="mb-10">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
                            <h3 className="text-lg font-bold text-gray-900">{signupData.username}</h3>
                            <p className="text-sm text-gray-500">{signupData.email}</p>
                        </div>

                        <table className="w-full mb-12">
                            <thead>
                              <tr className="border-b border-gray-200">
                                  <th className="text-left py-3 text-xs font-black text-gray-400 uppercase tracking-widest">Description</th>
                                  <th className="text-right py-3 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-100">
                                  <td className="py-4 text-sm font-medium">
                                    Sale of {selectedTx.cryptoAmount} @ {selectedTx.exchangeRate}
                                    <div className="text-xs text-gray-400 mt-1">Network: {selectedTx.network}</div>
                                  </td>
                                  <td className="py-4 text-sm font-bold text-right">{selectedTx.fiatAmount}</td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                  <td className="py-4 text-sm font-medium">Network Fee</td>
                                  <td className="py-4 text-sm font-bold text-right text-red-500">-{selectedTx.networkFee}</td>
                              </tr>
                              <tr>
                                  <td className="py-4 text-sm font-medium">Platform Service Fee</td>
                                  <td className="py-4 text-sm font-bold text-right text-green-600">Free</td>
                              </tr>
                            </tbody>
                        </table>

                        <div className="flex justify-end mb-16">
                            <div className="w-1/2">
                              <div className="flex justify-between items-center py-2 border-t-2 border-gray-900 pt-4">
                                  <span className="text-sm font-black uppercase tracking-widest">Total</span>
                                  <span className="text-xl font-black text-primary">{selectedTx.fiatAmount}</span>
                              </div>
                            </div>
                        </div>

                        <div className="text-center border-t border-gray-100 pt-8">
                            <p className="text-xs font-bold text-gray-900 mb-1">Thank you for choosing Gogreen.</p>
                            <p className="text-[10px] text-gray-400">This is an electronically generated receipt.</p>
                        </div>
                      </div>
                  </div>
                  
                  <div className="p-6">
                      <Button onClick={() => showToast("PDF Downloaded")} variant="primary">Download PDF</Button>
                  </div>
               </div>
            </div>
         );

      /* ==========================================================================================
         6) REWARDS SCREEN
         ========================================================================================== */
      case AppScreen.REWARDS:
        return (
            <div className="flex-1 flex flex-col bg-ghost animate-fade-in pb-24 overflow-y-auto no-scrollbar">
                {/* Premium Header */}
                <div className="bg-primary p-6 sm:p-8 rounded-b-[40px] sm:rounded-b-[50px] text-white relative overflow-hidden shadow-2xl shadow-primary/20">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative z-10 max-w-7xl mx-auto w-full">
                        <div className="flex justify-between items-center mb-6 sm:mb-10">
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Rewards Hub</p>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tighter">Your Earnings</h2>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-lg sm:text-xl">
                                🎁
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-[28px] sm:rounded-[32px] border border-white/10 flex sm:flex-col justify-between items-center sm:items-start">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white/80">Total Points</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl sm:text-3xl font-black tracking-tighter">{points.toLocaleString()}</span>
                                    <span className="text-[10px] font-black opacity-60">PTS</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-[28px] sm:rounded-[32px] border border-white/10 flex sm:flex-col justify-between items-center sm:items-start">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white/80">Referral</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl sm:text-3xl font-black tracking-tighter">₦{referralBalance.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="secondary" className="flex-1 !h-11 sm:!h-12 font-black uppercase tracking-widest text-[10px]" onClick={() => showToast("Redeem Shop Opening Soon")}>Redeem Shop</Button>
                            <Button variant="glass" className="flex-1 !h-11 sm:!h-12 font-black uppercase tracking-widest text-[10px]" onClick={() => setScreen(AppScreen.REFERRAL_WITHDRAW_CONFIRM)}>Withdraw</Button>
                        </div>
                    </div>
                </div>

                <div className="px-6 pt-6 sm:pt-12 md:pt-16 relative z-20 space-y-8 sm:space-y-12 max-w-7xl mx-auto w-full">
                    {/* Referral Code Card */}
                    <div className="bg-white p-5 sm:p-6 rounded-[32px] sm:rounded-[40px] shadow-xl shadow-black/5 border border-gray-100 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-5 sm:mb-6">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg shadow-yellow-400/20">
                                    <Icons.Gift />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">Refer & Earn ₦1,000</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invite friends to trade</p>
                                </div>
                            </div>
                                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-3 sm:py-4 px-5 sm:px-6 flex justify-between items-center">
                                    <span className="font-mono font-black text-gray-900 tracking-[0.3em] text-base sm:text-lg">HASSAN23</span>
                                    <button onClick={() => copyToClipboard("HASSAN23")} className="text-[10px] font-black uppercase text-primary bg-white px-3 py-1.5 rounded-lg shadow-sm active:scale-90 transition-transform">Copy</button>
                                </div>
                                <Button className="h-12 sm:h-14 sm:w-14 !py-0" onClick={() => showToast("Sharing options coming soon!")}>
                                    <span className="sm:hidden text-[10px] font-black uppercase tracking-widest mr-2">Share Code</span>
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Vouchers Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="font-black text-gray-900 text-[10px] sm:text-sm uppercase tracking-widest">Active Vouchers</h3>
                            <button 
                                onClick={() => setShowVouchers(!showVouchers)}
                                className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1.5"
                            >
                                {showVouchers ? (
                                    <>
                                        <span>Hide</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                                    </>
                                ) : (
                                    <>
                                        <span>View All</span>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {showVouchers && (
                            <div className="flex gap-4 overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 no-scrollbar pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 animate-fade-in">
                                {vouchers.map(v => (
                                    <div key={v.id} className={`${v.color} min-w-[260px] sm:min-w-0 p-5 sm:p-8 rounded-[32px] sm:rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-black/10 flex-shrink-0 sm:flex-shrink-1 group`}>
                                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6 sm:mb-10">
                                                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[9px] font-black uppercase tracking-widest">Discount</div>
                                                <div className="text-[9px] font-black opacity-60 uppercase tracking-widest">Min: ₦{v.minOrderAmount.toLocaleString()}</div>
                                            </div>
                                            <h4 className="text-lg sm:text-2xl font-black leading-tight mb-2 tracking-tight">{v.title}</h4>
                                            <p className="text-[10px] sm:text-xs opacity-80 mb-6 sm:mb-10 font-medium leading-relaxed">{v.desc}</p>
                                            <Button 
                                                variant="secondary" 
                                                className="w-full !py-3 sm:!py-5 bg-white !text-gray-900 !rounded-[16px] sm:!rounded-[24px] text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl"
                                                onClick={() => {
                                                    if (v.id === 1) setScreen(AppScreen.COIN_SELECTION);
                                                    else if (v.id === 2) setScreen(AppScreen.PAY_BILLS);
                                                    else showToast("Voucher activated!");
                                                }}
                                            >
                                                Use Voucher
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {!showVouchers && (
                            <div className="bg-white/50 backdrop-blur-sm border border-dashed border-gray-200 rounded-[32px] p-8 text-center cursor-pointer hover:bg-white transition-colors group" onClick={() => setShowVouchers(true)}>
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <Icons.Gift className="text-gray-400" />
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tap to view your vouchers</p>
                            </div>
                        )}
                    </div>

                    {/* History Section */}
                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-8">Recent Rewards</h3>
                        <div className="space-y-6">
                            {rewardHistory.length > 0 ? (
                                rewardHistory.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                <div className="w-6 h-6"><Icons.Gift /></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 tracking-tight">{item.type}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.date}</p>
                                            </div>
                                        </div>
                                        <span className="text-primary font-black text-sm">{item.amount}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Icons.Gift />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest">No history yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );

      case AppScreen.COIN_SELECTION:
        const filteredCoins = coins.filter(coin => coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
            <div className="w-full max-w-2xl flex flex-col h-full">
              <BackHeader title="Sell Assets" subtitle="Select Coin" />
              <div className="px-6 pt-4 pb-2">
                 <Input 
                    placeholder="Search coins..." 
                    value={searchQuery}
                    variant="glass-light"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                 />
              </div>
              <div className="p-6 space-y-4 overflow-y-auto no-scrollbar">
                {filteredCoins.length > 0 ? (
                  filteredCoins.map((coin, index) => (
                    <div 
                       key={coin.id} 
                       onClick={() => { 
                          setSelectedCoin(coin); 
                          setSellError(null);
                          if (coin.id === 'usdt' || coin.id === 'usdc') {
                             setScreen(AppScreen.NETWORK_SELECTION);
                          } else {
                             setScreen(AppScreen.COIN_RECEIVE); 
                          }
                       }} 
                       className="p-5 glass-card rounded-[28px] flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:border-primary/30 animate-slide-up"
                       style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                    >
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm" style={{ backgroundColor: coin.color }}>{coin.symbol[0]}</div>
                         <div>
                           <p className="font-bold text-gray-900 text-base tracking-tight mb-0.5">{coin.name}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{coin.symbol} • {coin.network}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-gray-900 text-sm tracking-tight">
                           {currency === 'NGN' ? '₦' : '$'} {currency === 'NGN' ? (coin.balance * coin.rate).toLocaleString() : ((coin.balance * coin.rate) / 1710).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                         </p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{coin.balance} {coin.symbol}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                     </div>
                     <p className="text-sm font-bold text-gray-900">No coins found</p>
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
                  <BackHeader title={`Select Network`} subtitle={selectedCoin.symbol} onBack={() => setScreen(AppScreen.COIN_SELECTION)} />
                  <div className="p-6 overflow-y-auto no-scrollbar pb-10">
                      
                      <div className="bg-blue-50 p-5 rounded-[24px] border border-blue-100 flex gap-4 items-start mb-8">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <div>
                              <h4 className="font-bold text-blue-900 text-sm mb-1">Important Notice</h4>
                              <p className="text-xs text-blue-800 leading-relaxed font-medium">Please select the correct network for your deposit. Sending assets on the wrong network will result in permanent loss.</p>
                          </div>
                      </div>

                      <h3 className="text-sm font-black text-gray-900 mb-4 px-2 tracking-tight">Available Networks</h3>
                      <div className="space-y-3">
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
                                  className="p-5 bg-white rounded-[24px] border border-gray-100 flex items-center justify-between cursor-pointer hover:border-primary/30 active:scale-[0.98] transition-all shadow-sm"
                              >
                                  <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                      </div>
                                      <div>
                                          <p className="font-bold text-gray-900 text-sm">{net.name}</p>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Fee: ~0.1%</p>
                                      </div>
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.COIN_RECEIVE:
         if(!selectedCoin) return <div/>;
         
         // Special handling for Naira Wallet - Show Virtual Account details
         if (selectedCoin.id === 'ngn') {
             return (
                <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
                   <div className="w-full max-w-2xl flex flex-col h-full">
                     <BackHeader title="Naira Wallet" subtitle="Virtual Account" onBack={() => setScreen(AppScreen.COIN_SELECTION)} />
                     <div className="p-6">
                        <div className="bg-primary p-6 rounded-[32px] text-white shadow-xl shadow-primary/20 relative overflow-hidden mb-6">
                          <div className="relative z-10 text-center">
                              <p className="text-[10px] uppercase tracking-widest opacity-70 mb-2">Virtual Account</p>
                              <p className="text-sm opacity-80 mb-6">Transfer to this account to fund your wallet instantly.</p>
                              
                              <div className="bg-white/10 rounded-2xl p-4 mb-3 border border-white/10 flex justify-between items-center cursor-pointer hover:bg-white/20 transition-colors" onClick={() => copyToClipboard("9028371920")}>
                                <div className="text-left">
                                    <p className="text-[10px] uppercase opacity-60">Account Number</p>
                                    <p className="text-xl font-mono font-black tracking-widest">9028371920</p>
                                </div>
                                <span className="text-xs font-bold bg-white text-primary px-2 py-1 rounded-lg">Copy</span>
                              </div>

                              <div className="flex gap-3">
                                <div className="flex-1 bg-white/10 rounded-2xl p-3 border border-white/10 text-left">
                                    <p className="text-[10px] uppercase opacity-60">Bank Name</p>
                                    <p className="font-bold">Wema Bank</p>
                                </div>
                                <div className="flex-1 bg-white/10 rounded-2xl p-3 border border-white/10 text-left">
                                    <p className="text-[10px] uppercase opacity-60">Account Name</p>
                                    <p className="font-bold">Gogreen-{String(signupData.username || '').replace('₦-','')}</p>
                                </div>
                              </div>
 
                              <div className="mt-8">
                                <Button variant="secondary" className="w-full !h-14" onClick={() => setScreen(AppScreen.WITHDRAW_MONEY)}>Withdraw to Bank</Button>
                              </div>
                          </div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex gap-3 items-start mb-6">
                          <span className="w-5 h-5 text-yellow-600"><Icons.Zap /></span>
                          <p className="text-xs text-yellow-800 leading-relaxed font-medium">Transfers typically reflect within 1-5 minutes.</p>
                        </div>
                     </div>
                   </div>
                </div>
             );
         }

         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title={`Receive ${selectedCoin.symbol}`} subtitle="Deposit Address" onBack={() => {
                      if (selectedCoin.id === 'usdt' || selectedCoin.id === 'usdc') {
                          setScreen(AppScreen.NETWORK_SELECTION);
                      } else {
                          setScreen(AppScreen.COIN_SELECTION);
                      }
                  }} />
                  <div className="p-6 overflow-y-auto no-scrollbar pb-10">
                      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center text-center mb-6">
                        
                        {(selectedCoin.id === 'usdt' || selectedCoin.id === 'usdc') && (
                            <div className="w-full flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Network</p>
                                    <p className="font-black text-gray-900">{selectedCoin.network}</p>
                                </div>
                                <Button variant="ghost" className="!w-auto !h-8 !px-4 !text-xs !bg-gray-50 !text-gray-900" onClick={() => setScreen(AppScreen.NETWORK_SELECTION)}>Change</Button>
                            </div>
                        )}

                        <div className="w-56 h-56 bg-gray-100 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ExampleAddress')] bg-contain bg-no-repeat bg-center opacity-80 mix-blend-multiply"></div>
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center absolute shadow-lg p-2">
                              <div className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: selectedCoin.color }}>{selectedCoin.symbol[0]}</div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mb-2">Scan QR or Copy Address</p>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 w-full flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => copyToClipboard(selectedCoin.address, 'Copied! Please verify before pasting to prevent address tampering.')}>
                            <p className="font-mono text-xs text-gray-800 break-all text-left flex-1">{selectedCoin.address}</p>
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100">
                            <span className="text-xs font-medium text-gray-400">Current Rate</span>
                            <span className="text-sm font-black text-gray-900">1 {selectedCoin.symbol} = ₦ {selectedCoin.rate.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100">
                            <span className="text-xs font-medium text-gray-400">Pending Sale</span>
                            <span className="text-sm font-black text-gray-900">₦ 0.00</span>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex gap-3 items-start">
                            <span className="w-5 h-5 text-yellow-600 mt-0.5"><Icons.Alert /></span>
                            <p className="text-xs text-yellow-800 leading-relaxed font-medium">Send only <span className="font-bold">{selectedCoin.name} ({selectedCoin.network})</span> to this address. Sending other assets may result in permanent loss.</p>
                        </div>
                      </div>

                      <Button onClick={() => setScreen(AppScreen.COIN_DETAIL)}>Calculators / Sell Now</Button>
                  </div>
               </div>
            </div>
         );

      case AppScreen.COIN_DETAIL:
         const rate = selectedCoin?.rate || 0;
         const amount = parseFloat(sellAmount) || 0;
         const totalNaira = amount * rate;

         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title={`Sell ${selectedCoin?.symbol}`} subtitle="Enter Amount" onBack={() => setScreen(AppScreen.COIN_RECEIVE)} />
                  <div className="p-6 flex-1 flex flex-col">
                      <div className="glass-card p-6 rounded-[32px] mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: selectedCoin?.color }}>{selectedCoin?.symbol[0]}</div>
                              <div><p className="font-bold text-gray-900">{selectedCoin?.name}</p><p className="text-xs text-gray-400">Rate: ₦{rate.toLocaleString()}</p></div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Balance</p>
                                <p className="font-black text-gray-900">{selectedCoin?.balance} {selectedCoin?.symbol}</p>
                            </div>
                        </div>
                        <div className="bg-ghost rounded-2xl p-4 mb-4">
                            <div className="flex justify-between mb-2"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">You Sell</label><span className="text-[10px] font-bold text-primary cursor-pointer active:scale-95 transition-transform" onClick={() => setSellAmount(selectedCoin?.balance.toString())}>Max: {selectedCoin?.balance} {selectedCoin?.symbol}</span></div>
                            <div className="flex items-center gap-2">
                              <input type="number" placeholder="0.00" value={sellAmount} onChange={e => setSellAmount(e.target.value)} className="w-full bg-transparent text-3xl font-black text-gray-900 outline-none placeholder:text-gray-200" />
                              <span className="font-bold text-gray-400">{selectedCoin?.symbol}</span>
                            </div>
                        </div>
                        <div className="flex justify-center my-2"><div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">↓</div></div>
                        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                            <label className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">You Receive</label>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-3xl font-black text-primary">₦ {totalNaira.toLocaleString()}</span>
                            </div>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                          <Button 
                             onClick={() => {
                                 if (amount > 0 && amount <= (selectedCoin?.balance || 0)) {
                                     setScreen(AppScreen.SELL_SUMMARY);
                                 } else if (amount > (selectedCoin?.balance || 0)) {
                                     showToast("Insufficient balance");
                                 } else {
                                     showToast("Enter a valid amount");
                                 }
                             }}
                          >
                              Continue
                          </Button>
                      </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.SELL_SUMMARY:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Confirm Sale" subtitle="Summary" onBack={() => setScreen(AppScreen.COIN_DETAIL)} />
                  <div className="p-6 flex-1 flex flex-col">
                      <div className="glass-card p-8 rounded-[32px] mb-8 space-y-6">
                        <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                            <span className="text-sm font-medium text-gray-500">Amount to Sell</span>
                            <span className="text-lg font-black text-gray-900">{sellAmount} {selectedCoin?.symbol}</span>
                        </div>
                        <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                            <span className="text-sm font-medium text-gray-500">Exchange Rate</span>
                            <span className="text-lg font-bold text-gray-900">₦ {selectedCoin?.rate.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                            <span className="text-sm font-medium text-gray-500">Service Fee</span>
                            <span className={`text-lg font-bold ${selectedVoucher?.id === 1 ? 'text-green-600 line-through opacity-50' : 'text-gray-900'}`}>₦ {(parseFloat(sellAmount) * (selectedCoin?.rate || 0) * 0.01).toLocaleString()}</span>
                        </div>
                        {selectedVoucher?.id === 1 && (
                           <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                               <span className="text-sm font-medium text-gray-500">Voucher Discount</span>
                               <span className="text-lg font-bold text-green-600">- ₦ {(parseFloat(sellAmount) * (selectedCoin?.rate || 0) * 0.01).toLocaleString()}</span>
                           </div>
                        )}
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-bold text-gray-500">Total To Receive</span>
                            <span className="text-2xl font-black text-primary">₦ {(parseFloat(sellAmount) * (selectedCoin?.rate || 0)).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Voucher Section */}
                      <div className="glass-card p-6 rounded-[32px] mb-8">
                          <div className="flex justify-between items-center mb-4">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Apply Voucher</h4>
                              {selectedVoucher && (
                                  <button onClick={() => setSelectedVoucher(null)} className="text-[10px] font-black uppercase text-red-500">Remove</button>
                              )}
                          </div>
                          
                          {selectedVoucher ? (
                              <div className={`${selectedVoucher.color} p-4 rounded-2xl text-white flex justify-between items-center shadow-md`}>
                                  <div>
                                      <p className="font-black text-sm">{selectedVoucher.title}</p>
                                      <p className="text-[10px] opacity-70">Min Order: ₦{selectedVoucher.minOrderAmount.toLocaleString()}</p>
                                  </div>
                                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  </div>
                              </div>
                          ) : (
                              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                  {vouchers.map(v => {
                                      const totalValue = parseFloat(sellAmount) * (selectedCoin?.rate || 0);
                                      const isEligible = totalValue >= v.minOrderAmount;
                                      return (
                                          <div 
                                              key={v.id} 
                                              onClick={() => {
                                                  if (isEligible) {
                                                      setSelectedVoucher(v);
                                                  } else {
                                                      showToast(`Minimum order for this voucher is ₦${v.minOrderAmount.toLocaleString()}`);
                                                  }
                                              }}
                                              className={`p-4 rounded-2xl border flex flex-col gap-2 min-w-[160px] transition-all ${isEligible ? 'bg-gray-50 border-gray-100 cursor-pointer hover:border-primary/30' : 'bg-gray-50/50 border-gray-100 opacity-50 grayscale cursor-not-allowed'}`}
                                          >
                                              <div className={`w-8 h-8 rounded-lg ${v.color} flex items-center justify-center text-white text-[10px] font-black`}>%</div>
                                              <div>
                                                  <p className="font-bold text-gray-900 text-xs">{v.title}</p>
                                                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Min: ₦{v.minOrderAmount.toLocaleString()}</p>
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          )}
                      </div>
                      <div className="mt-auto space-y-4">
                        <div className="flex items-start gap-3 bg-yellow-50 p-4 rounded-xl">
                            <span className="w-5 h-5 text-yellow-600 mt-0.5"><Icons.Alert /></span>
                            <p className="text-xs text-yellow-700 leading-relaxed font-medium">By confirming, you agree to the instant sale of your assets at the locked rate. This action cannot be undone.</p>
                        </div>
                        <SwipeButton text="Swipe to Sell" onComplete={() => {
                           setOnPinSuccess(() => handleSellCrypto);
                           setShowPinModal(true);
                        }} />
                        
                        {sellError && (
                           <div className="bg-red-50 border border-red-100 p-4 rounded-2xl animate-shake">
                              <div className="flex items-center gap-2 text-red-600 mb-1">
                                 <div className="w-4 h-4"><Icons.Alert /></div>
                                 <span className="text-[10px] font-black uppercase tracking-widest">Transaction Error</span>
                              </div>
                              <p className="text-xs text-red-500 font-medium leading-relaxed">{sellError}</p>
                           </div>
                        )}
                      </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.SELL_SUCCESS:
         return (
            <div className="flex-1 flex flex-col bg-primary items-center justify-center p-8 text-center animate-fade-in text-white">
               <div className="w-full max-w-md">
                   <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8 border border-white/30 shadow-2xl animate-epic-bounce mx-auto">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                   </div>
                   <h2 className="text-4xl font-black mb-2">Sold Successfully!</h2>
                   <p className="text-white/70 font-medium mb-12">Your funds are on the way to your bank account.</p>
                   
                   <div className="bg-white/10 rounded-[24px] p-6 w-full border border-white/10 mb-8 backdrop-blur-md">
                      <div className="flex justify-between mb-4">
                         <span className="text-white/60 text-xs uppercase font-bold tracking-widest">Amount</span>
                         <span className="font-bold">₦ {(parseFloat(sellAmount) * selectedCoin?.rate).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-white/60 text-xs uppercase font-bold tracking-widest">Reference</span>
                         <span className="font-mono text-xs opacity-80">#REF-{Math.floor(Math.random()*1000000)}</span>
                      </div>
                   </div>

                   <Button variant="secondary" onClick={() => {
                      setSellAmount('');
                      setTradeVolume(prev => prev + 50); // Mock trade volume increment
                      setPoints(prev => prev + 1); // Add point per trade
                      setScreen(AppScreen.HOME);
                   }}>Back to Home</Button>
               </div>
            </div>
         );

      case AppScreen.SCANNER:
        return (
          <div className="flex-1 flex flex-col bg-black animate-fade-in items-center relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
              <button onClick={() => setScreen(AppScreen.HOME)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              {/* Tabs */}
              <div className="bg-white/10 backdrop-blur-md rounded-full p-1 flex">
                <button 
                  onClick={() => setScannerTab('scan')}
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${scannerTab === 'scan' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                >
                  Scan
                </button>
                <button 
                  onClick={() => setScannerTab('receive')}
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${scannerTab === 'receive' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}
                >
                  Receive
                </button>
              </div>

              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
            </div>

            {scannerTab === 'scan' ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Simulated Camera View */}
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                    {/* Camera Feed Simulation */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                    
                    <div className="w-64 h-64 border-2 border-primary/50 rounded-[40px] relative z-10">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl shadow-[0_0_15px_rgba(46,139,58,0.5)]"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl shadow-[0_0_15px_rgba(46,139,58,0.5)]"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl shadow-[0_0_15px_rgba(46,139,58,0.5)]"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl shadow-[0_0_15px_rgba(46,139,58,0.5)]"></div>
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/50 animate-scan-line shadow-[0_0_20px_rgba(46,139,58,0.8)]"></div>
                    </div>

                      <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
                      {/* Simulate Scan button removed as per request */}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center gap-6 z-10">
                  <p className="text-white/60 text-xs font-medium text-center max-w-[200px]">Align the QR code within the frame to pay instantly</p>
                  <div className="flex gap-8">
                    <button className="flex flex-col items-center gap-2 group">
                      <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white group-active:scale-90 transition-transform border border-white/5">
                        <Icons.Image />
                      </div>
                      <span className="text-[10px] text-white/60 font-black uppercase tracking-widest group-hover:text-white transition-colors">Gallery</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 group">
                      <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white group-active:scale-90 transition-transform border border-white/5">
                        <Icons.Zap />
                      </div>
                      <span className="text-[10px] text-white/60 font-black uppercase tracking-widest group-hover:text-white transition-colors">Flash</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 w-full flex flex-col items-center justify-center p-8 pt-24 bg-dark">
                <div className="bg-white p-8 rounded-[32px] shadow-2xl flex flex-col items-center gap-6 w-full max-w-sm animate-scale-in relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-green-400 to-primary"></div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                      <img src={signupData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupData.username || 'hassan'}`} className="w-full h-full object-cover" alt="Avatar" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">@{signupData.username || 'User'}</h3>
                    <p className="text-xs text-gray-400 font-medium">Scan to pay me directly</p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                    <QRCode 
                      value={`gogreen:${signupData.username || 'user'}`}
                      size={200}
                      level="H"
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                  </div>

                  <div className="w-full flex gap-3">
                    <Button variant="outline" className="flex-1 !text-xs" onClick={() => copyToClipboard(`gogreen:${signupData.username}`, "Wallet address copied!")}>
                      Copy ID
                    </Button>
                    <Button className="flex-1 !text-xs" onClick={() => showToast("QR Code saved to gallery")}>
                      Share QR
                    </Button>
                  </div>
                </div>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-8 text-center max-w-xs">
                  This QR code accepts payments from any Gogreen user instantly.
                </p>
              </div>
            )}

            {/* Payment Modal */}
            {showScanPaymentModal && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
                <div className="bg-white w-full max-w-sm rounded-[32px] p-6 animate-slide-up shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-gray-900">Confirm Payment</h3>
                    <button onClick={() => setShowScanPaymentModal(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[24px] mb-6 border border-gray-100">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">🏪</div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Paying to</p>
                      <p className="text-lg font-black text-gray-900">{scannedData?.name}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <Input 
                      label="Amount (NGN)" 
                      placeholder="0.00" 
                      value={scanAmount} 
                      onChange={(e) => setScanAmount(e.target.value)}
                      prefix="₦"
                      type="number"
                    />
                    <Input 
                      label="Note (Optional)" 
                      placeholder="What's this for?" 
                      value="" 
                      onChange={() => {}}
                    />
                  </div>

                  <Button 
                    onClick={() => {
                      setIsTxLoading(true);
                      setTimeout(() => {
                        setIsTxLoading(false);
                        setShowScanPaymentModal(false);
                        setScanAmount('');
                        setScreen(AppScreen.SELL_SUCCESS); // Reuse success screen or create new one
                        showToast(`Paid ₦${scanAmount || '0'} to ${scannedData?.name}`);
                      }, 1500);
                    }}
                    disabled={!scanAmount}
                  >
                    {isTxLoading ? 'Processing...' : `Pay ₦${scanAmount || '0.00'}`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case AppScreen.PAY_BILLS:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in overflow-hidden items-center">
            <div className="w-full max-w-2xl flex flex-col h-full">
                <BackHeader title="Utilities" subtitle="Pay Bills" />
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto no-scrollbar">
                  {[
                    { label: 'Airtime', icon: <Icons.Phone />, providers: ['MTN', 'Airtel', 'Glo', '9mobile'] },
                    { label: 'Data', icon: <Icons.Wifi />, providers: ['MTN Data', 'Airtel Data', 'Glo Data', '9mobile Data'] },
                    { label: 'Cable TV', icon: <Icons.Monitor />, providers: ['DSTV', 'GOTV', 'Startimes'] },
                    { label: 'Electricity', icon: <Icons.Zap />, providers: ['IKEDC', 'EKEDC', 'AEDC', 'PHED'] },
                    { label: 'Internet', icon: <Icons.Globe />, providers: ['Smile', 'Spectranet', 'Starlink'] },
                    { label: 'Betting', icon: <Icons.Ball />, providers: ['SportyBet', 'Bet9ja', '1xBet'] }
                  ].map(cat => (
                    <div key={cat.label} onClick={() => { setSelectedBillCategory(cat); setScreen(AppScreen.BILL_PAYMENT_DETAILS); }} className="p-8 bg-white rounded-[32px] aspect-square flex flex-col justify-between border border-gray-100 cursor-pointer active:scale-95 transition-all shadow-sm hover:shadow-md">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-2xl shadow-sm p-3 text-primary">{cat.icon}</div>
                      <p className="font-black text-gray-900 text-sm tracking-tight">{cat.label}</p>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        );

      case AppScreen.BILL_PAYMENT_DETAILS:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
            <div className="w-full max-w-2xl flex flex-col h-full">
                <BackHeader title={selectedBillCategory?.label || 'Bill Payment'} subtitle="Enter Details" onBack={() => setScreen(AppScreen.PAY_BILLS)} />
                <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Select Provider</label>
                        <div className="grid grid-cols-2 gap-3">
                            {selectedBillCategory?.providers.map((p: string) => (
                                <button 
                                    key={p} 
                                    onClick={() => setBillDetails({...billDetails, provider: p})}
                                    className={`p-4 rounded-2xl border text-sm font-bold transition-all ${billDetails.provider === p ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-gray-900 border-gray-100 shadow-sm'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input 
                        label={selectedBillCategory?.label === 'Airtime' || selectedBillCategory?.label === 'Data' ? 'Phone Number' : 'Customer ID / Meter Number'} 
                        placeholder="e.g. 08123456789"
                        variant="glass-light"
                        value={billDetails.customerId}
                        onChange={(e) => setBillDetails({...billDetails, customerId: e.target.value})}
                    />

                    <Input 
                        label="Amount" 
                        type="number"
                        placeholder="0.00"
                        variant="glass-light"
                        value={billDetails.amount}
                        onChange={(e) => setBillDetails({...billDetails, amount: e.target.value})}
                    />

                    <div className="pt-4">
                        <Button 
                            disabled={!billDetails.provider || !billDetails.customerId || !billDetails.amount || parseFloat(billDetails.amount) <= 0}
                            onClick={() => setScreen(AppScreen.BILL_PAYMENT_SUMMARY)}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
          </div>
        );

      case AppScreen.BILL_PAYMENT_SUMMARY:
        const billAmount = parseFloat(billDetails.amount) || 0;
        const discount = selectedVoucher ? (billAmount * 0.05) : 0; // Example 5% discount
        const totalToPay = billAmount - discount;

        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
            <div className="w-full max-w-2xl flex flex-col h-full">
                <BackHeader title="Confirm Payment" subtitle="Summary" onBack={() => setScreen(AppScreen.BILL_PAYMENT_DETAILS)} />
                <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                            <span className="text-xs text-gray-400 font-medium">Service</span>
                            <span className="text-sm font-black text-gray-900">{selectedBillCategory?.label}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                            <span className="text-xs text-gray-400 font-medium">Provider</span>
                            <span className="text-sm font-black text-gray-900">{billDetails.provider}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                            <span className="text-xs text-gray-400 font-medium">Account</span>
                            <span className="text-sm font-black text-gray-900">{billDetails.customerId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400 font-medium">Amount</span>
                            <span className="text-sm font-black text-gray-900">₦ {billAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Voucher Section */}
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Discount Voucher</h4>
                            {selectedVoucher && (
                                <button onClick={() => setSelectedVoucher(null)} className="text-[10px] font-black uppercase text-red-500">Remove</button>
                            )}
                        </div>
                        
                        {selectedVoucher ? (
                            <div className={`${selectedVoucher.color} p-4 rounded-2xl text-white flex justify-between items-center shadow-md`}>
                                <div>
                                    <p className="font-black text-sm">{selectedVoucher.title}</p>
                                    <p className="text-[10px] opacity-70">Min Order: ₦{selectedVoucher.minOrderAmount.toLocaleString()}</p>
                                </div>
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {vouchers.map(v => {
                                    const isEligible = billAmount >= v.minOrderAmount;
                                    return (
                                        <div 
                                            key={v.id} 
                                            onClick={() => {
                                                if (isEligible) {
                                                    setSelectedVoucher(v);
                                                } else {
                                                    showToast(`Minimum order for this voucher is ₦${v.minOrderAmount.toLocaleString()}`);
                                                }
                                            }}
                                            className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${isEligible ? 'bg-gray-50 border-gray-100 cursor-pointer hover:border-primary/30' : 'bg-gray-50/50 border-gray-100 opacity-50 grayscale cursor-not-allowed'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg ${v.color} flex items-center justify-center text-white text-[10px] font-black`}>%</div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-xs">{v.title}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Min: ₦{v.minOrderAmount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isEligible ? 'border-primary/20' : 'border-gray-200'}`}>
                                                {isEligible && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="bg-primary p-6 rounded-[32px] text-white shadow-xl shadow-primary/20">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs opacity-70">Total to Pay</span>
                            <span className="text-2xl font-black tracking-tight">₦ {totalToPay.toLocaleString()}</span>
                        </div>
                        {discount > 0 && (
                            <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">You saved ₦ {discount.toLocaleString()}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button 
                            onClick={() => {
                                if (walletBalance >= totalToPay) {
                                    setWalletBalance(prev => prev - totalToPay);
                                    showToast("Payment Successful!");
                                    setScreen(AppScreen.HOME);
                                    setBillDetails({ provider: '', customerId: '', amount: '' });
                                    setSelectedVoucher(null);
                                } else {
                                    showToast("Insufficient wallet balance");
                                }
                            }}
                        >
                            Pay Now
                        </Button>
                    </div>
                </div>
            </div>
          </div>
        );

      case AppScreen.SUGGESTION_BOX:
        return (
           <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
              <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Feedback" subtitle="Suggestion Box" />
                  <div className="p-8">
                    <h2 className="text-2xl font-black mb-4 text-gray-900">We're listening.</h2>
                    <p className="text-sm text-gray-500 mb-8">Have an idea? Found a bug? Let us know how we can improve Gogreen for you.</p>
                    <textarea className="w-full h-40 p-5 rounded-[32px] bg-black/[0.03] backdrop-blur-xl border border-black/[0.05] focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 text-sm font-medium resize-none mb-6 text-gray-900 placeholder:text-gray-400" placeholder="Type your suggestion here..."></textarea>
                    <Button onClick={() => { showToast("Feedback Sent!"); setScreen(AppScreen.HOME); }}>Submit Feedback</Button>
                  </div>
              </div>
           </div>
        );

      case AppScreen.REPORT_BUG:
        return (
           <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
              <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Support" subtitle="Report a Bug" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-6">
                    <div className="bg-red-50 p-4 rounded-[24px] border border-red-100 flex gap-4 items-start mb-6">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-xl shrink-0 p-2 text-red-500"><Icons.Bug /></div>
                        <div>
                          <h3 className="font-bold text-red-900 text-sm">Found an issue?</h3>
                          <p className="text-xs text-red-700/80 leading-relaxed mt-1">Please describe the bug in detail so our engineering team can fix it as soon as possible.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <Input 
                           label="Issue Subject"
                           value={bugReport.subject}
                           onChange={(e) => setBugReport({...bugReport, subject: e.target.value})}
                           placeholder="e.g. App crashes on login" 
                           variant="glass-light"
                        />

                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Description</label>
                          <textarea 
                            value={bugReport.description}
                            onChange={(e) => setBugReport({...bugReport, description: e.target.value})}
                            className="w-full h-40 p-5 rounded-[32px] bg-black/[0.03] backdrop-blur-xl border border-black/[0.05] focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 text-sm font-medium resize-none text-gray-900 placeholder:text-gray-400" 
                            placeholder="Describe what happened..."
                          ></textarea>
                        </div>

                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Screenshot (Optional)</label>
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
                              <div className={`w-full p-4 rounded-[20px] border border-dashed ${uploadedFile ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50'} flex items-center justify-center gap-3 transition-all`}>
                                 {uploadedFile ? (
                                    <>
                                       <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                                          <img src={uploadedFile} className="w-full h-full object-cover" alt="Preview" />
                                       </div>
                                       <span className="text-xs font-bold text-primary">Image Attached</span>
                                       <button onClick={(e) => { e.preventDefault(); setUploadedFile(null); }} className="z-20 p-1 bg-white rounded-full shadow-sm text-red-500"><Icons.Trash /></button>
                                    </>
                                 ) : (
                                    <>
                                       <div className="text-gray-400"><Icons.Image /></div>
                                       <span className="text-xs font-bold text-gray-400">Tap to upload screenshot</span>
                                    </>
                                 )}
                              </div>
                           </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button 
                          disabled={!bugReport.subject || !bugReport.description}
                          onClick={() => { 
                            showToast("Bug Report Submitted. Thank you!"); 
                            setBugReport({ subject: '', description: '' });
                            setScreen(AppScreen.ME); 
                          }}
                        >
                          Submit Report
                        </Button>
                    </div>
                  </div>
              </div>
           </div>
        );

      case AppScreen.ME:
        const meSections = [
          {
            title: 'Account',
            items: [
              { icon: <Icons.User />, label: 'Edit Profile', desc: 'Personal info, Username', screen: AppScreen.EDIT_PROFILE },
              { icon: <Icons.Bank />, label: 'Default Bank', desc: 'For automatic withdrawals', screen: AppScreen.BANK_DETAILS },
              { icon: <Icons.Coin />, label: 'Payment Settings', desc: 'Auto-withdrawal preference', screen: AppScreen.PAYMENT_SETTINGS },
              { icon: <Icons.Cog />, label: 'Account Settings', desc: 'KYC Level, Limits', screen: AppScreen.ACCOUNT_SETTINGS },
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
              { icon: <Icons.Headphones />, label: 'Contact Support', desc: '24/7 Live Chat', screen: AppScreen.SUPPORT },
              { icon: <Icons.Bug />, label: 'Report a Bug', desc: 'Fix issues', screen: AppScreen.REPORT_BUG },
              { icon: <Icons.Refresh />, label: 'App Update', desc: 'Version 1.0.4', screen: AppScreen.APP_UPDATE },
            ]
          },
          {
            title: 'Danger Zone',
            items: [
              { icon: <Icons.LogOut />, label: 'Log Out', desc: 'Sign out of device', screen: AppScreen.WELCOME_BACK, color: 'text-red-500' },
              { icon: <Icons.Trash />, label: 'Delete Account', desc: 'Permanent removal', screen: AppScreen.DELETE_ACCOUNT, color: 'text-red-500' }
            ]
          }
        ];

        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in overflow-y-auto no-scrollbar pb-24">
             <div className="bg-white border-b border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
               <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 border-2 border-white shadow-sm">
                           <img src={signupData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupData.username}`} className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <h2 className="text-xl font-black text-gray-900">{signupData.username}</h2>
                           <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border ${kycLevel >= 1 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${kycLevel >= 1 ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                              {kycLevel >= 3 ? 'Fully Verified' : kycLevel >= 1 ? `Tier ${kycLevel} Verified` : 'Unverified Account'}
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-3">
                        {/* Mobile Currency Switch */}
                        <div className="lg:hidden flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                           <button 
                             onClick={() => setCurrency('NGN')}
                             className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${currency === 'NGN' ? 'bg-white text-primary shadow-sm border border-gray-100' : 'text-gray-400'}`}
                           >
                             ₦
                           </button>
                           <button 
                             onClick={() => setCurrency('USD')}
                             className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${currency === 'USD' ? 'bg-white text-primary shadow-sm border border-gray-100' : 'text-gray-400'}`}
                           >
                             $
                           </button>
                        </div>

                        <div className="relative group flex items-center justify-center w-12 h-12">
                           <div className="absolute inset-[-50%] bg-primary/10 rounded-full blur-md animate-pulse"></div>
                           <div className="absolute inset-[-25%] border border-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                           <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 border border-gray-200 shadow-sm z-10">
                              <div className="w-6 h-6">
                                <Icons.Shield />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-primary p-6 rounded-[32px] text-white shadow-xl shadow-primary/20 relative overflow-hidden mb-2">
                     <div className="relative z-10">
                        <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Total Balance</p>
                        <h1 className="text-3xl font-black tracking-tight">
                          {currency === 'NGN' ? '₦' : '$'} {currency === 'NGN' ? (walletBalance + pendingBalance).toLocaleString() : ((walletBalance + pendingBalance) / 1710).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h1>
                     </div>
                     <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                     </div>
                  </div>
               </div>
             </div>

             <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
                {meSections.map((section, idx) => (
                   <div key={idx} className="bg-white rounded-[32px] p-2 border border-gray-100 shadow-sm overflow-hidden">
                      {section.items.map((item, i) => (
                         <div key={i} onClick={() => item.screen && setScreen(item.screen)} className={`p-4 flex items-center gap-4 cursor-pointer active:bg-gray-50 transition-colors rounded-2xl ${i !== section.items.length - 1 ? 'border-b border-gray-50' : ''}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.color ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-600'}`}>
                               {item.icon}
                            </div>
                            <div className="flex-1">
                               <h4 className={`font-bold text-sm ${item.color || 'text-gray-900'}`}>{item.label}</h4>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{item.desc}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </div>
                         </div>
                      ))}
                   </div>
                ))}
             </div>
          </div>
        );

      case AppScreen.NOTIFICATIONS:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
            <div className="w-full max-w-2xl flex flex-col h-full">
                <BackHeader title="Notifications" subtitle="Alerts" />
                <div className="p-6 space-y-4 overflow-y-auto no-scrollbar h-full">
                  {notifications.length > 0 ? (
                    <>
                      {notifications.map(note => (
                        <div key={note.id} className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex gap-4 items-start">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center p-2.5 ${note.type === 'security' ? 'bg-red-50 text-red-500' : note.type === 'reward' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                              {note.type === 'security' ? <Icons.Shield /> : note.type === 'reward' ? <Icons.Gift /> : <Icons.Wallet />}
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-bold text-gray-900 text-sm">{note.title}</h4>
                                <span className="text-[10px] text-gray-400 font-bold">{note.time}</span>
                              </div>
                              <p className="text-gray-500 text-xs mt-1 leading-relaxed">{note.desc}</p>
                          </div>
                        </div>
                      ))}
                      <Button variant="ghost" className="mt-4 text-xs !h-10" onClick={() => { setHasUnreadNotifications(false); showToast("All marked as read"); }}>Mark all as read</Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center h-full">
                       <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                       </div>
                       <h3 className="text-xl font-black text-gray-900 mb-2">All Caught Up</h3>
                       <p className="text-sm text-gray-400 max-w-[250px] font-medium">You have no new notifications at the moment.</p>
                    </div>
                  )}
                </div>
            </div>
          </div>
        );

      case AppScreen.ADD_MONEY:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Fund Wallet" subtitle="Add Money" />
                  <div className="p-6">
                      <div className="bg-primary p-6 rounded-[32px] text-white shadow-xl shadow-primary/20 relative overflow-hidden mb-6">
                        <div className="relative z-10 text-center">
                            <p className="text-[10px] uppercase tracking-widest opacity-70 mb-2">Virtual Account</p>
                            <p className="text-sm opacity-80 mb-6">Transfer to this account to fund your wallet instantly.</p>
                            
                            <div className="bg-white/10 rounded-2xl p-4 mb-3 border border-white/10 flex justify-between items-center cursor-pointer hover:bg-white/20 transition-colors" onClick={() => copyToClipboard("9028371920")}>
                              <div className="text-left">
                                  <p className="text-[10px] uppercase opacity-60">Account Number</p>
                                  <p className="text-xl font-mono font-black tracking-widest">9028371920</p>
                              </div>
                              <span className="text-xs font-bold bg-white text-primary px-2 py-1 rounded-lg">Copy</span>
                            </div>

                            <div className="flex gap-3">
                              <div className="flex-1 bg-white/10 rounded-2xl p-3 border border-white/10 text-left">
                                  <p className="text-[10px] uppercase opacity-60">Bank Name</p>
                                  <p className="font-bold">Wema Bank</p>
                              </div>
                              <div className="flex-1 bg-white/10 rounded-2xl p-3 border border-white/10 text-left">
                                  <p className="text-[10px] uppercase opacity-60">Account Name</p>
                                  <p className="font-bold">Gogreen-{String(signupData.username || '').replace('₦-','')}</p>
                              </div>
                            </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex gap-3 items-start mb-6">
                        <span className="w-5 h-5 text-yellow-600"><Icons.Zap /></span>
                        <p className="text-xs text-yellow-800 leading-relaxed font-medium">Transfers typically reflect within 1-5 minutes. Please wait up to 10 minutes for the account to circulate to other banks.</p>
                      </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.SECURITY:
        return (
           <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
              <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Security" subtitle="Protect Account" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-6 space-y-4">
                     <div className="bg-white p-4 rounded-[24px] border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all" onClick={() => setScreen(AppScreen.CHANGE_PIN)}>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><Icons.Lock /></div>
                           <div>
                              <h4 className="font-bold text-gray-900 text-sm">Transaction PIN</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Change 4-digit PIN</p>
                           </div>
                        </div>
                        <div className="w-4 h-4 text-gray-300"><Icons.ArrowRight /></div>
                     </div>
                     
                     <div className="bg-white p-4 rounded-[24px] border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500"><Icons.Shield /></div>
                           <div>
                              <h4 className="font-bold text-gray-900 text-sm">Biometric Login</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">FaceID / TouchID</p>
                           </div>
                        </div>
                        <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                            <input 
                              type="checkbox" 
                              name="toggle" 
                              id="biometric-toggle" 
                              checked={biometricEnabled}
                              onChange={() => setBiometricEnabled(!biometricEnabled)}
                              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white shadow-sm appearance-none cursor-pointer top-0.5 left-0.5 checked:translate-x-4 transition-transform duration-200 ease-in-out" 
                            />
                            <label htmlFor="biometric-toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${biometricEnabled ? 'bg-primary' : 'bg-gray-200'}`}></label>
                        </div>
                     </div>

                     <div className="bg-white p-4 rounded-[24px] border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all" onClick={() => showToast("Password Change Link Sent to Email")}>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500"><Icons.Lock /></div>
                           <div>
                              <h4 className="font-bold text-gray-900 text-sm">Change Password</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Update login details</p>
                           </div>
                        </div>
                        <div className="w-4 h-4 text-gray-300"><Icons.ArrowRight /></div>
                     </div>
                  </div>
              </div>
           </div>
        );

      case AppScreen.CHANGE_PIN:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Change PIN" subtitle="Security" onBack={() => setScreen(AppScreen.SECURITY)} />
                  <div className="p-8 flex flex-col items-center">
                     <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                        <Icons.Lock />
                     </div>
                     <h2 className="text-2xl font-black text-gray-900 mb-2">New PIN</h2>
                     <p className="text-gray-500 text-sm mb-8 text-center">Enter a new 4-digit PIN for your transactions.</p>
                     
                     <div className="flex gap-4 justify-center mb-8 w-full max-w-[240px]">
                        {[0, 1, 2, 3].map(i => (
                           <div key={i} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all ${tempPin.length > i ? 'border-primary bg-primary text-white' : 'border-gray-200 bg-white text-gray-900'}`}>
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
                                          showToast("PIN Changed Successfully!");
                                          setScreen(AppScreen.SECURITY);
                                       }, 500);
                                    }
                                 }
                              }}
                              className={`h-16 rounded-2xl flex items-center justify-center text-xl font-bold active:scale-90 transition-transform ${num === '' ? 'invisible' : num === 'del' ? 'bg-red-50 text-red-500' : 'bg-white shadow-sm border border-gray-100 text-gray-900'}`}
                           >
                              {num === 'del' ? <Icons.Trash /> : num}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.BANK_DETAILS:
        return (
           <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
              <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Bank Details" subtitle="Withdrawals" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-6 space-y-4">
                     {/* Existing Bank Card */}
                     <div className="bg-white p-6 rounded-[24px] border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-10 translate-x-10"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                           <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl font-bold text-gray-700">GT</div>
                           <button className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full" onClick={() => showToast("Default bank cannot be removed")}>Default</button>
                        </div>
                        <div className="relative z-10">
                           <p className="text-gray-900 font-bold text-lg tracking-tight">Guaranty Trust Bank</p>
                           <p className="text-gray-500 font-mono text-sm mt-1">0123456789</p>
                           <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-4">{signupData.fullName || 'Hassan Kehinde'}</p>
                        </div>
                     </div>

                     <button onClick={() => setScreen(AppScreen.ADD_BANK)} className="w-full p-4 rounded-[24px] border-2 border-dashed border-gray-200 flex items-center justify-center gap-2 text-gray-400 font-bold text-sm hover:border-primary hover:text-primary transition-colors active:scale-[0.98]">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-lg leading-none pb-0.5">+</div>
                        Add New Bank Account
                     </button>
                  </div>
              </div>
           </div>
        );

      case AppScreen.ADD_BANK:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Add Bank" subtitle="Link Account" onBack={() => setScreen(AppScreen.BANK_DETAILS)} />
                  <div className="p-6 flex-1 flex flex-col">
                     <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Select Bank</label>
                           <select className="w-full p-4 rounded-[20px] bg-white border border-gray-200 focus:outline-none focus:border-primary text-sm font-bold text-gray-900 appearance-none">
                              <option>Select a bank...</option>
                              <option>Access Bank</option>
                              <option>Guaranty Trust Bank</option>
                              <option>United Bank for Africa</option>
                              <option>Zenith Bank</option>
                              <option>Kuda Bank</option>
                              <option>Opay</option>
                              <option>PalmPay</option>
                           </select>
                        </div>

                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
                           <input 
                              type="tel" 
                              placeholder="0123456789" 
                              className="w-full p-4 rounded-[20px] bg-white border border-gray-200 focus:outline-none focus:border-primary text-sm font-mono font-bold" 
                              maxLength={10}
                              onInput={(e) => {
                                 const target = e.target as HTMLInputElement;
                                 target.value = target.value.replace(/[^0-9]/g, '');
                              }}
                           />
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-[20px] border border-yellow-100 flex gap-3 items-start">
                           <span className="text-yellow-600 mt-0.5"><Icons.Alert /></span>
                           <p className="text-xs text-yellow-800 leading-relaxed font-medium">Please ensure the bank account name matches your verified identity name <span className="font-bold">({signupData.fullName || 'Hassan Kehinde'})</span>. Third-party accounts are not allowed.</p>
                        </div>
                     </div>

                     <div className="mt-auto">
                        <Button onClick={() => { showToast("Bank Account Verified & Added!"); setScreen(AppScreen.BANK_DETAILS); }}>Verify & Save</Button>
                     </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.ACCOUNT_SETTINGS:
        return (
           <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
              <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Settings" subtitle="Preferences" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-6 space-y-6">
                     <div className="bg-white p-6 rounded-[24px] border border-gray-100">
                        <h3 className="font-black text-gray-900 text-sm mb-4 uppercase tracking-wide">Account Limits</h3>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-500">Daily Withdrawal</span>
                              <span className="text-xs font-black text-gray-900">₦ {kycLevel >= 2 ? '5,000,000' : kycLevel >= 1 ? '500,000' : '50,000'}</span>
                           </div>
                           <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-primary h-full w-1/4 rounded-full"></div>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-500">Daily Crypto Sell</span>
                              <span className="text-xs font-black text-gray-900">Unlimited</span>
                           </div>
                        </div>
                        <Button variant="outline" className="w-full mt-6 !py-3" onClick={() => setScreen(AppScreen.KYC_INTRO)}>Increase Limits</Button>
                     </div>

                     <div className="bg-white p-6 rounded-[24px] border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="font-bold text-gray-900 text-sm">Push Notifications</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Alerts & Updates</p>
                           </div>
                           <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                               <input 
                                 type="checkbox" 
                                 name="toggle" 
                                 id="notif-toggle" 
                                 checked={pushNotificationsEnabled}
                                 onChange={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
                                 className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white shadow-sm appearance-none cursor-pointer top-0.5 left-0.5 checked:translate-x-4 transition-transform duration-200 ease-in-out" 
                               />
                               <label htmlFor="notif-toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${pushNotificationsEnabled ? 'bg-primary' : 'bg-gray-200'}`}></label>
                           </div>
                        </div>
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowQuickAccessModal(true)}>
                           <div>
                              <h4 className="font-bold text-gray-900 text-sm">Quick Access</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Customize home services</p>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                           </div>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                           <div>
                              <h4 className="font-bold text-gray-900 text-sm">Currency</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Default Fiat</p>
                           </div>
                           <span className="text-xs font-black text-gray-900">NGN (₦)</span>
                        </div>
                        <div className="flex items-center justify-between opacity-50">
                           <div>
                              <h4 className="font-bold text-gray-900 text-sm">Language</h4>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">App Language</p>
                           </div>
                           <span className="text-xs font-black text-gray-900">English (UK)</span>
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
                  <div className="p-6 flex-1 flex flex-col">
                     <div className="flex justify-center mb-8 relative">
                        <div className="w-24 h-24 rounded-[32px] overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative">
                           <img src={signupData.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${signupData.username}`} className="w-full h-full object-cover" />
                           <input 
                              type="file" 
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer z-20"
                              onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                       setSignupData(prev => ({ ...prev, profileImage: reader.result as string }));
                                    };
                                    reader.readAsDataURL(file);
                                 }
                              }}
                           />
                        </div>
                        <button className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm pointer-events-none">
                           <div className="w-3 h-3"><Icons.Cog /></div>
                        </button>
                     </div>

                     <div className="space-y-4">
                        <Input 
                           label="Full Name"
                           value={signupData.fullName}
                           variant="glass-light"
                           className="opacity-60"
                           disabled
                        />
                        <p className="text-[9px] text-gray-400 font-bold ml-1 -mt-2">Name cannot be changed after verification.</p>

                        <Input 
                           label="Username"
                           value={signupData.username}
                           variant="glass-light"
                           onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                        />

                        <Input 
                           label="Email Address"
                           value={signupData.email}
                           variant="glass-light"
                           onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        />

                        <Input 
                           label="Phone Number"
                           placeholder="+234 800 000 0000"
                           value={signupData.phone || ''}
                           variant="glass-light"
                           onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                        />
                     </div>

                     <div className="mt-auto pt-8">
                        <Button onClick={() => { showToast("Profile Updated!"); setScreen(AppScreen.ME); }}>Save Changes</Button>
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
                  <div className="p-6 flex-1 flex flex-col">
                      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mb-6">
                          <div className="flex items-center justify-between mb-4">
                              <div>
                                  <h3 className="font-black text-gray-900">Auto-Withdrawal</h3>
                                  <p className="text-xs text-gray-400">Directly to bank account</p>
                              </div>
                              <button 
                                id="tutorial-auto-withdrawal"
                                onClick={() => setSignupData(prev => ({ ...prev, autoWithdrawToBank: !prev.autoWithdrawToBank }))}
                                className={`w-12 h-6 rounded-full transition-all relative ${signupData.autoWithdrawToBank ? 'bg-primary' : 'bg-gray-200'}`}
                              >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${signupData.autoWithdrawToBank ? 'left-7' : 'left-1'}`} />
                              </button>
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed">
                              When enabled, all crypto deposits will be automatically converted to Naira and sent to your default bank account. When disabled, funds are stored in your Gogreen balance.
                          </p>
                      </div>

                      <div className="mt-auto">
                          <Button onClick={() => { showToast("Settings Saved!"); setScreen(AppScreen.ME); }}>Save Settings</Button>
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
                  <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                     <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mb-6 shadow-sm border border-primary/20">
                        <Logo className="w-16 h-16" variant="color" />
                     </div>
                     <h2 className="text-2xl font-black text-gray-900 mb-1">Gogreen Crypto</h2>
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Version 1.0.4 (Build 202)</p>
                     
                     <div className="bg-white p-6 rounded-[24px] border border-gray-100 w-full mb-8 text-left">
                        <h3 className="font-bold text-gray-900 text-sm mb-4">What's New</h3>
                        <ul className="space-y-3">
                           <li className="flex gap-3 text-xs text-gray-600 font-medium">
                              <span className="text-primary">•</span>
                              <span>Added support for USDT TRC20 withdrawals</span>
                           </li>
                           <li className="flex gap-3 text-xs text-gray-600 font-medium">
                              <span className="text-primary">•</span>
                              <span>Improved biometric login speed</span>
                           </li>
                           <li className="flex gap-3 text-xs text-gray-600 font-medium">
                              <span className="text-primary">•</span>
                              <span>Fixed bug in transaction history filter</span>
                           </li>
                        </ul>
                     </div>

                     <Button onClick={() => showToast("You are on the latest version")}>Check for Updates</Button>
                  </div>
               </div>
            </div>
         );

      case AppScreen.DELETE_ACCOUNT:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Delete Account" subtitle="Danger Zone" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-6 flex-1 flex flex-col">
                     <div className="bg-red-50 p-6 rounded-[32px] border border-red-100 mb-8 text-center">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                           <Icons.Alert />
                        </div>
                        <h3 className="text-xl font-black text-red-900 mb-2">Are you sure?</h3>
                        <p className="text-sm text-red-800/80 leading-relaxed">
                           This action is permanent and cannot be undone. All your data, transaction history, and remaining wallet balance will be permanently deleted.
                        </p>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Type "DELETE" to confirm</label>
                        <input 
                           type="text" 
                           placeholder="DELETE"
                           className="w-full p-4 rounded-[20px] bg-white border border-gray-200 focus:outline-none focus:border-red-500 text-sm font-black text-red-500 placeholder:text-gray-300"
                           onChange={(e) => {
                              if (e.target.value === 'DELETE') {
                                 showToast("Account Scheduled for Deletion");
                                 setTimeout(() => setScreen(AppScreen.SPLASH), 1500);
                              }
                           }}
                        />
                     </div>

                     <div className="mt-auto">
                                             <div className="mt-auto flex flex-col gap-2">
                        <Button variant="danger" onClick={() => { showToast("Account Scheduled for Deletion"); setTimeout(() => setScreen(AppScreen.SPLASH), 1500); }}>Yes, delete my account</Button>
                        <Button variant="ghost" className="!text-gray-500" onClick={() => setScreen(AppScreen.ME)}>Cancel, keep my account</Button>
                     </div>
                     </div>
                  </div>
               </div>
            </div>
         );

      case AppScreen.SUPPORT:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Live Chat" subtitle="Support" onBack={() => setScreen(AppScreen.ME)} />
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                     <div className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 my-4 opacity-60">Today</div>
                     
                     {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                           <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                              <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                              <p className={`text-[9px] mt-1.5 text-right font-bold ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</p>
                           </div>
                        </div>
                     ))}
                     <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 bg-white border-t border-gray-100 pb-8">
                     <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                        <input 
                          type="text" 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 bg-transparent px-4 py-2 text-sm font-medium outline-none text-gray-900 placeholder:text-gray-400"
                        />
                        <button 
                          onClick={handleSendMessage}
                          disabled={!chatInput.trim()}
                          className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-90 shadow-lg shadow-primary/20"
                        >
                           <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                     </div>
                  </div>

               </div>
            </div>
         );

      case AppScreen.REFER_FRIEND:
         return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Refer & Earn" subtitle="Rewards" onBack={() => setScreen(AppScreen.ME)} />
                  <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                     <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                        <Icons.Gift className="w-12 h-12" />
                     </div>
                     <h3 className="text-2xl font-black text-gray-900 mb-2">Invite Friends, Earn Rewards!</h3>
                     <p className="text-sm text-gray-500 max-w-[280px] leading-relaxed mb-8">Share your unique referral code and earn ₦1,000 for every friend who signs up and trades.</p>
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 w-full max-w-sm flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => copyToClipboard('HASSAN23', 'Referral code copied!')}>
                         <div className="flex-1 font-mono font-bold text-gray-900 tracking-widest text-center text-lg">HASSAN23</div>
                         <div className="text-[10px] font-black uppercase text-primary bg-white px-3 py-1.5 rounded-xl shadow-sm">Copy</div>
                     </div>
                      <Button variant="outline" className="mt-8 w-full max-w-sm" onClick={() => showToast("Sharing options coming soon!")}>Share Now</Button>
                  </div>
               </div>
            </div>
         );

      case AppScreen.WITHDRAW_MONEY:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center">
            <div className="w-full max-w-4xl flex flex-col h-full">
                <BackHeader title="Withdraw Funds" subtitle="Naira Wallet" />
                <div className="p-6 flex-1 flex flex-col">
                    <div className="glass-card p-8 rounded-[40px] mb-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Available Balance</p>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">₦ {walletBalance.toLocaleString()}</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Amount to Withdraw</label>
                            <Input 
                                type="number" 
                                placeholder="0.00"
                                prefix="₦"
                                variant="glass-light"
                                value={sellAmount}
                                onChange={(e) => setSellAmount(e.target.value)}
                                className="h-20"
                            />
                        </div>

                        <div className="glass-card p-6 rounded-[32px] flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                <Icons.Bank />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-gray-900">Kuda Bank</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">201****890 • Hassan Kehinde</p>
                            </div>
                            <Button variant="ghost" className="!w-auto !h-auto !p-0 !text-primary">Change</Button>
                        </div>

                        <div className="pt-4">
                            <Button 
                                disabled={!sellAmount || parseFloat(sellAmount) > walletBalance || parseFloat(sellAmount) < 1000}
                                onClick={() => {
                                    setWalletBalance(prev => prev - parseFloat(sellAmount));
                                    showToast(`₦${parseFloat(sellAmount).toLocaleString()} Withdrawal Successful!`);
                                    setScreen(AppScreen.HOME);
                                    setSellAmount('');
                                }}
                            >
                                {parseFloat(sellAmount) > walletBalance ? 'Insufficient Balance' : parseFloat(sellAmount) < 1000 ? 'Min Withdrawal: ₦1,000' : 'Withdraw Now'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );

      case AppScreen.REFERRAL_WITHDRAW_CONFIRM:
        return (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in items-center">
            <div className="bg-white rounded-t-[32px] p-6 pb-12 animate-slide-up w-full max-w-md">
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8"></div>
              <h3 className="text-xl font-black text-gray-900 mb-6 text-center">Confirm Withdrawal</h3>
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-500">You are about to withdraw:</p>
                <h2 className="text-4xl font-black text-primary">₦ {referralBalance.toLocaleString()}</h2>
                <p className="text-xs text-gray-400 max-w-[250px] mx-auto">These funds will be transferred to your Naira Wallet immediately.</p>
              </div>
              <div className="mt-8 flex gap-4">
                <Button variant="secondary" className="flex-1 !bg-gray-50 !text-gray-900 !border-gray-200" onClick={() => setScreen(AppScreen.REWARDS)}>Cancel</Button>
                <Button className="flex-1" onClick={() => {
                    if (referralBalance >= 3000) {
                        setWalletBalance(prev => prev + referralBalance);
                        setReferralBalance(0);
                        showToast("Referral Earnings Withdrawn to Wallet!");
                        setScreen(AppScreen.REWARDS);
                    } else {
                        showToast("Minimum withdrawal is ₦3,000");
                        setScreen(AppScreen.REWARDS);
                    }
                }}>Confirm Withdraw</Button>
              </div>
            </div>
          </div>
        );

      default:
        // KYC screens are handled in switch, this catches unmapped features
        if (screen.startsWith('KYC')) {
           const kycSteps = [
             { id: 1, title: 'Tier 1', desc: 'Phone, Bank & PIN', status: kycLevel >= 1 ? 'Completed' : 'Pending' },
             { id: 2, title: 'Tier 2', desc: 'Govt ID & Face Capture', status: kycLevel >= 2 ? 'Completed' : kycLevel === 1 ? 'Next' : 'Locked' },
             { id: 3, title: 'Tier 3', desc: 'Utility Bill', status: kycLevel >= 3 ? 'Completed' : kycLevel === 2 ? 'Next' : 'Locked' }
           ];

           return (
            <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center">
               <div className="w-full max-w-2xl flex flex-col h-full">
                  <BackHeader title="Verification" subtitle="KYC Status" onBack={() => setScreen(AppScreen.HOME)} />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-6 p-6 text-primary">
                          <Icons.Shield />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Account Verification</h2>
                        <p className="text-gray-500 text-sm px-4 mb-8">Complete verification tiers to unlock higher limits and features.</p>
                        
                        <div className="w-full space-y-4 text-left">
                          {kycSteps.map((step) => (
                              <div key={step.id} className={`flex items-center justify-between p-4 bg-white rounded-2xl border ${step.status === 'Completed' ? 'border-green-200 bg-green-50' : step.status === 'Next' ? 'border-primary shadow-md' : 'border-gray-100 opacity-60'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step.status === 'Completed' ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                      {step.status === 'Completed' ? '✓' : step.id}
                                    </div>
                                    <div>
                                      <span className="font-bold text-gray-900 text-sm block">{step.title}</span>
                                      <span className="text-[10px] text-gray-500 font-medium">{step.desc}</span>
                                    </div>
                                </div>
                                {step.status === 'Next' && <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded">Start</span>}
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
                    }}>
                        {kycLevel >= 3 ? 'Fully Verified' : `Verify Tier ${kycLevel + 1}`}
                    </Button>
                  </div>
               </div>
            </div>
           );
        }
        return <div className="p-20 text-center font-black opacity-20 uppercase tracking-widest">Gogreen Hub</div>;
    }
  };

  return (
    <>
      
      
      <div className="min-h-screen bg-ghost flex font-sans">
      {/* Sidebar / Navbar - Conditional Rendering */}
      {showNavbar && <Navbar currentScreen={screen} onNavigate={(s) => {
        if (s === AppScreen.TRANSACTION_HISTORY) navigateToHistory();
        else handleProtectedNavigation(s);
      }} />}

      {/* Main Content Area */}
      <main className={`flex-1 min-h-screen relative flex flex-col ${showNavbar ? 'pb-24 md:pb-0 md:pl-64' : ''}`}>
        


        {/* Quick Access Customization Modal */}
        {showQuickAccessModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-slide-up">
                  <div className="p-8">
                      <div className="flex justify-between items-center mb-8">
                          <div>
                              <h3 className="text-xl font-black text-gray-900 tracking-tight">Quick Access</h3>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Select up to 4 services</p>
                          </div>
                          <button onClick={() => setShowQuickAccessModal(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                          {allServices.map(service => {
                              const isActive = quickAccessIds.includes(service.id);
                              return (
                                  <div 
                                      key={service.id} 
                                      onClick={() => toggleQuickAccess(service.id)}
                                      className={`p-4 rounded-[28px] border-2 transition-all cursor-pointer flex items-center gap-3 ${isActive ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                  >
                                      <div className={`w-10 h-10 ${service.color} rounded-xl flex items-center justify-center p-2.5`}>
                                          {service.icon}
                                      </div>
                                      <div className="flex-1">
                                          <p className="text-xs font-black text-gray-900">{service.label}</p>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{isActive ? 'Active' : 'Add'}</p>
                                      </div>
                                      {isActive && (
                                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                          </div>
                                      )}
                                  </div>
                              );
                          })}
                      </div>

                      <Button onClick={() => setShowQuickAccessModal(false)}>Save Changes</Button>
                  </div>
              </div>
          </div>
        )}

        {/* Global KYC Modal */}
        {showKycModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
             <div className="bg-white rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl animate-epic-bounce relative overflow-hidden">
                <div className="w-20 h-20 bg-green-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white">
                   <Icons.Shield />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Verification Required</h3>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium px-2">
                   To perform this action and comply with financial regulations, you must complete your identity verification.
                </p>
                <div className="flex flex-col gap-3">
                   <Button onClick={() => { setShowKycModal(false); setScreen(AppScreen.KYC_INTRO); }}>VERIFY IDENTITY</Button>
                   <Button variant="ghost" className="!h-12 text-xs !font-black tracking-[0.2em] text-primary" onClick={() => setShowKycModal(false)}>MAYBE LATER</Button>
                </div>
             </div>
          </div>
        )}

        {/* Transaction PIN Modal */}
        {showPinModal && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
             <div className="bg-white rounded-[32px] p-8 w-full max-w-sm text-center shadow-2xl animate-slide-up relative overflow-hidden">
                <button onClick={() => { setShowPinModal(false); setPinInput(''); }} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                   <Icons.Lock />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Enter PIN</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Authorize Transaction</p>
                
                <div className="flex gap-3 justify-center mb-8">
                   {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-xl font-black transition-all ${pinInput.length > i ? 'border-primary bg-primary text-white' : 'border-gray-100 bg-gray-50 text-gray-900'}`}>
                         {pinInput.length > i ? '•' : ''}
                      </div>
                   ))}
                </div>
                                <div className="grid grid-cols-3 gap-3">
                   {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, idx) => (
                      <button 
                         key={idx}
                         onClick={() => handleTransactionPinPress(num)}
                         className={`h-14 rounded-xl flex items-center justify-center text-lg font-bold active:scale-90 transition-transform ${num === '' ? 'invisible' : num === 'del' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                      >
                         {num === 'del' ? <Icons.Trash /> : num}
                      </button>
                   ))}
                </div>
             </div>
          </div>
        )}

      {showTutorial && (
        <TutorialOverlay 
          step={tutorialStep} 
          onNext={() => {
            if (tutorialStep === 2) {
              setScreen(AppScreen.PAYMENT_SETTINGS);
              setTutorialStep(3);
            } else if (tutorialStep < 3) {
              setTutorialStep(tutorialStep + 1);
            } else {
              setShowTutorial(false);
              setScreen(AppScreen.HOME);
            }
          }}
          onSkip={() => {
            setShowTutorial(false);
            setScreen(AppScreen.HOME);
          }}
        />
      )}
      {renderScreen()}
      </main>

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