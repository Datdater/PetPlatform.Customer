import { PaginationResponse } from '@/types/common/Pagination';
import { client } from './client';
import { IPet } from './pet.service';

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
    storeAddressProvince: string;
    storeAddressDistrict: string;
    storeAddressWard: string;
    storeAddressStreet: string;
    status: string;
    petWithServices: IBookingDetailResponse[];
}

export interface GetBookingParams {
    pageNumber: number;
    pageSize: number;
    userId: string;
}
export interface IBookingDetailResponse {
    pet: IPet;
    services: IServiceDetail[];
}
export interface IServiceDetail {
    id: string;
    serviceDetailName: string;
    price: number;
    imageUrl: string;
}

export const createBooking = async (data: ICreateBookingDto): Promise<IBookingResponse> => {
    const response = await client.post<IBookingResponse>('/booking', data);
    return response.data;
}; 

export const getBooking = async (params: GetBookingParams): Promise<PaginationResponse<IBookingResponse>> => {
    const response = await client.get<PaginationResponse<IBookingResponse>>('/booking', { params });
    return response.data;
};