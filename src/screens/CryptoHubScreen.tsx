import React from 'react';
import { AppScreen } from '../../types';
import { BackHeader } from '../components/BackHeader';
import { Icons } from '../../components/Icons';

interface CryptoHubScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onProtectedNavigation: (screen: AppScreen) => void;
}

export const CryptoHubScreen: React.FC<CryptoHubScreenProps> = ({ onNavigate, onProtectedNavigation }) => {
  const features = [
    { id: 'coins', label: 'My Wallet', icon: <Icons.Wallet className="w-6 h-6" />, screen: AppScreen.COIN_DETAIL, comingSoon: true },
    { id: 'trade', label: 'Trade Crypto', icon: <Icons.ArrowLeftRight className="w-6 h-6" />, screen: AppScreen.SELL_CRYPTO, comingSoon: true },
    { id: 'swap', label: 'Swap Assets', icon: <Icons.ArrowLeftRight className="w-6 h-6" />, screen: AppScreen.SWAP_SELECT_ASSET_FROM, comingSoon: true },
    { id: 'invoice', label: 'Crypto Invoice', icon: <Icons.FileText className="w-6 h-6" />, screen: AppScreen.CRYPTO_INVOICE, comingSoon: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-in pb-24 overflow-hidden">
      <BackHeader title="Trade Crypto" subtitle="Manage your digital assets" onBack={() => onNavigate(AppScreen.HOME)} />
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-5 grid grid-cols-2 gap-4">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => !feature.comingSoon && onProtectedNavigation(feature.screen)}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-green-50/50 border border-green-100/50 shadow-sm hover:shadow-md transition-all active:scale-[0.98] relative overflow-hidden ${feature.comingSoon ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
            >
              {feature.comingSoon && (
                <div className="absolute -top-1 -right-1 bg-gray-500 text-white text-[6px] font-black px-2 py-1 rounded-full z-10">COMING SOON</div>
              )}
              <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm ${feature.comingSoon ? 'text-gray-400' : 'text-primary'}`}>
                {feature.icon}
              </div>
              <span className={`font-bold text-sm ${feature.comingSoon ? 'text-gray-400' : 'text-gray-900'}`}>{feature.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
