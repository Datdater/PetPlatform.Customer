import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/store/contexts/UserContext";
import { Order, orderService } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatVnPrice } from "@/utils/formatPrice";
import { motion } from "framer-motion";
import { Loader2, Package, Truck, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

const PAGE_SIZE = 5;

const STATUS_TABS = [
  { key: "all", label: "Tất cả", icon: Package },
  { key: "PendingPayment", label: "Chờ thanh toán", icon: Clock },
  { key: "Confirmed", label: "Đã xác nhận", icon: CheckCircle },
  { key: "Shipping", label: "Đang vận chuyển", icon: Truck },
  { key: "Delivered", label: "Đã giao hàng", icon: CheckCircle },
  { key: "Cancelled", label: "Đã hủy", icon: XCircle },
  { key: "Refunded", label: "Đã hoàn tiền", icon: RefreshCw },
];

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

export default function OrderCustomerPage() {
  const user = useContext(UserContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    hasNext: boolean;
    hasPrevious: boolean;
    totalPages: number;
  }>({
    hasNext: false,
    hasPrevious: false,
    totalPages: 1,
  });
  const [tab, setTab] = useState("all");

  useEffect(() => {
    if (user) fetchOrders();
    // eslint-disable-next-line
  }, [user, page, tab]);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const params: any = {
        pageNumber: page,
        pageSize: PAGE_SIZE,
        userId: user.id,
      };
      if (tab !== "all") {
        params.status = tab;
      }
      const res = await orderService.getOrders(params);
      setOrders(
        res.items.map((order: any) => ({
          ...order,
          createdAt: order.createDate || order.createdAt || "",
        }))
      );
      setPagination({
        hasNext: res.hasNextPage,
        hasPrevious: res.hasPreviousPage,
        totalPages: res.totalCount,
      });
    } catch (e) {
      toast.error("Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setTab(value);
    setPage(1);
  };

  const parseAttributes = (attributes: Record<string, string>) => {
    return Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };
  
  
  


  function getStatusColor(status: string) {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700 border-green-200";
      case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "PendingPayment": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Shipping": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Refunded": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "Delivered": return "Đã giao hàng";
      case "Cancelled": return "Đã hủy";
      case "PendingPayment": return "Chờ thanh toán";
      case "Confirmed": return "Đã xác nhận";
      case "Shipping": return "Đang vận chuyển";
      case "Refunded": return "Đã hoàn tiền";
      default: return status;
    }
  }

  function shortOrderId(orderId: string) {
    return orderId.slice(-6).toUpperCase();
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
        <p className="mt-2 text-sm text-gray-600">Theo dõi và quản lý đơn hàng của bạn</p>
      </motion.div>

      {/* Custom Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {STATUS_TABS.map((t) => {
          const Icon = t.icon;
          return (
            <motion.button
              key={t.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-full border font-medium transition-all duration-200 shadow-sm flex items-center gap-2
                ${tab === t.key
                  ? "border-orange-500 text-orange-600 bg-orange-50"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"}
              `}
              onClick={() => handleTabChange(t.key)}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
          <p className="text-gray-600">Đang tải đơn hàng của bạn...</p>
        </div>
      ) : orders.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gray-50 rounded-2xl"
        >
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Bạn chưa có đơn hàng nào</p>
          <Button 
            variant="outline" 
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
            onClick={() => window.location.href = '/search'}
          >
            Mua sắm ngay
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl p-6 border hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                  <div>
                    <div className="text-lg font-semibold text-orange-700">
                      Mã đơn: {shortOrderId(order.id)}
                    </div>
                    <div className="text-gray-500 text-sm">Ngày đặt: {formatDate(order.createdTime)}</div>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                    {getStatusLabel(order.orderStatus)}
                  </span>
                </div>
                <div className="divide-y">
                  {order.orderDetailDTOs.map((item, idx) => (
                    <div key={item.productVariationId + idx} className="flex items-center py-4 gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-50">
                        <img 
                          src={item.pictureUrl} 
                          alt={item.productName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-base">{item.productName}</div>
                        <div className="text-gray-500 text-sm truncate">{parseAttributes(item.attribute)}</div>
                      </div>
                      <div className="text-right min-w-[120px]">
                        <div className="font-semibold text-orange-600">{formatVnPrice(item.price)}</div>
                        <div className="text-gray-500 text-xs">x {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-end gap-2 mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Phí vận chuyển: {formatVnPrice(order.deliveryPrice)}
                  </div>
                  <div className="text-xl font-bold text-orange-600">
                    Tổng: {formatVnPrice(order.price)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Pagination */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8 gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevious}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Trang trước
            </Button>
            <span className="px-3 py-2 text-base text-foreground font-semibold">{page}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Trang sau
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
