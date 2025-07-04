import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IProduct } from '@/types/IProduct';
import { UserContext } from '@/store/contexts/UserContext';
import { cartService } from '@/services/cart.service';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/CartSlice';
import { toast } from 'sonner';

interface FlashSaleCardProps extends IProduct {
  discountPercentage?: number;
}

export default function FlashSaleCard({
  id,
  name,
  productImage,
  price,
  starAverage,
  reviewCount,
  storeName,
  sold,
  storeId,
  discountPercentage = 30,
}: FlashSaleCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const user = useContext(UserContext);
  const dispatch = useDispatch();

  // Calculate original price based on discount
  const originalPrice = price / (1 - discountPercentage / 100);

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }
    setIsAddingToCart(true);
    try {
      const addCartItemData = {
        userId: user.id,
        productVariantId: id,
        productName: name,
        attributes: JSON.stringify({}),
        unitPrice: price,
        quantity: 1,
        pictureUrl: productImage,
        storeId: storeId,
        storeName: storeName,
        storeUrl: `/store/${storeId}`,
      };
      await cartService.addItem(addCartItemData);
      dispatch(addToCart(1));
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Không thể thêm sản phẩm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(starAverage);
    const hasHalfStar = starAverage % 1 >= 0.5;
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

  // Randomly choose badge type for demo
  const badgeType = Math.random() > 0.5 ? 'hot' : 'low';

  return (
    <div className="relative flex flex-col bg-white rounded-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1">
      {/* Mall badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className="bg-[#ee4d2d] text-white text-xs font-bold px-2 py-0.5 rounded">Mall</span>
      </div>
      {/* Discount badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className="bg-[#ffd839] text-[#ee4d2d] text-xs font-bold px-2 py-0.5 rounded">-{discountPercentage}%</span>
      </div>
      {/* Product image */}
      <Link to={`/product/${id}`} className="block w-full h-[160px] bg-white flex items-center justify-center">
        <img
          src={productImage}
          alt={name}
          className="object-contain h-full max-h-[160px] w-auto mx-auto"
        />
      </Link>
      {/* Price */}
      <div className="flex flex-col items-center mt-2">
        <span className="text-[#ee4d2d] font-bold text-lg">{formatPrice(price)}</span>
      </div>
      {/* Orange badge below price */}
      <div className="flex justify-center mt-1 mb-2">
        {badgeType === 'hot' ? (
          <span className="bg-gradient-to-r from-[#ffb199] to-[#ff0844] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            ĐANG BÁN CHẠY
          </span>
        ) : (
          <span className="bg-gradient-to-r from-[#ffb199] to-[#ff0844] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <span role="img" aria-label="fire">🔥</span> CHỈ CÒN 5
          </span>
        )}
      </div>
      {/* Add to cart button (hidden, but available for future use) */}
      {/* <div className="flex justify-center mb-2">
        <Button
          variant="default"
          size="sm"
          className="w-full gap-2 rounded-full shadow-md bg-[#ee4d2d] hover:bg-[#d4411c]"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
          <span>{isAddingToCart ? 'Đang thêm...' : 'Mua ngay'}</span>
        </Button>
      </div> */}
    </div>
  );
} 