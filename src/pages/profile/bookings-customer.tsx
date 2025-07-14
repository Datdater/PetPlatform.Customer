import { useContext, useEffect, useState } from 'react';
import { getBooking, IBookingResponse } from '@/services/booking.service';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { UserContext } from "@/store/contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { ServiceReviewDialog } from "@/components/features/petServices/ServiceReviewDialog";

const BookingsCustomer: React.FC = () => {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<IBookingResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 6;
    const [reviewDialog, setReviewDialog] = useState<{
        open: boolean;
        serviceId: string | null;
        serviceName: string;
    }>({ open: false, serviceId: null, serviceName: "" });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings(currentPage);
    }, [currentPage, user, navigate]);

    const fetchBookings = async (page: number) => {
        try {
            setIsLoading(true);
            const params = {
                pageNumber: page,
                pageSize: pageSize,
                userId: user?.id || ''
            };
            const res = await getBooking(params);
            setBookings(res.items);
            setTotalPages(Math.ceil(res.totalCount / pageSize));
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: number) => {
        const statusConfig: { [key: number]: { variant: "default" | "secondary" | "destructive" | "outline", label: string, color: string } } = {
            1: { variant: 'secondary', label: 'Đã đặt', color: 'bg-yellow-100 text-yellow-800' },
            2: { variant: 'default', label: 'Đang thực hiện', color: 'bg-blue-100 text-blue-800' },
            3: { variant: 'outline', label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
            4: { variant: 'destructive', label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
        };

        const config = statusConfig[status] || { variant: 'secondary', label: String(status), color: 'bg-gray-100 text-gray-800' };
        return (
            <Badge variant={config.variant} className={`${config.color} font-medium px-3 py-1`}>
                {config.label}
            </Badge>
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    };

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
                    <p className="mt-2 text-sm text-gray-600">Quản lý và theo dõi các lịch hẹn dịch vụ của bạn</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-gray-600">Đang tải lịch hẹn của bạn...</p>
                </div>
            ) : bookings.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 bg-gray-50 rounded-lg"
                >
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Bạn chưa có lịch hẹn nào</p>
                    <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/search')}
                    >
                        Tìm dịch vụ ngay
                    </Button>
                </motion.div>
            ) : (
                <>
                    <div className="space-y-4">
                        {bookings.map((booking, index) => (
                            <motion.div
                                key={booking.bookingId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="p-4 hover:shadow-md transition-shadow duration-200">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-2">
                                        <div>
                                            <div className="text-lg font-semibold text-orange-700">
                                                Mã lịch hẹn: {booking.bookingId.slice(-6).toUpperCase()}
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                Ngày hẹn: {formatDate(booking.bookingTime)}
                                            </div>
                                        </div>
                                        {getStatusBadge(Number(booking.status))}
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <Store className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900">{booking.shopName}</div>
                                            <div className="text-sm text-gray-600">{booking.storeAddressStreet}, {booking.storeAddressWard}, {booking.storeAddressDistrict}, {booking.storeAddressProvince}</div>
                                        </div>
                                    </div>
                                    <div className="divide-y">
                                        {booking.petWithServices.map((detail, idx) => (
                                            <div key={idx} className="flex items-center py-3 gap-4">
                                                <div className="w-36 h-36 rounded-lg bg-orange-50 flex items-center justify-center">
                                                    <img src={detail.services[0].imageUrl} alt={detail.pet.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate text-base">{detail.pet.name}</div>
                                                    <div className="text-gray-500 text-sm truncate">{detail.services[0].serviceDetailName}</div>
                                                </div>
                                                <div className="text-right min-w-[120px] flex flex-col items-end gap-2">
                                                    <div className="font-semibold text-orange-600">{formatPrice(detail.services[0].price)}</div>
                                                    {/* Review button for completed bookings */}
                                                    {Number(booking.status) === 3 && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="mt-2 border-green-200 text-green-700 hover:bg-green-50"
                                                            onClick={() => setReviewDialog({ open: true, serviceId: detail.services[0].id, serviceName: detail.services[0].serviceDetailName })}
                                                        >
                                                            Đánh giá
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-4 pt-3 border-t">
                                        <span className="text-lg font-bold text-orange-600">
                                            Tổng: {formatPrice(booking.totalPrice)}
                                        </span>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 flex justify-center"
                        >
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </motion.div>
                    )}
                </>
            )}
            {/* Review Dialog (global, outside map) */}
            <ServiceReviewDialog
                open={reviewDialog.open}
                serviceId={reviewDialog.serviceId || ""}
                serviceName={reviewDialog.serviceName}
                onOpenChange={(open) => setReviewDialog((prev) => ({ ...prev, open }))}
                onSubmitted={() => {
                    setReviewDialog({ open: false, serviceId: null, serviceName: "" });
                    // Optionally show a toast here
                }}
            />
        </div>
    );
};

export default BookingsCustomer;
