import React, { useState, useEffect } from 'react';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { Icons } from '../../components/Icons';
import { BackHeader } from '../components/BackHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SwipeButton } from '../../components/SwipeButton';
import { Confetti } from '../components/Confetti';
import { PrivacyText } from '../../components/PrivacyText';
import { InsufficientBalanceModal } from '../components/InsufficientBalanceModal';

import { BrandPattern } from '../components/BrandPattern';

interface SwapScreenProps {
  setGlobalLoadingMessage: (message: string) => void;
  setIsGlobalLoading: (loading: boolean) => void;
}

export const SwapScreen: React.FC<SwapScreenProps> = ({
  setGlobalLoadingMessage,
  setIsGlobalLoading
}) => {
  const { 
    screen, 
    setScreen, 
    coins, 
    swapFromAsset, 
    setSwapFromAsset, 
    swapToAsset, 
    setSwapToAsset, 
    swapAmount, 
    setSwapAmount,
    hideBalance,
    setSelectedTx,
    setShowReceiptOptionsModal,
    setShowPinModal,
    setOnPinSuccess
  } = useAppContext();

  const [isSelecting, setIsSelecting] = useState<'from' | 'to' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  // Initialize default assets if not set
  useEffect(() => {
    if (!swapFromAsset && coins.length > 0) {
      setSwapFromAsset(coins.find(c => c.id === 'usdt') || coins[0]);
    }
    if (!swapToAsset && coins.length > 0) {
      setSwapToAsset(coins.find(c => c.id === 'ngn') || coins[1]);
    }
  }, [coins, swapFromAsset, swapToAsset]);

  const filteredCoins = coins.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    // Prevent selecting the same asset for both sides
    const isAlreadySelected = isSelecting === 'from' 
      ? coin.id === swapToAsset?.id 
      : coin.id === swapFromAsset?.id;
      
    return matchesSearch && !isAlreadySelected;
  });

  const handleSwapAssets = () => {
    const temp = swapFromAsset;
    setSwapFromAsset(swapToAsset);
    setSwapToAsset(temp);
  };

  const [inputUnit, setInputUnit] = useState<'coin' | 'ngn' | 'usd'>('coin');
  const [displayAmount, setDisplayAmount] = useState('');

  // Update swapAmount whenever displayAmount or inputUnit changes
  useEffect(() => {
    if (!displayAmount || !swapFromAsset) {
      setSwapAmount('');
      return;
    }
    const val = parseFloat(displayAmount);
    if (isNaN(val)) return;

    if (inputUnit === 'coin') {
      setSwapAmount(displayAmount);
    } else if (inputUnit === 'ngn') {
      setSwapAmount((val / swapFromAsset.rate).toString());
    } else if (inputUnit === 'usd') {
      const usdRate = swapFromAsset.rate / 1710;
      setSwapAmount((val / usdRate).toString());
    }
  }, [displayAmount, inputUnit, swapFromAsset]);

  const handleUnitToggle = () => {
    if (inputUnit === 'coin') {
      setInputUnit('usd');
      if (swapAmount && swapFromAsset) {
        const usdRate = swapFromAsset.rate / 1710;
        setDisplayAmount((parseFloat(swapAmount) * usdRate).toFixed(2));
      }
    } else if (inputUnit === 'usd') {
      setInputUnit('ngn');
      if (swapAmount && swapFromAsset) {
        setDisplayAmount((parseFloat(swapAmount) * swapFromAsset.rate).toFixed(2));
      }
    } else {
      setInputUnit('coin');
      if (swapAmount) {
        setDisplayAmount(parseFloat(swapAmount).toString());
      }
    }
  };

  const getEstimatedReceive = () => {
    if (!swapAmount || !swapFromAsset || !swapToAsset) return '0.00';
    const rate = swapFromAsset.rate / swapToAsset.rate;
    // Use higher precision (5 decimals) for crypto
    return (parseFloat(swapAmount) * rate).toFixed(5);
  };

  const AssetSelectionModal = () => (
    <div className="absolute inset-0 z-50 bg-green-50/30 flex flex-col animate-slide-up">
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => { setIsSelecting(null); setSearchQuery(''); }}
            className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90 shadow-sm"
          >
            <Icons.ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>
          <h3 className="font-black text-gray-900 text-xl tracking-tight">Select Token</h3>
        </div>
        <Input 
          placeholder="Search assets..." 
          value={searchQuery}
          variant="glass-light"
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<div className="w-4 h-4 text-gray-400"><Icons.Search /></div>}
          inputClassName="!h-12 !text-sm !rounded-[20px] !bg-white border-gray-100 shadow-sm !text-gray-900"
          autoFocus
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {filteredCoins.map((coin, index) => (
          <div 
            key={coin.id}
            onClick={() => {
              if (isSelecting === 'from') setSwapFromAsset(coin);
              else setSwapToAsset(coin);
              setIsSelecting(null);
              setSearchQuery('');
            }}
            className="p-4 bg-white rounded-[28px] border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:border-primary/30 hover:shadow-md shadow-sm"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-base font-black shadow-sm" style={{ backgroundColor: coin.color }}>
                {coin.symbol[0]}
              </div>
              <div>
                <p className="font-black text-gray-900 text-[13px] tracking-tight mb-0.5">{coin.name}</p>
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{coin.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-gray-900 text-[13px] tracking-tight">
                <PrivacyText hide={hideBalance}>{coin.balance.toLocaleString()}</PrivacyText>
              </p>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                <PrivacyText hide={hideBalance}>{`≈ $${(coin.balance * coin.rate / 1710).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}</PrivacyText>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (screen === AppScreen.SWAP_AMOUNT || screen === AppScreen.SWAP_SELECT_ASSET_FROM || screen === AppScreen.SWAP_SELECT_ASSET_TO) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in relative items-center w-full h-full overflow-hidden min-h-0">
        {isSelecting && <AssetSelectionModal />}
        
        <div className="w-full max-w-xl flex flex-col flex-1 min-h-0 mx-auto">
          <BackHeader title="Swap" subtitle="Trade Assets" onBack={() => setScreen(AppScreen.HOME)} />
          
          <div className="flex-1 p-4 sm:p-6 flex flex-col overflow-y-auto no-scrollbar min-h-0">
            {/* Swap Card */}
            <div className="bg-white rounded-[40px] p-5 sm:p-7 shadow-2xl shadow-gray-200/40 border border-gray-100 relative mb-8">
              
              {/* From Section */}
              <div className="bg-gray-50/50 rounded-[32px] p-5 sm:p-6 border border-gray-100 transition-all focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-inner">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">You Pay</span>
                    <button 
                      onClick={handleUnitToggle}
                      className="bg-white px-2 h-11 rounded-md text-[9px] font-black text-gray-600 uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center gap-1 border border-gray-100 shadow-sm"
                    >
                      <Icons.Refresh className="w-3 h-3" />
                      {inputUnit}
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-gray-500">Balance:</span>
                    <button 
                      onClick={() => {
                        const targetCoinAmount = swapFromAsset?.balance || 0;
                        if (inputUnit === 'coin') {
                          setDisplayAmount(targetCoinAmount.toString());
                        } else if (inputUnit === 'usd') {
                          const usdRate = (swapFromAsset?.rate || 0) / 1710;
                          setDisplayAmount((targetCoinAmount * usdRate).toFixed(2));
                        } else {
                          setDisplayAmount((targetCoinAmount * (swapFromAsset?.rate || 0)).toFixed(2));
                        }
                      }}
                      className="text-[10px] font-black text-primary hover:underline active:scale-95 transition-all bg-primary/5 px-2 min-h-[44px] flex items-center rounded-full"
                    >
                      <PrivacyText hide={hideBalance}>{`${swapFromAsset?.balance.toLocaleString()} ${swapFromAsset?.symbol}`}</PrivacyText>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <input 
                    type="number" 
                    placeholder="0"
                    value={displayAmount}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) {
                            setDisplayAmount(val);
                        }
                    }}
                    className="flex-1 bg-transparent text-4xl sm:text-5xl font-black text-gray-900 placeholder-gray-400 focus:outline-none min-w-0 tracking-tighter"
                  />
                  <button 
                    onClick={() => setIsSelecting('from')}
                    className="flex items-center gap-2.5 bg-white pl-2.5 pr-4 h-11 rounded-[20px] border border-gray-100 shadow-sm hover:bg-gray-50 transition-all active:scale-95 shrink-0"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center text-white text-xs sm:text-sm font-black shadow-sm" style={{ backgroundColor: swapFromAsset?.color || '#ccc' }}>
                      {swapFromAsset?.symbol?.[0]}
                    </div>
                    <span className="font-black text-gray-900 text-sm sm:text-base tracking-tight">{swapFromAsset?.symbol || 'Select'}</span>
                    <Icons.ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
                <div className="mt-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  <PrivacyText hide={hideBalance}>
                    {inputUnit === 'coin' 
                      ? `≈ $${(parseFloat(swapAmount || '0') * (swapFromAsset?.rate || 0) / 1710).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : inputUnit === 'usd'
                      ? `≈ ${parseFloat(swapAmount || '0').toLocaleString(undefined, { maximumFractionDigits: 6 })} ${swapFromAsset?.symbol}`
                      : `≈ ${parseFloat(swapAmount || '0').toLocaleString(undefined, { maximumFractionDigits: 6 })} ${swapFromAsset?.symbol}`}
                  </PrivacyText>
                </div>
              </div>

              {/* Swap Switcher */}
              <div className="flex justify-center -my-4 relative z-10">
                <button 
                  onClick={handleSwapAssets}
                  className="w-12 h-12 bg-white rounded-[20px] border-8 border-white flex items-center justify-center text-primary shadow-xl hover:scale-110 active:scale-90 transition-all group ring-1 ring-gray-100 min-h-[44px]"
                >
                  <Icons.Refresh className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                </button>
              </div>

              {/* To Section */}
              <div className="bg-gray-50/50 rounded-[32px] p-5 sm:p-6 border border-gray-100 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">You Receive</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <input 
                    type="text" 
                    readOnly
                    value={getEstimatedReceive()}
                    className="flex-1 bg-transparent text-4xl sm:text-5xl font-black text-primary placeholder-gray-400 focus:outline-none min-w-0 tracking-tighter"
                  />
                  <button 
                    onClick={() => setIsSelecting('to')}
                    className="flex items-center gap-2.5 bg-white pl-2.5 pr-4 h-11 rounded-[20px] border border-gray-100 shadow-sm hover:bg-gray-50 transition-all active:scale-95 shrink-0"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center text-white text-xs sm:text-sm font-black shadow-sm" style={{ backgroundColor: swapToAsset?.color || '#ccc' }}>
                      {swapToAsset?.symbol?.[0]}
                    </div>
                    <span className="font-black text-gray-900 text-sm sm:text-base tracking-tight">{swapToAsset?.symbol || 'Select'}</span>
                    <Icons.ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
                <div className="mt-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  ≈ <PrivacyText hide={hideBalance}>{`$${(parseFloat(getEstimatedReceive()) * (swapToAsset?.rate || 0) / 1710).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</PrivacyText>
                </div>
              </div>

              {/* Rate Info */}
              {swapFromAsset && swapToAsset && (
                <div className="mt-6 flex justify-between items-center px-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Icons.Info className="w-4 h-4 text-gray-300" />
                    <span>1 {swapFromAsset.symbol} ≈ {(swapFromAsset.rate / swapToAsset.rate).toFixed(4)} {swapToAsset.symbol}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-primary bg-primary/5 px-3 py-1.5 rounded-full uppercase tracking-[0.2em] border border-primary/10">
                    <Icons.Zap className="w-3.5 h-3.5" />
                    <span>Zero Fees</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 flex justify-center">
              <Button 
                disabled={!swapAmount || parseFloat(swapAmount) <= 0 || parseFloat(swapAmount) > (swapFromAsset?.balance || 0)}
                onClick={() => setScreen(AppScreen.SWAP_CONFIRM)}
                className="px-12 !h-15 !text-xs font-black uppercase tracking-[0.2em] !rounded-[28px] !bg-primary shadow-2xl shadow-primary/10"
              >
                {!swapAmount ? 'Enter Amount' : 
                 parseFloat(swapAmount) > (swapFromAsset?.balance || 0) ? 'Insufficient Balance' : 
                 'Review Swap'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === AppScreen.SWAP_CONFIRM) {
    const receiveAmt = getEstimatedReceive();
          
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center relative overflow-hidden w-full h-full min-h-0">
        <BrandPattern opacity={0.03} size={60} animate={true} className="absolute inset-0 pointer-events-none" />
        <div className="w-full max-w-xl flex flex-col flex-1 min-h-0 mx-auto relative z-10">
          <BackHeader title="Confirm Swap" subtitle="Review Details" onBack={() => setScreen(AppScreen.SWAP_AMOUNT)} />
          
          <div className="p-4 sm:p-6 space-y-5 flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24 min-h-0">
            <div className="bg-white p-6 sm:p-8 rounded-[40px] shadow-2xl shadow-gray-200/40 border border-gray-100 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-emerald-500 to-green-400"></div>
                
                <div className="text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">You are swapping</p>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <h2 className="text-4xl font-black text-gray-900 tracking-tighter">{swapAmount}</h2>
                      <span className="text-xl font-black text-gray-400 uppercase tracking-widest">{swapFromAsset?.symbol}</span>
                    </div>
                    
                    <div className="flex justify-center my-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-[20px] flex items-center justify-center text-gray-400 border border-gray-100 shadow-inner">
                          <Icons.ArrowDown className="w-6 h-6" />
                        </div>
                    </div>
                    
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">To receive</p>
                    <div className="border-2 border-dashed border-primary/30 rounded-[28px] p-6 bg-primary/5">
                      <div className="flex items-center justify-center gap-3">
                        <h2 className="text-4xl font-black text-primary tracking-tighter">{receiveAmt}</h2>
                        <span className="text-xl font-black text-green-400 uppercase tracking-widest">{swapToAsset?.symbol}</span>
                      </div>
                    </div>
                </div>

                <div className="bg-gray-50/50 rounded-[28px] p-5 space-y-4 border border-gray-100">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Exchange Rate</span>
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">1 {swapFromAsset?.symbol} ≈ {(swapFromAsset?.rate / swapToAsset?.rate).toFixed(4)} {swapToAsset?.symbol}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Network Fee</span>
                        <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100">Free</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Price Impact</span>
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">~0.01%</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4">
                <SwipeButton text="Swipe to Swap" onComplete={() => {
                    if (parseFloat(swapAmount || '0') > (swapFromAsset?.balance || 0)) {
                        setShowInsufficientModal(true);
                        return;
                    }
                    setOnPinSuccess(() => async () => {
                        setGlobalLoadingMessage('Swapping Assets...');
                        setIsGlobalLoading(true);
                        await new Promise(r => setTimeout(r, 2000));
                        setIsGlobalLoading(false);
                        setScreen(AppScreen.SWAP_SUCCESS);
                    });
                    setShowPinModal(true);
                }} />
                <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-4">Transaction is irreversible once confirmed</p>
            </div>
            
            <InsufficientBalanceModal 
              isOpen={showInsufficientModal}
              onClose={() => setShowInsufficientModal(false)}
              onConfirm={() => {
                setShowInsufficientModal(false);
                setGlobalLoadingMessage('Processing Add Fund...');
                setIsGlobalLoading(true);
                
                setTimeout(() => {
                    setIsGlobalLoading(false);
                    // For swap, auto-deposit might mean redirecting to deposit or just simulating success if it's a test
                    // But based on BillPayment, it seems to simulate success after loading
                    setScreen(AppScreen.SWAP_SUCCESS);
                }, 2500);
              }}
              requiredAmount={parseFloat(swapAmount || '0')}
              currency={swapFromAsset?.symbol}
              message={`You don't have enough ${swapFromAsset?.symbol} for this swap. Would you like to deposit or swap other assets?`}
            />
          </div>
        </div>
      </div>
    );
  }

  if (screen === AppScreen.SWAP_SUCCESS) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 items-center animate-fade-in relative overflow-hidden w-full h-full min-h-0">
           <Confetti />
           <BrandPattern opacity={0.05} size={80} animate={true} className="absolute inset-0 pointer-events-none" />
           {/* Success Header with Gradient Background */}
           <div className="w-full bg-gray-900 pt-12 pb-20 px-6 text-center relative overflow-hidden">
              <BrandPattern opacity={0.15} size={48} animate={true} color="white" className="absolute inset-0 pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gray-900/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center mb-5 shadow-2xl animate-epic-bounce mx-auto text-gray-900 border-4 border-white/20">
                  <Icons.Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-white mb-1.5 tracking-tight">Swap Successful!</h2>
                <p className="text-white/70 text-[11px] font-black uppercase tracking-[0.2em]">Transaction ID: SWP-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
           </div>

           {/* Details Card - Floating */}
           <div className="w-full max-w-md px-4 -mt-12 relative z-20 flex-1 overflow-y-auto no-scrollbar pb-24 min-h-0">
               <div className="bg-white rounded-[40px] p-6 shadow-2xl shadow-gray-200/60 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <div className="border-2 border-dashed border-primary/50 rounded-[24px] p-6 text-center mb-8 relative z-10 bg-primary/5">
                    <h1 className="text-4xl font-black text-gray-700 tracking-tighter">
                      {getEstimatedReceive()} <span className="text-primary">{swapToAsset?.symbol}</span>
                    </h1>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                      <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">Swapped</span>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-gray-900 text-sm">{swapAmount} {swapFromAsset?.symbol}</span>
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] text-white font-black shadow-sm" style={{ backgroundColor: swapFromAsset?.color }}>{swapFromAsset?.symbol[0]}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                      <span className="text-[11px] text-gray-400 font-black uppercase tracking-wider">Exchange Rate</span>
                      <span className="font-black text-gray-900 text-[11px] uppercase tracking-widest">1 {swapFromAsset?.symbol} = {(swapFromAsset?.rate / swapToAsset?.rate).toFixed(4)} {swapToAsset?.symbol}</span>
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
                    <Button variant="primary" onClick={() => setScreen(AppScreen.HOME)} className="px-12 !h-14 !rounded-[24px] !bg-primary shadow-xl shadow-primary/20 !text-xs font-black uppercase tracking-[0.2em]">Back to Dashboard</Button>
                    <div className="flex gap-3 w-full justify-center">
                      <Button variant="outline" className="px-6 !h-12 !rounded-2xl !text-[10px] font-black uppercase tracking-widest border-gray-100" onClick={() => {
                        const tx = {
                          id: Date.now().toString(),
                          type: `Swapped ${swapFromAsset?.symbol}`,
                          amount: `+${(Number(swapAmount) * (swapFromAsset?.rate || 1) / (swapToAsset?.rate || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${swapToAsset?.symbol}`,
                          fiatAmount: `+${(Number(swapAmount) * (swapFromAsset?.rate || 1) / (swapToAsset?.rate || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${swapToAsset?.symbol}`,
                          cryptoAmount: `-${Number(swapAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${swapFromAsset?.symbol}`,
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                          status: 'Success',
                          ref: `TXN-${Math.floor(Math.random() * 1000000000)}`,
                          bankName: 'N/A',
                          accountNumber: 'N/A',
                          network: 'N/A',
                          coinName: swapToAsset?.name,
                          unitAmount: `1 ${swapFromAsset?.symbol} = ${(swapFromAsset?.rate / swapToAsset?.rate).toFixed(5)} ${swapToAsset?.symbol}`,
                          depositDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          platformFee: 'FREE',
                          explorerLink: ''
                        };
                        setSelectedTx(tx);
                        setScreen(AppScreen.RECEIPT_IMAGE_PREVIEW);
                      }}>View Receipt</Button>
                      <Button variant="outline" className="px-6 !h-12 !rounded-2xl !text-[10px] font-black uppercase tracking-widest border-gray-100" onClick={() => {
                        const tx = {
                          id: Date.now().toString(),
                          type: `Swapped ${swapFromAsset?.symbol}`,
                          amount: `+${(Number(swapAmount) * (swapFromAsset?.rate || 1) / (swapToAsset?.rate || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${swapToAsset?.symbol}`,
                          fiatAmount: `+${(Number(swapAmount) * (swapFromAsset?.rate || 1) / (swapToAsset?.rate || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${swapToAsset?.symbol}`,
                          cryptoAmount: `-${Number(swapAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${swapFromAsset?.symbol}`,
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                          status: 'Success',
                          ref: `TXN-${Math.floor(Math.random() * 1000000000)}`,
                          bankName: 'N/A',
                          accountNumber: 'N/A',
                          network: 'N/A',
                          coinName: swapToAsset?.name,
                          unitAmount: `1 ${swapFromAsset?.symbol} = ${(swapFromAsset?.rate / swapToAsset?.rate).toFixed(5)} ${swapToAsset?.symbol}`,
                          depositDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          platformFee: 'FREE',
                          explorerLink: ''
                        };
                        setSelectedTx(tx);
                        setShowReceiptOptionsModal(true);
                      }}>Share</Button>
                    </div>
                  </div>
               </div>

               {/* Extra Info */}
               <div className="mt-8 text-center pb-8">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] leading-relaxed px-8 opacity-40">
                    Funds are typically available immediately.
                  </p>
               </div>
           </div>
      </div>
    );
  }

  return null;
};
