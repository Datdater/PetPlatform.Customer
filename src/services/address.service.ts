import { client } from './client';

export interface Address {
  id: string;
  street: string;
  city: string;
  ward: string;
  district: string;
  country: string | null;
  phoneNumber: string;
  name: string;
  addressType: string | null;
  isDefault: boolean;
  fullAddress: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateAddressDto {
  street: string;
  city: string;
  ward: string;
  district: string;
  phoneNumber: string;
  name: string;
  isDefault: boolean;
}

export const addressService = {
  getAll: async (userId: string): Promise<Address[]> => {
    const response = await client.get<Address[]>(`/customer/${userId}/address`);
    return response.data;
  },

  create: async (userId: string, data: CreateAddressDto): Promise<Address> => {
    const response = await client.post<Address>(`/customer/${userId}/address`, data);
    return response.data;
  },

  update: async (userId: string, id: string, data: CreateAddressDto): Promise<Address> => {
    const response = await client.put<Address>(`/customer/${userId}/address/${id}`, data);
    return response.data;
  },

  delete: async (userId: string, id: string): Promise<void> => {
    await client.delete(`/customer/${userId}/address/${id}`);
  },
}; 