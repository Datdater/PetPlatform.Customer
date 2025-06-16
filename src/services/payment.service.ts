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
  orderDate?: string;
}
export interface ExecutePaymentDto {
  paymentId?: string;
  orderCode?: string;
}

export const paymentService = {
  createPayment: async (data: CreatePaymentDto): Promise<PaymentResponse> => {
    const response = await client.post<PaymentResponse>('/payment', data);
    return response.data;
  },

  executePayment: async (data: ExecutePaymentDto): Promise<PaymentResponse> => {
    const response = await client.put<PaymentResponse>('/payment', data);
    return response.data;
  }
}; 