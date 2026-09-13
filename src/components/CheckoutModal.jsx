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
  PlayCircle
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

  // Dynamic UPI Payment String for PhonePe/GPay/Paytm/BHIM
  const upiId = developerUpiId || '6360433316@ybl';
  const merchantName = developerName || 'ADHYAYANA (ಅಧ್ಯಯನ)';
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${discountedPrice}&cu=INR`;
  const qrCodeImageUrl = developerUpiQrImage || `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiUrl)}&margin=10`;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } else if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    }
  };

  // WhatsApp prefilled support message
  const whatsappNumber = (developerPhone || '6360433316').replace(/\D/g, '');
  const whatsappText = encodeURIComponent(
    `ನಮಸ್ಕಾರ, ನಾನು ADHYAYANA ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ "${item.title}" (₹${discountedPrice}) ಗಾಗಿ ಪಾವತಿ ಮಾಡಿದ್ದೇನೆ.\nನನ್ನ ಇಮೇಲ್: ${user?.email || 'N/A'}\nದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ ಅನ್‌ಲಾಕ್ ಮಾಡಿ.`
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
                PhonePe / Google Pay / Paytm QR • Instant Lifetime Access
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
            <div className="p-6 sm:p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-amber-50 dark:ring-amber-900/30">
                <Clock className="w-10 h-10 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kn' ? '⏳ ಪಾವತಿ ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ' : '⏳ Payment Under Verification'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  {lang === 'kn'
                    ? 'ನಿಮ್ಮ UTR ಸಂಖ್ಯೆ ದಾಖಲಾಗಿದೆ. ಡೆವಲಪರ್ ಪರಿಶೀಲಿಸಿ ಕೆಲವೇ ನಿಮಿಷಗಳಲ್ಲಿ ನಿಮ್ಮ ಖಾತೆಗೆ ಪ್ರವೇಶಾವಕಾಶ ನೀಡುತ್ತಾರೆ.'
                    : 'Your UTR number has been submitted. The admin will verify and activate your access shortly.'}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-left border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Content / Item:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submitted UTR:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{utrNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">₹{discountedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Pending Admin Approval (ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ)
                  </span>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{lang === 'kn' ? 'WhatsApp ನಲ್ಲಿ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಕಳುಹಿಸಿ (ತಕ್ಷಣ ಅನ್‌ಲಾಕ್)' : 'Send Screenshot on WhatsApp (Fast Unlock)'}</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-all"
              >
                {lang === 'kn' ? 'ಸರಿ, ಮುಕ್ತಾಯಗೊಳಿಸಿ' : 'Close'}
              </button>
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
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full inline-block">
                    ⚡ {lang === 'kn' ? 'PhonePe / GPay / Paytm ನೇರ ಪಾವತಿ' : 'Direct PhonePe / GPay / Paytm QR'}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {lang === 'kn'
                      ? `ಕೆಳಗಿನ QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅಥವಾ UPI ಗೆ ನಿಖರವಾಗಿ ₹${discountedPrice} ಪಾವತಿಸಿ UTR ನಮೂದಿಸಿ.`
                      : `Scan QR code or send exactly ₹${discountedPrice} via PhonePe/GPay and submit 12-digit UTR.`}
                  </p>
                </div>

                {/* QR Code & Payee Details */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-inner text-center">
                    <img
                      src={qrCodeImageUrl}
                      alt="UPI Payment QR Code"
                      className="w-40 h-40 object-contain mx-auto rounded-lg"
                    />
                    <span className="text-[10px] font-bold text-emerald-700 block mt-1">
                      ನಿಖರ ಮೊತ್ತ: ₹{discountedPrice}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-left w-full sm:w-auto">
                    <div className="text-xs">
                      <span className="text-slate-400 text-[10px] block font-medium">ಸ್ವೀಕರಿಸುವವರ ಹೆಸರು:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate max-w-[190px] block">
                        {merchantName}
                      </span>
                    </div>

                    {/* Copy UPI ID */}
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[10px] block font-medium">UPI ID:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-700">
                          {upiId}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(upiId, 'upi')}
                          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white rounded-lg text-slate-600 transition-colors shadow-sm"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Copy Phone Number */}
                    {developerPhone && (
                      <div className="space-y-1">
                        <span className="text-slate-400 text-[10px] block font-medium">PhonePe / GPay ಸಂಖ್ಯೆ:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {developerPhone}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(developerPhone, 'phone')}
                            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white rounded-lg text-slate-600 transition-colors shadow-sm"
                            title="Copy Phone Number"
                          >
                            {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3-Step PhonePe / GPay Instructions */}
                <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                    <span>📲</span>
                    <span>{lang === 'kn' ? 'ಪಾವತಿಸುವ ಸರಳ 3 ಹಂತಗಳು:' : 'Simple 3 Steps to Pay:'}</span>
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                    <li>
                      {lang === 'kn' 
                        ? 'ನಿಮ್ಮ ಮೊಬೈಲ್‌ನಲ್ಲಿ PhonePe, Google Pay ಅಥವಾ Paytm ಆಪ್ ತೆರೆಯಿರಿ.' 
                        : 'Open PhonePe, Google Pay or Paytm app on your phone.'}
                    </li>
                    <li>
                      {lang === 'kn'
                        ? `ಮೇಲಿನ QR Code ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ₹${discountedPrice} ಕಳುಹಿಸಿ (ಅಥವಾ UPI ID ಗೆ ಕಳುಹಿಸಿ).`
                        : `Scan the QR code above or pay ₹${discountedPrice} to the UPI ID.`}
                    </li>
                    <li>
                      {lang === 'kn'
                        ? 'ಪಾವತಿಯಾದ ನಂತರ ರಸೀದಿಯಲ್ಲಿರುವ 12-ಅಂಕಿಯ UPI Ref / UTR ಸಂಖ್ಯೆಯನ್ನು ಕೆಳಗೆ ಹಾಕಿ ತಕ್ಷಣ ಅನ್‌ಲಾಕ್ ಮಾಡಿ.'
                        : 'Enter the 12-digit UTR from your bank receipt below to unlock instantly.'}
                    </li>
                  </ol>
                </div>

                {/* UTR / Reference ID Submission Form */}
                <form onSubmit={handleConfirmUpiPayment} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      {lang === 'kn' ? 'ಪಾವತಿಯ 12-ಅಂಕಿಯ UPI Ref / UTR ಸಂಖ್ಯೆ ನಮೂದಿಸಿ:' : 'Enter 12-digit UPI UTR / Transaction Ref ID:'} *
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
                        ? 'PhonePe / Google Pay / Paytm ರಸೀದಿಯಲ್ಲಿ "UPI Ref No / UTR" ಅನ್ನು ನೋಡಿ ನಮೂದಿಸಿ.'
                        : 'Found in PhonePe / Google Pay / Paytm receipt as "UPI Transaction ID / UTR".'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing || (discountedPrice > 0 && utrNumber.length < 12)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.99]"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? 'ಖಚಿತಪಡಿಸಲಾಗುತ್ತಿದೆ...'
                        : (lang === 'kn' ? `₹${discountedPrice} ಪಾವತಿ ಖಚಿತಪಡಿಸಿ & ತಕ್ಷಣ ಅನ್‌ಲಾಕ್ ಮಾಡಿ` : `Confirm ₹${discountedPrice} Payment & Instant Unlock`)}
                    </span>
                  </button>
                </form>

                {/* WhatsApp Help Button */}
                <div className="text-center pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'kn' ? '💬 ಪಾವತಿಯಲ್ಲಿ ಸಹಾಯ ಬೇಕೇ? WhatsApp ನಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ' : '💬 Need help with payment? Contact on WhatsApp'}</span>
                  </a>
                </div>

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


