import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';

export const BankDetailsScreen = () => {
  const { 
    screen,
    setScreen, 
    signupData,
    triggerReview
  } = useAppContext();

  const [selectedBank, setSelectedBank] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');

  const showToast = (message: string) => toast.success(message, {
    style: { background: '#10B981', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
  });

  if (screen === AppScreen.BANK_DETAILS) {
    return (
       <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center">
          <div className="w-full max-w-xl flex flex-col h-full mx-auto">
              <BackHeader title="Bank Details" subtitle="Manage Your Withdrawals" onBack={() => setScreen(AppScreen.ME)} />
              <div className="p-6 space-y-6 overflow-y-auto no-scrollbar pb-24">
                 {/* Existing Bank Card */}
                 <div className="bg-white p-6 rounded-[40px] border border-gray-100 relative overflow-hidden shadow-2xl shadow-gray-200/40 group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-lg font-black text-gray-700 border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">GT</div>
                       <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20 shadow-sm">
                         <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Default</span>
                       </div>
                    </div>
                    <div className="relative z-10">
                       <p className="text-gray-900 font-black text-xl tracking-tighter">Guaranty Trust Bank</p>
                       <p className="text-gray-400 font-mono text-sm mt-1 font-black tracking-[0.2em] opacity-60">0123456789</p>
                       <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                         <div>
                           <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mb-1">Account Name</p>
                           <p className="text-[11px] text-gray-900 font-black uppercase tracking-[0.15em]">{signupData.fullName || 'Hassan Kehinde'}</p>
                         </div>
                         <button onClick={() => showToast("Default bank cannot be removed")} className="w-11 h-11 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors active:scale-90 shadow-sm">
                           <Icons.Trash className="w-4.5 h-4.5" />
                         </button>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-center">
                    <button onClick={() => setScreen(AppScreen.ADD_BANK)} className="px-12 p-8 rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-400 font-black text-xs hover:border-primary hover:text-primary transition-all active:scale-[0.98] bg-white/50 hover:bg-white shadow-xl shadow-gray-200/20 group">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl leading-none group-hover:bg-primary/10 transition-all shadow-sm border border-gray-100">+</div>
                       <span className="uppercase tracking-[0.3em] text-[10px]">Add New Bank Account</span>
                    </button>
                 </div>
              </div>
          </div>
       </div>
    );
  }

  if (screen === AppScreen.ADD_BANK) {
     return (
        <div className="flex-1 flex flex-col bg-green-50/30 animate-slide-up items-center">
           <div className="w-full max-w-xl flex flex-col h-full mx-auto">
              <BackHeader title="Add Bank" subtitle="Link New Account" onBack={() => setScreen(AppScreen.BANK_DETAILS)} />
              <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-24">
                 <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Select Bank</label>
                       <div className="relative group">
                         <select 
                            className="w-full h-16 px-5 rounded-[28px] bg-white border border-gray-100 focus:outline-none focus:border-primary text-sm font-black text-gray-900 appearance-none cursor-pointer shadow-sm transition-all"
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                         >
                            <option value="">Select a bank...</option>
                            <option value="Access Bank">Access Bank</option>
                            <option value="Guaranty Trust Bank">Guaranty Trust Bank</option>
                            <option value="United Bank for Africa">United Bank for Africa</option>
                            <option value="Zenith Bank">Zenith Bank</option>
                            <option value="Kuda Bank">Kuda Bank</option>
                            <option value="Opay">Opay</option>
                            <option value="PalmPay">PalmPay</option>
                         </select>
                         <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-primary transition-colors">
                           <Icons.ChevronDown className="w-5 h-5" />
                         </div>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Account Number</label>
                       <input 
                          type="tel" 
                          placeholder="0123456789" 
                          className="w-full h-16 px-6 rounded-[28px] bg-white border border-gray-100 focus:outline-none focus:border-primary text-lg font-mono font-black tracking-[0.3em] shadow-sm transition-all text-center text-gray-900" 
                          maxLength={10}
                          value={accountNumber}
                          onInput={(e) => {
                             const target = e.target as HTMLInputElement;
                             target.value = (target.value ?? '').replace(/[^0-9]/g, '');
                             setAccountNumber(target.value);
                          }}
                       />
                    </div>

                    <div className="bg-primary/5 p-6 rounded-[32px] border border-primary/10 flex gap-4 items-start shadow-sm">
                       <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                         <Icons.Shield className="w-5 h-5" />
                       </div>
                       <p className="text-[11px] text-gray-600 leading-relaxed font-bold">
                         Please ensure the bank account name matches your verified identity name 
                         <span className="text-primary block mt-1 font-black uppercase tracking-widest">({signupData.fullName || 'Hassan Kehinde'})</span>
                       </p>
                    </div>
                 </div>

                 <div className="mt-auto pt-8">
                    <Button 
                        disabled={!selectedBank || accountNumber.length < 10}
                        onClick={() => { 
                            triggerReview({
                               title: "Bank details under review",
                               message: "We are verifying your bank account details with the NIBSS database. This usually takes a few minutes.",
                               notificationTitle: "Bank Account Linked",
                               notificationDesc: "Your bank account has been verified and linked successfully.",
                               onComplete: () => {
                                  setScreen(AppScreen.BANK_DETAILS); 
                                  setSelectedBank('');
                                  setAccountNumber('');
                               }
                            });
                        }} 
                        className="mx-auto px-12 !h-16 !rounded-[28px] shadow-2xl shadow-primary/20 !bg-primary !text-white !text-xs font-black uppercase tracking-[0.2em]"
                    >
                        Verify & Link Account
                    </Button>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  return null;
};
