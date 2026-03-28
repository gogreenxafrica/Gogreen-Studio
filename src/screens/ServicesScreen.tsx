import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Icons } from '../../components/Icons';
import { BrandPattern } from '../components/BrandPattern';

export const ServicesScreen = () => {
  const { setScreen } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = [
    { title: 'RAZER GOLD', rate: '₦1,130.00/$', color: 'bg-gray-900', tag: 'HOT RATE', tagColor: 'bg-emerald-500', rateColor: 'text-emerald-400' },
    { title: 'US APPLE (PHYSICAL)', rate: '₦1,200.00/$', color: 'bg-gray-200', tag: 'HOT RATE', tagColor: 'bg-blue-500', rateColor: 'text-blue-600' },
    { title: 'STEAM GERMANY', rate: '₦1,150.00/€', color: 'bg-blue-900', tag: 'HOT RATE', tagColor: 'bg-yellow-500', rateColor: 'text-yellow-300' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 4300);
    return () => clearInterval(timer);
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -50) {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    } else if (info.offset.x > 50) {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }
  };

  const services = [
    { icon: <Icons.Smartphone className="w-6 h-6" />, label: 'Airtime', color: 'bg-cyan-50 text-cyan-500', soon: true, screen: AppScreen.PAY_BILLS },
    { icon: <Icons.Wifi className="w-6 h-6" />, label: 'Data Bundle', color: 'bg-blue-50 text-blue-500', soon: true, screen: AppScreen.PAY_BILLS },
    { icon: <Icons.Monitor className="w-6 h-6" />, label: 'Cable TV', color: 'bg-purple-50 text-purple-500', soon: true, screen: AppScreen.PAY_BILLS },
    { icon: <Icons.Zap className="w-6 h-6" />, label: 'Electricity', color: 'bg-yellow-50 text-yellow-500', soon: true, screen: AppScreen.PAY_BILLS },
    { icon: <Icons.GraduationCap className="w-6 h-6" />, label: 'Education', color: 'bg-emerald-50 text-emerald-500', soon: true, screen: AppScreen.PAY_BILLS },
    { icon: <Icons.FileText className="w-6 h-6" />, label: 'Registrations', color: 'bg-rose-50 text-rose-500', soon: true, screen: AppScreen.PAY_BILLS },
    { icon: <Icons.Activity className="w-6 h-6" />, label: 'Betting', color: 'bg-indigo-50 text-indigo-500', soon: true, screen: AppScreen.HOME },
    { icon: <Icons.Plus className="w-6 h-6" />, label: 'Others', color: 'bg-gray-50 text-gray-500', soon: true, screen: AppScreen.HOME },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-in items-center overflow-hidden">
      <div className="w-full max-w-2xl flex flex-col flex-1 mx-auto relative">
        <BrandPattern opacity={0.02} size={60} className="absolute inset-0 pointer-events-none" />
        
        <div className="p-6 pt-12 pb-8 z-20 sticky top-0 header-integrated">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Our Services</h2>
          <p className="text-gray-500 font-medium text-sm">Everything you need in one place.</p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 min-h-0">
          {/* GoGreen Activity Cards */}
          <div className="mb-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className={`relative h-44 ${cards[currentIndex].color} rounded-[32px] shadow-lg shadow-gray-900/10 overflow-hidden group cursor-pointer active:scale-[0.98] transition-colors duration-500`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        className="absolute inset-0 p-6 flex flex-col justify-between"
                      >
                        <div className={`absolute top-3 right-3 ${cards[currentIndex].tagColor} text-white text-[7px] font-black px-2 py-0.5 rounded-full z-10`}>{cards[currentIndex].tag}</div>
                        <div>
                            <h4 className={`font-black ${currentIndex === 1 ? 'text-gray-900' : 'text-white'} text-base uppercase tracking-wider`}>{cards[currentIndex].title}</h4>
                            <p className={`text-[10px] ${cards[currentIndex].rateColor} font-bold mt-1 tracking-widest`}>{cards[currentIndex].rate}</p>
                        </div>
                        <div className={`flex items-center gap-2 ${currentIndex === 1 ? 'text-gray-900/40' : 'text-white/40'} group-hover:${currentIndex === 1 ? 'text-gray-900' : 'text-white'} transition-colors`}>
                            <span className="text-[10px] font-black uppercase tracking-widest">Trade Now</span>
                            <Icons.ArrowRight className="w-3 h-3" />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 relative overflow-hidden h-44 opacity-50 cursor-not-allowed">
                      <div className="absolute top-3 right-3 bg-gray-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full z-10">COMING SOON</div>
                      <div className="flex flex-col">
                          <h4 className="font-black text-gray-400 text-base uppercase tracking-wider">Trade Crypto</h4>
                          <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest">BTC, USDT, ETH</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Divider */}
          <div className="mb-6">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div 
                key={i} 
                onClick={() => !service.soon && setScreen(service.screen)}
                className={`flex flex-col items-center gap-4 relative group cursor-pointer transition-all ${service.soon ? 'opacity-50 grayscale' : 'active:scale-95'}`}
              >
                {service.soon && (
                  <div className="absolute -top-1 -right-1 bg-gray-900 text-white text-[7px] font-black px-2 py-0.5 rounded-full z-10 shadow-sm">SOON</div>
                )}
                <div className={`w-20 h-20 rounded-[32px] ${service.color} flex items-center justify-center shadow-sm border border-white/50 group-hover:shadow-md transition-shadow`}>
                  {service.icon}
                </div>
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest text-center leading-tight">{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
