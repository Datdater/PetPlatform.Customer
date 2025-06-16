import { client } from './client';
import { IAddProduct, IGetProductVariant, IProduct, IProductDetail, IProductReview, IProductVariant, IUpdateProduct } from '@/types/IProduct';
import { PaginationResponse } from '@/types/common/Pagination';

const BASE_URL = '/products';

// Get all products with filtering and pagination
export const getProducts = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  filters?: {
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
): Promise<PaginationResponse<IProduct>> => {
  const response: any = await client.get(BASE_URL, {
    params: {
      pageIndex: pageNumber,
      pageSize,
      ...filters
    }
  });
  return response.data;
};

// Get product by ID
export const getProductById = async (id: string): Promise<IProductDetail> => {
  const response: any = await client.get(`${BASE_URL}/${id}`);
  return response.data;
};

// Get product reviews
export const getProductReviews = async (id: string): Promise<IProductReview[]> => {
  const response: any = await client.get(`${BASE_URL}/${id}/reviews`);
  return response.data;
};

// Create new product
export const createProduct = async (product: IAddProduct): Promise<string> => {
  const response: any = await client.post(BASE_URL, product);
  return response.data;
};

// Update product
export const updateProduct = async (id: string, product: IUpdateProduct): Promise<void> => {
  await client.put(`${BASE_URL}/${id}`, product);
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  await client.delete(`${BASE_URL}/${id}`);
};

// Get products by store
export const getProductsByStore = async (storeId: string): Promise<IProduct[]> => {
  const response: any = await client.get(`${BASE_URL}/store/${storeId}`);
  return response.data;
};

// Search products
export const searchProducts = async (query: string): Promise<IProduct[]> => {
  const response: any = await client.get(`${BASE_URL}/search`, {
    params: { q: query }
  });
  return response.data;
};

// Get featured products
export const getFeaturedProducts = async (): Promise<IProduct[]> => {
  const response: any = await client.get(`${BASE_URL}/featured`);
  return response.data;
};

// Get best-selling products
export const getBestSellingProducts = async (): Promise<IProduct[]> => {
  const response: any = await client.get(`${BASE_URL}/best-selling`);
  return response.data;
};

// Get new arrivals
export const getNewArrivals = async (): Promise<IProduct[]> => {
  const response: any = await client.get(`${BASE_URL}/new-arrivals`);
  return response.data;
};

// Get products on sale
export const getProductsOnSale = async (): Promise<IProduct[]> => {
  const response: any = await client.get(`${BASE_URL}/on-sale`);
  return response.data;
};

// Get product statistics
export const getProductStats = async (productId: string): Promise<{
  totalViews: number;
  totalSales: number;
  averageRating: number;
}> => {
  const response: any = await client.get(`${BASE_URL}/${productId}/stats`);
  return response.data;
};

// Get product variants
export const getProductVariants = async (productId: string, attributes: IGetProductVariant): Promise<IProductVariant> => {
  const response: any = await client.post(`${BASE_URL}/${productId}/product-variants`, attributes);
  return response.data;
};

// Error handling helper
export const handleProductError = (error: any): string => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return 'Invalid product data provided';
      case 401:
        return 'Unauthorized access to product data';
      case 403:
        return 'Forbidden access to product data';
      case 404:
        return 'Product not found';
      case 409:
        return 'Product already exists';
      default:
        return 'An error occurred while processing your request';
    }
  } else if (error.request) {
    return 'No response received from server';
  } else {
    return 'Error setting up the request';
  }
}; 