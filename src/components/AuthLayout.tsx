import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandPattern } from './BrandPattern';
import { Logo } from '../../components/Logo';
import { ArrowDown, Smartphone, Tv, Send, Building2, CheckCircle2, Gift } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  visualType?: 'login' | 'signup';
}

const visualData = {
  login: {
    title: "Convert your Crypto to Naira in seconds.",
    image: "https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=800",
    isDark: true,
    overlay: (
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-4 rounded-2xl w-full max-w-[280px] shadow-2xl"
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
  signup: {
    title: "Send money to friends at zero cost.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800",
    isDark: false,
    overlay: (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-5 rounded-3xl w-full max-w-[260px] relative shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-md mb-2 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="User" referrerPolicy="no-referrer" />
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
  }
};

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  visualType = 'login',
  subtitle
}) => {
  const data = visualData[visualType];

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col p-6 sm:p-12 relative overflow-y-auto no-scrollbar">
        <div className="mb-12 self-center hidden lg:block">
          <Logo className="w-32 h-10" variant="color" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="w-full max-w-md animate-fade-in">
            {children}
          </div>
        </div>
      </div>

      {/* Right Side: Visual (Hidden on Mobile) */}
      <div className={`hidden lg:flex lg:w-[35%] relative flex-col p-12 transition-colors duration-500 items-center text-center ${data.isDark ? 'bg-primary' : 'bg-green-50/30'}`}>
        <BrandPattern opacity={0.03} color={data.isDark ? 'white' : 'primary'} size={60} />
        
        <div className="relative z-10 flex flex-col h-full w-full">
          <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
            <motion.h1 
              key={data.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`text-4xl font-black leading-tight mb-4 ${data.isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {data.title}
            </motion.h1>

            {subtitle && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`text-[10px] font-black uppercase tracking-[0.3em] mb-12 ${data.isDark ? 'text-white/60' : 'text-primary'}`}
              >
                {subtitle}
              </motion.p>
            )}

            <div className="relative flex items-center justify-center">
              {/* Main Image with Shape */}
              <motion.div 
                key={data.image}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`w-full max-w-[380px] aspect-[4/5] relative rounded-t-[140px] rounded-b-[50px] overflow-hidden shadow-2xl border-8 ${
                  data.isDark ? 'border-white/10' : 'border-primary/10'
                }`}
              >
                <img 
                  src={data.image} 
                  alt="Auth Visual" 
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </motion.div>

              {/* Floating Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={visualType}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="w-full flex justify-center"
                  >
                    {data.overlay}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mt-auto pb-10 text-center">
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${data.isDark ? 'text-white/40' : 'text-gray-400'}`}>
              © 2026 Gogreen Africa. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
