import { PaginationResponse } from '@/types/common/Pagination';
import { client } from './client';

export interface IBookingDetail {
    pet: {
        id: string;
    };
    services: {
        id: string;
    }[];
}

export interface ICreateBookingDto {
    bookingTime: string;
    description: string;
    userId: string;
    bookingDetails: IBookingDetail[];
    storeId: string;
}

export interface IBookingResponse {
    bookingId: string;
    bookingTime: string;
    totalPrice: number;
    shopName: string;
    status: string;
    services: IBookingDetailResponse[];
}

export interface GetBookingParams {
    pageNumber: number;
    pageSize: number;
    userId: string;
}
export interface IBookingDetailResponse {
    serviceName: string;
    serviceDetailName: string;
    price: number;
    image: string;
}

export const createBooking = async (data: ICreateBookingDto): Promise<IBookingResponse> => {
    const response = await client.post<IBookingResponse>('/booking', data);
    return response.data;
}; 

export const getBooking = async (params: GetBookingParams): Promise<PaginationResponse<IBookingResponse>> => {
    const response = await client.get<PaginationResponse<IBookingResponse>>('/booking', { params });
    return response.data;
};