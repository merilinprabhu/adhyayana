import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Tag, 
  X, 
  QrCode, 
  Smartphone, 
  FileText, 
  Lock,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal = ({ exam, item: propItem, isOpen, onClose, onPurchaseSuccess }) => {
  const item = propItem || exam;
  const { user, enrollExam, isDeveloper } = useAuth();
  const { 
    lang, 
    recordPurchase, 
    razorpayKeyId, 
    developerUpiId, 
    developerPhone, 
    developerName,
    developerUpiQrImage,
    allPurchases
  } = useData();

  const [activePaymentTab, setActivePaymentTab] = useState('razorpay'); // 'razorpay' (default automatic) | 'upi_qr'
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
  const upiId = developerUpiId || 'merilinprabhugk@okaxis';
  const merchantName = developerName || 'Merilin Prabhu (ADHYAYANA)';
  const itemNote = `${item.title || 'Course Access'}`.slice(0, 30);
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${discountedPrice}&cu=INR&tn=${encodeURIComponent(itemNote)}`;
  const qrCodeImageUrl = developerUpiQrImage || `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUrl)}&margin=10`;

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

  // Submit UPI Direct Payment / UTR
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
    
    await recordPurchase({
      examId: item.id,
      examTitle: item.title,
      amountPaid: discountedPrice,
      paymentMethod: 'UPI_QR',
      paymentId: txnId,
      utrNumber: cleanUtr
    });

    enrollExam(item.id);
    setLastPaymentId(txnId);
    setLastPaymentMethod('UPI QR Code (PhonePe / GPay / Paytm)');
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
    setLastPaymentMethod('Instant Simulator');
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCompleteRazorpayPayment = async () => {
    setPaymentError('');
    setIsProcessing(true);

    // Case 1: 100% Free or 100% Discounted
    if (discountedPrice === 0) {
      const freePaymentId = 'FREE_COUPON_' + Date.now();
      await recordPurchase({
        examId: item.id,
        examTitle: item.title,
        amountPaid: 0,
        paymentMethod: 'FREE_COUPON',
        paymentId: freePaymentId,
      });
      enrollExam(item.id);
      setLastPaymentId(freePaymentId);
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
      return;
    }

    // Case 2: Check if Razorpay Key is configured or dummy
    if (!razorpayKeyId || razorpayKeyId === 'rzp_test_51AdhyayanaLive' || razorpayKeyId.length < 15) {
      setIsProcessing(false);
      setPaymentError(
        lang === 'kn'
          ? '⚠️ Razorpay Key ID ಅನ್ನು ಇನ್ನೂ ಕಾನ್ಫಿಗರ್ ಮಾಡಲಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು "PhonePe QR / UPI" ಟ್ಯಾಬ್ ಮೂಲಕ ನೇರವಾಗಿ ಪಾವತಿಸಿ ಅಥವಾ Developer Studio ದಲ್ಲಿ ನಿಮ್ಮ ಅಧಿಕೃತ Razorpay Key ನಮೂದಿಸಿ.'
          : '⚠️ Razorpay API Key is not configured yet. Switched to PhonePe QR / Direct UPI tab for instant payment.'
      );
      setActivePaymentTab('upi_qr');
      return;
    }

    // Case 3: Real Razorpay API Payment Flow
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      setIsProcessing(false);
      setPaymentError(
        lang === 'kn'
          ? 'Razorpay ಪಾವತಿ ಗೇಟ್‌ವೇ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ. ಪಕ್ಕದ "PhonePe QR / UPI" ವಿಧಾನ ಬಳಸಿ ಸುಲಭವಾಗಿ ಪಾವತಿಸಿ.'
          : 'Could not load Razorpay SDK. You can use the Direct UPI QR Code option above.'
      );
      setActivePaymentTab('upi_qr');
      return;
    }

    try {
      const options = {
        key: razorpayKeyId,
        amount: discountedPrice * 100, // in paise
        currency: 'INR',
        name: 'ADHYAYANA (ಅಧ್ಯಯನ)',
        description: `${item.title} - Full Unlock`,
        image: item.banner || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
        handler: async function (response) {
          const payId = response.razorpay_payment_id || ('rzp_' + Date.now());
          
          await recordPurchase({
            examId: item.id,
            examTitle: item.title,
            amountPaid: discountedPrice,
            paymentMethod: 'RAZORPAY',
            paymentId: payId,
          });

          enrollExam(item.id);
          setLastPaymentId(payId);
          setLastPaymentMethod('Razorpay Gateway');
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
        },
        prefill: {
          name: user?.name || 'Aspirant',
          email: user?.email || 'student@adhyayana.com',
          contact: ''
        },
        notes: {
          item_id: item.id,
          item_title: item.title,
          user_email: user?.email || ''
        },
        theme: {
          color: '#059669' // Emerald Green theme
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setPaymentError(
              lang === 'kn'
                ? 'ಪಾವತಿ ಪ್ರಕ್ರಿಯೆ ರದ್ದುಗೊಂಡಿದೆ. ಪಾವತಿ ಪೂರ್ಣಗೊಳ್ಳದ ಕಾರಣ ಅನ್‌ಲಾಕ್ ಆಗಿಲ್ಲ.'
                : 'Payment checkout was closed. Access will remain locked until payment is completed.'
            );
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', function (response) {
        setIsProcessing(false);
        setPaymentError(
          lang === 'kn'
            ? `ಪಾವತಿ ವಿಫಲವಾಗಿದೆ: ${response.error?.description || 'ದೋಷ ಉಂಟಾಗಿದೆ'}`
            : `Payment Failed: ${response.error?.description || 'Transaction unsuccessful'}`
        );
      });

      razorpayInstance.open();
    } catch (err) {
      console.error('Razorpay Launch Error:', err);
      setIsProcessing(false);
      setPaymentError(
        lang === 'kn'
          ? `Razorpay ಆರಂಭ ದೋಷ: ${err.message}`
          : `Razorpay Error: ${err.message}`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                {lang === 'kn' ? 'ಸುರಕ್ಷಿತ ಪಾವತಿ & ಅನ್‌ಲಾಕ್' : 'Direct Checkout & Unlock'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Direct UPI QR / PhonePe / GPay / Razorpay • Instant Lifetime Access
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
          /* SUCCESS SCREEN */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {lang === 'kn' ? 'ಯಶಸ್ವಿ ಪ್ರವೇಶ ದೊರೆತಿದೆ!' : 'Enrollment Successful!'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                {lang === 'kn' 
                  ? 'ಈ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿ / ಟೆಸ್ಟ್‌ಗಳನ್ನು ನಿಮ್ಮ ಖಾತೆಗೆ ಯಶಸ್ವಿಯಾಗಿ ಅನ್‌ಲಾಕ್ ಮಾಡಲಾಗಿದೆ.'
                  : 'You now have full unrestricted lifetime access to this module.'}
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
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{lastPaymentMethod || 'UPI Direct'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reference / Txn ID:</span>
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
        ) : (
          <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Item Summary Card */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-300 dark:border-emerald-800">
                  ₹
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {item.questions ? `${item.questions.length} Questions • ${item.durationMinutes || 30} Mins` : (item.readTimeMinutes ? `${item.readTimeMinutes} Mins Read • Digital Notes` : 'Full Premium Module')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  ₹{discountedPrice}
                </p>
                {discountPercent > 0 && (
                  <p className="text-[10px] text-slate-400 line-through">₹{originalPrice}</p>
                )}
              </div>
            </div>

            {/* Payment Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setActivePaymentTab('razorpay')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activePaymentTab === 'razorpay'
                    ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>{lang === 'kn' ? '⚡ Razorpay (Auto-Unlock)' : '⚡ Razorpay Gateway'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentTab('upi_qr')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activePaymentTab === 'upi_qr'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'kn' ? 'PhonePe QR / UPI' : 'PhonePe QR / UPI'}</span>
              </button>
            </div>

            {/* TAB 1: OFFICIAL RAZORPAY GATEWAY (PHONEPE / GPAY / CARDS / NETBANKING - 100% AUTOMATED) */}
            {activePaymentTab === 'razorpay' && (
              <div className="space-y-4 p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-blue-950/30 dark:to-slate-900 rounded-3xl border border-blue-200 dark:border-blue-900/60 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'kn' ? 'ಅಧಿಕೃತ ಸ್ವಯಂಚಾಲಿತ ಪಾವತಿ ಗೇಟ್‌ವೇ' : 'Official Automated Bank Gateway'}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                    ✓ 100% Verified
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>PhonePe, Google Pay, Paytm, BHIM, Cred</strong> ಮೂಲಕ ತಕ್ಷಣ ಪಾವತಿ</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Debit / Credit Cards & Net Banking ಲಭ್ಯ</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span><strong>ಯಾವುದೇ UTR ಟೈಪ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ</strong> — ಪಾವತಿಯಾದ ತಕ್ಷಣ ತಾನಾಗಿಯೇ ಅನ್‌ಲಾಕ್ ಆಗುತ್ತದೆ!</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCompleteRazorpayPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? (lang === 'kn' ? 'ಪಾವತಿ ವಿಂಡೋ ತೆರೆಯಲಾಗುತ್ತಿದೆ...' : 'Opening Payment Gateway...')
                      : (lang === 'kn' ? `PhonePe / Cards ಮೂಲಕ ₹${discountedPrice} ಪಾವತಿಸಿ (Auto Unlock)` : `Pay ₹${discountedPrice} via PhonePe / Cards / UPI`)}
                  </span>
                </button>
              </div>
            )}

            {/* TAB 2: DIRECT UPI / QR CODE (PHONEPE / GPAY MANUAL) */}
            {activePaymentTab === 'upi_qr' && (
              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-emerald-200 dark:border-emerald-800/50">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full inline-block">
                    ⚡ {lang === 'kn' ? 'ಡೆವಲಪರ್‌ಗೆ ನೇರ ಪಾವತಿ (Direct UPI QR)' : 'Direct Developer UPI Transfer'}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {lang === 'kn'
                      ? 'ಕೆಳಗಿನ QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅಥವಾ UPI ಐಡಿಗೆ ಹಣ ಪಾವತಿಸಿ UTR ನಮೂದಿಸಿ.'
                      : 'Scan the QR code via PhonePe, Google Pay, Paytm, or BHIM to pay.'}
                  </p>
                </div>

                {/* QR Code Card */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-inner">
                    <img
                      src={qrCodeImageUrl}
                      alt="UPI Payment QR Code"
                      className="w-36 h-36 object-contain"
                    />
                  </div>

                  <div className="space-y-2 text-left w-full sm:w-auto">
                    <div className="text-xs">
                      <span className="text-slate-400 text-[10px] block">Payee Name:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate max-w-[190px] block">
                        {merchantName}
                      </span>
                    </div>

                    {/* Copy UPI ID */}
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[10px] block">UPI ID:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-700">
                          {upiId}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(upiId, 'upi')}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white rounded-lg text-slate-500 transition-colors"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Copy Phone Number */}
                    {developerPhone && (
                      <div className="space-y-1">
                        <span className="text-slate-400 text-[10px] block">Phone Number (PhonePe/GPay):</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-300">
                            {developerPhone}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(developerPhone, 'phone')}
                            className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white rounded-lg text-slate-500 transition-colors"
                            title="Copy Phone Number"
                          >
                            {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile & Direct App Intent Link */}
                <div>
                  <a
                    href={upiUrl}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{lang === 'kn' ? '⚡ PhonePe / Google Pay ಆಪ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ' : '⚡ Pay via PhonePe / Google Pay App'}</span>
                  </a>
                  <p className="text-[10px] text-center text-slate-400 mt-1">
                    {lang === 'kn' ? '(ಮೊಬೈಲ್‌ನಲ್ಲಿ ನೇರವಾಗಿ PhonePe / GPay ಆಪ್ ತೆರೆದು ಹಣ ಪಾವತಿಸಿ)' : '(Opens PhonePe / GPay automatically on your mobile device)'}
                  </p>
                </div>

                {/* UTR / Reference ID Submission Form */}
                <form onSubmit={handleConfirmUpiPayment} className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      {lang === 'kn' ? 'ಪಾವತಿಯ 12-ಅಂಕಿಯ UPI Ref / UTR ಸಂಖ್ಯೆ ನಮೂದಿಸಿ:' : 'Enter 12-digit UPI UTR / Transaction Ref ID:'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 423589124578"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold tracking-wider outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {lang === 'kn'
                        ? 'PhonePe / Google Pay / Paytm ರಸೀದಿಯಲ್ಲಿ "UPI Ref No / UTR" ಅನ್ನು ನೋಡಿ ನಮೂದಿಸಿ.'
                        : 'Found in PhonePe / Google Pay / Paytm receipt as "UPI Transaction ID / UTR".'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {isProcessing
                        ? 'ಖಚಿತಪಡಿಸಲಾಗುತ್ತಿದೆ...'
                        : (lang === 'kn' ? 'ಖಚಿತಪಡಿಸಿ & ತಕ್ಷಣ ಅನ್‌ಲಾಕ್ ಮಾಡಿ' : 'Confirm Payment & Instant Unlock')}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* Payment Error Alert */}
            {paymentError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-300">
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
