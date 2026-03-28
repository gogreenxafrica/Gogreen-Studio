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
  { key: 'email', label: 'Email Address', placeholder: 'hassan@example.com', type: 'email' },
  { key: 'fullName', label: 'Full Name', placeholder: 'Hassan Kehinde' },
  { key: 'username', label: 'Choose Username', placeholder: 'kehindevhassan', prefix: '₦' },
  { key: 'referralCode', label: 'Referral Code (Optional)', placeholder: 'CODE123', prefix: '₦-' },
  { key: 'referralSource', label: 'How did you hear about us?', isSourceDropdown: true },
  { key: 'password', label: 'Security Password', placeholder: '••••••••', type: 'password' },
  { key: 'confirmPassword', label: 'Confirm Password', placeholder: '••••••••', type: 'password' },
  { key: 'autoWithdrawToBank', label: 'Payment Preference', isPreference: true }
];

export const ALL_SERVICES = [
  { id: 'receive', label: 'Receive', icon: <Icons.QrCode />, color: 'bg-green-500/10 text-green-600 border-green-500/20', screen: AppScreen.CRYPTO_INVOICE, comingSoon: true },
  { id: 'pay_bills', label: 'Pay Bills', icon: <Icons.Zap />, color: 'bg-gray-500\/10 text-gray-600 border-gray-500\/20', screen: AppScreen.PAY_BILLS, comingSoon: true },
  { id: 'history', label: 'History', icon: <Icons.Refresh />, color: 'bg-green-500/10 text-green-600 border-green-500/20', screen: AppScreen.TRANSACTION_HISTORY, comingSoon: true },
  { id: 'rewards', label: 'Earn Money', icon: <Icons.Gift />, color: 'bg-gray-500\/10 text-gray-600 border-gray-500\/20', screen: AppScreen.REWARDS, comingSoon: true },
  { id: 'rates', label: 'Rates', icon: <Icons.TrendingUp />, color: 'bg-green-500/10 text-green-600 border-green-500/20', screen: AppScreen.RATES, comingSoon: true },
  { id: 'support', label: 'Support', icon: <Icons.Headphones />, color: 'bg-gray-500\/10 text-gray-600 border-gray-500\/20', screen: AppScreen.SUPPORT, comingSoon: true },
];

export const COINS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin Network', rate: 165432000, color: '#F7931A', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', network: 'ERC20', rate: 4540200, color: '#627EEA', address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', network: 'Select Network', rate: 1710, color: '#26A17B', address: '' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', network: 'Select Network', rate: 1710, color: '#2775CA', address: '' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', network: 'Solana Network', rate: 245000, color: '#14F195', address: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH' },
  { id: 'bnb', name: 'Binance Coin', symbol: 'BNB', network: 'BEP20', rate: 1120400, color: '#F3BA2F', address: 'bnb136ns6lfw4zs5hg4n85vdthaad7hq5m4gtkgf23' }
];

export const TRANSACTIONS = [
  { 
    id: 1, 
    type: 'Sold USDT', 
    date: 'Mar 26, 2026', 
    time: '14:28 PM',
    fiatAmount: '₦ 770,920.00', 
    cryptoAmount: '450.53 USDT',
    status: 'Success', 
    ref: 'TX-88291045', 
    icon: <Icons.Coin />, 
    color: '#26A17B',
    network: 'TRC20',
    walletAddress: 'T9yD...zzDX',
    bankName: 'Kuda Bank',
    accountNumber: '20****89',
    platformFee: 'Free',
    networkFee: '1.00 USDT',
    exchangeRate: '₦ 1,710 / USDT',
    coinName: 'Tether',
    unitAmount: '450.53',
    addFundDate: 'Mar 26, 2026, 14:20 PM',
    explorerLink: 'https://tronscan.org/#/transaction/TX-88291045'
  },
  { 
    id: 2, 
    type: 'Amazon Gift Card', 
    date: 'Mar 25, 2026', 
    time: '11:15 AM',
    fiatAmount: '₦ 120,000.00', 
    cryptoAmount: '$100.00', 
    status: 'Success', 
    ref: 'GC-11200399', 
    icon: <Icons.ShoppingBag />, 
    color: '#FF9900',
    network: 'USA Physical',
    walletAddress: 'N/A',
    bankName: 'N/A',
    accountNumber: 'N/A',
    platformFee: '₦ 0.00',
    networkFee: '₦ 0.00',
    exchangeRate: '₦ 1,200 / $'
  },
  { 
    id: 3, 
    type: 'Swap BTC to USDT', 
    date: 'Mar 24, 2026', 
    time: '09:42 AM',
    fiatAmount: '₦ 685,874.50', 
    cryptoAmount: '0.0041 BTC', 
    status: 'Success', 
    ref: 'SW-77382100', 
    icon: <Icons.ArrowLeftRight />, 
    color: '#6366F1',
    network: 'Internal',
    walletAddress: 'N/A',
    bankName: 'N/A',
    accountNumber: 'N/A',
    platformFee: '₦ 100.00',
    networkFee: '0.00005 BTC',
    exchangeRate: '₦ 165,432,000 / BTC',
    coinName: 'Bitcoin',
    unitAmount: '0.0041',
    depositDate: 'Mar 24, 2026, 09:30 AM'
  },
  { 
    id: 4, 
    type: 'Ikeja Electricity', 
    date: 'Mar 23, 2026', 
    time: '16:30 PM', 
    fiatAmount: '₦ 15,000.00', 
    cryptoAmount: '0421***882',
    status: 'Success', 
    ref: 'BP-99283111', 
    icon: <Icons.Zap />, 
    color: '#FACC15',
    network: 'IKEDC',
    walletAddress: 'N/A',
    bankName: 'N/A',
    accountNumber: '0421***882',
    platformFee: '₦ 100.00',
    networkFee: '₦ 0.00',
    exchangeRate: '1:1'
  },
  { 
    id: 5, 
    type: 'Referral Bonus', 
    date: 'Mar 22, 2026', 
    time: '10:15 AM', 
    fiatAmount: '₦ 3,000.00', 
    cryptoAmount: 'User: kehindev',
    status: 'Success', 
    ref: 'RF-8821', 
    icon: <Icons.Gift />, 
    color: '#EC4899',
    network: 'Internal',
    walletAddress: 'N/A',
    bankName: 'N/A',
    accountNumber: 'N/A',
    platformFee: 'Free',
    networkFee: '₦ 0.00',
    exchangeRate: 'N/A'
  },
];

export const NOTIFICATIONS = [
  { id: 1, title: 'KYC Verified', desc: 'Your identity verification is successful. Trade limit increased.', time: '2m ago', type: 'security', target: AppScreen.SECURITY },
  { id: 2, title: 'Gift Card Approved', desc: 'Your Amazon Card ($100) trade was successful. ₦120,000 added.', time: '1h ago', type: 'money', target: AppScreen.TRANSACTION_HISTORY },
  { id: 3, title: 'New Support Message', desc: 'Agent Sarah: I have updated your ticket status.', time: '3h ago', type: 'security', target: AppScreen.CHAT },
  { id: 4, title: 'Referral Bonus', desc: 'You earned ₦3,000 from a new referral! Keep sharing.', time: '5h ago', type: 'reward', target: AppScreen.REWARDS },
];

export const REWARD_HISTORY = [
  { id: 1, type: 'Referral Bonus', date: 'Mar 22', amount: '+ ₦3,000' },
  { id: 2, type: 'Trade Reward', date: 'Mar 24', amount: '+ 50 Pts' },
  { id: 3, type: 'KYC Bonus', date: 'Mar 20', amount: '+ ₦500' },
];

export const VOUCHERS = [
  { id: 1, title: 'Zero Fee Trade', desc: 'On your next USDT sale', color: 'bg-gray-900', minOrderAmount: 5000 },
  { id: 2, title: 'Airtime Bonus', desc: 'Get 5% back on recharge', color: 'bg-primary', minOrderAmount: 1000 },
];

export const RATES = [
  { pair: 'USD / NGN', rate: '1,710', change: '+1.2%', icon: '🇺🇸' },
  { pair: 'GBP / NGN', rate: '2,150', change: '-0.5%', icon: '🇬🇧' },
  { pair: 'EUR / NGN', rate: '1,840', change: '+0.8%', icon: '🇪🇺' },
  { pair: 'USDT / NGN', rate: '1,715', change: '+0.1%', icon: '💵' },
];

export const CHECKLIST_ITEMS = [
  { id: 'fund', title: 'Add money', desc: 'Fund your wallet', completed: false, screen: AppScreen.ADD_MONEY, category: 'Daily' },
  { id: 'airtime', title: 'Buy Airtime', desc: 'Use your 5% bonus voucher', completed: false, screen: AppScreen.PAY_BILLS, category: 'Daily' },
  { id: 'sell_crypto', title: 'Sell Crypto', desc: 'Trade at least once', completed: false, screen: AppScreen.COIN_SELECTION, category: 'Weekly' },
];
