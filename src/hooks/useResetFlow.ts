import { useContext } from 'react';
import { AppContext } from '../../AppContext';

export const useResetFlow = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useResetFlow must be used within AppProvider');
  
  const { 
    setSendAsset, setSendRecipient, setSendRecipientType, setSendAmount,
    setSwapFromAsset, setSwapToAsset, setSwapAmount,
    setWithdrawAmount,
    setGiftCardTradeType, setSelectedGiftCard, setSelectedGiftCardCountry, setGiftCardAmount, setGiftCardCodeType,
    setSelectedBillCategory, setBillDetails, setSelectedVoucher,
    setSelectedCoin, setSellAmount
  } = context;

  return () => {
    setSendAsset(null);
    setSendRecipient('');
    setSendRecipientType('username');
    setSendAmount('');
    setSwapFromAsset(null);
    setSwapToAsset(null);
    setSwapAmount('');
    setWithdrawAmount('');
    setGiftCardTradeType(null);
    setSelectedGiftCard(null);
    setSelectedGiftCardCountry(null);
    setGiftCardAmount('');
    setGiftCardCodeType(null);
    setSelectedBillCategory(null);
    setBillDetails({ provider: '', customerId: '', amount: '' });
    setSelectedVoucher(null);
    setSelectedCoin(null);
    setSellAmount('');
  };
};
