import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { useResetFlow } from '../hooks/useResetFlow';
import { BackHeader } from '../components/BackHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';
import { BrandPattern } from '../components/BrandPattern';
import { Confetti } from '../components/Confetti';
import { PrivacyText } from '../../components/PrivacyText';

interface WithdrawScreenProps {
  setIsGlobalLoading: (loading: boolean) => void;
  setGlobalLoadingMessage: (msg: string) => void;
  onProtectedNavigation?: (screen: AppScreen) => void;
  isModal?: boolean;
}

export const WithdrawScreen: React.FC<WithdrawScreenProps> = ({
  setIsGlobalLoading,
  setGlobalLoadingMessage,
  onProtectedNavigation,
  isModal,
}) => {
  const { 
    screen,
    setScreen, 
    walletBalance, 
    setWalletBalance, 
    withdrawAmount, 
    setWithdrawAmount,
    hideBalance,
    setHideBalance,
    bonusClaimed,
    currency,
    setCurrency,
    completeChecklistTask,
    coins,
    areCryptoWalletsGenerated,
    setShowPinModal,
    setOnPinSuccess,
    setPinMode,
    withdrawAccountNumber,
    setSelectedTx,
    goBack
  } = useAppContext();

  const resetFlow = useResetFlow();

  useEffect(() => {
    resetFlow();
  }, []);

  const [isSelectingBank, setIsSelectingBank] = useState(false);
  const [isNewBeneficiary, setIsNewBeneficiary] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  
  const [selectedBank, setSelectedBank] = useState({
    id: '1', name: 'Kuda Bank', account: '201****890', owner: 'Hassan Kehinde', icon: 'K'
  });

  const savedBanks = [
    { id: '1', name: 'Kuda Bank', account: '201****890', owner: 'Hassan Kehinde', icon: 'K' },
    { id: '2', name: 'Guaranty Trust Bank', account: '012****789', owner: 'Hassan Kehinde', icon: 'GT' },
    { id: '3', name: 'Opay', account: '801****234', owner: 'Hassan Kehinde', icon: 'O' }
  ];

  const fee = 25;
  const amount = parseFloat(withdrawAmount || '0');
  const totalToReceive = Math.max(0, amount - fee);

  const showToast = (message: string) => toast.success(message, {
    style: { background: '#10B981', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
  });

  if (screen === AppScreen.WITHDRAW_PROCESSING) {
    return (
      <div className={`flex-1 flex flex-col ${isModal ? 'bg-white' : 'bg-green-50/30'} animate-fade-in items-center justify-center p-6 text-center relative overflow-hidden w-full h-full min-h-0`}>
        <BrandPattern opacity={0.05} size={80} animate={true} className="absolute inset-0 pointer-events-none" />
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <img src="/assets/logos/gogreen-dark-green-logomark.png" alt="Processing..." className="w-12 h-12 object-contain animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">Processing Withdrawal</h2>
        <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto">Sending funds to your bank account. This usually takes a few seconds...</p>
      </div>
    );
  }

  if (screen === AppScreen.WITHDRAW_FAILED) {
    return (
      <div className={`flex-1 flex flex-col ${isModal ? 'bg-white' : 'bg-green-50/30'} animate-fade-in items-center justify-center p-6 text-center relative overflow-hidden w-full h-full min-h-0`}>
        <BrandPattern opacity={0.05} size={80} animate={true} className="absolute inset-0 pointer-events-none" />
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 animate-shake">
          <Icons.Alert className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">Withdrawal Failed</h2>
        <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto mb-8">We couldn't process your withdrawal at this time. Please try again or contact support.</p>
        
        <div className="w-full max-w-xs space-y-3 flex flex-col items-center">
          <Button 
            onClick={() => {
              if (onProtectedNavigation) {
                onProtectedNavigation(AppScreen.WITHDRAW_MONEY);
              } else {
                setScreen(AppScreen.WITHDRAW_MONEY);
              }
            }}
            className="px-12 !h-14 !rounded-[24px] !bg-gray-500 shadow-xl shadow-gray-500/20 !text-xs font-black uppercase tracking-[0.2em]"
          >
            Try Again
          </Button>
          <button onClick={goBack} className="w-fit px-6 h-11 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-600 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (screen === AppScreen.WITHDRAW_REJECTED) {
    return (
      <div className={`flex-1 flex flex-col ${isModal ? 'bg-white' : 'bg-green-50/30'} animate-fade-in items-center justify-center p-6 text-center relative overflow-hidden w-full h-full min-h-0`}>
        <BrandPattern opacity={0.05} size={80} animate={true} className="absolute inset-0 pointer-events-none" />
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
          <Icons.Alert className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">Withdrawal Rejected</h2>
        <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto mb-8">Your withdrawal was rejected by the bank. Please check your details and try again.</p>
        
        <div className="w-full max-w-xs space-y-3 flex flex-col items-center">
          <Button 
            onClick={() => {
              if (onProtectedNavigation) {
                onProtectedNavigation(AppScreen.WITHDRAW_MONEY);
              } else {
                setScreen(AppScreen.WITHDRAW_MONEY);
              }
            }}
            className="px-12 !h-14 !rounded-[24px] !bg-gray-500 shadow-xl shadow-orange-500/20 !text-xs font-black uppercase tracking-[0.2em]"
          >
            Edit Details
          </Button>
          <button onClick={goBack} className="w-fit px-6 h-11 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-600 transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (screen === AppScreen.WITHDRAW_SUCCESS) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 items-center animate-fade-in relative overflow-hidden w-full h-full min-h-0">
           <Confetti />
           {/* Success Header with Gradient Background */}
           <div className="w-full bg-primary pt-12 pb-20 px-6 text-center relative overflow-hidden">
              <BrandPattern opacity={0.15} size={48} animate={true} color="white" className="absolute inset-0 pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center mb-5 shadow-2xl animate-epic-bounce mx-auto text-primary border-4 border-white/20">
                  <Icons.Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-white mb-1.5 tracking-tight">Withdrawal Successful!</h2>
                <p className="text-white/70 text-[11px] font-black uppercase tracking-[0.2em]">Transaction ID: WTH-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
           </div>

           {/* Details Card - Floating */}
           <div className="w-full max-w-md px-4 -mt-12 relative z-20 flex-1 overflow-y-auto no-scrollbar pb-24 min-h-0">
               <div className="bg-white rounded-[40px] p-6 shadow-2xl shadow-gray-200/60 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <div className="border-2 border-dashed border-primary/50 rounded-[24px] p-6 text-center mb-8 relative z-10 bg-primary/5">
                    <h1 className="text-4xl font-black text-gray-700 tracking-tighter">
                      ₦{amount.toLocaleString()} <span className="text-primary">NGN</span>
                    </h1>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                      <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">Bank Name</span>
                      <span className="font-black text-gray-900 text-sm">{isNewBeneficiary ? newBankName : selectedBank.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                      <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">Account Number</span>
                      <span className="font-black text-gray-900 text-sm">{isNewBeneficiary ? newAccountNumber : withdrawAccountNumber}</span>
                    </div>

                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                      <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">Fee</span>
                      <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100">Free</div>
                    </div>

                    <div className="flex justify-between items-center py-4">
                      <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">Status</span>
                      <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full border border-green-100">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.15em]">Completed</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-3 relative z-10 flex flex-col items-center">
                    <Button variant="primary" onClick={() => { setScreen(AppScreen.HOME); setWithdrawAmount(''); }} className="px-12 !h-14 !rounded-[24px] !bg-primary shadow-xl shadow-primary/20 !text-xs font-black uppercase tracking-[0.2em]">Back to Dashboard</Button>
                    <div className="flex gap-3 w-full justify-center">
                      <Button variant="outline" className="px-6 !h-12 !rounded-2xl !text-[10px] font-black uppercase tracking-widest border-gray-100" onClick={() => {
                        const tx = {
                          id: Date.now().toString(),
                          type: 'Withdrawal',
                          amount: `₦${amount.toLocaleString()}`,
                          fiatAmount: `₦${amount.toLocaleString()}`,
                          cryptoAmount: 'N/A',
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                          status: 'Success',
                          ref: `TXN-${Math.floor(Math.random() * 1000000000)}`,
                          bankName: (isNewBeneficiary ? newBankName : selectedBank.name) || 'N/A',
                          accountNumber: (isNewBeneficiary ? newAccountNumber : withdrawAccountNumber) || 'N/A',
                          network: 'N/A',
                          coinName: 'Naira',
                          unitAmount: '1 NGN = 1 NGN',
                          platformFee: 'FREE',
                          explorerLink: ''
                        };
                        setSelectedTx(tx);
                        setScreen(AppScreen.TRANSACTION_DETAILS);
                      }}>View Details</Button>
                      <Button variant="outline" className="px-6 !h-12 !rounded-2xl !text-[10px] font-black uppercase tracking-widest border-gray-100" onClick={() => {
                        const tx = {
                          id: Date.now().toString(),
                          type: 'Withdrawal',
                          amount: `₦${amount.toLocaleString()}`,
                          fiatAmount: `₦${amount.toLocaleString()}`,
                          cryptoAmount: 'N/A',
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                          status: 'Success',
                          ref: `TXN-${Math.floor(Math.random() * 1000000000)}`,
                          bankName: (isNewBeneficiary ? newBankName : selectedBank.name) || 'N/A',
                          accountNumber: (isNewBeneficiary ? newAccountNumber : withdrawAccountNumber) || 'N/A',
                          network: 'N/A',
                          coinName: 'Naira',
                          unitAmount: '1 NGN = 1 NGN',
                          platformFee: 'FREE',
                          explorerLink: ''
                        };
                        setSelectedTx(tx);
                        setScreen(AppScreen.TRANSACTION_DETAILS);
                      }}>View Details</Button>
                    </div>
                  </div>
               </div>

               {/* Extra Info */}
               <div className="mt-8 text-center pb-8">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] leading-relaxed px-8 opacity-40">
                    Funds are typically available within 5-15 minutes depending on your bank's network.
                  </p>
               </div>
           </div>
      </div>
    );
  }

  if (isSelectingBank) {
    return (
      <div className={`flex-1 flex flex-col ${isModal ? 'bg-white' : 'bg-green-50/30'} animate-fade-in items-center w-full h-full overflow-hidden min-h-0`}>
        <div className="w-full max-w-xl flex flex-col flex-1 min-h-0 mx-auto">
            {!isModal && <BackHeader title="Select Bank" subtitle="Choose Destination" onBack={goBack} />}
            {isModal && (
              <div className="px-6 pt-8 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Select Bank</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Choose Destination</p>
                </div>
                <button onClick={goBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <Icons.X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-24">
              {savedBanks?.map((bank, index) => (
                  <div 
                     key={bank.id} 
                     onClick={() => { 
                        setSelectedBank(bank);
                        setIsSelectingBank(false);
                     }} 
                     className="p-5 bg-white rounded-[32px] flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md animate-slide-up"
                     style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                  >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-700 font-black text-lg border border-gray-100 shadow-sm">
                          {bank.icon === 'K' ? <Icons.Bank className="w-6 h-6" /> : bank.icon}
                      </div>
                      <div className="flex-1">
                          <h4 className="font-black text-[13px] text-gray-900 tracking-tight">{bank.name}</h4>
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] mt-0.5 opacity-60">{bank.account} • {bank.owner}</p>
                      </div>
                  </div>
              ))}
              <button onClick={() => setScreen(AppScreen.ADD_BANK)} className="mx-auto px-8 py-6 rounded-[32px] border-2 border-dashed border-gray-200 flex items-center justify-center gap-3 text-gray-400 font-black text-xs hover:border-primary hover:text-primary transition-all active:scale-[0.98] bg-white/50 hover:bg-white shadow-sm mt-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-xl leading-none">+</div>
                  <span className="uppercase tracking-[0.3em] text-[10px]">Add New Bank</span>
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col ${isModal ? 'bg-white' : 'bg-white'} animate-fade-in items-center w-full h-full overflow-hidden min-h-0`}>
      <div className="w-full max-w-xl flex flex-col flex-1 min-h-0 mx-auto">
          {!isModal && <BackHeader title="Withdraw" subtitle="Send Funds to Bank" onBack={goBack} />}
          
          {isModal && (
            <div className="px-6 pt-8 pb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Withdraw</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Send Funds to Bank</p>
              </div>
              <button onClick={goBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-24">
              {/* Balance Card */}
              <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Available Balance</p>
                <div className="flex flex-row items-baseline justify-center gap-1.5">
                  <span className="text-sm font-black text-gray-900">{currency === 'GG' ? 'GG' : '$'}</span>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
                    {(currency === 'GG' ? (Number(walletBalance || 0) + (bonusClaimed ? 3000 : 0)) : ((Number(walletBalance || 0) + (bonusClaimed ? 3000 : 0)) / 1710)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-5">
                  <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Amount to Withdraw</label>
                      <Input 
                          type="number" 
                          placeholder="0.00"
                          prefix="GG"
                          variant="glass-light"
                          value={withdrawAmount}
                          onChange={(e) => {
                              const val = e.target.value;
                              if (/^\d*\.?\d*$/.test(val)) {
                                  setWithdrawAmount(val);
                              }
                          }}
                          inputClassName="!h-16 !text-2xl !font-black !rounded-[28px] !border-gray-100 shadow-sm focus:!border-primary/30 !text-gray-900 !pr-20"
                          rightElement={
                            <button 
                              onClick={() => setWithdrawAmount(walletBalance.toString())}
                              className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-4 h-11 flex items-center rounded-2xl active:scale-90 transition-all hover:bg-primary/20"
                            >
                              Max
                            </button>
                          }
                      />
                      <div className="flex gap-2 mt-2 ml-1">
                        {[1000, 5000, 10000, 50000].map(amt => (
                          <button 
                            key={amt}
                            onClick={() => setWithdrawAmount(amt.toString())}
                            className="px-4 h-11 rounded-full bg-white border border-gray-100 text-[10px] font-black text-gray-500 hover:border-primary/30 hover:text-primary transition-all active:scale-90"
                          >
                            GG{amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                  </div>

                  {/* Bank Selection */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Destination Bank</label>
                      <button onClick={() => setIsNewBeneficiary(!isNewBeneficiary)} className="min-h-[44px] px-2 text-[8px] font-black text-primary uppercase tracking-widest">
                        {isNewBeneficiary ? 'Saved Banks' : 'New Bank'}
                      </button>
                    </div>

                    {isNewBeneficiary ? (
                      <div className="space-y-4 animate-fade-in">
                        <Input 
                            placeholder="Bank Name (e.g. Access Bank)"
                            value={newBankName}
                            onChange={(e) => setNewBankName(e.target.value)}
                            inputClassName="!h-14 !text-sm !font-black !rounded-[24px] !border-gray-100 shadow-sm focus:!border-primary/30 !text-gray-900"
                        />
                        <Input 
                            placeholder="Account Number"
                            value={newAccountNumber}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setNewAccountNumber(val);
                            }}
                            maxLength={10}
                            inputClassName="!h-14 !text-sm !font-black !rounded-[24px] !border-gray-100 shadow-sm focus:!border-primary/30 !text-gray-900"
                        />
                        
                        {newBankName && newAccountNumber.length === 10 && (
                          <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
                              <label 
                                  className="flex items-center gap-3 cursor-pointer group"
                                  onClick={() => setSaveBeneficiary(!saveBeneficiary)}
                              >
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${saveBeneficiary ? 'bg-primary border-primary text-white' : 'border-gray-300 text-transparent group-hover:border-primary'}`}>
                                      <Icons.Check className="w-3 h-3" />
                                  </div>
                                  <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Save as Beneficiary</span>
                              </label>
                              
                              {saveBeneficiary && (
                                  <div className="animate-fade-in" onClick={(e) => e.stopPropagation()}>
                                      <Input 
                                          placeholder="Beneficiary Name (e.g. My Access Bank)"
                                          value={beneficiaryName}
                                          onChange={(e) => setBeneficiaryName(e.target.value)}
                                          inputClassName="!h-12 !text-xs !rounded-[16px] !bg-gray-50/50 border-gray-100 !text-gray-900"
                                      />
                                  </div>
                              )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div 
                        onClick={() => setIsSelectingBank(true)}
                        className="bg-white p-5 rounded-[32px] border border-gray-100 flex items-center gap-4 shadow-xl shadow-gray-200/40 group hover:border-primary/20 transition-all cursor-pointer"
                      >
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-700 font-black text-lg border border-gray-100 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                              {selectedBank.icon === 'K' ? <Icons.Bank className="w-6 h-6" /> : selectedBank.icon}
                          </div>
                          <div className="flex-1">
                              <h4 className="font-black text-[13px] text-gray-900 tracking-tight">{selectedBank.name}</h4>
                              <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.15em] mt-0.5 opacity-60">{selectedBank.account} • {selectedBank.owner}</p>
                          </div>
                          <button className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                            <Icons.ChevronRight className="w-4 h-4" />
                          </button>
                      </div>
                    )}
                  </div>

                  {/* Fee Breakdown */}
                  <div className="bg-gray-900 p-6 rounded-[40px] space-y-4 border border-gray-900 shadow-2xl shadow-primary/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all duration-700"></div>
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.3em]">Processing Fee</span>
                      <span className="text-sm font-black text-white">GG{fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/20 relative z-10">
                      <span className="text-[10px] text-white/80 font-black uppercase tracking-[0.3em]">Total to Receive</span>
                      <span className="text-xl font-black text-white tracking-tighter">GG <PrivacyText hide={hideBalance}>{totalToReceive.toLocaleString()}</PrivacyText></span>
                    </div>
                  </div>
              </div>

              <div className="mt-auto pt-8 flex flex-col items-center gap-4">
                  <Button 
                      disabled={!withdrawAmount || amount < 1000 || (isNewBeneficiary && (!newBankName || newAccountNumber.length < 10 || (saveBeneficiary && !beneficiaryName)))}
                      onClick={() => {
                          // Calculate total portfolio value
                          const totalPortfolioValue = coins.reduce((acc, coin) => {
                              if (coin.id === 'ngn') return acc + coin.balance;
                              return acc + (coin.balance * coin.rate);
                          }, 0);

                          if (amount > totalPortfolioValue) {
                              toast.error(`Insufficient funds. Total portfolio value: GG${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, {
                                  style: { background: '#EF4444', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                              });
                              return;
                          }

                          if (amount > walletBalance) {
                              toast.error("Insufficient balance in your Naira wallet.", {
                                  style: { background: '#EF4444', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                              });
                              return;
                          }

                          if (amount < 1000) return;
                          
                          setOnPinSuccess(() => {
                              setScreen(AppScreen.WITHDRAW_PROCESSING);
                              
                              setTimeout(() => {
                                  // Simulate random outcome
                                  const rand = Math.random();
                                  if (rand > 0.3) {
                                      setWalletBalance(walletBalance - amount);
                                      setScreen(AppScreen.WITHDRAW_SUCCESS);
                                      completeChecklistTask('withdraw');
                                  } else if (rand > 0.15) {
                                      setScreen(AppScreen.WITHDRAW_FAILED);
                                  } else {
                                      setScreen(AppScreen.WITHDRAW_REJECTED);
                                  }
                              }, 3000);
                          });
                          setPinMode('verify');
                          setShowPinModal(true);
                      }}
                      className="px-12 !h-16 !rounded-[28px] !bg-primary shadow-2xl shadow-primary/10 !text-xs font-black uppercase tracking-[0.2em] relative overflow-hidden w-full max-w-xs"
                  >
                      {amount < 1000 ? 'Min Withdrawal: GG 1,000' : 'Confirm Withdrawal'}
                  </Button>
                  <div className="flex items-center justify-center gap-2 opacity-40">
                    <Icons.Shield className="w-3 h-3" />
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em]">
                      Secure Instant Settlement
                    </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
