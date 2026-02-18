
import React, { useState, useEffect } from 'react';
import { AppScreen } from './types';
import { Logo, LogoText } from './components/Logo';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { SkeletonScreen, Skeleton } from './components/Skeleton';
import { Navbar } from './components/Navbar';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pin, setPin] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [isReferralUsed, setIsReferralUsed] = useState<boolean>(false);
  const [isKyced, setIsKyced] = useState<boolean>(false);
  
  const [signupData, setSignupData] = useState({
    username: '', firstName: '', lastName: '', email: '', phone: '', password: '', referralCode: ''
  });

  const [bankData, setBankData] = useState({
    bank: '',
    accountNumber: '',
    accountName: ''
  });

  const coins = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', rate: '96,432.00', color: '#F7931A' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', network: 'ERC20', rate: '2,654.50', color: '#627EEA' },
    { id: 'usdt', name: 'USDT', symbol: 'USDT', network: 'TRC20', rate: '1.00', color: '#26A17B' },
    { id: 'bnb', name: 'BNB BSC', symbol: 'BNB', network: 'BSC (BEP20)', rate: '626.33', color: '#F3BA2F' }
  ];

  useEffect(() => {
    if (screen === AppScreen.SPLASH) {
      const timer = setTimeout(() => {
        setScreen(AppScreen.ONBOARDING_1);
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === AppScreen.WALLET_GEN_LOADING) {
      const timer = setTimeout(() => navigateWithLoading(AppScreen.COIN_SELECTION), 3000);
      return () => clearTimeout(timer);
    }
    if (screen === AppScreen.KYC_LOADING) {
      const timer = setTimeout(() => navigateWithLoading(AppScreen.KYC_SUCCESS), 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const navigateWithLoading = (nextScreen: AppScreen, delay = 800) => {
    setIsLoading(true);
    setTimeout(() => {
      setScreen(nextScreen);
      setIsLoading(false);
    }, delay);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const showNavbar = [
    AppScreen.HOME,
    AppScreen.TRANSACTIONS,
    AppScreen.REWARDS,
    AppScreen.PROFILE
  ].includes(screen);

  if (isLoading && screen !== AppScreen.SPLASH) {
    return <SkeletonScreen type={screen === AppScreen.HOME ? 'home' : 'list'} />;
  }

  return (
    <div className="min-h-screen bg-white flex justify-center overflow-x-hidden font-sans">
      <div className={`w-full max-w-md h-screen relative overflow-hidden flex flex-col ${showNavbar ? 'pb-20' : ''}`}>
        
        {/* TOAST SYSTEM */}
        {toast && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl text-xs font-bold animate-bounce">
            {toast}
          </div>
        )}

        {/* INTERCOM BUTTON (Only on Home) */}
        {screen === AppScreen.HOME && (
          <div className="fixed bottom-24 right-6 w-14 h-14 bg-[#89CE33] rounded-full flex items-center justify-center shadow-lg z-50 animate-pulse cursor-pointer">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
        )}

        {/* SPLASH SCREEN */}
        {screen === AppScreen.SPLASH && (
          <div className="absolute inset-0 z-50 bg-[#0A1A0C] flex flex-col items-center justify-center animate-fade-in overflow-hidden">
             <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                <Logo className="w-32 h-32 relative z-10" variant="primary" />
             </div>
             <LogoText className="mt-4 relative z-10" />
             <div className="mt-12 text-white/40 text-[10px] tracking-[0.2em] uppercase font-bold">Fast. Trusted. Global.</div>
          </div>
        )}

        {/* ONBOARDING SCREENS */}
        {(screen === AppScreen.ONBOARDING_1 || screen === AppScreen.ONBOARDING_2 || screen === AppScreen.ONBOARDING_3) && (
          <div className="flex-1 flex flex-col p-8 animate-slide-up bg-white">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-full aspect-square bg-[#D4D3D3]/10 rounded-[2.5rem] flex items-center justify-center mb-12">
                <Logo className="w-48 h-48 opacity-40" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {screen === AppScreen.ONBOARDING_1 ? 'Sell crypto easily.' : screen === AppScreen.ONBOARDING_2 ? 'Get paid automatically.' : 'Secure and trusted.'}
              </h1>
              <p className="text-gray-500">
                {screen === AppScreen.ONBOARDING_1 ? 'Fastest way to liquidate your digital assets in Nigeria.' : screen === AppScreen.ONBOARDING_2 ? 'Instant settlements to any Nigerian bank account.' : 'Your funds and data are protected with bank-grade security.'}
              </p>
            </div>
            <div className="space-y-4">
              <Button onClick={() => {
                if (screen === AppScreen.ONBOARDING_1) setScreen(AppScreen.ONBOARDING_2);
                else if (screen === AppScreen.ONBOARDING_2) setScreen(AppScreen.ONBOARDING_3);
                else navigateWithLoading(AppScreen.SIGNUP);
              }}>Next</Button>
              <Button variant="ghost" onClick={() => navigateWithLoading(AppScreen.SIGNUP)}>Skip</Button>
            </div>
          </div>
        )}

        {/* SIGNUP */}
        {screen === AppScreen.SIGNUP && (
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar animate-slide-up bg-white pb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 mb-8">Join the Gogreen family today</p>
            <div className="space-y-4">
              <Input label="Username" value={signupData.username} onChange={e => setSignupData({...signupData, username: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" value={signupData.firstName} onChange={e => setSignupData({...signupData, firstName: e.target.value})} />
                <Input label="Last Name" value={signupData.lastName} onChange={e => setSignupData({...signupData, lastName: e.target.value})} />
              </div>
              <Input label="Email" type="email" value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} />
              <Input label="Phone Number" prefix="+234" value={signupData.phone} onChange={e => setSignupData({...signupData, phone: e.target.value})} />
              <Input label="Password" type="password" value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})} />
              <Input label="Referral Code (Optional)" value={signupData.referralCode || ''} onChange={e => setSignupData({...signupData, referralCode: e.target.value})} />
              <Button className="mt-8" onClick={() => {
                if (signupData.referralCode) setIsReferralUsed(true);
                navigateWithLoading(AppScreen.OTP_VERIFICATION);
              }}>Proceed</Button>
            </div>
          </div>
        )}

        {/* OTP VERIFICATION */}
        {screen === AppScreen.OTP_VERIFICATION && (
          <div className="flex-1 p-8 animate-slide-up bg-white">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Email</h1>
            <p className="text-gray-500 mb-12">Enter the 4-digit code sent to your email.</p>
            <div className="flex justify-between gap-4 mb-8">
              {[1,2,3,4].map(i => <div key={i} className="flex-1 h-16 border-2 border-[#D4D3D3] rounded-2xl flex items-center justify-center text-2xl font-bold bg-[#D4D3D3]/10">0</div>)}
            </div>
            <p className="text-xs text-gray-400 text-center mb-12 italic">If you can't find your otp in your inbox. Kindly check your spam or promotions folder.</p>
            <Button onClick={() => navigateWithLoading(AppScreen.ACCOUNT_CREATED)}>Submit</Button>
          </div>
        )}

        {/* SUCCESS CREATED */}
        {screen === AppScreen.ACCOUNT_CREATED && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-white">
            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Congratulations!</h1>
            <p className="text-gray-500 mb-12">Welcome to the Gogreen family. Your account has been created successfully.</p>
            <Button onClick={() => navigateWithLoading(AppScreen.NOTIFICATION_PROMPT)}>Enter</Button>
          </div>
        )}

        {/* NOTIFICATION PROMPT */}
        {screen === AppScreen.NOTIFICATION_PROMPT && (
          <div className="flex-1 p-8 flex flex-col animate-slide-up">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-[#D4D3D3]/20 rounded-full flex items-center justify-center mb-8">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h1>
              <p className="text-gray-500">Allow notifications to receive real-time trade alerts and payout confirmations.</p>
            </div>
            <div className="space-y-4">
              <Button onClick={() => navigateWithLoading(isReferralUsed ? AppScreen.REFERRAL_POPUP : AppScreen.HOME)}>Allow</Button>
              <Button variant="ghost" onClick={() => navigateWithLoading(isReferralUsed ? AppScreen.REFERRAL_POPUP : AppScreen.HOME)}>Later</Button>
            </div>
          </div>
        )}

        {/* REFERRAL POPUP */}
        {screen === AppScreen.REFERRAL_POPUP && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-white">
            <div className="text-6xl mb-6 animate-bounce">🎁</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Gift!</h1>
            <p className="text-gray-500 mb-12">Congratulations! You've won a ₦3,000 welcome bonus for using a referral code.</p>
            <Button onClick={() => setScreen(AppScreen.REWARDS)}>Check Reward</Button>
          </div>
        )}

        {/* HOME DASHBOARD */}
        {screen === AppScreen.HOME && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-white p-6">
            <header className="flex justify-between items-center mb-8">
              <LogoText className="h-6" />
              <div className="flex items-center gap-4">
                 <button className="p-2 border-2 border-accent rounded-full text-gray-600 relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
                 </button>
              </div>
            </header>

            {/* BALANCE CARD */}
            <div className="bg-primary p-6 rounded-[1.5rem] text-white shadow-xl shadow-primary/20 mb-6">
               <p className="opacity-70 text-sm font-medium mb-1">Available Balance</p>
               <h2 className="text-3xl font-bold mb-4">₦0.00</h2>
               <div className="flex gap-4">
                  <button onClick={() => setScreen(AppScreen.GENERATE_WALLETS)} className="flex-1 bg-white text-primary py-3 rounded-xl font-bold text-sm">Sell Crypto</button>
                  <button className="flex-1 bg-white/20 py-3 rounded-xl font-bold text-sm backdrop-blur-sm">Withdraw</button>
               </div>
            </div>

            {/* SETUP CARD */}
            {!isKyced && (
              <div className="border-2 border-accent rounded-[1.5rem] p-6 mb-6">
                 <h3 className="font-bold text-gray-900 mb-1">Complete Account Setup</h3>
                 <p className="text-[10px] text-gray-500 mb-6">Unlock full features & higher limits</p>
                 <div className="space-y-4">
                    {[
                      { l: 'Set Transaction PIN', s: AppScreen.SET_PIN, done: !!pin },
                      { l: 'Add Default Bank', s: AppScreen.ADD_BANK, done: !!bankData.bank },
                      { l: 'KYC Authentication', s: AppScreen.KYC_AUTH, done: false },
                      { l: 'Utility Bill Proof', s: AppScreen.UTILITY_BILL, done: false }
                    ].map((step, i) => (
                      <div key={i} onClick={() => setScreen(step.s)} className="flex items-center justify-between py-2 cursor-pointer active:opacity-50">
                        <div className="flex items-center gap-3">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.done ? 'bg-primary text-white' : 'bg-[#D4D3D3]/30 text-accent'}`}>
                             {step.done ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> : <span className="text-[10px] font-bold">{i+1}</span>}
                           </div>
                           <span className={`text-sm font-medium ${step.done ? 'text-primary' : 'text-gray-600'}`}>{step.l}</span>
                        </div>
                        <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* REFERRAL BANNER */}
            <div className="bg-secondary p-4 rounded-[1.5rem] text-white flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">💰</div>
               <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Earn Daily Rewards</p>
                  <p className="text-xs font-bold">Earn up to ₦20,000 daily by referring friends to trade with Gogreen.</p>
               </div>
            </div>

            {/* ADS SLIDER */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x mb-8">
               {[1,2].map(i => (
                 <div key={i} className="min-w-full snap-center aspect-[16/7] bg-[#D4D3D3]/20 rounded-[1.5rem] flex items-center justify-center text-accent font-bold">
                    Promo Ad Slot {i}
                 </div>
               ))}
            </div>

            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-900">Recent Transactions</h3>
               <button onClick={() => setScreen(AppScreen.TRANSACTIONS)} className="text-primary text-xs font-bold">View All</button>
            </div>
            <div className="flex flex-col items-center justify-center py-8 bg-[#D4D3D3]/10 rounded-[1.5rem]">
               <svg className="w-12 h-12 text-[#D4D3D3] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <p className="text-xs text-gray-400">No transactions yet.</p>
            </div>
          </div>
        )}

        {/* SET PIN SCREEN */}
        {screen === AppScreen.SET_PIN && (
          <div className="flex-1 p-8 animate-slide-up bg-white">
            <header className="mb-12">
               <button onClick={() => setScreen(AppScreen.HOME)} className="w-10 h-10 bg-[#D4D3D3]/20 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
               </button>
               <h1 className="text-2xl font-bold">Set Transaction PIN</h1>
               <p className="text-gray-500 text-sm">Choose a secure 4-digit PIN for your trades.</p>
            </header>
            <div className="flex justify-center gap-6 mb-12">
               {[0,1,2,3].map(i => (
                 <div key={i} className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold ${pin.length > i ? 'border-primary bg-primary/5' : 'border-[#D4D3D3] bg-gray-50'}`}>
                   {pin.length > i ? '•' : ''}
                 </div>
               ))}
            </div>
            <div className="grid grid-cols-3 gap-6">
               {[1,2,3,4,5,6,7,8,9,0].map(n => (
                 <button key={n} onClick={() => pin.length < 4 && setPin(pin + n)} className="h-16 flex items-center justify-center text-xl font-bold border-2 border-[#D4D3D3] rounded-xl active:bg-gray-100">{n}</button>
               ))}
               <button onClick={() => setPin(pin.slice(0, -1))} className="h-16 flex items-center justify-center text-xl font-bold border-2 border-[#D4D3D3] rounded-xl">⌫</button>
            </div>
            <Button className="mt-12" disabled={pin.length < 4} onClick={() => { showToast("PIN Saved Successfully"); setScreen(AppScreen.HOME); }}>Confirm PIN</Button>
          </div>
        )}

        {/* ADD BANK SCREEN */}
        {screen === AppScreen.ADD_BANK && (
          <div className="flex-1 p-8 animate-slide-up bg-white">
            <header className="mb-8">
               <button onClick={() => setScreen(AppScreen.HOME)} className="w-10 h-10 bg-[#D4D3D3]/20 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
               </button>
               <h1 className="text-2xl font-bold">Add Default Bank</h1>
               <p className="text-gray-500 text-sm">Funds will be sent automatically to this account.</p>
            </header>
            <div className="space-y-6">
               <div className="flex flex-col gap-2">
                 <label className="text-sm font-medium text-gray-700">Select Bank</label>
                 <select className="w-full py-4 px-4 border-2 border-[#D4D3D3] rounded-xl focus:border-primary outline-none bg-white">
                    <option>Select your bank</option>
                    <option>Kuda Bank</option>
                    <option>First Bank</option>
                    <option>GT Bank</option>
                 </select>
               </div>
               <Input label="Account Number" value={bankData.accountNumber} onChange={e => setBankData({...bankData, accountNumber: e.target.value})} />
               <Button variant="secondary" onClick={() => setBankData({...bankData, accountName: "JOHN DOE GREEN"})}>Verify Account</Button>
               {bankData.accountName && (
                 <div className="p-4 bg-gray-50 border-2 border-primary rounded-xl">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Account Name</p>
                    <p className="font-bold text-primary">{bankData.accountName}</p>
                 </div>
               )}
               <Button className="mt-8" disabled={!bankData.accountName} onClick={() => { setBankData({...bankData, bank: "Selected Bank"}); setScreen(AppScreen.HOME); showToast("Bank Added Successfully"); }}>Save Bank</Button>
            </div>
          </div>
        )}

        {/* REWARDS SCREEN */}
        {screen === AppScreen.REWARDS && (
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar bg-white">
            <h1 className="text-2xl font-bold mb-6">Rewards & Referrals</h1>
            <div className="bg-secondary p-8 rounded-[1.5rem] text-white shadow-xl shadow-secondary/20 mb-8">
               <p className="opacity-70 text-sm font-medium mb-1">Total Reward Balance</p>
               <h2 className="text-3xl font-bold mb-4">₦{isReferralUsed ? '3,000.00' : '0.00'}</h2>
               <div className="p-4 bg-white/20 rounded-xl flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold uppercase opacity-80">Referral Code</span>
                     <span className="text-sm font-bold">{signupData.username || 'GOGREEN_USER'}</span>
                  </div>
                  <button onClick={() => showToast("Referral Link Copied")} className="text-white text-xs font-bold uppercase">Copy</button>
               </div>
            </div>

            {isReferralUsed && (
              <div className="border-2 border-primary bg-primary/5 p-6 rounded-[1.5rem] mb-8 animate-fade-in">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold">🎁</div>
                    <div>
                       <p className="font-bold text-gray-900">Welcome Voucher</p>
                       <p className="text-[10px] text-primary">Status: Pending Verification</p>
                    </div>
                 </div>
                 <div className="text-xs text-gray-500 mb-6 leading-relaxed">To claim this ₦3,000, trade a total net of $100 within 60 days of registration.</div>
                 <Button onClick={() => {
                   if (!isKyced) showToast("Proof you're authentic: Start by completing your KYC first.");
                   else showToast("Start trading first. Net $100 trade required.");
                 }}>Redeem Reward</Button>
              </div>
            )}

            <h3 className="font-bold text-gray-900 mb-4">How it works</h3>
            <div className="space-y-4">
               {[
                 { t: 'Share your code', d: 'Invite friends using your username as the referral code.' },
                 { t: 'Earn 0.5% Commission', d: 'Once they complete a trade, you instantly get 0.5% of their trade amount.' },
                 { t: 'Withdraw Instantly', d: 'Withdraw your rewards once your balance reaches ₦500.' }
               ].map((step, i) => (
                 <div key={i} className="flex gap-4 p-4 border-2 border-accent rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">{i+1}</div>
                    <div>
                       <p className="font-bold text-gray-900 text-sm">{step.t}</p>
                       <p className="text-xs text-gray-500">{step.d}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* GENERATE WALLETS FLOW */}
        {screen === AppScreen.GENERATE_WALLETS && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8">
              <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">Ready to Trade?</h1>
            <p className="text-gray-500 mb-12">Click below to generate your unique deposit addresses for all supported crypto assets.</p>
            <Button onClick={() => setScreen(AppScreen.WALLET_GEN_LOADING)}>Generate All Wallet Addresses</Button>
            <Button variant="ghost" onClick={() => setScreen(AppScreen.HOME)} className="mt-4">Back to Dashboard</Button>
          </div>
        )}

        {screen === AppScreen.WALLET_GEN_LOADING && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-8"></div>
             <p className="text-primary font-bold animate-pulse">Generating wallet addresses, please wait...</p>
          </div>
        )}

        {/* COIN SELECTION */}
        {screen === AppScreen.COIN_SELECTION && (
          <div className="flex-1 p-6 animate-fade-in flex flex-col overflow-y-auto no-scrollbar bg-white">
            <h1 className="text-2xl font-bold mb-6">Select Coin to Sell</h1>
            <div className="space-y-4">
              {coins.map(coin => (
                <div key={coin.id} onClick={() => { setSelectedCoin(coin); navigateWithLoading(AppScreen.COIN_DETAIL); }} className="flex items-center justify-between p-5 border-2 border-accent rounded-[1.5rem] active:bg-gray-50 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: coin.color }}>{coin.symbol[0]}</div>
                    <div>
                       <p className="font-bold text-gray-900">{coin.name}</p>
                       <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{coin.network}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">${coin.rate}</p>
                    <p className="text-[10px] text-primary font-bold">₦1,360/$</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COIN DETAIL */}
        {screen === AppScreen.COIN_DETAIL && selectedCoin && (
          <div className="flex-1 bg-white animate-slide-up flex flex-col overflow-y-auto no-scrollbar">
            <header className="p-6 border-b border-accent/20 flex items-center">
              <button onClick={() => setScreen(AppScreen.COIN_SELECTION)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h1 className="flex-1 text-center font-bold text-gray-900 pr-10">Sell {selectedCoin.symbol}</h1>
            </header>

            <div className="p-8 flex flex-col items-center">
               <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-accent mb-8 shadow-inner">
                  {/* Simulated QR Code */}
                  <div className="w-48 h-48 bg-white p-2 border-2 border-accent rounded-2xl flex items-center justify-center">
                     <div className="grid grid-cols-8 grid-rows-8 gap-1 w-full h-full opacity-60">
                        {Array.from({length: 64}).map((_, i) => (
                          <div key={i} className={`${Math.random() > 0.5 ? 'bg-gray-900' : 'bg-transparent'} rounded-[1px]`}></div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="w-full bg-[#D4D3D3]/10 rounded-2xl p-4 border-2 border-accent mb-8 relative">
                  <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">{selectedCoin.symbol} ADDRESS ({selectedCoin.network})</p>
                  <div className="flex items-center gap-3">
                     <p className="flex-1 text-sm font-mono break-all text-gray-700">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                     <button onClick={() => showToast("Copied to clipboard. Please verify when pasting to prevent address tampering.")} className="p-3 bg-primary text-white rounded-xl active:scale-95 shadow-lg shadow-primary/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                     </button>
                  </div>
               </div>

               <div className="w-full space-y-4 mb-8">
                  <div className="p-4 bg-orange-50 border-2 border-orange-100 rounded-xl flex gap-3">
                     <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] shrink-0">!</div>
                     <p className="text-[11px] text-orange-800 leading-relaxed">Receive only <span className="font-bold">{selectedCoin.symbol}</span> to this address to get the equivalent into your default bank in minutes. Other assets may be lost.</p>
                  </div>
                  <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl flex gap-3">
                     <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] shrink-0">!</div>
                     <p className="text-[11px] text-red-800 leading-relaxed">Do not send below $5. Every crypto received is charged a 1.5% transaction fee.</p>
                  </div>
               </div>

               <div className="w-full border-t-2 border-accent/20 pt-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500 font-medium">Value</span>
                     <span className="text-gray-900 font-bold">1 {selectedCoin.symbol} = {selectedCoin.rate}$</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500 font-medium">Exchange Rate</span>
                     <span className="text-primary font-bold">₦1,360 per $</span>
                  </div>
               </div>
               <Button className="mt-12" onClick={() => navigateWithLoading(AppScreen.HOME)}>I have sent the coin</Button>
            </div>
          </div>
        )}

        {/* PROFILE SCREEN */}
        {screen === AppScreen.PROFILE && (
          <div className="flex-1 p-6 overflow-y-auto no-scrollbar bg-white">
            <header className="flex items-center gap-4 mb-8">
               <div className="w-16 h-16 bg-primary rounded-[1.2rem] flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-primary/20">
                  {signupData.username?.[0]?.toUpperCase() || 'G'}
               </div>
               <div>
                  <h2 className="text-xl font-bold text-gray-900">{signupData.firstName || 'Green'} {signupData.lastName || 'User'}</h2>
                  <p className="text-sm text-gray-500">@{signupData.username || 'gogreen_user'}</p>
               </div>
            </header>

            <div className="space-y-2">
               {[
                 { l: 'KYC Status', s: AppScreen.KYC_AUTH, val: 'Unverified' },
                 { l: 'Security Settings', s: AppScreen.SECURITY_SETTINGS, val: 'PIN' },
                 { l: 'Linked Bank Accounts', s: AppScreen.LINKED_BANKS, val: bankData.bank ? '1 Bank' : 'None' },
                 { l: 'Suggestion Box', s: AppScreen.SUGGESTION_BOX },
                 { l: 'Report a BUG', s: AppScreen.REPORT_BUG }
               ].map((item, i) => (
                 <div key={i} onClick={() => setScreen(item.s)} className="flex items-center justify-between p-4 border-b border-accent/30 active:bg-gray-50 cursor-pointer">
                    <span className="font-medium text-gray-700">{item.l}</span>
                    <div className="flex items-center gap-2">
                       {item.val && <span className="text-xs font-bold text-primary uppercase bg-primary/5 px-2 py-1 rounded-md">{item.val}</span>}
                       <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                 </div>
               ))}
            </div>

            <button onClick={() => navigateWithLoading(AppScreen.ONBOARDING_1)} className="w-full text-left p-4 text-red-500 font-bold mt-8">Logout</button>
          </div>
        )}

        {/* NAVIGATION BAR */}
        {showNavbar && <Navbar currentScreen={screen} onNavigate={(s) => navigateWithLoading(s)} />}
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
