import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Tag, 
  X, 
  QrCode, 
  Lock,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Clock,
  BookOpen,
  PlayCircle,
  Smartphone,
  Zap,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal = ({ exam, item: propItem, isOpen, onClose, onPurchaseSuccess }) => {
  const item = propItem || exam;
  const { user, enrollExam, isDeveloper } = useAuth();
  const { 
    lang, 
    recordPurchase, 
    developerUpiId, 
    developerPhone, 
    developerName,
    developerUpiQrImage,
    allPurchases
  } = useData();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  
  // UPI QR & UTR State
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Status State
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState('');
  const [lastPaymentMethod, setLastPaymentMethod] = useState('');

  // Reset modal state when opening/closing
  React.useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setIsCompleted(false);
      setPaymentError('');
      setCouponCode('');
      setDiscountPercent(0);
      setCouponError('');
      setCouponSuccess('');
      setUtrNumber('');
      setCopiedUpi(false);
      setCopiedPhone(false);
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const originalPrice = item.price !== undefined ? Number(item.price) : 49;
  const discountedPrice = Math.max(0, Math.round(originalPrice * (1 - discountPercent / 100)));

  // Clean 10-Digit Mobile Number and Payee Info (Strictly Mobile Number Only)
  const rawPhone = (developerPhone || '6360433316').replace(/\D/g, '');
  const activePhone = rawPhone.length === 10 ? rawPhone : (rawPhone.slice(-10) || '6360433316');
  const merchantName = developerName || 'SAVITHA (ಅಧ್ಯಯನ)';
  const cleanTitle = encodeURIComponent((item?.title || 'Study Material').substring(0, 30));
  const encodedName = encodeURIComponent(merchantName);

  // App Launcher Intents - Direct App Openers (No @ybl VPA to prevent bank security decline)
  const phonePeUrl = `phonepe://`;
  const gpayUrl = `gpay://`;
  const paytmUrl = `paytmmp://`;
  const upiUrl = `upi://pay?pa=${activePhone}@ybl&pn=${encodedName}&am=${discountedPrice}&cu=INR&tn=${cleanTitle}`;

  const qrCodeImageUrl = developerUpiQrImage || `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiUrl)}&margin=10`;

  const copyToClipboard = (text, type = 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 3000);
    }
  };

  // WhatsApp prefilled support message
  const whatsappNumber = (developerPhone || '6360433316').replace(/\D/g, '');
  const whatsappText = encodeURIComponent(
    `ನಮಸ್ಕಾರ, ನಾನು ADHYAYANA ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ "${item.title}" (₹${discountedPrice}) ಗಾಗಿ ಪಾವತಿ ಮಾಡಿದ್ದೇನೆ.\nನನ್ನ ಇಮೇಲ್: ${user?.email || 'N/A'}\nUTR/Ref: ${utrNumber || 'ಪಾವತಿಸಲಾಗಿದೆ'}\nದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ ಅನ್‌ಲಾಕ್ ಮಾಡಿ.`
  );
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${whatsappText}`;

  // Submit UPI Direct Payment / UTR
  const handleConfirmUpiPayment = async (e) => {
    e.preventDefault();
    setPaymentError('');

    const cleanUtr = utrNumber.trim();

    if (discountedPrice > 0) {
      // 1. Strict 12-digit numeric validation (Indian Banking UPI Standard)
      if (!/^\d{12}$/.test(cleanUtr)) {
        setPaymentError(
          lang === 'kn'
            ? 'ಅಮಾನ್ಯ UTR ಸಂಖ್ಯೆ! PhonePe / GPay ರಸೀದಿಯಲ್ಲಿರುವ ನಿಖರವಾದ 12-ಅಂಕಿಯ ಸಂಖ್ಯೆಯನ್ನು ಮಾತ್ರ ನಮೂದಿಸಿ (ಉದಾ: 423589124578).'
            : 'Invalid UTR! Please enter the exact 12-digit numeric UPI Ref / UTR number from your payment receipt.'
        );
        return;
      }

      // 2. Reject obvious fake / repetitive dummy numbers
      if (/^(\d)\1{11}$/.test(cleanUtr) || cleanUtr === '123456789012') {
        setPaymentError(
          lang === 'kn'
            ? 'ಅಮಾನ್ಯ ಅಥವಾ ನಕಲಿ UTR ಸಂಖ್ಯೆ! ದಯವಿಟ್ಟು PhonePe/GPay ನ ಅಸಲಿ UTR ನಮೂದಿಸಿ.'
            : 'Invalid or dummy UTR number! Please enter the real 12-digit UTR from your bank app.'
        );
        return;
      }

      // 3. Duplicate Prevention: Check if this UTR has already been used by ANY user
      const isAlreadyUsed = (allPurchases || []).some(
        p => (p.utrNumber && p.utrNumber.trim() === cleanUtr) ||
             (p.paymentId && p.paymentId === `UPI_UTR_${cleanUtr}`)
      );

      if (isAlreadyUsed) {
        setPaymentError(
          lang === 'kn'
            ? `⚠️ ಈ UTR ಸಂಖ್ಯೆಯನ್ನು (${cleanUtr}) ಈಗಾಗಲೇ ಬಳಸಲಾಗಿದೆ! ಅದೇ UTR ಅನ್ನು ಮತ್ತೆ ಮತ್ತೆ ಬಳಸಿ ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.`
            : `⚠️ This UTR number (${cleanUtr}) has already been used! You cannot reuse the same transaction ID.`
        );
        return;
      }
    }

    setIsProcessing(true);
    const txnId = cleanUtr ? `UPI_UTR_${cleanUtr}` : `UPI_DIRECT_${Date.now()}`;
    const initialStatus = isDeveloper ? 'ACTIVE' : 'PENDING_APPROVAL';
    
    await recordPurchase({
      examId: item.id,
      examTitle: item.title,
      amountPaid: discountedPrice,
      paymentMethod: 'UPI_QR',
      paymentId: txnId,
      utrNumber: cleanUtr,
      status: initialStatus
    });

    if (isDeveloper) {
      enrollExam(item.id);
    }
    
    setLastPaymentId(txnId);
    setLastPaymentMethod('Direct UPI (PhonePe / GPay / Paytm)');
    setIsProcessing(false);
    setIsCompleted(true);

    if (isDeveloper) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      if (onPurchaseSuccess) {
        onPurchaseSuccess(item);
      }
    }
  };

  // Instant Free Access (e.g. via 100% Coupon)
  const handleFreeUnlock = async () => {
    setIsProcessing(true);
    setPaymentError('');
    const freeTxnId = 'FREE_COUPON_' + Date.now();
    await recordPurchase({
      examId: item.id,
      examTitle: item.title,
      amountPaid: 0,
      paymentMethod: 'FREE_COUPON',
      paymentId: freeTxnId,
    });
    enrollExam(item.id);
    setLastPaymentId(freeTxnId);
    setLastPaymentMethod('100% Free Coupon');
    setIsProcessing(false);
    setIsCompleted(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    if (onPurchaseSuccess) {
      onPurchaseSuccess(item);
    }
  };

  // Instant Developer / Test Unlock
  const handleInstantUnlock = async () => {
    setIsProcessing(true);
    setPaymentError('');
    const unlockId = 'DEV_INSTANT_' + Date.now();
    await recordPurchase({
      examId: item.id,
      examTitle: item.title,
      amountPaid: 0,
      paymentMethod: 'DEVELOPER_SIMULATOR',
      paymentId: unlockId,
    });
    enrollExam(item.id);
    setLastPaymentId(unlockId);
    setLastPaymentMethod('Instant Developer Simulator');
    setIsProcessing(false);
    setIsCompleted(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    if (onPurchaseSuccess) {
      onPurchaseSuccess(item);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'ADHYAYANA100' || code === 'FREE100') {
      setDiscountPercent(100);
      setCouponSuccess(lang === 'kn' ? '100% ರಿಯಾಯಿತಿ ಕೂಪನ್ ಅನ್ವಯಿಸಲಾಗಿದೆ!' : '100% Off Coupon Applied!');
    } else if (code === 'KPSC2026' || code === 'STUDENT50') {
      setDiscountPercent(50);
      setCouponSuccess(lang === 'kn' ? '50% ರಿಯಾಯಿತಿ ಕೂಪನ್ ಅನ್ವಯಿಸಲಾಗಿದೆ!' : '50% Student Discount Applied!');
    } else {
      setCouponError(lang === 'kn' ? 'ಅಮಾನ್ಯ ಕೂಪನ್ ಕೋಡ್' : 'Invalid coupon code (Try: ADHYAYANA100 or KPSC2026)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-inner">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{lang === 'kn' ? 'ನೇರ ಆನ್‌ಲೈನ್ ಪಾವತಿ & ಅನ್‌ಲಾಕ್' : 'Direct Online Checkout'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                  ₹{discountedPrice}
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                PhonePe / Google Pay / Paytm QR • Direct Instant Checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCompleted ? (
          /* SUCCESS OR PENDING APPROVAL SCREEN */
          discountedPrice > 0 && !isDeveloper ? (
            <div className="p-6 sm:p-8 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50 dark:ring-amber-900/30">
                <Clock className="w-9 h-9 animate-pulse" />
              </div>
              <div>
                <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-xs font-bold mb-2 border border-amber-300 dark:border-amber-800">
                  ⏳ {lang === 'kn' ? 'ಡೆವಲಪರ್ ದೃಢೀಕರಣಕ್ಕಾಗಿ ನಿರೀಕ್ಷಿಸಿ' : 'Waiting for Developer Approval'}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? 'ಪಾವತಿ ವಿವರ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ!' : 'Payment Submitted Successfully!'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  {lang === 'kn'
                    ? 'ನಿಮ್ಮ 12-ಅಂಕಿಯ UTR ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಲಾಗಿದೆ. ಡೆವಲಪರ್ ತಮ್ಮ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ದೃಢಪಡಿಸಿದ ನಂತರ ಕೆಲವೇ ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ಕಂಟೆಂಟ್ ಅನ್‌ಲಾಕ್ ಆಗುತ್ತದೆ.'
                    : 'Your 12-digit UTR has been submitted. The developer will verify against bank records and approve your access shortly.'}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl text-left border border-slate-200 dark:border-slate-700 text-xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ (Item):</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-right line-clamp-1 max-w-[200px]">{item.title}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">ದಾಖಲಾದ UTR / Ref ಸಂಖ್ಯೆ:</span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">{utrNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">ಪಾವತಿಸಿದ ಮೊತ್ತ:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">₹{discountedPrice}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 font-medium">ಸ್ಥಿತಿ (Status):</span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
                    ⏳ ಡೆವಲಪರ್ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ (Pending Confirmation)
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{lang === 'kn' ? '📲 WhatsApp ನಲ್ಲಿ ರಸೀದಿ ಕಳುಹಿಸಿ (ತಕ್ಷಣ ಅನ್‌ಲಾಕ್)' : '📲 Send Receipt on WhatsApp (Fast Unlock)'}</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-all"
                >
                  {lang === 'kn' ? 'ಸರಿ, ಮುಕ್ತಾಯಗೊಳಿಸಿ (Close)' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? '🎉 ಯಶಸ್ವಿ ಪ್ರವೇಶ ದೊರೆತಿದೆ!' : '🎉 Access Granted!'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  {lang === 'kn' 
                    ? 'ಈ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ / ಟೆಸ್ಟ್‌ಗಳನ್ನು ನಿಮ್ಮ ಖಾತೆಗೆ ಯಶಸ್ವಿಯಾಗಿ ಅನ್‌ಲಾಕ್ ಮಾಡಲಾಗಿದೆ.'
                    : 'You now have full unrestricted access to this module.'}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-left border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Item / Content:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Account:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{discountedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Reference:</span>
                  <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">{lastPaymentId || 'VERIFIED'}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/30 transition-all"
              >
                {lang === 'kn' ? 'ಮುಂದುವರಿಯಿರಿ & ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ' : 'Continue & Open Content'}
              </button>
            </div>
          )
        ) : (
          <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Item Order Summary Card */}
            <div className="p-4 bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-600/20">
                  ₹
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                    {item.questions ? (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <PlayCircle className="w-3.5 h-3.5" />
                        {item.questions.length} ಪ್ರಶ್ನೆಗಳು • {item.durationMinutes || 30} ನಿಮಿಷ
                      </span>
                    ) : item.readTimeMinutes ? (
                      <span className="flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        {item.readTimeMinutes} ನಿಮಿಷ ಓದುವಿಕೆ • ಡಿಜಿಟಲ್ ನೋಟ್ಸ್
                      </span>
                    ) : (
                      <span className="font-semibold text-purple-600">ಪೂರ್ಣ ಪ್ರೀಮಿಯಂ ಕೋರ್ಸ್ ಪ್ಯಾಕೇಜ್</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400">
                  ₹{discountedPrice}
                </p>
                {discountPercent > 0 && (
                  <p className="text-[10px] text-slate-400 line-through font-semibold">₹{originalPrice}</p>
                )}
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  ⏱️ {item.validityDays ? `${item.validityDays} ದಿನಗಳು` : (discountedPrice <= 10 ? '10 ದಿನಗಳು' : discountedPrice <= 20 ? '20 ದಿನಗಳು' : discountedPrice <= 30 ? '30 ದಿನಗಳು' : '365 ದಿನಗಳು')}
                </span>
              </div>
            </div>

            {/* Validity & Pricing Chart Guide */}
            <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 dark:from-purple-950/30 dark:via-slate-800 dark:to-purple-950/30 p-3 rounded-2xl border border-purple-200/80 dark:border-purple-800/60 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>{lang === 'kn' ? 'ವ್ಯಾಲಿಡಿಟಿ ಚಾರ್ಟ್ (Validity Chart):' : 'Validity & Pricing Chart:'}</span>
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold">
                  {item.validityDays ? `${item.validityDays} Days Pass` : 'Affordable Prep Plans'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-[10px]">
                <div className={`p-1.5 rounded-xl border text-center ${discountedPrice === 10 ? 'border-purple-600 bg-purple-100 dark:bg-purple-900/60 font-bold' : 'bg-white dark:bg-slate-800 border-purple-100 dark:border-purple-900'}`}>
                  <span className="font-bold text-purple-700 dark:text-purple-300 block">₹10</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[9px]">10 ದಿನಗಳು</span>
                </div>
                <div className={`p-1.5 rounded-xl border text-center ${discountedPrice === 20 ? 'border-purple-600 bg-purple-100 dark:bg-purple-900/60 font-bold' : 'bg-white dark:bg-slate-800 border-purple-100 dark:border-purple-900'}`}>
                  <span className="font-bold text-purple-700 dark:text-purple-300 block">₹20</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[9px]">20 ದಿನಗಳು</span>
                </div>
                <div className={`p-1.5 rounded-xl border text-center ${discountedPrice === 30 ? 'border-purple-600 bg-purple-100 dark:bg-purple-900/60 font-bold' : 'bg-white dark:bg-slate-800 border-purple-100 dark:border-purple-900'}`}>
                  <span className="font-bold text-purple-700 dark:text-purple-300 block">₹30</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[9px]">30 ದಿನಗಳು</span>
                </div>
                <div className={`p-1.5 rounded-xl border text-center ${discountedPrice >= 49 ? 'border-purple-600 bg-purple-100 dark:bg-purple-900/60 font-bold' : 'bg-white dark:bg-slate-800 border-purple-100 dark:border-purple-900'}`}>
                  <span className="font-bold text-purple-700 dark:text-purple-300 block">₹49+</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[9px]">60+ ದಿನಗಳು</span>
                </div>
              </div>
            </div>

            {/* 100% Free Coupon Instant Unlock */}
            {discountedPrice === 0 ? (
              <div className="space-y-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  🎉 {lang === 'kn' ? '100% ರಿಯಾಯಿತಿ ಕೂಪನ್! ಯಾವುದೇ ಶುಲ್ಕವಿಲ್ಲದೆ ತಕ್ಷಣ ಪ್ರವೇಶ ಪಡೆಯಿರಿ.' : '100% Free! Unlock this item now.'}
                </p>
                <button
                  type="button"
                  onClick={handleFreeUnlock}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all"
                >
                  {isProcessing ? 'ಅನ್‌ಲಾಕ್ ಆಗುತ್ತಿದೆ...' : (lang === 'kn' ? 'ಉಚಿತವಾಗಿ ತಕ್ಷಣ ಅನ್‌ಲಾಕ್ ಮಾಡಿ' : 'Claim Free Access Now')}
                </button>
              </div>
            ) : (
              /* DIRECT UPI / QR CODE (PHONEPE / GPAY / PAYTM) */
              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-emerald-200 dark:border-emerald-800/50">
                
                {/* STEP 1: MOBILE NUMBER PAYMENT & APP BUTTONS */}
                <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                  
                  {/* Step Header & User Directions */}
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-1.5">
                    <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <span>💡 {lang === 'kn' ? 'ಪಾವತಿ ಮಾಡುವ ಸರಳ ವಿಧಾನ (Payment Guide):' : 'Easy 3-Step Payment Guide:'}</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                      <div className="flex items-start gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                        <span>{lang === 'kn' ? <>ಮೊಬೈಲ್ ಸಂಖ್ಯೆ <strong>{activePhone}</strong> (SAVITHA) ಗೆ PhonePe / GPay / Paytm ನಲ್ಲಿ "To Mobile Number" ಮೂಲಕ ₹{discountedPrice} ಪಾವತಿಸಿ.</> : <>Pay ₹{discountedPrice} to Mobile Number <strong>{activePhone}</strong> (SAVITHA) via PhonePe / GPay / Paytm.</>}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                        <span>{lang === 'kn' ? <>ಪಾವತಿ ರಸೀದಿಯಲ್ಲಿರುವ <strong>12-ಅಂಕಿಯ UTR / UPI Ref ಸಂಖ್ಯೆಯನ್ನು</strong> ಕೆಳಗೆ ನಮೂದಿಸಿ ಸಲ್ಲಿಸಿ.</> : <>Enter the <strong>12-digit UTR / UPI Ref number</strong> from your receipt below and submit.</>}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                        <span>{lang === 'kn' ? <>ಡೆವಲಪರ್ ಬ್ಯಾಂಕ್‌ನಲ್ಲಿ ದೃಢಪಡಿಸಿದ ತಕ್ಷಣ ನಿಮ್ಮ ಕೋರ್ಸ್ ಅನ್‌ಲಾಕ್ ಆಗುತ್ತದೆ.</> : <>Course unlocks shortly upon developer confirmation.</>}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlighted Mobile Number & Payee Box */}
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-slate-800 dark:to-emerald-950/40 p-3.5 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700/70 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-center sm:text-left space-y-0.5">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400 text-[10px]">ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{merchantName}</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black font-mono tracking-wider text-emerald-700 dark:text-emerald-300">
                        {activePhone}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(activePhone, 'phone')}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${
                        copiedPhone 
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      }`}
                    >
                      {copiedPhone ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>ಸಂಖ್ಯೆ ಕಾಪಿ ಮಾಡಿ (Copy)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {copiedPhone && (
                    <div className="text-center p-2 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 font-bold animate-in fade-in">
                      ✓ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ <strong>{activePhone}</strong> ಕಾಪಿ ಆಗಿದೆ! ನಿಮ್ಮ PhonePe / GPay ನಲ್ಲಿ ಪೇಸ್ಟ್ ಮಾಡಿ ₹{discountedPrice} ಪಾವತಿಸಿ.
                    </div>
                  )}

                  {/* 1-Click App Launcher Buttons */}
                  <div className="pt-1">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-2">
                      {lang === 'kn' ? 'ನೇರವಾಗಿ ಆ್ಯಪ್ ತೆರೆಯಿರಿ (ಆಟೋ-ಕಾಪಿ ಆಗುತ್ತದೆ):' : 'Open Payment App Directly:'}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {/* PhonePe */}
                      <a
                        href={phonePeUrl}
                        onClick={() => copyToClipboard(activePhone, 'phone')}
                        className="p-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm transition-all text-center"
                      >
                        <span className="w-7 h-7 rounded-full bg-white text-purple-600 font-black text-sm flex items-center justify-center shadow-inner">
                          Pe
                        </span>
                        <span className="text-xs font-bold">PhonePe</span>
                      </a>

                      {/* Google Pay */}
                      <a
                        href={gpayUrl}
                        onClick={() => copyToClipboard(activePhone, 'phone')}
                        className="p-2.5 bg-slate-900 hover:bg-black active:scale-95 text-white rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm border border-slate-700 transition-all text-center"
                      >
                        <span className="w-7 h-7 rounded-full bg-white text-blue-600 font-black text-sm flex items-center justify-center shadow-inner">
                          G
                        </span>
                        <span className="text-xs font-bold">Google Pay</span>
                      </a>

                      {/* Paytm */}
                      <a
                        href={paytmUrl}
                        onClick={() => copyToClipboard(activePhone, 'phone')}
                        className="p-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm transition-all text-center"
                      >
                        <span className="w-7 h-7 rounded-full bg-white text-sky-600 font-black text-xs flex items-center justify-center shadow-inner">
                          Pay
                        </span>
                        <span className="text-xs font-bold">Paytm</span>
                      </a>
                    </div>
                  </div>

                  {/* QR Code Collapsible/View */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-3">
                    <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-inner">
                      <img
                        src={qrCodeImageUrl}
                        alt="QR Code"
                        className="w-16 h-16 object-contain rounded"
                      />
                    </div>
                    <div className="text-left text-xs">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] block">ಅಥವಾ ಇನ್ನೊಂದು ಮೊಬೈಲ್‌ನಿಂದ QR ಸ್ಕ್ಯಾನ್ ಮಾಡಿ:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">SAVITHA • {activePhone}</span>
                    </div>
                  </div>

                </div>

                {/* SUBMIT UTR & NOTIFY DEVELOPER */}
                <form onSubmit={handleConfirmUpiPayment} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      {lang === 'kn' ? 'ಹಂತ 2: ಪಾವತಿಯ ನಂತರ 12-ಅಂಕಿಯ UTR / Ref ಸಂಖ್ಯೆ ನಮೂದಿಸಿ:' : 'Step 2: Enter 12-digit UTR / Ref Number after payment:'} *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={12}
                        placeholder="ಉದಾ: 423589124578"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-2.5 pr-14 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold tracking-wider outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-400">
                        {utrNumber.length}/12
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {lang === 'kn'
                        ? 'ಪಾವತಿಯಾದ ನಂತರ PhonePe/GPay ರಸೀದಿಯಲ್ಲಿ "UPI Ref No / UTR" ನೋಡಿ ಹಾಕಿ.'
                        : 'Look for 12-digit UPI Ref / UTR number in your PhonePe/GPay receipt.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="submit"
                      disabled={isProcessing || (discountedPrice > 0 && utrNumber.length < 12)}
                      className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 active:scale-[0.99]"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {isProcessing
                          ? 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...'
                          : (lang === 'kn' ? '✓ ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ (Submit)' : '✓ Submit for Approval')}
                      </span>
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{lang === 'kn' ? '📲 WhatsApp ನಲ್ಲಿ ತಿಳಿಸಿ' : '📲 Notify on WhatsApp'}</span>
                    </a>
                  </div>
                </form>

              </div>
            )}

            {/* Payment Error Alert */}
            {paymentError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-300 font-medium">
                {paymentError}
              </div>
            )}

            {/* Coupon Code Section */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-grow">
                  <Tag className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. ADHYAYANA100)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 text-white rounded-xl"
                >
                  {lang === 'kn' ? 'ಅನ್ವಯಿಸಿ' : 'Apply'}
                </button>
              </form>
              {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1 font-bold">{couponSuccess}</p>}
              {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
            </div>

            {/* Developer Test Simulator Button */}
            {isDeveloper && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  type="button"
                  onClick={handleInstantUnlock}
                  className="w-full py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>
                    ⚡ {lang === 'kn' ? 'ಡೆವಲಪರ್ ಸಿಮ್ಯುಲೇಟರ್: ತಕ್ಷಣವೇ 1-ಕ್ಲಿಕ್ ಅನ್‌ಲಾಕ್' : 'Developer Simulator: 1-Click Instant Unlock'}
                  </span>
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};


