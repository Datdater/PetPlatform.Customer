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
  getAll: async (): Promise<Address[]> => {
    const response = await client.get<Address[]>(`/customers/address`);
    return response.data;
  },

  create: async (data: CreateAddressDto): Promise<Address> => {
    const response = await client.post<Address>(`/customers/address`, data);
    return response.data;
  },

  update: async (id: string, data: CreateAddressDto): Promise<Address> => {
    const response = await client.put<Address>(`/customers/address/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/customers/address/${id}`);
  },
}; 