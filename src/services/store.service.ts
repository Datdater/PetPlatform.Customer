import { IProduct } from "@/types/IProduct";
import { client } from "./client";
import { IPetServiceCard } from "@/types/petServices/IPetServiceCard";
import { PaginationResponse } from "@/types/common/Pagination";


export interface Store {
  id: string;
  name: string;
  hotline: string;
  logoUrl: string;
  bannerUrl: string;
  businessType: string;
  businessAddressProvince: string;
  businessAddressDistrict: string;
  businessAddressWard: string;
  businessAddressStreet: string;
  faxEmail: string;
  faxCode: string;
  frontIdentityCardUrl: string;
  backIdentityCardUrl: string;
}

export const storeService = {
  getStore: async (id: string): Promise<Store> => {
    const response = await client.get<Store>(`/store/${id}`);
    return response.data as Store;
  },
  getProductsStore: async (id: string): Promise<PaginationResponse<IProduct>> => {
    const response = await client.get<PaginationResponse<IProduct>>(`/store/${id}/products`);
    return response.data as PaginationResponse<IProduct>;
  },
  getServicesStore: async (id: string): Promise<PaginationResponse<IPetServiceCard>> => {
    const response = await client.get<PaginationResponse<IPetServiceCard>>(`/store/${id}/services`);
    return response.data as PaginationResponse<IPetServiceCard>;
  },
};