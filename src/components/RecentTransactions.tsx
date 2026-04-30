import React from 'react';
import { Icons } from './Icons';
import { motion } from 'motion/react';
import { useAppContext } from '../../AppContext';
import { PrivacyText } from '../../components/PrivacyText';
import { EmptyState } from './EmptyState';

interface Transaction {
  id: string;
  type: 'receive' | 'send' | 'swap' | 'withdraw' | 'giftcard';
  title: string;
  amount: string;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    title: 'Received from @alex',
    amount: '+45,000.00',
    currency: 'GG',
    date: 'Today, 10:45 AM',
    status: 'completed'
  },
  {
    id: '2',
    type: 'giftcard',
    title: 'Sold Amazon Gift Card',
    amount: '+125,500.00',
    currency: 'GG',
    date: 'Yesterday, 4:20 PM',
    status: 'completed'
  },
  {
    id: '3',
    type: 'withdraw',
    title: 'Withdrawal to Bank',
    amount: '-50,000.00',
    currency: 'GG',
    date: 'Apr 3, 2:15 PM',
    status: 'completed'
  },
  {
    id: '5',
    type: 'send',
    title: 'Sent to @sarah',
    amount: '-15,000.00',
    currency: 'GG',
    date: 'Mar 31, 9:00 AM',
    status: 'completed'
  }
];

export const RecentTransactions: React.FC = () => {
  const { hideBalance } = useAppContext();

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'receive': return <Icons.ArrowDownLeft className="w-5 h-5 text-emerald-500" />;
      case 'send': return <Icons.ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'swap': return <Icons.RefreshCw className="w-5 h-5 text-blue-500" />;
      case 'withdraw': return <Icons.Bank className="w-5 h-5 text-purple-500" />;
      case 'giftcard': return <Icons.Gift className="w-5 h-5 text-orange-500" />;
      default: return <Icons.Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const hasTransactions = mockTransactions.length > 0;

  return (
    <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm min-h-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Recent Transactions</h3>
        {hasTransactions && (
          <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">View All</button>
        )}
      </div>

      <div className="flex-1">
        {hasTransactions ? (
          <div className="space-y-4">
            {mockTransactions.map((tx, index) => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(tx.type)}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-gray-900 tracking-tight">{tx.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[13px] font-black tracking-tight ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-gray-900'}`}>
                    <PrivacyText hide={hideBalance}>
                      {tx.amount}
                    </PrivacyText> <span className="text-[10px] opacity-60">{tx.currency}</span>
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 opacity-60">Success</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No Activity Yet"
            description="Your transactions will appear here once you start transacting."
            icon={<Icons.Activity className="w-8 h-8 text-gray-300 relative z-10" />}
          />
        )}
      </div>
    </div>
  );
};
