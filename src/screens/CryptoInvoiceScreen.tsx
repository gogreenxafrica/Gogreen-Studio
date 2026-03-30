import React, { useEffect } from 'react';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { Icons } from '../../components/Icons';
import { BackHeader } from '../components/BackHeader';
import { Button } from '../../components/Button';
import { toast } from 'react-hot-toast';

export const CryptoInvoiceScreen: React.FC = () => {
  const { setScreen, completeChecklistTask } = useAppContext();

  useEffect(() => {
    completeChecklistTask('request');
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-green-50/30 animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
       <div className="w-full max-w-2xl flex flex-col flex-1 min-h-0">
          <BackHeader title="Request Crypto" subtitle="Create Invoice" onBack={() => setScreen(AppScreen.HOME)} />
          
          <div className="p-6 flex-1 flex flex-col overflow-y-auto pb-24">
              <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Icons.QrCode className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                      <h2 className="text-xl font-black text-gray-900">Receive Payment</h2>
                      <p className="text-xs text-gray-500 font-medium mt-1">Generate a unique QR code or link to get paid in crypto.</p>
                  </div>
              </div>
              
              <div className="space-y-6">
                  {/* Asset Selection */}
                  <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Select Asset</label>
                      <div className="grid grid-cols-3 gap-3">
                          <div className="border-2 border-primary bg-primary/5 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                              <div className="w-8 h-8 bg-[#26A17B] rounded-full flex items-center justify-center text-white text-xs font-bold">U</div>
                              <span className="text-xs font-bold text-primary">USDT</span>
                          </div>
                          <div className="border border-brand-gray/50 bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                              <div className="w-8 h-8 bg-[#F7931A] rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>
                              <span className="text-xs font-bold text-gray-900">BTC</span>
                          </div>
                          <div className="border border-brand-gray/50 bg-white rounded-2xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                              <div className="w-8 h-8 bg-[#627EEA] rounded-full flex items-center justify-center text-white text-xs font-bold">E</div>
                              <span className="text-xs font-bold text-gray-900">ETH</span>
                          </div>
                      </div>
                  </div>

                  {/* Network Selection */}
                  <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Network</label>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                          <div className="px-4 h-11 flex items-center bg-primary text-white rounded-full text-xs font-bold whitespace-nowrap cursor-pointer">TRC20 (Tron)</div>
                          <div className="px-4 h-11 flex items-center bg-white border border-brand-gray/50 text-gray-500 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer hover:border-gray-400 transition-colors">ERC20 (Ethereum)</div>
                          <div className="px-4 h-11 flex items-center bg-white border border-brand-gray/50 text-gray-500 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer hover:border-gray-400 transition-colors">BEP20 (BSC)</div>
                      </div>
                  </div>
                  
                  {/* Amount Input */}
                  <div className="bg-white border border-brand-gray/50 rounded-2xl p-4 focus-within:border-primary transition-colors">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Amount to Request (Optional)</label>
                      <div className="flex items-center gap-2">
                          <input type="number" placeholder="0.00" className="w-full bg-transparent text-2xl font-black text-gray-900 outline-none placeholder:text-gray-400" />
                          <span className="text-sm font-bold text-gray-400">USDT</span>
                      </div>
                  </div>
              </div>

              <div className="mt-auto pt-8 flex justify-center">
                  <Button 
                     className="px-12 !h-14 !rounded-2xl !bg-primary !text-white text-sm font-bold shadow-lg shadow-primary/20"
                     onClick={() => toast.success("Invoice generated successfully!")}
                  >
                      Generate QR & Link
                  </Button>
              </div>
          </div>
       </div>
    </div>
  );
};
