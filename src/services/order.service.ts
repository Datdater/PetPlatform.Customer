import { client } from './client';
import { PaginationResponse } from '@/types/common/Pagination';

export interface OrderResponse {
  orderId: string;
  customerId: string;
  paymentMethod: number;
  price: number;
  createDate: string;
  paymentUrl: string;
}

export interface OrderDetail {
  id: string;
  quantity: number;
  price: number;
  productVariationId: string;
  productName: string;
  pictureUrl: string;
  productId: string;
  attribute: Record<string, string>;
  productReviews?: ProductReviews;
}

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  price: number;
  deliveryPrice: number;
  orderDetailDTOs: OrderDetail[];
  orderStatus: string;
  createdTime: string;
}

export interface CreateOrderDto {
  storeId: string;
  customerId: string;
  addressId : string;
  addressStoreId: string;
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
export interface ProductReviews {
  rating: number;
  comment: string;
}

export const orderService = {
  createOrder: async (data: CreateOrderDto): Promise<OrderResponse> => {
    const response = await client.post<OrderResponse>('/orders', data);
    return response.data;
  },
  getOrders: async (params: GetOrdersParams): Promise<PaginationResponse<Order>> => {
    const response = await client.get<PaginationResponse<Order>>('/orders', { params });
    return response.data;
  },
}; 