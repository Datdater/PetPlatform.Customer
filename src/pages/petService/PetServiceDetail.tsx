import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, Mail, Calendar, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BookingDialog from '@/components/features/petServices/BookingDialog';
import { IPetServiceCard } from '@/types/petServices/IPetServiceCard';
import { getPetServiceDetail } from '@/services/petService.service';



const PetServiceDetail = () => {
    const { id } = useParams();
    const [petService, setPetService] = useState<IPetServiceCard | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

    useEffect(() => {
        if (id) {
            getPetServiceDetail(id).then((data) => {
                setPetService(data);
            });
        }
    }, [id]);

    // Format price to VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Generate stars based on rating
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

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
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[400px] bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src={petService?.image}
                        alt={petService?.name}
                        className="w-full h-full object-cover opacity-50"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
                    <div className="text-white">
                        <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none">
                            {petService?.categoryName}
                        </Badge>
                        <h1 className="text-4xl font-bold mb-2">{petService?.name}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {renderStars(petService?.ratingAverage || 0)}
                                <span>({petService?.totalReviews})</span>
                            </div>
                            <span>|</span>
                            <span>Đã dùng {petService?.totalUsed} lần</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Service Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <Card className="p-4">
                            <div className="grid grid-cols-3 gap-4">
                                {petService?.petServiceDetails.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                                            selectedImage === index ? 'border-blue-500' : 'border-transparent'
                                        }`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img
                                            src={image.image}
                                            alt={`${petService.name} - Image ${index + 1}`}
                                            className="w-full h-32 object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Service Description */}
                        <Card className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Mô tả dịch vụ</h2>
                            <p className="text-gray-600 whitespace-pre-line">
                                {petService?.description}
                            </p>
                        </Card>

                        {/* Reviews */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold">Đánh giá từ khách hàng</h2>
                                <Button variant="ghost" className="text-blue-600">
                                    Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                            {/* <div className="space-y-6">
                                {petService.reviews.map((review) => (
                                    <div key={review.id}>
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={review.userAvatar}
                                                alt={review.userName}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium">{review.userName}</span>
                                                    <span className="text-gray-500 text-sm">
                                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 mb-2">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <p className="text-gray-600">{review.comment}</p>
                                            </div>
                                        </div>
                                        <Separator className="my-4" />
                                    </div>
                                ))}
                            </div> */}
                        </Card>
                    </div>

                    {/* Right Column - Booking and Store Info */}
                    <div className="space-y-6">
                        {/* Price and Booking */}
                        <Card className="p-6 sticky top-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-red-600">
                                    {formatPrice(petService?.petServiceDetails[0].amount || 0)}
                                </h2>
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <Heart
                                        className={`w-6 h-6 ${
                                            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                                        }`}
                                    />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="w-5 h-5" />
                                    <span>Thời gian: {petService?.estimatedTime}</span>
                                </div>

                                {/* Pet Service Details */}
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-900">Bảng giá theo cân nặng</h4>
                                    <div className="space-y-2">
                                        {petService?.petServiceDetails.map((detail) => (
                                            <div
                                                key={detail.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">
                                                        {detail.petWeightMin} - {detail.petWeightMax} kg
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-red-600">
                                                        {formatPrice(detail.amount)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button className="w-full" size="lg" onClick={() => {
                                    console.log('Button clicked, current state:', isBookingDialogOpen);
                                    setIsBookingDialogOpen(true);
                                    console.log('State after update:', true);
                                }}>
                                    Đặt lịch ngay
                                </Button>
                            </div>

                            {/* Store Information */}
                            <div className="mt-6 pt-6 border-t">
                                <h3 className="text-lg font-semibold mb-4">Thông tin cửa hàng</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                                        <div>
                                            <p className="font-medium">{petService?.storeName}</p>
                                            <p className="text-gray-600">
                                                {[petService?.storeDistrict, petService?.storeCity].join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-600">0909090909</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-600">example@example.com</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-600">8:00 - 18:00</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <BookingDialog
                isOpen={isBookingDialogOpen}
                onClose={() => setIsBookingDialogOpen(false)}
                petServiceList={petService?.petServiceDetails}
                storeId={petService?.storeId}
            />
        </div>
    );
};

export default PetServiceDetail;
