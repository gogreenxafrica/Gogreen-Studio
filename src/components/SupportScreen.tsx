import React, { useState, useRef, useEffect } from 'react';
import { AppScreen } from '../../types';
import { Icons } from './Icons';
import { BackHeader } from './BackHeader';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/Button';
import { useAppContext } from '../../AppContext';

interface SupportScreenProps {
  onBack: () => void;
  initialView?: SupportView;
  initialChatId?: number;
}

type SupportView = 'HELP_CENTER' | 'COMPLAINT_FORM' | 'CHAT' | 'CHAT_HISTORY';

export const SupportScreen: React.FC<SupportScreenProps> = ({ onBack, initialView = 'HELP_CENTER', initialChatId }) => {
  const { setGlobalOverlay, setScreen } = useAppContext();
  const [view, setView] = useState<SupportView>(initialView);
  const [selectedChat, setSelectedChat] = useState<any>(null);

  useEffect(() => {
    if (initialChatId) {
      const chat = [
        { id: 1, title: "Account Access Issue", date: "2d ago", lastMsg: "Support", avatar: "https://i.pravatar.cc/150?u=support1", ended: true },
        { id: 2, title: "Transaction Pending", date: "3w ago", lastMsg: "Ifeoluwa", avatar: "https://i.pravatar.cc/150?u=ifeoluwa", hasUnread: true },
        { id: 3, title: "Giftcard Trade #8821", date: "1w ago", lastMsg: "Support", avatar: "https://i.pravatar.cc/150?u=support2", hasUnread: false, ended: true },
        { id: 4, title: "General Inquiry", date: "7w ago", lastMsg: "Uzoma", avatar: "https://i.pravatar.cc/150?u=uzoma" },
      ].find(c => c.id === initialChatId);
      if (chat) {
        setSelectedChat(chat);
        setView('CHAT');
      }
    }
  }, [initialChatId]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const categories = [
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
    <div className="flex-1 flex flex-col p-6 animate-fade-in pb-24 md:pb-6 overflow-y-auto">
      <div className="space-y-4">
        {[
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
    <div className="flex-1 flex flex-col p-6 animate-fade-in pb-24 md:pb-6 overflow-y-auto">
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

              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
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

  const renderChatHistory = () => (
    <div className="flex-1 flex flex-col animate-fade-in pb-24 md:pb-6 overflow-y-auto">
      <div className="divide-y divide-gray-100">
        {[
          { id: 1, title: "Account Access Issue", date: "2d ago", lastMsg: "Support", avatar: "https://i.pravatar.cc/150?u=support1", ended: true },
          { id: 2, title: "Transaction Pending", date: "3w ago", lastMsg: "Ifeoluwa", avatar: "https://i.pravatar.cc/150?u=ifeoluwa", hasUnread: true },
          { id: 3, title: "Giftcard Trade #8821", date: "1w ago", lastMsg: "Support", avatar: "https://i.pravatar.cc/150?u=support2", hasUnread: false, ended: true },
          { id: 4, title: "General Inquiry", date: "7w ago", lastMsg: "Uzoma", avatar: "https://i.pravatar.cc/150?u=uzoma" },
        ].map((chat, i) => (
          <button 
            key={i} 
            onClick={() => {
              setSelectedChat(chat);
              setView('CHAT');
            }}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors active:bg-gray-100"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img src={chat.avatar} alt={chat.lastMsg} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className="text-sm font-bold text-gray-900 truncate">{chat.title}</h4>
              </div>
              <p className="text-xs font-medium text-gray-500">
                {chat.ended ? "Conversation has ended" : `${chat.lastMsg} • ${chat.date}`}
              </p>
            </div>
            {chat.hasUnread && <div className="w-2 h-2 rounded-full bg-red-500" />}
            <Icons.ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      // Handle file upload here
    }
  };

  const renderChat = () => {
    const messages = selectedChat?.id === 1 ? [
      { sender: 'user', text: "Hello, I'm having issues with my transaction PIN. It keeps saying incorrect even though I'm sure it's right.", time: '10:00 AM' },
      { sender: 'support', text: "Hello Aliyu! I'm sorry for the inconvenience. Let me look into your account security settings. Can you confirm your registered email?", time: '10:02 AM' },
      { sender: 'user', text: "Yes, it's aliyu.gogreen@gmail.com", time: '10:05 AM' },
      { sender: 'support', text: "Thank you. I've verified your identity. I've initiated a PIN reset for you. You'll receive a secure link to set a new one shortly.", time: '10:08 AM' },
      { sender: 'user', text: "Perfect, I've seen the link. Thank you so much for the quick response!", time: '10:12 AM' },
      { sender: 'support', text: "You're very welcome! Your security is our priority. Is there anything else you'd like me to assist with today?", time: '10:15 AM' },
      { sender: 'user', text: "No, that's all for now. Have a great day!", time: '10:18 AM' },
      { sender: 'support', text: "You too! Thank you for choosing Gogreen. This conversation is now closed.", time: '10:20 AM' },
    ] : selectedChat?.id === 3 ? [
      { sender: 'user', text: "Hi, I want to trade a $100 Steam Physical Gift Card. What's the current rate?", time: '02:00 PM' },
      { sender: 'support', text: "Hello! Current rate for Steam Physical is ₦1,250/$. Total for $100 will be ₦125,000. Would you like to proceed?", time: '02:02 PM' },
      { sender: 'user', text: "Yes, I'm ready. Sending the card now.", time: '02:05 PM' },
      { sender: 'user', text: "https://picsum.photos/seed/giftcard/800/1200", time: '02:06 PM', isImage: true },
      { sender: 'support', text: "Received! Please hold on while our team verifies the card. This usually takes 2-5 minutes.", time: '02:08 PM' },
      { sender: 'support', text: "Verification successful! Your wallet has been credited with ₦125,000. You can check your transaction history for the receipt.", time: '02:12 PM' },
      { sender: 'user', text: "Wow, that was fast! I've seen the alert. Thanks a lot!", time: '02:14 PM' },
      { sender: 'support', text: "Always a pleasure trading with you! Feel free to reach out anytime. Happy trading!", time: '02:15 PM' },
    ] : [
      { sender: 'support', text: "Hello! How can we help you today?", time: '09:41 AM' }
    ];

    return (
      <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-100 text-gray-900 rounded-tl-none'}`}>
                {msg.isImage ? (
                  <button 
                    onClick={() => setZoomedImage(msg.text)}
                    className="w-48 h-48 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-500 font-bold hover:opacity-90 transition-opacity active:scale-[0.98]"
                  >
                    <img src={msg.text} alt="Shared" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ) : (
                  <p className="text-sm font-bold">{msg.text}</p>
                )}
                <p className={`text-[10px] mt-1 font-black uppercase ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                  {msg.sender === 'user' ? 'You' : 'Support'} • {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {selectedChat?.ended ? (
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-sm font-bold text-gray-500 pb-24 md:pb-6">
            This conversation has ended
          </div>
        ) : (
          <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-3 pb-24 md:pb-6">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-100 px-4 py-3 flex items-center">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full bg-transparent outline-none text-sm font-bold text-gray-900"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Icons.Paperclip className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={() => setSelectedChat({ ...selectedChat, ended: true })}
              className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 active:scale-90 transition-all"
            >
              <Icons.Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col bg-white animate-fade-in items-center">
      <div className="w-full max-w-4xl flex flex-col h-full min-h-0">
        <div className="flex-shrink-0 bg-white/80 backdrop-blur-md z-20 sticky top-0">
          <BackHeader 
            title={view === 'COMPLAINT_FORM' ? "Contact Support" : view === 'CHAT' ? "Live Chat" : view === 'CHAT_HISTORY' ? "Chat History" : "Help Center"} 
            hideBack={view === 'CHAT_HISTORY'}
            onBack={() => {
              if (view === 'COMPLAINT_FORM' || view === 'CHAT_HISTORY') setView('HELP_CENTER');
              else if (view === 'CHAT') setView('CHAT_HISTORY');
              else onBack();
            }} 
          />
        </div>
        
        {view === 'HELP_CENTER' && renderHelpCenter()}
        {view === 'COMPLAINT_FORM' && renderComplaintForm()}
        {view === 'CHAT_HISTORY' && renderChatHistory()}
        {view === 'CHAT' && renderChat()}
      </div>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setZoomedImage(null)}
          >
            <motion.button 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
            >
              <Icons.X className="w-6 h-6" />
            </motion.button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={zoomedImage} 
                alt="Zoomed" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-4">
                <button 
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                  onClick={() => window.open(zoomedImage, '_blank')}
                >
                  <Icons.Download className="w-4 h-4" />
                  Save Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
