import React, { useState } from 'react';
import { Icons } from '../../components/Icons';
import { BackHeader } from '../components/BackHeader';

interface USSDDepositScreenProps {
  onBack: () => void;
  accountNumber: string;
}

export const USSDDepositScreen: React.FC<USSDDepositScreenProps> = ({ onBack, accountNumber }) => {
  const [amount, setAmount] = useState<string>('100');

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    // You could add a toast here if you pass down a showToast function
  };

  const handleDial = (code: string) => {
    window.location.href = `tel:${encodeURIComponent(code)}`;
  };

  const banks = [
    { id: 'gtb', name: 'GTBank', code: `*737*50*${amount || '0'}*416#`, color: 'bg-[#dd4f05]', icon: 'GTB' },
    { id: 'zenith', name: 'Zenith Bank', code: `*966*${amount || '0'}*${accountNumber}#`, color: 'bg-[#ea0a2a]', icon: 'Z' },
    { id: 'access', name: 'Access Bank', code: `*901*${amount || '0'}*${accountNumber}#`, color: 'bg-[#f58220]', icon: 'A' },
    { id: 'first', name: 'First Bank', code: `*894*${amount || '0'}*${accountNumber}#`, color: 'bg-[#003b65]', icon: 'FB' },
    { id: 'wema', name: 'Wema Bank', code: `*945*${amount || '0'}*${accountNumber}#`, color: 'bg-[#981b60]', icon: 'W' },
    { id: 'polaris', name: 'Polaris Bank', code: `*833*${amount || '0'}*${accountNumber}#`, color: 'bg-[#612b7a]', icon: 'P' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-green-50/30 animate-slide-up items-center">
      <div className="w-full max-w-2xl flex flex-col h-full">
        <BackHeader title="Add By USSD" onBack={onBack} />
        
        <div className="p-6 flex-1 flex flex-col overflow-y-auto pb-24">
          <p className="text-[14px] text-gray-800 mb-8 leading-relaxed">
            Type in the amount you want to add to your Gogreen account and tap the right USSD code below to dial it.
          </p>

          <div className="mb-8">
            <label className="text-[13px] text-gray-800 mb-2 block">Amount</label>
            <div className="bg-white rounded-xl p-4 border border-gray-100 focus-within:border-primary/30 transition-all shadow-sm">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\s/g, ''))}
                className="w-full bg-transparent text-[18px] text-gray-900 outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10">
            <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide">Copy Gogreen Account Number</span>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 text-gray-900 transition-colors active:scale-95"
            >
              <div className="w-4 h-4 bg-gray-900 rounded-md flex items-center justify-center text-white"><Icons.FileText className="w-2.5 h-2.5" /></div>
              <span className="font-bold text-[14px]">{accountNumber}</span>
            </button>
          </div>

          <div className="space-y-6 pb-8">
            {banks.map((bank) => (
              <div 
                key={bank.id} 
                onClick={() => handleDial(bank.code)}
                className="flex items-center gap-4 cursor-pointer active:opacity-70 transition-opacity"
              >
                <div className={`w-12 h-12 rounded-full ${bank.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {bank.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-[13px] text-gray-400 mb-0.5">{bank.name}</h3>
                  <p className="text-[16px] font-black text-gray-900 tracking-tight">{bank.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
