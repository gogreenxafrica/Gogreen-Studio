import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';

export const SecurityScreen = () => {
  const { 
    screen,
    setScreen, 
    navigate,
    biometricEnabled, 
    setBiometricEnabled,
    setTransactionPin,
    goBack
  } = useAppContext();

  const [tempPin, setTempPin] = useState<string>('');

  const showToast = (message: string) => toast.success(message, {
    style: { background: '#10B981', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
  });

  if (screen === AppScreen.SECURITY) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
         <div className="w-full max-w-xl flex flex-col h-full mx-auto">
             <BackHeader title="Security" subtitle="Protect Your Account" onBack={goBack} />
             <div className="p-6 space-y-4 overflow-y-auto no-scrollbar pb-24">
                <div className="bg-white p-4 rounded-[24px] border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-sm group" onClick={() => navigate(AppScreen.CHANGE_PIN)}>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transition-all group-hover:scale-105 group-hover:bg-primary/20 shadow-sm"><Icons.Lock className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-black text-gray-900 text-[14px] tracking-tight">Transaction PIN</h4>
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-0.5 opacity-60">Change 4-digit PIN</p>
                      </div>
                   </div>
                   <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Icons.ChevronRight className="w-4 h-4" />
                   </div>
                </div>
                
                <div className="bg-white p-4 rounded-[24px] border border-gray-100 flex items-center justify-between shadow-sm group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-primary transition-all group-hover:scale-105 shadow-sm"><Icons.Shield className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-black text-gray-900 text-[14px] tracking-tight">Biometric Login</h4>
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-0.5 opacity-60">FaceID / TouchID</p>
                      </div>
                   </div>
                   <div className="relative flex items-center h-9">
                       <input 
                         type="checkbox" 
                         name="toggle" 
                         id="biometric-toggle" 
                         checked={biometricEnabled}
                         onChange={() => {
                           if (!biometricEnabled) {
                             navigate(AppScreen.BIOMETRIC_ENABLE);
                           } else {
                             setBiometricEnabled(false);
                           }
                         }}
                         className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white shadow-md appearance-none cursor-pointer top-2 left-0.5 checked:translate-x-6 transition-transform duration-300 ease-in-out z-10" 
                       />
                       <label htmlFor="biometric-toggle" className={`toggle-label block w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${biometricEnabled ? 'bg-primary shadow-inner shadow-primary/20' : 'bg-gray-200 shadow-inner'}`}></label>
                   </div>
                </div>

                <div className="bg-white p-4 rounded-[24px] border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-sm group" onClick={() => showToast("Password Change Link Sent to Email")}>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 transition-all group-hover:scale-105 shadow-sm"><Icons.Lock className="w-6 h-6" /></div>
                      <div>
                         <h4 className="font-black text-gray-900 text-[14px] tracking-tight">Change Password</h4>
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-0.5 opacity-60">Update login details</p>
                      </div>
                   </div>
                   <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Icons.ChevronRight className="w-4 h-4" />
                   </div>
                </div>
              </div>
         </div>
      </div>
    );
  }

  if (screen === AppScreen.CHANGE_PIN) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
         <div className="w-full max-w-xl flex flex-col h-full min-h-0 mx-auto">
            <BackHeader title="Change PIN" subtitle="Update Transaction Security" onBack={() => setScreen(AppScreen.SECURITY)} />
            <div className="px-4 py-1 flex flex-col flex-1 min-h-0 overflow-hidden justify-between pb-24 md:pb-8">
               <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-[20px] flex items-center justify-center text-primary mb-2 shadow-2xl shadow-primary/10 relative group shrink-0">
                     <div className="absolute inset-0 bg-primary/5 rounded-[20px] blur-xl group-hover:blur-2xl transition-all"></div>
                     <Icons.Lock className="w-6 h-6 relative z-10" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 mb-0.5 tracking-tighter shrink-0">Set New PIN</h2>
                  <p className="text-gray-500 text-[9px] mb-2 text-center font-medium max-w-[200px] leading-tight shrink-0">Enter a new 4-digit PIN to secure your transactions and withdrawals.</p>
                  
                  <div className="flex gap-2 justify-center mb-2 w-full shrink-0">
                     {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`w-10 h-10 rounded-[14px] border-2 flex items-center justify-center text-lg font-black transition-all duration-300 ${tempPin.length > i ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'border-gray-100 bg-white text-gray-900 shadow-md shadow-gray-200/10'}`}>
                           {tempPin.length > i ? '•' : ''}
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="grid grid-cols-3 gap-1.5 w-full max-w-[260px] mx-auto mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, idx) => (
                     <button 
                        key={idx}
                        onClick={() => {
                           if (num === 'del') {
                              setTempPin(prev => prev.slice(0, -1));
                           } else if (num !== '' && tempPin.length < 4) {
                              const newPin = tempPin + String(num);
                              setTempPin(newPin);
                              if (newPin.length === 4) {
                                 setTimeout(() => {
                                    setTransactionPin(newPin);
                                    setTempPin('');
                                    showToast("PIN Changed Successfully!");
                                    setScreen(AppScreen.SECURITY);
                                 }, 500);
                              }
                           }
                        }}
                        className={`h-12 rounded-[18px] flex items-center justify-center text-lg font-black active:scale-90 transition-all ${num === '' ? 'invisible' : num === 'del' ? 'bg-gray-50 text-gray-500 hover:bg-gray-100 shadow-sm' : 'bg-white shadow-md shadow-gray-200/10 border border-gray-100 text-gray-900 hover:border-primary/30'}`}
                     >
                        {num === 'del' ? <Icons.Trash className="w-5 h-5" /> : num}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </div>
    );
  }

  return null;
};
