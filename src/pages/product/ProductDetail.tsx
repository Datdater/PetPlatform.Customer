import ProductReviews from '@/components/features/products/ProductReviews';
import { getProductById, getProductReviews, getProductVariants } from '@/services/product.service';
import { IProductDetail, IProductReview, IProductVariant } from '@/types/IProduct';
import { useEffect, useState, useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { UserContext } from "@/store/contexts/UserContext";
import { cartService, Cart } from "@/services/cart.service";
import { toast } from "sonner";
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/CartSlice';
import FlyingImage from '@/components/features/products/FlyingImage';
import { formatVnPrice } from '@/utils/formatPrice';
import { useRequireAuth } from '@/hooks/useRequireAuth';
export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<IProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<IProductReview[]>([]);
    const user = useContext(UserContext);
    const [adding, setAdding] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
    const [quantity, setQuantity] = useState(1);
    const [productVariant, setProductVariant] = useState<IProductVariant | null>(null);
    const dispatch = useDispatch();
    const [showFlyingImage, setShowFlyingImage] = useState(false);
    const [currentCart, setCurrentCart] = useState<Cart | null>(null);
    const requireAuth = useRequireAuth();
    // Extract attribute keys from variants
    const attributeKeys = useMemo(() => {
        if (!product?.variants.length) return [];
        return Object.keys(product.variants[0].attributes).slice(0, 2);
    }, [product]);

    // Extract unique options for each attribute
    const attributeOptions: { [key: string]: string[] } = useMemo(() => {
        if (!product?.variants.length) return {};
        const options: { [key: string]: Set<string> } = {};
        attributeKeys.forEach(key => {
            options[key] = new Set();
        });
        product.variants.forEach(v => {
            attributeKeys.forEach(key => {
                if (v.attributes[key]) options[key].add(v.attributes[key] as string);
            });
        });
        return Object.fromEntries(
            attributeKeys.map(key => [key, Array.from(options[key])])
        );
    }, [product?.variants, attributeKeys]);

    // Find the current variant based on selected attributes
    const currentVariant = useMemo(() => {
        if (!product?.variants.length || attributeKeys.some(key => !selectedAttributes[key])) return null;
        return product.variants.find(v =>
            attributeKeys.every(key => v.attributes[key] === selectedAttributes[key])
        ) || null;
    }, [product?.variants, selectedAttributes, attributeKeys]);

    // Set initial selected image and attributes
    useEffect(() => {
        if (product) {
            setSelectedImage(product.images[0]?.imageUrl || '');
            // Set initial attributes if not already set
            if (attributeKeys.length > 0 && Object.keys(selectedAttributes).length === 0) {
                const initialAttributes: { [key: string]: string } = {};
                attributeKeys.forEach(key => {
                    if (attributeOptions[key]?.length > 0) {
                        initialAttributes[key] = attributeOptions[key][0];
                    }
                });
                setSelectedAttributes(initialAttributes);
            }
        }
    }, [product, attributeKeys, attributeOptions]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [productData, reviewsData] = await Promise.all([
                    getProductById(id),
                    getProductReviews(id)
                ]);
                setProduct(productData);
                setReviews(reviewsData);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (product) {
            getProductVariants(product.id, {
                productId: product.id,
                attribute: selectedAttributes
            }).then(setProductVariant);
        }
    }, [product, selectedAttributes]);

    // Load current cart when component mounts
    useEffect(() => {
        const loadCart = async () => {
            if (!user) return;
            try {
                const cart = await cartService.getCart();
                setCurrentCart(cart);
            } catch (error) {
                console.error('Failed to load cart:', error);
            }
        };
        loadCart();
    }, [user]);

    const handleSelectAttribute = (key: string, value: string) => {
        setSelectedAttributes(prev => ({ ...prev, [key]: value }));
    };

    const handleQuantityChange = (value: number) => {
        if (value < 1) return;
        setQuantity(value);
    };

    const handleAddToCart = async () => {
        requireAuth(async () => {
            if (!currentVariant) {
                toast.error("Vui lòng chọn đầy đủ thông tin sản phẩm");
                return;
            }

            setShowFlyingImage(true);
            setAdding(true);
            try {
                // Check if product is already in cart
                const existingItem = currentCart?.items.find(
                    item => item.productVariantId === productVariant!.id
                );

                if (existingItem) {
                    // Update quantity if item exists
                    await cartService.updateItem(user!.id, existingItem.id, {
                        userId: user!.id,
                        id: existingItem.id,
                        quantity: existingItem.quantity + quantity
                    });
                    toast.success("Đã cập nhật số lượng trong giỏ hàng!");
                } else {
                    // Add new item if it doesn't exist
                    await cartService.addItem({
                        userId: user!.id,
                        productVariantId: productVariant!.id,
                        productName: product!.name,
                        attributes: JSON.stringify(currentVariant.attributes),
                        unitPrice: currentVariant.price,
                        quantity: quantity,
                        pictureUrl: product!.images[0]!.imageUrl,
                        storeId: product!.storeId,
                        storeName: product!.storeName,
                        storeUrl: product!.storeUrl || '',
                    });
                    toast.success("Đã thêm vào giỏ hàng!");
                    // Update cart count in Redux
                    dispatch(addToCart(quantity));
                }

                // Refresh cart data
                const updatedCart = await cartService.getCart();
                setCurrentCart(updatedCart);
            } catch (error) {
                toast.error("Không thể thêm vào giỏ hàng");
            } finally {
                setAdding(false);
            }
        });
    };

    const handleAnimationComplete = () => {
        setShowFlyingImage(false);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        requireAuth(() => {
            if (!currentVariant) {
                toast.error("Vui lòng chọn đầy đủ thông tin sản phẩm");
                return;
            }
            window.location.href = `/cart`;
        });
    };

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
                <div className="text-lg text-red-500">{error || "Không tìm thấy sản phẩm."}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {showFlyingImage && (
                <FlyingImage
                    imageUrl={product.images[0]?.imageUrl || ''}
                    onAnimationComplete={handleAnimationComplete}
                />
            )}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
                {/* Image Gallery */}
                <div className="flex-1 flex flex-col items-center">
                    <img
                        src={selectedImage}
                        alt={product.name}
                        className="w-[400px] h-[400px] rounded-lg border object-cover bg-gray-100 mb-4"
                    />
                    <div className="flex gap-2">
                        {product.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img.imageUrl}
                                alt={`thumb-${idx}`}
                                className={`w-16 h-16 min-w-16 min-h-16 max-w-16 max-h-16 rounded border cursor-pointer object-cover ${selectedImage === img.imageUrl ? 'ring-2 ring-orange-500' : ''}`}
                                onClick={() => setSelectedImage(img.imageUrl)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col gap-4">
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-semibold text-yellow-500">★ {product.starAverage}</span>
                        <span>|</span>
                        <span>{product.reviewCount} đánh giá</span>
                        <span>|</span>
                        <span>Đã bán {product.sold}</span>
                    </div>

                    <div className="my-4 flex items-end gap-2">
                        <span className="text-3xl font-bold text-red-500">
                            {currentVariant ? formatVnPrice(Number(currentVariant.price)) : formatVnPrice(Number(product.price))}
                        </span>
                        {product.price && !currentVariant && (
                            <span className="text-base text-gray-400 line-through">
                                {formatVnPrice(Number(product.price))}
                            </span>
                        )}
                    </div>

                    {/* Shop Info */}
                    <div className="flex items-center gap-3 mb-2">
                        <img src={product.storeUrl} alt={product.storeName} className="w-10 h-10 rounded-full border" />
                        <div>
                            <div className="font-semibold text-base">{product.storeName}</div>
                            <div className="text-xs text-gray-500">{product.storeProvince}</div>
                        </div>
                    </div>

                    {/* Attribute Selection */}
                    {attributeKeys.map(key => (
                        <div key={key} className="mb-2">
                            <div className="flex gap-2 flex-wrap">
                                <div className="font-medium mb-1 capitalize">{key}</div>
                                {attributeOptions[key]?.map(option => (
                                    <button
                                        key={option}
                                        className={`border rounded px-2 py-1 text-sm ${selectedAttributes[key] === option
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200'
                                            }`}
                                        onClick={() => handleSelectAttribute(key, option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Số Lượng</span>
                        <button
                            className="w-8 h-8 border rounded text-lg flex items-center justify-center"
                            onClick={() => handleQuantityChange(quantity - 1)}
                        >-</button>
                        <input
                            type="number"
                            className="w-12 text-center border rounded"
                            value={quantity}
                            min={1}
                            onChange={(e) => handleQuantityChange(Number(e.target.value))}
                        />
                        <button
                            className="w-8 h-8 border rounded text-lg flex items-center justify-center"
                            onClick={() => handleQuantityChange(quantity + 1)}
                        >+</button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
                        <button
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold shadow disabled:opacity-50 transition-all duration-200 active:scale-95 active:shadow-inner"
                            onClick={handleAddToCart}
                            disabled={adding || !currentVariant}
                        >
                            {adding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                        </button>
                        <button
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold shadow disabled:opacity-50 transition-all duration-200 active:scale-95 active:shadow-inner"
                            onClick={handleBuyNow}
                            disabled={!currentVariant}
                        >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>

            <div className='p-6 bg-white rounded-lg shadow-sm border mt-6'>
                <h1 className='text-2xl font-bold mb-6 text-gray-800'>Mô tả sản phẩm</h1>
                <div 
                    className='prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed'
                    dangerouslySetInnerHTML={{
                        __html: product.description || ''
                    }}
                />
            </div>

            <div className="mt-12">
                <ProductReviews reviews={reviews} />
            </div>
        </div>
    );
} 