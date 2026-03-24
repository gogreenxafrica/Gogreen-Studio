import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';
import { BrandPattern } from '../components/BrandPattern';
import { Confetti } from '../components/Confetti';
import { InsufficientBalanceModal } from '../components/InsufficientBalanceModal';

interface WithdrawScreenProps {
  setIsGlobalLoading: (loading: boolean) => void;
  setGlobalLoadingMessage: (msg: string) => void;
}

export const WithdrawScreen: React.FC<WithdrawScreenProps> = ({
  setIsGlobalLoading,
  setGlobalLoadingMessage
}) => {
  const { 
    screen,
    setScreen, 
    walletBalance, 
    setWalletBalance, 
    withdrawAmount, 
    setWithdrawAmount,
    hideBalance,
    completeChecklistTask,
    coins,
    areCryptoWalletsGenerated
  } = useAppContext();

  const [isSelectingBank, setIsSelectingBank] = useState(false);
  const [isNewBeneficiary, setIsNewBeneficiary] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  
  interface SwapDetail {
    fromCoin: string;
    amount: string;
    value: string;
  }
  const [swapDetails, setSwapDetails] = useState<SwapDetail[]>([]);
  
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
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center justify-center p-6 text-center relative overflow-hidden">
        <BrandPattern opacity={0.05} size={80} animate={true} className="absolute inset-0 pointer-events-none" />
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <Icons.Bank className="w-10 h-10 text-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">Processing Withdrawal</h2>
        <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto">Sending funds to your bank account. This usually takes a few seconds...</p>
      </div>
    );
  }

  if (screen === AppScreen.WITHDRAW_FAILED) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center justify-center p-6 text-center relative overflow-hidden">
        <BrandPattern opacity={0.05} size={80} animate={true} className="absolute inset-0 pointer-events-none" />
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 animate-shake">
          <Icons.Alert className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">Withdrawal Failed</h2>
        <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto mb-8">We couldn't process your withdrawal at this time. Please try again or contact support.</p>
        
        <div className="w-full max-w-xs space-y-3">
          <Button 
            onClick={() => setScreen(AppScreen.WITHDRAW_MONEY)}
            className="w-full !h-14 !rounded-[24px] !bg-gray-500 shadow-xl shadow-gray-500/20 !text-xs font-black uppercase tracking-[0.2em]"
          >
            Try Again
          </Button>
          <button onClick={() => setScreen(AppScreen.HOME)} className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-600 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (screen === AppScreen.WITHDRAW_REJECTED) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center justify-center p-6 text-center relative overflow-hidden">
        <BrandPattern opacity={0.05} size={80} animate={true} className="absolute inset-0 pointer-events-none" />
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
          <Icons.Alert className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">Withdrawal Rejected</h2>
        <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto mb-8">Your withdrawal was rejected by the bank. Please check your details and try again.</p>
        
        <div className="w-full max-w-xs space-y-3">
          <Button 
            onClick={() => setScreen(AppScreen.WITHDRAW_MONEY)}
            className="w-full !h-14 !rounded-[24px] !bg-gray-500 shadow-xl shadow-orange-500/20 !text-xs font-black uppercase tracking-[0.2em]"
          >
            Edit Details
          </Button>
          <button onClick={() => setScreen(AppScreen.HOME)} className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-600 transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (screen === AppScreen.WITHDRAW_SUCCESS) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center justify-center p-6 text-center relative overflow-hidden">
        <Confetti />
        <BrandPattern opacity={0.05} size={80} animate={true} className="absolute inset-0 pointer-events-none" />
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-primary/40 mx-auto animate-bounce-subtle">
              <Icons.Check className="w-12 h-12 stroke-[3]" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Withdrawal Successful!</h2>
            <p className="text-gray-500 font-medium">Your funds are on their way to your bank account.</p>
          </div>

          <div className="border-2 border-dashed border-primary/50 rounded-[32px] p-8 text-center mb-8 relative z-10 bg-primary/5">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Amount Sent</p>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
              ₦ {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h1>
          </div>

          <div className="bg-white p-6 rounded-[40px] border border-gray-100 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Bank</span>
              <span className="text-sm font-black text-gray-900">{isNewBeneficiary ? newBankName : selectedBank.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Reference</span>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">WD-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              onClick={() => {
                setScreen(AppScreen.HOME);
                setWithdrawAmount('');
              }}
              className="w-full !h-14 !rounded-[24px] shadow-xl shadow-primary/20 !text-xs font-black uppercase tracking-[0.2em]"
            >
              Back to Home
            </Button>
            <button className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-primary transition-colors">
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSelectingBank) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center">
        <div className="w-full max-w-xl flex flex-col h-full mx-auto">
            <BackHeader title="Select Bank" subtitle="Choose Destination" onBack={() => setIsSelectingBank(false)} />
            <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-24">
              {savedBanks.map((bank, index) => (
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
              <button onClick={() => setScreen(AppScreen.ADD_BANK)} className="w-full p-6 rounded-[32px] border-2 border-dashed border-gray-200 flex items-center justify-center gap-3 text-gray-400 font-black text-xs hover:border-primary hover:text-primary transition-all active:scale-[0.98] bg-white/50 hover:bg-white shadow-sm mt-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-xl leading-none">+</div>
                  <span className="uppercase tracking-[0.3em] text-[10px]">Add New Bank</span>
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center">
      <div className="w-full max-w-xl flex flex-col h-full mx-auto">
          <BackHeader title="Withdraw" subtitle="Send Funds to Bank" onBack={() => setScreen(AppScreen.HOME)} />
          
          <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-24">
              {/* Balance Card */}
              <div className="bg-white p-6 rounded-[40px] shadow-2xl shadow-gray-200/40 border border-gray-100 text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-all"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Available Balance</p>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter">₦ {hideBalance ? '••••••' : walletBalance.toLocaleString()}</h2>
              </div>

              {/* Input Section */}
              <div className="space-y-5">
                  <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Amount to Withdraw</label>
                      <Input 
                          type="number" 
                          placeholder="0.00"
                          prefix="₦"
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
                              className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-4 py-2 rounded-2xl active:scale-90 transition-all hover:bg-primary/20"
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
                            className="px-4 py-2 rounded-full bg-white border border-gray-100 text-[10px] font-black text-gray-500 hover:border-primary/30 hover:text-primary transition-all active:scale-90"
                          >
                            ₦{amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                  </div>

                  {/* Bank Selection */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Destination Bank</label>
                      <button onClick={() => setIsNewBeneficiary(!isNewBeneficiary)} className="text-[8px] font-black text-primary uppercase tracking-widest">
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
                          <button className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
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
                      <span className="text-sm font-black text-white">₦{fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/20 relative z-10">
                      <span className="text-[10px] text-white/80 font-black uppercase tracking-[0.3em]">Total to Receive</span>
                      <span className="text-xl font-black text-white tracking-tighter">₦ {hideBalance ? '••••••' : totalToReceive.toLocaleString()}</span>
                    </div>
                  </div>
              </div>

              <div className="mt-auto pt-8">
                  <Button 
                      disabled={!withdrawAmount || amount < 1000 || (isNewBeneficiary && (!newBankName || newAccountNumber.length < 10 || (saveBeneficiary && !beneficiaryName)))}
                      onClick={() => {
                          // Calculate total portfolio value
                          const totalPortfolioValue = coins.reduce((acc, coin) => {
                              if (coin.id === 'ngn') return acc + coin.balance;
                              return acc + (coin.balance * coin.rate);
                          }, 0);

                          if (amount > totalPortfolioValue) {
                              toast.error(`Insufficient funds. Total portfolio value: ₦${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, {
                                  style: { background: '#EF4444', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                              });
                              return;
                          }

                          if (amount > walletBalance) {
                              if (!areCryptoWalletsGenerated) {
                                  toast.error("Please generate your crypto wallet addresses first to enable auto-swap.", {
                                      style: { background: '#EF4444', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
                                  });
                                  return;
                              }

                              // Calculate what to swap
                              let deficit = amount - walletBalance;
                              const details: SwapDetail[] = [];
                              
                              // Sort coins by value descending to use largest assets first
                              const cryptoCoins = coins
                                  .filter(c => c.id !== 'ngn' && c.balance > 0)
                                  .sort((a, b) => (b.balance * b.rate) - (a.balance * a.rate));
                              
                              for (const coin of cryptoCoins) {
                                  if (deficit <= 0) break;
                                  const coinValue = coin.balance * coin.rate;
                                  const takeValue = Math.min(deficit, coinValue);
                                  const takeAmount = takeValue / coin.rate;
                                  
                                  // Use up to 8 decimal places, removing trailing zeros if possible
                                  const formattedAmount = takeAmount.toFixed(8).replace(/\.?0+$/, "");
                                  
                                  details.push({
                                      fromCoin: coin.symbol,
                                      amount: formattedAmount,
                                      value: `₦${takeValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                                  });
                                  
                                  deficit -= takeValue;
                              }
                              
                              setSwapDetails(details);
                              setShowInsufficientModal(true);
                              return;
                          }

                          if (amount < 1000) return;
                          
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
                      }}
                      className="w-full !h-16 !rounded-[28px] !bg-primary shadow-2xl shadow-primary/10 !text-xs font-black uppercase tracking-[0.2em] relative overflow-hidden"
                  >
                      {amount < 1000 ? 'Min Withdrawal: ₦1,000' : 'Confirm Withdrawal'}
                  </Button>
                  <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
                    <Icons.Shield className="w-3 h-3" />
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em]">
                      Secure Instant Settlement
                    </p>
                  </div>
              </div>
          </div>
      </div>
      
      <InsufficientBalanceModal 
        isOpen={showInsufficientModal}
        onClose={() => setShowInsufficientModal(false)}
        onConfirm={() => {
          setShowInsufficientModal(false);
          setScreen(AppScreen.WITHDRAW_PROCESSING);
          
          setTimeout(() => {
              setWalletBalance(walletBalance - amount);
              setScreen(AppScreen.WITHDRAW_SUCCESS);
              completeChecklistTask('withdraw');
          }, 3000);
        }}
        requiredAmount={amount}
        swapDetails={swapDetails}
      />
    </div>
  );
};
