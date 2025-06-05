import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/store/contexts/UserContext";
import { orderService } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatVnPrice } from "@/utils/formatPrice";

const PAGE_SIZE = 5;

const STATUS_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "PendingPayment", label: "Chờ thanh toán" },
  { key: "Confirmed", label: "Đã xác nhận" },
  { key: "Shipping", label: "Đang vận chuyển" },
  { key: "Delivered", label: "Đã giao hàng" },
  { key: "Cancelled", label: "Đã hủy" },
  { key: "Refunded", label: "Đã hoàn tiền" },
];

interface OrderDetail {
  quantity: number;
  price: number;
  productVariationId: string;
  productName: string;
  pictureUrl: string;
  productId: string;
  attribute: string;
}

interface Order {
  id: string;
  storeId: string;
  price: number;
  orderDetailDTOs: OrderDetail[];
  orderStatus: string;
  createdAt: string;
}

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
        hasNext: res.next,
        hasPrevious: res.previous,
        totalPages: res.totalPagesCount,
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

  const parseAttributes = (attributes: string) => {
    try {
      const parsed = JSON.parse(attributes);
      return Object.entries(parsed)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    } catch {
      return attributes;
    }
  };

  const calculateOrderTotal = (order: Order) => {
    return order.orderDetailDTOs.reduce((total, detail) => total + (detail.price * detail.quantity), 0);
  };

  function getStatusColor(status: string) {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-700";
      case "Cancelled": return "bg-red-100 text-red-700";
      case "PendingPayment": return "bg-yellow-100 text-yellow-700";
      case "Confirmed": return "bg-blue-100 text-blue-700";
      case "Shipping": return "bg-purple-100 text-purple-700";
      case "Refunded": return "bg-gray-200 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
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
    <div className="max-w-4xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold mb-8 text-center">Đơn hàng của tôi</h1>
      {/* Custom Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-full border font-medium transition-colors shadow-sm
              ${tab === t.key
                ? "border-orange-500 text-orange-600 bg-orange-50"
                : "border-gray-200 text-gray-500 hover:bg-gray-100"}
            `}
            onClick={() => handleTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-lg font-medium animate-pulse">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <img src="/empty-orders.svg" alt="No orders" className="mx-auto mb-4 w-32" />
          <div className="text-lg">Bạn chưa có đơn hàng nào.</div>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl  p-6 border  ">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div>
                  <div className="text-lg font-semibold text-orange-700">
                    Mã đơn: {shortOrderId(order.id)}
                  </div>
                  <div className="text-gray-500 text-sm">Ngày đặt: {order.createdAt}</div>
                </div>
                <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold mt-2 md:mt-0 ${getStatusColor(order.orderStatus)}`}>
                  {getStatusLabel(order.orderStatus)}
                </span>
              </div>
              <div className="divide-y">
                {order.orderDetailDTOs.map((item, idx) => (
                  <div key={item.productVariationId + idx} className="flex items-center py-4 gap-4">
                    <img src={item.pictureUrl} alt={item.productName} className="w-20 h-20 rounded-lg object-cover border bg-gray-50" />
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
              <div className="flex justify-end mt-6">
                <span className="text-xl font-bold text-orange-600">
                  Tổng: {formatVnPrice(calculateOrderTotal(order))}
                </span>
              </div>
            </div>
          ))}
          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevious}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border-orange-200"
            >
              Trang trước
            </Button>
            <span className="px-3 py-2 text-base text-foreground font-semibold">{page}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border-orange-200"
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
