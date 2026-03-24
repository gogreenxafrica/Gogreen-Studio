import React from 'react';
import { AppScreen } from '../../types';
import { Icons } from '../../components/Icons';

interface GuideItem {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
}

interface GuidesAndTutorialsScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export const GuidesAndTutorialsScreen: React.FC<GuidesAndTutorialsScreenProps> = ({ onNavigate }) => {
  const guides: GuideItem[] = [
    {
      id: '1',
      title: 'How to deposit Crypto in your GoGreen',
      description: 'Funding your GoGreen account with Crypto.',
    },
    {
      id: '2',
      title: 'How to transfer Crypto from your GoGreen account',
      description: 'Sending Crypto from your GoGreen wallet to another destination.',
    },
    {
      id: '3',
      title: 'Transfer from USD wallet using ACH',
      description: 'How to use ACH to transfer funds from your USD wallet.',
    },
    {
      id: '4',
      title: 'How to use GGT wallet',
      description: 'Understanding and using your GoGreen GGT wallet.',
    },
    {
      id: '5',
      title: 'How to send NGN to Nigerian Bank',
      description: 'Sending NGN from GoGreen to a Nigerian bank account.',
    },
    {
      id: '6',
      title: 'How to transfer Euro to Nigerian Banks',
      description: 'Sending Euros from GoGreen directly to Nigerian bank accounts.',
    },
    {
      id: '7',
      title: 'How to pay school fees and tuition to Canadian institution from Nigeria',
      description: 'Paying tuition and school fees to Canadian schools using GoGreen.',
    },
    {
      id: '8',
      title: 'Send money from Nigeria to Canada via Interac',
      description: 'Using Interac to send money from Nigeria to Canada.',
    },
    {
      id: '9',
      title: 'Send money to Canada using EFT',
      description: 'Transferring funds from Nigeria to Canada using EFT.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in pb-24 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-green-50/80 backdrop-blur-xl border-b border-brand-gray/20 px-6 py-6 flex items-center justify-between">
        <button 
          onClick={() => onNavigate(AppScreen.ME)}
          className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          <Icons.ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Video Guides</h1>
        <div className="w-12"></div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-2">
        {guides.map((guide) => (
          <div 
            key={guide.id}
            className="flex items-center gap-4 p-4 rounded-[32px] active:bg-gray-50 transition-all group cursor-pointer"
          >
            {/* Play Icon Container */}
            <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white shadow-md shadow-primary/10 group-hover:scale-110 transition-transform">
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-black text-gray-900 leading-tight tracking-tight mb-1">
                {guide.title}
              </h3>
              <p className="text-[12px] text-gray-400 font-medium leading-snug">
                {guide.description}
              </p>
            </div>

            {/* Chevron */}
            <div className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
              <Icons.ChevronRight className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
