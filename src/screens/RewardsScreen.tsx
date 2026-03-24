import React, { useState, useMemo } from 'react';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Icons } from '../../components/Icons';
import { getAvatarUrl } from '../constants/avatars';
import * as Constants from '../../constants';
import { toast } from 'react-hot-toast';

export const RewardsScreen = () => {
  const { setScreen, checklist, points, setPoints, setShowReferralWithdrawModal, referralBalance } = useAppContext();
  const [activeTab, setActiveTab] = useState<'referrals' | 'tasks' | 'leaderboard' | 'shop'>('referrals');
  const [taskCategory, setTaskCategory] = useState<'All' | 'Daily' | 'Weekly' | 'Social' | 'Referral'>('All');

  const checklistItems = useMemo(() => {
    let items = Constants.CHECKLIST_ITEMS.map(item => {
      const stateItem = checklist.find(i => i.id === item.id);
      return { ...item, completed: stateItem ? stateItem.completed : item.completed };
    });

    if (taskCategory !== 'All') {
      items = items.filter(item => item.category === taskCategory);
    }
    return items;
  }, [checklist, taskCategory]);

  const completedCount = checklistItems.filter(i => i.completed).length;
  const totalTasks = checklistItems.length;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full overflow-x-hidden box-border">
      <div className="w-full max-w-full flex flex-col h-full mx-auto overflow-x-hidden box-border">
        <BackHeader title="Earn Money" subtitle="Earn while you transact" onBack={() => setScreen(AppScreen.HOME)} />
        
        {/* Points Header */}
        <div className="px-5 pt-2 pb-4 w-full box-border">
          <div className="bg-gray-900 rounded-[32px] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden box-border">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1 opacity-90">
                  <span className="text-[10px] font-black uppercase tracking-widest">Available Balance</span>
                </div>
                <h2 className="text-3xl font-black tracking-tighter mb-1">${(points * 0.001).toFixed(2)}</h2>
                <p className="text-[10px] font-bold opacity-80">{points.toLocaleString()} Pts</p>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    if (referralBalance >= 3000) {
                      setShowReferralWithdrawModal(true);
                    } else {
                      toast.error("Minimum withdrawal is ₦3,000");
                    }
                  }}
                  className="bg-white text-gray-900 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-transform flex items-center gap-1"
                >
                  Claim <Icons.ArrowRight className="w-3 h-3" />
                </button>
                <button className="bg-white/20 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-transform flex items-center gap-1 backdrop-blur-sm">
                  History <Icons.FileText className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-2 w-full box-border min-w-0">
          {[
            { id: 'referrals', label: 'Refer & Earn' },
            { id: 'tasks', label: 'Tasks' },
            { id: 'leaderboard', label: 'Leaderboard' },
            { id: 'shop', label: 'Shop' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-[11px] font-black tracking-widest uppercase whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-gray-500 border border-gray-100 hover:border-primary/30'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 w-full box-border">
          {activeTab === 'referrals' && (
            <div className="p-5 space-y-6 animate-fade-in w-full box-border">
              {/* Invite Card */}
              <div className="bg-white rounded-[24px] p-6 relative overflow-hidden border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                    <Icons.Share className="w-5 h-5" />
                  </div>
                  <h3 className="text-gray-900 font-black text-lg tracking-tight">Invite friends and earn ₦3,000 + Commissions</h3>
                </div>
                <p className="text-gray-600 text-[12px] font-medium leading-relaxed mb-6">
                  Earn a ₦3,000 voucher for every friend you refer! Plus, get 50% of their trade fee commissions for a whole year. Start building your passive income today.
                </p>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Referral link</label>
                  <div className="flex items-center gap-2 bg-white p-2 rounded-[16px] border border-gray-100">
                    <input 
                      type="text" 
                      readOnly 
                      value="https://referral.gogreen.com/WzbV/i?referr..." 
                      className="flex-1 bg-transparent border-none text-[11px] font-medium text-gray-600 px-2 outline-none truncate min-w-0"
                    />
                    <button onClick={() => toast.success('Link copied!')} className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-gray-900 active:scale-95 transition-transform shrink-0">
                      <Icons.Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-primary text-white py-3 rounded-[16px] text-[11px] font-black uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <Icons.Share className="w-4 h-4" /> Share
                  </button>
                  <button className="flex-1 bg-white text-gray-600 py-3 rounded-[16px] text-[11px] font-black uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform border border-gray-100">
                    <Icons.FileText className="w-4 h-4" /> T & C's
                  </button>
                </div>
              </div>

              {/* Invite History */}
              <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-gray-900 text-[14px]">Your invite history</h3>
                  <button className="text-[11px] font-black text-primary">See all invites</button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-black text-gray-900">0</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Invited</p>
                  </div>
                  <div className="border-x border-gray-100">
                    <p className="text-xl font-black text-gray-900">0</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Onboarding</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-gray-900">0</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Rewarded</p>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-gray-900 rounded-[24px] p-6 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Icons.Info className="w-4 h-4 text-white" />
                  <h3 className="font-black text-white text-[12px] uppercase tracking-widest">How it works</h3>
                </div>
                
                <div className="space-y-6 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-white/20"></div>
                  
                  {[
                    { step: 1, title: 'Share Your Link', desc: 'Share your referral link via any chat app, SMS, or social media channel.' },
                    { step: 2, title: 'Qualify with $2 Balance', desc: 'You must have at least $2 in your wallet to be eligible for referral rewards.' },
                    { step: 3, title: 'Invitee Adds Fund $2', desc: 'Your friend signs up and adds at least $2 into their wallet.' },
                    { step: 4, title: 'Earn ₦3,000 + 50% Commission', desc: 'Get a ₦3,000 voucher instantly + 50% of their trade fee commissions for 1 year!' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-gray-900 shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-black text-[13px] tracking-tight mb-1">{item.title}</h4>
                        <p className="text-[11px] text-white/80 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="p-5 space-y-6 animate-fade-in w-full box-border">
              {/* Progress Section */}
              <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <h3 className="font-black text-gray-900 text-lg tracking-tight">Getting Started</h3>
                    <p className="text-[11px] text-gray-500 font-medium mt-1">Complete tasks to unlock higher tiers</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-primary">{completedCount}</span>
                    <span className="text-sm font-bold text-gray-400">/{totalTasks}</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar px-2 min-w-0">
                  {['All', 'Daily', 'Weekly', 'Social', 'Referral'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setTaskCategory(cat as any)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${taskCategory === cat ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <h3 className="font-black text-gray-900 text-sm tracking-tight px-2">Available Tasks</h3>
                {checklistItems.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => !item.completed && setScreen(item.screen)}
                    className={`p-4 rounded-[24px] border flex items-center gap-4 transition-all group ${item.completed ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100 shadow-sm hover:border-primary/30 cursor-pointer active:scale-[0.98]'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                      {item.completed ? <Icons.Check className="w-6 h-6" /> : <div className="w-6 h-6 rounded-full border-2 border-current border-dashed"></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-black text-[13px] tracking-tight truncate ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{item.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5 truncate">{item.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${item.completed ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                        {item.completed ? 'Claimed' : '+ $0.10'}
                      </div>
                      {item.completed && <span className="text-[8px] font-bold text-gray-300">Done</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="p-5 space-y-4 animate-fade-in w-full box-border">
              <div className="bg-gray-900 rounded-[24px] p-6 text-white text-center relative overflow-hidden shadow-xl shadow-primary/20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <Icons.Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <h3 className="font-black text-xl tracking-tight mb-1">Top Referrers</h3>
                <p className="text-[11px] font-medium opacity-80">Compete with others and win weekly prizes!</p>
              </div>

              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                {[
                  { rank: 1, name: 'Alex Johnson', points: '12,450', avatar: getAvatarUrl('Alex') },
                  { rank: 2, name: 'Sarah Williams', points: '10,200', avatar: getAvatarUrl('Sarah') },
                  { rank: 3, name: 'Michael Brown', points: '8,900', avatar: getAvatarUrl('Michael') },
                  { rank: 4, name: 'Jessica Davis', points: '7,150', avatar: getAvatarUrl('Jessica') },
                  { rank: 5, name: 'David Miller', points: '6,800', avatar: getAvatarUrl('David') },
                ].map((user, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 ${i !== 4 ? 'border-b border-gray-50' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[12px] ${user.rank === 1 ? 'bg-gray-100 text-gray-600' : user.rank === 2 ? 'bg-gray-100 text-gray-600' : user.rank === 3 ? 'bg-gray-100 text-gray-600' : 'bg-transparent text-gray-400'}`}>
                      #{user.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 overflow-hidden border border-gray-100">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-[13px] text-gray-900 truncate">{user.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary text-[13px]">{user.points}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shop' && (
            <div className="p-5 flex flex-col items-center justify-center text-center h-[50vh] animate-fade-in w-full box-border">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-inner relative overflow-hidden">
                <Icons.Gift className="w-10 h-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent animate-shimmer"></div>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Reward Shop</h3>
              <p className="text-xs text-gray-500 font-medium max-w-[250px] leading-relaxed mb-8">
                Soon you'll be able to exchange your earned points for gift cards, airtime, and exclusive merchandise.
              </p>
              <div className="px-6 py-2 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                Coming Soon
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
