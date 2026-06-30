import React, { useState } from 'react';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Props {
  onSuccess: () => void;
}

const PRICE_DISPLAY = '₹99';

const FEATURES = [
  'Unlimited typing practice sessions',
  'All keyboard layouts (Krutidev, Remington, InScript)',
  'Exam Mode — SSC, HSSC, Court, DSSSB',
  'Skill Path & certificates',
  'Live WPM graph & mistake heatmap',
  'Daily streak & progress tracking',
];

const PaymentModal = ({ onSuccess }: Props) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const order = await paymentService.createOrder();

      const options: RazorpayOptions = {
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
            updateUser({ isPremium: true });
            // Clear free trial counter since user is now premium
            localStorage.removeItem('htp_free_seconds');
            toast.success('Payment successful! You now have unlimited access.');
            onSuccess();
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error('Could not initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    // Full-screen backdrop — no close button intentionally (trial is over)
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-7 text-white text-center">
          <div className="text-4xl mb-2">⏰</div>
          <h2 className="text-2xl font-bold">Free Trial Ended</h2>
          <p className="text-indigo-100 mt-1 text-sm">
            You've used your 2-minute free practice session
          </p>
        </div>

        {/* Price */}
        <div className="px-8 pt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Unlock unlimited access</p>
          <div className="flex items-baseline justify-center gap-1 mt-1">
            <span className="text-5xl font-extrabold text-gray-900 dark:text-white">{PRICE_DISPLAY}</span>
            <span className="text-gray-400 text-sm">one-time</span>
          </div>
        </div>

        {/* Feature list */}
        <ul className="px-8 py-5 space-y-2">
          {FEATURES.map(f => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">✓</span>
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="px-8 pb-8 space-y-3">
          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Opening payment…
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pay {PRICE_DISPLAY} with Razorpay
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            Secured by Razorpay · UPI, Cards, Net Banking accepted
          </p>

          {/* Test mode hint — remove in production */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400">
            <strong>Test mode:</strong> Use card 4111 1111 1111 1111, any future expiry, any CVV.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
