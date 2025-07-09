import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/store/contexts/UserContext";
import { cartService, Cart, CartItem } from "@/services/cart.service";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, ShoppingBag, Package } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

export default function CartPage() {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const location = useLocation();

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  useEffect(() => {
    const state = location.state as { selectedItems?: string[] };
    if (state?.selectedItems) {
      setSelectedItems(new Set(state.selectedItems));
    }
  }, [location.state]);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
      // Select all items by default
      setSelectedItems(new Set(data.items.map(item => item.id)));
    } catch {
      toast.error("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!user) return;
    try {
      await cartService.removeItem(itemId);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      fetchCart();
    } catch {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleClearCart = async () => {
    if (!user) return;
    try {
      await cartService.clearCart();
      toast.success("Đã xóa toàn bộ giỏ hàng");
      fetchCart();
    } catch {
      toast.error("Không thể xóa giỏ hàng");
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (!user || !cart) return;
    if (newQuantity < 1) return;
    setUpdating(itemId);
    try {
      const item = cart.items.find(i => i.id === itemId);
      if (!item) return;
      await cartService.updateItem({
        userId: user.id,
        id: itemId,
        quantity: newQuantity,
      });
      
      await fetchCart();
      toast.success("Đã cập nhật số lượng");
    } catch {
      toast.error("Không thể cập nhật số lượng");
    } finally {
      setUpdating(null);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (!cart) return;
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.items.map(item => item.id)));
    }
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    navigate('/checkout', { 
      state: { 
        selectedItems: Array.from(selectedItems)
      }
    });
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

  const calculateSelectedTotal = () => {
    if (!cart) return 0;
    return cart.items
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  // Mock address data (replace with real data or context if available)

  // Helper to group items by store
  const groupItemsByStore = (items: CartItem[]) => {
    // Mock store data for demonstration; replace with real data if available
    return items.reduce((groups, item) => {
      // Mock: assign storeId and storeName if not present
      const storeId = (item as any).storeId || 'store-1';
      const storeName = (item as any).storeName || 'Cửa hàng ABC';
      const storeUrl = (item as any).storeUrl || 'https://via.placeholder.com/40x40?text=Shop';
      if (!groups[storeId]) {
        groups[storeId] = {
          storeName,
          storeUrl,
          items: []
        };
      }
      groups[storeId].items.push(item);
      return groups;
    }, {} as Record<string, { storeName: string; storeUrl: string; items: CartItem[] }>);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <Package className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Vui lòng đăng nhập</h2>
        <p className="text-gray-500 mb-4">Bạn cần đăng nhập để xem giỏ hàng</p>
        <Link to="/login">
          <Button>Đăng nhập</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-gray-500">Đang tải giỏ hàng...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
      
      {cart && cart.items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Select All */}
              <div className="p-4 border-b flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedItems.size === cart.items.length}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Chọn tất cả ({selectedItems.size}/{cart.items.length})
                </label>
              </div>

              {/* Grouped by store */}
              {Object.entries(groupItemsByStore(cart.items)).map(([storeId, group]) => (
                <div key={storeId} className="border-b last:border-b-0">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50">
                    <img src={group.storeUrl} alt={group.storeName} className="w-8 h-8 rounded-full border" />
                    <span className="font-semibold text-base text-gray-700">{group.storeName}</span>
                  </div>
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 border-t last:border-b-0">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        className="mt-1"
                      />
                      <img 
                        src={item.pictureUrl} 
                        alt={item.productName} 
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.productName}</h3>
                        <div className="text-sm text-gray-500 mb-2">
                          {parseAttributes(item.attributes)}
                        </div>
                        <div className="text-orange-600 font-bold mb-2">
                          {item.unitPrice.toLocaleString('vi-VN')}₫
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded">
                            <button
                              className="px-2 py-1 hover:bg-gray-100"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={updating === item.id}
                            >
                              -
                            </button>
                            <span className="px-2 py-1 min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="px-2 py-1 hover:bg-gray-100"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updating === item.id}
                            >
                              +
                            </button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            {/* Delivery Address Card */}
            {/* <div className="bg-[#f7f8fa] rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 font-medium">Giao tới</span>
                <button className="text-blue-500 text-sm font-medium hover:underline">Thay đổi</button>
              </div>
              <div className="font-semibold text-base mb-1">
                {address.name} <span className="font-normal text-gray-500">|</span> <span className="font-semibold">{address.phone}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-medium">{address.type}</span>
                <span className="text-gray-600 text-sm">{address.address}</span>
              </div>
            </div> */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Tổng đơn hàng</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({selectedItems.size} sản phẩm)</span>
                  <span>{calculateSelectedTotal().toLocaleString('vi-VN')}₫</span>
                </div>
                {/* <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div> */}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-orange-600">{calculateSelectedTotal().toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full mb-3" 
                size="lg"
                disabled={selectedItems.size === 0}
                onClick={handleCheckout}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Tiến hành thanh toán ({selectedItems.size})
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleClearCart}
              >
                Xóa toàn bộ giỏ hàng
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg shadow-sm p-6">
          <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-4">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
          <Link to="/">
            <Button>Tiếp tục mua sắm</Button>
          </Link>
        </div>
      )}
    </div>
  );
}