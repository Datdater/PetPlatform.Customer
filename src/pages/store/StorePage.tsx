import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, CheckCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/common/sideBar";


const shopInfo = {
  name: "Tâm Luân Official",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  verified: true,
  rating: 4.5,
  followers: 325,
};

const sortOptions = [
  "Phổ biến",
  "Bán chạy",
  "Hàng mới",
  "Giá thấp đến cao",
  "Giá cao đến thấp",
];

const products = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: "Cần câu lông vũ đèn laser cho mèo nhà",
  price: 150000,
  discount: 30,
  image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80",
  rating: 4.8,
  sold: 300,
  badges: i % 3 === 0 ? ["TOP DEAL", "XTRA"] : i % 3 === 1 ? ["XTRA"] : [],
  isNew: i % 4 === 0,
}));

const StorePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-4">
      {/* Store Header */}
      <div className="max-w-5xl mx-auto mt-8 mb-10 px-6 py-8 bg-white rounded-2xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-8 border border-gray-200">
        <div className="flex items-center gap-7 w-full md:w-auto justify-center md:justify-start">
          <img src={shopInfo.avatar} alt="avatar" className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover shadow-sm" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              {shopInfo.name}
              {shopInfo.verified && <CheckCircle className="w-6 h-6 text-gray-400" />}
              <span className="border border-gray-300 text-xs px-3 py-1 rounded-full font-medium text-gray-600">OFFICIAL</span>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-1 text-base">
              <span className="flex items-center gap-1 text-gray-600 font-medium"><Star className="w-5 h-5 text-gray-400" /> {shopInfo.rating} <span className="text-gray-400 font-normal">/ 5</span></span>
              <span className="flex items-center gap-1 text-gray-600 font-medium"><Users className="w-5 h-5 text-gray-400" /> {shopInfo.followers} <span className="text-gray-400 font-normal">người theo dõi</span></span>
            </div>
          </div>
        </div>
        <div className="flex justify-center md:justify-end w-full md:w-auto mt-6 md:mt-0">
          <Button className="bg-white text-gray-800 font-semibold px-8 py-3 rounded-full border border-gray-300 shadow hover:bg-gray-100 transition-all text-lg">+ Theo Dõi</Button>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="flex justify-center mt-8">
        <Tabs defaultValue="tatca">
          <TabsList className="flex flex-wrap gap-2 bg-white rounded-lg border border-gray-200 p-1 shadow-none">
            <TabsTrigger value="tatca" className="rounded-md px-5 py-2 font-medium text-gray-700 border-none data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=active]:text-gray-900 data-[state=active]:bg-gray-100">Tất Cả Sản Phẩm</TabsTrigger>
            <TabsTrigger value="bostap" className="rounded-md px-5 py-2 font-medium text-gray-700 border-none data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=active]:text-gray-900 data-[state=active]:bg-gray-100">Bộ Sưu Tập</TabsTrigger>
            <TabsTrigger value="giasoc" className="rounded-md px-5 py-2 font-medium text-gray-700 border-none data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=active]:text-gray-900 data-[state=active]:bg-gray-100">Giá Sốc Hôm Nay</TabsTrigger>
            <TabsTrigger value="hoso" className="rounded-md px-5 py-2 font-medium text-gray-700 border-none data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=active]:text-gray-900 data-[state=active]:bg-gray-100">Hồ Sơ Cửa Hàng</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 mt-12 mb-12 px-4 md:px-8">
        {/* Sidebar */}
        <aside className="w-full md:w-[260px] flex-shrink-0 pb-8 md:pb-0">
          <Sidebar />
        </aside>
        {/* Product Area */}
        <main className="flex-1 px-1 md:px-4">
          {/* Sort/Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <div className="text-lg font-semibold text-gray-800">Tất cả sản phẩm: <span className="font-bold text-gray-900">{products.length} kết quả</span></div>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              {sortOptions.map((opt, _idx) => (
                <Button key={opt} variant="outline" className="rounded-md px-4 py-1.5 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 shadow-none">{opt}</Button>
              ))}
            </div>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {products.map((p) => (
              <Card key={p.id} className="p-0 overflow-hidden rounded-xl shadow-sm bg-white border border-gray-200 group transition-transform hover:-translate-y-1">
                <div className="relative">
                  <img src={p.image} alt={p.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                  {p.isNew && <div className="absolute top-3 left-3 border border-gray-300 text-xs font-medium px-2 py-0.5 rounded-full bg-white/80 text-gray-700">NEW</div>}
                  {p.badges.map((b, i) => (
                    <div key={b} className={`absolute top-3 right-3 mt-${i * 7} border border-gray-300 text-xs font-medium px-2 py-0.5 rounded-full bg-white/80 text-gray-700`}>{b}</div>
                  ))}
                  {p.discount > 0 && (
                    <div className="absolute bottom-3 right-3 border border-gray-300 text-xs font-medium px-2 py-0.5 rounded-full bg-white/80 text-gray-700">-{p.discount}%</div>
                  )}
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="font-semibold text-base min-h-[40px] text-gray-900 mb-1 line-clamp-2">{p.name}</div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-gray-900 font-bold text-lg">{p.price.toLocaleString()}₫</span>
                    {p.discount > 0 && <span className="text-gray-400 text-sm line-through">{(p.price / (1 - p.discount / 100)).toLocaleString()}₫</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Star size={14} className="text-gray-400" /> {p.rating} | Đã bán {p.sold}
                  </div>
                  <Button variant="outline" size="sm" className="mt-auto font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md shadow-none">Xem chi tiết</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
export default StorePage;