import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Props {
  onSuccess: () => void;
}

const FEATURES = [
  { icon: '⌨️', text: 'Unlimited typing practice — all durations' },
  { icon: '📋', text: 'All 3 layouts: Krutidev, Remington Gail, InScript' },
  { icon: '🏛️', text: 'Exam Mode: SSC, HSSC, Court, DSSSB' },
  { icon: '📈', text: 'Skill Path — 6-stage progressive training' },
  { icon: '🔥', text: 'Daily streak & goal tracker' },
  { icon: '📜', text: 'Typing speed certificate download' },
  { icon: '📊', text: 'Live WPM graph & mistake heatmap' },
  { icon: '🏆', text: 'National leaderboard ranking' },
];

const PaymentWall = ({ onSuccess }: Props) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testOrderId, setTestOrderId] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [finalAmount, setFinalAmount] = useState(9900);
  const [couponLoading, setCouponLoading] = useState(false);

  const activatePremium = () => {
    updateUser({ isPremium: true });
    toast.success('Premium unlocked! Unlimited access granted.');
    onSuccess();
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const result = await paymentService.validateCoupon(couponCode.trim());
      if (result.valid) {
        setDiscountPercent(result.discountPercent);
        setFinalAmount(result.finalAmountPaise);
        setCouponApplied(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setCouponApplied(false);
      }
    } catch {
      toast.error('Could not validate coupon. Try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const order = await paymentService.createOrder(couponApplied ? couponCode.trim() : undefined);

      if (order.testMode) {
        setTestOrderId(order.orderId);
        setLoading(false);
        return;
      }

      if (typeof window.Razorpay === 'undefined') {
        toast.error('Razorpay failed to load. Check your internet and try again.');
        setLoading(false);
        return;
      }

      new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'HindiTypingPro',
        description: 'Premium — Unlimited Hindi Typing Practice',
        order_id: order.orderId,
        prefill: { name: user?.name ?? '', email: user?.email ?? '' },
        theme: { color: '#6366f1' },
        handler: async (response) => {
          try {
            await paymentService.verifyPayment(response);
            activatePremium();
          } catch {
            toast.error('Payment verification failed. Contact support if money was deducted.');
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      }).open();

    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Could not start payment. Try again.');
      setLoading(false);
    }
  };

  const handleTestActivate = async () => {
    if (!testOrderId) return;
    setLoading(true);
    try {
      await paymentService.testActivate(testOrderId);
      activatePremium();
    } catch {
      toast.error('Test activation failed.');
      setLoading(false);
    }
  };

  const displayPrice = couponApplied ? (finalAmount / 100).toFixed(0) : '99';

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-6">
      <div className="w-full max-w-2xl space-y-6">

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <span>🔒</span> Premium Required
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Unlock Full Access</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">One-time payment · No subscription · Lifetime access</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl border-2 border-indigo-500 shadow-xl shadow-indigo-100 dark:shadow-none overflow-hidden">
          <div className="bg-indigo-600 text-white text-center py-2 text-sm font-bold tracking-wide">MOST POPULAR</div>

          <div className="p-8">
            <div className="flex items-baseline gap-2 mb-1">
              {couponApplied && (
                <span className="text-2xl font-bold text-gray-400 line-through">₹99</span>
              )}
              <span className="text-5xl font-extrabold text-gray-900 dark:text-white">₹{displayPrice}</span>
              <span className="text-gray-400 font-medium">one-time</span>
              {couponApplied && (
                <span className="text-sm font-bold text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Pay once. Practice forever. No hidden fees.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {FEATURES.map(f => (
                <div key={f.text} className="flex items-start gap-2.5">
                  <span className="text-base leading-5 flex-shrink-0">{f.icon}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Coupon code input */}
            <div className="mb-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponApplied(false); }}
                  placeholder="Have a coupon code?"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono tracking-widest"
                  disabled={couponApplied}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim() || couponApplied}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  {couponApplied ? '✓ Applied' : couponLoading ? '…' : 'Apply'}
                </button>
              </div>
              {couponApplied && (
                <button
                  onClick={() => { setCouponApplied(false); setCouponCode(''); setFinalAmount(9900); setDiscountPercent(0); }}
                  className="text-xs text-red-500 hover:underline mt-1 ml-1"
                >
                  Remove coupon
                </button>
              )}
            </div>

            {testOrderId && (
              <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-3 text-sm">
                <p className="font-semibold text-amber-800 dark:text-amber-300 mb-0.5">Test Mode Active</p>
                <p className="text-amber-700 dark:text-amber-400 text-xs">
                  Razorpay keys not configured. Add <code className="font-mono">RAZORPAY_KEY_ID</code> &amp;{' '}
                  <code className="font-mono">RAZORPAY_KEY_SECRET</code> in Render to enable real payments.
                </p>
              </div>
            )}

            {testOrderId ? (
              <button
                onClick={handleTestActivate}
                disabled={loading}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Activating…</>
                ) : 'Simulate Payment Success (Test)'}
              </button>
            ) : (
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                {loading ? (
                  <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Connecting to Razorpay…</>
                ) : (
                  <><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  Pay ₹{displayPrice} &amp; Get Full Access</>
                )}
              </button>
            )}

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
              UPI · Cards · Net Banking · Wallets — secured by Razorpay
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          Trusted by thousands of SSC &amp; court exam aspirants
        </p>
      </div>
    </div>
  );
};

export default PaymentWall;
