import React, { useState, useRef, useEffect } from 'react';
import { AppScreen } from '../../types';
import { Icons } from './Icons';
import { BackHeader } from './BackHeader';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/Button';
import { useAppContext } from '../../AppContext';

interface SupportScreenProps {
  onBack: () => void;
}

type SupportView = 'HELP_CENTER' | 'COMPLAINT_FORM' | 'CHAT';

export const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  const { setGlobalOverlay } = useAppContext();
  const [view, setView] = useState<SupportView>('HELP_CENTER');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const [chatMessages, setChatMessages] = useState<{id: number, text: string, sender: 'user' | 'support', time: string}[]>([
    { id: 1, text: "Hello! How can we help you today?", sender: 'support', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (view === 'CHAT') {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, view]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      text: chatInput,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Thanks for reaching out! A support agent will be with you shortly to assist with your inquiry.",
        sender: 'support',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500);
  };

  const categories = [
    "BVN Verification",
    "ID Verification",
    "Email/Phone OTP",
    "Other Issues",
    "Chat with an agent"
  ];

  const handleCategorySelect = (category: string) => {
    if (category === "Chat with an agent") {
      setView('CHAT');
    } else {
      setSelectedCategory(category);
    }
    setShowCategoryPicker(false);
  };

  const renderHelpCenter = () => (
    <div className="flex-1 flex flex-col p-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Help Center</h2>
        <p className="text-gray-500 font-bold">How can we help you today?</p>
      </div>

      <div className="space-y-4">
        {[
          { icon: <Icons.Play className="w-5 h-5" />, title: "Guides & Tutorials", desc: "How to use the app", action: () => setGlobalOverlay(AppScreen.GUIDES_AND_TUTORIALS) },
          { icon: <Icons.GraduationCap className="w-5 h-5" />, title: "Supported Coins", desc: "See list of supported crypto assets", action: () => {} },
          { icon: <Icons.User className="w-5 h-5" />, title: "Contact customer support", desc: "Submit a complaint form", action: () => setView('COMPLAINT_FORM') },
          { icon: <Icons.Mail className="w-5 h-5" />, title: "contact@gogreen.com", desc: "Send us an email", action: () => window.location.href = 'mailto:contact@gogreen.com' },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={item.action}
            className="w-full flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group active:scale-[0.98]"
          >
            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-base font-black text-gray-900 leading-none mb-1">{item.title}</h4>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{item.desc}</p>
            </div>
            <Icons.ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>

      <div className="mt-auto pt-12 flex justify-center gap-6">
        {[<Icons.Facebook />, <Icons.Instagram />, <Icons.Twitter />, <Icons.WhatsApp />].map((icon, i) => (
          <button key={i} className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/20 transition-all active:scale-90 shadow-sm">
            <div className="w-6 h-6">{icon}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderComplaintForm = () => (
    <div className="flex-1 flex flex-col p-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Contact customer support</h2>
        <p className="text-sm text-gray-500 font-bold leading-relaxed">
          Complete this form to help us address your issue.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Complaint category</label>
          <button 
            onClick={() => setShowCategoryPicker(true)}
            className="w-full flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-200 text-left hover:border-primary/50 transition-all active:scale-[0.99]"
          >
            <span className={`text-sm font-bold ${selectedCategory ? 'text-gray-900' : 'text-gray-400'}`}>
              {selectedCategory || "Complaint category"}
            </span>
            <Icons.ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {selectedCategory && (
          <div className="animate-slide-up">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Describe your issue</label>
            <textarea 
              placeholder="Tell us more about the problem..."
              className="w-full p-5 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary/50 min-h-[150px] resize-none"
            />
          </div>
        )}

        {selectedCategory && (
          <Button className="mt-4">Submit Complaint</Button>
        )}
      </div>

      <AnimatePresence>
        {showCategoryPicker && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoryPicker(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl"
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
              <h3 className="text-xl font-black text-gray-900 mb-6">Select option</h3>
              
              <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icons.Search className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold text-gray-900 outline-none focus:border-primary/30"
                />
              </div>

              <div className="space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar">
                {categories.map((cat, i) => (
                  <button 
                    key={i}
                    onClick={() => handleCategorySelect(cat)}
                    className="w-full p-5 text-left text-sm font-bold text-gray-600 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderChat = () => (
    <div className="flex-1 flex flex-col h-full animate-fade-in">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <div className="text-center text-[10px] font-black uppercase tracking-widest text-gray-400 my-4 opacity-60">Today</div>
        
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            <div className={`max-w-[85%] p-4 rounded-[24px] shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
              <p className="text-sm leading-relaxed font-bold">{msg.text}</p>
              <p className={`text-[9px] mt-2 text-right font-black uppercase tracking-tighter ${msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 pb-8">
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-2 text-sm font-bold outline-none text-gray-900 placeholder:text-gray-400"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!chatInput.trim()}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-90 shadow-lg shadow-primary/20"
          >
            <Icons.Send className="w-5 h-5 translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-white animate-fade-in items-center">
      <div className="w-full max-w-2xl flex flex-col h-full">
        <BackHeader 
          title={view === 'CHAT' ? "Live Chat" : view === 'COMPLAINT_FORM' ? "Contact Support" : "Help Center"} 
          onBack={() => {
            if (view === 'CHAT') setView('COMPLAINT_FORM');
            else if (view === 'COMPLAINT_FORM') setView('HELP_CENTER');
            else onBack();
          }} 
        />
        
        {view === 'HELP_CENTER' && renderHelpCenter()}
        {view === 'COMPLAINT_FORM' && renderComplaintForm()}
        {view === 'CHAT' && renderChat()}
      </div>
    </div>
  );
};
