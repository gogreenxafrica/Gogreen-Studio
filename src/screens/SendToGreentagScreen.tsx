import React, { useState } from 'react';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';

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
    setOnPinSuccess
  } = useAppContext();
  const [greentag, setGreentag] = useState('');
  const [isFound, setIsFound] = useState(false);
  const [step, setStep] = useState<GreentagStep>(GreentagStep.SEARCH);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

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
        setStep(GreentagStep.SUCCESS);
      }, 2500);
    });
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
        return { title: "Send to a User", subtitle: "Enter recipient's Greentag, phone or email", onBack: () => setScreen(AppScreen.WITHDRAW_METHOD) };
      case GreentagStep.PROFILE:
        return { title: "Recipient Profile", subtitle: "Verify details", onBack: () => setStep(GreentagStep.SEARCH) };
      case GreentagStep.AMOUNT:
        return { title: "Enter Amount", subtitle: "How much are you sending?", onBack: () => setStep(GreentagStep.PROFILE) };
      case GreentagStep.CONFIRM:
        return { title: "Review Payment", subtitle: "Check everything is correct", onBack: () => setStep(GreentagStep.AMOUNT) };
      case GreentagStep.SUCCESS:
        return { title: "Payment Sent", subtitle: "Transaction complete", onBack: () => setScreen(AppScreen.HOME) };
      case GreentagStep.ERROR:
        return { title: "Payment Failed", subtitle: "Something went wrong", onBack: () => setStep(GreentagStep.CONFIRM) };
      default:
        return { title: "Send to a User", subtitle: "Enter recipient's Greentag, phone or email", onBack: () => setScreen(AppScreen.WITHDRAW_METHOD) };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <div className={`flex-1 flex flex-col ${isModal ? 'bg-white' : 'bg-ghost'} animate-fade-in w-full h-full overflow-hidden min-h-0`}>
      {!isModal && (
        <BackHeader 
          title={headerProps.title} 
          subtitle={headerProps.subtitle} 
          onBack={headerProps.onBack} 
        />
      )}
      
      {isModal && (
        <div className="px-6 pt-8 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{headerProps.title}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">{headerProps.subtitle}</p>
          </div>
          {step !== GreentagStep.PROCESSING && step !== GreentagStep.SUCCESS && (
            <button onClick={headerProps.onBack} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <Icons.X className="w-5 h-5" />
            </button>
          )}
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
                setIsFound(val === dummyUser.tag || val === dummyUser.phone || val === dummyUser.email);
              }}
              className="mb-6"
              icon={isFound ? <Icons.CheckCircle className="w-5 h-5 text-green-500" /> : undefined}
            />

            {isFound && (
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
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
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
            </div>

            <Button 
              disabled={!amount || Number(amount) <= 0 || Number(amount) > walletBalance}
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
          <div className="flex-1 flex flex-col items-center justify-center animate-slide-up py-12 text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-500/20">
              <Icons.CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Payment Sent!</h2>
            <p className="text-gray-500 font-medium text-sm max-w-xs mx-auto mb-8">
              Successfully sent <span className="font-black text-gray-900">₦{Number(amount).toLocaleString()}</span> to <span className="font-black text-gray-900">{dummyUser.name}</span>.
            </p>

            <div className="bg-gray-50 rounded-[24px] p-6 mb-12 w-full max-w-xs text-left space-y-3 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID</span>
                <span className="text-[10px] font-mono font-bold text-gray-900">GTX-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                <span className="text-[10px] font-bold text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-100 px-2 py-0.5 rounded-full">Completed</span>
              </div>
            </div>
            
            <div className="w-full max-w-xs space-y-3">
              <Button 
                onClick={() => setScreen(AppScreen.HOME)}
                className="w-full !h-14 !rounded-[24px] !bg-gray-900 !text-white shadow-xl shadow-gray-200"
              >
                Back to Home
              </Button>
              <button className="w-full h-12 text-[10px] font-bold text-primary uppercase tracking-[0.2em] hover:text-primary/80 transition-colors">
                View Receipt
              </button>
              <button className="w-full h-12 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-gray-600 transition-colors">
                Share Receipt
              </button>
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
                onClick={() => setScreen(AppScreen.HOME)}
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
