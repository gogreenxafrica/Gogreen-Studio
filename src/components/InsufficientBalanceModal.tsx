import React from 'react';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';

interface SwapDetail {
  fromCoin: string;
  amount: string;
  value: string;
}

interface InsufficientBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requiredAmount: number;
  currency?: string;
  message?: string;
  swapDetails?: SwapDetail[];
}

export const InsufficientBalanceModal: React.FC<InsufficientBalanceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  requiredAmount,
  currency = 'NGN',
  message,
  swapDetails
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center w-full max-w-md mx-auto">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 mx-auto mb-4">
          <Icons.Alert className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">Insufficient {currency} Balance</h3>
        
        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 px-2">
          {message || (swapDetails && swapDetails.length > 1 
            ? `You don't have enough ${currency}. We will auto-swap multiple assets (${swapDetails.map(d => d.fromCoin).join(' + ')}) to cover the difference.`
            : `You don't have enough ${currency} for this transaction, but you have enough in other coins. Would you like us to auto-swap your crypto to cover this amount?`
          )}
        </p>
        
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated Swap</span>
            <span className="text-[10px] font-black text-green-500">Live Rate</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-left">
              {swapDetails ? (
                swapDetails.map((detail, idx) => (
                  <div key={idx} className={idx > 0 ? "mt-1" : ""}>
                    <p className="text-sm font-black text-gray-900 tracking-tight">{detail.amount} {detail.fromCoin}</p>
                    <p className="text-[9px] font-bold text-gray-400">{detail.value}</p>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-lg font-black text-gray-900 tracking-tight">0.0064 BTC</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1">+ 120.50 USDT</p>
                </>
              )}
            </div>
            
            <div className="text-gray-300 px-2">
              <Icons.Refresh className="w-5 h-5" />
            </div>
            
            <div className="text-right">
              <p className="text-lg font-black text-gray-900 tracking-tight">₦{requiredAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-[10px] font-bold text-gray-400 mt-1">Required Balance</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={onConfirm}
            className="w-full !h-14 !rounded-[24px] shadow-xl shadow-primary/20 !text-sm font-black"
          >
            Confirm & Auto-Swap
          </Button>
          <button 
            onClick={onClose}
            className="w-full py-4 text-sm font-black text-primary hover:text-green-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
