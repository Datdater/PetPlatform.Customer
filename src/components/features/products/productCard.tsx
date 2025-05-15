import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCardProps } from '@/types/products/productCard';
export default function ProductCard({
    id,
    title,
    imageUrl,
    price,
    originalPrice,
    discountPercentage,
    rating,
    reviewCount,
    shopName,
    shopVerified = false,
    freeShipping = false,
    isNew = false,
    isBestseller = false,
    className,
    numberSold,
  }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);
  
    // Format price to VND
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      }).format(price);
    };
  
    // Generate stars based on rating
    const renderStars = () => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
  
      for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`star-${i}`} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />);
      }
  
      if (hasHalfStar) {
        stars.push(
          <div key="half-star" className="relative">
            <Star className="w-3.5 h-3.5 text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      }
  
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
      for (let i = 0; i < emptyStars; i++) {
        stars.push(<Star key={`empty-star-${i}`} className="w-3.5 h-3.5 text-gray-300" />);
      }
  
      return stars;
    };
  
    return (
      <div className={cn("group bg-white rounded-xl border overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto flex flex-col", className)}>
        {/* Product Image & Actions */}
        <div className="relative pt-[100%] flex items-center justify-center bg-gray-50">
          {/* Product tags */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-row gap-1.5 z-10">
            {isBestseller && (
              <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                Bán chạy
              </Badge>
            )}
            {isNew && (
              <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                Mới
              </Badge>
            )}
            {discountPercentage && discountPercentage > 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5 rounded-full shadow">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
  
          {/* Product image */}
          <Link to={`/product/${id}`} className="block">
            <img
              src={imageUrl}
              alt={title}
              className="absolute top-0 left-0 w-full h-full object-cover p-4 mx-auto transition-transform duration-300 group-hover:scale-105 rounded-lg"
            />
          </Link>
  
          {/* Favorite button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm z-10 border border-gray-200"
          >
            <Heart
              className={cn("w-4 h-4", isFavorite ? "fill-red-500 text-red-500" : "text-gray-600")}
            />
          </button>
  
          {/* Quick add to cart - visible on hover */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-11/12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex justify-center">
            <Button variant="default" size="sm" className="w-full gap-2 rounded-full shadow-md">
              <ShoppingCart className="w-4 h-4" />
              <span>Thêm vào giỏ</span>
            </Button>
          </div>
        </div>
  
        {/* Product Info */}
        <div className="p-4 pt-3 flex flex-col items-center">
          {/* Title */}
          <Link to={`/product/${id}`} className="block w-full">
            <h3 className="text-base font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors text-center">
              {title}
            </h3>
          </Link>
  
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2 justify-center">
            <div className="flex items-center">
              {renderStars()}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
            <span className="text-xs text-gray-400 ml-1">| Đã bán {numberSold ? numberSold.toLocaleString() : '0'}</span>
          </div>
  
          {/* Shop info */}
          <Link to={`/shop/${shopName.replace(/\s+/g, "-").toLowerCase()}`} className="flex items-center gap-1 mb-2 justify-center">
            <span className="text-xs text-gray-600 hover:text-blue-600 transition-colors">
              {shopName}
            </span>
            {shopVerified && (
              <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            )}
          </Link>
  
          {/* Price */}
          <div className="flex flex-col items-center gap-1.5 mb-2">
            <span className="text-lg font-bold text-red-600">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
  
          {/* Free shipping badge */}
          {freeShipping && (
            <div className="mt-1.5 flex justify-center w-full">
              <span className="inline-block text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 font-medium">
                Free Ship
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }