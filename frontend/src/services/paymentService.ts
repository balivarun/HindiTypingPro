import api from './api';

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export const paymentService = {
  createOrder: (): Promise<CreateOrderResponse> =>
    api.post('/payment/create-order').then(r => r.data),

  verifyPayment: (data: RazorpayHandlerResponse): Promise<{ success: boolean; isPremium: boolean }> =>
    api.post('/payment/verify', {
      razorpayPaymentId: data.razorpay_payment_id,
      razorpayOrderId: data.razorpay_order_id,
      razorpaySignature: data.razorpay_signature,
    }).then(r => r.data),
};
