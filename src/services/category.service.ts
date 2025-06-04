import { client } from "./client";

export interface ICategory {
    id: string;
    name: string;
    description: string;
}

export const categoryService = {
    getAll: async (): Promise<ICategory[]> => {
        const response = await client.get<ICategory[]>('/categories');
        return response.data;
    },
    getById: async (id: string): Promise<ICategory> => {
        const response = await client.get<ICategory>(`/categories/${id}`);
        return response.data;
    },
    
}