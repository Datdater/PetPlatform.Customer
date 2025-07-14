import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/store/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, CreditCard, Banknote, Store } from "lucide-react";
import { addressService, type Address } from "@/services/address.service";
import { cartService, type Cart, type CartItem } from "@/services/cart.service";
import { orderService } from "@/services/order.service";

// Mock shipping fee calculation per store (replace with API call later)
const calculateShippingFeePerStore = (address: Address | null, storeItems: CartItem[]): number => {
  if (!address) return 0;
  
  // Mock logic: Different fees based on city and store
  const cityShippingFees: { [key: string]: number } = {
    "Hồ Chí Minh": 30000,
    "Hà Nội": 30000,
    "Đà Nẵng": 30000,
  };

  // Default fee for other cities
  const defaultFee = 30000;

  // Calculate based on total weight (mock weight calculation)
  const totalWeight = storeItems.reduce((weight, item) => weight + (item.quantity * 0.5), 0); // Assuming each item weighs 0.5kg

  // Base fee from city
  const baseFee = cityShippingFees[address.city] || defaultFee;

  // Add weight-based fee
  const weightFee = Math.ceil(totalWeight) * 5000*0; // 5000đ per kg

  return baseFee + weightFee;
};

// Helper to group items by store
const groupItemsByStore = (items: CartItem[]) => {
  return items.reduce((groups, item) => {
    const storeId = item.storeId || 'store-1';
    const storeName = item.storeName || 'Cửa hàng ABC';
    if (!groups[storeId]) {
      groups[storeId] = {
        storeId,
        storeName,
        items: []
      };
    }
    groups[storeId].items.push(item);
    return groups;
  }, {} as Record<string, { storeId: string; storeName: string; items: CartItem[] }>);
};

export default function Checkout() {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchAddresses();
    }
  }, [user]);

  useEffect(() => {
    // Get selected items from location state
    const state = location.state as { selectedItems?: string[] };
    if (state?.selectedItems) {
      setSelectedItems(new Set(state.selectedItems));
    }
  }, [location.state]);

  // Auto-switch to COD if multiple stores and online payment is selected
  useEffect(() => {
    if (!cart) return;
    
    const selectedCartItems = cart.items.filter(item => selectedItems.has(item.id));
    const groupedByStore = groupItemsByStore(selectedCartItems);
    const hasMultipleStores = Object.keys(groupedByStore).length > 1;
    
    if (hasMultipleStores && paymentMethod === "credit_card") {
      setPaymentMethod("cod");
      toast.info("Thanh toán online không khả dụng cho đơn hàng từ nhiều cửa hàng. Đã chuyển sang thanh toán khi nhận hàng.");
    }
  }, [cart, selectedItems, paymentMethod]);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      toast.error("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const data = await addressService.getAll();
      setAddresses(data.addresses);
      // Set default address if available
      const defaultAddress = data.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (data.addresses.length > 0) {
        setSelectedAddress(data.addresses[0]);
      }
    } catch {
      toast.error("Không thể tải địa chỉ");
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !selectedAddress || !cart) return;
    
    try {
      setLoading(true);
      
      // Get selected items and group them by store
      const selectedCartItems = cart.items.filter(item => selectedItems.has(item.id));
      const groupedByStore = groupItemsByStore(selectedCartItems);
      
      // Map payment method to enum value
      const paymentMethodMap = {
        "credit_card": 1,
        "cod": 0
      };

      const paymentMethodValue = paymentMethodMap[paymentMethod as keyof typeof paymentMethodMap];
      
      // Create orders for each store
      const orderPromises = Object.entries(groupedByStore).map(async ([, storeGroup]) => {
        const storeDeliveryFee = calculateShippingFeePerStore(selectedAddress, storeGroup.items);
        
        // Prepare order details for this store
        const orderDetails = storeGroup.items.map(item => ({
          quantity: item.quantity,
          price: item.unitPrice,
          productVariationId: item.productVariantId,
          productName: item.productName,
          pictureUrl: item.pictureUrl,
          productId: item.id,
          attribute: item.attributes || {},
          id: item.id
        }));

        const orderData = {
          storeId: storeGroup.storeId,
          customerId: user.id,
          addressId: selectedAddress.id,
          addressStoreId: selectedAddress.id,
          paymentMethod: paymentMethodValue,
          promotionId: "", // TODO: Add promotion handling
          deliveryPrice: storeDeliveryFee,
          note: note,
          orderDetails: orderDetails
        };

        return await orderService.createOrder(orderData);
      });

      // Wait for all orders to be created
      const orderResponses = await Promise.all(orderPromises);

      // Remove purchased items from cart
      const purchasedItemIds = selectedCartItems.map(item => item.id);
      for (const itemId of purchasedItemIds) {
        await cartService.removeItem(itemId);
      }

      // Handle payment based on payment method
      if (paymentMethodValue !== 0) { // Not COD
        // For online payment, redirect to the first order's payment URL
        // In a real implementation, you might want to handle multiple payment URLs
        if (orderResponses.length > 0 && orderResponses[0].paymentUrl) {
          window.location.href = orderResponses[0].paymentUrl;
        } else {
          toast.success("Đặt hàng thành công!");
          navigate("/user/orders");
        }
      } else {
        // For COD, show success message and redirect to orders page
        toast.success(`Đặt hàng thành công! ${orderResponses.length} đơn hàng đã được tạo.`);
        navigate("/user/orders");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Không thể đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  const calculateSelectedTotal = () => {
    if (!cart) return 0;
    return cart.items
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const calculateDeliveryFeesByStore = () => {
    if (!cart || !selectedAddress) return {};
    
    const selectedCartItems = cart.items.filter(item => selectedItems.has(item.id));
    const groupedByStore = groupItemsByStore(selectedCartItems);
    
    const deliveryFees: Record<string, number> = {};
    Object.entries(groupedByStore).forEach(([storeId, storeGroup]) => {
      deliveryFees[storeId] = calculateShippingFeePerStore(selectedAddress, storeGroup.items);
    });
    
    return deliveryFees;
  };

  const calculateTotalDeliveryFee = () => {
    const deliveryFees = calculateDeliveryFeesByStore();
    return Object.values(deliveryFees).reduce((total, fee) => total + fee, 0);
  };

  const calculateFinalTotal = () => {
    return calculateSelectedTotal() + calculateTotalDeliveryFee();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Vui lòng đăng nhập</h2>
        <p className="text-gray-500 mb-4">Bạn cần đăng nhập để thanh toán</p>
        <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (!cart || selectedItems.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-4">Vui lòng chọn sản phẩm từ giỏ hàng để thanh toán</p>
        <Button onClick={() => navigate("/cart")}>Quay lại giỏ hàng</Button>
      </div>
    );
  }

  const selectedCartItems = cart.items.filter(item => selectedItems.has(item.id));
  const groupedByStore = groupItemsByStore(selectedCartItems);
  const deliveryFeesByStore = calculateDeliveryFeesByStore();
  const hasMultipleStores = Object.keys(groupedByStore).length > 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Shipping & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ giao hàng</CardTitle>
            </CardHeader>
            <CardContent>
              {addresses.length > 0 ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{selectedAddress?.name}</p>
                        <p className="text-gray-600">{selectedAddress?.phoneNumber}</p>
                        <p className="text-gray-600 mt-1">
                          {selectedAddress?.street}, {selectedAddress?.ward}, {selectedAddress?.district}, {selectedAddress?.city}
                        </p>
                      </div>
                      {selectedAddress?.isDefault && (
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                          Mặc định
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                        >
                          Thay đổi địa chỉ
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {addresses.map((address) => (
                            <div
                              key={address.id}
                              className={`p-4 border rounded-lg cursor-pointer hover:border-orange-500 ${
                                selectedAddress?.id === address.id
                                  ? "border-orange-500 bg-orange-50"
                                  : "border-gray-200"
                              }`}
                              onClick={() => {
                                setSelectedAddress(address);
                                setIsAddressDialogOpen(false);
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold">{address.name}</p>
                                  <p className="text-gray-600">{address.phoneNumber}</p>
                                  <p className="text-gray-600 mt-1">
                                    {address.street}, {address.ward}, {address.district}, {address.city}
                                  </p>
                                </div>
                                {address.isDefault && (
                                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                                    Mặc định
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => {
                              setIsAddressDialogOpen(false);
                              navigate("/user/address");
                            }}
                          >
                            Thêm địa chỉ mới
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ nào</p>
                  <Button onClick={() => navigate("/user/address")}>
                    Thêm địa chỉ
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card>
            <CardHeader>
              <CardTitle>Phương thức vận chuyển</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(groupedByStore).map(([storeId, storeGroup]) => (
                  <div key={storeId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Store className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Giao hàng tiêu chuẩn - {storeGroup.storeName}</p>
                        <p className="text-sm text-gray-500">Dự kiến giao trong 2-3 ngày</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{deliveryFeesByStore[storeId]?.toLocaleString('vi-VN')}₫</p>
                      <p className="text-sm text-gray-500">Tính theo địa chỉ giao hàng</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className={`flex items-center space-x-2 border rounded-lg p-4 ${hasMultipleStores ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <RadioGroupItem 
                    value="credit_card" 
                    id="credit_card" 
                    disabled={hasMultipleStores}
                  />
                  <Label 
                    htmlFor="credit_card" 
                    className={`flex items-center gap-2 ${hasMultipleStores ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Thanh toán online
                    {hasMultipleStores && (
                      <span className="text-xs text-red-500 ml-2">
                        (Không khả dụng cho đơn hàng từ nhiều cửa hàng)
                      </span>
                    )}
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                    <Banknote className="w-5 h-5" />
                    Thanh toán khi nhận hàng (COD)
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-4">
                <Label htmlFor="note">Ghi chú đơn hàng</Label>
                <Input
                  id="note"
                  placeholder="Nhập ghi chú cho đơn hàng của bạn (không bắt buộc)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Items grouped by store */}
                {Object.entries(groupedByStore).map(([storeId, storeGroup]) => (
                  <div key={storeId} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Store className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-sm text-gray-700">{storeGroup.storeName}</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      {storeGroup.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.productName} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Phí vận chuyển {storeGroup.storeName}</span>
                      <span>{deliveryFeesByStore[storeId]?.toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Tổng {storeGroup.storeName}</span>
                      <span className="text-orange-600">
                        {(storeGroup.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0) + (deliveryFeesByStore[storeId] || 0)).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span>
                      {calculateSelectedTotal().toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span>{calculateTotalDeliveryFee().toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Tổng cộng</span>
                      <span className="text-orange-600">
                        {calculateFinalTotal().toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={!selectedAddress || loading}
                >
                  {loading ? "Đang xử lý..." : `Đặt hàng (${Object.keys(groupedByStore).length} cửa hàng)`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
