import React, { useState, useMemo } from 'react';
import { IProductVariant } from '@/types/IProduct';
export interface ProductCardDetailProps {
  name: string;
  images: string[];
  price: number | string;
  originalPrice?: number | string;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  sold: number;
  shopName: string;
  shopLogoUrl: string;
  shopLocation: string;
  variants?: IProductVariant[];
  shippingInfo?: string;
  likedCount?: number;
  description?: string;
}

const ProductCardDetail: React.FC<ProductCardDetailProps> = ({
  name,
  images,
  price,
  originalPrice,
  discountPercentage,
  rating,
  reviewCount,
  sold,
  shopName,
  shopLogoUrl,
  shopLocation,
  variants = [],
  description,
}) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  // Attribute selection state
  const attributeKeys = useMemo(() => {
    if (!variants.length) return [];
    // Only use up to 2 attributes (e.g., size, flavor)
    return Object.keys(variants[0].attributes).slice(0, 2);
  }, [variants]);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);

  // Extract unique options for each attribute
  const attributeOptions: { [key: string]: string[] } = useMemo(() => {
    const options: { [key: string]: Set<string> } = {};
    attributeKeys.forEach(key => {
      options[key] = new Set();
    });
    variants.forEach(v => {
      attributeKeys.forEach(key => {
        if (v.attributes[key]) options[key].add(v.attributes[key] as string);
      });
    });
    // Convert sets to arrays
    const result: { [key: string]: string[] } = {};
    attributeKeys.forEach(key => {
      result[key] = Array.from(options[key]);
    });
    return result;
  }, [variants, attributeKeys]);

  // Find the current variant based on selected attributes
  const currentVariant = useMemo(() => {
    if (!variants.length || attributeKeys.some(key => !selectedAttributes[key])) return null;
    return variants.find(v =>
      attributeKeys.every(key => v.attributes[key] === selectedAttributes[key])
    ) || null;
  }, [variants, selectedAttributes, attributeKeys]);

  // Handle attribute selection
  const handleSelectAttribute = (key: string, value: string) => {
    setSelectedAttributes(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
<div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-8">
      {/* Image Gallery */}
      <div className="flex-1 flex flex-col items-center">
        <img
          src={selectedImage}
          alt={name}
          className="w-full max-w-md rounded-lg border object-contain bg-gray-100 p-4 mb-4"
        />
        <div className="flex gap-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`}
              className={`w-16 h-16 rounded border cursor-pointer object-cover ${selectedImage === img ? 'ring-2 ring-orange-500' : ''}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>
      {/* Product Info */}
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2">{name}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-semibold text-yellow-500">★ {rating.toFixed(1)}</span>
          <span>|</span>
          <span>{reviewCount} đánh giá</span>
          <span>|</span>
          <span>Đã bán {sold}</span>
        </div>
        <div className="my-4 flex items-end gap-2">
          <span className="text-3xl font-bold text-red-500">
            {currentVariant ? currentVariant.price.toLocaleString('vi-VN') : (typeof price === 'number' ? price.toLocaleString('vi-VN') : price)}₫
          </span>
          {originalPrice && !currentVariant && (
            <span className="text-base text-gray-400 line-through">{typeof originalPrice === 'number' ? originalPrice.toLocaleString('vi-VN') : originalPrice}₫</span>
          )}
          {discountPercentage && (
            <span className="text-base text-white bg-red-500 px-2 py-0.5 rounded ml-2">-{discountPercentage}%</span>
          )}
        </div>
        
        {/* Shop Info */}
        <div className="flex items-center gap-3 mb-2">
          <img src={shopLogoUrl} alt={shopName} className="w-10 h-10 rounded-full border" />
          <div>
            <div className="font-semibold text-base">{shopName}</div>
            <div className="text-xs text-gray-500">{shopLocation}</div>
          </div>
        </div>
        {/* Attribute Selection Rows */}
        {attributeKeys.map(key => (
          <div key={key} className="mb-2">
            <div className="flex gap-2 flex-wrap">
              <div className="font-medium mb-1 capitalize">{key}</div>
              {attributeOptions[key].map(option => (
                <button
                  key={option}
                  className={`border rounded px-2 py-1 text-sm ${selectedAttributes[key] === option ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
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
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >-</button>
          <input
            type="number"
            className="w-12 text-center border rounded"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          />
          <button
            className="w-8 h-8 border rounded text-lg flex items-center justify-center"
            onClick={() => setQuantity((q) => q + 1)}
          >+</button>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold shadow">Thêm vào giỏ hàng</button>
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold shadow">Mua ngay</button>
        </div>
        
      </div>
      
    </div>
    <div className='p-6'>
        <h1 className='text-2xl font-bold'>Mô tả sản phẩm</h1>
          <div className='flex gap-2'>
            {description}
          </div>
      </div>
    </>
    
    
  );
};

export default ProductCardDetail;
