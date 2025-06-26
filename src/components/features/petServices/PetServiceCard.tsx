import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { IPetServiceCard } from "@/types/petServices/IPetServiceCard";

const PetServiceCard = ({
    id,
    name,
    image,
    storeName,
    storeCity,
    storeDistrict,
    totalUsed,
    ratingAverage,
    status
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
        <div className="group bg-white rounded-xl border overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 max-w-sm mx-auto flex flex-col h-[420px]">
            {/* Service Image */}
            <div className="relative h-48 w-full">
                <Link to={`/service/${id}`} className="block w-full h-full">
                    <img
                        src={image|| "https://bizweb.dktcdn.net/thumb/large/100/448/728/products/anh-san-pham-web-769x790-2025-03-14t162705-913-b7afbfea-fab4-402b-85c7-aabbee743efd.png?v=1741946535290"}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>
                {!status && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Unavailable
                    </div>
                )}
            </div>

            {/* Service Info */}
            <div className="p-4 flex flex-col flex-grow">

                {/* Title */}
                <Link to={`/service/${id}`} className="block">
                    <h3 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                        {name}
                    </h3>
                </Link>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                        {renderStars()}
                    </div>
                    <span className="text-sm text-gray-400 ml-1">| Đã dùng {totalUsed}</span>
                </div>

                {/* Store Location */}
                <div className="flex items-start gap-1">
                    <MapPin className="w-4 h-4 text-gray-500 " />
                    <div className="text-sm text-gray-600">
                        <Link to={`/store/${storeName.replace(/\s+/g, "-").toLowerCase()}`} className="font-medium hover:text-blue-600 transition-colors">
                            {storeName}
                        </Link>
                        <p className="line-clamp-1">
                            {[ storeDistrict, storeCity].filter(Boolean).join(", ")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetServiceCard;