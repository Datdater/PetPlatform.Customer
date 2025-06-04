import React, { useState, useEffect } from 'react';
import { getProducts } from '../../../services/product.service';
import { IProduct } from '../../../types/IProduct';
import { handleProductError } from '../../../services/product.service';
import ProductCard from '@/components/features/products/productCard';

const NewestProducts: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNewestProducts = async () => {
            try {
                setLoading(true);
                const data = await getProducts();
                setProducts(data.items);
                setError(null);
            } catch (err) {
                setError(handleProductError(err));
            } finally {
                setLoading(false);
            }
        };

        fetchNewestProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4">
                {error}
            </div>
        );
    }

    return (
        <>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.name}
                        imageUrl={product.productImage}
                        price={product.price}
                        originalPrice={product.price}
                        discountPercentage={20}
                        rating={product.starAverage}
                        reviewCount={product.reviewCount}
                        shopName={product.storeName}
                        shopVerified={true}
                        freeShipping={true}
                        isNew={true}
                        isBestseller={false}
                    />
                ))}
        </>
    );
};

export default NewestProducts;