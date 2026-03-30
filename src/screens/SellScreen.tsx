import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';
import { PrivacyText } from '../../components/PrivacyText';

interface SellScreenProps {
  selectedCoin: any;
  sellAmount: string;
  setSellAmount: React.Dispatch<React.SetStateAction<string>>;
}

export const SellScreen: React.FC<SellScreenProps> = ({
  selectedCoin,
  sellAmount,
  setSellAmount
}) => {
  const { setScreen, hideBalance } = useAppContext();

  const [inputUnit, setInputUnit] = useState<'coin' | 'ngn' | 'usd'>('coin');
  const [displayAmount, setDisplayAmount] = useState(sellAmount || '');

  const rate = selectedCoin?.rate || 0;
  const usdRate = rate / 1710;
  
  // Update sellAmount whenever displayAmount or inputUnit changes
  useEffect(() => {
    if (!displayAmount || !selectedCoin) {
      setSellAmount('');
      return;
    }
    const val = parseFloat(displayAmount);
    if (isNaN(val)) return;

    if (inputUnit === 'coin') {
      setSellAmount(displayAmount);
    } else if (inputUnit === 'ngn') {
      setSellAmount((val / rate).toString());
    } else if (inputUnit === 'usd') {
      setSellAmount((val / usdRate).toString());
    }
  }, [displayAmount, inputUnit, selectedCoin, rate, usdRate, setSellAmount]);

  const handleUnitToggle = () => {
    if (inputUnit === 'coin') {
      setInputUnit('usd');
      if (sellAmount && selectedCoin) {
        setDisplayAmount((parseFloat(sellAmount) * usdRate).toFixed(2));
      }
    } else if (inputUnit === 'usd') {
      setInputUnit('ngn');
      if (sellAmount && selectedCoin) {
        setDisplayAmount((parseFloat(sellAmount) * rate).toFixed(2));
      }
    } else {
      setInputUnit('coin');
      if (sellAmount) {
        setDisplayAmount(parseFloat(sellAmount).toString());
      }
    }
  };

  const amount = parseFloat(sellAmount) || 0;
  const totalNaira = amount * rate;
  const totalUsd = amount * usdRate;

  const showToast = (message: string) => toast.success(message, {
    style: { background: '#10B981', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
  });

  const handleKeypadPress = (key: string) => {
      if (navigator.vibrate) navigator.vibrate(10);
      if (key === 'backspace') {
          setDisplayAmount(prev => prev.slice(0, -1));
      } else if (key === '.') {
          if (!displayAmount.includes('.')) {
              setDisplayAmount(prev => prev === '' ? '0.' : prev + '.');
          }
      } else {
          setDisplayAmount(prev => prev === '0' ? key : prev + key);
      }
  };

  useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
         if (/^[0-9]$/.test(e.key)) {
             handleKeypadPress(e.key);
         } else if (e.key === '.') {
             handleKeypadPress('.');
         } else if (e.key === 'Backspace') {
             handleKeypadPress('backspace');
         }
     };

     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayAmount]);

  let equivalentText = '';
  if (inputUnit === 'coin') {
    equivalentText = `≈ $${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ₦${totalNaira.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (inputUnit === 'usd') {
    equivalentText = `≈ ${amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${selectedCoin?.symbol} / ₦${totalNaira.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    equivalentText = `≈ ${amount.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${selectedCoin?.symbol} / $${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return (
     <div className="flex-1 flex flex-col bg-green-50/30 animate-slide-up items-center w-full h-full overflow-hidden min-h-0">
        <div className="w-full max-w-2xl flex flex-col flex-1 min-h-0">
           <BackHeader title={`What would you like to sell?`} subtitle={<span>{selectedCoin?.name} Balance: <PrivacyText hide={hideBalance}>{selectedCoin?.balance}</PrivacyText> {selectedCoin?.symbol}</span>} onBack={() => setScreen(AppScreen.COIN_DETAIL)} />
           
           <div className="flex-1 flex flex-col items-center justify-center p-6">
               <div className="text-center mb-8">
                   <div className="flex justify-center items-center gap-2 mb-4">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">1 {selectedCoin?.symbol} = ₦{rate.toLocaleString()}</p>
                     <button 
                       onClick={handleUnitToggle}
                       className="bg-gray-100 px-2 h-11 rounded-md text-[9px] font-black text-gray-600 uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-1"
                     >
                       <Icons.Refresh className="w-3 h-3" />
                       {inputUnit}
                     </button>
                   </div>
                   <h2 className="text-5xl font-black text-gray-900 tracking-tighter flex items-center justify-center gap-2">
                       {displayAmount || '0'} <span className="text-2xl text-gray-400">{inputUnit === 'coin' ? selectedCoin?.symbol : inputUnit === 'usd' ? 'USD' : 'NGN'}</span>
                   </h2>
                   <p className="text-xl font-bold text-primary mt-2">
                     <PrivacyText hide={hideBalance}>{equivalentText}</PrivacyText>
                   </p>
                   
                   <button 
                       onClick={() => {
                           if (navigator.vibrate) navigator.vibrate(10);
                           const targetCoinAmount = selectedCoin?.balance || 0;
                           if (inputUnit === 'coin') {
                             setDisplayAmount(targetCoinAmount.toString());
                           } else if (inputUnit === 'usd') {
                             setDisplayAmount((targetCoinAmount * usdRate).toFixed(2));
                           } else {
                             setDisplayAmount((targetCoinAmount * rate).toFixed(2));
                           }
                       }}
                       className="mt-6 px-4 h-11 flex items-center bg-primary/10 text-primary rounded-full text-xs font-bold active:scale-95 transition-transform"
                   >
                       Use Max
                   </button>
               </div>
           </div>

           <div className="bg-white pb-8 pt-4 px-6 border-t border-brand-gray/30">
               <div className="grid grid-cols-3 gap-y-6 gap-x-4 mb-6">
                   {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
                       <button
                           key={key}
                           onClick={() => handleKeypadPress(key)}
                           className="h-14 flex items-center justify-center text-2xl font-medium text-gray-900 active:bg-brand-gray/20 rounded-2xl transition-colors"
                       >
                           {key === 'backspace' ? <Icons.ArrowLeft className="w-6 h-6 text-gray-900" /> : key}
                       </button>
                   ))}
               </div>
               
                <div className="flex justify-center">
                    <Button 
                       className="px-12 !h-14 !rounded-2xl !bg-primary !text-white text-sm font-bold shadow-lg shadow-primary/20"
                  onClick={() => {
                      if (amount > 0 && amount <= (selectedCoin?.balance || 0)) {
                          setScreen(AppScreen.SELL_SUMMARY);
                      } else if (amount > (selectedCoin?.balance || 0)) {
                          showToast("Insufficient balance");
                      } else {
                          showToast("Enter a valid amount");
                      }
                  }}
               >
                   Continue
                </Button>
            </div>
           </div>
        </div>
     </div>
  );
};
