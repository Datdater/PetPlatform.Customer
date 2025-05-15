import React from 'react';
import { IProductReview } from '@/types/IProduct';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface ProductReviewsProps {
    reviews: IProductReview[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ reviews }) => {
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`star-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(
                <div key="half-star" className="relative">
                    <Star className="w-5 h-5 text-gray-300" />
                    <div className="absolute top-0 left-0 overflow-hidden w-1/2">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
            );
        }

        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-star-${i}`} className="w-5 h-5 text-gray-300" />);
        }

        return stars;
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'dd MMMM yyyy', { locale: vi });
    };

    // Calculate average rating
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    
    // Calculate rating distribution
    const ratingDistribution = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Rating Summary Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Overall Rating */}
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-primary mb-2">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="flex justify-center mb-2">
                                {renderStars(averageRating)}
                            </div>
                            <div className="text-sm text-gray-500">
                                {reviews.length} đánh giá
                            </div>
                        </div>
                        <div className="flex-1">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1 w-16">
                                        <span className="text-sm font-medium">{rating}</span>
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-yellow-400 rounded-full"
                                            style={{ 
                                                width: `${(ratingDistribution[rating as keyof typeof ratingDistribution] / reviews.length) * 100}%` 
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-500 w-12 text-right">
                                        {ratingDistribution[rating as keyof typeof ratingDistribution]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rating Actions */}
                    <div className="flex flex-col justify-center items-center gap-4">
                        <Button className="w-full max-w-xs">
                            Viết đánh giá
                        </Button>
                        <div className="text-sm text-gray-500">
                            Chia sẻ trải nghiệm của bạn với cộng đồng
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <Avatar className="h-14 w-14 border-2 border-primary/10">
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.userName}`} />
                                <AvatarFallback className="text-lg">{review.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{review.userName}</h3>
                                        <div className="flex items-center gap-2">
                                            {renderStars(review.rating)}
                                            <span className="text-sm text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                                            <ThumbsUp className="w-4 h-4" />
                                            <span className="text-sm">Hữu ích</span>
                                        </button>
                                        <button className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors">
                                            <MessageCircle className="w-4 h-4" />
                                            <span className="text-sm">Phản hồi</span>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductReviews; 