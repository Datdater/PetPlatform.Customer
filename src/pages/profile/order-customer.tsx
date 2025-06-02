import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/store/contexts/UserContext";
import { orderService } from "@/services/order.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { formatVnPrice } from "@/utils/formatPrice";
import { PaginationResponse } from "@/types/common/Pagination";

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
      setOrders(res.items);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Đơn mua của tôi</h1>
      {/* Custom Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded border-b-2 font-medium transition-colors ${
              tab === t.key
                ? "border-primary text-primary bg-primary/10"
                : "border-transparent text-muted-foreground hover:bg-accent"
            }`}
            onClick={() => handleTabChange(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Không có đơn hàng</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-primary">
                  Mã đơn hàng: {order.id}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {STATUS_TABS.find((t) => t.key === order.orderStatus)?.label || order.orderStatus}
                </div>
              </div>
              <div className="space-y-4">
                {order.orderDetailDTOs.map((detail, index) => (
                  <div key={detail.productVariationId} className="flex gap-4">
                    <img
                      src={detail.pictureUrl || "/no-image.png"}
                      alt=""
                      className="w-20 h-20 object-cover rounded border border-border"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">
                        {detail.productName}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {parseAttributes(detail.attribute)}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        x{detail.quantity}
                      </div>
                    </div>
                    <div className="text-right min-w-[120px]">
                      <div className="text-muted-foreground text-sm">Đơn giá:</div>
                      <div className="text-lg font-bold text-primary">
                        {formatVnPrice(detail.price)}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-right">
                  <div className="text-muted-foreground text-sm">Tổng tiền:</div>
                  <div className="text-lg font-bold text-primary">
                    {formatVnPrice(calculateOrderTotal(order))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                {order.orderStatus === "Delivered" && (
                  <Button variant="default">Đã Nhận Hàng</Button>
                )}
                <Button variant="outline">Liên Hệ Người Bán</Button>
              </div>
            </Card>
          ))}
          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevious}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trang trước
            </Button>
            <span className="px-3 py-2 text-sm text-foreground">{page}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
