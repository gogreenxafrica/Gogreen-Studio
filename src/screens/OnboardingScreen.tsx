import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, Smartphone, Tv, Send, Building2, CheckCircle2, Gift } from 'lucide-react';
import { Logo } from '../../components/Logo';

interface OnboardingStep {
  title: string;
  image: string;
  overlay?: React.ReactNode;
  isDark?: boolean;
}

const steps: OnboardingStep[] = [
  {
    title: "Convert your Crypto to Naira in seconds.",
    image: "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=800",
    isDark: true,
    overlay: (
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-4 rounded-2xl w-full max-w-[280px]"
      >
        <div className="flex items-center justify-between mb-4 bg-green-50 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-[10px] text-white font-bold">₮</div>
            <span className="text-xs font-bold">USDT</span>
          </div>
          <span className="text-xs font-bold">500.00</span>
        </div>
        <div className="flex justify-center -my-3 relative z-10">
          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white">
            <ArrowDown size={12} />
          </div>
        </div>
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg mt-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-[10px] text-white font-bold">₦</div>
            <span className="text-xs font-bold">NGN</span>
          </div>
          <span className="text-xs font-bold text-primary">750,000.00</span>
        </div>
      </motion.div>
    )
  },
  {
    title: "Pay bills and buy airtime with ease.",
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=800",
    isDark: false,
    overlay: (
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-4 rounded-2xl w-full max-w-[260px]"
      >
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Payments</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><Smartphone size={14} /></div>
              <div>
                <p className="text-xs font-bold">MTN Airtime</p>
                <p className="text-[10px] text-gray-500">0803 *** ****</p>
              </div>
            </div>
            <span className="text-xs font-bold">-₦5,000</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"><Tv size={14} /></div>
              <div>
                <p className="text-xs font-bold">DSTV Premium</p>
                <p className="text-[10px] text-gray-500">Smartcard</p>
              </div>
            </div>
            <span className="text-xs font-bold">-₦24,500</span>
          </div>
        </div>
      </motion.div>
    )
  },
  {
    title: "Send money to friends at zero cost.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800",
    isDark: true,
    overlay: (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-5 rounded-3xl w-full max-w-[260px] relative"
      >
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-md mb-2 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="User" />
          </div>
          <p className="text-sm font-bold">@chisom_g</p>
          <p className="text-[10px] text-gray-500">Gogreen User</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center mb-4">
           <p className="text-2xl font-black text-primary">₦50,000</p>
           <p className="text-[10px] text-gray-400">Zero fees applied</p>
        </div>
        <div className="w-full py-2 bg-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2">
           <Send size={14} /> Send Instantly
        </div>
      </motion.div>
    )
  },
  {
    title: "Withdraw to your local bank instantly.",
    image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&q=80&w=800",
    isDark: false,
    overlay: (
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-4 rounded-2xl w-full max-w-[260px]"
      >
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            <Building2 size={18} />
          </div>
          <div>
            <p className="text-xs font-bold">Guaranty Trust Bank</p>
            <p className="text-[10px] text-gray-500">0123456789</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
           <div>
             <p className="text-[10px] text-gray-400">Amount</p>
             <p className="text-sm font-bold">₦150,000</p>
           </div>
           <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md">
             <CheckCircle2 size={12} />
             <span className="text-[10px] font-bold">Success</span>
           </div>
        </div>
      </motion.div>
    )
  },
  {
    title: "Earn points and cash for everyday usage.",
    image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=800",
    isDark: true,
    overlay: (
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-4 rounded-2xl flex items-center gap-3 w-full max-w-[280px]"
      >
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
          <Gift size={18} />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900">Referral Bonus!</p>
          <p className="text-[10px] text-gray-500">You received ₦1,500 for inviting a friend.</p>
        </div>
      </motion.div>
    )
  }
];

const SLIDE_DURATION = 4000;

export const OnboardingScreen: React.FC<{ onComplete: () => void, onLogin: () => void }> = ({ onComplete, onLogin }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const step = steps[currentStep];

  return (
    <div className={`fixed inset-0 flex flex-col transition-colors duration-500 ${step.isDark ? 'bg-gray-900' : 'bg-green-50/30'}`}>
      {/* Progress Bar */}
      <div className="pt-12 px-6 flex gap-2">
        {steps.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: idx < currentStep ? '100%' : '0%' }}
              animate={{ width: idx <= currentStep ? '100%' : '0%' }}
              transition={{ 
                duration: idx === currentStep ? SLIDE_DURATION / 1000 : 0.3,
                ease: idx === currentStep ? "linear" : "easeOut"
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 sm:px-8 pt-6 sm:pt-10 min-h-0">
        <motion.h1 
          key={step.title}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`text-xl sm:text-2xl font-bold leading-tight mb-6 sm:mb-10 shrink-0 ${step.isDark ? 'text-white' : 'text-gray-900'}`}
        >
          {step.title}
        </motion.h1>

        <div className="relative flex-1 flex items-center justify-center min-h-0 pb-4">
          {/* Main Image with Shape */}
          <motion.div 
            key={step.image}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-[340px] h-[40vh] max-h-[400px] relative mx-auto rounded-t-[120px] rounded-b-[40px] overflow-hidden shadow-2xl border-4 sm:border-8 ${
              step.isDark ? 'border-white/10' : 'border-primary/10'
            }`}
          >
            <img 
              src={step.image} 
              alt="Onboarding" 
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </motion.div>

          {/* Floating Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="w-full flex justify-center scale-90 sm:scale-100 origin-center"
              >
                {step.overlay}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={`px-6 sm:px-8 pb-8 pt-4 flex flex-col items-center gap-3 shrink-0 ${step.isDark ? 'bg-gray-900' : 'bg-green-50/30'}`}>
        <button 
          onClick={onComplete}
          className={`w-full max-w-[300px] py-3.5 sm:py-4 rounded-2xl font-bold transition-all active:scale-[0.98] ${
            step.isDark ? 'bg-white text-gray-900' : 'bg-primary text-white'
          }`}
        >
          I'm new to Gogreen
        </button>
        <button 
          onClick={onLogin}
          className={`w-full max-w-[300px] py-3.5 sm:py-4 rounded-2xl font-bold transition-all active:scale-[0.98] border-2 ${
            step.isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-900/20 text-gray-900 hover:bg-gray-900/5'
          }`}
        >
          I already have an account
        </button>
      </div>
    </div>
  );
};
