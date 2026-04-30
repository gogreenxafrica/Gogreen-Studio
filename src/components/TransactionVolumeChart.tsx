import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useAppContext } from '../../AppContext';
import { PrivacyText } from '../../components/PrivacyText';

const data = [
  { day: 'Mon', volume: 4200 },
  { day: 'Tue', volume: 3800 },
  { day: 'Wed', volume: 5100 },
  { day: 'Thu', volume: 4600 },
  { day: 'Fri', volume: 6200 },
  { day: 'Sat', volume: 3400 },
  { day: 'Sun', volume: 2900 },
];

export const TransactionVolumeChart: React.FC = () => {
  const { hideBalance } = useAppContext();
  const totalVolume = data.reduce((acc, item) => acc + item.volume, 0);
  const averageVolume = totalVolume / data.length;

  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm overflow-hidden relative group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Transaction Volume</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <h4 className="text-2xl font-black text-gray-900 tracking-tight">
              <PrivacyText hide={hideBalance}>
                {totalVolume.toLocaleString()}
              </PrivacyText> <span className="text-xs font-bold text-gray-400">GG</span>
            </h4>
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+12.5%</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Avg. Daily</p>
          <p className="text-xs font-black text-gray-900">
            <PrivacyText hide={hideBalance}>
              {Math.round(averageVolume).toLocaleString()}
            </PrivacyText> GG
          </p>
        </div>
      </div>

      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height={128} minWidth={0} minHeight={0}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              hide 
            />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-xl">
                      <PrivacyText hide={hideBalance}>
                        {payload[0].value?.toLocaleString()}
                      </PrivacyText> GG
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="volume" 
              radius={[6, 6, 6, 6]}
              barSize={24}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 4 ? '#10B981' : '#F3F4F6'} 
                  className="transition-all duration-300 hover:fill-emerald-400"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-between items-center border-t border-gray-50 pt-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Peak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-100"></div>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Normal</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <span className="text-[9px] font-black uppercase tracking-widest">Last 7 Days</span>
        </div>
      </div>
    </div>
  );
};
