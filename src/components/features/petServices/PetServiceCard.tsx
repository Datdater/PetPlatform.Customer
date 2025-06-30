import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { IPetServiceCard } from "@/types/petServices/IPetServiceCard";
import { formatVnPrice } from "@/utils/formatPrice";

const PetServiceCard = ({
    id,
    name,
    image,
    storeName,
    storeDistrict,
    storeCity,
    ratingAverage,
    totalUsed,
    price
}: IPetServiceCard) => {
    // Generate stars based on rating
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(ratingAverage);
        const hasHalfStar = ratingAverage % 1 >= 0.5;
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
        }
        if (hasHalfStar) {
            stars.push(
                <div key="half-star" className="relative">
                    <Star className="w-4 h-4 text-gray-300" />
                    <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
            );
        }
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-star-${i}`} className="w-4 h-4 text-gray-300" />);
        }
        return stars;
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto flex flex-col">
            {/* Large Image */}
            <Link to={`/service/${id}`} className="block w-full h-48 sm:h-56 md:h-60 overflow-hidden">
                <img
                    src={image || "https://bizweb.dktcdn.net/thumb/large/100/448/728/products/anh-san-pham-web-769x790-2025-03-14t162705-913-b7afbfea-fab4-402b-85c7-aabbee743efd.png?v=1741946535290"}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </Link>
            {/* Main Info */}
            <div className="flex flex-col items-center px-4 py-3 flex-1">
                <Link to={`/service/${id}`} className="block w-full text-center mb-2">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-primary transition-colors min-h-[2.5em]">{name}</h3>
                </Link>
                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-1">
                    {renderStars()}
                    <span className="text-xs text-gray-500 ml-1">{ratingAverage.toFixed(1)}</span>
                    {typeof totalUsed === 'number' && <span className="text-xs text-gray-400 ml-2">({totalUsed})</span>}
                </div>
                {/* Store */}
                <div className="text-xs text-gray-800 font-semibold text-center">{storeName}</div>
                {(storeDistrict || storeCity) && (
                  <div className="text-xs text-gray-500 text-center mt-0.5">
                    {[storeDistrict, storeCity].filter(Boolean).join(", ")}
                  </div>
                )}
            </div>
            {/* Price & Button */}
            <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
                <div className="text-lg font-bold text-primary text-center">{formatVnPrice(price)}</div>
                <Link
                    to={`/service/${id}`}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-2 font-semibold text-sm flex items-center justify-center gap-2 transition-colors duration-200 shadow hover:shadow-md"
                >
                    Đặt ngay
                </Link>
            </div>
        </div>
    );
};

export default PetServiceCard;