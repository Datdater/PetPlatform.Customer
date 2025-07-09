import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { Store } from "@/services/store.service";
import { IProduct } from "@/types/IProduct";
import { IPetServiceCard } from "@/types/petServices/IPetServiceCard";
import { storeService } from "@/services/store.service";
import { Link, useParams } from "react-router-dom";

const sortOptions = [
  "Phổ biến",
  "Bán chạy",
  "Hàng mới",
  "Giá thấp đến cao",
  "Giá cao đến thấp",
];

const StorePage = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [services, setServices] = useState<IPetServiceCard[]>([]);

  const { id } = useParams();
  
  useEffect(() => {
    if (id) {
      storeService.getStore(id).then((store) => {
        setStore(store);
      });
      storeService.getProductsStore(id).then((products) => {
        setProducts(products.items || []);
      });
      storeService.getServicesStore(id).then((services) => {
        setServices(services.items || []);
      });
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-4">
      {/* Store Header */}
      <div className="max-w-5xl mx-auto mt-8 mb-10 px-6 py-8 bg-white rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-8 border border-gray-200">
        <div className="flex items-center gap-7 w-full md:w-auto justify-center md:justify-start">
          <img src={store?.logoUrl} alt="avatar" className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover shadow-sm" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              {store?.name}
              <span className="border border-gray-300 text-xs px-3 py-1 rounded-full font-medium text-gray-600">OFFICIAL</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-1 text-base">
              <span className="flex items-center gap-1 text-gray-600 font-medium"><Star className="w-5 h-5 text-gray-400" /> 5 <span className="text-gray-400 font-normal">/ 5</span></span>
              <span className="flex items-center gap-1 text-gray-600 font-medium"><Users className="w-5 h-5 text-gray-400" /> 100 <span className="text-gray-400 font-normal">người theo dõi</span></span>
            </div>
          </div>
        </div>
        <div className="flex justify-center md:justify-end w-full md:w-auto mt-6 md:mt-0">
          <Button className="bg-white text-gray-800 font-semibold px-8 py-3 rounded-full border border-gray-300 shadow hover:bg-gray-100 transition-all text-lg">+ Theo Dõi</Button>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="products" className="text-base font-medium">Sản Phẩm</TabsTrigger>
            <TabsTrigger value="services" className="text-base font-medium">Dịch Vụ</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Sort/Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-lg font-semibold text-gray-800">
                Tất cả sản phẩm: <span className="font-bold text-gray-900">{products.length} kết quả</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                {sortOptions.map((opt) => (
                  <Button key={opt} variant="outline" className="rounded-md px-4 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-none">
                    {opt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {products.map((p) => (
                <Card key={p.id} className="p-0 overflow-hidden rounded-xl shadow-sm bg-white border border-gray-200 group transition-transform hover:-translate-y-1">
                  <div className="relative">
                    <img src={p.productImage} alt={p.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />  
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="font-semibold text-base min-h-[40px] text-gray-900 mb-1 line-clamp-2">{p.name}</div>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-gray-900 font-bold text-lg">{p.price.toLocaleString()}₫</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Star size={14} className="text-gray-400" /> {p.starAverage} | Đã bán {p.sold}
                    </div>
                    <Link to={`/product/${p.id}`} className="mt-auto font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md shadow-none">
                      Xem chi tiết
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            {/* Sort/Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-lg font-semibold text-gray-800">
                Tất cả dịch vụ: <span className="font-bold text-gray-900">{services.length} kết quả</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                {sortOptions.map((opt) => (
                  <Button key={opt} variant="outline" className="rounded-md px-4 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-none">
                    {opt}
                  </Button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {services.map((service) => (
                <Card key={service.id} className="p-0 overflow-hidden rounded-xl shadow-sm bg-white border border-gray-200 group transition-transform hover:-translate-y-1">
                  <div className="relative">
                    <img src={service.image} alt={service.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />  
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <div className="font-semibold text-base min-h-[40px] text-gray-900 mb-1 line-clamp-2">{service.name}</div>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-gray-900 font-bold text-lg">{service.price.toLocaleString()}₫</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Star size={14} className="text-gray-400" /> {service.ratingAverage} | {service.description}
                    </div>
                    <Link to={`/service/${service.id}`} className="mt-auto font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md shadow-none">
                      Xem chi tiết
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StorePage;