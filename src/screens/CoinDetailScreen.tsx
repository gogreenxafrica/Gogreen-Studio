import React from 'react';
import { useAppContext } from '../../AppContext';
import { AppScreen } from '../../types';
import { BackHeader } from '../components/BackHeader';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';
import { PrivacyText } from '../../components/PrivacyText';

interface CoinDetailScreenProps {
  selectedCoin: any;
}

export const CoinDetailScreen: React.FC<CoinDetailScreenProps> = ({ selectedCoin }) => {
  const { setScreen, hideBalance, currency } = useAppContext();

  if (!selectedCoin) return null;

  const balanceInFiat = currency === 'NGN' 
    ? selectedCoin.balance * selectedCoin.rate 
    : (selectedCoin.balance * selectedCoin.rate) / 1710;

  return (
    <div className="flex-1 flex flex-col bg-green-50/30 animate-slide-up items-center">
      <div className="w-full max-w-2xl flex flex-col h-full">
        <BackHeader 
          title={selectedCoin.name} 
          subtitle={`${selectedCoin.symbol} Wallet`} 
          onBack={() => setScreen(AppScreen.COIN_SELECTION)} 
        />
        
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          {/* Balance Card */}
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm mb-8 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-6 relative z-10" style={{ backgroundColor: selectedCoin.color }}>
              {selectedCoin.symbol[0]}
            </div>
            
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 relative z-10">Available Balance</p>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-1 relative z-10">
              <PrivacyText hide={hideBalance}>{`${selectedCoin.balance.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${selectedCoin.symbol}`}</PrivacyText>
            </h2>
            <p className="text-lg font-bold text-gray-400 relative z-10">
              <PrivacyText hide={hideBalance}>{`${currency === 'NGN' ? '₦' : '$'}${balanceInFiat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</PrivacyText>
            </p>
          </div>

          {/* Activity Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
              <h3 className="font-display font-bold text-gray-900 text-base tracking-tight mb-4">Trade Crypto</h3>
              <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setScreen(AppScreen.SELL_CRYPTO)} className="bg-primary/5 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-primary/10 transition-all">
                      <Icons.TrendingUp className="w-6 h-6 text-primary" />
                      <span className="text-xs font-bold text-gray-900">Buy/Sell</span>
                  </button>
                  <button onClick={() => setScreen(AppScreen.SWAP_AMOUNT)} className="bg-primary/5 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-primary/10 transition-all">
                      <Icons.ArrowLeftRight className="w-6 h-6 text-primary" />
                      <span className="text-xs font-bold text-gray-900">Swap</span>
                  </button>
              </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button 
              onClick={() => {
                if (selectedCoin.id === 'usdt' || selectedCoin.id === 'usdc') {
                  setScreen(AppScreen.NETWORK_SELECTION);
                } else {
                  setScreen(AppScreen.COIN_RECEIVE);
                }
              }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center group-active:scale-95 transition-all border border-gray-900 shadow-sm hover:bg-gray-900/90">
                <Icons.ArrowDownLeft className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Receive</span>
            </button>
            
            <button 
              onClick={() => setScreen(AppScreen.SEND_SELECT_ASSET)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center group-active:scale-95 transition-all border border-gray-900 shadow-sm hover:bg-gray-900/90">
                <Icons.Send className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Send</span>
            </button>

            <button 
              onClick={() => setScreen(AppScreen.SELL_CRYPTO)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center group-active:scale-95 transition-all border border-gray-900 shadow-sm hover:bg-gray-900/90">
                <Icons.TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Sell</span>
            </button>
          </div>

          {/* Market Info */}
          <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Market Info</h3>
              <div className="flex items-center gap-1.5 text-green-600 bg-green-100 px-2 py-0.5 rounded-full text-[9px] font-black">
                <Icons.TrendingUp className="w-3 h-3" /> +2.45%
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Rate</span>
                <span className="text-xs font-black text-gray-900">1 {selectedCoin.symbol} = ₦{selectedCoin.rate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network</span>
                <span className="text-xs font-black text-gray-900 uppercase">{selectedCoin.network}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market Cap</span>
                <span className="text-xs font-black text-gray-900">$1.2T</span>
              </div>
            </div>
          </div>
          
          {/* Recent Activity Placeholder */}
          <div className="mt-8">
            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest mb-4 px-1">Recent Activity</h3>
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-[32px] border border-gray-100 border-dashed">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                <Icons.History className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No recent transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
