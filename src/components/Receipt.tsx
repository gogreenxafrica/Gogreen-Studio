import React from 'react';
import { Icons } from '../../components/Icons';
import { Logo } from '../../components/Logo';

interface ReceiptProps {
  theme: 'light' | 'dark';
  tx: any;
  username: string;
  email: string;
}

export const Receipt = ({ theme, tx, username, email }: ReceiptProps) => {
  const isDark = theme === 'dark';

  const bgColor = isDark ? 'bg-[#111]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-white/40' : 'text-gray-500';
  const borderColor = isDark ? 'border-white/10' : 'border-gray-200';

  return (
    <div className={`${bgColor} w-full max-w-sm rounded-[24px] overflow-hidden shadow-2xl relative border ${borderColor} p-6 flex flex-col items-center`}>
      {isDark && <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(46,139,58,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(46,139,58,0.1) 0%, transparent 40%)' }}></div>}
      
      <div className="mb-6 z-10">
        <Logo className="w-28 h-8" variant={isDark ? "white" : "color"} />
      </div>
      
        <div className="text-center mb-6 z-10">
        <p className={`${subTextColor} text-[9px] font-bold uppercase tracking-[0.2em] mb-1`}>Total Amount</p>
        <h1 className={`text-3xl font-black ${textColor} tracking-tight`}>{tx.fiatAmount}</h1>
        {tx.cryptoAmount && tx.cryptoAmount !== tx.fiatAmount && (
          <p className={`${subTextColor} text-xs font-bold mt-1 tracking-tight`}>{tx.cryptoAmount}</p>
        )}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-3 ${tx.status === 'Success' ? 'bg-green-500/20 text-green-400' : tx.status === 'Pending' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-500/20 text-gray-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Success' ? 'bg-green-400' : tx.status === 'Pending' ? 'bg-gray-400' : 'bg-gray-400'}`}></div>
            <span className="text-[9px] font-bold uppercase tracking-widest">{tx.status} Transaction</span>
        </div>
      </div>

      <div className={`w-full ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-4 space-y-3 mb-5 border ${borderColor} backdrop-blur-sm z-10`}>
        <div className="flex justify-between items-center">
            <span className={`text-[10px] ${subTextColor} font-medium`}>Date</span>
            <span className={`text-[10px] ${textColor} font-bold`}>{tx.date}, {tx.time}</span>
        </div>
        <div className="flex justify-between items-center">
            <span className={`text-[10px] ${subTextColor} font-medium`}>Reference</span>
            <span className={`text-[10px] ${textColor} font-bold font-mono`}>{tx.ref}</span>
        </div>
        <div className={`w-full h-px ${borderColor} my-1.5`}></div>
        <div className="flex justify-between items-center">
            <span className={`text-[10px] ${subTextColor} font-medium`}>Type</span>
            <span className={`text-[10px] ${textColor} font-bold`}>{tx.type}</span>
        </div>
        {tx.fundingSource && (
          <div className={`w-full ${isDark ? 'bg-white/5' : 'bg-gray-100'} rounded-lg p-2 my-2`}>
            <p className={`text-[8px] ${subTextColor} font-black uppercase tracking-widest mb-1`}>Funding Source</p>
            {tx.fundingSource.map((source: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center mb-0.5 last:mb-0">
                <span className={`text-[9px] ${subTextColor} font-medium`}>{source.asset}</span>
                <span className={`text-[9px] ${textColor} font-bold`}>{source.amount}</span>
              </div>
            ))}
          </div>
        )}
        {tx.bankName !== 'N/A' && (
            <>
            <div className="flex justify-between items-center">
                <span className={`text-[10px] ${subTextColor} font-medium`}>Bank</span>
                <span className={`text-[10px] ${textColor} font-bold`}>{tx.bankName}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className={`text-[10px] ${subTextColor} font-medium`}>Account</span>
                <span className={`text-[10px] ${textColor} font-bold`}>{tx.accountNumber}</span>
            </div>
            </>
        )}
      </div>

      <div className={`flex items-center justify-center gap-2 ${isDark ? 'opacity-30' : 'opacity-50'} z-10 mb-2`}>
        <Icons.Shield />
        <span className={`text-[9px] font-medium ${textColor} uppercase tracking-widest`}>Secured by Gogreen</span>
      </div>

      {/* Zig-zag bottom edge */}
      <div className="absolute bottom-0 left-0 w-full flex overflow-hidden h-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'} -mb-2 shrink-0`}
            style={{ marginLeft: i === 0 ? '-8px' : '0' }}
          />
        ))}
      </div>
    </div>
  );
};
