import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppScreen } from './types';

interface AppContextType {
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
  pendingBalance: number;
  setPendingBalance: (balance: number) => void;
  signupData: any;
  setSignupData: (data: any) => void;
  kycLevel: number;
  setKycLevel: (level: number) => void;
  signupStep: number;
  setSignupStep: (step: number) => void;
  loginData: any;
  setLoginData: (data: any) => void;
  isCaptchaVerified: boolean;
  setIsCaptchaVerified: (verified: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [walletBalance, setWalletBalance] = useState<number>(1326890);
  const [pendingBalance, setPendingBalance] = useState<number>(45000);
  const [signupStep, setSignupStep] = useState<number>(0);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    username: '₦-', 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    referralCode: '', 
    country: 'Nigeria',
    profileImage: null as string | null,
    phone: '',
    autoWithdrawToBank: false
  });
  const [kycLevel, setKycLevel] = useState<number>(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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

  return (
    <AppContext.Provider value={{
      screen, setScreen,
      walletBalance, setWalletBalance,
      pendingBalance, setPendingBalance,
      signupData, setSignupData,
      kycLevel, setKycLevel,
      signupStep, setSignupStep,
      loginData, setLoginData,
      isCaptchaVerified, setIsCaptchaVerified,
      theme, toggleTheme
    }}>
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
