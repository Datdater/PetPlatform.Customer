export interface ProductCardProps {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    rating: number;
    reviewCount: number;
    shopName: string;
    shopVerified?: boolean;
    freeShipping?: boolean;
    isNew?: boolean;
    isBestseller?: boolean;
    className?: string;
    numberSold?: number;
  }
  