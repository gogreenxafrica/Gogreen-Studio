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
  { key: 'otp', label: 'Verify Email', isOtp: true },
  { key: 'fullName', label: 'Full Name', placeholder: 'Hassan Kehinde' },
  { key: 'username', label: 'Choose Username', placeholder: 'kehindevhassan', prefix: '₦' },
  { key: 'referralCode', label: 'Referral Code (Optional)', placeholder: 'CODE123', prefix: '₦-' },
  { key: 'referralSource', label: 'How did you hear about us?', isSourceDropdown: true },
  { key: 'password', label: 'Security Password', placeholder: '••••••••', type: 'password' },
  { key: 'confirmPassword', label: 'Confirm Password', placeholder: '••••••••', type: 'password' },
  { key: 'nin', label: 'National Identity Number (NIN)', placeholder: '111********', type: 'number' },
  { key: 'selfie', label: 'Take a Selfie', isFileUpload: true },
  { key: 'autoWithdrawToBank', label: 'Payment Preference', isPreference: true },
  { key: 'captcha', label: 'Human Verification' }
];

export const ALL_SERVICES = [
  { id: 'receive', label: 'Receive', icon: <Icons.QrCode />, color: 'bg-green-500/10 text-green-600 border-green-500/20', screen: AppScreen.CRYPTO_INVOICE },
  { id: 'pay_bills', label: 'Pay Bills', icon: <Icons.Zap />, color: 'bg-gray-500\/10 text-gray-600 border-gray-500\/20', screen: AppScreen.PAY_BILLS },
  { id: 'withdraw', label: 'Sell Giftcards', icon: <Icons.Card />, color: 'bg-green-500/10 text-green-600 border-green-500/20', screen: AppScreen.WITHDRAW_MONEY },
  { id: 'history', label: 'History', icon: <Icons.Refresh />, color: 'bg-green-500/10 text-green-600 border-green-500/20', screen: AppScreen.TRANSACTION_HISTORY },
  { id: 'rewards', label: 'Earn Money', icon: <Icons.Gift />, color: 'bg-gray-500\/10 text-gray-600 border-gray-500\/20', screen: AppScreen.REWARDS },
  { id: 'rates', label: 'Rates', icon: <Icons.TrendingUp />, color: 'bg-green-500/10 text-green-600 border-green-500/20', screen: AppScreen.RATES },
  { id: 'support', label: 'Support', icon: <Icons.Headphones />, color: 'bg-gray-500\/10 text-gray-600 border-gray-500\/20', screen: AppScreen.SUPPORT },
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
    date: 'Oct 24, 2023', 
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
    addFundDate: 'Oct 24, 2023, 14:20 PM',
    explorerLink: 'https://tronscan.org/#/transaction/TX-88291045'
  },
  { 
    id: 2, 
    type: 'MTN Airtime', 
    date: 'Oct 23, 2023', 
    time: '10:15 AM',
    fiatAmount: '₦ 2,500.00', 
    cryptoAmount: '0812***890', 
    status: 'Success', 
    ref: 'BP-11200399', 
    icon: <Icons.Phone />, 
    color: '#FACC15',
    network: 'MTN',
    walletAddress: 'N/A',
    bankName: 'N/A',
    accountNumber: '0812***890',
    platformFee: '₦ 0.00',
    networkFee: '₦ 0.00',
    exchangeRate: 'N/A'
  },
  { 
    id: 3, 
    type: 'Sold BTC', 
    date: 'Oct 22, 2023', 
    time: '19:42 PM',
    fiatAmount: '₦ 685,874.50', 
    cryptoAmount: '0.0041 BTC', 
    status: 'Pending', 
    ref: 'TX-77382100', 
    icon: <Icons.Bitcoin />, 
    color: '#F7931A',
    network: 'Bitcoin',
    walletAddress: '1A1z...fNa',
    bankName: 'GTBank',
    accountNumber: '01****45',
    platformFee: '₦ 100.00',
    networkFee: '0.00005 BTC',
    exchangeRate: '₦ 165,432,000 / BTC',
    coinName: 'Bitcoin',
    unitAmount: '0.0041',
    depositDate: 'Oct 22, 2023, 19:30 PM',
    explorerLink: 'https://blockchain.com/btc/tx/TX-77382100'
  },
  { 
    id: 4, 
    type: 'Withdrawal', 
    date: 'Oct 21, 2023', 
    time: '08:30 AM', 
    fiatAmount: '₦ 120,000.00', 
    cryptoAmount: 'Bank Transfer',
    status: 'Success', 
    ref: 'WD-99283111', 
    icon: <Icons.Bank />, 
    color: '#1A5D22',
    network: 'NIP',
    walletAddress: 'N/A',
    bankName: 'First Bank',
    accountNumber: '30****12',
    platformFee: '₦ 25.00',
    networkFee: '₦ 0.00',
    exchangeRate: '1:1'
  },
  { 
    id: 5, 
    type: 'Withdrawal (Auto-Swap)', 
    date: 'Oct 25, 2023', 
    time: '09:15 AM', 
    fiatAmount: '₦ 550,000.00', 
    cryptoAmount: 'Multiple Assets',
    status: 'Success', 
    ref: 'WD-SWAP-8821', 
    icon: <Icons.Bank />, 
    color: '#1A5D22',
    network: 'NIP',
    walletAddress: 'N/A',
    bankName: 'Access Bank',
    accountNumber: '00****12',
    platformFee: '₦ 25.00',
    networkFee: '₦ 0.00',
    exchangeRate: 'Mixed',
    fundingSource: [
      { asset: 'NGN Wallet', amount: '₦ 200,000.00' },
      { asset: 'BTC', amount: '0.0021 BTC' },
      { asset: 'USDT', amount: '1.50 USDT' }
    ]
  },
];

export const NOTIFICATIONS = [
  { id: 1, title: 'Security Alert', desc: 'New login detected from iPhone 13.', time: '2m ago', type: 'security', target: AppScreen.LOGGED_IN_DEVICES },
  { id: 2, title: 'Reward Earned', desc: 'You received 50 points for your last trade.', time: '1h ago', type: 'reward', target: AppScreen.REWARDS },
  { id: 3, title: 'Add Fund Successful', desc: 'Your wallet has been funded with ₦50,000.', time: '5h ago', type: 'money', target: AppScreen.TRANSACTION_DETAILS, txId: 1 },
];

export const REWARD_HISTORY = [
  { id: 1, type: 'Referral Bonus', date: 'Oct 24', amount: '+ ₦3,000' },
  { id: 2, type: 'Trade Reward', date: 'Oct 22', amount: '+ 50 Pts' },
  { id: 3, type: 'Weekly Challenge', date: 'Oct 20', amount: '+ ₦500' },
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
  { id: 'advanced_kyc', title: 'Complete Advanced KYC', desc: 'Unlock unlimited withdrawals', completed: false, screen: AppScreen.KYC_INTRO, category: 'Weekly' },
  { id: 'sell_crypto', title: 'Sell Crypto', desc: 'Trade at least once', completed: false, screen: AppScreen.COIN_SELECTION, category: 'Weekly' },
];
