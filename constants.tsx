import React from 'react';
import { AppScreen } from './types';
import { Icons } from './components/Icons';

export const DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'mail.com'];

export const DEFAULT_AVATARS = [
  // Male placeholders
  '/assets/avatars/male-1.svg',
  '/assets/avatars/male-2.svg',
  '/assets/avatars/male-3.svg',
  '/assets/avatars/male-4.svg',
  // Female placeholders
  '/assets/avatars/female-1.svg',
  '/assets/avatars/female-2.svg',
  '/assets/avatars/female-3.svg',
  '/assets/avatars/female-4.svg'
];

export const SIGNUP_STEPS = [
  { key: 'country', label: 'Country of Residence', isDropdown: true },
  { key: 'email', label: 'Email Address', placeholder: 'johndoe@example.com', type: 'email' },
  { key: 'otp', label: 'Enter OTP', isOtp: true },
  { key: 'fullName', label: 'Full Name', placeholder: 'John Doe' },
  { key: 'username', label: 'Choose Username', placeholder: 'johndoe', prefix: '₦' },
  { key: 'referralSource', label: 'How did you hear about us?', isSourceDropdown: true },
  { key: 'referralCode', label: 'Referral Code (Optional)', placeholder: '₦-CODE' },
  { key: 'password', label: 'Security Password', placeholder: '••••••••', type: 'password' },
  { key: 'confirmPassword', label: 'Confirm Password', placeholder: '••••••••', type: 'password' },
  { key: 'autoWithdrawToBank', label: 'Payment Preference', isPreference: true }
];

export const TAKEN_USERNAMES = ['hassan', 'johndoe', 'admin', 'gogreen', 'vicky', 'nkehyvikky'];

export const ALL_SERVICES = [
  { id: 'pay_bills', label: 'Pay Bills', icon: <Icons.Zap />, color: 'bg-gray-500\/10 text-gray-600 border-gray-500\/20', screen: AppScreen.PAY_BILLS, comingSoon: true },
  { id: 'history', label: 'History', icon: <Icons.Refresh />, color: 'bg-green-500/10 text-green-600 border-green-500/20', screen: AppScreen.TRANSACTION_HISTORY, comingSoon: true },
  { id: 'rewards', label: 'Earn Money', icon: <Icons.Gift />, color: 'bg-gray-500\/10 text-gray-600 border-gray-500\/20', screen: AppScreen.REWARDS, comingSoon: true },
  { id: 'support', label: 'Support', icon: <Icons.Headphones />, color: 'bg-gray-500\/10 text-gray-600 border-gray-500\/20', screen: AppScreen.SUPPORT, comingSoon: true },
];

export const COINS = [
  { id: 'ngn', name: 'Naira', symbol: 'GG', network: 'Greentag Network', rate: 1, color: '#10B981', address: 'GreentagWallet' }
];

export const GIFT_CARDS = [
  { 
    id: 'amazon', name: 'Amazon', color: '#FF9900', icon: '📦',
    regions: [
      { id: 'usa', name: 'USA', minAmount: 25, currency: 'USD', symbol: '$' },
      { id: 'mexican', name: 'Mexican', minAmount: 100, currency: 'PESOS', symbol: '₱' }
    ]
  },
  { 
    id: 'steam', name: 'Steam', color: '#171a21', icon: '🎮',
    regions: [
      { id: 'kenyan', name: 'Kenyan', minAmount: 2000, currency: 'KES', symbol: 'KSh' },
      { id: 'korea', name: 'Korea', minAmount: 0, currency: 'KRW', symbol: '₩' },
      { id: 'india', name: 'India', minAmount: 0, currency: 'INR', symbol: '₹' },
      { id: 'uk', name: 'UK', minAmount: 5, currency: 'GBP', symbol: '£' },
      { id: 'japan', name: 'Japan', minAmount: 0, currency: 'JPY', symbol: '¥' },
      { id: 'eur', name: 'Eur', minAmount: 10, currency: 'EUR', symbol: '€' }
    ]
  },
  { 
    id: 'razer', name: 'Razer Gold', color: '#00FF00', icon: '🐍',
    regions: [
      { id: 'usa', name: 'USA', minAmount: 10, currency: 'USD', symbol: '$' },
      { id: 'brazil', name: 'Brazil', minAmount: 0, currency: 'BRL', symbol: 'R$' }
    ]
  },
  { 
    id: 'nike', name: 'Nike', color: '#000000', icon: '👟',
    regions: [
      { id: 'usa', name: 'USA', minAmount: 50, currency: 'USD', symbol: '$' }
    ]
  },
  { 
    id: 'sephora', name: 'Sephora', color: '#000000', icon: '💄',
    regions: [
      { id: 'usa', name: 'USA', minAmount: 25, currency: 'USD', symbol: '$' }
    ]
  },
  { 
    id: 'itunes', name: 'iTunes', color: '#FA57C1', icon: '🍎',
    regions: [
      { id: 'usa', name: 'USA', minAmount: 10, currency: 'USD', symbol: '$' },
      { id: 'eur', name: 'Eur', minAmount: 10, currency: 'EUR', symbol: '€' },
      { id: 'uk', name: 'UK', minAmount: 10, currency: 'GBP', symbol: '£' },
      { id: 'aud', name: 'Australia', minAmount: 10, currency: 'AUD', symbol: 'A$' },
      { id: 'uae', name: 'UAE', minAmount: 50, currency: 'AED', symbol: 'د.إ' }
    ]
  },
  { 
    id: 'vapor', name: 'Vapor', color: '#000000', icon: '💨',
    regions: [
      { id: 'usa', name: 'USA', minAmount: 10, currency: 'USD', symbol: '$' }
    ]
  },
  { 
    id: 'xbox', name: 'Xbox', color: '#107C10', icon: '🎮',
    regions: [
      { id: 'usa', name: 'USA', minAmount: 10, currency: 'USD', symbol: '$' }
    ]
  },
  { 
    id: 'debit', name: 'Debit Card', color: '#0047BB', icon: '💳',
    isDebit: true,
    prefixes: {
      'Visa': '4748',
      'Mastercard': '5253',
      'American Express': '3751'
    },
    minAmount: 50,
    currency: 'USD',
    symbol: '$'
  },
  { 
    id: 'walmart', name: 'Walmart', color: '#FFC220', icon: '🛒',
    isPhysicalOnly: true,
    prefixes: ['4020', '5181', '61', '62', '63'],
    minAmount: 0
  },
  { 
    id: 'greendot', name: 'Greendot', color: '#00FF00', icon: '🟢',
    isPhysicalOnly: true,
    prefixes: ['4143'],
    minAmount: 0
  },
  { 
    id: 'milli', name: 'Milli', color: '#000000', icon: '🏦',
    isPhysicalOnly: true,
    prefixes: ['4408'],
    minAmount: 0
  },
  { 
    id: 'go2bank', name: 'GO2BANK', color: '#000000', icon: '🏦',
    isPhysicalOnly: true,
    prefixes: ['4819', '4133'],
    minAmount: 0
  }
];

export const COUNTRIES = [
  { id: 'usa', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', currency: 'CAD', symbol: 'C$' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', currency: 'EUR', symbol: '€' },
  { id: 'france', name: 'France', flag: '🇫🇷', currency: 'EUR', symbol: '€' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', currency: 'AUD', symbol: 'A$' },
];

export const TRANSACTIONS = [
  { 
    id: 0, 
    type: 'Steam Gift Card', 
    date: 'Mar 27, 2026', 
    time: '10:05 AM',
    fiatAmount: 'GG 90,000.00', 
    cryptoAmount: '$100.00', 
    status: 'Failed', 
    ref: 'GC-11200400', 
    icon: <Icons.ShoppingBag />, 
    color: '#EF4444',
    network: 'USA E-code',
    walletAddress: 'N/A',
    bankName: 'N/A',
    accountNumber: 'N/A',
    platformFee: 'GG 0.00',
    networkFee: 'GG 0.00',
    exchangeRate: 'GG 900 / $'
  },
  { 
    id: 1, 
    type: 'Amazon Gift Card', 
    date: 'Mar 26, 2026', 
    time: '14:28 PM',
    fiatAmount: 'GG 120,000.00', 
    cryptoAmount: '$100.00', 
    status: 'Success', 
    ref: 'GC-11200399', 
    icon: <Icons.ShoppingBag />, 
    color: '#FF9900',
    network: 'USA Physical',
    walletAddress: 'N/A',
    bankName: 'N/A',
    accountNumber: 'N/A',
    platformFee: 'GG 0.00',
    networkFee: 'GG 0.00',
    exchangeRate: 'GG 1,200 / $'
  },
  { 
    id: 2, 
    type: 'Bank Withdrawal', 
    date: 'Mar 25, 2026', 
    time: '11:15 AM',
    fiatAmount: 'GG 50,000.00', 
    cryptoAmount: 'N/A', 
    status: 'Pending', 
    ref: 'WD-88291045', 
    icon: <Icons.Bank />, 
    color: '#6366F1',
    network: 'NIP',
    walletAddress: 'N/A',
    bankName: 'Kuda Bank',
    accountNumber: '20****89',
    platformFee: 'GG 50.00',
    networkFee: 'GG 0.00',
    exchangeRate: 'N/A'
  },
  { 
    id: 3, 
    type: 'Transfer to ₦johndoe', 
    date: 'Mar 24, 2026', 
    time: '09:42 AM',
    fiatAmount: 'GG 15,000.00', 
    cryptoAmount: 'N/A', 
    status: 'Success', 
    ref: 'TR-77382100', 
    icon: <Icons.Send />, 
    color: '#10B981',
    network: 'Internal',
    walletAddress: 'N/A',
    bankName: 'Greentag',
    accountNumber: '₦johndoe',
    platformFee: 'Free',
    networkFee: 'GG 0.00',
    exchangeRate: 'N/A'
  },
  { 
    id: 4, 
    type: 'Steam Gift Card', 
    date: 'Mar 23, 2026', 
    time: '16:30 PM', 
    fiatAmount: 'GG 45,000.00', 
    cryptoAmount: '$50.00',
    status: 'Pending', 
    ref: 'GC-99283111', 
    icon: <Icons.ShoppingBag />, 
    color: '#3B82F6',
    network: 'UK E-code',
    walletAddress: 'N/A',
    bankName: 'N/A',
    accountNumber: 'N/A',
    platformFee: 'GG 0.00',
    networkFee: 'GG 0.00',
    exchangeRate: 'GG 900 / $'
  },
  { 
    id: 5, 
    type: 'Bank Withdrawal', 
    date: 'Mar 22, 2026', 
    time: '10:15 AM', 
    fiatAmount: 'GG 200,000.00', 
    cryptoAmount: 'N/A',
    status: 'Success', 
    ref: 'WD-8821', 
    icon: <Icons.Bank />, 
    color: '#6366F1',
    network: 'NIP',
    walletAddress: 'N/A',
    bankName: 'GTBank',
    accountNumber: '01****45',
    platformFee: 'GG 50.00',
    networkFee: 'GG 0.00',
    exchangeRate: 'N/A'
  },
];

export const NOTIFICATIONS = [
  { id: 1, title: 'KYC Verified', desc: 'Your identity verification is successful. Trade limit increased.', time: '2m ago', type: 'security', target: AppScreen.SECURITY, unread: true },
  { id: 2, title: 'Gift Card Approved', desc: 'Your Amazon Card ($100) trade was successful. GG 120,000 added.', time: '1h ago', type: 'money', target: AppScreen.TRANSACTION_DETAILS, txId: 1, unread: false },
  { id: 3, title: 'New Support Message', desc: 'Agent Sarah: I have updated your ticket status.', time: '3h ago', type: 'security', target: AppScreen.CHAT, chatId: 2, unread: true },
];

export const REWARD_HISTORY = [
  { id: 2, type: 'Trade Reward', date: 'Mar 24', amount: '+ 50 Pts' },
  { id: 3, type: 'KYC Bonus', date: 'Mar 20', amount: '+ GG 500' },
];

export const VOUCHERS = [
  { id: 1, title: 'Zero Fee Trade', desc: 'On your next Gift Card sale', color: 'bg-gray-900', minOrderAmount: 5000 },
  { id: 2, title: 'Airtime Bonus', desc: 'Get 5% back on recharge', color: 'bg-primary', minOrderAmount: 1000 },
];

export const RATES = [
  { pair: 'USD / GG', rate: '1,710', change: '+1.2%', icon: '🇺🇸' },
  { pair: 'GBP / GG', rate: '2,150', change: '-0.5%', icon: '🇬🇧' },
  { pair: 'EUR / GG', rate: '1,840', change: '+0.8%', icon: '🇪🇺' },
];

export const CHECKLIST_ITEMS = [
  { id: 'trade_giftcard', title: 'Trade Gift Card', desc: 'Trade at least once', completed: false, screen: AppScreen.GIFT_CARD_TRADE_OPTIONS, category: 'Weekly' },
];
