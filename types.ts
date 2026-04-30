
export enum AppScreen {
  ONBOARDING_1 = 'ONBOARDING_1',
  ONBOARDING_2 = 'ONBOARDING_2',
  ONBOARDING_3 = 'ONBOARDING_3',
  SIGNUP = 'SIGNUP',
  SIGNUP_UNDER_REVIEW = 'SIGNUP_UNDER_REVIEW',
  LOGIN = 'LOGIN',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  OTP_VERIFICATION = 'OTP_VERIFICATION',
  ACCOUNT_CREATED = 'ACCOUNT_CREATED',
  WELCOME_BACK = 'WELCOME_BACK', // New PIN Screen
  
  // Main Tabs
  HOME = 'HOME',
  SERVICES = 'SERVICES',
  PAY_BILLS = 'PAY_BILLS',
  SCANNER = 'SCANNER',
  REWARDS = 'REWARDS',
  ME = 'ME',
  
  // Features
  TRANSACTION_HISTORY = 'TRANSACTION_HISTORY',
  TRANSACTION_DETAILS = 'TRANSACTION_DETAILS',
  NOTIFICATIONS = 'NOTIFICATIONS',
  AIRTIME = 'AIRTIME',
  VIRTUAL_CARD = 'VIRTUAL_CARD',
  BILL_PAYMENT_DETAILS = 'BILL_PAYMENT_DETAILS',
  BILL_PAYMENT_SUMMARY = 'BILL_PAYMENT_SUMMARY',
  SUGGESTION_BOX = 'SUGGESTION_BOX',
  
  ONBOARDING_ADD_BANK = 'ONBOARDING_ADD_BANK',

  // New Screens
  BIOMETRIC_ENABLE = 'BIOMETRIC_ENABLE',
  NOTIFICATION_PERMISSION = 'NOTIFICATION_PERMISSION',
 
  // Me Section
  BANK_DETAILS = 'BANK_DETAILS',
  ADD_BANK = 'ADD_BANK',
  SECURITY = 'SECURITY',
  SECURITY_SETTINGS = 'SECURITY_SETTINGS',
  CHANGE_PIN = 'CHANGE_PIN',
  SUPPORT = 'SUPPORT',
  CHAT = 'CHAT',
  ACCOUNT_SETTINGS = 'ACCOUNT_SETTINGS',
  EDIT_PROFILE = 'EDIT_PROFILE',
  APP_UPDATE = 'APP_UPDATE',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  REPORT_BUG = 'REPORT_BUG',
  WITHDRAW_MONEY = 'WITHDRAW_MONEY',
  WITHDRAW_METHOD = 'WITHDRAW_METHOD',
  SEND_TO_GREENTAG = 'SEND_TO_GREENTAG',
  PAYMENT_SETTINGS = 'PAYMENT_SETTINGS',
  
  // Send Flow
  SEND_DESTINATION = 'SEND_DESTINATION',
  SEND_NEW_RECEIVER = 'SEND_NEW_RECEIVER',
  SEND_GOGREEN_SEARCH = 'SEND_GOGREEN_SEARCH',
  SEND_BANK_ACCOUNT = 'SEND_BANK_ACCOUNT',
  SEND_SELECT_ASSET = 'SEND_SELECT_ASSET',
  SEND_RECIPIENT = 'SEND_RECIPIENT',
  SEND_AMOUNT = 'SEND_AMOUNT',
  SEND_CONFIRM = 'SEND_CONFIRM',
  SEND_SUCCESS = 'SEND_SUCCESS',
  SEND_PROCESSING = 'SEND_PROCESSING',
  SEND_FAILED = 'SEND_FAILED',
  SEND_REJECTED = 'SEND_REJECTED',

  BILL_PAYMENT_SUCCESS = 'BILL_PAYMENT_SUCCESS',
  WITHDRAW_SUCCESS = 'WITHDRAW_SUCCESS',
  WITHDRAW_PROCESSING = 'WITHDRAW_PROCESSING',
  WITHDRAW_FAILED = 'WITHDRAW_FAILED',
  WITHDRAW_REJECTED = 'WITHDRAW_REJECTED',
  UNDER_REVIEW = 'UNDER_REVIEW',

  // Gift Card Flow
  GIFT_CARD_TRADE_OPTIONS = 'GIFT_CARD_TRADE_OPTIONS',
  GIFT_CARD_LIST = 'GIFT_CARD_LIST',
  GIFT_CARD_TYPE_SELECTION = 'GIFT_CARD_TYPE_SELECTION',
  GIFT_CARD_COUNTRY = 'GIFT_CARD_COUNTRY',
  GIFT_CARD_QUANTITY = 'GIFT_CARD_QUANTITY',
  GIFT_CARD_DETAILS = 'GIFT_CARD_DETAILS',
  GIFT_CARD_CONFIRMATION = 'GIFT_CARD_CONFIRMATION',
  GIFT_CARD_TRADE_CHAT = 'GIFT_CARD_TRADE_CHAT',

  // KYC Flow
  KYC_INTRO = 'KYC_INTRO',
  KYC_BVN = 'KYC_BVN',
  KYC_NIN = 'KYC_NIN',
  KYC_SELFIE = 'KYC_SELFIE',
  KYC_SUCCESS = 'KYC_SUCCESS',

  // Referral Flow
  REFERRAL = 'REFERRAL'
}

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  network: string;
  rate: number;
  color: string;
  address: string;
  balance?: number;
}

export interface Transaction {
  id: number;
  type: string;
  date: string;
  time: string;
  fiatAmount: string;
  cryptoAmount: string;
  status: string;
  ref: string;
  icon: any;
  color: string;
  network: string;
  walletAddress: string;
  bankName: string;
  accountNumber: string;
  platformFee: string;
  networkFee: string;
  exchangeRate: string;
  fundingSource?: { asset: string; amount: string }[];
}

export interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: string;
  target?: AppScreen;
  txId?: number;
  chatId?: number;
  unread: boolean;
}

export interface GiftCardRegion {
  id: string;
  name: string;
  minAmount: number;
  currency: string;
  symbol: string;
}

export interface GiftCard {
  id: string;
  name: string;
  color: string;
  icon: string;
  regions?: GiftCardRegion[];
  isDebit?: boolean;
  prefixes?: Record<string, string> | string[];
  minAmount?: number;
  currency?: string;
  symbol?: string;
  isPhysicalOnly?: boolean;
}

export interface SignupData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  referralSource?: string;
  country: string;
  profileImage?: string | null;
  phone?: string;
  autoWithdrawToBank: boolean;
}
