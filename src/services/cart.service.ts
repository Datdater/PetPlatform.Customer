import { client } from './client';

export interface CartItem {
  id: string;
  productVariantId: string;
  productName: string;
  attributes: string;
  pictureUrl: string;
  unitPrice: number;
  quantity: number;
  storeId: string;
  storeName: string;
  storeUrl: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface AddCartItemDto {
  userId: string;
  productVariantId: string;
  productName: string;
  attributes: string;
  unitPrice: number;
  quantity: number;
  pictureUrl: string;
  storeId: string;
  storeName: string;
  storeUrl: string;
}

export interface UpdateCartItemDto {
  userId: string;
  id: string;
  quantity: number;
}

export const cartService = {
  getCart: async (userId: string): Promise<Cart> => {
    const res = await client.get(`/Cart`);
    return res.data as Cart;
  },
  clearCart: async (userId: string) => {
    await client.delete(`/Cart/${userId}`);
  },
  removeItem: async (userId: string, itemId: string) => {
    await client.delete(`/Cart/${userId}/items/${itemId}`);
  },
  addItem: async (data: AddCartItemDto) => {
    const res = await client.post("/Cart/items", data);
    return res.data;
  },
  updateItem: async (userId: string, itemId: string, data: UpdateCartItemDto) => {
    const res = await client.post(`/Cart/${userId}/items/${itemId}`, data);
    return res.data;
  },
};