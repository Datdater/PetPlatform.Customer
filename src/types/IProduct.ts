export interface IProduct {
    id: string;
    name: string;
    price: number;
    storeId: string;
    storeName: string;
    storeLogoUrl: string;
    storeProvince: string;
    storeDistrict: string;
    storeWard: string;
    storeStreet: string;
    categoryId: string;
    productImage: string;
    starAverage: number;
    reviewCount: number;
    sold: number;
}

export interface IProductDetail extends IProduct {
    description: string;
    weight: number;
    length: number;
    height: number;
    variants: IProductVariant[];
    images: IProductImage[];
    reviews: IProductReview[];
}

export interface IProductVariant {
    id: string;
    attributes: {
        [key: string]: string | number;
    };
    price: number;
    stock: number;
}

export interface IProductImage {
    id: string;
    imageUrl: string;
    isMain: boolean;
}

export interface IProductReview {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface IAddProduct {
    categoryId: string;
    storeId: string;
    name: string;
    description?: string;
    basePrice: number;
    weight: number;
    length: number;
    height: number;
    variants: IProductVariant[];
    images: IProductImage[];
}

export interface IUpdateProduct {
    categoryId: string;
    storeId: string;
    name: string;
    description?: string;
    weight: number;
    length: number;
    height: number;
    variants: IProductVariant[];
    images: IProductImage[];
}

export interface IProductFilters {
    searchTerm?: string;
    categoryId?: string;
    storeId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    sortBy?: 'price' | 'rating' | 'popularity';
    sortDescending?: boolean;
}

export interface IProductReview {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}
