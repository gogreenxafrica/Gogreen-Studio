
import React, { useState, useEffect } from 'react';
import { AppScreen } from './types';
import { Logo, LogoText } from './components/Logo';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { SkeletonScreen } from './components/Skeleton';
import { Navbar } from './components/Navbar';
import { SwipeButton } from './components/SwipeButton';
import { SlideCaptcha } from './components/Captcha';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);
  const [pin, setPin] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
  const [showReferralPopup, setShowReferralPopup] = useState<boolean>(false);
  const [showAuthenticityPopup, setShowAuthenticityPopup] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [hideBalance, setHideBalance] = useState<boolean>(false);
  
  const [isPinSet, setIsPinSet] = useState<boolean>(false);
  const [isBankAdded, setIsBankAdded] = useState<boolean>(false);
  const [isKyced, setIsKyced] = useState<boolean>(true); // Setting true for demoing verified badge

  const [signupStep, setSignupStep] = useState<number>(0);
  const [signupData, setSignupData] = useState({
    username: 'KehindevHassan', firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', referralCode: '', country: 'Nigeria'
  });

  const [bankData, setBankData] = useState({
    accountNumber: '', bankName: '', accountName: 'Fetching name...'
  });

  const coins = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', rate: '96,432.00', color: '#F7931A' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', network: 'ERC20', rate: '2,654.50', color: '#627EEA' },
    { id: 'usdt', name: 'USDT', symbol: 'USDT', network: 'TRC20', rate: '1.00', color: '#26A17B' },
    { id: 'bnb', name: 'BNB BSC', symbol: 'BNB', network: 'BSC (BEP20)', rate: '626.33', color: '#F3BA2F' }
  ];

  const transactions = [
    { id: 1, type: 'Sold USDT', date: '02-04-2024 • 14:28:39', amount: '458.5392 USDT', value: '₦ 770,920', icon: '₮', color: '#26A17B' },
    { id: 2, type: 'Transfer to JAMES A...', date: '02-04-2024 • 14:28:39', amount: '', value: '₦ 250,000', icon: '🏦', color: '#003366' },
    { id: 3, type: 'Sold BTC', date: '02-04-2024 • 14:28:39', amount: '0.00458 BTC', value: '₦ 685,874', icon: '₿', color: '#F7931A' },
    { id: 4, type: 'Sold ETH', date: '02-04-2024 • 14:28:39', amount: '0.0580 ETH', value: '₦ 320,375', icon: 'Ξ', color: '#627EEA' },
  ];

  useEffect(() => {
    if (screen === AppScreen.SPLASH) {
      const timer = setTimeout(() => {
        setScreen(AppScreen.ONBOARDING_1);
        setIsLoading(false);
      }, 3500);
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

  const handleRedeemReward = () => {
    const balance = signupData.referralCode ? 3000 : 0;
    if (balance < 500) {
      showToast("Minimum withdrawal is ₦500");
      return;
    }
    if (!isKyced) {
      showToast("Verification required for withdrawal");
      navigateWithLoading(AppScreen.KYC_AUTH);
      return;
    }
    setShowAuthenticityPopup(true);
  };

  const showNavbar = [
    AppScreen.HOME,
    AppScreen.PAY_BILLS,
    AppScreen.SCANNER,
    AppScreen.REWARDS,
    AppScreen.ME,
    AppScreen.COIN_SELECTION
  ].includes(screen);

  const getSkeletonType = () => {
    switch (screen) {
      case AppScreen.HOME: return 'home';
      case AppScreen.REWARDS: return 'rewards';
      case AppScreen.ME: return 'profile';
      case AppScreen.COIN_SELECTION: return 'list';
      default: return 'list';
    }
  };

  const BackHeader = ({ title, target = AppScreen.HOME, subtitle, theme = 'light', onBack }: { title: string, target?: AppScreen, subtitle?: string, theme?: 'light' | 'dark', onBack?: () => void }) => (
    <header className={`px-6 py-5 sticky top-0 z-20 flex flex-col items-start w-full ${theme === 'dark' ? 'bg-[#0A1A0D]' : 'bg-white border-b border-accent/20'}`}>
      <div className="flex items-center w-full">
        <button onClick={onBack || (() => setScreen(target))} className={`w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-all -ml-2 ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-accent/10 text-primary'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className={`flex-1 text-center font-bold tracking-tight pr-8 text-lg ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>{title}</h1>
      </div>
      {subtitle && <p className={`text-[10px] font-black uppercase tracking-widest text-center w-full mt-2 ${theme === 'dark' ? 'text-white/40' : 'text-accent'}`}>{subtitle}</p>}
    </header>
  );

  const signupSteps = [
    { key: 'username', label: 'Choose a Username', placeholder: 'Unique ID', type: 'text' },
    { key: 'firstName', label: 'What is your First Name?', placeholder: 'John', type: 'text' },
    { key: 'lastName', label: 'What is your Last Name?', placeholder: 'Doe', type: 'text' },
    { key: 'email', label: 'Your Email Address', placeholder: 'name@example.com', type: 'email' },
    { key: 'country', label: 'Country of Residence', fixed: 'Nigeria' },
    { key: 'referralCode', label: 'Have a Referral Code?', placeholder: 'Optional', type: 'text' },
    { key: 'password', label: 'Create Secure Password', placeholder: 'Min 8 characters', type: 'password' },
    { key: 'confirmPassword', label: 'Confirm Your Password', placeholder: 'Repeat password', type: 'password' },
    { key: 'captcha', label: 'Final Step' }
  ];

  const currentStepKey = signupSteps[signupStep].key;
  const isConfirmStep = currentStepKey === 'confirmPassword';
  const passwordsMatch = signupData.password === signupData.confirmPassword;

  const canGoToNextStep = () => {
    if (currentStepKey === 'captcha') return isCaptchaVerified;
    if (currentStepKey === 'country') return true;
    if (currentStepKey === 'referralCode') return true;
    if (currentStepKey === 'confirmPassword') return signupData.confirmPassword.length >= 8 && passwordsMatch;
    const value = (signupData as any)[currentStepKey];
    return value && value.length >= (currentStepKey === 'password' ? 8 : 2);
  };

  const handleNextSignup = () => {
    if (signupStep < signupSteps.length - 1) {
      setSignupStep(signupStep + 1);
    } else {
      navigateWithLoading(AppScreen.OTP_VERIFICATION);
    }
  };

  const handleBackSignup = () => {
    if (signupStep > 0) {
      setSignupStep(signupStep - 1);
    } else {
      setScreen(AppScreen.ONBOARDING_3);
    }
  };

  if (isLoading && screen !== AppScreen.SPLASH) {
    return <SkeletonScreen type={getSkeletonType()} />;
  }

  const MeListItem = ({ icon, label, onClick, subtext }: { icon: string, label: string, onClick?: () => void, subtext?: string }) => (
    <div 
      onClick={onClick} 
      className="p-4 border border-accent/20 bg-white rounded-card flex justify-between items-center cursor-pointer active:scale-[0.98] transition-all hover:bg-accent/5"
    >
      <div className="flex items-center gap-4">
        <span className="text-xl w-6 flex justify-center">{icon}</span>
        <div>
          <span className="font-bold text-primary text-sm tracking-tight">{label}</span>
          {subtext && <p className="text-[10px] text-accent font-medium leading-none mt-1">{subtext}</p>}
        </div>
      </div>
      <svg className="w-4 h-4 text-accent/50" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex justify-center font-sans overflow-x-hidden">
      <div className={`w-full max-w-md h-screen relative overflow-hidden flex flex-col ${showNavbar ? 'pb-24' : ''}`}>
        
        {/* TOAST SYSTEM */}
        {toast && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-primary text-white px-6 py-4 rounded-card shadow-2xl text-[10px] font-black uppercase tracking-widest animate-fade-in border-b-4 border-secondary/50">
            {toast}
          </div>
        )}

        {/* SPLASH SCREEN */}
        {screen === AppScreen.SPLASH && (
          <div className="absolute inset-0 z-50 bg-[#0A1A0D] flex flex-col items-center justify-center animate-fade-in overflow-hidden">
             <Logo className="w-32 h-32 mb-4 relative z-10 animate-pulse" variant="white" />
             <div className="absolute bottom-12 text-accent text-[10px] tracking-[0.6em] font-black uppercase opacity-60">Simply Secure • Fast Payouts</div>
          </div>
        )}

        {/* ONBOARDING SCREENS */}
        {(screen === AppScreen.ONBOARDING_1 || screen === AppScreen.ONBOARDING_2 || screen === AppScreen.ONBOARDING_3) && (
          <div className="flex-1 flex flex-col bg-[#0A1A0D] relative animate-fade-in">
            <div className="h-[60%] w-full relative overflow-hidden flex items-center justify-center p-12">
               <Logo className="w-48 h-48 animate-pulse" variant="white" />
            </div>
            <div className="flex-1 flex flex-col p-8 pt-0 z-10">
              <h1 className="text-3xl font-extrabold text-white mb-4 leading-tight tracking-tight">
                {screen === AppScreen.ONBOARDING_1 ? "Don't wait for address" : 
                 screen === AppScreen.ONBOARDING_2 ? 'Instant Bank Settlements' : 
                 'Unmatched Security Standards'}
              </h1>
              <p className="text-white/60 text-sm font-medium leading-relaxed mb-8">
                {screen === AppScreen.ONBOARDING_1 ? "Complete your kyc and you'd have addresses that is for you and you only." : 
                 screen === AppScreen.ONBOARDING_2 ? 'Receive your funds directly in your Nigerian bank account in minutes.' : 
                 'We use military-grade encryption to protect your assets and personal data.'}
              </p>
              <div className="flex gap-2 mb-10">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${screen === AppScreen.ONBOARDING_1 ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}></div>
                <div className={`h-1.5 rounded-full transition-all duration-300 ${screen === AppScreen.ONBOARDING_2 ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}></div>
                <div className={`h-1.5 rounded-full transition-all duration-300 ${screen === AppScreen.ONBOARDING_3 ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}></div>
              </div>
              <div className="mt-auto space-y-4">
                 {screen === AppScreen.ONBOARDING_3 ? (
                   <SwipeButton text="Swipe to proceed" onComplete={() => navigateWithLoading(AppScreen.SIGNUP)} />
                 ) : (
                   <Button variant="primary" onClick={() => {
                      if (screen === AppScreen.ONBOARDING_1) setScreen(AppScreen.ONBOARDING_2);
                      else if (screen === AppScreen.ONBOARDING_2) setScreen(AppScreen.ONBOARDING_3);
                    }} className="h-16 shadow-2xl">Next</Button>
                 )}
              </div>
            </div>
          </div>
        )}

        {/* AUTH SCREENS */}
        { (screen === AppScreen.LOGIN || screen === AppScreen.SIGNUP || screen === AppScreen.OTP_VERIFICATION || screen === AppScreen.FORGOT_PASSWORD || screen === AppScreen.ACCOUNT_CREATED) && (
          <div className="flex-1 bg-[#0A1A0D] flex flex-col overflow-hidden animate-slide-up">
            {screen !== AppScreen.ACCOUNT_CREATED && (
              <BackHeader onBack={screen === AppScreen.SIGNUP ? handleBackSignup : () => setScreen(AppScreen.SIGNUP)} theme="dark" title="" />
            )}
            <div className="flex-1 px-8 pb-10 flex flex-col overflow-y-auto no-scrollbar">
              {screen === AppScreen.LOGIN && (
                <>
                  <h1 className="text-4xl font-extrabold text-white mb-8 mt-4 tracking-tight">Login</h1>
                  <div className="space-y-4">
                    <Input placeholder="Email or Username" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} />
                    <Input placeholder="Password" type={showPassword ? 'text' : 'password'} value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} />
                    <div className="flex justify-end"><button onClick={() => setScreen(AppScreen.FORGOT_PASSWORD)} className="text-primary text-[11px] font-black uppercase tracking-widest">Forgot Password?</button></div>
                    <Button variant="primary" className="h-16 mt-4" onClick={() => navigateWithLoading(AppScreen.HOME)}>Sign in</Button>
                    <p className="text-center text-white/40 text-sm mt-4">Don't have an account? <span onClick={() => { setScreen(AppScreen.SIGNUP); setSignupStep(0); }} className="text-primary font-bold cursor-pointer">Sign up</span></p>
                  </div>
                </>
              )}
              {screen === AppScreen.FORGOT_PASSWORD && (
                <div className="flex-1 flex flex-col justify-center animate-slide-up h-full">
                  <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Reset Password</h1>
                  <p className="text-white/40 text-sm mb-12">Enter your email and we'll send you instructions to reset your password.</p>
                  <div className="space-y-6">
                    <Input placeholder="name@example.com" type="email" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} />
                    <Button variant="primary" className="h-16 mt-4" onClick={() => { showToast("Reset link sent!"); setScreen(AppScreen.LOGIN); }}>Send Reset Link</Button>
                    <button onClick={() => setScreen(AppScreen.LOGIN)} className="w-full text-white/40 text-[10px] font-black uppercase tracking-widest">Return to Login</button>
                  </div>
                </div>
              )}
              {screen === AppScreen.SIGNUP && (
                <div className="flex-1 flex flex-col">
                  <div className="flex gap-1.5 mb-8 mt-4">
                    {signupSteps.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= signupStep ? 'bg-primary' : 'bg-white/10'}`}></div>)}
                  </div>
                  <div className="flex-1 flex flex-col justify-center animate-slide-up" key={signupStep}>
                    <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight leading-tight">{signupSteps[signupStep].label}</h1>
                    <div className="space-y-6">
                      {signupSteps[signupStep].fixed ? (
                        <div className="w-full py-5 px-6 bg-white/5 border border-white/10 rounded-[24px] text-white font-bold text-lg flex items-center justify-between">
                          <span>{signupSteps[signupStep].fixed}</span>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/20 px-3 py-1 rounded-full border border-primary/30">Active</span>
                        </div>
                      ) : signupSteps[signupStep].key === 'captcha' ? (
                        <SlideCaptcha isVerified={isCaptchaVerified} onVerify={() => setIsCaptchaVerified(true)} />
                      ) : (
                        <div className="space-y-2">
                           <Input 
                            placeholder={signupSteps[signupStep].placeholder} 
                            type={signupSteps[signupStep].type} 
                            value={(signupData as any)[signupSteps[signupStep].key]} 
                            onChange={(e) => setSignupData({...signupData, [signupSteps[signupStep].key]: e.target.value})} 
                           />
                           {isConfirmStep && !passwordsMatch && signupData.confirmPassword.length > 0 && (
                             <div className="bg-white p-5 rounded-[24px] border-l-4 border-accent flex items-center gap-4 animate-shake mt-4 shadow-xl">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                   <p className="text-primary text-[11px] font-black uppercase tracking-[0.1em]">Validation Error</p>
                                   <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Passwords do not match. Please re-check.</p>
                                </div>
                             </div>
                           )}
                        </div>
                      )}
                      
                      <Button variant="primary" className="h-16 mt-8 shadow-primary/20" disabled={!canGoToNextStep()} onClick={handleNextSignup}>
                        {signupStep === signupSteps.length - 1 ? 'Finish Registration' : 'Continue'}
                      </Button>

                      <p className="text-center text-white/40 text-sm mt-8 border-t border-white/5 pt-6">
                        Already have an account? <span onClick={() => setScreen(AppScreen.LOGIN)} className="text-primary font-black cursor-pointer hover:underline uppercase tracking-widest text-[11px] ml-1">Sign in here</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {screen === AppScreen.OTP_VERIFICATION && (
                <div className="flex-1 flex flex-col justify-center animate-slide-up">
                  <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Verify Code</h1>
                  <p className="text-white/40 text-sm mb-12">Enter the verification code sent to your email.</p>
                  <div className="flex justify-between gap-3 mb-12">
                    {[1,2,3,4,5,6].map(i => <div key={i} className="flex-1 aspect-square bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl font-black text-white"><input className="w-full h-full bg-transparent text-center outline-none" maxLength={1} placeholder="-" /></div>)}
                  </div>
                  <Button variant="primary" className="h-16" onClick={() => navigateWithLoading(AppScreen.ACCOUNT_CREATED)}>Continue</Button>
                </div>
              )}
              
              {/* RESTORED CLEAN HIGH-IMPACT CONGRATULATIONS SCREEN */}
              {screen === AppScreen.ACCOUNT_CREATED && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in relative px-8">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] aspect-square bg-primary/10 rounded-full blur-[140px] animate-pulse"></div>
                  
                  <div className="relative mb-14">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/10 rounded-full animate-ping-slow"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/20 rounded-full animate-ping-slow" style={{animationDelay: '0.4s'}}></div>
                    
                    <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(45,164,55,0.4)] animate-epic-bounce relative z-10 border-4 border-white/20">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" strokeWidth="6" viewBox="0 0 24 24">
                        <path className="animate-checkmark-draw" d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <h1 className="text-4xl font-black text-white mb-4 tracking-tight animate-text-pop">Account Ready!</h1>
                  <p className="text-white/60 text-sm font-medium leading-relaxed max-w-[280px] mb-14 animate-slide-up" style={{animationDelay: '0.2s'}}>
                    Welcome to <span className="text-primary font-bold">Gogreen</span>. Your gateway to seamless crypto sales is now active.
                  </p>
                  
                  <Button 
                    variant="primary" 
                    className="h-18 text-base font-black tracking-[0.2em] shadow-2xl animate-slide-up" 
                    style={{animationDelay: '0.4s'}} 
                    onClick={() => navigateWithLoading(AppScreen.HOME)}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HOME SCREEN */}
        {screen === AppScreen.HOME && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#F8F9FA] animate-fade-in pb-10">
            {/* Redesigned Header: Profile to far right with badge */}
            <header className="p-6 flex justify-between items-center">
              <div>
                <h2 className="text-primary font-extrabold text-xl tracking-tight">Hi, @{signupData.username}</h2>
                <p className="text-accent text-[10px] font-bold uppercase tracking-widest mt-0.5">Welcome back</p>
              </div>
              <div className="relative group">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border-2 border-primary/20 shadow-lg active:scale-95 transition-transform cursor-pointer">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${signupData.username}`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                {isKyced && (
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-full border-2 border-[#F8F9FA] shadow-md">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  </div>
                )}
              </div>
            </header>

            <div className="px-6 space-y-6">
              {/* Wallet Balance Card */}
              <div className="bg-[#2DA437] p-8 rounded-[32px] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 400 200"><path fill="none" stroke="currentColor" strokeWidth="20" d="M0 100 Q100 0 200 100 T400 100" /><path fill="none" stroke="currentColor" strokeWidth="15" d="M0 150 Q100 50 200 150 T400 150" /></svg>
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <p className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-2">Wallet balance</p>
                  <div className="flex items-center gap-3 mb-8">
                    <h3 className="text-4xl font-extrabold tracking-tight">₦ {hideBalance ? '********' : '1,326,890.97'}</h3>
                    <button onClick={() => setHideBalance(!hideBalance)} className="opacity-80">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                  </div>
                  <div className="flex gap-4 w-full">
                    <button className="flex-1 h-14 bg-[#3EBA4A] rounded-full flex items-center justify-center gap-2 font-bold text-sm shadow-lg border border-white/10 active:scale-95 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      Transfer
                    </button>
                    <button onClick={() => navigateWithLoading(AppScreen.COIN_SELECTION)} className="flex-1 h-14 bg-white text-primary rounded-full flex items-center justify-center gap-2 font-bold text-sm shadow-lg active:scale-95 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Trade
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo Banner */}
              <div className="bg-[#89CE33] p-6 rounded-[24px] flex items-center gap-4 text-white relative overflow-hidden shadow-lg">
                <div className="flex-1 z-10">
                  <h4 className="text-xl font-black leading-tight mb-1">Out of <span className="text-primary underline">unit?</span></h4>
                  <p className="text-[10px] font-bold leading-tight opacity-90">Top up your electricity with<br/>just few steps....</p>
                </div>
                <div className="w-20 h-20 relative z-10 flex items-center justify-center">
                  <div className="w-16 h-24 bg-white/20 blur-xl absolute"></div>
                  <span className="text-5xl">💡</span>
                </div>
                <div className="absolute top-0 right-0 w-32 h-full bg-white/5 skew-x-12 translate-x-12"></div>
              </div>

              {/* Transaction History Preview */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-primary">Transaction history</h3>
                  <button onClick={() => navigateWithLoading(AppScreen.PAY_BILLS)} className="text-[11px] font-bold text-primary flex items-center gap-1">See all <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
                </div>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="p-4 bg-white rounded-[20px] flex items-center gap-3 shadow-sm border border-accent/10">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-sm" style={{ backgroundColor: tx.color }}>
                        {tx.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-primary text-sm">{tx.type}</h4>
                          <p className="font-bold text-primary text-sm">{tx.value}</p>
                        </div>
                        <div className="flex justify-between items-end mt-1">
                          <p className="text-[9px] font-medium text-accent">{tx.date}</p>
                          <p className="text-[10px] font-bold text-accent">{tx.amount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REWARDS SCREEN */}
        {screen === AppScreen.REWARDS && (
          <div className="flex-1 flex flex-col bg-[#F8F9FA] animate-fade-in">
            <BackHeader title="Rewards" subtitle="Invite & Earn" />
            <div className="p-6 space-y-8">
              <div className="bg-primary p-8 rounded-[32px] text-white text-center shadow-2xl relative overflow-hidden">
                 <h2 className="text-5xl font-black mb-10 tracking-tight">₦{signupData.referralCode ? '3,000.00' : '0.00'}</h2>
                 <Button variant="glass" onClick={handleRedeemReward} className="bg-white/20 !text-white shadow-xl font-black border-white/20">Withdraw Earnings</Button>
              </div>
              <div className="p-6 border-2 border-accent/10 rounded-[32px] bg-white text-center shadow-sm">
                 <p className="text-xs font-bold text-accent uppercase tracking-widest mb-4">Your Referral Link</p>
                 <div className="bg-accent/5 p-4 rounded-2xl border border-accent/20 font-black text-primary text-sm tracking-widest mb-4 uppercase">GOGREEN-REF-889</div>
                 <Button variant="outline" className="h-12 border-primary/20 text-primary">Copy Link</Button>
              </div>
            </div>
          </div>
        )}

        {/* REFINED ME SCREEN */}
        {screen === AppScreen.ME && (
          <div className="flex-1 flex flex-col bg-[#F8F9FA] animate-fade-in">
            <BackHeader title="My Profile" />
            <div className="flex-1 p-6 overflow-y-auto no-scrollbar pb-10">
              {/* Profile Card */}
              <div className="bg-white p-6 rounded-[32px] shadow-sm border border-accent/10 flex items-center gap-6 mb-8">
                 <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-4xl font-black text-primary shadow-inner border border-primary/20 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${signupData.username}`} alt="Me" className="w-full h-full object-cover" />
                 </div>
                 <div className="flex-1">
                    <h2 className="text-2xl font-black text-primary leading-none">@{signupData.username}</h2>
                    <div className="flex items-center gap-1.5 mt-2">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isKyced ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                          {isKyced ? 'Verified' : 'Unverified'}
                       </span>
                    </div>
                 </div>
              </div>

              {/* Sections */}
              <div className="space-y-8">
                {/* Account Section */}
                <div>
                  <h3 className="text-[11px] font-black text-accent uppercase tracking-[0.2em] mb-4 ml-1">Account Management</h3>
                  <div className="space-y-3">
                    <MeListItem icon="🆔" label="KYC Verification" onClick={() => navigateWithLoading(AppScreen.KYC_AUTH)} subtext="Update your identification documents" />
                    <MeListItem icon="📈" label="Account Limits" onClick={() => showToast("Loading limits...")} subtext="View your trading and withdrawal caps" />
                    <MeListItem icon="📜" label="Transaction History" onClick={() => setScreen(AppScreen.PAY_BILLS)} subtext="Full log of your platform activity" />
                    <MeListItem icon="🏦" label="Linked Banks" onClick={() => navigateWithLoading(AppScreen.ADD_BANK)} subtext="Manage withdrawal destinations" />
                  </div>
                </div>

                {/* Security Section */}
                <div>
                  <h3 className="text-[11px] font-black text-accent uppercase tracking-[0.2em] mb-4 ml-1">Security & Privacy</h3>
                  <div className="space-y-3">
                    <MeListItem icon="🔢" label="Change Payment PIN" onClick={() => navigateWithLoading(AppScreen.SET_PIN)} />
                    <MeListItem icon="🔐" label="Change Login Password" onClick={() => navigateWithLoading(AppScreen.FORGOT_PASSWORD)} />
                    <div className="p-4 border border-accent/20 bg-white rounded-card space-y-4 shadow-sm">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                             <span className="text-xl w-6 flex justify-center">🖐️</span>
                             <span className="font-bold text-primary text-sm tracking-tight">Login with Biometrics</span>
                          </div>
                          <div className="w-10 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                             <div className="w-4 h-4 bg-white rounded-full translate-x-4"></div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                             <span className="text-xl w-6 flex justify-center">✍️</span>
                             <span className="font-bold text-primary text-sm tracking-tight">Sign with Biometrics</span>
                          </div>
                          <div className="w-10 h-6 bg-accent rounded-full relative p-1 cursor-pointer">
                             <div className="w-4 h-4 bg-white rounded-full"></div>
                          </div>
                       </div>
                    </div>
                    <MeListItem icon="⏲️" label="Auto Logout Settings" subtext="Currently set to 5 minutes" />
                  </div>
                </div>

                {/* Others Section */}
                <div>
                  <h3 className="text-[11px] font-black text-accent uppercase tracking-[0.2em] mb-4 ml-1">General</h3>
                  <div className="space-y-3">
                    <MeListItem icon="🤝" label="Share Gogreen with others" onClick={() => setScreen(AppScreen.REWARDS)} />
                    <MeListItem icon="📥" label="Suggestion Box" />
                    <MeListItem icon="🎧" label="Support" />
                    <MeListItem icon="⭐" label="Rate Us" />
                  </div>
                </div>
              </div>

              <button onClick={() => setScreen(AppScreen.ONBOARDING_1)} className="w-full text-center p-12 text-primary/30 font-black uppercase tracking-widest text-[10px] mt-4 hover:text-primary transition-colors">Sign Out of App</button>
            </div>
          </div>
        )}

        {/* PLACEHOLDER SCREENS */}
        {screen === AppScreen.PAY_BILLS && (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-fade-in bg-white">
             <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl mb-6">📄</div>
             <h2 className="text-2xl font-black text-primary mb-2">Pay Bills</h2>
             <p className="text-accent text-sm font-medium">Easily pay for electricity, internet, and data directly with your balance.</p>
             <Button variant="primary" className="h-14 mt-12" onClick={() => setScreen(AppScreen.HOME)}>Back to Home</Button>
           </div>
        )}

        {screen === AppScreen.SCANNER && (
           <div className="flex-1 flex flex-col bg-black animate-fade-in relative">
             <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
                <div className="w-64 h-64 border-4 border-primary rounded-[40px] relative mb-12">
                   <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                   <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-primary rounded-tl-xl"></div>
                   <div className="absolute top-0 right-0 w-8 h-8 border-t-8 border-r-8 border-primary rounded-tr-xl"></div>
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-b-8 border-l-8 border-primary rounded-bl-xl"></div>
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-primary rounded-br-xl"></div>
                </div>
                <h2 className="text-2xl font-black mb-2">Scan QR Code</h2>
                <p className="opacity-60 text-sm font-medium">Position code inside frame to pay or send money.</p>
             </div>
             <button onClick={() => setScreen(AppScreen.HOME)} className="absolute top-12 left-6 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
           </div>
        )}

        {screen === AppScreen.COIN_SELECTION && (
          <div className="flex-1 flex flex-col bg-[#F8F9FA] animate-fade-in">
            <BackHeader title="Select Crypto" subtitle="Choose asset to sell" />
            <div className="p-6 space-y-4 overflow-y-auto no-scrollbar">
              {coins.map(coin => (
                <div key={coin.id} onClick={() => { setSelectedCoin(coin); navigateWithLoading(AppScreen.COIN_DETAIL); }} className="flex items-center justify-between p-6 bg-white border border-accent/20 rounded-[24px] cursor-pointer hover:border-primary/50 transition-all active:scale-95 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/5 rounded-xl flex items-center justify-center text-primary font-bold overflow-hidden border border-accent/10">
                       <div className="w-full h-full flex items-center justify-center text-xl font-black" style={{ backgroundColor: `${coin.color}15`, color: coin.color }}>{coin.symbol[0]}</div>
                    </div>
                    <div><p className="font-extrabold text-primary">{coin.name}</p><p className="text-[10px] text-accent font-black uppercase tracking-tight">{coin.network}</p></div>
                  </div>
                  <div className="text-right"><p className="text-sm font-black text-primary">₦ {coin.rate}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === AppScreen.COIN_DETAIL && selectedCoin && (
          <div className="flex-1 flex flex-col bg-white animate-slide-up">
            <BackHeader title={`Sell ${selectedCoin.symbol}`} subtitle={selectedCoin.network} target={AppScreen.COIN_SELECTION} />
            <div className="p-8 flex flex-col items-center flex-1 overflow-y-auto no-scrollbar">
               <div className="w-full max-w-xs aspect-square bg-white p-4 border border-accent/30 rounded-[32px] flex items-center justify-center mb-8 shadow-xl">
                  <div className="w-full h-full bg-accent/5 flex items-center justify-center text-accent/30 text-[9px] tracking-[1em] font-black uppercase text-center leading-relaxed">QR Code<br/>Scan to Send</div>
               </div>
               <div className="w-full bg-accent/5 p-6 rounded-[24px] border border-accent/20 mb-8 text-center relative overflow-hidden">
                  <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-3">Deposit Address ({selectedCoin.network})</p>
                  <p className="text-xs font-mono break-all text-black font-bold mb-4 bg-white p-3 rounded-xl border border-accent/10">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                  <Button variant="outline" className="h-12 border-primary/20 text-primary lowercase tracking-normal text-xs" onClick={() => showToast("Copied to clipboard")}>Copy Address</Button>
               </div>
            </div>
          </div>
        )}

        {showNavbar && <Navbar currentScreen={screen} onNavigate={(s) => navigateWithLoading(s)} />}
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        @keyframes epic-bounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); }
          75% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes text-pop {
          0% { transform: scale(0.5); opacity: 0; filter: blur(10px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes checkmark-draw {
          0% { stroke-dashoffset: 48; }
          100% { stroke-dashoffset: 0; }
        }
        
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shake { animation: shake 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-epic-bounce { animation: epic-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-ping-slow { animation: ping-slow 2s infinite ease-out; }
        .animate-text-pop { animation: text-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        
        .animate-checkmark-draw {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkmark-draw 0.6s ease-in-out forwards 0.6s;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
