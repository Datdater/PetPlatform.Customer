import { client } from './client';

export interface CreatePaymentDto {
  orderId: string;
  customerId: string;
  amount: number;
  paymentMethod: number;
}

export interface PaymentResponse {
  id: string;
  paymentUrl: string;
}

export const paymentService = {
  createPayment: async (data: CreatePaymentDto): Promise<PaymentResponse> => {
    const response = await client.post<PaymentResponse>('/payment', data);
    return response.data;
  }
}; 