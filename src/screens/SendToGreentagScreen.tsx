import React, { useState } from 'react';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';
import { Confetti } from '../components/Confetti';
import { BrandPattern } from '../components/BrandPattern';

interface SendToGreentagScreenProps {
  isModal?: boolean;
}

enum GreentagStep {
  SEARCH,
  PROFILE,
  AMOUNT,
  CONFIRM,
  PROCESSING,
  SUCCESS,
  ERROR
}

export const SendToGreentagScreen: React.FC<SendToGreentagScreenProps> = ({ isModal }) => {
  const { 
    setScreen, 
    walletBalance, 
    setWalletBalance, 
    addNotification,
    setShowPinModal,
    setOnPinSuccess,
    setPinMode,
    savedBeneficiaries,
    setSavedBeneficiaries,
    goBack
  } = useAppContext();
  const [greentag, setGreentag] = useState('');
  const [isFound, setIsFound] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState<GreentagStep>(GreentagStep.SEARCH);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');

  const handleConfirmPayment = () => {
    setOnPinSuccess(() => {
      setStep(GreentagStep.PROCESSING);
      setTimeout(() => {
        // Simulate a potential error (e.g. 10% chance)
        if (Math.random() < 0.1) {
          setError("The transaction was declined by the network. Please try again later.");
          setStep(GreentagStep.ERROR);
          return;
        }

        setWalletBalance(walletBalance - Number(amount));
        addNotification({
          title: 'Payment Successful',
          desc: `You sent ₦${Number(amount).toLocaleString()} to ₦${dummyUser.tag}`,
          type: 'transaction'
        });

        // Save beneficiary if requested
        if (saveBeneficiary) {
          const newBeneficiary = {
            id: Date.now().toString(),
            name: beneficiaryName || dummyUser.name,
            value: dummyUser.tag,
            type: 'username',
            avatar: dummyUser.avatar
          };
          setSavedBeneficiaries(prev => {
            if (prev.find(b => b.value === dummyUser.tag)) return prev;
            return [newBeneficiary, ...prev];
          });
        }

        setStep(GreentagStep.SUCCESS);
      }, 2500);
    });
    setPinMode('verify');
    setShowPinModal(true);
  };

  const dummyUser = {
    tag: 'johndoe',
    name: 'John Doe',
    title: 'Senior Trader',
    rating: '5.0',
    trades: '1.2k',
    joined: '24',
    avatar: 'https://picsum.photos/seed/johndoe/200/200',
    cover: 'https://picsum.photos/seed/abstract/600/300',
    phone: '08031234567',
    email: 'johndoe@example.com'
  };

  const getHeaderProps = () => {
    switch (step) {
      case GreentagStep.SEARCH:
        return { title: "Send to a User", subtitle: "Enter recipient's Greentag, phone or email", onBack: goBack };
      case GreentagStep.PROFILE:
        return { title: "Recipient Profile", subtitle: "Verify details", onBack: () => setStep(GreentagStep.SEARCH) };
      case GreentagStep.AMOUNT:
        return { title: "Enter Amount", subtitle: "How much are you sending?", onBack: () => setStep(GreentagStep.PROFILE) };
      case GreentagStep.CONFIRM:
        return { title: "Review Payment", subtitle: "Check everything is correct", onBack: () => setStep(GreentagStep.AMOUNT) };
      case GreentagStep.SUCCESS:
        return { title: "Payment Sent", subtitle: "Transaction complete", onBack: goBack };
      case GreentagStep.ERROR:
        return { title: "Payment Failed", subtitle: "Something went wrong", onBack: () => setStep(GreentagStep.CONFIRM) };
      default:
        return { title: "Send to a User", subtitle: "Enter recipient's Greentag, phone or email", onBack: goBack };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <div className={`flex-1 flex flex-col ${isModal ? 'bg-white' : 'bg-ghost'} animate-fade-in w-full h-full overflow-hidden min-h-0`}>
      {!isModal && step !== GreentagStep.PROCESSING && step !== GreentagStep.SUCCESS && (
        <BackHeader 
          title={headerProps.title} 
          subtitle={headerProps.subtitle} 
          onBack={headerProps.onBack} 
        />
      )}
      
      {isModal && step !== GreentagStep.PROCESSING && step !== GreentagStep.SUCCESS && (
        <div className="px-6 pt-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{headerProps.title}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{headerProps.subtitle}</p>
          </div>
          <button onClick={headerProps.onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {step === GreentagStep.SEARCH && (
          <div className="animate-fade-in">
            <Input 
              label="Recipient"
              placeholder="e.g. johndoe, 08031234567, or email@example.com"
              value={greentag}
              onChange={(e) => {
                const val = e.target.value.toLowerCase();
                setGreentag(val);
                setIsSubmitted(false);
                setIsFound(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsSubmitted(true);
                  setIsFound(greentag === dummyUser.tag || greentag === dummyUser.phone || greentag === dummyUser.email);
                }
              }}
              className="mb-6"
              icon={isSubmitted && isFound ? <Icons.CheckCircle className="w-5 h-5 text-green-500" /> : undefined}
            />

            {isSubmitted && isFound && (
              <button 
                onClick={() => setStep(GreentagStep.PROFILE)}
                className="w-full bg-white border border-gray-100 p-4 rounded-[24px] flex items-center justify-between shadow-sm active:scale-95 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                    <img src={dummyUser.avatar} alt={dummyUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Tap to view profile</p>
                    <p className="font-black text-gray-900 text-sm">{dummyUser.name}</p>
                  </div>
                </div>
                <Icons.ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
              </button>
            )}

            {/* Saved Beneficiaries */}
            {!isSubmitted && savedBeneficiaries.length > 0 && (
              <div className="mt-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">Saved Beneficiaries</h3>
                <div className="space-y-3">
                  {savedBeneficiaries.filter(b => b.type === 'username' || b.type === 'email').map(beneficiary => (
                    <button 
                      key={beneficiary.id}
                      onClick={() => {
                        setGreentag(beneficiary.value);
                        setIsSubmitted(true);
                        setIsFound(true);
                        // In a real app, we'd fetch the user profile here
                      }}
                      className="w-full bg-white border border-gray-50 p-4 rounded-[24px] flex items-center justify-between shadow-sm active:scale-95 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                          <img src={beneficiary.avatar} alt={beneficiary.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="text-left">
                          <p className="font-black text-gray-900 text-sm">{beneficiary.name}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">₦{beneficiary.value}</p>
                        </div>
                      </div>
                      <Icons.ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === GreentagStep.PROFILE && (
          <div className="animate-slide-up">
            {/* Compact Profile Card Design */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden relative mb-8">
              {/* Header Section */}
              <div className="p-6 pb-4 border-b border-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/10 shadow-sm">
                      <img src={dummyUser.avatar} alt={dummyUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">{dummyUser.name}</h3>
                        <Icons.ShieldCheck className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₦{dummyUser.tag}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep(GreentagStep.SEARCH)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 active:scale-90 transition-transform">
                    <Icons.X className="w-4 h-4" />
                  </button>
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <div className="flex items-center gap-1.5">
                    <Icons.CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Email</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icons.CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Phone</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icons.CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Identity</span>
                  </div>
                </div>
              </div>

              {/* Stats List Section */}
              <div className="p-6 space-y-4">
                <div className="pt-4">
                  <Button 
                    className="w-full !h-14 !rounded-[24px] !bg-gray-900 !text-white shadow-lg shadow-gray-200"
                    onClick={() => setStep(GreentagStep.AMOUNT)}
                  >
                    Continue to Pay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === GreentagStep.AMOUNT && (
          <div className="animate-slide-up space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100">
                  <img src={dummyUser.avatar} alt={dummyUser.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sending to</p>
                  <p className="font-black text-gray-900">{dummyUser.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Amount (NGN)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-gray-400">₦</span>
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setError(null);
                    }}
                    className="w-full h-20 bg-gray-50 rounded-[24px] pl-12 pr-6 text-2xl font-black text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex justify-between items-center px-2">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Balance: <span className="text-gray-900">₦{walletBalance.toLocaleString()}</span>
                    </p>
                    <button 
                      onClick={() => setAmount(walletBalance.toString())}
                      className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 hover:text-primary/80 transition-colors text-left"
                    >
                      Use Max
                    </button>
                  </div>
                  {amount && Number(amount) > walletBalance && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                      Insufficient Balance
                    </p>
                  )}
                </div>
              </div>

              {/* Save Beneficiary Toggle */}
              <div className="pt-4 border-t border-gray-50 space-y-4">
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
                    <div className="animate-fade-in">
                        <Input 
                            placeholder="Beneficiary Name (e.g. John's Wallet)"
                            value={beneficiaryName}
                            onChange={(e) => setBeneficiaryName(e.target.value)}
                            inputClassName="!h-12 !text-xs !rounded-[16px] !bg-gray-50/50 border-gray-100 !text-gray-900"
                        />
                    </div>
                )}
              </div>
            </div>

            <Button 
              disabled={!amount || Number(amount) <= 0 || Number(amount) > walletBalance || (saveBeneficiary && !beneficiaryName)}
              className="w-full !h-16 !rounded-[24px] !bg-primary !text-white shadow-xl shadow-primary/20"
              onClick={() => setStep(GreentagStep.CONFIRM)}
            >
              Review Payment
            </Button>
            
            <button 
              onClick={() => setStep(GreentagStep.PROFILE)}
              className="w-full text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-gray-600 transition-colors"
            >
              Back to Profile
            </button>
          </div>
        )}

        {step === GreentagStep.CONFIRM && (
          <div className="animate-slide-up space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2">Total to Pay</p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-8">₦{Number(amount).toLocaleString()}</h2>
              
              <div className="space-y-4 text-left">
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recipient</span>
                  <span className="text-xs font-black text-gray-900">{dummyUser.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Greentag</span>
                  <span className="text-xs font-black text-primary">₦{dummyUser.tag}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fee</span>
                  <span className="text-xs font-black text-green-500">FREE</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                className="w-full !h-16 !rounded-[24px] !bg-primary !text-white shadow-xl shadow-primary/20"
                onClick={handleConfirmPayment}
              >
                Confirm & Pay
              </Button>
              <button 
                onClick={() => setStep(GreentagStep.AMOUNT)}
                className="w-full h-12 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-gray-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {step === GreentagStep.PROCESSING && (
          <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-12">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-ping"></div>
              <Icons.Loader className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Processing Payment</h2>
            <p className="text-gray-400 text-sm font-medium mt-2">Sending funds to ₦{dummyUser.tag}...</p>
          </div>
        )}

        {step === GreentagStep.SUCCESS && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-green-50/30 items-center animate-fade-in overflow-hidden">
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
                  <h2 className="text-2xl font-black text-white mb-1.5 tracking-tight">Transfer Successful!</h2>
                  <p className="text-white/70 text-[11px] font-black uppercase tracking-[0.2em]">Transaction ID: GTX-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                </div>
             </div>

             {/* Details Card - Floating */}
             <div className="w-full max-w-md px-4 -mt-12 relative z-20 flex-1 overflow-y-auto no-scrollbar pb-24 min-h-0">
                 <div className="bg-white rounded-[40px] p-6 shadow-2xl shadow-gray-200/60 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    <div className="border-2 border-dashed border-primary/50 rounded-[24px] p-6 text-center mb-8 relative z-10 bg-primary/5">
                      <h1 className="text-4xl font-black text-gray-700 tracking-tighter">
                        ₦{Number(amount).toLocaleString()} <span className="text-primary">NGN</span>
                      </h1>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center py-4 border-b border-gray-50">
                        <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">Recipient</span>
                        <div className="text-right">
                          <p className="font-black text-gray-900 text-sm">{dummyUser.name}</p>
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-0.5">@{dummyUser.tag}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-4 border-b border-gray-50">
                        <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">Fee</span>
                        <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100">FREE</div>
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
                      <Button variant="primary" onClick={() => setScreen(AppScreen.HOME)} className="px-12 !h-14 !rounded-[24px] !bg-primary shadow-xl shadow-primary/20 !text-xs font-black uppercase tracking-[0.2em]">Back to Dashboard</Button>
                      <div className="flex gap-3 w-full justify-center">
                        <Button variant="outline" className="px-6 !h-12 !rounded-2xl !text-[10px] font-black uppercase tracking-widest border-gray-100">View Receipt</Button>
                        <Button variant="outline" className="px-6 !h-12 !rounded-2xl !text-[10px] font-black uppercase tracking-widest border-gray-100">Share</Button>
                      </div>
                    </div>
                 </div>

                 {/* Extra Info */}
                 <div className="mt-8 text-center pb-8">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] leading-relaxed px-8 opacity-40">
                      Funds are typically available immediately for internal transfers.
                    </p>
                 </div>
             </div>
          </div>
        )}
        {step === GreentagStep.ERROR && (
          <div className="flex-1 flex flex-col items-center justify-center animate-slide-up py-12 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <Icons.Alert className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Payment Failed</h2>
            <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto mt-2 mb-8">
              {error || "An unexpected error occurred while processing your payment. Please try again."}
            </p>
            
            <div className="w-full max-w-xs space-y-3">
              <Button 
                onClick={() => setStep(GreentagStep.CONFIRM)}
                className="w-full !h-14 !rounded-[24px] !bg-gray-900 !text-white"
              >
                Try Again
              </Button>
              <button 
                onClick={goBack}
                className="w-full h-12 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]"
              >
                Cancel Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
