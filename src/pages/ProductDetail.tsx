import ProductCardDetail from '@/components/features/products/ProductCardDetail';
import ProductReviews from '@/components/features/products/ProductReviews';
import { getProductById, getProductReviews } from '@/services/product.service';
import { IProduct, IProductDetail, IProductReview } from '@/types/IProduct';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<IProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<IProductReview[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id as string);
                setProduct(response);
            } catch (error) {
                setError(error as string);
            } finally {
                setLoading(false);
            }
        };
        const fetchReviews = async () => {
            try {
                const response = await getProductReviews(id as string);
                setReviews(response);
            } catch (error) {
                setError(error as string);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchProduct();
            fetchReviews();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-500">Đang tải sản phẩm...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-red-500">Không tìm thấy sản phẩm.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ProductCardDetail
                name={product.name}
                images={product.images.map(image => image.imageUrl)}
                price={product.price}
                originalPrice={product.price}
                discountPercentage={20}
                rating={product.starAverage}
                reviewCount={product.reviewCount}
                sold={product.sold}
                shopName={product.storeName}
                shopLogoUrl={product.storeLogoUrl}
                shopLocation={product.storeProvince}
                variants={product.variants}
                shippingInfo="Nhận vào 13 Th05, phí giao ₫0"
                likedCount={1234}
                description={product.description}
            />
            <div className="mt-12">
                <ProductReviews reviews={reviews} />
            </div>
        </div>
    );
} 