import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AppScreen } from '../../types';
import { useAppContext } from '../../AppContext';
import { BackHeader } from '../components/BackHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Icons } from '../../components/Icons';
import { BrandPattern } from '../components/BrandPattern';
import * as Constants from '../../constants';
import { InsufficientBalanceModal } from '../components/InsufficientBalanceModal';

export const BillPaymentScreen = ({ setIsGlobalLoading, setGlobalLoadingMessage }: { setIsGlobalLoading: (b: boolean) => void, setGlobalLoadingMessage: (m: string) => void }) => {
  const { 
    screen,
    setScreen, 
    walletBalance, 
    setWalletBalance, 
    selectedBillCategory, 
    setSelectedBillCategory, 
    billDetails, 
    setBillDetails, 
    selectedVoucher, 
    setSelectedVoucher,
    completeChecklistTask
  } = useAppContext();

  const [showRecent, setShowRecent] = useState(false);
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);

  const recentBeneficiaries = [
    { id: '1', name: 'My MTN Line', value: '08123456789', provider: 'MTN', category: 'Airtime' },
    { id: '2', name: 'Home Prepaid', value: '45012345678', provider: 'IKEDC', category: 'Electricity' },
    { id: '3', name: 'Wife Data', value: '09087654321', provider: 'Airtel Data', category: 'Data Bundle' }
  ];

  const showToast = (message: string) => toast.success(message, {
    style: { background: '#10B981', color: '#fff', fontSize: '12px', fontWeight: 'bold' }
  });

  const vouchers = Constants.VOUCHERS;

  if (screen === AppScreen.PAY_BILLS) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in overflow-hidden items-center">
        <div className="w-full max-w-2xl flex flex-col h-full mx-auto">
            <BackHeader title="Pay Bills" onBack={() => setScreen(AppScreen.HOME)} />
            <div className="p-5 grid grid-cols-2 gap-4 overflow-y-auto no-scrollbar pb-24">
              {[
                { label: 'Registrations', desc: 'Register your Business Name or LTD Company', icon: <Icons.FileText />, providers: ['CAC'], bg: 'bg-white', iconColor: 'text-primary', iconBorder: 'border-primary/20' },
                { label: 'Airtime', desc: 'Recharge your airtime to your preferred network', icon: <Icons.Phone />, providers: ['MTN', 'Airtel', 'Glo', '9mobile'], bg: 'bg-white', iconColor: 'text-primary', iconBorder: 'border-primary/20' },
                { label: 'Data Bundle', desc: 'Buy cheap plans for all networks instantly.', icon: <Icons.Wifi />, providers: ['MTN Data', 'Airtel Data', 'Glo Data', '9mobile Data'], bg: 'bg-white', iconColor: 'text-primary', iconBorder: 'border-primary/20' },
                { label: 'Cable TV', desc: 'Subscribe your GOTV, DSTV & STARTIME.', icon: <Icons.Monitor />, providers: ['DSTV', 'GOTV', 'Startimes'], bg: 'bg-white', iconColor: 'text-primary', iconBorder: 'border-primary/20' },
                { label: 'Electricity', desc: 'Buy your token for EKEDC, AEDC, IKEDC & more.', icon: <Icons.Zap />, providers: ['IKEDC', 'EKEDC', 'AEDC', 'PHED'], bg: 'bg-white', iconColor: 'text-primary', iconBorder: 'border-primary/20' },
                { label: 'Education', desc: 'Buy your JAMB, WAEC, NECO Exam scratch cards', icon: <Icons.GraduationCap />, providers: ['JAMB', 'WAEC', 'NECO'], bg: 'bg-white', iconColor: 'text-primary', iconBorder: 'border-primary/20' }
              ].map(cat => (
                <div key={cat.label} onClick={() => { setSelectedBillCategory(cat); setScreen(AppScreen.BILL_PAYMENT_DETAILS); }} className={`p-5 ${cat.bg} rounded-[24px] aspect-[4/5] flex flex-col items-start justify-between cursor-pointer active:scale-95 transition-all shadow-sm hover:shadow-md border border-gray-100 group`}>
                  <div className={`w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center shadow-sm border ${cat.iconBorder} ${cat.iconColor} group-hover:scale-110 transition-transform`}>
                    <div className="w-5 h-5">
                      {cat.icon}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="font-black text-gray-900 text-[14px] tracking-tight leading-tight mb-2">{cat.label}</p>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed opacity-80">{cat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    );
  }

  if (screen === AppScreen.BILL_PAYMENT_DETAILS) {
    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center">
        <div className="w-full max-w-xl flex flex-col h-full mx-auto">
            <BackHeader title={selectedBillCategory?.label || 'Bill Payment'} subtitle="Enter Payment Details" onBack={() => setScreen(AppScreen.PAY_BILLS)} />
            <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1 pb-24">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Select Provider</label>
                    <div className="grid grid-cols-2 gap-3">
                        {selectedBillCategory?.providers.map((p: string) => (
                            <button 
                                key={p} 
                                onClick={() => setBillDetails({...billDetails, provider: p})}
                                className={`p-4 rounded-2xl border text-[11px] font-black transition-all relative overflow-hidden ${billDetails.provider === p ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white text-gray-900 border-gray-100 shadow-sm hover:border-primary/30 active:scale-95'}`}
                            >
                                {billDetails.provider === p && <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-md"></div>}
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                        {selectedBillCategory?.label === 'Airtime' || selectedBillCategory?.label === 'Data' ? 'Phone Number' : 'Customer ID / Meter Number'}
                      </label>
                      <button onClick={() => setShowRecent(!showRecent)} className="text-[8px] font-black text-primary uppercase tracking-widest">
                        {showRecent ? 'Hide Recent' : 'Recent'}
                      </button>
                    </div>

                    {showRecent ? (
                      <div className="space-y-2 animate-fade-in">
                        {recentBeneficiaries.filter(b => b.category === selectedBillCategory?.label).map((beneficiary) => (
                          <div 
                            key={beneficiary.id}
                            onClick={() => {
                              setBillDetails({...billDetails, customerId: beneficiary.value, provider: beneficiary.provider});
                              setShowRecent(false);
                            }}
                            className="flex items-center gap-3 p-3 bg-white rounded-[20px] border border-gray-100 cursor-pointer hover:border-primary/30 active:scale-[0.98] transition-all shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                              <Icons.User className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-gray-900 text-[12px] truncate">{beneficiary.name}</p>
                              <p className="text-[10px] text-gray-500 font-medium truncate">{beneficiary.value} • {beneficiary.provider}</p>
                            </div>
                          </div>
                        ))}
                        {recentBeneficiaries.filter(b => b.category === selectedBillCategory?.label).length === 0 && (
                          <p className="text-[10px] text-gray-400 text-center py-4 font-bold">No saved beneficiaries for this category.</p>
                        )}
                      </div>
                    ) : (
                      <Input 
                          placeholder={selectedBillCategory?.label === 'Airtime' || selectedBillCategory?.label === 'Data' ? "e.g. 08123456789" : "e.g. 12345678901"}
                          variant="glass-light"
                          value={billDetails.customerId}
                          onChange={(e) => {
                              const val = e.target.value.replace(/\s/g, '');
                              if (selectedBillCategory?.label === 'Airtime' || selectedBillCategory?.label === 'Data') {
                                  // Allow only digits for phone numbers
                                  if (/^\d*$/.test(val)) {
                                      setBillDetails({...billDetails, customerId: val});
                                  }
                              } else {
                                  // Allow alphanumeric for other IDs
                                  setBillDetails({...billDetails, customerId: val});
                              }
                          }}
                          inputClassName="!h-14 !text-base !font-black !rounded-[24px] !border-gray-100 shadow-sm focus:!border-primary/30 !text-gray-900"
                      />
                    )}
                  </div>

                  {selectedBillCategory?.label === 'Data' && billDetails.provider && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Select Data Plan</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['1GB / 1 Day - ₦350', '2GB / 3 Days - ₦800', '5GB / 7 Days - ₦1,500', '10GB / 30 Days - ₦3,000'].map(plan => (
                          <button 
                            key={plan}
                            onClick={() => {
                              const amtStr = plan.split('₦')[1].replace(',', '');
                              setBillDetails({...billDetails, amount: amtStr, plan: plan});
                            }}
                            className={`p-3 rounded-2xl border text-[10px] font-black transition-all ${billDetails.plan === plan ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white text-gray-900 border-gray-100 shadow-sm hover:border-primary/30 active:scale-95'}`}
                          >
                            {plan}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBillCategory?.label === 'Cable TV' && billDetails.provider && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Select Package</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Compact - ₦12,500', 'Premium - ₦29,500', 'Jinja - ₦2,700', 'Max - ₦5,300'].map(plan => (
                          <button 
                            key={plan}
                            onClick={() => {
                              const amtStr = plan.split('₦')[1].replace(',', '');
                              setBillDetails({...billDetails, amount: amtStr, plan: plan});
                            }}
                            className={`p-3 rounded-2xl border text-[10px] font-black transition-all ${billDetails.plan === plan ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white text-gray-900 border-gray-100 shadow-sm hover:border-primary/30 active:scale-95'}`}
                          >
                            {plan}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedBillCategory?.label !== 'Data' && selectedBillCategory?.label !== 'Cable TV' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-2">Amount</label>
                      <Input 
                          type="number"
                          placeholder="0.00"
                          prefix="₦"
                          variant="glass-light"
                          value={billDetails.amount}
                          onChange={(e) => {
                              const val = e.target.value;
                              // Allow only valid amount (digits and one dot)
                              if (/^\d*\.?\d*$/.test(val)) {
                                  setBillDetails({...billDetails, amount: val});
                              }
                          }}
                          inputClassName="!h-14 !text-base !font-black !rounded-[24px] !border-gray-100 shadow-sm focus:!border-primary/30 !text-gray-900"
                      />
                      <div className="flex gap-2 mt-2 ml-1">
                        {[500, 1000, 2000, 5000].map(amt => (
                          <button 
                            key={amt}
                            onClick={() => setBillDetails({...billDetails, amount: amt.toString()})}
                            className="px-3 py-1.5 rounded-full bg-white border border-gray-100 text-[9px] font-black text-gray-500 hover:border-primary/30 hover:text-primary transition-all active:scale-90"
                          >
                            ₦{amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!showRecent && billDetails.customerId && billDetails.customerId.length >= 3 && (
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
                                    placeholder="Beneficiary Name (e.g. My Phone)"
                                    value={beneficiaryName}
                                    onChange={(e) => setBeneficiaryName(e.target.value)}
                                    inputClassName="!h-12 !text-xs !rounded-[16px] !bg-gray-50/50 border-gray-100 !text-gray-900"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-auto pt-8">
                    <Button 
                        disabled={!billDetails.provider || !billDetails.customerId || !billDetails.amount || parseFloat(billDetails.amount) <= 0 || (saveBeneficiary && !beneficiaryName)}
                        onClick={() => setScreen(AppScreen.BILL_PAYMENT_SUMMARY)}
                        className="w-full !h-16 !rounded-[28px] !bg-primary shadow-2xl shadow-primary/10 !text-xs font-black uppercase tracking-[0.2em] group"
                    >
                        Review Payment
                        <Icons.ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (screen === AppScreen.BILL_PAYMENT_SUMMARY) {
    const billAmount = parseFloat(billDetails.amount) || 0;
    const discount = selectedVoucher ? (billAmount * 0.05) : 0;
    const totalToPay = billAmount - discount;

    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center relative overflow-hidden">
        <BrandPattern opacity={0.03} size={60} animate={true} className="absolute inset-0 pointer-events-none" />
        <div className="w-full max-w-xl flex flex-col h-full mx-auto relative z-10">
            <BackHeader title="Summary" subtitle="Confirm Your Payment" onBack={() => setScreen(AppScreen.BILL_PAYMENT_DETAILS)} />
            <div className="p-6 space-y-5 overflow-y-auto no-scrollbar flex-1 pb-24">
                <div className="bg-white p-6 rounded-[40px] shadow-2xl shadow-gray-200/40 border border-gray-100 space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Service</span>
                        <span className="text-sm font-black text-gray-900">{selectedBillCategory?.label}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Provider</span>
                        <span className="text-sm font-black text-gray-900">{billDetails.provider}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Account</span>
                        <span className="text-sm font-black text-gray-900">{billDetails.customerId}</span>
                    </div>
                    {billDetails.plan && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-50">
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Plan</span>
                          <span className="text-sm font-black text-gray-900">{billDetails.plan.split(' - ')[0]}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Base Amount</span>
                        <span className="text-sm font-black text-gray-900">₦ {billAmount.toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-[40px] shadow-xl shadow-gray-100/50 border border-gray-100">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Apply Voucher</h4>
                        {selectedVoucher && (
                            <button onClick={() => setSelectedVoucher(null)} className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] hover:opacity-70 transition-opacity">Remove</button>
                        )}
                    </div>
                    
                    {selectedVoucher ? (
                        <div className={`${selectedVoucher.color} p-5 rounded-[28px] text-white flex justify-between items-center shadow-xl animate-scale-in relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
                            <div className="relative z-10">
                                <p className="font-black text-sm tracking-tight">{selectedVoucher.title}</p>
                                <p className="text-[9px] font-black opacity-70 uppercase tracking-[0.2em] mt-1">5% Discount Applied</p>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center relative z-10">
                                <Icons.Check className="w-5 h-5" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {vouchers.map(v => {
                                const isEligible = billAmount >= v.minOrderAmount;
                                return (
                                    <div 
                                        key={v.id} 
                                        onClick={() => {
                                            if (isEligible) setSelectedVoucher(v);
                                            else showToast(`Minimum order for this voucher is ₦${v.minOrderAmount.toLocaleString()}`);
                                        }}
                                        className={`p-4 rounded-[24px] border flex justify-between items-center transition-all group ${isEligible ? 'bg-gray-50 border-gray-100 cursor-pointer hover:border-primary/30 active:scale-[0.98]' : 'bg-gray-50/50 border-gray-100 opacity-50 grayscale cursor-not-allowed'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-2xl ${v.color} flex items-center justify-center text-white text-xs font-black shadow-sm`}>%</div>
                                            <div>
                                                <p className="font-black text-gray-900 text-[12px] tracking-tight">{v.title}</p>
                                                <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.2em] mt-0.5">Min: ₦{v.minOrderAmount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isEligible ? 'border-gray-300 group-hover:border-primary/50' : 'border-gray-200'}`}>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="bg-gray-900 p-6 rounded-[40px] text-white shadow-2xl shadow-primary/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-all duration-700"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Total to Pay</span>
                          <h2 className="text-2xl font-black tracking-tighter mt-1">₦ {totalToPay.toLocaleString()}</h2>
                        </div>
                        {discount > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-2xl border border-white/20 animate-bounce-subtle">
                              <Icons.Sparkles className="w-3 h-3 text-white" />
                              <p className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Saved ₦ {discount.toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-8">
                    <Button 
                        onClick={() => {
                            if (walletBalance < totalToPay) {
                                setShowInsufficientModal(true);
                                return;
                            }
                            setGlobalLoadingMessage('Processing Payment...');
                            setIsGlobalLoading(true);
                            setTimeout(() => {
                                setWalletBalance(walletBalance - totalToPay);
                                setIsGlobalLoading(false);
                                setScreen(AppScreen.BILL_PAYMENT_SUCCESS);
                                if (selectedBillCategory?.label === 'Airtime') {
                                  completeChecklistTask('airtime');
                                }
                            }, 2000);
                        }}
                        className="w-full !h-16 !rounded-[28px] !bg-primary shadow-2xl shadow-primary/10 !text-xs font-black uppercase tracking-[0.2em]"
                    >
                        Confirm & Pay ₦{totalToPay.toLocaleString()}
                    </Button>
                </div>
            </div>
        </div>
        
        <InsufficientBalanceModal 
          isOpen={showInsufficientModal}
          onClose={() => setShowInsufficientModal(false)}
          onConfirm={() => {
            setShowInsufficientModal(false);
            setGlobalLoadingMessage('Auto-swapping and Processing...');
            setIsGlobalLoading(true);
            
            setTimeout(() => {
                setIsGlobalLoading(false);
                setScreen(AppScreen.BILL_PAYMENT_SUCCESS);
                if (selectedBillCategory?.label === 'Airtime') {
                  completeChecklistTask('airtime');
                }
            }, 2500);
          }}
          requiredAmount={totalToPay}
        />
      </div>
    );
  }

  if (screen === AppScreen.BILL_PAYMENT_SUCCESS) {
    const billAmount = parseFloat(billDetails.amount) || 0;
    const discount = selectedVoucher ? (billAmount * 0.05) : 0;
    const totalToPay = billAmount - discount;

    return (
      <div className="flex-1 flex flex-col bg-green-50/30 animate-fade-in items-center justify-center p-6 text-center relative overflow-hidden">
        <BrandPattern opacity={0.05} size={80} animate={true} className="absolute inset-0 pointer-events-none" />
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-primary/20 mx-auto animate-bounce-subtle">
              <Icons.Check className="w-12 h-12 stroke-[3]" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Payment Successful!</h2>
            <p className="text-gray-500 font-medium">Your {selectedBillCategory?.label} payment has been processed instantly.</p>
          </div>

          <div className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Amount Paid</span>
              <span className="text-lg font-black text-gray-900">₦ {totalToPay.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Provider</span>
              <span className="text-sm font-black text-gray-900">{billDetails.provider}</span>
            </div>
            {billDetails.plan && (
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Plan</span>
                <span className="text-sm font-black text-gray-900">{billDetails.plan.split(' - ')[0]}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Reference</span>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">GG-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
              onClick={() => {
                setScreen(AppScreen.HOME);
                setBillDetails({ provider: '', customerId: '', amount: '' });
                setSelectedVoucher(null);
              }}
              className="w-full !h-14 !rounded-[24px] !bg-primary shadow-xl shadow-primary/10 !text-xs font-black uppercase tracking-[0.2em]"
            >
              Back to Home
            </Button>
            <button 
              onClick={() => showToast("Receipt downloaded successfully!")}
              className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-primary transition-colors"
            >
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
