import React, { useEffect, useRef } from 'react';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { Icons } from '../components/Icons';
import { BrandPattern } from '../components/BrandPattern';
import { GIFT_CARDS } from '../../constants';

export const ServicesScreen = () => {
  const { 
    setScreen, 
    setGiftCardTradeType, 
    setSelectedGiftCard, 
  } = useAppContext();

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const gridServices = [
    { icon: <Icons.CreditCard className="w-6 h-6" />, label: 'VIRTUAL CARD', color: 'text-emerald-500', bg: 'bg-emerald-50', screen: AppScreen.VIRTUAL_CARD },
    { icon: <Icons.Smartphone className="w-6 h-6" />, label: 'AIRTIME', color: 'text-blue-500', bg: 'bg-blue-50', blurred: true },
    { icon: <Icons.Wifi className="w-6 h-6" />, label: 'DATA BUNDLE', color: 'text-blue-500', bg: 'bg-blue-50', blurred: true },
    { icon: <Icons.Monitor className="w-6 h-6" />, label: 'CABLE TV', color: 'text-purple-500', bg: 'bg-purple-50', blurred: true },
    { icon: <Icons.Zap className="w-6 h-6" />, label: 'ELECTRICITY', color: 'text-yellow-500', bg: 'bg-yellow-50', blurred: true },
    { icon: <Icons.GraduationCap className="w-6 h-6" />, label: 'EDUCATION', color: 'text-green-500', bg: 'bg-green-50', blurred: true },
    { icon: <Icons.FileText className="w-6 h-6" />, label: 'REGISTRATIONS', color: 'text-pink-500', bg: 'bg-pink-50', blurred: true },
    { icon: <Icons.Activity className="w-6 h-6" />, label: 'BETTING', color: 'text-blue-400', bg: 'bg-blue-50', blurred: true },
    { icon: <Icons.Plus className="w-6 h-6" />, label: 'OTHERS', color: 'text-gray-400', bg: 'bg-gray-50', blurred: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-in items-center overflow-hidden w-full h-full min-h-0">
      <div className="w-full max-w-2xl flex flex-col flex-1 mx-auto relative min-h-0">
        <BrandPattern opacity={0.02} size={60} className="absolute inset-0 pointer-events-none" />
        
        <div className="p-6 pt-12 pb-8 z-20 sticky top-0 header-integrated">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Our Services</h2>
          <p className="text-gray-500 font-medium text-sm">Everything you need in one place.</p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-32 min-h-0">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {/* Hot Rates Slider */}
            <div ref={sliderRef} className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory scroll-smooth">
              {/* Razer Gold Card */}
              <div 
                className="min-w-full shrink-0 snap-center bg-[#0A0E17] rounded-[24px] p-6 text-white relative overflow-hidden cursor-pointer group" 
                onClick={() => { 
                  setGiftCardTradeType('SELL'); 
                  const razerCard = GIFT_CARDS.find(c => c.id === 'razer');
                  if (razerCard) {
                    setSelectedGiftCard(razerCard); 
                    setScreen(AppScreen.GIFT_CARD_TYPE_SELECTION); 
                  } else {
                    setScreen(AppScreen.GIFT_CARD_TRADE_OPTIONS);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-lg font-black tracking-tight">RAZER GOLD</h3>
                    <p className="text-emerald-400 text-xs font-bold mt-1">GG 1,130.00/$</p>
                  </div>
                  <div className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                    HOT RATE
                  </div>
                </div>
                <div className="flex items-center text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                  TRADE NOW <Icons.ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Apple Physical Card */}
              <div 
                className="min-w-full shrink-0 snap-center bg-[#1A0B14] rounded-[24px] p-6 text-white relative overflow-hidden cursor-pointer group" 
                onClick={() => { 
                  setGiftCardTradeType('SELL'); 
                  const itunesCard = GIFT_CARDS.find(c => c.id === 'itunes');
                  if (itunesCard) {
                    setSelectedGiftCard(itunesCard); 
                    setScreen(AppScreen.GIFT_CARD_TYPE_SELECTION); 
                  } else {
                    setScreen(AppScreen.GIFT_CARD_TRADE_OPTIONS);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-lg font-black tracking-tight">APPLE PHYSICAL</h3>
                    <p className="text-pink-400 text-xs font-bold mt-1">GG 1,050.00/$</p>
                  </div>
                  <div className="bg-pink-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                    HOT RATE
                  </div>
                </div>
                <div className="flex items-center text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                  TRADE NOW <Icons.ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Steam Germany Card */}
              <div 
                className="min-w-full shrink-0 snap-center bg-[#0B141A] rounded-[24px] p-6 text-white relative overflow-hidden cursor-pointer group" 
                onClick={() => { 
                  setGiftCardTradeType('SELL'); 
                  const steamCard = GIFT_CARDS.find(c => c.id === 'steam');
                  if (steamCard) {
                    setSelectedGiftCard(steamCard); 
                    setScreen(AppScreen.GIFT_CARD_TYPE_SELECTION); 
                  } else {
                    setScreen(AppScreen.GIFT_CARD_TRADE_OPTIONS);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-lg font-black tracking-tight">STEAM GERMANY</h3>
                    <p className="text-blue-400 text-xs font-bold mt-1">GG 1,200.00/€</p>
                  </div>
                  <div className="bg-blue-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                    HOT RATE
                  </div>
                </div>
                <div className="flex items-center text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                  TRADE NOW <Icons.ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-y-8 gap-x-4">
            {gridServices.map((service, i) => (
              <div key={i} onClick={() => service.screen && setScreen(service.screen)} className={`flex flex-col items-center justify-center gap-3 ${service.blurred ? 'opacity-40 blur-[1.2px] cursor-default' : 'cursor-pointer group'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.bg} ${service.color} ${!service.blurred && 'group-hover:scale-110 transition-transform'}`}>
                  {service.icon}
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">{service.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
