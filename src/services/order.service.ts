import { client } from './client';
import { PaginationResponse } from '@/types/common/Pagination';

export interface OrderResponse {
  orderId: string;
  customerId: string;
  paymentMethod: number;
  price: number;
  createDate: string;
}

export interface OrderDetail {
  quantity: number;
  price: number;
  productVariationId: string;
  productName: string;
  pictureUrl: string;
  productId: string;
  attribute: string;
}

export interface Order {
  id: string;
  storeId: string;
  price: number;
  deliveryPrice: number;
  orderDetailDTOs: OrderDetail[];
  orderStatus: string;
  createdTime: string;
}

export interface CreateOrderDto {
  storeId: string;
  customerId: string;
  address: {
    phoneNumber: string;
    street: string;
    city: string;
    ward: string;
    district: string;
  };
  addressStore: {
    phoneNumber: string;
    street: string;
    city: string;
    ward: string;
    district: string;
  };
  paymentMethod: number;
  promotionId: string;
  deliveryPrice: number;
  note: string;
  orderDetails: OrderDetail[];
}

export interface GetOrdersParams {
  pageNumber: number;
  pageSize: number;
  userId: string;
  status?: string | number;
}

export const orderService = {
  createOrder: async (data: CreateOrderDto): Promise<OrderResponse> => {
    const response = await client.post<OrderResponse>('/order', data);
    return response.data;
  },
  getOrders: async (params: GetOrdersParams): Promise<PaginationResponse<Order>> => {
    const response = await client.get<PaginationResponse<Order>>('/order', { params });
    return response.data;
  },
}; 