import { client } from "./client";
import { IPetServiceCard } from "@/types/petServices/IPetServiceCard";
import { PaginationResponse } from "@/types/common/Pagination";

const BASE_URL = '/Services';

export const getPetServices = async (
    pageNumber: number = 1,
    pageSize: number = 10,
    filters?: {
        searchTerm?: string;
        categoryId?: string;
        storeId?: string;
    }
) : Promise<PaginationResponse<IPetServiceCard>> => {
    const response: any = await client.get(`${BASE_URL}`, {
        params: {
            pageNumber,
            pageSize,
            ...filters
        }
    });
    return response.data;
}

export const getPetServiceDetail = async (id: string) : Promise<IPetServiceCard> => {
    const response: any = await client.get(`${BASE_URL}/${id}`);
    return response.data;
}





