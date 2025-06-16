import { paymentService } from "@/services/payment.service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Payment() {
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get('orderCode');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPayment = async () => {
            if (!orderCode) {
                setStatus('error');
                setMessage('Không tìm thấy mã đơn hàng');
                return;
            }

            try {
                await paymentService.executePayment({ orderCode });
                setStatus('success');
                setMessage('Thanh toán thành công');
            } catch (error) {
                setStatus('error');
                setMessage('Có lỗi xảy ra khi thanh toán');
            }
        }
        fetchPayment();
    }, [orderCode]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                {status === 'loading' && (
                    <div className="text-lg">Đang xử lý thanh toán...</div>
                )}
                {status === 'success' && (
                    <div className="text-green-600 text-2xl font-bold">
                        {message}
                    </div>
                )}
                {status === 'error' && (
                    <div className="text-red-600 text-2xl font-bold">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}