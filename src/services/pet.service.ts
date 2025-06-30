import { client } from './client';
import { PaginationResponse } from '@/types/common/Pagination';

export interface IPet {
    id: string;
    name: string;
    dob: string;
    petType: boolean;
    weight: number;
    image: string | "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhdHxlbnwwfHwwfHx8MA%3D%3D%3D";
    userId: string;
    color: string;
    specialRequirement: string;
}

const BASE_URL = '/pets';

export const getPets = async (
    pageNumber: number = 1,
    pageSize: number = 10
): Promise<PaginationResponse<IPet>> => {
    const response: any = await client.get(BASE_URL, {
        params: {
            pageIndex: pageNumber,
            pageSize
        }
    });
    return response.data;
};

export const getPetById = async (id: string): Promise<IPet> => {
    const response: any = await client.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const createPet = async (pet: IPet): Promise<IPet> => {
    const response: any = await client.post(BASE_URL, pet);
    return response.data;
};

export const updatePet = async (id: string, pet: IPet): Promise<IPet> => {
    const response: any = await client.put(`${BASE_URL}/${id}`, pet);
    return response.data;
};

export const deletePet = async (id: string): Promise<void> => {
    await client.delete(`${BASE_URL}/${id}`);
};




