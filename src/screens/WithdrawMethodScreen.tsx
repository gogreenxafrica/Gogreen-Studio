import React, { useState } from 'react';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';

interface WithdrawMethodScreenProps {
  isModal?: boolean;
}

export const WithdrawMethodScreen: React.FC<WithdrawMethodScreenProps> = ({ isModal }) => {
  const { setScreen } = useAppContext();

  return (
    <div className={`flex-1 flex flex-col ${isModal ? 'bg-white' : 'bg-ghost'} animate-fade-in w-full h-full overflow-hidden min-h-0`}>
      {!isModal && <BackHeader title="Withdraw Funds" subtitle="Select Method" onBack={() => setScreen(AppScreen.HOME)} />}
      
      {isModal && (
        <div className="px-6 pt-8 pb-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Withdraw Funds</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Select your preferred method</p>
        </div>
      )}

      <div className="p-6 flex flex-row gap-3">
        <button 
          onClick={() => setScreen(AppScreen.WITHDRAW_MONEY)}
          className="flex-1 p-6 rounded-[32px] bg-white border border-gray-100 flex flex-col items-center gap-4 shadow-sm active:scale-95 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Icons.Bank className="w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="font-black text-gray-900 text-sm">Bank Transfer</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 leading-tight">Direct bank transfer</p>
          </div>
        </button>

        <button 
          onClick={() => setScreen(AppScreen.SEND_TO_GREENTAG)}
          className="flex-1 p-6 rounded-[32px] bg-white border border-gray-100 flex flex-col items-center gap-4 shadow-sm active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 bg-primary text-white text-[6px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">0 Fee</div>
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
            <Icons.User className="w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="font-black text-gray-900 text-sm">GoGreenTag</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 leading-tight">Instant transfer to user</p>
          </div>
        </button>
      </div>
    </div>
  );
};
