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
    { id: 'coins', label: 'My Wallet', icon: <Icons.Wallet className="w-6 h-6" />, screen: AppScreen.COIN_DETAIL },
    { id: 'trade', label: 'Trade Crypto', icon: <Icons.ArrowLeftRight className="w-6 h-6" />, screen: AppScreen.SELL_CRYPTO },
    { id: 'swap', label: 'Swap Assets', icon: <Icons.ArrowLeftRight className="w-6 h-6" />, screen: AppScreen.SWAP_SELECT_ASSET_FROM },
    { id: 'invoice', label: 'Crypto Invoice', icon: <Icons.FileText className="w-6 h-6" />, screen: AppScreen.CRYPTO_INVOICE },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-in pb-24">
      <BackHeader title="Trade Crypto" subtitle="Manage your digital assets" onBack={() => onNavigate(AppScreen.HOME)} />
      
      <div className="p-5 grid grid-cols-2 gap-4">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onProtectedNavigation(feature.screen)}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-green-50/50 border border-green-100/50 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white text-primary flex items-center justify-center shadow-sm">
              {feature.icon}
            </div>
            <span className="font-bold text-gray-900 text-sm">{feature.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
