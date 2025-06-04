import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users, CheckCircle, ShoppingBag, Monitor, Car, Home, Book, Shirt } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


const shopInfo = {
  name: "Tâm Luân Official",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  verified: true,
  rating: 4.5,
  followers: 325,
};

const categories = [
  { name: "Bách Hóa Online", icon: ShoppingBag },
  { name: "Thiết Bị Số - Phụ Kiện Số", icon: Monitor },
  { name: "Ô Tô - Xe Máy - Xe Đạp", icon: Car },
  { name: "Nhà Cửa - Đời Sống", icon: Home },
  { name: "Nhà Sách Tiki", icon: Book },
  { name: "Phụ kiện thời trang", icon: Shirt },
];

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
    <div className="min-h-screen bg-gray-100 pb-12 pt-2">
      {/* Store Header */}
      <div className="bg-[var(--primary,#1a3fa6)] max-w-7xl mx-auto shadow-lg rounded-3xl px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-5">
          <img src={shopInfo.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover" />
          <div>
            <div className="flex items-center gap-2 text-2xl font-extrabold text-white">
              {shopInfo.name}
              {shopInfo.verified && <CheckCircle className="w-6 h-6 text-blue-200" />}
              <span className="bg-blue-800 text-xs px-3 py-1 rounded-full ml-2 font-bold text-white">OFFICIAL</span>
            </div>
            <div className="flex items-center gap-6 mt-2 text-base">
              <span className="flex items-center gap-1 text-yellow-400 font-semibold"><Star className="w-5 h-5" /> {shopInfo.rating} <span className="text-white/80 font-normal">/ 5</span></span>
              <span className="flex items-center gap-1 text-blue-200 font-semibold"><Users className="w-5 h-5" /> {shopInfo.followers} <span className="text-white/80 font-normal">người theo dõi</span></span>
            </div>
          </div>
        </div>
        <Button className="bg-white text-[var(--primary,#1a3fa6)] font-bold px-8 py-3 rounded-full shadow-lg text-lg border border-blue-200 hover:bg-blue-50">+ Theo Dõi</Button>
      </div>
      {/* Navigation Tabs */}
      <div className="flex justify-center mt-6">
        <Tabs defaultValue="tatca">
          <TabsList className="flex flex-wrap gap-3 bg-white rounded-full shadow p-2">
            <TabsTrigger value="tatca" className="rounded-full px-6 py-2 font-semibold transition-all data-[state=active]:bg-[var(--primary,#1a3fa6)] data-[state=active]:text-white data-[state=active]:shadow-lg">Tất Cả Sản Phẩm</TabsTrigger>
            <TabsTrigger value="bostap" className="rounded-full px-6 py-2 font-semibold transition-all data-[state=active]:bg-[var(--primary,#1a3fa6)] data-[state=active]:text-white data-[state=active]:shadow-lg">Bộ Sưu Tập</TabsTrigger>
            <TabsTrigger value="giasoc" className="rounded-full px-6 py-2 font-semibold transition-all data-[state=active]:bg-[var(--primary,#1a3fa6)] data-[state=active]:text-white data-[state=active]:shadow-lg">Giá Sốc Hôm Nay</TabsTrigger>
            <TabsTrigger value="hoso" className="rounded-full px-6 py-2 font-semibold transition-all data-[state=active]:bg-[var(--primary,#1a3fa6)] data-[state=active]:text-white data-[state=active]:shadow-lg">Hồ Sơ Cửa Hàng</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 mt-10 px-2 md:px-0">
        {/* Sidebar */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
            <div className="font-bold text-lg text-[var(--primary,#1a3fa6)] mb-4">Danh mục sản phẩm</div>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.name} className="flex items-center gap-3 text-gray-700 hover:text-[var(--primary,#1a3fa6)] cursor-pointer px-3 py-2 rounded-xl transition font-medium hover:bg-blue-50">
                  <cat.icon className="w-5 h-5 text-blue-200" />
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Product Area */}
        <main className="flex-1">
          {/* Sort/Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="text-xl font-bold text-gray-700">Tất cả sản phẩm: <span className="font-extrabold text-[var(--primary,#1a3fa6)]">{products.length} kết quả</span></div>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              {sortOptions.map((opt, idx) => (
                <Button key={opt} variant={idx === 0 ? "secondary" : "outline"} className={`rounded-full px-5 py-2 text-base font-semibold ${idx === 0 ? 'bg-blue-50 text-[var(--primary,#1a3fa6)] border border-blue-200' : ''}`}>{opt}</Button>
              ))}
            </div>
          </div>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <Card key={p.id} className="p-0 overflow-hidden rounded-2xl shadow-xl bg-white border border-blue-100 group transition-transform hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative">
                  <img src={p.image} alt={p.name} className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105" />
                  {p.isNew && <div className="absolute top-3 left-3 bg-[var(--primary,#1a3fa6)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">NEW</div>}
                  {p.badges.map((b, i) => (
                    <div key={b} className={`absolute top-3 right-3 mt-${i * 8} bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>{b}</div>
                  ))}
                  {p.discount > 0 && (
                    <div className="absolute bottom-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">-{p.discount}%</div>
                  )}
                </div>
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="font-bold text-lg min-h-[48px] text-gray-800 mb-2 line-clamp-2">{p.name}</div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-[var(--primary,#1a3fa6)] font-extrabold text-xl">{p.price.toLocaleString()}₫</span>
                    {p.discount > 0 && <span className="text-gray-400 text-base line-through">{(p.price / (1 - p.discount / 100)).toLocaleString()}₫</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Star size={16} className="text-yellow-400" /> {p.rating} | Đã bán {p.sold}
                  </div>
                  <Button variant="outline" size="lg" className="mt-auto font-bold border-blue-200 text-[var(--primary,#1a3fa6)] hover:bg-blue-50 rounded-full">Xem chi tiết</Button>
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