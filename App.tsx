import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSwipeable } from "react-swipeable";
import { Toaster, toast as hotToast } from "react-hot-toast";

import { AuthLayout } from "./src/components/AuthLayout";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { FloatingNavBar } from "./src/components/FloatingNavBar";
import { AppScreen, Transaction, Coin } from "./types";
import { useResetFlow } from "./src/hooks/useResetFlow";
import { Logo, FullLogo, LogoText } from "./components/Logo";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { SkeletonScreen, Skeleton } from "./components/Skeleton";
import { Navbar } from "./components/Navbar";
import { getAvatarUrl } from "./src/constants/avatars";
import { SwipeButton } from "./components/SwipeButton";
import { SlideCaptcha } from "./components/Captcha";
import { Icons } from "./components/Icons";
import { BrandPattern } from "./src/components/BrandPattern";
import { LoadingScreen } from "./components/LoadingScreen";
import { BottomSheet } from "./components/BottomSheet";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ServicesScreen } from "./src/screens/ServicesScreen";
import { VirtualCardScreen } from "./src/screens/VirtualCardScreen";
import { MeScreen } from "./src/screens/MeScreen";
import { ReferralScreen } from "./src/screens/ReferralScreen";
import { SendScreen } from "./src/screens/SendScreen";
import { WithdrawScreen } from "./src/screens/WithdrawScreen";
import { WithdrawMethodScreen } from "./src/screens/WithdrawMethodScreen";
import { SendToGreentagScreen } from "./src/screens/SendToGreentagScreen";
import { SecurityScreen } from "./src/screens/SecurityScreen";
import { RewardsScreen } from "./src/screens/RewardsScreen";
import { SupportScreen } from "./src/components/SupportScreen";
import { UnderReviewScreen } from "./src/screens/UnderReviewScreen";
import { GiftCardScreen } from "./src/screens/GiftCardScreen";
import { BackHeader } from "./src/components/BackHeader";
import { EmptyState } from "./src/components/EmptyState";
import { EmailSuggestions } from "./src/components/EmailSuggestions";
import { PrivacyText } from "./components/PrivacyText";
import { useAppContext } from "./AppContext";
import { SecurityService } from "./src/services/SecurityService";
import QRCode from "react-qr-code";
import { Scanner } from "@yudiel/react-qr-scanner";
import * as Constants from "./constants";

const MODAL_SCREENS = [
  AppScreen.NOTIFICATIONS,
  AppScreen.PAYMENT_SETTINGS,
  AppScreen.BILL_PAYMENT_DETAILS,
  AppScreen.BILL_PAYMENT_SUMMARY,
  AppScreen.AIRTIME,
  AppScreen.SUGGESTION_BOX,
  AppScreen.REPORT_BUG,
  AppScreen.CHANGE_PASSWORD,
  AppScreen.EDIT_PROFILE,
  AppScreen.APP_UPDATE,
  AppScreen.DELETE_ACCOUNT,
  AppScreen.SECURITY,
  AppScreen.ADD_BANK,
  AppScreen.ACCOUNT_SETTINGS,
  AppScreen.GIFT_CARD_LIST,
  AppScreen.GIFT_CARD_COUNTRY,
  AppScreen.GIFT_CARD_QUANTITY,
  AppScreen.GIFT_CARD_DETAILS,
  AppScreen.GIFT_CARD_CONFIRMATION,
  AppScreen.GIFT_CARD_TRADE_OPTIONS,
  AppScreen.GIFT_CARD_TYPE_SELECTION,
  AppScreen.GIFT_CARD_TRADE_CHAT,
  AppScreen.REFERRAL,
];

const FULL_HEIGHT_MODALS = [
  AppScreen.BILL_PAYMENT_DETAILS,
  AppScreen.BILL_PAYMENT_SUMMARY,
  AppScreen.GIFT_CARD_LIST,
  AppScreen.GIFT_CARD_DETAILS,
  AppScreen.GIFT_CARD_CONFIRMATION,
  AppScreen.GIFT_CARD_TRADE_CHAT,
  AppScreen.NOTIFICATIONS,
  AppScreen.REFERRAL,
];

interface SwipedItem {
  id: number;
  direction: "left" | "right";
}

interface TransactionItemProps {
  tx: Transaction;
  swipedItem: SwipedItem | null;
  onSwipe: (id: number, dir: "left" | "right" | null) => void;
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
  hideBalance,
}) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipe(tx.id, "left"),
    onSwipedRight: () => onSwipe(tx.id, "right"),
    onTap: onTap,
    preventScrollOnSwipe: false,
    trackMouse: true,
  });

  const isSwiped = swipedItem?.id === tx.id;
  const direction = isSwiped ? swipedItem?.direction : null;
  const isFailed = tx.status === "Failed" || tx.status === "Cancelled";

  return (
    <div className="relative overflow-hidden rounded-[16px]">
      {/* Repeat Button (Revealed on Swipe Right) */}
      <div
        className="absolute inset-y-0 left-0 flex items-center bg-primary rounded-l-[16px] transition-transform duration-300 ease-out z-0"
        style={{
          transform:
            direction === "right" ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRepeat();
          }}
          className="h-full px-6 text-white text-[10px] font-black uppercase bg-primary hover:bg-green-600 transition-colors rounded-l-[16px]"
        >
          Repeat
        </button>
      </div>

      {/* Details Button (Revealed on Swipe Left) */}
      <div
        className="absolute inset-y-0 right-0 flex items-center bg-white border-l border-gray-100 rounded-r-[16px] transition-transform duration-300 ease-out z-0"
        style={{
          transform:
            direction === "left" ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDetails();
          }}
          className="h-full px-6 text-gray-900 text-[10px] font-black uppercase bg-white hover:bg-gray-50 transition-colors rounded-r-[16px]"
        >
          Details
        </button>
      </div>

      {/* Main Content */}
      <div
        {...handlers}
        className={`p-2.5 bg-white rounded-xl flex items-center gap-3 border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-all hover:shadow-md relative z-10 transform transition-transform duration-300 ease-out ${
          direction === "left"
            ? "translate-x-[-70px]"
            : direction === "right"
              ? "translate-x-[70px]"
              : "translate-x-0"
        } ${isFailed ? "opacity-70" : ""}`}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shadow-sm transition-transform relative shrink-0"
          style={{ backgroundColor: isFailed ? "#9CA3AF" : tx.color }}
        >
          <div className="w-3 h-3">{tx.icon}</div>
          {(tx.status === "Pending" || tx.status === "Processing") && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center border border-gray-50 shadow-sm z-10">
              <Icons.Loader className="w-2 h-2 text-orange-500 animate-spin" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <p
              className={`font-bold text-[13px] tracking-tight truncate ${isFailed ? "text-gray-400 line-through" : "text-gray-900"}`}
            >
              {tx.type}
            </p>
            <p
              className={`font-bold text-[13px] tabular-nums ${isFailed ? "text-gray-400 line-through" : tx.type === "Receive" ? "text-green-600" : "text-gray-900"}`}
            >
              {tx.type === "Receive" ? "+" : ""}
              <PrivacyText hide={hideBalance}>{tx.fiatAmount}</PrivacyText>
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-gray-400 font-medium">{tx.date}</p>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                tx.status === "Success"
                  ? "bg-green-50 text-green-600"
                  : tx.status === "Pending" || tx.status === "Processing"
                    ? "bg-yellow-50 text-yellow-600"
                    : isFailed
                      ? "bg-gray-100 text-gray-500"
                      : "bg-red-50 text-red-600"
              }`}
            >
              {tx.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const App = () => {
  const {
    screen,
    setScreen,
    previousScreen,
    setPreviousScreen,
    navigate,
    scannerTab,
    setScannerTab,
    pendingRoute,
    setPendingRoute,
    showPinModal,
    setShowPinModal,
    pinMode,
    setPinMode,
    onPinSuccess,
    setOnPinSuccess,
    onPinCancel,
    setOnPinCancel,
    globalOverlay,
    setGlobalOverlay,
    walletBalance,
    setWalletBalance,
    pendingBalance,
    setPendingBalance,
    signupData,
    setSignupData,
    signupStep,
    setSignupStep,
    loginData,
    setLoginData,
    isCaptchaVerified,
    setIsCaptchaVerified,
    isLoading,
    setIsLoading,
    isPinSetupRequired,
    setIsPinSetupRequired,
    isTxLoading,
    setIsTxLoading,
    hideBalance,
    setHideBalance,
    bonusClaimed,
    setBonusClaimed,
    pinError,
    setPinError,
    transactionPin,
    setTransactionPin,
    selectedTx,
    setSelectedTx,
    selectedChatId,
    setSelectedChatId,
    hasUnreadNotifications,
    setHasUnreadNotifications,
    pushNotificationsEnabled,
    setPushNotificationsEnabled,
    quickAccessIds,
    setQuickAccessIds,
    currency,
    setCurrency,
    showQuickAccessDropdown,
    setShowQuickAccessDropdown,
    activeTab,
    setActiveTab,
    activeModal,
    setActiveModal,
    favoriteCoinIds,
    toggleFavoriteCoin,
    completeChecklistTask,
    areCryptoWalletsGenerated,
    setAreCryptoWalletsGenerated,
    underReviewData,
    setUnderReviewData,
    isSupportOpen,
    setIsSupportOpen,
    supportInitialView,
    setSupportInitialView,
    giftCardTradeType,
    setGiftCardTradeType,
    selectedGiftCard,
    setSelectedGiftCard,
    selectedGiftCardCountry,
    setSelectedGiftCardCountry,
    giftCardAmount,
    setGiftCardAmount,
    giftCardCodeType,
    setGiftCardCodeType,
    sendAsset,
    setSendAsset,
    sendRecipient,
    setSendRecipient,
    sendRecipientType,
    setSendRecipientType,
    sendAmount,
    setSendAmount,
    swapFromAsset,
    setSwapFromAsset,
    swapToAsset,
    setSwapToAsset,
    swapAmount,
    setSwapAmount,
    withdrawAmount,
    setWithdrawAmount,
    selectedBillCategory,
    setSelectedBillCategory,
    billDetails,
    setBillDetails,
    selectedVoucher,
    setSelectedVoucher,
    selectedCoin,
    setSelectedCoin,
    sellAmount,
    setSellAmount,
    kycData,
    setKycData,
    isUsernameTaken,
    setIsUsernameTaken,
    isCheckingUsername,
    setIsCheckingUsername,
    triggerReview,
    addNotification,
    notifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    goBack,
  } = useAppContext();
  const resetFlow = useResetFlow();

  // User State
  const [tradeVolume, setTradeVolume] = useState<number>(0);
  const [tempPin, setTempPin] = useState<string>("");
  const [welcomePin, setWelcomePin] = useState<string>("");
  const [points, setPoints] = useState<number>(1250);

  // Username Availability Check
  useEffect(() => {
    const checkUsername = async () => {
      if (signupData.username && signupData.username.length > 3) {
        setIsCheckingUsername(true);
        const rawUsername = signupData.username.replace(/^₦/, "").toLowerCase();

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (Constants.TAKEN_USERNAMES.includes(rawUsername)) {
          setIsUsernameTaken(true);
        } else {
          setIsUsernameTaken(false);
        }
        setIsCheckingUsername(false);
      } else {
        setIsUsernameTaken(false);
        setIsCheckingUsername(false);
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [signupData.username, setIsUsernameTaken, setIsCheckingUsername]);

  useEffect(() => {
    if (isPinSetupRequired && screen === AppScreen.HOME) {
      setPinMode("setup");
      setShowPinModal(true);
    }
  }, [isPinSetupRequired, screen, setPinMode, setShowPinModal]);

  useEffect(() => {
    if (
      [
        AppScreen.HOME,
        AppScreen.SERVICES,
        AppScreen.TRANSACTION_HISTORY,
        AppScreen.ME,
        AppScreen.CHAT,
      ].includes(screen)
    ) {
      // If we are on the ME screen, we want to ensure the active tab is ME
      // This helps with highlighting the "More" tab in the navigation
      setActiveTab(screen);
    }
  }, [screen, setActiveTab]);

  useEffect(() => {
    if (screen === AppScreen.SIGNUP_UNDER_REVIEW) {
      const timer = setTimeout(() => {
        setScreen(AppScreen.ONBOARDING_ADD_BANK);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen, setScreen]);

  // Features State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleTransactions, setVisibleTransactions] = useState<number>(10);
  const [txFilterType, setTxFilterType] = useState<string>("All");
  const [txFilterDate, setTxFilterDate] = useState<string>("All Time");
  const [sellError, setSellError] = useState<string | null>(null);
  const [bugReport, setBugReport] = useState({ subject: "", description: "" });
  const [toastToShow, setToastToShow] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Settings State
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
  const [showVouchers, setShowVouchers] = useState<boolean>(false);

  const allServices = Constants.ALL_SERVICES;

  // Transaction Signing State
  const [pinInput, setPinInput] = useState<string>("");

  // Global Loading State
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [isKycLoading, setIsKycLoading] = useState<boolean>(false);
  const [globalLoadingMessage, setGlobalLoadingMessage] =
    useState<string>("Processing...");

  // OTP State
  const [otpValue, setOtpValue] = useState("");
  const [resendTimer, setResendTimer] = useState(45);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const txSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  useEffect(() => {
    if (Constants.SIGNUP_STEPS[signupStep]?.key === "otp") {
      setResendTimer(45);
    }
  }, [signupStep]);

  // Swap Flow State
  const [swapQuote, setSwapQuote] = useState<{
    rate: number;
    fee: number;
    received: number;
  } | null>(null);

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [advancedOtpValue, setAdvancedOtpValue] = useState("");
  const [isBackCamera, setIsBackCamera] = useState(true);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<{ name: string } | null>(null);
  const [showScanPaymentModal, setShowScanPaymentModal] = useState(false);
  const [swipedItem, setSwipedItem] = useState<SwipedItem | null>(null);
  const [scanAmount, setScanAmount] = useState("");

  const getPasswordStrength = useCallback((p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }, []);

  const coins = useMemo(
    () =>
      Constants.COINS.map((c) => ({
        ...c,
        balance:
          c.id === "ngn"
            ? walletBalance
            : c.id === "btc"
              ? 0.005
              : c.id === "eth"
                ? 0.12
                : c.id === "usdt"
                  ? 450.53
                  : 0,
      })),
    [walletBalance],
  );

  const coinsMap = useMemo(() => {
    return coins.reduce(
      (acc, coin) => {
        acc[coin.id] = coin;
        return acc;
      },
      {} as Record<string, (typeof coins)[0]>,
    );
  }, [coins]);

  const filteredCoins = useMemo(() => {
    let result = coins.filter((coin) => {
      const matchesSearch =
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
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
  const rewardHistory = useMemo(() => Constants.REWARD_HISTORY, []);
  const vouchers = useMemo(() => Constants.VOUCHERS, []);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // Handle OTP Focus
  useEffect(() => {
    if (
      screen === AppScreen.OTP_VERIFICATION ||
      screen === AppScreen.WELCOME_BACK
    ) {
      const timer = setTimeout(() => {
        otpInputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Handle Unrefreshable Screens
  useEffect(() => {
    const unrefreshableScreens = [
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
      AppScreen.NOTIFICATION_PERMISSION,
    ];

    const isUnrefreshable = unrefreshableScreens.includes(screen);

    if (isUnrefreshable) {
      document.body.style.overscrollBehaviorY = "none";

      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "r") {
          e.preventDefault();
        }
        if (e.key === "F5") {
          e.preventDefault();
        }
      };

      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        document.body.style.overscrollBehaviorY = "auto";
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    } else {
      document.body.style.overscrollBehaviorY = "auto";
    }
  }, [screen]);

  const showToast = useCallback(
    (typeOrMessage: string, title?: string, message?: string) => {
      if (typeof typeOrMessage === "string" && title === undefined) {
        // Handle showToast("Message")
        setToastToShow({ type: "success", message: typeOrMessage });
      } else {
        // Handle showToast('success', 'Title', 'Message')
        setToastToShow({
          type: typeOrMessage,
          message: message || title || typeOrMessage,
        });
      }
    },
    [],
  );

  // Navigation Logic with Protection
  const handleProtectedNavigation = useCallback(
    (target: AppScreen, isFromNavBar: boolean = false) => {
      if (target === AppScreen.SUPPORT) {
        setScreen(AppScreen.SUPPORT);
        if (isFromNavBar) setActiveTab(AppScreen.SUPPORT);
        return;
      }

      if (target === AppScreen.CHAT) {
        setScreen(AppScreen.CHAT);
        if (isFromNavBar) setActiveTab(AppScreen.CHAT);
        return;
      }

      // Ensure ME is always set as the active tab when navigating to it
      if (target === AppScreen.ME || isFromNavBar) setActiveTab(target);

      let finalTarget = target;

      if (finalTarget === AppScreen.SCANNER) {
        setScannerTab("receive");
      }

      // PIN Verification Check for sensitive screens
      const requiresPin = [
        AppScreen.PAYMENT_SETTINGS,
        AppScreen.ACCOUNT_SETTINGS,
        AppScreen.SECURITY_SETTINGS,
        AppScreen.CHANGE_PIN,
        AppScreen.EDIT_PROFILE,
        AppScreen.DELETE_ACCOUNT,
      ];

      if (requiresPin.includes(finalTarget)) {
        setPendingRoute(finalTarget);
        setOnPinSuccess(() => {
          setScreen(finalTarget);
        });
        setPinMode("verify");
        setShowPinModal(true);
        return;
      }

      if (finalTarget !== target) {
        setPendingRoute(target);
      }

      setScreen(finalTarget);
    },
    [
      screen,
      setScreen,
      setScannerTab,
      showToast,
      setActiveTab,
      setPendingRoute,
      setOnPinSuccess,
      setShowPinModal,
    ],
  );

  useEffect(() => {
    if (toastToShow) {
      const { type, message } = toastToShow;
      switch (type) {
        case "success":
          hotToast.success(message);
          break;
        case "error":
          hotToast.error(message);
          break;
        case "warning":
          hotToast.error(message); // Using error style for warning for now
          break;
        default:
          hotToast(message);
          break;
      }
      setToastToShow(null);
    }
  }, [toastToShow]);

  const copyToClipboard = useCallback(
    (text: string, message: string = "Copied to clipboard!") => {
      navigator.clipboard.writeText(text);
      showToast("info", "Copied!", message);
    },
    [showToast],
  );

  const navigateToHistory = useCallback(() => {
    setIsTxLoading(true);
    setScreen(AppScreen.TRANSACTION_HISTORY);
    setTimeout(() => {
      setIsTxLoading(false);
    }, 1200);
  }, [setScreen]);

  const showNavbar = useMemo(
    () =>
      [
        AppScreen.HOME,
        AppScreen.SERVICES,
        AppScreen.PAY_BILLS,
        AppScreen.SCANNER,
        AppScreen.REWARDS,
        AppScreen.ME,
        AppScreen.TRANSACTION_HISTORY,
        AppScreen.SUGGESTION_BOX,
        AppScreen.NOTIFICATIONS,
        AppScreen.SUPPORT,
        AppScreen.CHAT,
      ].includes(screen),
    [screen],
  );

  const signupSteps = Constants.SIGNUP_STEPS;

  const validateCurrentStep = useCallback(() => {
    const step = signupSteps[signupStep];
    const val = (signupData as any)[step.key];
    console.log(
      "Validating step:",
      step.key,
      "val:",
      val,
      "signupData:",
      signupData,
    );

    if (step.key === "otp") return otpValue.length === 4;
    if (step.key === "captcha") return isCaptchaVerified;
    if (step.key === "autoWithdrawToBank") return true;
    if (step.key === "country") return !!signupData.country;
    if (step.key === "referralSource") return !!signupData.referralSource;
    if (step.key === "referralCode") return true;
    if (step.key === "confirmPassword")
      return val.length >= 8 && val === signupData.password;
    if (step.type === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (step.key === "username")
      return (
        val &&
        val.length > 3 &&
        val.startsWith("₦") &&
        !isUsernameTaken &&
        !isCheckingUsername
      );
    if (step.key === "password") return val && val.length >= 8;
    return val && val.length >= 2;
  }, [
    signupStep,
    signupSteps,
    signupData,
    isCaptchaVerified,
    otpValue,
    isUsernameTaken,
    isCheckingUsername,
  ]);

  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const handleNextSignup = useCallback(async () => {
    if (signupStep < signupSteps.length - 1) {
      setIsSignupLoading(true);
      // Add 3-second delay if moving from Step 2 (email) to Step 3 (otp)
      if (signupStep === 1) {
        await new Promise((r) => setTimeout(r, 3000));
      } else {
        // Small delay for feedback
        await new Promise((r) => setTimeout(r, 600));
      }
      setSignupStep((prev) => prev + 1);
      setIsSignupLoading(false);
    } else {
      triggerReview({
        title: "Your account is being set up",
        message: "We'll notify you once it's complete.",
        notificationTitle: "Account Ready",
        notificationDesc: "Your account has been set up successfully.",
        nextScreen: AppScreen.SIGNUP_UNDER_REVIEW,
        onComplete: () => {
          setIsPinSetupRequired(true);
        },
      });
    }
  }, [signupStep, signupSteps.length, setScreen, signupSteps, triggerReview]);

  const handleOtpChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = (e.target.value ?? "").replace(/[^0-9]/g, "").slice(0, 4);
      setOtpValue(val);
    },
    [],
  );

  const handleWelcomePinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = (e.target.value ?? "").replace(/[^0-9]/g, "").slice(0, 4);
      setWelcomePin(val);
      if (pinError) setPinError(false);

      if (val.length === 4) {
        setTimeout(() => {
          if (val === (transactionPin || "1234")) {
            setScreen(AppScreen.HOME);
          } else {
            showToast(
              "error",
              "Incorrect PIN",
              "The PIN you entered is incorrect. Please try again.",
            );
            setPinError(true);
            setWelcomePin("");
          }
        }, 500);
      }
    },
    [pinError, transactionPin, setScreen, showToast],
  );

  const handlePinSetup = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = (e.target.value ?? "").replace(/[^0-9]/g, "").slice(0, 4);
      setTempPin(val);
    },
    [],
  );

  const handleKeypadPress = useCallback(
    (num: string | number) => {
      if (num === "del") {
        setWelcomePin((prev) => prev.slice(0, -1));
        if (pinError) setPinError(false);
      } else if (num !== "" && welcomePin.length < 4) {
        const newVal = welcomePin + num;
        setWelcomePin(newVal);
        if (pinError) setPinError(false);

        if (newVal.length === 4) {
          setTimeout(() => {
            if (newVal === (transactionPin || "1234")) {
              setScreen(AppScreen.HOME);
            } else {
              showToast(
                "error",
                "Incorrect PIN",
                "The PIN you entered is incorrect. Please try again.",
              );
              setPinError(true);
              setWelcomePin("");
            }
          }, 300);
        }
      }
    },
    [welcomePin, pinError, transactionPin, setScreen, showToast],
  );

  const handleTransactionPinPress = useCallback(
    (num: string | number) => {
      if (num === "del") {
        setPinInput((prev) => prev.slice(0, -1));
      } else if (num !== "" && pinInput.length < 4) {
        const newPin = pinInput + num;
        setPinInput(newPin);
        if (newPin.length === 4) {
          if (pinMode === "setup") {
            setTransactionPin(newPin);
            setPinInput("");
            setPinMode("confirm");
          } else if (pinMode === "confirm") {
            if (newPin === transactionPin) {
              setIsPinSetupRequired(false);
              setShowPinModal(false);
              setPinInput("");
              setPinMode("verify");
              showToast(
                "success",
                "PIN Set",
                "Your transaction PIN has been set successfully.",
              );
            } else {
              showToast(
                "error",
                "PIN Mismatch",
                "The PINs do not match. Please try again.",
              );
              setPinInput("");
              setPinMode("setup");
            }
          } else {
            setTimeout(() => {
              if (SecurityService.validatePin(newPin, transactionPin)) {
                setShowPinModal(false);
                setPinInput("");
                if (onPinSuccess) onPinSuccess();
              } else {
                showToast(
                  "error",
                  "Incorrect PIN",
                  "The PIN you entered is incorrect. Please try again.",
                );
                setPinInput("");
              }
            }, 300);
          }
        }
      }
    },
    [
      pinInput,
      transactionPin,
      onPinSuccess,
      showToast,
      pinMode,
      setTransactionPin,
      setPinMode,
      setIsPinSetupRequired,
      setShowPinModal,
    ],
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type Filter
      let matchesType = true;
      if (txFilterType !== "All") {
        const typeLower = tx.type.toLowerCase();
        if (txFilterType === "Gift Card")
          matchesType = typeLower.includes("gift card");
        else if (txFilterType === "Withdrawal")
          matchesType =
            typeLower.includes("withdrawal") || typeLower.includes("transfer");
      }

      // Date Filter
      let matchesDate = true;
      if (txFilterDate !== "All Time") {
        const txDate = new Date(tx.date);
        const now = new Date();
        if (txFilterDate === "Today") {
          matchesDate = txDate.toDateString() === now.toDateString();
        } else if (txFilterDate === "This Week") {
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          matchesDate = txDate >= weekAgo;
        } else if (txFilterDate === "This Month") {
          matchesDate =
            txDate.getMonth() === now.getMonth() &&
            txDate.getFullYear() === now.getFullYear();
        }
      }

      return matchesType && matchesDate;
    });
  }, [transactions, txFilterType, txFilterDate]);

  useEffect(() => {
    if (screen !== AppScreen.TRANSACTION_HISTORY) return;
    if (visibleTransactions >= filteredTransactions.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleTransactions((prev) => prev + 10);
        }
      },
      { threshold: 0.1 },
    );

    const currentSentinel = txSentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [screen, visibleTransactions, filteredTransactions.length]);

  const TransactionStatusScreen: React.FC<{
    status: "processing" | "success" | "failed" | "rejected";
    title: string;
    message: string;
    amount?: string;
    onDone: () => void;
    onRetry?: () => void;
    onViewReceipt?: () => void;
  }> = ({ status, title, message, amount, onDone, onRetry, onViewReceipt }) => {
    const config = {
      processing: {
        icon: <LoadingScreen message={message} />,
        color: "bg-transparent",
        textColor: "text-primary",
        shadow: "shadow-none",
      },
      success: {
        icon: <Icons.Check />,
        color: "bg-[#2da437]",
        textColor: "text-[#2da437]",
        shadow: "shadow-[#2da437]/30",
      },
      failed: {
        icon: <Icons.Alert />,
        color: "bg-red-500",
        textColor: "text-red-500",
        shadow: "shadow-red-500/30",
      },
      rejected: {
        icon: <Icons.Trash />,
        color: "bg-red-500",
        textColor: "text-red-500",
        shadow: "shadow-red-500/30",
      },
    }[status];

    if (status === "processing") {
      return (
        <div className="flex-1 flex flex-col bg-white items-center justify-center animate-fade-in relative overflow-hidden">
          <BrandPattern opacity={0.03} color="primary" size={60} />
          <div className="relative z-10 flex flex-col items-center">
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
        </div>
      );
    }

    return (
      <div
        className={`flex-1 flex flex-col ${status === "success" ? "bg-primary" : "bg-white"} items-center justify-center p-8 text-center animate-fade-in relative overflow-hidden`}
      >
        <BrandPattern
          opacity={0.03}
          color={status === "success" ? "white" : "primary"}
          size={60}
        />

        <div className="w-full max-w-md relative z-10 flex flex-col items-center">
          <div
            className={`w-24 h-24 ${status === "success" ? "bg-white text-primary" : config.color + " text-white"} rounded-full flex items-center justify-center mb-8 shadow-lg ${config.shadow} ${status === "success" ? "animate-epic-bounce" : status === "failed" || status === "rejected" ? "animate-shake" : ""} mx-auto`}
          >
            <div className="w-12 h-12 flex items-center justify-center">
              {config.icon}
            </div>
          </div>
          <h2
            className={`text-3xl font-black mb-2 ${status === "success" ? "text-white" : "text-gray-900"}`}
          >
            {title}
          </h2>
          <p
            className={`font-medium mb-12 ${status === "success" ? "text-white/80" : "text-gray-500"}`}
          >
            {message}
          </p>

          {status === "success" ? (
            <div className="bg-white rounded-[40px] p-8 w-full shadow-2xl text-left space-y-8">
              {amount && (
                <div className="text-center border-b border-gray-100 pb-8">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Transaction Amount
                  </p>
                  <p className="text-3xl font-black text-primary">{amount}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  className="w-full !h-14 !rounded-2xl !bg-primary !text-white shadow-lg shadow-primary/20"
                  onClick={onDone}
                >
                  Back to Dashboard
                </Button>
                {onViewReceipt && (
                  <button
                    className="w-full h-14 rounded-2xl bg-white border border-gray-100 text-gray-600 text-sm font-bold active:bg-gray-50 transition-colors"
                    onClick={onViewReceipt}
                  >
                    View Receipt
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full">
              {amount && (
                <div className="mb-12 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Transaction Amount
                  </p>
                  <p className={`text-2xl font-black ${config.textColor}`}>
                    {amount}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {status === "failed" && onRetry && (
                  <Button
                    className="w-full !h-14 !rounded-2xl"
                    onClick={onRetry}
                  >
                    Try Again
                  </Button>
                )}
                <Button
                  variant={status === "failed" ? "outline" : "primary"}
                  className="w-full !h-14 !rounded-2xl"
                  onClick={onDone}
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderScreenContent = (screenToRender: AppScreen) => {
    switch (screenToRender) {
      case AppScreen.WELCOME_BACK:
        return (
          <div className="flex-1 flex flex-col bg-white p-8 animate-fade-in text-gray-900 relative overflow-hidden justify-center items-center">
            <div className="w-full max-w-xs mx-auto flex flex-col items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 mb-4 relative z-10">
                <img
                  src={
                    signupData.profileImage ||
                    getAvatarUrl(signupData.username || "hassan")
                  }
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-8 tracking-tight">
                Welcome back, {signupData.username || "Hassan"}
              </h3>

              <div className="relative w-full flex flex-col items-center mb-8">
                <div
                  className={`flex gap-4 justify-center relative z-10 mb-12 ${pinError ? "animate-shake" : ""}`}
                >
                  {[0, 1, 2, 3].map((i) => {
                    const isFilled = welcomePin.length > i;
                    return (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${isFilled ? "bg-primary" : "bg-gray-200"}`}
                      ></div>
                    );
                  })}
                </div>

                {/* Custom Keypad */}
                <div className="grid grid-cols-3 gap-x-12 gap-y-8 w-full max-w-[240px]">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"].map((num, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (num === "del") {
                          setWelcomePin((prev) => prev.slice(0, -1));
                        } else if (num !== "" && welcomePin.length < 4) {
                          const newPin = welcomePin + String(num);
                          setWelcomePin(newPin);
                          if (newPin.length === 4) {
                            // Validate PIN
                            if (newPin === transactionPin) {
                              setScreen(AppScreen.HOME);
                              setWelcomePin("");
                            } else {
                              setPinError(true);
                              setTimeout(() => {
                                setPinError(false);
                                setWelcomePin("");
                              }, 500);
                              showToast("error", "Incorrect PIN");
                            }
                          }
                        }
                      }}
                      className={`w-12 h-12 flex items-center justify-center text-xl font-medium active:scale-90 transition-transform ${
                        num === ""
                          ? "invisible"
                          : num === "del"
                            ? "text-gray-400 hover:text-red-500"
                            : "text-gray-900 hover:bg-gray-50 rounded-full"
                      }`}
                    >
                      {num === "del" ? (
                        <Icons.Delete className="w-5 h-5" />
                      ) : (
                        num
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    /* Handle biometric */
                  }}
                  className="mt-8 flex items-center gap-2 text-primary font-bold text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51.26 4" />
                    <path d="M17 12a5 5 0 0 0-5-5 5 5 0 0 0-5 5" />
                    <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10" />
                    <path d="M12 17a2 2 0 0 1 2-2c1.02 0 2.51.1 4-.26" />
                  </svg>
                  <span>Biometric Login</span>
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 mt-8">
                <button
                  onClick={() => setScreen(AppScreen.LOGIN)}
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600"
                >
                  Switch Account
                </button>
              </div>
            </div>
          </div>
        );

      case AppScreen.ONBOARDING_1:
      case AppScreen.ONBOARDING_2:
      case AppScreen.ONBOARDING_3:
        return (
          <OnboardingScreen
            onComplete={() => setScreen(AppScreen.SIGNUP)}
            onLogin={() => setScreen(AppScreen.LOGIN)}
          />
        );

      case AppScreen.LOGIN:
        return (
          <AuthLayout visualType="login" subtitle="Login to your hub">
            <div className="flex justify-between items-center mb-12 lg:hidden">
              <Logo className="w-24 h-8" variant="color" />
            </div>
            <div className="hidden lg:flex justify-end mb-12">
            </div>
            <div className="mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] lg:hidden">
                Login to your hub
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col">
                <Input
                  label="Email or Username"
                  placeholder="johndoe"
                  variant="default"
                  value={loginData.email}
                  onChange={(e) => {
                    const raw = (e.target.value ?? "")
                      .replace(/^[₦-]+/, "")
                      .replace(/\s/g, "");
                    setLoginData({ ...loginData, email: "₦-" + raw });
                  }}
                />
                <EmailSuggestions
                  value={loginData.email}
                  onSelect={(val) => setLoginData({ ...loginData, email: val })}
                />
              </div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                variant="default"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value.replace(/\s/g, ""),
                  })
                }
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setScreen(AppScreen.FORGOT_PASSWORD)}
                  className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600"
                >
                  Forgot Password?
                </button>
              </div>
              <Button
                fullWidth
                onClick={() => {
                  setScreen(AppScreen.HOME);
                }}
              >
                Login
              </Button>
              <div className="text-center pt-4 flex justify-center items-center whitespace-nowrap">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 opacity-60">
                  Don't have an account?
                </span>
                <button
                  onClick={() => setScreen(AppScreen.SIGNUP)}
                  className="text-[10px] font-black uppercase tracking-[0.15em] text-primary ml-1 hover:opacity-80 transition-opacity"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </AuthLayout>
        );

      case AppScreen.FORGOT_PASSWORD:
        return (
          <AuthLayout
            visualType="login"
            subtitle="Enter your email to receive instructions"
          >
            <div className="flex justify-between items-center mb-10 lg:hidden">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setScreen(AppScreen.LOGIN)}
                  className="text-gray-400"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <Logo className="w-24 h-8" variant="color" />
              </div>
            </div>
            <div className="hidden lg:flex justify-between items-center mb-10">
              <button
                onClick={() => setScreen(AppScreen.LOGIN)}
                className="text-gray-400 flex items-center gap-2 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest">
                  Back
                </span>
              </button>
            </div>
            <div className="mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Reset Password
              </h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest lg:hidden">
                Enter your email to receive instructions
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">
                  Email Address
                </label>
                <Input
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  placeholder="johndoe@example.com"
                  type="email"
                  variant="default"
                />
              </div>
              <Button
                fullWidth
                onClick={() => {
                  showToast(
                    "success",
                    "Reset Link Sent",
                    "Please check your email for instructions.",
                  );
                  setScreen(AppScreen.LOGIN);
                }}
              >
                Send Reset Link
              </Button>
            </div>
          </AuthLayout>
        );

      case AppScreen.SIGNUP:
        const currentStep = signupSteps[signupStep];
        const isMismatchedPassword =
          currentStep.key === "confirmPassword" &&
          signupData.confirmPassword.length >= 8 &&
          signupData.confirmPassword !== signupData.password;

        return (
          <AuthLayout
            visualType="signup"
            subtitle={`Step ${signupStep + 1} of ${signupSteps.length}`}
          >
            <div className="flex justify-between items-center mb-10 lg:hidden">
              <div className="flex items-center gap-4">
                {signupStep > 0 ? (
                  <button
                    onClick={() => setSignupStep(signupStep - 1)}
                    className="text-gray-400"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                ) : null}
                <Logo className="w-24 h-8" variant="color" />
              </div>
            </div>
            <div className="hidden lg:flex justify-between items-center mb-10">
              {signupStep > 0 ? (
                <button
                  onClick={() => setSignupStep(signupStep - 1)}
                  className="text-gray-400 flex items-center gap-2 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Back
                  </span>
                </button>
              ) : (
                <div />
              )}
            </div>
            <div className="mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] lg:hidden">
                Step {signupStep + 1} of {signupSteps.length}
              </p>
            </div>

            <div className="space-y-6">
              {currentStep.isDropdown ? (
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">
                    {currentStep.label}
                  </label>
                  <div
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className={`w-full py-4 px-4 bg-gray-50 border ${isCountryOpen ? "border-primary" : "border-gray-200"} rounded-[20px] flex justify-between items-center text-gray-900 font-medium cursor-pointer active:bg-gray-100 transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🇳🇬</span>
                      <span>{signupData.country}</span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isCountryOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {isCountryOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[20px] overflow-hidden z-30 shadow-2xl animate-fade-in">
                      <div
                        onClick={() => {
                          setSignupData({ ...signupData, country: "Nigeria" });
                          setIsCountryOpen(false);
                        }}
                        className="p-4 hover:bg-gray-50 flex items-center gap-3 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        <span className="text-xl">🇳🇬</span>
                        <span className="text-gray-900 text-sm font-bold">
                          Nigeria
                        </span>
                      </div>
                    </div>
                  )}
                  <p className="text-[9px] text-gray-400 italic ml-1 mt-1">
                    Gogreen currently supports Nigeria only.
                  </p>
                </div>
              ) : currentStep.isSourceDropdown ? (
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">
                    {currentStep.label}
                  </label>
                  <div
                    onClick={() => setIsSourceOpen(!isSourceOpen)}
                    className={`w-full py-4 px-4 bg-gray-50 border ${isSourceOpen ? "border-primary" : "border-gray-200"} rounded-[20px] flex justify-between items-center text-gray-900 font-medium cursor-pointer active:bg-gray-100 transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`${!signupData.referralSource ? "text-gray-400" : ""}`}
                      >
                        {signupData.referralSource || "Select an option"}
                      </span>
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isSourceOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {isSourceOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[20px] overflow-hidden z-30 shadow-2xl animate-fade-in max-h-60 overflow-y-auto">
                      {[
                        "Friends & Family",
                        "LinkedIn",
                        "Google",
                        "Gogreen Blog",
                        "X (formerly Twitter)",
                        "Instagram",
                        "YouTube",
                        "Influencers",
                        "Events",
                        "Communities",
                        "Others",
                      ].map((source) => (
                        <div
                          key={source}
                          onClick={() => {
                            setSignupData({
                              ...signupData,
                              referralSource: source,
                            });
                            setIsSourceOpen(false);
                          }}
                          className="p-4 hover:bg-gray-50 flex items-center gap-3 cursor-pointer border-b border-gray-50 last:border-0"
                        >
                          <span className="text-gray-900 text-sm font-bold">
                            {source}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : currentStep.isPreference ? (
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em] ml-1">
                    {currentStep.label}
                  </label>
                  <div className="space-y-3">
                    <div
                      onClick={() =>
                        setSignupData({
                          ...signupData,
                          autoWithdrawToBank: true,
                        })
                      }
                      className={`p-5 rounded-[24px] border transition-all cursor-pointer flex items-center gap-4 ${signupData.autoWithdrawToBank ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(46,139,58,0.05)]" : "border-gray-100 bg-gray-50"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${signupData.autoWithdrawToBank ? "border-primary bg-primary" : "border-gray-300"}`}
                      >
                        {signupData.autoWithdrawToBank && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-bold text-sm">
                          Automatic Bank Payment
                        </p>
                        <p className="text-gray-400 text-[10px]">
                          Crypto sales are paid directly to your bank.
                        </p>
                      </div>
                    </div>
                    <div
                      onClick={() =>
                        setSignupData({
                          ...signupData,
                          autoWithdrawToBank: false,
                        })
                      }
                      className={`p-5 rounded-[24px] border transition-all cursor-pointer flex items-center gap-4 ${!signupData.autoWithdrawToBank ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(46,139,58,0.05)]" : "border-gray-100 bg-gray-50"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${!signupData.autoWithdrawToBank ? "border-primary bg-primary" : "border-gray-300"}`}
                      >
                        {!signupData.autoWithdrawToBank && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-bold text-sm">
                          Store in Gogreen Balance
                        </p>
                        <p className="text-gray-400 text-[10px]">
                          Funds are kept in your wallet for manual
                          withdrawal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : currentStep.key === "captcha" ? (
                <SlideCaptcha
                  isVerified={isCaptchaVerified}
                  onVerify={() => setIsCaptchaVerified(true)}
                />
              ) : (currentStep as any).isOtp ? (
                <div className="flex flex-col gap-4 text-center">
                  <label className="text-[10px] font-bold text-gray-900 uppercase tracking-[0.2em]">
                    {currentStep.label}
                  </label>
                  <p className="text-primary/70 text-[9px] font-medium leading-relaxed italic">
                    *Check your <span className="underline">spam</span> or{" "}
                    <span className="underline">promotion</span> folder if you
                    can't find the OTP in your inbox.
                  </p>
                  <div
                    className="flex gap-4 justify-center relative cursor-text"
                    onClick={() => otpInputRef.current?.focus()}
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-14 h-14 bg-gray-50 border ${otpValue.length === i ? "border-primary shadow-[0_0_15px_rgba(26,93,34,0.1)]" : "border-gray-200"} rounded-2xl flex items-center justify-center text-3xl font-black transition-all text-gray-900`}
                      >
                        {otpValue[i] || ""}
                        {otpValue.length === i && (
                          <div className="w-0.5 h-8 bg-primary animate-pulse ml-1" />
                        )}
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
                    style={{ fontSize: "16px" }}
                  />
                  <Button
                    variant="ghost"
                    disabled={resendTimer > 0}
                    onClick={() => {
                      setResendTimer(45);
                      showToast(
                        "info",
                        "OTP Resent",
                        "A new verification code has been sent.",
                      );
                    }}
                    className="mt-2 mx-auto opacity-60 hover:opacity-100 !text-gray-500"
                  >
                    {resendTimer > 0
                      ? `Resend Code in 0:${resendTimer.toString().padStart(2, "0")}`
                      : "Resend Code"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-1 relative">
                  {currentStep.key === "fullName" && (
                    <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-4 flex gap-4 mb-4 animate-fade-in">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icons.Info className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-gray-700 text-xs font-medium leading-relaxed">
                        Please enter your first and middle names exactly as they
                        appear on your government-issued ID to avoid
                        verification delays.
                      </p>
                    </div>
                  )}
                  <Input
                    label={currentStep.label}
                    type={currentStep.type || "text"}
                    placeholder={currentStep.placeholder}
                    variant="default"
                    value={(signupData as any)[currentStep.key] || ""}
                    error={
                      currentStep.key === "username" && isUsernameTaken
                        ? "This username is already taken"
                        : undefined
                    }
                    rightElement={
                      currentStep.key === "username" && isCheckingUsername ? (
                        <Icons.Loader className="w-4 h-4 animate-spin text-primary" />
                      ) : currentStep.key === "username" &&
                        signupData.username.length > 3 &&
                        !isUsernameTaken &&
                        !isCheckingUsername ? (
                        <Icons.CheckCircle className="w-4 h-4 text-primary" />
                      ) : undefined
                    }
                    onPaste={
                      currentStep.key === "confirmPassword"
                        ? (e) => e.preventDefault()
                        : undefined
                    }
                    onChange={(e) => {
                      let val = e.target.value ?? "";

                      if (currentStep.key === "fullName") {
                        // Only allow alphabets and spaces
                        val = val.replace(/[^a-zA-Z\s]/g, "");
                      }

                      if (currentStep.key === "username") {
                        // Strip the ₦ prefix to validate
                        let raw = val.replace(/^₦/, "");

                        // Strict rules: No spaces, no special characters, cannot start with a number
                        // 1. Remove all non-alphanumeric characters
                        raw = raw.replace(/[^a-zA-Z0-9]/g, "");

                        // 2. Cannot start with a number
                        raw = raw.replace(/^[0-9]+/, "");

                        val = "₦" + raw;
                        setIsUsernameTaken(false);
                      } else if (
                        currentStep.key === "password" ||
                        currentStep.key === "confirmPassword"
                      ) {
                        val = val.replace(/\s/g, "");
                      }

                      setSignupData({ ...signupData, [currentStep.key]: val });
                    }}
                  />
                  {currentStep.key === "username" && (
                    <p className="text-[10px] text-gray-500 font-medium mt-1">
                      This will be your GoGreen tag to receive payments. No
                      spaces, no special characters, and cannot start with a
                      number.
                    </p>
                  )}
                  {currentStep.type === "email" && (
                    <EmailSuggestions
                      value={signupData.email}
                      onSelect={(val) =>
                        setSignupData({ ...signupData, email: val })
                      }
                    />
                  )}
                  {currentStep.key === "password" && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        {
                          label: "Minimum of 8 characters",
                          valid: signupData.password.length >= 8,
                        },
                        {
                          label: "Maximum of 64 characters",
                          valid:
                            signupData.password.length <= 64 &&
                            signupData.password.length > 0,
                        },
                        {
                          label: "Upper case character",
                          valid: /[A-Z]/.test(signupData.password),
                        },
                        {
                          label: "Lower case character",
                          valid: /[a-z]/.test(signupData.password),
                        },
                        {
                          label: "At least one number",
                          valid: /[0-9]/.test(signupData.password),
                        },
                        {
                          label: "At least one special character",
                          valid: /[^A-Za-z0-9]/.test(signupData.password),
                        },
                      ].map((req, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${req.valid ? "bg-primary text-white" : "bg-gray-100 text-gray-300"}`}
                          >
                            <svg
                              className="w-2.5 h-2.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span
                            className={`text-[10px] font-medium transition-colors ${req.valid ? "text-gray-900" : "text-gray-400"}`}
                          >
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {isMismatchedPassword && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 ml-1 animate-pulse">
                      Passwords do not match
                    </p>
                  )}
                </div>
              )}
              <div className="pt-4">
                <Button
                  fullWidth
                  disabled={
                    !validateCurrentStep() || isCountryOpen || isSignupLoading
                  }
                  onClick={handleNextSignup}
                >
                  {isSignupLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : signupStep === signupSteps.length - 1 ? (
                    "Continue"
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
              {signupStep === 0 && (
                <div className="text-center pt-4 flex justify-center items-center whitespace-nowrap">
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500 opacity-60">
                    Already have an account?
                  </span>
                  <button
                    onClick={() => setScreen(AppScreen.LOGIN)}
                    className="text-[10px] font-black uppercase tracking-[0.15em] text-primary ml-1 hover:opacity-80 transition-opacity"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </AuthLayout>
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
              <h2 className="text-2xl font-black text-gray-900 mb-4 px-4 leading-tight">
                Your verification is now under review
              </h2>
              <p className="text-gray-500 text-sm font-medium mb-12">
                We'll notify you once it's complete.
              </p>
              <div className="w-full px-4 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm animate-pulse">
                  <Icons.Refresh className="w-5 h-5 animate-spin" />
                  <span>Verifying your details...</span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  This may take a few minutes
                </p>
              </div>
              {/* Hidden button to simulate user coming back and being approved */}
              <button
                onClick={() => setScreen(AppScreen.ONBOARDING_ADD_BANK)}
                className="absolute bottom-0 opacity-0 w-10 h-10"
              ></button>
            </div>
          </div>
        );

      case AppScreen.OTP_VERIFICATION:
        return (
          <div className="flex-1 flex flex-col bg-white p-10 animate-fade-in text-gray-900 relative overflow-hidden items-center justify-center">
            <div className="w-full max-w-md">
              <h2 className="text-4xl font-black mb-2 mt-10">Verify Email</h2>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
                Enter the 4-digit code sent to you
              </p>
              <p className="text-primary/70 text-[9px] font-medium leading-relaxed mb-12 italic">
                *Check your <span className="underline">spam</span> or{" "}
                <span className="underline">promotion</span> folder if you can't
                find the OTP in your inbox.
              </p>
              <div
                className="flex gap-4 justify-between mb-12 relative cursor-text"
                onClick={() => otpInputRef.current?.focus()}
              >
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 aspect-square bg-gray-50 border ${otpValue.length === i ? "border-primary shadow-[0_0_15px_rgba(26,93,34,0.1)]" : "border-gray-200"} rounded-2xl flex items-center justify-center text-3xl font-black transition-all text-gray-900`}
                  >
                    {otpValue[i] || ""}
                    {otpValue.length === i && (
                      <div className="w-0.5 h-8 bg-primary animate-pulse ml-1" />
                    )}
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
                style={{ fontSize: "16px" }}
              />
              <Button
                fullWidth
                disabled={otpValue.length < 4}
                onClick={() => setScreen(AppScreen.ONBOARDING_ADD_BANK)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              >
                Continue
              </Button>
              <Button
                variant="ghost"
                onClick={() => showToast("Verification code resent!")}
                className="mt-8 opacity-60 hover:opacity-100 !text-gray-500"
              >
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
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              Instant and secure login with Touch ID
            </h2>
            <p className="text-gray-500 text-sm font-medium mb-12 max-w-[280px]">
              You can instantly and securely log in to your account using
              biometric data.
            </p>
            <Button
              fullWidth
              onClick={() => {
                setBiometricEnabled(true);
                setScreen(AppScreen.SECURITY);
              }}
              className="!h-14 !rounded-2xl mb-4"
            >
              Enable
            </Button>
            <Button
              fullWidth
              variant="ghost"
              onClick={() => setScreen(AppScreen.SECURITY)}
              className="!h-14 !rounded-2xl"
            >
              Skip for now
            </Button>
          </div>
        );

      case AppScreen.NOTIFICATION_PERMISSION:
        return (
          <div className="flex-1 flex flex-col bg-white animate-fade-in items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
              <Icons.Bell className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              Instant notifications
            </h2>
            <p className="text-gray-500 text-sm font-medium mb-12 max-w-[280px]">
              We can notify you when something important happens, like your
              balance changes or there's a security alert.
            </p>
            <Button
              fullWidth
              onClick={() => {
                setPushNotificationsEnabled(true);
                setScreen(AppScreen.ONBOARDING_1);
              }}
              className="!h-14 !rounded-2xl mb-4"
            >
              Turn on notifications
            </Button>
            <Button
              fullWidth
              variant="ghost"
              onClick={() => setScreen(AppScreen.ONBOARDING_1)}
              className="!h-14 !rounded-2xl"
            >
              Skip for now
            </Button>
          </div>
        );

      case AppScreen.ONBOARDING_ADD_BANK:
        return (
          <div className="flex-1 flex flex-col bg-white animate-slide-up items-center justify-center p-8">
            <div className="w-full max-w-md flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black text-gray-900">Add Bank</h2>
                <button
                  onClick={() => setScreen(AppScreen.HOME)}
                  className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                  Skip
                </button>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                      Select Bank
                    </label>
                    <select className="w-full p-4 rounded-[20px] bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary text-sm font-bold text-gray-900 appearance-none">
                      <option className="text-gray-900">
                        Select a bank...
                      </option>
                      <option className="text-gray-900">Access Bank</option>
                      <option className="text-gray-900">
                        Guaranty Trust Bank
                      </option>
                      <option className="text-gray-900">
                        United Bank for Africa
                      </option>
                      <option className="text-gray-900">Zenith Bank</option>
                      <option className="text-gray-900">Kuda Bank</option>
                      <option className="text-gray-900">Opay</option>
                      <option className="text-gray-900">PalmPay</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                      Account Number
                    </label>
                    <input
                      type="tel"
                      placeholder="08031234567"
                      className="w-full p-4 rounded-[20px] bg-gray-50 border border-gray-200 focus:outline-none focus:border-primary text-sm font-mono font-bold text-gray-900 placeholder:text-gray-400"
                      maxLength={10}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = (target.value ?? "").replace(
                          /[^0-9]/g,
                          "",
                        );
                      }}
                    />
                  </div>

                  <div className="bg-amber-50 p-4 rounded-[20px] border border-amber-100 flex gap-3 items-start">
                    <span className="text-amber-600 mt-0.5">
                      <Icons.Alert />
                    </span>
                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                      Please ensure the bank account name matches your verified
                      identity name{" "}
                      <span className="font-bold text-amber-900">
                        ({signupData.fullName || "Hassan Kehinde"})
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <Button
                    fullWidth
                    className="!bg-emerald-600 hover:!bg-emerald-700"
                    onClick={() => {
                      showToast("Bank Account Added!");
                      setScreen(AppScreen.HOME);
                    }}
                  >
                    Continue
                  </Button>
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
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                Welcome Home
              </h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-12">
                Your Gogreen Africa Dashboard is ready
              </p>
              <Button
                fullWidth
                onClick={() => {
                  setScreen(AppScreen.HOME);
                }}
              >
                Continue
              </Button>
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

      case AppScreen.HOME:
        return (
          <HomeScreen
            greeting={getGreeting()}
            user={signupData}
            hasUnreadNotifications={hasUnreadNotifications}
            currency={currency}
            setCurrency={setCurrency}
            hideBalance={hideBalance}
            setHideBalance={setHideBalance}
            walletBalance={walletBalance}
            bonusClaimed={bonusClaimed}
            pendingBalance={pendingBalance}
            onNavigate={handleProtectedNavigation}
            quickAccessIds={quickAccessIds}
            showQuickAccessDropdown={showQuickAccessDropdown}
            setShowQuickAccessDropdown={setShowQuickAccessDropdown}
          />
        );

      case AppScreen.SERVICES:
        return <ServicesScreen />;

      case AppScreen.VIRTUAL_CARD:
        return <VirtualCardScreen setScreen={setScreen} />;

      case AppScreen.SUPPORT:
        return (
          <SupportScreen
            onBack={() => setScreen(previousScreen || AppScreen.HOME)}
            initialView={supportInitialView}
          />
        );

      case AppScreen.CHAT:
        return (
          <SupportScreen
            onBack={() => setScreen(previousScreen || AppScreen.HOME)}
            initialView="CHAT_HISTORY"
            initialChatId={selectedChatId}
          />
        );

      /* ==========================================================================================
         2) TRANSACTION HISTORY SCREEN
         ========================================================================================== */
      case AppScreen.TRANSACTION_HISTORY:
        return (
          <div className="flex-1 flex flex-col bg-white animate-fade-in items-center relative w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* 1. FIXED TOP CONTAINER (Static Header) */}
              <div className="z-20 flex-shrink-0 header-integrated">
                <BackHeader
                  title="Transactions"
                  subtitle="History"
                  className="!px-5 !bg-transparent !border-b-0"
                  hideBack={true}
                />

                {/* Filters and Summary Section */}
                <div className="px-5 py-4 space-y-4">
                  {/* Type Filters */}
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {["All", "Gift Card", "Withdrawal"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setTxFilterType(type)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                          txFilterType === type
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Date Filters */}
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {["All Time", "Today", "This Week", "This Month"].map(
                      (date) => (
                        <button
                          key={date}
                          onClick={() => setTxFilterDate(date)}
                          className={`px-4 py-1.5 rounded-xl text-[9px] font-bold transition-all whitespace-nowrap border ${
                            txFilterDate === date
                              ? "bg-white border-primary text-primary shadow-sm"
                              : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                          }`}
                        >
                          {date}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Activity Summary Line */}
                  <div className="flex justify-between items-center px-1 pt-2">
                    <h3 className="font-display font-black text-gray-900 text-[10px] uppercase tracking-[0.2em]">
                      {txFilterType === "All"
                        ? "All Activities"
                        : `${txFilterType} Activities`}
                    </h3>
                    <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      {filteredTransactions.length} Total
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. SEPARATE SCROLLABLE WIDGET (Transaction List) */}
              <div className="flex-1 px-5 pt-4 pb-24 overflow-y-auto bg-gray-50/30 scroll-smooth">
                {isTxLoading ? (
                  <SkeletonScreen type="list" />
                ) : (
                  <div className="space-y-2">
                    {filteredTransactions.length > 0 ? (
                      <>
                        {filteredTransactions
                          .slice(0, visibleTransactions)
                          .map((tx) => (
                            <TransactionItem
                              key={tx.id}
                              tx={tx}
                              swipedItem={swipedItem}
                              onSwipe={(
                                id: number,
                                dir: "left" | "right" | null,
                              ) =>
                                setSwipedItem(
                                  dir ? { id, direction: dir } : null,
                                )
                              }
                              onTap={() => {
                                setSelectedTx(tx);
                                setScreen(AppScreen.TRANSACTION_DETAILS);
                              }}
                              onDetails={() => {
                                setSelectedTx(tx);
                                setScreen(AppScreen.TRANSACTION_DETAILS);
                                setSwipedItem(null);
                              }}
                              onRepeat={() => {
                                showToast(
                                  "info",
                                  "Repeat Transaction",
                                  `Repeating transaction ${tx.type}`,
                                );
                                setSwipedItem(null);
                              }}
                              hideBalance={hideBalance}
                            />
                          ))}

                        {/* Pagination / Infinite Scroll Sentinel */}
                        {visibleTransactions < filteredTransactions.length && (
                          <div
                            ref={txSentinelRef}
                            className="w-full py-8 flex items-center justify-center"
                          >
                            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                          </div>
                        )}
                      </>
                    ) : (
                      /* Empty State */
                      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in relative overflow-hidden">
                        <BrandPattern
                          opacity={0.03}
                          color="primary"
                          size={40}
                        />
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Icons.History className="w-10 h-10 text-gray-200" />
                          </div>
                          <h3 className="text-gray-900 font-black text-sm mb-1">
                            {txFilterType !== "All" ||
                            txFilterDate !== "All Time"
                              ? "No matches found"
                              : "No transactions found"}
                          </h3>
                          <p className="text-gray-400 text-[10px] max-w-[200px] font-medium leading-relaxed">
                            {txFilterType !== "All" ||
                            txFilterDate !== "All Time"
                              ? "Try adjusting your filters to find what you're looking for."
                              : "You haven't made any transactions yet. Start trading to see your history here!"}
                          </p>
                          {(txFilterType !== "All" ||
                            txFilterDate !== "All Time") && (
                            <Button
                              variant="ghost"
                              className="mt-6 !h-9 !text-[10px] !px-6 border border-gray-100"
                              onClick={() => {
                                setTxFilterType("All");
                                setTxFilterDate("All Time");
                              }}
                            >
                              Clear Search
                            </Button>
                          )}
                        </div>
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
          <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader
                title="Details"
                subtitle={selectedTx.status}
                onBack={() => setScreen(AppScreen.TRANSACTION_HISTORY)}
              />
              <div className="p-3 flex-1 overflow-y-auto no-scrollbar pb-24 min-h-0">
                <div className="bg-white rounded-[16px] p-3 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                  {/* Status Badge */}
                  <div
                    className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 ${selectedTx.status === "Success" ? "bg-green-100 text-green-700" : selectedTx.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                  >
                    {selectedTx.status}
                  </div>

                  {/* Big Amounts */}
                  <h2 className="text-xl font-black text-gray-900 mb-0.5">
                    <PrivacyText hide={hideBalance}>
                      {selectedTx.fiatAmount}
                    </PrivacyText>
                  </h2>
                  {selectedTx.cryptoAmount !== "N/A" && (
                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-6">
                      <PrivacyText hide={hideBalance}>
                        {selectedTx.cryptoAmount}
                      </PrivacyText>
                    </p>
                  )}

                  {/* Transaction Progress */}
                  <div className="w-full bg-gray-50 rounded-xl p-4 text-left border border-gray-100 mb-4">
                    <h3 className="text-[11px] font-black text-gray-900 mb-4">
                      {selectedTx.status === "Success"
                        ? "Completed"
                        : "In Progress"}
                    </h3>
                    <div className="pl-8">
                      {/* Step 1 */}
                      <div className="relative pb-5">
                        <div
                          className={`absolute -left-[21px] top-6 bottom-0 w-0.5 ${selectedTx.status === "Success" || selectedTx.status === "Pending" ? "bg-green-500" : "bg-gray-200"}`}
                        ></div>
                        <div className="absolute -left-[32px] top-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                          1
                        </div>
                        <p className="text-[11px] font-bold text-gray-900 leading-tight">
                          {selectedTx.type.includes("Gift Card")
                            ? `Incoming transfer of ${selectedTx.cryptoAmount}`
                            : selectedTx.type.includes("Withdrawal")
                              ? `Withdrawal request of ${selectedTx.fiatAmount}`
                              : `Initiated ${selectedTx.type}`}
                        </p>
                        <p className="text-[9px] font-medium text-gray-500 mt-0.5">
                          {selectedTx.time}
                        </p>
                      </div>

                      {/* Step 2 */}
                      <div className="relative pb-5">
                        <div
                          className={`absolute -left-[21px] top-6 bottom-0 w-0.5 ${selectedTx.status === "Success" ? "bg-green-500" : "bg-gray-200"}`}
                        ></div>
                        <div
                          className={`absolute -left-[32px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${selectedTx.status === "Success" || selectedTx.status === "Pending" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                        >
                          2
                        </div>
                        <p className="text-[11px] font-bold text-gray-900 leading-tight">
                          {selectedTx.type.includes("Gift Card")
                            ? `Converted ${selectedTx.cryptoAmount} to ${selectedTx.fiatAmount}`
                            : selectedTx.type.includes("Withdrawal")
                              ? `Processing ${selectedTx.fiatAmount}`
                              : `Processing transaction`}
                        </p>
                        <p className="text-[9px] font-medium text-gray-500 mt-0.5">
                          {selectedTx.time}
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="relative">
                        <div
                          className={`absolute -left-[32px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${selectedTx.status === "Success" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                        >
                          3
                        </div>
                        <p className="text-[11px] font-bold text-gray-900 leading-tight">
                          {selectedTx.type.includes("Gift Card")
                            ? `${selectedTx.fiatAmount} has been received`
                            : selectedTx.type.includes("Withdrawal")
                              ? `Sent to ${selectedTx.bankName}`
                              : `Transaction ${selectedTx.status.toLowerCase()}`}
                        </p>
                        <p className="text-[9px] font-medium text-gray-500 mt-0.5">
                          {selectedTx.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Destination Account */}
                  {selectedTx.bankName !== "N/A" && (
                    <div className="w-full bg-gray-50 rounded-xl p-2.5 text-left border border-gray-100 mb-4">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                        Destination Account
                      </p>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-bold text-gray-900">
                          {selectedTx.bankName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-mono text-gray-600">
                          {selectedTx.accountNumber}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Funding Source (Auto-Swap) */}
                  {selectedTx.fundingSource && (
                    <div className="w-full bg-gray-50 rounded-xl p-3 text-left border border-gray-100 mb-4">
                      <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Funding Source (Auto-Swap)
                      </p>
                      {selectedTx.fundingSource.map(
                        (source: { asset: string; amount: string }, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center mb-1 last:mb-0"
                          >
                            <span className="text-[10px] font-bold text-gray-600">
                              {source.asset}
                            </span>
                            <span className="text-[10px] font-black text-gray-900">
                              {source.amount}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Breakdown */}
                  <div className="w-full space-y-2">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400 text-[9px] font-medium">
                        Reference
                      </span>
                      <span className="text-gray-900 text-[9px] font-bold font-mono">
                        {selectedTx.ref}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400 text-[9px] font-medium">
                        Method / Network
                      </span>
                      <span className="text-gray-900 text-[9px] font-bold">
                        {selectedTx.network}
                      </span>
                    </div>

                    {selectedTx.coinName && (
                      <>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-400 text-[9px] font-medium">
                            Coin Name
                          </span>
                          <span className="text-gray-900 text-[9px] font-bold">
                            {selectedTx.coinName}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-400 text-[9px] font-medium">
                            Amount (Units)
                          </span>
                          <span className="text-gray-900 text-[9px] font-bold">
                            {selectedTx.unitAmount}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-400 text-[9px] font-medium">
                            Transaction Date
                          </span>
                          <span className="text-gray-900 text-[9px] font-bold">
                            {selectedTx.date}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-50">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400 text-[9px] font-medium">
                              Service Fee
                            </span>
                            <button
                              onClick={() =>
                                showToast("Fee: 1% (Capped at $10)")
                              }
                              className="text-gray-300 hover:text-primary transition-colors"
                            >
                              <svg
                                className="w-2.5 h-2.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          </div>
                          <span className="text-gray-900 text-[9px] font-bold">
                            {selectedTx.platformFee}
                          </span>
                        </div>
                        {selectedTx.explorerLink && (
                          <div className="flex justify-between py-1 border-b border-gray-50">
                            <span className="text-gray-400 text-[9px] font-medium">
                              Blockchain Record
                            </span>
                            <a
                              href={selectedTx.explorerLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary text-[9px] font-bold underline"
                            >
                              View on Explorer
                            </a>
                          </div>
                        )}
                      </>
                    )}

                    {!selectedTx.coinName && (
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400 text-[9px] font-medium">
                            Platform Fee
                          </span>
                          <button
                            onClick={() =>
                              showToast("Standard platform processing fee")
                            }
                            className="text-gray-300 hover:text-primary transition-colors"
                          >
                            <svg
                              className="w-2.5 h-2.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                        </div>
                        <span className="text-green-600 text-[9px] font-bold">
                          {selectedTx.platformFee}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 text-[10px] font-medium">
                          Provider Fee
                        </span>
                        <button
                          onClick={() =>
                            showToast("Fee charged by the provider")
                          }
                          className="text-gray-300 hover:text-primary transition-colors"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      <span className="text-gray-900 text-[10px] font-bold">
                        {selectedTx.networkFee}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-400 text-[10px] font-medium">
                        Exchange Rate
                      </span>
                      <span className="text-gray-900 text-[10px] font-bold">
                        {selectedTx.exchangeRate}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-400 text-[10px] font-medium">
                        Date & Time
                      </span>
                      <span className="text-gray-900 text-[10px] font-bold">
                        {selectedTx.date}, {selectedTx.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1 !h-10 !bg-red-50 !text-red-500 !border-red-100 text-xs w-full"
                    onClick={() => setScreen(AppScreen.REPORT_BUG)}
                  >
                    Report Issue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      /* ==========================================================================================
         6) REWARDS SCREEN
         ========================================================================================== */
      case AppScreen.REWARDS:
        return <RewardsScreen />;





      case AppScreen.SCANNER:
        return (
          <div className="flex-1 flex flex-col bg-black animate-fade-in items-center relative overflow-hidden w-full h-full min-h-0">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex flex-col gap-4 z-20">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    goBack();
                    setScannerError(null);
                  }}
                  className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10">
                  <button
                    onClick={() => setScannerTab("scan")}
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${scannerTab === "scan" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
                  >
                    Scan
                  </button>
                  <button
                    onClick={() => setScannerTab("receive")}
                    className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${scannerTab === "receive" ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
                  >
                    My QR
                  </button>
                </div>

                <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                  <Icons.Zap className="w-4 h-4" />
                </div>
              </div>
            </div>

            {scannerTab === "scan" ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                    {!scannerError ? (
                      <Scanner
                        onScan={(result) => {
                          if (result && result.length > 0) {
                            const scannedValue = result[0].rawValue;
                            let recipient = scannedValue;
                            let type:
                              | "address"
                              | "gogreen_id"
                              | "email"
                              | "username" = "address";

                            if (scannedValue.startsWith("gogreen:")) {
                              recipient = scannedValue.replace("gogreen:", "");
                              type = "gogreen_id";
                            } else if (scannedValue.includes("@")) {
                              type = "email";
                            } else if (/^\+?\d+$/.test(scannedValue)) {
                              type = "username"; // Treat phone numbers as username/id for now
                            } else {
                              type = "gogreen_id";
                            }

                            setSendRecipient(recipient);
                            setSendRecipientType(type);
                            setScreen(AppScreen.SEND_RECIPIENT);
                            showToast(
                              "success",
                              "QR Code Scanned",
                              "Recipient details filled.",
                            );
                          }
                        }}
                        onError={(error) => {
                          console.error("Scanner Error:", error);
                          const errorMsg =
                            error instanceof Error
                              ? error.message
                              : String(error);
                          setScannerError(errorMsg);
                          if (
                            errorMsg.includes("Permission") ||
                            errorMsg.includes("dismissed") ||
                            errorMsg.includes("NotAllowedError")
                          ) {
                            showToast(
                              "error",
                              "Camera Access Required",
                              "Please allow camera access in your browser settings to use the scanner.",
                            );
                          } else {
                            showToast(
                              "error",
                              "Scanner Error",
                              "Could not access camera. Please check your settings.",
                            );
                          }
                        }}
                        constraints={{
                          facingMode: isBackCamera ? "environment" : "user",
                        }}
                        components={{
                          finder: false,
                        }}
                        styles={{
                          container: { width: "100%", height: "100%" },
                          video: { objectFit: "cover" },
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-2">
                          <Icons.Alert className="w-8 h-8" />
                        </div>
                        <h3 className="text-white font-bold">Camera Error</h3>
                        <p className="text-white/60 text-xs max-w-[240px]">
                          {scannerError.includes("Permission") ||
                          scannerError.includes("dismissed") ||
                          scannerError.includes("NotAllowedError")
                            ? "Camera access was denied. Please allow camera access in your browser settings and try again."
                            : "Could not access the camera. Please ensure no other app is using it and try again."}
                        </p>
                        <Button
                          onClick={() => setScannerError(null)}
                          className="mt-4"
                        >
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
                  <p className="text-white/60 text-[9px] font-medium text-center max-w-[180px]">
                    Align the QR code within the frame to pay instantly
                  </p>
                  <div className="flex gap-5">
                    <button className="flex flex-col items-center gap-1.5 group">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-active:scale-90 transition-transform border border-white/5">
                        <div className="w-4.5 h-4.5">
                          <Icons.Image />
                        </div>
                      </div>
                      <span className="text-[8px] text-white/60 font-black uppercase tracking-widest group-hover:text-white transition-colors">
                        Gallery
                      </span>
                    </button>
                    <button className="flex flex-col items-center gap-1.5 group">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-active:scale-90 transition-transform border border-white/5">
                        <div className="w-4.5 h-4.5">
                          <Icons.Zap />
                        </div>
                      </div>
                      <span className="text-[8px] text-white/60 font-black uppercase tracking-widest group-hover:text-white transition-colors">
                        Flash
                      </span>
                    </button>
                    <button
                      onClick={() => setIsBackCamera(!isBackCamera)}
                      className="flex flex-col items-center gap-1.5 group"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-active:scale-90 transition-transform border border-white/5">
                        <div className="w-4.5 h-4.5">
                          <Icons.Refresh />
                        </div>
                      </div>
                      <span className="text-[8px] text-white/60 font-black uppercase tracking-widest group-hover:text-white transition-colors">
                        Switch
                      </span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 w-full flex flex-col items-center justify-center p-4 pt-16 bg-gray-50">
                <div className="bg-white p-5 rounded-[20px] shadow-2xl flex flex-col items-center gap-3 w-full max-w-xs animate-scale-in relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-green-400 to-primary"></div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
                      <img
                        src={
                          signupData.profileImage ||
                          getAvatarUrl(signupData.username || "hassan")
                        }
                        className="w-full h-full object-cover"
                        alt="Avatar"
                      />
                    </div>
                    <h3 className="text-base font-black text-gray-900 tracking-tight">
                      {signupData.username || "User"}
                    </h3>
                    <p className="text-[9px] text-gray-400 font-medium">
                      Scan to pay me directly
                    </p>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <QRCode
                      value={`gogreen:${signupData.username || "user"}`}
                      size={150}
                      level="H"
                      fgColor="#000000"
                      bgColor="#FFFFFF"
                    />
                  </div>

                  <div className="w-full flex gap-2.5">
                    <Button
                      variant="outline"
                      className="flex-1 !text-[9px] !h-8"
                      onClick={() =>
                        copyToClipboard(
                          `gogreen:${signupData.username}`,
                          "Wallet address copied!",
                        )
                      }
                    >
                      Copy ID
                    </Button>
                    <Button
                      className="flex-1 !text-[9px] !h-8"
                      onClick={() => {
                        if (navigator.share) {
                          navigator
                            .share({
                              title: "My GoGreen QR Code",
                              text: `Scan my QR code to send me money! My username is ${signupData.username}`,
                              url: window.location.href,
                            })
                            .catch(console.error);
                        } else {
                          showToast("Sharing is not supported on this device");
                        }
                      }}
                    >
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
                    <h3 className="text-base font-black text-gray-900">
                      Confirm Payment
                    </h3>
                    <button
                      onClick={() => setShowScanPaymentModal(false)}
                      className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-[16px] mb-3 border border-gray-100">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
                      🏪
                    </div>
                    <div>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                        Paying to
                      </p>
                      <p className="text-sm font-black text-gray-900">
                        {scannedData?.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-5">
                    <Input
                      label="Amount (GG)"
                      placeholder="0.00"
                      value={scanAmount}
                      onChange={(e) => setScanAmount(e.target.value)}
                      prefix="GG"
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
                      setOnPinSuccess(() => () => {
                        setGlobalLoadingMessage("Processing Payment...");
                        setIsGlobalLoading(true);
                        setTimeout(() => {
                          setIsGlobalLoading(false);
                          setShowScanPaymentModal(false);
                          setScanAmount("");
                          setScreen(AppScreen.SEND_SUCCESS); // Reuse success screen or create new one
                          showToast(
                            `Paid GG${scanAmount || "0"} to ${scannedData?.name}`,
                          );
                        }, 2000);
                      });
                      setOnPinCancel(
                        () => () =>
                          showToast(
                            "error",
                            "Cancelled",
                            "Action cancelled due to user inability to verify action",
                          ),
                      );
                      setPinMode("verify");
                      setShowPinModal(true);
                    }}
                    disabled={!scanAmount}
                    className="!h-10 !text-xs"
                  >
                    Pay GG{scanAmount || "0.00"}
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
        return (
          <div className="flex-1 flex flex-col bg-gray-50 items-center justify-center p-4">
               <p className="text-gray-500 font-bold mb-2">Feature coming soon</p>
               <Button onClick={() => setScreen(previousScreen || AppScreen.HOME)}>Go Back</Button>
          </div>
        );

      case AppScreen.SUGGESTION_BOX:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader title="Feedback" subtitle="Suggestion Box" />
              <div className="p-3">
                <h2 className="text-base font-black mb-1.5 text-gray-900">
                  We're listening.
                </h2>
                <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                  Have an idea? Found a bug? Let us know how we can improve
                  Gogreen for you.
                </p>
                <textarea
                  className="w-full h-28 p-3.5 rounded-[16px] bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-[11px] font-bold resize-none mb-3 text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-300"
                  placeholder="Type your suggestion here..."
                ></textarea>
                <Button
                  onClick={goBack}
                  className="!h-9 !text-xs"
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          </div>
        );

      case AppScreen.REPORT_BUG:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader
                title="Support"
                subtitle="Report a Bug"
                onBack={goBack}
              />
              <div className="p-4">
                <div className="bg-red-50 p-3 rounded-[20px] border border-red-100 flex gap-3 items-start mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-lg shrink-0 p-1.5 text-red-500">
                    <Icons.Bug />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900 text-xs">
                      Found an issue?
                    </h3>
                    <p className="text-[10px] text-red-700/80 leading-relaxed mt-0.5">
                      Please describe the bug in detail so our engineering team
                      can fix it as soon as possible.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Issue Subject"
                    value={bugReport.subject}
                    onChange={(e) =>
                      setBugReport({ ...bugReport, subject: e.target.value })
                    }
                    placeholder="e.g. App crashes on login"
                    variant="glass-light"
                    className="!h-10 !text-sm"
                    inputClassName="!text-gray-900"
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                      Description
                    </label>
                    <textarea
                      value={bugReport.description}
                      onChange={(e) =>
                        setBugReport({
                          ...bugReport,
                          description: e.target.value,
                        })
                      }
                      className="w-full h-32 p-4 rounded-[24px] bg-gray-50 border border-gray-200 focus:outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-xs font-bold resize-none text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-300"
                      placeholder="Describe what happened..."
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Screenshot (Optional)
                    </label>
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
                      <div
                        className={`w-full p-3 rounded-[20px] border border-dashed ${uploadedFile ? "border-primary bg-primary/5" : "border-gray-300 bg-gray-50"} flex items-center justify-center gap-2 transition-all`}
                      >
                        {uploadedFile ? (
                          <>
                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={uploadedFile}
                                className="w-full h-full object-cover"
                                alt="Preview"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-primary">
                              Image Attached
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setUploadedFile(null);
                              }}
                              className="z-20 p-1 bg-white rounded-full shadow-sm text-red-500"
                            >
                              <Icons.Trash />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="text-gray-400">
                              <Icons.Image />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">
                              Tap to upload screenshot
                            </span>
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
                      setBugReport({ subject: "", description: "" });
                      goBack();
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

      case AppScreen.REFERRAL:
        return <ReferralScreen onBack={goBack} />;

      case AppScreen.ME:
        return (
          <MeScreen
            signupData={signupData}
            currency={currency}
            setCurrency={setCurrency}
            walletBalance={walletBalance}
            pendingBalance={pendingBalance}
            onNavigate={handleProtectedNavigation}
            hideBalance={hideBalance}
          />
        );

      case AppScreen.NOTIFICATIONS:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader title="Notifications" subtitle="Alerts" onBack={goBack} />
              <div className="p-3 space-y-2.5 flex-1 pb-24 overflow-y-auto no-scrollbar">
                {notifications.length > 0 ? (
                  <>
                    {notifications.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => {
                          markNotificationAsRead(note.id);
                          if (note.target) {
                              if (note.txId) {
                                const tx = Constants.TRANSACTIONS.find(
                                  (t) => t.id === note.txId,
                                );
                                if (tx) setSelectedTx(tx);
                              }
                              if (note.chatId) {
                                setSelectedChatId(note.chatId);
                              } else {
                                setSelectedChatId(undefined);
                              }
                              setScreen(note.target);
                            }
                          }}
                          className={`p-3.5 rounded-[16px] shadow-sm border flex gap-3 items-start cursor-pointer active:scale-[0.98] transition-all ${
                            note.unread 
                              ? "bg-green-50/50 border-primary/20 hover:border-primary/40" 
                              : "bg-white border-gray-100 hover:border-primary/30"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center p-2 relative ${note.type === "security" ? "bg-red-50 text-red-500" : note.type === "reward" ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"}`}
                          >
                            {note.unread && (
                              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white" />
                            )}
                            <div className="w-4 h-4">
                              {note.type === "security" ? (
                                <Icons.Shield />
                              ) : note.type === "reward" ? (
                                <Icons.Gift />
                              ) : (
                                <Icons.Wallet />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-0.5">
                              <h4 className={`font-black text-[11px] ${note.unread ? "text-primary" : "text-gray-900"}`}>
                                {note.title}
                              </h4>
                              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                {note.time}
                              </span>
                            </div>
                            <p className={`text-[10px] leading-relaxed font-medium ${note.unread ? "text-gray-900" : "text-gray-500"}`}>
                              {note.desc}
                            </p>
                          </div>
                        </div>
                    ))}
                    <div className="flex justify-center w-full">
                      <Button
                        variant="ghost"
                        className="mt-2 text-[10px] !h-8 font-black uppercase tracking-widest"
                        onClick={() => {
                          markAllNotificationsAsRead();
                          showToast("All marked as read");
                        }}
                      >
                        MARK ALL AS READ
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                    <EmptyState 
                      title="All Caught Up"
                      description="You have no new notifications at the moment."
                      icon={<Icons.Bell className="w-8 h-8 text-gray-300 relative z-10" />}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case AppScreen.SECURITY:
      case AppScreen.CHANGE_PIN:
        return <SecurityScreen />;

      case AppScreen.ACCOUNT_SETTINGS:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader
                title="Settings"
                subtitle="Preferences"
                onBack={goBack}
              />
              <div className="p-4 space-y-4">
                <div className="bg-white p-4 rounded-[16px] border border-gray-100 shadow-sm">
                  <h3 className="font-black text-gray-900 text-[11px] mb-3 uppercase tracking-wide">
                    Account Limits
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500">
                        Current Level
                      </span>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                        Advanced
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500">
                        Daily Withdrawal
                      </span>
                      <span className="text-[10px] font-black text-gray-900">
                        Unlimited
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-500 w-full"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-gray-500">
                        Daily Crypto Sell
                      </span>
                      <span className="text-[10px] font-black text-gray-900">
                        Unlimited
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-[16px] border border-gray-100 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">
                        Push Notifications
                      </h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">
                        Alerts & Updates
                      </p>
                    </div>
                    <div className="relative inline-block w-9 h-5 align-middle select-none transition duration-200 ease-in">
                      <input
                        type="checkbox"
                        name="toggle"
                        id="notif-toggle"
                        checked={pushNotificationsEnabled}
                        onChange={() =>
                          setPushNotificationsEnabled(!pushNotificationsEnabled)
                        }
                        className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white shadow-sm appearance-none cursor-pointer top-0.5 left-0.5 checked:translate-x-4 transition-transform duration-200 ease-in-out"
                      />
                      <label
                        htmlFor="notif-toggle"
                        className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${pushNotificationsEnabled ? "bg-primary" : "bg-gray-200"}`}
                      ></label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">
                        Hide Balance
                      </h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">
                        hide all balance and transactions
                      </p>
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
                      <label
                        htmlFor="hide-balance-toggle"
                        className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${hideBalance ? "bg-primary" : "bg-gray-200"}`}
                      ></label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">
                        Currency
                      </h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">
                        Default Fiat
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-gray-900">
                      GG
                    </span>
                  </div>
                  <div className="flex items-center justify-between opacity-50">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">
                        Language
                      </h4>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">
                        App Language
                      </p>
                    </div>
                    <span className="text-[10px] font-black text-gray-900">
                      English (UK)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case AppScreen.EDIT_PROFILE:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader
                title="Edit Profile"
                subtitle="Personal Info"
                onBack={goBack}
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-center mb-6 relative">
                  <div className="w-20 h-20 rounded-[24px] overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative">
                    <img
                      src={
                        signupData.profileImage ||
                        getAvatarUrl(signupData.username)
                      }
                      className="w-full h-full object-cover"
                    />
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
                  <p className="text-[8px] text-gray-400 font-bold ml-1 -mt-2">
                    Name cannot be changed after verification.
                  </p>

                  <Input
                    label="Username"
                    value={signupData.username}
                    variant="glass-light"
                    inputClassName="!h-9 !text-xs !text-gray-900"
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        username:
                          "₦" +
                          e.target.value
                            .replace(/-/g, "")
                            .replace(/^₦/, "")
                            .replace(/\s/g, ""),
                      })
                    }
                  />

                  <Input
                    label="Email Address"
                    value={signupData.email}
                    variant="glass-light"
                    inputClassName="!h-9 !text-xs !text-gray-900"
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                  />

                  <Input
                    label="Phone Number"
                    placeholder="+234 803 123 4567"
                    value={signupData.phone || ""}
                    variant="glass-light"
                    inputClassName="!h-9 !text-xs !text-gray-900"
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        phone: e.target.value.replace(/\s/g, ""),
                      })
                    }
                  />
                </div>

                <div className="mt-auto pt-6">
                  <Button
                    onClick={() => {
                      showToast("Profile Updated!");
                      goBack();
                    }}
                    className="!h-9 !text-xs"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case AppScreen.PAYMENT_SETTINGS:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader
                title="Payment Settings"
                subtitle="Preferences"
                onBack={goBack}
                onHome={() => setScreen(AppScreen.HOME)}
              />
              <div className="p-3 flex-1 flex flex-col">
                <div className="bg-white p-3.5 rounded-[16px] border border-gray-100 shadow-sm mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-black text-gray-900 text-xs">
                        Auto-Withdrawal
                      </h3>
                      <p className="text-[9px] text-gray-400">
                        Directly to bank account
                      </p>
                    </div>
                    <button
                      id="tutorial-auto-withdrawal"
                      onClick={() =>
                        setSignupData((prev) => ({
                          ...prev,
                          autoWithdrawToBank: !prev.autoWithdrawToBank,
                        }))
                      }
                      className={`w-9 h-4.5 rounded-full transition-all relative ${signupData.autoWithdrawToBank ? "bg-primary" : "bg-gray-200"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full transition-all ${signupData.autoWithdrawToBank ? "left-5" : "left-0.5"}`}
                      />
                    </button>
                  </div>
                  <p className="text-[8px] text-gray-400 leading-relaxed">
                    When enabled, all crypto sales will be automatically
                    converted to Naira and sent to your default bank account.
                    When disabled, funds are stored in your Gogreen balance.
                  </p>
                </div>

                <div className="mt-auto">
                  <Button
                    onClick={() => {
                      showToast("Settings Saved!");
                      goBack();
                    }}
                    className="!h-9 !text-xs"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case AppScreen.APP_UPDATE:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader
                title="App Update"
                subtitle="Version Info"
                onBack={goBack}
              />
              <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center mb-4 shadow-sm border border-primary/20">
                  <Logo className="w-10 h-10" variant="color" />
                </div>
                <h2 className="text-lg font-black text-gray-900 mb-0.5">
                  Gogreen Crypto
                </h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                  Version 1.0.4 (Build 202)
                </p>

                <div className="bg-white p-4 rounded-[24px] border border-gray-100 w-full mb-6 text-left">
                  <h3 className="font-bold text-gray-900 text-xs mb-3">
                    What's New
                  </h3>
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

                <Button
                  onClick={() => showToast("You are on the latest version")}
                  className="!h-10 !text-xs"
                >
                  Check for Updates
                </Button>
              </div>
            </div>
          </div>
        );

      case AppScreen.DELETE_ACCOUNT:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader
                title="Delete Account"
                subtitle="Danger Zone"
                onBack={goBack}
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="bg-red-50 p-3.5 rounded-[16px] border border-red-100 mb-5 text-center shadow-sm">
                  <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-lg mx-auto mb-2.5">
                    <div className="w-5 h-5">
                      <Icons.Alert />
                    </div>
                  </div>
                  <h3 className="text-base font-black text-red-900 mb-1">
                    Are you sure?
                  </h3>
                  <p className="text-[11px] text-red-800/80 leading-relaxed">
                    This action is permanent and cannot be undone. All your
                    data, transaction history, and remaining wallet balance will
                    be permanently deleted.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    placeholder="DELETE"
                    className="w-full p-2.5 rounded-[12px] bg-white border border-gray-200 focus:outline-none focus:border-red-500 text-xs font-black text-red-500 placeholder:text-gray-300 shadow-sm"
                    onChange={(e) => {
                      if (e.target.value === "DELETE") {
                        showToast("Account Scheduled for Deletion");
                        setTimeout(() => setScreen(AppScreen.LOGIN), 1500);
                      }
                    }}
                  />
                </div>

                <div className="mt-auto flex flex-col gap-1.5">
                  <Button
                    variant="danger"
                    onClick={() => {
                      showToast("Account Scheduled for Deletion");
                      setTimeout(() => setScreen(AppScreen.LOGIN), 1500);
                    }}
                    className="!h-9 !text-xs"
                  >
                    Yes, delete my account
                  </Button>
                  <Button
                    variant="ghost"
                    className="!text-gray-500 !h-9 !text-xs"
                    onClick={goBack}
                  >
                    Cancel, keep my account
                  </Button>
                </div>
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
            onProtectedNavigation={navigate}
            isModal={isModal}
          />
        );

      case AppScreen.WITHDRAW_METHOD:
        return <WithdrawMethodScreen isModal={isModal} />;

      case AppScreen.SEND_TO_GREENTAG:
        return <SendToGreentagScreen isModal={isModal} />;

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
            setGlobalLoadingMessage={setGlobalLoadingMessage}
            setIsGlobalLoading={setIsGlobalLoading}
            showToast={showToast}
            isModal={isModal}
          />
        );

      case AppScreen.GIFT_CARD_TRADE_OPTIONS:
      case AppScreen.GIFT_CARD_LIST:
      case AppScreen.GIFT_CARD_TYPE_SELECTION:
      case AppScreen.GIFT_CARD_COUNTRY:
      case AppScreen.GIFT_CARD_QUANTITY:
      case AppScreen.GIFT_CARD_DETAILS:
      case AppScreen.GIFT_CARD_CONFIRMATION:
      case AppScreen.GIFT_CARD_TRADE_CHAT:
        return <GiftCardScreen isModal={isModal} />;

      case AppScreen.KYC_INTRO:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              {!isModal && (
                <BackHeader
                  title="Identity Verification"
                  subtitle="KYC Level 1"
                  onBack={goBack}
                />
              )}

              {isModal && (
                <div className="px-6 pt-8 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">
                      Identity Verification
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                      KYC Level 1
                    </p>
                  </div>
                  <button
                    onClick={goBack}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
                  >
                    <Icons.X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mb-6 shadow-sm border border-primary/20">
                    <div className="w-10 h-10 text-primary">
                      <Icons.ShieldCheck />
                    </div>
                  </div>
                  <h2 className="text-xl font-black text-gray-900 mb-2">
                    Verify Your Identity
                  </h2>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-8 max-w-[280px]">
                    To comply with financial regulations and protect your
                    account, we need to verify your identity. This process takes
                    less than 2 minutes.
                  </p>

                  <div className="w-full space-y-3 mb-8">
                    {[
                      {
                        icon: <Icons.FileText />,
                        title: "BVN Verification",
                        desc: "Bank Verification Number",
                      },
                      {
                        icon: <Icons.User />,
                        title: "NIN Verification",
                        desc: "National Identity Number",
                      },
                      {
                        icon: <Icons.Camera />,
                        title: "Selfie Verification",
                        desc: "A clear photo of your face",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-white rounded-[20px] border border-gray-100 shadow-sm text-left"
                      >
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary">
                          <div className="w-5 h-5">{item.icon}</div>
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4 flex flex-col items-center">
                  <Button
                    isLoading={isKycLoading}
                    onClick={() => {
                      setIsKycLoading(true);
                      setTimeout(() => {
                        setIsKycLoading(false);
                        setScreen(AppScreen.KYC_BVN);
                      }, 1000);
                    }}
                    className="!h-11 !text-xs"
                  >
                    Start Verification
                  </Button>
                  <p className="text-[9px] text-gray-400 text-center mt-4 font-bold uppercase tracking-widest">
                    Your data is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case AppScreen.KYC_BVN:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader
                title="BVN Verification"
                subtitle="Identity Verification"
                onBack={goBack}
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="bg-blue-50 p-3.5 rounded-[20px] border border-blue-100 mb-6 flex gap-3 shadow-sm">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <div className="w-4 h-4">
                      <Icons.Info />
                    </div>
                  </div>
                  <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                    Dial <span className="font-black">*565*0#</span> on your
                    registered phone number to retrieve your BVN.
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Bank Verification Number (BVN)"
                    placeholder="0123456789"
                    value={kycData.bvn}
                    variant="glass-light"
                    inputClassName="!h-12 !text-sm font-bold tracking-[0.2em]"
                    onChange={(e) =>
                      setKycData({
                        ...kycData,
                        bvn: e.target.value.replace(/\D/g, "").slice(0, 11),
                      })
                    }
                  />
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest ml-1">
                    Must be 11 digits
                  </p>
                </div>

                <div className="mt-auto pt-6 flex flex-col items-center">
                  <Button
                    isLoading={isKycLoading}
                    disabled={kycData.bvn.length !== 11}
                    onClick={() => {
                      setIsKycLoading(true);
                      setTimeout(() => {
                        setIsKycLoading(false);
                        if (kycData.bvn && kycData.nin && kycData.selfie) {
                          setKycData((prev) => ({
                            ...prev,
                            status: "PENDING",
                          }));
                          triggerReview({
                            title: "KYC Verification",
                            message:
                              "Our team is reviewing your identity documents. This usually takes 24-48 hours.",
                            notificationTitle: "KYC Verified",
                            notificationDesc:
                              "Your identity has been successfully verified.",
                            onComplete: () =>
                              setKycData((prev) => ({
                                ...prev,
                                status: "VERIFIED",
                              })),
                            nextScreen: AppScreen.KYC_SUCCESS,
                          });
                        } else {
                          setScreen(AppScreen.HOME);
                        }
                      }, 1000);
                    }}
                    className="!h-11 !text-xs"
                  >
                    Submit BVN
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case AppScreen.KYC_NIN:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader
                title="NIN Verification"
                subtitle="Identity Verification"
                onBack={goBack}
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="bg-blue-50 p-3.5 rounded-[20px] border border-blue-100 mb-6 flex gap-3 shadow-sm">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <div className="w-4 h-4">
                      <Icons.Info />
                    </div>
                  </div>
                  <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                    Enter your 11-digit National Identification Number (NIN).
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="National Identity Number (NIN)"
                    placeholder="0123456789"
                    value={kycData.nin}
                    variant="glass-light"
                    inputClassName="!h-12 !text-sm font-bold tracking-[0.2em]"
                    onChange={(e) =>
                      setKycData({
                        ...kycData,
                        nin: e.target.value.replace(/\D/g, "").slice(0, 11),
                      })
                    }
                  />
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest ml-1">
                    Must be 11 digits
                  </p>
                </div>

                <div className="mt-auto pt-6 flex flex-col items-center">
                  <Button
                    isLoading={isKycLoading}
                    disabled={kycData.nin.length !== 11}
                    onClick={() => {
                      setIsKycLoading(true);
                      setTimeout(() => {
                        setIsKycLoading(false);
                        if (kycData.bvn && kycData.nin && kycData.selfie) {
                          setKycData((prev) => ({
                            ...prev,
                            status: "PENDING",
                          }));
                          triggerReview({
                            title: "KYC Verification",
                            message:
                              "Our team is reviewing your identity documents. This usually takes 24-48 hours.",
                            notificationTitle: "KYC Verified",
                            notificationDesc:
                              "Your identity has been successfully verified.",
                            onComplete: () =>
                              setKycData((prev) => ({
                                ...prev,
                                status: "VERIFIED",
                              })),
                            nextScreen: AppScreen.KYC_SUCCESS,
                          });
                        } else {
                          setScreen(AppScreen.HOME);
                        }
                      }, 1000);
                    }}
                    className="!h-11 !text-xs"
                  >
                    Submit NIN
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case AppScreen.KYC_SELFIE:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <BackHeader
                title="Selfie Verification"
                subtitle="Identity Verification"
                onBack={goBack}
              />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1 flex flex-col items-center justify-center py-6">
                  <div className="relative w-64 h-64 mb-8">
                    {/* Face Guide Overlay */}
                    <div className="absolute inset-0 border-4 border-dashed border-primary/30 rounded-full animate-spin-slow" />
                    <div className="absolute inset-4 border-2 border-primary/20 rounded-full" />

                    <div className="absolute inset-0 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-xl">
                      {kycData.selfie ? (
                        <img
                          src={kycData.selfie}
                          alt="Selfie"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                          <div className="w-20 h-20 mb-2 opacity-20">
                            <Icons.User />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-widest">
                            Position Face Here
                          </p>
                        </div>
                      )}
                    </div>

                    {!kycData.selfie && (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1.5 rounded-full shadow-lg text-[10px] font-black uppercase tracking-widest animate-bounce">
                        Look Straight
                      </div>
                    )}
                  </div>

                  <div className="text-center max-w-[240px]">
                    <h3 className="text-sm font-black text-gray-900 mb-2">
                      Take a clear selfie
                    </h3>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      Ensure your face is well-lit and clearly visible. No
                      glasses or hats.
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-6 flex flex-col items-center gap-3">
                  {!kycData.selfie ? (
                    <Button
                      isLoading={isKycLoading}
                      onClick={() => {
                        setIsKycLoading(true);
                        setTimeout(() => {
                          setIsKycLoading(false);
                          setKycData({
                            ...kycData,
                            selfie: "https://picsum.photos/seed/selfie/400/400",
                          });
                          showToast("Selfie Captured!");
                        }, 1000);
                      }}
                      className="!h-11 !text-xs"
                    >
                      Capture Selfie
                    </Button>
                  ) : (
                    <>
                      <Button
                        isLoading={isKycLoading}
                        onClick={() => {
                          setIsKycLoading(true);
                          setTimeout(() => {
                            setIsKycLoading(false);
                            if (kycData.bvn && kycData.nin && kycData.selfie) {
                              setKycData((prev) => ({
                                ...prev,
                                status: "PENDING",
                              }));
                              triggerReview({
                                title: "KYC Verification",
                                message:
                                  "Our team is reviewing your identity documents. This usually takes 24-48 hours.",
                                notificationTitle: "KYC Verified",
                                notificationDesc:
                                  "Your identity has been successfully verified.",
                                onComplete: () =>
                                  setKycData((prev) => ({
                                    ...prev,
                                    status: "VERIFIED",
                                  })),
                                nextScreen: AppScreen.KYC_SUCCESS,
                              });
                            } else {
                              setScreen(AppScreen.HOME);
                            }
                          }, 1000);
                        }}
                        className="!h-11 !text-xs"
                      >
                        Submit Selfie
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setKycData({ ...kycData, selfie: null })}
                        className="!h-11 !text-xs !text-gray-500"
                      >
                        Retake Photo
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case AppScreen.KYC_SUCCESS:
        return (
          <div className="flex-1 flex flex-col bg-ghost animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
            <div className="w-full max-w-full flex flex-col flex-1 min-h-0">
              <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-[40px] flex items-center justify-center mb-8 animate-epic-bounce shadow-sm border border-primary/20">
                  <div className="w-12 h-12 text-primary">
                    <Icons.ShieldCheck />
                  </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">
                  Verification Submitted!
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed mb-10 max-w-[260px]">
                  Your identity verification documents have been submitted
                  successfully. Our team will review them within 24-48 hours.
                </p>

                <div className="w-full bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm mb-10 text-left">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Status
                    </span>
                    <span className="px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-orange-100">
                      Under Review
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-[11px] text-gray-600 font-medium">
                        BVN Verification Received
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-[11px] text-gray-600 font-medium">
                        NIN Verification Received
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-[11px] text-gray-600 font-medium">
                        Selfie Verification Received
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setScreen(AppScreen.HOME)}
                  className="!h-11 !text-xs"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        );

      default: {
        return (
          <div className="p-20 text-center font-black opacity-20 uppercase tracking-widest">
            Gogreen Hub
          </div>
        );
      }
    }
  };

  const isModal = MODAL_SCREENS.includes(screen);

  return (
    <>
      <div className="h-screen bg-ghost lg:bg-[#eef6e1] flex font-sans overflow-hidden">
        {/* Sidebar / Navbar - Conditional Rendering */}
        {showNavbar && (
          <>
            <FloatingNavBar
              currentScreen={screen}
              activeTab={activeTab}
              onNavigate={(s, isFromNavBar) => {
                if (s === AppScreen.CHAT) {
                  setSupportInitialView("CHAT_HISTORY");
                  handleProtectedNavigation(s, isFromNavBar);
                } else if (s === AppScreen.SUPPORT) {
                  setSupportInitialView("HELP_CENTER");
                  handleProtectedNavigation(s, isFromNavBar);
                } else if (s === AppScreen.TRANSACTION_HISTORY) {
                  navigateToHistory();
                } else handleProtectedNavigation(s, isFromNavBar);
              }}
              disabled={showPinModal}
            />
            <Navbar
              id="nav-bar"
              currentScreen={screen}
              activeTab={activeTab}
              onNavigate={(s, isFromNavBar) => {
                if (s === AppScreen.CHAT) {
                  setSupportInitialView("CHAT_HISTORY");
                  handleProtectedNavigation(s, isFromNavBar);
                } else if (s === AppScreen.SUPPORT) {
                  setSupportInitialView("HELP_CENTER");
                  handleProtectedNavigation(s, isFromNavBar);
                } else if (s === AppScreen.TRANSACTION_HISTORY) {
                  navigateToHistory();
                } else handleProtectedNavigation(s, isFromNavBar);
              }}
              user={signupData}
              hasUnreadNotifications={hasUnreadNotifications}
            />
          </>
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 h-screen relative flex flex-col overflow-hidden ${showNavbar ? "md:pb-0 md:pl-64 lg:pl-0 lg:pt-20" : ""} ${showPinModal ? "pointer-events-none opacity-50" : ""} bg-gray-50/30`}
        >
          <div
            className={`flex-1 w-full flex flex-col relative bg-white overflow-hidden ${isModal ? "scale-[0.98] rounded-[32px] transition-all duration-300" : "scale-100 rounded-none transition-all duration-300"}`}
          >
            <ErrorBoundary>
              {renderScreenContent(isModal ? activeTab : screen)}
            </ErrorBoundary>
          </div>
        </main>

        <BottomSheet
          isOpen={isModal}
          onClose={() => setScreen(activeTab)}
          fullHeight={FULL_HEIGHT_MODALS.includes(screen)}
        >
          {isModal && renderScreenContent(screen)}
        </BottomSheet>

        {/* Global Overlay Layer */}
        {globalOverlay && (
          <div className="fixed inset-0 z-[100] bg-white animate-fade-in">
            <EmptyState
              title="Feature Redirected"
              message="The requested guide is no longer available."
              onAction={() => setGlobalOverlay(null)}
            />
          </div>
        )}

        {/* Transaction PIN Modal - Moved outside main to be on top of everything */}
        <BottomSheet
          isOpen={showPinModal}
          onClose={() => {
            setShowPinModal(false);
            setPinInput("");
            if (onPinCancel) {
              onPinCancel();
              setOnPinCancel(null);
            }
          }}
          title={
            pinMode === "setup"
              ? "Create PIN"
              : pinMode === "confirm"
                ? "Confirm PIN"
                : "Enter PIN"
          }
        >
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.Lock />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">
              {pinMode === "setup"
                ? "Create PIN"
                : pinMode === "confirm"
                  ? "Confirm PIN"
                  : "Enter PIN"}
            </h3>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">
              {pinMode === "setup"
                ? "Set your transaction PIN"
                : pinMode === "confirm"
                  ? "Re-enter your PIN"
                  : "Authorize Transaction"}
            </p>

            <div className="flex gap-3 justify-center mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg font-black transition-all ${pinInput.length > i ? "border-primary bg-primary text-white" : "border-gray-100 bg-gray-50 text-gray-900"}`}
                >
                  {pinInput.length > i ? "•" : ""}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "del"].map((num, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTransactionPinPress(num)}
                  className={`h-12 rounded-xl flex items-center justify-center text-lg font-bold active:scale-90 transition-transform ${num === "" ? "invisible" : num === "del" ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-900 hover:bg-gray-100"}`}
                >
                  {num === "del" ? <Icons.Trash /> : num}
                </button>
              ))}
            </div>
          </div>
        </BottomSheet>

        {/* Global Loading Modal - Placed at the very end to be on top of everything */}
        <BottomSheet isOpen={isGlobalLoading} onClose={() => {}}>
          <LoadingScreen message={globalLoadingMessage} />
        </BottomSheet>

        {/* Support Screen Overlay */}
        {isSupportOpen && (
          <div className="fixed inset-0 z-[100] bg-white flex flex-col">
            <SupportScreen
              initialView={supportInitialView}
              onBack={() => {
                setIsSupportOpen(false);
                setSupportInitialView("HELP_CENTER");
              }}
            />
          </div>
        )}

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
