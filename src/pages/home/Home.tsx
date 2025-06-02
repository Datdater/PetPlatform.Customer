import BannerCarousel from "@/components/common/bannerCarousel";
import Sidebar from "@/components/common/sideBar";
import NewestProducts from "@/components/features/products/NewestProduct";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const products = [
    {
        id: '1',
        title: 'Royal Canin Medium Adult - Thức ăn cho chó trưởng thành giống vừa',
        imageUrl: 'https://res.cloudinary.com/dyoboy5oj/image/upload/v1742227208/da-net8/fw5ncajn7lgtbnwoweca.png',
        price: 285000,
        originalPrice: 320000,
        discountPercentage: 10,
        rating: 4.5,
        reviewCount: 128,
        shopName: 'PetLover Official',
        shopVerified: true,
        freeShipping: true,
        isNew: false,
        isBestseller: true
    },
    // More products...
];

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Banner Carousel */}
                    <BannerCarousel />

                    {/* Main content area with sidebar */}
                    <div className="flex flex-col md:flex-row gap-6 mt-6">
                        {/* Sidebar */}
                        <aside className="w-full md:w-[260px] flex-shrink-0">
                            <Sidebar />
                        </aside>

                        {/* Main content */}
                        <div className="flex-grow">
                            {/* Featured products, categories, etc. will go here */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h2 className="text-xl font-semibold mb-4">Sản phẩm nổi bật</h2>
                                {/* Featured products grid would go here */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {/* Product cards would go here */}
                                    {/* {products.map(product => (
                                        <ProductCard key={product.id} {...product} />
                                    ))} */}
                                    <NewestProducts />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border">
                                <h2 className="text-xl font-semibold mb-4">Sản phẩm nổi bật</h2>
                                {/* Featured products grid would go here */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {/* Product cards would go here */}
                                    <div className="h-48 bg-gray-100 rounded-md"></div>
                                    <div className="h-48 bg-gray-100 rounded-md"></div>
                                    <div className="h-48 bg-gray-100 rounded-md"></div>
                                    <div className="h-48 bg-gray-100 rounded-md"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}