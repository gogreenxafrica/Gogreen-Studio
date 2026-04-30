import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Icons } from '../components/Icons';
import { getAvatarUrl } from '../constants/avatars';
import { EmptyState } from '../components/EmptyState';
import * as Constants from '../../constants';
import { toast } from 'react-hot-toast';

const RankBadge = ({ rank, size = 32 }: { rank: number, size?: number }) => {
  // All badges are green as requested, with the same design
  const primaryGreen = "#10b981"; // Emerald-500
  const darkGreen = "#064e3b";    // Emerald-900
  
  return (
    <div className="relative flex flex-col items-center justify-center group shrink-0" style={{ width: size, height: size * 1.2 }}>
      <svg 
        viewBox="0 0 100 120" 
        className="w-full h-full drop-shadow-sm transition-transform group-hover:scale-110"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Legend: Crown */}
        <path 
          d="M20 30L35 45L50 15L65 45L80 30V50H20V30Z" 
          fill="url(#crownGradient)" 
        />
        {/* Shield Body */}
        <path 
          d="M15 45H85V80C85 95 65 110 50 115C35 110 15 95 15 80V45Z" 
          fill="url(#shieldGradient)" 
        />
        {/* Inner Shield Highlight */}
        <path 
          d="M22 52H78V78C78 90 62 102 50 106C38 102 22 90 22 78V52Z" 
          fill="white" 
          fillOpacity="0.1" 
        />
        
        <defs>
          <linearGradient id="crownGradient" x1="50" y1="15" x2="50" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4ade80" />
            <stop offset="1" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="shieldGradient" x1="50" y1="45" x2="50" y2="115" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#065f46" />
          </linearGradient>
        </defs>
        
        <text 
          x="50" 
          y="78" 
          textAnchor="middle" 
          fill="white" 
          fontSize="32" 
          fontWeight="900" 
          fontFamily="Inter, sans-serif"
        >
          {rank}
        </text>
      </svg>
    </div>
  );
};

export const RewardsScreen = () => {
  const { setScreen, checklist, points, setPoints, goBack } = useAppContext();
  const [activeTab, setActiveTab] = useState<'tasks' | 'leaderboard' | 'shop'>('tasks');
  const [taskCategory, setTaskCategory] = useState<'All' | 'Daily' | 'Weekly' | 'Social'>('All');
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number }>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = endOfMonth.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const leaderboardData = useMemo(() => [
    { rank: 1, name: 'Alex Johnson', points: 12450, avatar: getAvatarUrl('Alex') },
    { rank: 2, name: 'Sarah Williams', points: 10200, avatar: getAvatarUrl('Sarah') },
    { rank: 3, name: 'Michael Brown', points: 8900, avatar: getAvatarUrl('Michael') },
    { rank: 4, name: 'Jessica Davis', points: 7150, avatar: getAvatarUrl('Jessica') },
    { rank: 5, name: 'David Miller', points: 6800, avatar: getAvatarUrl('David') },
  ], []);

  const nextPerson = useMemo(() => {
    // Find the person just above the user's current points
    const sorted = [...leaderboardData].sort((a, b) => a.points - b.points);
    return sorted.find(p => p.points > points) || leaderboardData[0];
  }, [points, leaderboardData]);

  const pointsGap = nextPerson.points - points;

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
    <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full h-full overflow-hidden min-h-0 box-border">
      <div className="w-full max-w-full flex flex-col h-full mx-auto overflow-x-hidden box-border">
        <BackHeader title="Earn Money" subtitle="Earn while you transact" onBack={goBack} />
        
        {/* Tabs and Refer Button */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-2 pt-4 w-full box-border items-center">
          {[
            { id: 'tasks', label: 'Tasks' },
            { id: 'leaderboard', label: 'Leaderboard' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 h-9 md:px-4 md:h-11 rounded-full text-[10px] md:text-[11px] font-black tracking-widest uppercase whitespace-nowrap transition-all shrink-0 ${activeTab === tab.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-white text-gray-500 border border-gray-100 hover:border-primary/30'}`}
            >
              {tab.label}
            </button>
          ))}
          <div className="flex-1 min-w-4"></div>
          <button 
            onClick={() => setScreen(AppScreen.REFERRAL)}
            className="flex items-center gap-1.5 bg-[#dce9c8] text-gray-800 px-3 h-9 md:px-4 md:h-11 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-[#cbe0b0] transition-colors whitespace-nowrap shrink-0"
          >
            <Icons.Users className="w-3 h-3 md:w-3.5 md:h-3.5" />
            Refer to Earn
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 w-full box-border">
          {activeTab === 'tasks' && (
            <div className="p-5 space-y-6 animate-fade-in w-full box-border">
              {/* Progress Section */}
              <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-end mb-3">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-[15px] tracking-tight flex items-center gap-2">
                       {pointsGap <= 0 ? 'You are leading!' : `${pointsGap.toLocaleString()} GG to target`}
                       <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Rank Up</span>
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium mt-1 truncate">
                      Beat <span className="font-black text-gray-900">{nextPerson.name}</span> ({nextPerson.points.toLocaleString()} GG)
                    </p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <span className="text-2xl font-black text-primary">{completedCount}</span>
                    <span className="text-sm font-bold text-gray-400">/{totalTasks}</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden relative">
                  {/* Glass Fluid Animation Background */}
                  <motion.div
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] z-0"
                  />
                  
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out rounded-full relative z-10"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Liquid highlights on the filled part */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    <motion.div
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar px-2 min-w-0">
                  {['All', 'Daily', 'Weekly', 'Social'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setTaskCategory(cat as any)}
                      className={`px-3 h-11 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${taskCategory === cat ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <h3 className="font-black text-gray-900 text-sm tracking-tight px-2">Available Tasks</h3>
                {checklistItems.length > 0 ? (
                  checklistItems.map((item) => (
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
                          {item.completed ? 'Claimed' : '+ 10 GG'}
                        </div>
                        {item.completed && <span className="text-[8px] font-bold text-gray-300">Done</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState 
                    title="No tasks found"
                    description={`There are currently no ${taskCategory} tasks available at the moment. Check back later!`}
                    icon={<Icons.List className="w-8 h-8 text-gray-300 relative z-10" />}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="p-5 space-y-4 animate-fade-in w-full box-border">
              <div className="bg-gray-900 rounded-[24px] p-6 text-white text-center relative overflow-hidden shadow-xl shadow-primary/20">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                <div className="flex flex-col items-center relative z-10">
                  <div className="flex items-center gap-2 mb-4 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                    <Icons.Clock className="w-3.5 h-3.5 text-primary" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Ends in:</span>
                      <div className="flex items-center gap-1 font-mono text-[11px] font-bold">
                        <span>{timeLeft.days}d</span>
                        <span className="opacity-30">:</span>
                        <span>{timeLeft.hours}h</span>
                        <span className="opacity-30">:</span>
                        <span>{timeLeft.minutes}m</span>
                      </div>
                    </div>
                  </div>

                  <Icons.Sparkles className="w-8 h-8 mb-2 text-gray-300" />
                  <h3 className="font-black text-xl tracking-tight mb-1">Top Referrers</h3>
                  <p className="text-[11px] font-medium opacity-80">Compete with others and win monthly prizes!</p>
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                {leaderboardData.map((user, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 ${i !== leaderboardData.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <RankBadge rank={user.rank} size={32} />
                    <div className="w-10 h-10 rounded-full bg-gray-50 overflow-hidden border border-gray-100">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-[13px] text-gray-900 truncate">{user.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary text-[13px]">{user.points.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">GG</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
