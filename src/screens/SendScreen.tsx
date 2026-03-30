import React, { useState, useEffect } from 'react';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { Icons } from '@/components/Icons';
import { BackHeader } from '../components/BackHeader';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { SwipeButton } from '@/components/SwipeButton';
import { LoadingScreen } from '@/components/LoadingScreen';
import { PrivacyText } from '../../components/PrivacyText';
import { getAvatarUrl } from '../constants/avatars';

interface SendScreenProps {
  setGlobalLoadingMessage: (msg: string) => void;
  setIsGlobalLoading: (loading: boolean) => void;
  showToast: (type: string, title: string, message: string) => void;
}

import { BrandPattern } from '../components/BrandPattern';
import { Confetti } from '../components/Confetti';
import { InsufficientBalanceModal } from '../components/InsufficientBalanceModal';

export const SendScreen: React.FC<SendScreenProps> = ({
  setGlobalLoadingMessage,
  setIsGlobalLoading,
  showToast
}) => {
  const {
    screen,
    setScreen,
    coins,
    sendAsset,
    setSendAsset,
    sendRecipient,
    setSendRecipient,
    sendRecipientType,
    setSendRecipientType,
    sendAmount,
    setSendAmount,
    hideBalance,
    completeChecklistTask,
    setSelectedTx,
    setShowReceiptOptionsModal,
    savedBeneficiaries,
    setSavedBeneficiaries,
    setShowPinModal,
    setOnPinSuccess,
    setOnPinCancel
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [showRecent, setShowRecent] = useState(false);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  const getNetworksForAsset = (symbol: string) => {
    switch (symbol?.toUpperCase()) {
      case 'USDT':
      case 'USDC':
        return ['ERC20', 'TRC20', 'BEP20', 'SOLANA'];
      case 'ETH':
        return ['ERC20', 'BEP20', 'ARBITRUM', 'OPTIMISM'];
      case 'BTC':
        return ['Bitcoin', 'BEP20', 'LIGHTNING'];
      case 'SOL':
        return ['SOLANA'];
      case 'BNB':
        return ['BEP20', 'BEP2'];
      default:
        return ['ERC20', 'BEP20'];
    }
  };

  const filteredRecipients = savedBeneficiaries.filter(recipient => {
    if (sendRecipientType === 'address') {
      // For wallet addresses, only show address type
      if (recipient.type !== 'address') return false;
      
      // If asset is selected, filter by asset's compatible networks
      if (sendAsset) {
        const compatibleNetworks = getNetworksForAsset(sendAsset.symbol);
        if (recipient.network && !compatibleNetworks.includes(recipient.network)) return false;
      }

      // If network is explicitly selected, match it
      if (selectedNetwork && recipient.network && recipient.network !== selectedNetwork) return false;
      
      return true;
    } else {
      // For internal transfers, show all non-address types
      return recipient.type !== 'address';
    }
  });

  const getNetworkFee = (net: string, symbol: string) => {
    const isStable = ['USDT', 'USDC'].includes(symbol?.toUpperCase());
    let feeAmount = 0;
    switch(net.toUpperCase()) {
        case 'ERC20': feeAmount = isStable ? 15.00 : 0.005; break;
        case 'TRC20': feeAmount = 1.00; break;
        case 'BEP20': feeAmount = isStable ? 0.50 : 0.0005; break;
        case 'SOLANA': feeAmount = isStable ? 1.00 : 0.005; break;
        case 'BITCOIN': feeAmount = 0.0005; break;
        case 'LIGHTNING': feeAmount = 0.00001; break;
        case 'ARBITRUM': feeAmount = 0.0005; break;
        case 'OPTIMISM': feeAmount = 0.0005; break;
        default: feeAmount = 0.001; break;
    }
    
    const usdRate = sendAsset ? sendAsset.rate / 1710 : 0;
    const usdValue = feeAmount * usdRate;
    
    return `${feeAmount} ${symbol} ($${usdValue.toFixed(2)})`;
  };

  const getNetworkIcon = (net: string) => {
    switch(net.toUpperCase()) {
        case 'ERC20': return <Icons.Globe />;
        case 'TRC20': return <Icons.Zap />;
        case 'BEP20': return <Icons.Coin />;
        case 'SOLANA': return <Icons.Flame />;
        case 'BITCOIN': return <Icons.Bitcoin />;
        case 'LIGHTNING': return <Icons.Zap />;
        default: return <Icons.Link />;
    }
  };

  const validateAddressForNetwork = (address: string, network: string) => {
    if (!address) return true;
    const net = network.toUpperCase();
    if (net === 'ERC20' || net === 'BEP20' || net === 'ARBITRUM' || net === 'OPTIMISM') {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
    if (net === 'TRC20') {
      return /^T[a-zA-Z0-9]{33}$/.test(address);
    }
    if (net === 'BITCOIN') {
      return /^(1|3|bc1)[a-zA-Z0-9]{25,62}$/.test(address);
    }
    if (net === 'SOLANA') {
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    }
    return true;
  };

  const renderSelectAsset = () => {
    // Filter out Naira and apply search/balance filters
    const sendableCoins = coins.filter(c => c.id !== 'ngn').filter(coin => {
        const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
        <div className="w-full flex flex-col flex-1 min-h-0">
          <BackHeader title="Send Crypto" subtitle="Select Asset" onBack={() => setScreen(AppScreen.HOME)} />
          
          <div className="px-4 pt-2 pb-2">
            <Input 
                placeholder="Search assets..." 
                value={searchQuery}
                variant="glass-light"
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<div className="w-4 h-4 text-gray-400"><Icons.Search /></div>}
                inputClassName="!h-11 !text-xs !rounded-[18px] !bg-white border-gray-100 shadow-sm !text-gray-900"
            />
          </div>

          <div className="p-4 space-y-3 overflow-y-auto no-scrollbar min-h-0">
            {sendableCoins.map((coin, index) => (
                <div 
                   key={coin.id} 
                   onClick={() => { 
                      setSendAsset(coin);
                      setScreen(AppScreen.SEND_RECIPIENT);
                   }} 
                   className="p-4 bg-white rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md animate-slide-up group"
                   style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                   <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold shadow-sm group-hover:scale-105 transition-transform" style={{ backgroundColor: coin.color }}>
                        {coin.symbol[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-[13px] tracking-tight mb-0.5">{coin.name}</p>
                        <div className="flex items-center gap-1.5">
                           <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{coin.symbol}</span>
                           <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{coin.network}</span>
                        </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-gray-900 text-[13px] tracking-tight tabular-nums">
                        <PrivacyText hide={hideBalance}>{`${coin.balance.toLocaleString()} ${coin.symbol}`}</PrivacyText>
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 tabular-nums">
                        <PrivacyText hide={hideBalance}>{`≈ $${((coin.balance * coin.rate) / 1710).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</PrivacyText>
                      </p>
                   </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderRecipient = () => {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
        <div className="w-full flex flex-col flex-1 min-h-0">
          <BackHeader title={`Send ${sendAsset?.symbol}`} subtitle="Recipient Details" onBack={() => setScreen(AppScreen.SEND_SELECT_ASSET)} />
          
          <div className="p-4 sm:p-6 space-y-5 flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24 min-h-0">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md" style={{ backgroundColor: sendAsset?.color }}>
                        {sendAsset?.symbol[0]}
                      </div>
                      <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Sending Asset</p>
                          <p className="font-bold text-gray-900 text-base tracking-tight">{sendAsset?.name}</p>
                      </div>
                  </div>
              </div>

              <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Recipient Details</label>
                    <button onClick={() => setShowRecent(!showRecent)} className="min-h-[44px] px-2 text-[10px] font-bold text-primary hover:text-green-700 transition-colors">
                      {showRecent ? 'Hide Recent' : 'Recent'}
                    </button>
                  </div>

                  {showRecent ? (
                    <div className="space-y-2 animate-fade-in">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1 mb-2">Recent & Saved</p>
                      {filteredRecipients.length > 0 ? filteredRecipients.map((recipient) => (
                        <div 
                          key={recipient.id}
                          onClick={() => {
                            setSendRecipientType(recipient.type as any);
                            setSendRecipient(recipient.type === 'address' ? recipient.fullAddress : recipient.value);
                            if (recipient.type === 'address' && (recipient as any).network) {
                              setSelectedNetwork((recipient as any).network);
                            }
                            setShowRecent(false);
                          }}
                          className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 cursor-pointer hover:border-primary/30 hover:shadow-sm active:scale-[0.98] transition-all group"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-50 overflow-hidden border border-gray-100 shrink-0 group-hover:scale-105 transition-transform">
                            <img src={recipient.avatar} alt={recipient.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-[13px] truncate">{recipient.name}</p>
                            <p className="text-[11px] text-gray-500 font-medium truncate">{recipient.value}</p>
                          </div>
                          <div className="px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                            {recipient.type === 'address' ? (recipient as any).network || 'address' : recipient.type}
                          </div>
                        </div>
                      )) : (
                        <div className="p-8 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">No matching beneficiaries</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-1 p-1 bg-gray-100/80 rounded-2xl mb-2">
                        {[
                          { id: 'internal', label: 'Internal Transfer' },
                          { id: 'address', label: 'Wallet Address' }
                        ].map((type) => (
                          <button
                            key={type.id}
                            onClick={() => {
                                if (type.id === 'internal') {
                                    setSendRecipientType('username');
                                } else {
                                    setSendRecipientType('address');
                                }
                            }}
                            className={`flex-1 px-4 h-11 rounded-xl text-[11px] font-bold transition-all ${
                                (sendRecipientType !== 'address' && type.id === 'internal') || 
                                (sendRecipientType === 'address' && type.id === 'address') 
                                ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>

                      <Input 
                          placeholder={sendRecipientType !== 'address' ? "Enter Gogreen Username, Email or ID" : "Paste External Wallet Address"}
                          value={sendRecipient}
                          onChange={(e) => {
                              const val = e.target.value;
                              setSendRecipient(val);
                              if (sendRecipientType !== 'address') {
                                  if (val.includes('@') && val.includes('.')) {
                                      setSendRecipientType('email');
                                  } else if (val.startsWith('₦')) {
                                      setSendRecipientType('username');
                                  } else if (/^\d+$/.test(val)) {
                                      setSendRecipientType('gogreen_id');
                                  } else {
                                      setSendRecipientType('username');
                                  }
                              }
                          }}
                          inputClassName={`!h-14 !text-sm !font-bold !rounded-2xl !bg-white border-gray-200 focus:!border-primary/50 focus:!ring-primary/10 ${sendRecipientType === 'address' && sendRecipient && !validateAddressForNetwork(sendRecipient, selectedNetwork) ? 'border-red-500 ring-1 ring-red-500' : ''} !text-gray-900 placeholder:text-gray-400`}
                          rightElement={
                              <button 
                                onClick={() => setScreen(AppScreen.SCANNER)}
                                className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                              >
                                <Icons.QrCode className="w-4 h-4" />
                              </button>
                          }
                      />
                      
                      {sendRecipientType !== 'address' ? (
                        <div className="space-y-3 pt-1">
                            <div className="flex items-center gap-3 px-1">
                                <div className="flex-1 h-[1px] bg-gray-100"></div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Auto-Detecting</span>
                                <div className="flex-1 h-[1px] bg-gray-100"></div>
                            </div>
                            <div className="flex gap-2 justify-center">
                                {[
                                  { id: 'username', label: 'Username', icon: '₦' },
                                  { id: 'email', label: 'Email', icon: '✉' },
                                  { id: 'gogreen_id', label: 'User ID', icon: '#' }
                                ].map(type => (
                                  <button 
                                    key={type.id} 
                                    onClick={() => setSendRecipientType(type.id as any)}
                                    className={`flex items-center gap-1.5 px-3 h-11 rounded-xl text-[9px] font-bold uppercase tracking-wider border transition-all duration-300 ${sendRecipientType === type.id ? 'bg-primary/5 text-primary border-primary/20' : 'bg-white border-gray-100 text-gray-400 opacity-60'}`}
                                  >
                                    <span className="text-[10px]">{type.icon}</span>
                                    {type.label}
                                  </button>
                                ))}
                            </div>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Select Network</label>
                                <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">Required</span>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                                    className={`w-full min-h-[44px] p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${selectedNetwork ? 'bg-white border-primary/50 shadow-sm ring-1 ring-primary/10' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                >
                                    {selectedNetwork ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary text-white">
                                                <div className="w-4 h-4">{getNetworkIcon(selectedNetwork)}</div>
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-bold uppercase tracking-wider text-gray-900">{selectedNetwork}</p>
                                                <p className="text-[10px] text-gray-500 font-medium mt-0.5">Fee: {getNetworkFee(selectedNetwork, sendAsset?.symbol || '')}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-sm font-bold text-gray-400">Select Network</span>
                                    )}
                                    <Icons.ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showNetworkDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showNetworkDropdown && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-20 animate-fade-in">
                                        {getNetworksForAsset(sendAsset?.symbol || '').map(net => (
                                            <button
                                                key={net}
                                                onClick={() => {
                                                    setSelectedNetwork(net);
                                                    setShowNetworkDropdown(false);
                                                }}
                                                className="w-full min-h-[44px] p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-gray-400">
                                                        <div className="w-4 h-4">{getNetworkIcon(net)}</div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-900">{net}</p>
                                                        <p className="text-[9px] text-gray-500 font-medium mt-0.5">Instant</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-gray-900 tabular-nums">{getNetworkFee(net, sendAsset?.symbol || '')}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Fee</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {sendRecipient && !validateAddressForNetwork(sendRecipient, selectedNetwork) && selectedNetwork && (
                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-red-100 animate-shake">
                                    <div className="w-4 h-4 text-gray-500"><Icons.Alert /></div>
                                    <p className="text-[10px] text-gray-600 font-bold">Address does not match {selectedNetwork} format</p>
                                </div>
                            )}
                        </div>
                      )}
                    </>
                  )}
              </div>

              <div className="bg-green-50/50 p-5 rounded-[28px] border border-green-100 flex gap-4 items-start shadow-sm">
                  <div className="w-5 h-5 text-primary mt-0.5"><Icons.Info /></div>
                  <div>
                      <p className="text-[10px] font-black text-green-900 mb-1 uppercase tracking-widest">Internal Transfers are Free</p>
                      <p className="text-[10px] text-green-700 leading-relaxed font-bold opacity-70">
                          {sendRecipientType !== 'address' 
                            ? "Sending to another Gogreen user via User ID, Email, or Username incurs zero fees and is instant."
                            : `Sending ${sendAsset?.symbol} to an external wallet incurs network fees and depends on blockchain confirmation.`}
                      </p>
                  </div>
              </div>

              {!showRecent && sendRecipient && sendRecipient.length >= 3 && (
                  <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
                      <label 
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => setSaveBeneficiary(!saveBeneficiary)}
                      >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${saveBeneficiary ? 'bg-primary border-primary text-white' : 'border-gray-300 text-transparent group-hover:border-primary'}`}>
                              <Icons.Check className="w-3 h-3" />
                          </div>
                          <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Save as Beneficiary</span>
                      </label>
                      
                      {saveBeneficiary && (
                          <div className="animate-fade-in" onClick={(e) => e.stopPropagation()}>
                              <Input 
                                  placeholder="Beneficiary Name (e.g. John's Wallet)"
                                  value={beneficiaryName}
                                  onChange={(e) => setBeneficiaryName(e.target.value)}
                                  inputClassName="!h-12 !text-xs !rounded-[16px] !bg-gray-50/50 border-gray-100 !text-gray-900"
                              />
                          </div>
                      )}
                  </div>
              )}

              <div className="mt-auto pt-6 flex justify-center">
                <Button 
                  disabled={!sendRecipient || sendRecipient.length < 3 || (sendRecipientType === 'address' && (!selectedNetwork || !validateAddressForNetwork(sendRecipient, selectedNetwork))) || (saveBeneficiary && !beneficiaryName)}
                  onClick={() => setScreen(AppScreen.SEND_AMOUNT)}
                  className="px-12 !h-14 !rounded-[24px] !bg-primary shadow-2xl shadow-primary/10 !text-xs font-black uppercase tracking-[0.2em]"
                >
                    Continue
                </Button>
              </div>
          </div>
        </div>
      </div>
    );
  };

  const [inputUnit, setInputUnit] = useState<'coin' | 'ngn' | 'usd'>('coin');
  const [displayAmount, setDisplayAmount] = useState('');

  // Update sendAmount whenever displayAmount or inputUnit changes
  useEffect(() => {
    if (!displayAmount || !sendAsset) {
      setSendAmount('');
      return;
    }
    const val = parseFloat(displayAmount);
    if (isNaN(val)) return;

    if (inputUnit === 'coin') {
      setSendAmount(displayAmount);
    } else if (inputUnit === 'ngn') {
      setSendAmount((val / sendAsset.rate).toString());
    } else if (inputUnit === 'usd') {
      const usdRate = sendAsset.rate / 1710;
      setSendAmount((val / usdRate).toString());
    }
  }, [displayAmount, inputUnit, sendAsset]);

  const handleUnitToggle = () => {
    if (inputUnit === 'coin') {
      setInputUnit('usd');
      if (sendAmount && sendAsset) {
        const usdRate = sendAsset.rate / 1710;
        setDisplayAmount((parseFloat(sendAmount) * usdRate).toFixed(2));
      }
    } else if (inputUnit === 'usd') {
      setInputUnit('ngn');
      if (sendAmount && sendAsset) {
        setDisplayAmount((parseFloat(sendAmount) * sendAsset.rate).toFixed(2));
      }
    } else {
      setInputUnit('coin');
      if (sendAmount) {
        setDisplayAmount(parseFloat(sendAmount).toString());
      }
    }
  };

  const renderAmount = () => {
    const usdRate = sendAsset ? sendAsset.rate / 1710 : 0;
    const coinAmount = parseFloat(sendAmount || '0');
    const usdValue = coinAmount * usdRate;
    const ngnValue = coinAmount * (sendAsset?.rate || 0);

    let equivalentText = '';
    if (inputUnit === 'coin') {
      equivalentText = `≈ $${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ₦${ngnValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (inputUnit === 'usd') {
      equivalentText = `≈ ${coinAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${sendAsset?.symbol} / ₦${ngnValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      equivalentText = `≈ ${coinAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${sendAsset?.symbol} / $${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
        <div className="w-full flex flex-col flex-1 min-h-0">
          <BackHeader title="Send Crypto" subtitle="Enter Amount" onBack={() => setScreen(AppScreen.SEND_RECIPIENT)} />
          
          <div className="p-4 sm:p-6 flex-1 flex flex-col gap-5 overflow-y-auto no-scrollbar pb-24 min-h-0">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                  <div className="flex justify-center items-center gap-2 mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount to Send</p>
                    <button 
                      onClick={handleUnitToggle}
                      className="bg-gray-50 px-2.5 h-11 rounded-lg text-[9px] font-bold text-gray-600 uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center gap-1 border border-gray-100"
                    >
                      <Icons.Refresh className="w-3 h-3" />
                      {inputUnit}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                      <Input 
                          value={displayAmount}
                          onChange={(e) => {
                              const val = e.target.value;
                              if (/^\d*\.?\d*$/.test(val)) {
                                  setDisplayAmount(val);
                              }
                          }}
                          placeholder="0"
                          variant="glass-light"
                          className="w-48"
                          inputClassName="!text-5xl !font-display !font-bold !text-center !bg-transparent !border-none !shadow-none !p-0 !h-16 focus:!ring-0 placeholder:text-gray-200 !text-gray-900 tabular-nums"
                          autoFocus
                      />
                      <span className="text-xl font-bold text-primary uppercase tracking-wider">
                        {inputUnit === 'coin' ? sendAsset?.symbol : inputUnit === 'usd' ? 'USD' : 'NGN'}
                      </span>
                  </div>
                  
                  <p className="text-[11px] font-bold text-gray-400 mb-8 uppercase tracking-wider bg-gray-50 inline-block px-4 py-1.5 rounded-full border border-gray-100 tabular-nums">
                      <PrivacyText hide={hideBalance}>{equivalentText}</PrivacyText>
                  </p>

                  <div className="grid grid-cols-4 gap-3">
                      {[
                          { label: '25%', pct: 0.25 },
                          { label: '50%', pct: 0.5 },
                          { label: '75%', pct: 0.75 },
                          { label: 'MAX', pct: 1 }
                      ].map(({ label, pct }) => (
                          <button 
                            key={label}
                            onClick={() => {
                              const targetCoinAmount = (sendAsset?.balance || 0) * pct;
                              if (inputUnit === 'coin') {
                                setDisplayAmount(targetCoinAmount.toString());
                              } else if (inputUnit === 'usd') {
                                setDisplayAmount((targetCoinAmount * usdRate).toFixed(2));
                              } else {
                                setDisplayAmount((targetCoinAmount * (sendAsset?.rate || 0)).toFixed(2));
                              }
                            }}
                            className={`h-11 rounded-xl text-[10px] font-bold transition-all active:scale-95 border shadow-sm ${label === 'MAX' ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white' : 'bg-white text-gray-500 border-gray-100 hover:border-primary hover:text-primary'}`}
                          >
                              {label}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="mt-auto space-y-4 flex flex-col items-center">
                  <div className="flex justify-between items-center px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Available Balance</span>
                      <span className="text-[12px] font-bold text-gray-900 tabular-nums"><PrivacyText hide={hideBalance}>{`${sendAsset?.balance.toLocaleString()} ${sendAsset?.symbol}`}</PrivacyText></span>
                  </div>
                    <Button 
                      disabled={!sendAmount || parseFloat(sendAmount) <= 0 || parseFloat(sendAmount) > (sendAsset?.balance || 0)}
                      onClick={() => setScreen(AppScreen.SEND_CONFIRM)}
                      className="px-12 !h-14 !rounded-2xl !bg-primary shadow-lg shadow-primary/10 !text-xs font-bold uppercase tracking-wider"
                    >
                        Review Transfer
                    </Button>
              </div>
          </div>
        </div>
      </div>
    );
  };

  const [feeDeductionMethod, setFeeDeductionMethod] = useState<'balance' | 'amount'>('balance');

  const renderConfirm = () => {
    const networkFee = sendRecipientType === 'address' ? 0.0005 : 0;
    const amountNum = parseFloat(sendAmount || '0');
    
    // Calculate actual amount sent and total deducted based on preference
    let actualSent = amountNum;
    let totalDeducted = amountNum;
    
    if (sendRecipientType === 'address') {
      if (feeDeductionMethod === 'amount') {
        actualSent = amountNum - networkFee;
        totalDeducted = amountNum;
      } else {
        actualSent = amountNum;
        totalDeducted = amountNum + networkFee;
      }
    }

    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center relative overflow-hidden w-full h-full min-h-0">
        <div className="w-full flex flex-col flex-1 min-h-0 relative z-10">
          <BackHeader title="Confirm Send" subtitle="Review Details" onBack={() => setScreen(AppScreen.SEND_AMOUNT)} />
          
          <div className="p-4 sm:p-6 space-y-5 flex-1 flex flex-col overflow-y-auto no-scrollbar min-h-0">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6 relative overflow-hidden shrink-0">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                  <div className="text-center pb-6 border-b border-gray-50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Recipient Gets</p>
                      <h2 className="text-3xl font-display font-bold text-gray-900 mb-2 tracking-tight tabular-nums">{actualSent} {sendAsset?.symbol}</h2>
                      <p className="text-[11px] font-bold text-primary uppercase tracking-wider bg-primary/5 inline-block px-4 py-1 rounded-full tabular-nums">≈ <PrivacyText hide={hideBalance}>{`$${(actualSent * (sendAsset?.rate / 1710)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</PrivacyText></p>
                  </div>

                  <div className="space-y-4">
                      <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Recipient</span>
                          <div className="text-right">
                              <p className="text-sm font-bold text-gray-900 truncate max-w-[180px]">{sendRecipient}</p>
                              <p className="text-[9px] font-bold text-primary uppercase tracking-wider mt-0.5">{sendRecipientType.replace('_', ' ')}</p>
                          </div>
                      </div>
                      <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Network Fee</span>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${sendRecipientType === 'address' ? 'bg-gray-50 text-gray-900' : 'bg-green-50 text-green-600'}`}>
                              {sendRecipientType === 'address' ? (
                                <>
                                  <Icons.Zap className="w-3 h-3" />
                                  <span className="tabular-nums">{networkFee} {sendAsset?.symbol}</span>
                                </>
                              ) : (
                                <>
                                  <Icons.Check className="w-3 h-3" />
                                  <span className="uppercase tracking-wider">FREE</span>
                                </>
                              )}
                          </div>
                      </div>
                      <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                          <span className="text-[10px] text-gray-900 font-bold uppercase tracking-wider">Total to Deduct</span>
                          <span className="text-lg font-bold text-primary tracking-tight tabular-nums">
                              <PrivacyText hide={hideBalance}>{`${totalDeducted} ${sendAsset?.symbol}`}</PrivacyText>
                          </span>
                      </div>
                  </div>
              </div>

              {sendRecipientType === 'address' && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm shrink-0">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 shrink-0">
                      <Icons.Alert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-gray-900 mb-1">Network Fees Apply</h4>
                      <p className="text-[9px] text-gray-500 leading-relaxed font-medium">Network fees will be charged except covered by fee discount vouchers.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Deduct fee from:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setFeeDeductionMethod('balance')}
                        className={`px-4 h-11 rounded-xl border text-[10px] font-bold transition-all ${feeDeductionMethod === 'balance' ? 'bg-primary/5 border-primary text-primary' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                      >
                        Wallet Balance
                      </button>
                      <button 
                        onClick={() => setFeeDeductionMethod('amount')}
                        className={`px-4 h-11 rounded-xl border text-[10px] font-bold transition-all ${feeDeductionMethod === 'amount' ? 'bg-primary/5 border-primary text-primary' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                      >
                        Withdrawal Amount
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4 shrink-0">
                <SwipeButton text="Swipe to Send" onComplete={() => {
                    if (totalDeducted > (sendAsset?.balance || 0)) {
                        setShowInsufficientModal(true);
                        return;
                    }
                    setOnPinSuccess(() => async () => {
                        setScreen(AppScreen.SEND_PROCESSING);
                        await new Promise(r => setTimeout(r, 2000));
                        completeChecklistTask('request');
                        const isSuccess = Math.random() > 0.3; // Simulated logic
                        if (isSuccess) {
                          setScreen(AppScreen.SEND_SUCCESS);
                          // Save beneficiary if requested or if it's a Gogreen tag
                          if (sendRecipientType !== 'address') {
                            const newBeneficiary = {
                              id: Date.now().toString(),
                              name: beneficiaryName || sendRecipient,
                              value: sendRecipient,
                              type: sendRecipientType,
                              avatar: getAvatarUrl(sendRecipient)
                            };
                            setSavedBeneficiaries(prev => {
                              // Avoid duplicates
                              if (prev.find(b => b.value === sendRecipient)) return prev;
                              return [newBeneficiary, ...prev];
                            });
                          }
                        }
                        else if (Math.random() > 0.5) setScreen(AppScreen.SEND_FAILED);
                        else setScreen(AppScreen.SEND_REJECTED);
                    });
                    setShowPinModal(true);
                }} />
                <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-4">Transaction is irreversible once confirmed</p>
              </div>
          </div>
        </div>
        
        <InsufficientBalanceModal 
          isOpen={showInsufficientModal}
          onClose={() => setShowInsufficientModal(false)}
          onConfirm={() => {
            setShowInsufficientModal(false);
            setOnPinSuccess(() => async () => {
                setGlobalLoadingMessage('Auto-swapping and Processing...');
                setIsGlobalLoading(true);
                
                setTimeout(() => {
                    setIsGlobalLoading(false);
                    setScreen(AppScreen.SEND_SUCCESS);
                    completeChecklistTask('request');
                }, 2500);
            });
            setOnPinCancel(() => () => showToast('error', 'Cancelled', 'Action cancelled due to user inability to verify action'));
            setShowPinModal(true);
          }}
          requiredAmount={totalDeducted}
          currency={sendAsset?.symbol}
          message={`You don't have enough ${sendAsset?.symbol} for this transaction. Would you like to auto-swap other assets to cover this amount?`}
        />
      </div>
    );
  };

  const renderSuccess = () => {
    return (
        <div className="flex-1 flex flex-col bg-green-50/30 items-center animate-fade-in relative overflow-hidden w-full h-full min-h-0">
           <Confetti />
           {/* Success Header with Gradient Background */}
           <div className="w-full bg-gray-900 pt-12 pb-20 px-6 text-center relative overflow-hidden">
              <BrandPattern opacity={0.15} size={48} animate={true} color="white" className="absolute inset-0 pointer-events-none" />
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gray-900/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-2xl animate-epic-bounce mx-auto text-gray-900 border-4 border-white/20">
                  <Icons.Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1.5 tracking-tight">Transfer Successful!</h2>
                <p className="text-white/70 text-[11px] font-bold uppercase tracking-wider">Transaction ID: TXN-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
           </div>

           {/* Details Card - Floating */}
           <div className="w-full px-4 -mt-12 relative z-20 flex-1 overflow-y-auto no-scrollbar pb-24 min-h-0">
               <div className="bg-white rounded-[40px] p-6 shadow-2xl shadow-gray-200/60 border border-gray-100 relative overflow-hidden">
                  <div className="border-2 border-dashed border-primary/50 rounded-[32px] p-8 text-center mb-8 relative z-10 bg-primary/5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Total Sent</p>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                      {sendAmount} <span className="text-primary">{sendAsset?.symbol}</span>
                    </h1>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Recipient</span>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm truncate max-w-[180px]">{sendRecipient}</p>
                        <p className="text-[9px] font-bold text-primary uppercase tracking-wider mt-0.5">{sendRecipientType.replace('_', ' ')}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center py-4 border-b border-gray-50">
                      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Network Fee</span>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${sendRecipientType === 'address' ? 'bg-gray-50 text-gray-900' : 'bg-green-50 text-green-600'}`}>
                        {sendRecipientType === 'address' ? `0.0005 ${sendAsset?.symbol}` : 'FREE'}
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-4">
                      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Status</span>
                      <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full border border-green-100">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-3 relative z-10 flex flex-col items-center">
                    <Button variant="primary" onClick={() => setScreen(AppScreen.HOME)} className="px-12 !h-14 !rounded-2xl shadow-lg shadow-primary/20 !text-xs font-bold uppercase tracking-wider">Back to Dashboard</Button>
                    <div className="flex gap-3 w-full justify-center">
                      <Button variant="outline" className="px-6 !h-12 !rounded-2xl !text-[10px] font-bold uppercase tracking-wider border-gray-100" onClick={() => {
                        const tx = {
                          id: Date.now().toString(),
                          type: `Sent ${sendAsset?.symbol || 'Crypto'}`,
                          amount: `-${Number(sendAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${sendAsset?.symbol}`,
                          fiatAmount: `-${Number(sendAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${sendAsset?.symbol}`,
                          cryptoAmount: `-${Number(sendAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${sendAsset?.symbol}`,
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                          status: 'Success',
                          ref: `TXN-${Math.floor(Math.random() * 1000000000)}`,
                          bankName: 'N/A',
                          accountNumber: sendRecipient,
                          network: selectedNetwork || sendAsset?.network || 'N/A',
                          coinName: sendAsset?.name,
                          unitAmount: `1 ${sendAsset?.symbol} = ₦${sendAsset?.rate?.toLocaleString()}`,
                          depositDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          platformFee: sendRecipientType === 'address' ? `0.0005 ${sendAsset?.symbol}` : 'FREE',
                          explorerLink: 'https://etherscan.io'
                        };
                        setSelectedTx(tx);
                        setScreen(AppScreen.RECEIPT_IMAGE_PREVIEW);
                      }}>View Receipt</Button>
                      <Button variant="outline" className="px-6 !h-12 !rounded-2xl !text-[10px] font-bold uppercase tracking-wider border-gray-100" onClick={() => {
                        const tx = {
                          id: Date.now().toString(),
                          type: `Sent ${sendAsset?.symbol || 'Crypto'}`,
                          amount: `-${Number(sendAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${sendAsset?.symbol}`,
                          fiatAmount: `-${Number(sendAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${sendAsset?.symbol}`,
                          cryptoAmount: `-${Number(sendAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })} ${sendAsset?.symbol}`,
                          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                          status: 'Success',
                          ref: `TXN-${Math.floor(Math.random() * 1000000000)}`,
                          bankName: 'N/A',
                          accountNumber: sendRecipient,
                          network: selectedNetwork || sendAsset?.network || 'N/A',
                          coinName: sendAsset?.name,
                          unitAmount: `1 ${sendAsset?.symbol} = ₦${sendAsset?.rate?.toLocaleString()}`,
                          depositDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                          platformFee: sendRecipientType === 'address' ? `0.0005 ${sendAsset?.symbol}` : 'FREE',
                          explorerLink: 'https://etherscan.io'
                        };
                        setSelectedTx(tx);
                        setShowReceiptOptionsModal(true);
                      }}>Share</Button>
                    </div>
                  </div>
               </div>
           </div>
        </div>
    );
  };

  const renderBankAccount = () => {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
        <div className="w-full flex flex-col flex-1 min-h-0">
          <BackHeader title="Send money" onBack={() => setScreen(AppScreen.SEND_DESTINATION)} />
          
          <div className="p-4 sm:p-6 space-y-6 flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24 min-h-0">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Enter receiver details</h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Select Bank</label>
                <div className="relative">
                  <select className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
                    <option value="">Select a bank</option>
                    <option value="gtb">Guaranty Trust Bank</option>
                    <option value="fbn">First Bank of Nigeria</option>
                    <option value="zenith">Zenith Bank</option>
                    <option value="uba">United Bank for Africa</option>
                    <option value="access">Access Bank</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Icons.ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Account Number</label>
                <Input 
                  placeholder="0000000000" 
                  type="number"
                  value=""
                  onChange={() => {}}
                  variant="glass-light"
                  inputClassName="!h-12 !text-sm !rounded-xl !bg-white border-gray-200 shadow-sm !text-gray-900 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 ml-1">Account Name</label>
                <Input 
                  placeholder="John Doe" 
                  value=""
                  onChange={() => {}}
                  variant="glass-light"
                  inputClassName="!h-12 !text-sm !rounded-xl !bg-gray-50 border-gray-200 shadow-sm !text-gray-900"
                  disabled
                />
                <p className="text-[9px] text-gray-400 ml-1">Name will be fetched automatically</p>
              </div>
            </div>

            <div className="mt-auto pt-6 flex justify-center">
              <Button 
                onClick={() => {
                  setSendRecipientType('address');
                  setSendRecipient('Bank Account');
                  setScreen(AppScreen.SEND_SELECT_ASSET);
                }}
                className="px-12 !h-14 !rounded-2xl shadow-lg shadow-primary/20 !text-xs font-bold uppercase tracking-wider"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGogreenSearch = () => {
    const hasHistory = savedBeneficiaries.some(b => b.type !== 'address');

    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
        <div className="w-full flex flex-col flex-1 min-h-0">
          <BackHeader 
            title="Send money" 
            onBack={() => setScreen(hasHistory ? AppScreen.SEND_NEW_RECEIVER : AppScreen.SEND_DESTINATION)} 
          />
          
          <div className="p-4 sm:p-6 space-y-6 flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24 min-h-0">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Enter receiver details</h2>
            
            <div className="space-y-4">
              <Input 
                placeholder="Search Gogreen tag or email" 
                value={searchQuery}
                variant="glass-light"
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<div className="w-4 h-4 text-gray-400"><Icons.Search /></div>}
                inputClassName="!h-12 !text-sm !rounded-xl !bg-white border-gray-200 shadow-sm !text-gray-900"
              />

              {searchQuery.length > 2 && (
                <div className="mt-6">
                  {searchQuery.toLowerCase() === 'alexj' || searchQuery.toLowerCase() === 'sarah@example.com' ? (
                    <div 
                      onClick={() => {
                        setSendRecipientType(searchQuery.includes('@') ? 'email' : 'gogreen_id');
                        setSendRecipient(searchQuery);
                        setScreen(AppScreen.SEND_SELECT_ASSET);
                      }}
                      className="p-4 bg-white rounded-2xl flex items-center gap-4 cursor-pointer border border-gray-100 shadow-sm hover:border-primary/30 active:scale-[0.98] transition-all"
                    >
                      <img src={getAvatarUrl(searchQuery)} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-100" />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-[14px]">{searchQuery.includes('@') ? 'Sarah Williams' : 'Alex Johnson'}</p>
                        <p className="text-[11px] text-gray-500">{searchQuery}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                        <Icons.User className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">User not found</h3>
                      <p className="text-xs text-gray-500 mb-4">Invite them to Gogreen to send money instantly.</p>
                      
                      <div className="space-y-3">
                        <Input 
                          placeholder="Enter their email or phone number" 
                          value=""
                          onChange={() => {}}
                          variant="glass-light"
                          inputClassName="!h-11 !text-xs !rounded-xl !bg-gray-50 border-gray-200"
                        />
                        <Button 
                          onClick={() => {
                            const message = encodeURIComponent("Join me on Gogreen! Use my invite code GOGREEN2026 to sign up: https://gogreen.app/invite/GOGREEN2026");
                            window.open(`mailto:?subject=Join Gogreen&body=${message}`, '_blank');
                          }}
                          className="px-8 !h-11 !rounded-xl !text-xs font-bold mx-auto"
                        >
                          Send Invite
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNewReceiver = () => {
    // This is now the Gogreen History screen
    const gogreenBeneficiaries = savedBeneficiaries.filter(b => b.type !== 'address');

    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
        <div className="w-full flex flex-col flex-1 min-h-0">
          <BackHeader title="Gogreen tag" onBack={() => setScreen(AppScreen.SEND_DESTINATION)} />
          
          <div className="p-4 sm:p-6 space-y-6 flex-1 flex flex-col overflow-y-auto no-scrollbar pb-24 min-h-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Saved receivers</h2>
              <button 
                onClick={() => setScreen(AppScreen.SEND_GOGREEN_SEARCH)}
                className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-primary/20 transition-colors"
              >
                Add new receiver
              </button>
            </div>
            
            <div className="space-y-3">
              {gogreenBeneficiaries.length > 0 ? (
                gogreenBeneficiaries.map((recipient) => (
                  <div 
                    key={recipient.id}
                    onClick={() => {
                      setSendRecipientType(recipient.type);
                      setSendRecipient(recipient.value);
                      setScreen(AppScreen.SEND_SELECT_ASSET);
                    }}
                    className="p-4 bg-white rounded-2xl flex items-center gap-4 cursor-pointer border border-gray-100 shadow-sm hover:border-primary/30 active:scale-[0.98] transition-all"
                  >
                    <img src={recipient.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-gray-100" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-[14px]">{recipient.name}</p>
                      <p className="text-[11px] text-gray-500">{recipient.value}</p>
                    </div>
                    <Icons.ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <Icons.User className="w-8 h-8" />
                  </div>
                  <p className="text-gray-900 font-bold">No saved receivers yet</p>
                  <p className="text-gray-500 text-xs mt-1">Pay someone to see them here</p>
                  <Button 
                    variant="primary" 
                    onClick={() => setScreen(AppScreen.SEND_GOGREEN_SEARCH)}
                    className="mt-6 !h-11 !px-8 !rounded-xl !text-xs"
                  >
                    Search for user
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStatus = (status: 'processing' | 'failed' | 'rejected') => {
    const isProcessing = status === 'processing';
    const isFailed = status === 'failed';
    const isRejected = status === 'rejected';

    if (isProcessing) {
      return (
        <div className="flex-1 flex flex-col bg-white animate-fade-in">
          <LoadingScreen message="Processing Transfer..." />
          <div className="mt-auto p-6 w-full max-w-md mx-auto flex justify-center">
            <Button variant="outline" onClick={() => setScreen(AppScreen.HOME)} className="px-12 !h-14 !rounded-[24px] !text-xs font-black uppercase tracking-[0.2em]">Back to Dashboard</Button>
          </div>
        </div>
      );
    }

    return (
        <div className="flex-1 flex flex-col bg-green-50/30 items-center justify-center animate-fade-in p-6">
           <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mb-8 shadow-2xl ${isProcessing ? 'bg-primary' : isFailed ? 'bg-gray-500 animate-shake' : 'bg-gray-500 animate-shake'}`}>
             {isProcessing ? <Icons.Refresh className="w-12 h-12 text-white animate-spin" /> : 
              isFailed ? <Icons.Alert className="w-12 h-12 text-white" /> : 
              <Icons.X className="w-12 h-12 text-white" />}
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
             {isProcessing ? 'Processing Transfer' : isFailed ? 'Transfer Failed' : 'Transfer Rejected'}
           </h2>
           <p className="text-gray-500 text-sm font-medium mb-10 text-center">
             {isProcessing ? 'Your transaction is being processed. This may take a few minutes.' : 
              isFailed ? 'Something went wrong. Please try again later.' : 
              'Your transaction was rejected by the network.'}
           </p>
           <div className="w-full flex justify-center">
             <Button variant="primary" onClick={() => setScreen(AppScreen.HOME)} className="px-12 !h-14 !rounded-[24px] shadow-xl shadow-primary/20 !text-xs font-black uppercase tracking-[0.2em]">Back to Dashboard</Button>
           </div>
        </div>
    );
  };

  const renderDestination = () => {
    // This is now the Main Options screen
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center w-full h-full overflow-hidden min-h-0">
        <div className="w-full flex flex-col flex-1 min-h-0">
          <BackHeader title="Send money" onBack={() => setScreen(AppScreen.HOME)} />
          
          <div className="p-4 sm:p-6 space-y-6 flex-1 flex flex-col">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Where do you want to send money?</h2>
            
            <div className="space-y-3">
              <div 
                onClick={() => setScreen(AppScreen.SEND_BANK_ACCOUNT)}
                className="p-4 bg-white rounded-2xl flex items-center gap-4 cursor-pointer border border-gray-100 shadow-sm hover:border-primary/30 active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <Icons.Bank className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900 text-[15px]">Bank account</span>
              </div>

              <div 
                onClick={() => {}}
                className="p-4 bg-white rounded-2xl flex items-center gap-4 cursor-pointer border border-gray-100 shadow-sm hover:border-primary/30 active:scale-[0.98] transition-all opacity-50"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-primary">
                  <Icons.Smartphone className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900 text-[15px]">Mobile money</span>
              </div>

              <div 
                onClick={() => {
                  const hasHistory = savedBeneficiaries.some(b => b.type !== 'address');
                  if (hasHistory) {
                    setScreen(AppScreen.SEND_NEW_RECEIVER);
                  } else {
                    setScreen(AppScreen.SEND_GOGREEN_SEARCH);
                  }
                }}
                className="p-4 bg-white rounded-2xl flex items-center gap-4 cursor-pointer border border-gray-100 shadow-sm hover:border-primary/30 active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin-slow"></div>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <span className="font-medium text-gray-900 text-[15px]">Gogreen tag</span>
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">Fast and convenient</span>
                </div>
              </div>

              <div 
                onClick={() => setScreen(AppScreen.SEND_SELECT_ASSET)}
                className="p-4 bg-white rounded-2xl flex items-center gap-4 cursor-pointer border border-gray-100 shadow-sm hover:border-primary/30 active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                  <Icons.Wallet className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900 text-[15px]">Crypto Wallet Address</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (screen) {
    case AppScreen.SEND_DESTINATION:
      return renderDestination();
    case AppScreen.SEND_NEW_RECEIVER:
      return renderNewReceiver();
    case AppScreen.SEND_GOGREEN_SEARCH:
      return renderGogreenSearch();
    case AppScreen.SEND_BANK_ACCOUNT:
      return renderBankAccount();
    case AppScreen.SEND_SELECT_ASSET:
      return renderSelectAsset();
    case AppScreen.SEND_RECIPIENT:
      return renderRecipient();
    case AppScreen.SEND_AMOUNT:
      return renderAmount();
    case AppScreen.SEND_CONFIRM:
      return renderConfirm();
    case AppScreen.SEND_SUCCESS:
      return renderSuccess();
    case AppScreen.SEND_PROCESSING:
      return renderStatus('processing');
    case AppScreen.SEND_FAILED:
      return renderStatus('failed');
    case AppScreen.SEND_REJECTED:
      return renderStatus('rejected');
    default:
      return null;
  }
};
