import React, { useState } from 'react';
import { AppScreen } from '../../types';
import { BackHeader } from '../components/BackHeader';
import { Icons } from '../components/Icons';
import { EmptyState } from '../components/EmptyState';
import { toast } from 'react-hot-toast';

interface ReferralScreenProps {
  onBack: () => void;
}

const mockReferrals = [
  { id: 1, name: 'Alex Johnson', date: 'Oct 12, 2023', status: 'Completed', reward: 'GG 1,000.00' },
  { id: 4, name: 'Trade Bonus', date: 'Oct 14, 2023', status: 'Completed', reward: 'GG 50.00' },
  { id: 2, name: 'Sarah Williams', date: 'Oct 15, 2023', status: 'Pending', reward: 'GG 1,000.00' },
  { id: 3, name: 'Michael Brown', date: 'Oct 18, 2023', status: 'Completed', reward: 'GG 1,000.00' },
];

const mockRedemptions = [
  { id: 1, date: 'Oct 14, 2023', amount: 'GG 1,000.00', status: 'CREDITED' },
  { id: 2, date: 'Oct 20, 2023', amount: 'GG 2,000.00', status: 'CREDITED' },
];

export const ReferralScreen: React.FC<ReferralScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'redemption' | 'referral'>('redemption');
  const referralCode = "PRINCEDK";

  const copyToClipboard = (text: string, isLink: boolean = false) => {
    navigator.clipboard.writeText(text);
    toast.success(isLink ? 'Referral link copied!' : 'Referral code copied!');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full animate-fade-in">
      <BackHeader title="Reward" onBack={onBack} />
      
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24">
        
        {/* Banner */}
        <div className="bg-primary rounded-2xl p-5 text-white relative overflow-hidden mb-6 shadow-lg">
          {/* Decorative elements */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex gap-4">
            <div className="w-16 h-16 shrink-0 flex items-center justify-center">
              {/* Placeholder for the money/gift icon in the image */}
              <div className="relative">
                <Icons.Gift className="w-12 h-12 text-yellow-300 drop-shadow-md" />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                  <Icons.Coin className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-2">Earn more when:</h3>
              <ul className="space-y-1 mb-4">
                <li className="flex items-center gap-2 text-xs text-white/90">
                  <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Icons.Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  You trade
                </li>
                <li className="flex items-center gap-2 text-xs text-white/90">
                  <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Icons.Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  The person you refer makes a trade
                </li>
              </ul>
              
              <div className="text-2xl font-black tracking-widest mb-4 drop-shadow-sm">
                {referralCode}
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => copyToClipboard(referralCode)}
                  className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold backdrop-blur-sm whitespace-nowrap"
                >
                  Copy code
                  <Icons.Copy className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => copyToClipboard(`https://gogreen.app/ref/${referralCode}`, true)}
                  className="bg-transparent hover:bg-white/10 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold border border-white/30 whitespace-nowrap"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <h4 className="text-center text-sm font-bold text-primary mb-1">Reward progress</h4>
          <p className="text-center text-[10px] text-gray-500 mb-3">Redeemable at 5,000.00 GG midpoint</p>
          <div className="relative h-4 bg-primary/10 rounded-full mb-2 overflow-hidden">
            <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-white z-10"></div>
            <div className="h-full bg-primary w-[30%] rounded-full relative z-0"></div>
          </div>
          <div className="flex justify-between text-xs font-bold text-gray-500 relative">
            <span>GG 3,000.00</span>
            <span className="absolute left-[50%] -translate-x-1/2 text-gray-400 text-[10px]">GG 5,000.00</span>
            <span className="text-gray-800">GG 10,000.00</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100/50 p-1 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('redemption')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'redemption' ? 'bg-[#dce9c8] text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Icons.Gift className="w-4 h-4" />
            Redemption History
          </button>
          <button 
            onClick={() => setActiveTab('referral')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'referral' ? 'bg-[#dce9c8] text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Reward History
          </button>
        </div>

        {/* Content */}
        {activeTab === 'referral' && mockReferrals.length > 0 ? (
          <div className="space-y-3">
            {mockReferrals.map(ref => (
              <div key={ref.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold text-sm text-gray-800">{ref.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{ref.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-primary">+{ref.reward}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${ref.status === 'Completed' ? 'text-primary' : 'text-yellow-500'}`}>{ref.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'redemption' && mockRedemptions.length > 0 ? (
          <div className="space-y-3">
            {mockRedemptions.map(red => (
              <div key={red.id} className="bg-gray-200/60 p-4 rounded-2xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Icons.Gift className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">Reward Redeemed</p>
                    <p className="text-xs text-gray-400 mt-0.5">{red.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-800">{red.amount}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-primary">{red.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="Nothing to see here"
            description={activeTab === 'referral' ? "You haven't referred anyone yet. Start sharing your code to earn rewards!" : "You haven't made any redemptions yet. Reach the midpoint to start redeeming!"}
            icon={<Icons.Gift className="w-8 h-8 text-gray-300 relative z-10" />}
          />
        )}

      </div>
    </div>
  );
};
