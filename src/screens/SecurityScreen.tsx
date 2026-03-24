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
    biometricEnabled, 
    setBiometricEnabled,
    setTransactionPin
  } = useAppContext();

  const [tempPin, setTempPin] = useState<string>('');

  const showToast = (message: string) => toast.success(message, {
    style: { background: '#10B981', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
  });

  if (screen === AppScreen.SECURITY) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center">
         <div className="w-full max-w-xl flex flex-col h-full mx-auto">
             <BackHeader title="Security" subtitle="Protect Your Account" onBack={() => setScreen(AppScreen.ME)} />
             <div className="p-6 space-y-4 overflow-y-auto no-scrollbar pb-24">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-xl shadow-gray-200/40 group" onClick={() => setScreen(AppScreen.CHANGE_PIN)}>
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transition-all group-hover:scale-110 group-hover:bg-primary/20 shadow-sm"><Icons.Lock className="w-7 h-7" /></div>
                      <div>
                         <h4 className="font-black text-gray-900 text-[15px] tracking-tight">Transaction PIN</h4>
                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 opacity-60">Change 4-digit PIN</p>
                      </div>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Icons.ChevronRight className="w-5 h-5" />
                   </div>
                </div>
                
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between shadow-xl shadow-gray-200/40 group">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-primary transition-all group-hover:scale-110 shadow-sm"><Icons.Shield className="w-7 h-7" /></div>
                      <div>
                         <h4 className="font-black text-gray-900 text-[15px] tracking-tight">Biometric Login</h4>
                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 opacity-60">FaceID / TouchID</p>
                      </div>
                   </div>
                   <div className="relative inline-block w-14 h-7 align-middle select-none transition duration-200 ease-in">
                       <input 
                         type="checkbox" 
                         name="toggle" 
                         id="biometric-toggle" 
                         checked={biometricEnabled}
                         onChange={() => {
                           if (!biometricEnabled) {
                             setScreen(AppScreen.BIOMETRIC_ENABLE);
                           } else {
                             setBiometricEnabled(false);
                           }
                         }}
                         className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white shadow-md appearance-none cursor-pointer top-0.5 left-0.5 checked:translate-x-7 transition-transform duration-300 ease-in-out z-10" 
                       />
                       <label htmlFor="biometric-toggle" className={`toggle-label block overflow-hidden h-7 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${biometricEnabled ? 'bg-primary shadow-inner shadow-primary/20' : 'bg-gray-200 shadow-inner'}`}></label>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-xl shadow-gray-200/40 group" onClick={() => showToast("Password Change Link Sent to Email")}>
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 transition-all group-hover:scale-110 shadow-sm"><Icons.Lock className="w-7 h-7" /></div>
                      <div>
                         <h4 className="font-black text-gray-900 text-[15px] tracking-tight">Change Password</h4>
                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 opacity-60">Update login details</p>
                      </div>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Icons.ChevronRight className="w-5 h-5" />
                   </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-xl shadow-gray-200/40 group" onClick={() => setScreen(AppScreen.LOGGED_IN_DEVICES)}>
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 transition-all group-hover:scale-110 shadow-sm"><Icons.Smartphone className="w-7 h-7" /></div>
                      <div>
                         <h4 className="font-black text-gray-900 text-[15px] tracking-tight">Recent Devices</h4>
                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1 opacity-60">Manage logged in devices</p>
                      </div>
                   </div>
                   <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Icons.ChevronRight className="w-5 h-5" />
                   </div>
                </div>
             </div>
         </div>
      </div>
    );
  }

  if (screen === AppScreen.CHANGE_PIN) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-slide-up items-center">
         <div className="w-full max-w-xl flex flex-col h-full mx-auto">
            <BackHeader title="Change PIN" subtitle="Update Transaction Security" onBack={() => setScreen(AppScreen.SECURITY)} />
            <div className="p-8 sm:p-12 flex flex-col items-center flex-1 overflow-y-auto no-scrollbar pb-24">
               <div className="w-24 h-24 bg-primary/10 rounded-[40px] flex items-center justify-center text-primary mb-8 shadow-2xl shadow-primary/10 relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-[40px] blur-xl group-hover:blur-2xl transition-all"></div>
                  <Icons.Lock className="w-12 h-12 relative z-10" />
               </div>
               <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">Set New PIN</h2>
               <p className="text-gray-500 text-[13px] mb-12 text-center font-medium max-w-[280px] leading-relaxed">Enter a new 4-digit PIN to secure your transactions and withdrawals.</p>
               
               <div className="flex gap-5 justify-center mb-16 w-full">
                  {[0, 1, 2, 3].map(i => (
                     <div key={i} className={`w-16 h-16 rounded-[24px] border-2 flex items-center justify-center text-3xl font-black transition-all duration-300 ${tempPin.length > i ? 'border-primary bg-primary text-white shadow-2xl shadow-primary/30 scale-110' : 'border-gray-100 bg-white text-gray-900 shadow-xl shadow-gray-200/40'}`}>
                        {tempPin.length > i ? '•' : ''}
                     </div>
                  ))}
               </div>
               
               <div className="grid grid-cols-3 gap-5 w-full max-w-[340px] mt-auto">
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
                        className={`h-16 rounded-[24px] flex items-center justify-center text-xl font-black active:scale-90 transition-all ${num === '' ? 'invisible' : num === 'del' ? 'bg-gray-50 text-gray-500 hover:bg-gray-100 shadow-sm' : 'bg-white shadow-xl shadow-gray-200/40 border border-gray-100 text-gray-900 hover:border-primary/30'}`}
                     >
                        {num === 'del' ? <Icons.Trash className="w-6 h-6" /> : num}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (screen === AppScreen.LOGGED_IN_DEVICES) {
    const devices = [
      { id: 1, name: 'iPhone 13', location: 'Lagos, Nigeria', time: 'Active Now', current: true, ip: '102.89.34.121', browser: 'Mobile App' },
      { id: 2, name: 'MacBook Pro 14"', location: 'Abuja, Nigeria', time: '2 hours ago', current: false, ip: '197.210.64.15', browser: 'Chrome on macOS' },
      { id: 3, name: 'Samsung Galaxy S22', location: 'Ibadan, Nigeria', time: 'Oct 24, 2023', current: false, ip: '41.203.78.22', browser: 'Mobile App' },
    ];

    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-slide-up items-center">
         <div className="w-full max-w-xl flex flex-col h-full mx-auto">
            <BackHeader title="Recent Devices" subtitle="Manage Active Sessions" onBack={() => setScreen(AppScreen.SECURITY)} />
            <div className="p-6 space-y-4 overflow-y-auto no-scrollbar pb-24">
               <div className="bg-green-50/50 p-5 rounded-[32px] border border-green-100/50 flex gap-4 items-start mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-sm"><Icons.ShieldCheck className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <h5 className="text-[11px] font-black text-green-900 uppercase tracking-wider mb-1">Security Tip</h5>
                    <p className="text-[10px] text-green-700/80 font-bold leading-relaxed">We recommend logging out of any devices you don't recognize. For extra security, change your password if you suspect unauthorized access.</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4 mb-1">Active Sessions</h3>
                  {devices.map((device) => (
                     <div key={device.id} className="bg-white p-5 rounded-[40px] border border-gray-100 flex items-center justify-between shadow-2xl shadow-gray-200/40 group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-5">
                           <div className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-all group-hover:scale-110 ${device.current ? 'bg-primary/10 text-primary shadow-sm' : 'bg-gray-50 text-gray-400'}`}>
                              {device.name.includes('MacBook') ? <Icons.Monitor className="w-7 h-7" /> : <Icons.Smartphone className="w-7 h-7" />}
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                 <h4 className="font-black text-gray-900 text-[15px] tracking-tight">{device.name}</h4>
                                 {device.current && <span className="text-[8px] font-black bg-primary text-white px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">Current</span>}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest opacity-60">{device.location} • {device.ip}</p>
                                <p className="text-[9px] text-gray-500 font-bold">{device.browser} • <span className={device.current ? 'text-primary' : ''}>{device.time}</span></p>
                              </div>
                           </div>
                        </div>
                        {!device.current && (
                           <button 
                             onClick={() => showToast(`Logged out from ${device.name}`)}
                             className="w-11 h-11 rounded-2xl bg-gray-50 text-gray-500 flex items-center justify-center active:scale-90 transition-all hover:bg-gray-100 shadow-sm"
                           >
                              <Icons.LogOut className="w-5 h-5" />
                           </button>
                        )}
                     </div>
                  ))}
               </div>

               <div className="pt-8 px-2">
                  <button 
                    onClick={() => showToast("All other sessions logged out")}
                    className="w-full h-16 rounded-[28px] bg-white border-2 border-red-50 text-gray-500 font-black text-[13px] uppercase tracking-widest hover:bg-gray-50 active:scale-[0.98] transition-all shadow-xl shadow-gray-100/20 flex items-center justify-center gap-3"
                  >
                    <Icons.Trash className="w-5 h-5" />
                    Log Out All Other Sessions
                  </button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return null;
};
