export interface IPetServiceCard {
    id: string;
    name: string;
    description: string;
    storeId: string;
    estimatedTime: string;
    serviceCategoryId: string;
    status: boolean;
    image: string;
    storeName: string;
    storeStreet: string;
    storeCity: string;
    storeWard: string;
    storeDistrict: string;
    categoryName: string;
    totalUsed: number;
    totalReviews: number;
    ratingAverage: number;
    petServiceDetails: IPetServiceDetail[];
    price: number;
}

export interface IPetServiceDetail {
    id: string;
    petWeightMin: number;
    petWeightMax: number;
    amount: number;
    petType: boolean;
    description: string;
    name: string;
    image: string;
}