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
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal = ({ exam, isOpen, onClose, onPurchaseSuccess }) => {
  const { user, enrollExam } = useAuth();
  const { lang } = useData();

  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi | card | netbanking
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !exam) return null;

  const originalPrice = exam.price || 499;
  const discountedPrice = Math.max(0, Math.round(originalPrice * (1 - discountPercent / 100)));

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

  const handleCompletePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      enrollExam(exam.id);
      setIsProcessing(false);
      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onPurchaseSuccess) {
        onPurchaseSuccess(exam);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {lang === 'kn' ? 'ಸುರಕ್ಷಿತ ಪಾವತಿ & ಅನ್‌ಲಾಕ್' : 'Secure Checkout & Unlock'}
              </h3>
              <p className="text-[11px] text-slate-400">
                256-Bit SSL Secured • Instant Access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCompleted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {lang === 'kn' ? 'ಯಶಸ್ವಿ ಪ್ರವೇಶ ದೊರೆತಿದೆ!' : 'Enrollment Successful!'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                {lang === 'kn' 
                  ? 'ಈ ಕೋರ್ಸ್ ಮತ್ತು ಪರೀಕ್ಷಾ ಸರಣಿಯನ್ನು ನಿಮ್ಮ Google ಖಾತೆಗೆ ಅನ್‌ಲಾಕ್ ಮಾಡಲಾಗಿದೆ.'
                  : 'You now have full unrestricted access to all mock tests, digital notes, and answer keys.'}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-left border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Course / Exam:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{exam.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Account:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Access Type:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Lifetime Validity</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-emerald-600/30 transition-all"
            >
              {lang === 'kn' ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ ಪ್ರಾರಂಭಿಸಿ' : 'Go to Dashboard & Start Studying'}
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Exam Summary Card */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={exam.banner} 
                  alt={exam.title} 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700" 
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {exam.title}
                  </h4>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {exam.testsCount} Mock Tests • {exam.notesCount} Digital Notes
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  ₹{discountedPrice}
                </p>
                {discountPercent > 0 && (
                  <p className="text-[10px] text-slate-400 line-through">₹{originalPrice}</p>
                )}
              </div>
            </div>

            {/* Coupon Code Section */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-grow">
                  <Tag className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. ADHYAYANA100)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 text-white rounded-xl"
                >
                  {lang === 'kn' ? 'ಅನ್ವಯಿಸಿ' : 'Apply'}
                </button>
              </form>
              {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1 font-medium">{couponSuccess}</p>}
              {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {lang === 'kn' ? 'ಪಾವತಿ ವಿಧಾನ ಆಯ್ಕೆಮಾಡಿ' : 'Select Payment Method'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                  <span className="text-xs font-bold block">UPI / QR</span>
                  <span className="text-[10px] text-slate-400">GPay, PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                  <span className="text-xs font-bold block">Card</span>
                  <span className="text-[10px] text-slate-400">Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <span className="text-xs font-bold block">NetBanking</span>
                  <span className="text-[10px] text-slate-400">All Indian Banks</span>
                </button>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>₹{originalPrice}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({discountPercent}%):</span>
                  <span>-₹{originalPrice - discountedPrice}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount:</span>
                <span>₹{discountedPrice}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleCompletePayment}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isProcessing
                  ? (lang === 'kn' ? 'ಪಾವತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Processing Secure Payment...')
                  : (lang === 'kn' ? `₹${discountedPrice} ಪಾವತಿಸಿ ಅನ್‌ಲಾಕ್ ಮಾಡಿ` : `Pay ₹${discountedPrice} & Unlock Now`)}
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
