import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { Icons } from '../components/Icons';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BackHeader } from '../components/BackHeader';
import { useAppContext } from '../../AppContext';
import { AppScreen } from '../../types';

const GIFT_CARDS = [
  { id: 'itunes', name: 'iTunes', color: '#FA57C1', icon: '🍎' },
  { id: 'amazon', name: 'Amazon', color: '#FF9900', icon: '📦' },
  { id: 'steam', name: 'Steam', color: '#171a21', icon: '🎮' },
  { id: 'googleplay', name: 'Google Play', color: '#34A853', icon: '▶️' },
  { id: 'apple', name: 'Apple Store', color: '#000000', icon: '🍏' },
  { id: 'ebay', name: 'eBay', color: '#E53238', icon: '🛒' },
  { id: 'vanilla', name: 'Vanilla Visa', color: '#0047BB', icon: '💳' },
  { id: 'sephora', name: 'Sephora', color: '#000000', icon: '💄' },
  { id: 'nordstrom', name: 'Nordstrom', color: '#000000', icon: '👗' },
  { id: 'razer', name: 'Razer Gold', color: '#00FF00', icon: '🐍' },
];

const COUNTRIES = [
  { id: 'usa', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', currency: 'CAD', symbol: 'C$' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', currency: 'EUR', symbol: '€' },
  { id: 'france', name: 'France', flag: '🇫🇷', currency: 'EUR', symbol: '€' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', currency: 'AUD', symbol: 'A$' },
];

export const GiftCardScreen = () => {
  const { 
    screen, 
    setScreen, 
    giftCardTradeType, 
    selectedGiftCard, 
    setSelectedGiftCard,
    selectedGiftCardCountry,
    setSelectedGiftCardCountry,
    giftCardAmount,
    setGiftCardAmount,
    giftCardCodeType,
    setGiftCardCodeType,
    setActiveModal
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const tradeMessage = useMemo(() => {
    const action = giftCardTradeType === 'BUY' ? 'I want to buy' : 'I want to sell';
    return `${action}\n${selectedGiftCardCountry?.symbol || ''}${giftCardAmount}, ${selectedGiftCard?.name.toUpperCase()} CARD, ${giftCardCodeType}, ${selectedGiftCardCountry?.name.toUpperCase()}`;
  }, [giftCardAmount, selectedGiftCard, giftCardCodeType, selectedGiftCardCountry, giftCardTradeType]);

  React.useEffect(() => {
    if (screen === AppScreen.GIFT_CARD_TRADE_CHAT) {
      // Automatically send the message when the chat screen loads
      console.log('Sending message:', tradeMessage);
      // Here we would normally add the message to the chat state
    }
  }, [screen, tradeMessage]);

  const filteredCards = useMemo(() => {
    return GIFT_CARDS.filter(card => 
      card.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderList = () => (
    <div className="flex-1 flex flex-col bg-ghost animate-fade-in">
      <BackHeader 
        title={giftCardTradeType === 'SELL' ? 'Sell Giftcards' : 'Buy Giftcards'} 
        subtitle="Select Brand" 
        onBack={() => {
          setActiveModal(AppScreen.GIFT_CARD_TRADE_OPTIONS);
          setScreen(AppScreen.GIFT_CARD_TRADE_OPTIONS);
        }} 
      />
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-6">
          <Input 
            placeholder="Search giftcards..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="glass-light"
            icon={<Icons.Search className="w-4 h-4 text-gray-400" />}
            className="!bg-white !border-gray-100 shadow-sm"
            inputClassName="!text-gray-900 font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredCards.map((card) => (
            <button
              key={card.id}
              onClick={() => {
                setSelectedGiftCard(card);
                setScreen(AppScreen.GIFT_CARD_TYPE_SELECTION);
              }}
              className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner" style={{ backgroundColor: card.color + '20' }}>
                {card.icon}
              </div>
              <span className="font-black text-gray-900 text-xs uppercase tracking-wider">{card.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTypeSelection = () => (
    <div className="flex-1 flex flex-col bg-ghost animate-slide-up">
      <BackHeader 
        title={selectedGiftCard?.name} 
        subtitle="Select Card Type" 
        onBack={() => setScreen(AppScreen.GIFT_CARD_LIST)} 
      />
      <div className="p-4 flex-1 flex flex-col gap-4">
        <button
          onClick={() => {
            setGiftCardCodeType('ECODE');
            setScreen(AppScreen.GIFT_CARD_COUNTRY);
          }}
          className="w-full bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 active:scale-95 transition-all hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl">⚡</div>
          <div className="text-left">
            <h4 className="font-black text-gray-900 text-sm">E-code / Digital Code</h4>
          </div>
        </button>
        {giftCardTradeType !== 'BUY' && (
          <button
            onClick={() => {
              setGiftCardCodeType('PHYSICAL');
              setScreen(AppScreen.GIFT_CARD_COUNTRY);
            }}
            className="w-full bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 active:scale-95 transition-all hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-2xl">💳</div>
            <div className="text-left">
              <h4 className="font-black text-gray-900 text-sm">Physical Card</h4>
            </div>
          </button>
        )}
      </div>
    </div>
  );

  const renderCountry = () => (
    <div className="flex-1 flex flex-col bg-ghost animate-slide-up">
      <BackHeader 
        title={selectedGiftCard?.name} 
        subtitle="Select Country" 
        onBack={() => setScreen(AppScreen.GIFT_CARD_LIST)} 
      />
      <div className="p-4 flex-1 flex flex-col">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          {COUNTRIES.map((country, i) => (
            <button
              key={country.id}
              onClick={() => {
                setSelectedGiftCardCountry(country);
                setScreen(AppScreen.GIFT_CARD_DETAILS);
              }}
              className={`w-full flex items-center justify-between p-5 ${i !== COUNTRIES.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 active:bg-gray-100 transition-colors`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{country.flag}</span>
                <span className="font-bold text-gray-900 text-sm">{country.name}</span>
              </div>
              <Icons.ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="flex-1 flex flex-col bg-ghost animate-slide-up">
      <BackHeader 
        title={`${selectedGiftCard?.name} (${selectedGiftCardCountry?.flag})`} 
        subtitle="Trade Details" 
        onBack={() => setScreen(AppScreen.GIFT_CARD_COUNTRY)}
        className="bg-white"
      />
      <div className="p-4 flex-1 flex flex-col">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner" style={{ backgroundColor: selectedGiftCard?.color + '20' }}>
              {selectedGiftCard?.icon}
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-lg leading-tight">{selectedGiftCard?.name}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedGiftCardCountry?.name}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Amount ({selectedGiftCardCountry?.symbol})</label>
              <div className="relative">
                <input 
                  type="number"
                  placeholder="0.00"
                  value={giftCardAmount}
                  onChange={(e) => setGiftCardAmount(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-2xl font-black text-gray-900 focus:outline-none focus:border-primary transition-colors"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{selectedGiftCardCountry?.currency}</div>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mb-1">Trade Type</p>
                <p className="text-xl font-black text-primary">{giftCardCodeType === 'ECODE' ? 'E-code' : 'Physical'}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mb-1">Country</p>
                <p className="text-xs font-black text-primary">{selectedGiftCardCountry?.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mb-6">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Trade Instructions</h4>
          <ul className="space-y-3">
            {[
              'Upload a clear picture of the card.',
              'Receipt must be included for large amounts.',
              'Trade will be processed within 5-15 minutes.',
              'Funds will be credited to your Naira wallet.'
            ].map((text, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[8px] font-black mt-0.5">{i + 1}</div>
                <p className="text-[10px] text-gray-600 font-medium leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <Button 
            onClick={() => {
              const amount = parseFloat(giftCardAmount);
              if (isNaN(amount) || amount <= 0) {
                toast.error('Please enter a valid gift card amount.');
                return;
              }
              setScreen(AppScreen.GIFT_CARD_CONFIRMATION);
            }}
            className="w-full !h-14 rounded-2xl shadow-lg shadow-primary/20"
          >
            Get Rate
          </Button>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="flex-1 flex flex-col bg-ghost animate-slide-up">
      <BackHeader 
        title="Confirm Trade" 
        subtitle="Review Details" 
        onBack={() => setScreen(AppScreen.GIFT_CARD_DETAILS)} 
      />
      <div className="p-4 flex-1 flex flex-col">
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mb-6 space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-gray-50">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Trade Type</span>
            <span className="text-gray-900 font-black text-sm uppercase">{giftCardTradeType}</span>
          </div>
          <div className="flex justify-between items-center pb-6 border-b border-gray-50">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Card</span>
            <span className="text-gray-900 font-black text-sm">{selectedGiftCard?.name}</span>
          </div>
          <div className="flex justify-between items-center pb-6 border-b border-gray-50">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Country</span>
            <span className="text-gray-900 font-black text-sm">{selectedGiftCardCountry?.name}</span>
          </div>
          <div className="flex justify-between items-center pb-6 border-b border-gray-50">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Type</span>
            <span className="text-gray-900 font-black text-sm">{giftCardCodeType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Amount</span>
            <span className="text-primary font-black text-lg">{selectedGiftCardCountry?.symbol}{giftCardAmount}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            onClick={async () => {
              setIsSubmitting(true);
              try {
                // Simulate network request
                await new Promise((resolve, reject) => {
                  setTimeout(() => {
                    // Simulate occasional network error (10% chance)
                    if (Math.random() < 0.1) {
                      reject(new Error('Network connection failed. Please try again.'));
                    } else {
                      resolve(true);
                    }
                  }, 1500);
                });
                setScreen(AppScreen.GIFT_CARD_TRADE_CHAT);
              } catch (error: any) {
                toast.error(error.message || 'An error occurred while processing your request.');
              } finally {
                setIsSubmitting(false);
              }
            }}
            disabled={isSubmitting}
            className="w-full !h-14 rounded-2xl shadow-lg shadow-primary/20 relative"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <img src="/assets/logos/gogreen-white-logomark.png" alt="Processing..." className="w-5 h-5 animate-spin object-contain" />
                <span>Processing...</span>
              </div>
            ) : (
              'Confirm & Proceed'
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderChat = () => {
    return (
      <div className="flex-1 flex flex-col bg-ghost animate-fade-in">
        <BackHeader 
          title="Trade Chat" 
          subtitle="Active Trade" 
          onBack={() => setScreen(AppScreen.GIFT_CARD_DETAILS)} 
        />
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1 bg-white rounded-[32px] border border-gray-100 shadow-sm p-4 mb-4 overflow-y-auto no-scrollbar">
            <div className="space-y-4">
              <div className="flex justify-center">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">Today, 12:45 PM</span>
              </div>
              
              <div className="flex gap-3 items-start flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Icons.User className="w-4 h-4" />
                </div>
                <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                  <p className="text-[11px] font-medium leading-relaxed whitespace-pre-line">
                    {tradeMessage}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icons.User className="w-4 h-4" />
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                  <p className="text-[11px] text-gray-700 font-medium leading-relaxed">
                    Hello! We have received your request. Please upload the front and back of your {selectedGiftCard?.name} card.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Icons.User className="w-4 h-4" />
                </div>
                <button 
                  onClick={() => setZoomedImage("https://picsum.photos/seed/giftcard/800/1200")}
                  className="w-48 h-48 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-500 font-bold hover:opacity-90 transition-opacity active:scale-[0.98]"
                >
                  <img src="https://picsum.photos/seed/giftcard/800/1200" alt="Shared" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm active:scale-95 transition-all">
              <Icons.Image className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input 
                placeholder="Type a message..."
                className="w-full h-12 bg-white border border-gray-100 rounded-2xl px-4 text-xs font-medium focus:outline-none focus:border-primary shadow-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-md active:scale-90 transition-all">
                <Icons.Send className="w-4 h-4" />
              </button>
            </div>
          </div>
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

  switch (screen) {
    case AppScreen.GIFT_CARD_LIST: return renderList();
    case AppScreen.GIFT_CARD_TYPE_SELECTION: return renderTypeSelection();
    case AppScreen.GIFT_CARD_COUNTRY: return renderCountry();
    case AppScreen.GIFT_CARD_DETAILS: return renderDetails();
    case AppScreen.GIFT_CARD_CONFIRMATION: return renderConfirmation();
    case AppScreen.GIFT_CARD_TRADE_CHAT: return renderChat();
    default: return null;
  }
};
