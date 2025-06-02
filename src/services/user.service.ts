import { client } from "./client";
import { ICustomerProfile } from "@/types/Customers/ICustomer";
const BASE_URL = '/Users';

export const getUser = async (): Promise<ICustomerProfile | null> => {
    try {
        const response = await client.get<ICustomerProfile>(`${BASE_URL}/profile`, {
            headers: { 'X-Skip-Auth-Redirect': 'true' }
        });
        return response.data;
    } catch (err: any) {
        if (err.response?.status === 401) {
            // Not logged in, return null
            return null;
        }
        throw err;
    }
};

export const updateUser = async (user: any) => {
    const response = await client.put(`${BASE_URL}/profile`, user);
    return response.data;
};

export const updatePassword = async (password: any) => {
    const response = await client.put(`${BASE_URL}/password`, password);
    return response.data;
};
