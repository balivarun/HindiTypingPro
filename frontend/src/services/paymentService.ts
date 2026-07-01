import api from './api';
import { ApiResponse, CouponValidation } from '../types';

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  testMode: boolean;
  discountPercent?: number;
}

export const paymentService = {
  createOrder: (couponCode?: string): Promise<CreateOrderResponse> => {
    const params = couponCode ? `?couponCode=${encodeURIComponent(couponCode)}` : '';
    return api.post(`/payment/create-order${params}`).then(r => r.data);
  },

  validateCoupon: async (code: string): Promise<CouponValidation> => {
    const { data } = await api.get<ApiResponse<CouponValidation>>(
      `/payment/validate-coupon?code=${encodeURIComponent(code)}`
    );
    return data.data;
  },

  verifyPayment: (data: RazorpayHandlerResponse): Promise<{ success: boolean; isPremium: boolean }> =>
    api.post('/payment/verify', {
      razorpayPaymentId: data.razorpay_payment_id,
      razorpayOrderId: data.razorpay_order_id,
      razorpaySignature: data.razorpay_signature,
    }).then(r => r.data),

  testActivate: (orderId: string): Promise<{ success: boolean; isPremium: boolean }> =>
    api.post('/payment/test-activate', { orderId }).then(r => r.data),
};
