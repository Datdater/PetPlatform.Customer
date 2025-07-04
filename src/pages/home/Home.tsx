import BannerCarousel from "@/components/common/bannerCarousel";
import Sidebar from "@/components/common/sideBar";
import PetServiceCard from "@/components/features/petServices/PetServiceCard";
import NewestProducts from "@/components/features/products/NewestProduct";
import ProductCard from "@/components/features/products/productCard";
import FlashSaleCard from "@/components/features/products/FlashSaleCard";
import { getPetServices } from "@/services/petService.service";
import { getProducts, getProductsOnSale } from "@/services/product.service";
import { IPetServiceCard } from "@/types/petServices/IPetServiceCard";
import { IProduct } from "@/types/IProduct";
import { useEffect, useState } from "react";

export default function Home() {
    const [petServices, setPetServices] = useState<IPetServiceCard[]>([]);
    const [randomProducts, setRandomProducts] = useState<IProduct[]>([]);
    const [todaySuggestions, setTodaySuggestions] = useState<IProduct[]>([]);
    const [flashSaleProducts, setFlashSaleProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        const fetchPetServices = async () => {
            const res = await getPetServices();
            setPetServices(res.items);
        }
        fetchPetServices();
    }, []);

    useEffect(() => {
        const fetchRandomProducts = async () => {
            try {
                // Get a larger set of products and then randomize them
                const res = await getProducts(1, 20);
                if (res.items && res.items.length > 0) {
                    // Shuffle the products and take first 8
                    const shuffled = res.items.sort(() => 0.5 - Math.random());
                    setRandomProducts(shuffled.slice(0, 8));
                }
            } catch (error) {
                console.error('Error fetching random products:', error);
            }
        }
        fetchRandomProducts();
    }, []);

    useEffect(() => {
        const fetchTodaySuggestions = async () => {
            try {
                // Get products from page 2 to get different products than the first section
                const res = await getProducts(2, 16);
                if (res.items && res.items.length > 0) {
                    // Shuffle the products and take first 8
                    const shuffled = res.items.sort(() => 0.5 - Math.random());
                    setTodaySuggestions(shuffled.slice(0, 8));
                }
            } catch (error) {
                console.error('Error fetching today suggestions:', error);
            }
        }
        fetchTodaySuggestions();
    }, []);

    useEffect(() => {
        const fetchFlashSaleProducts = async () => {
            try {
                // Try to get products on sale first, fallback to regular products
                let products: IProduct[] = [];
                try {
                    products = await getProductsOnSale();
                } catch (error) {
                    // If on-sale endpoint doesn't exist, get regular products and simulate flash sale
                    const res = await getProducts(3, 12);
                    products = res.items || [];
                }
                
                if (products.length > 0) {
                    // Shuffle and take first 8 for flash sale
                    const shuffled = products.sort(() => 0.5 - Math.random());
                    setFlashSaleProducts(shuffled.slice(0, 8));
                }
            } catch (error) {
                console.error('Error fetching flash sale products:', error);
            }
        }
        fetchFlashSaleProducts();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-6">
                    {/* Banner Carousel */}
                    <BannerCarousel />

                    {/* Main content area with sidebar */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4 md:mt-6">
                        {/* Sidebar */}
                        <aside className="w-full md:w-[260px] flex-shrink-0 mb-4 md:mb-0">
                            <Sidebar />
                        </aside>

                        {/* Main content */}
                        <div className="flex-grow">
                            {/* Featured products, categories, etc. will go here */}
                            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border">
                                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Sản phẩm nổi bật</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                                    <NewestProducts />
                                </div>
                            </div>
                            {/* Dịch vụ nổi bật section */}
                            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border mt-2">
                                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Dịch vụ nổi bật</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                                    {petServices.map((service) => (
                                        <PetServiceCard key={service.id} {...service} />
                                    ))}
                                </div>
                            </div>
                            {/* Flash Sale section */}
                            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border mt-2">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        <span className="text-lg sm:text-xl font-extrabold text-[#ee4d2d] tracking-wide flex items-center">
                                            <span style={{ fontFamily: 'inherit', letterSpacing: '2px' }}>FLASH SALE</span>
                                        </span>
                                        <div className="flex items-center gap-1 ml-0 sm:ml-2">
                                            <span className="bg-black text-white rounded px-1.5 py-0.5 font-mono text-sm sm:text-base leading-none">02</span>
                                            <span className="text-black font-bold">:</span>
                                            <span className="bg-black text-white rounded px-1.5 py-0.5 font-mono text-sm sm:text-base leading-none">38</span>
                                            <span className="text-black font-bold">:</span>
                                            <span className="bg-black text-white rounded px-1.5 py-0.5 font-mono text-sm sm:text-base leading-none">52</span>
                                        </div>
                                    </div>
                                    <a href="#" className="text-[#ee4d2d] text-xs sm:text-sm font-semibold hover:underline whitespace-nowrap">Xem tất cả &gt;</a>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                                    {flashSaleProducts.map((product, index) => (
                                        <FlashSaleCard
                                            key={product.id}
                                            {...product}
                                            discountPercentage={20 + (index % 3) * 10}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* Có thể bạn sẽ thích section */}
                            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border mt-2">
                                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Có thể bạn sẽ thích</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                                    {randomProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id}
                                            title={product.name}
                                            imageUrl={product.productImage}
                                            price={product.price}
                                            rating={product.starAverage}
                                            reviewCount={product.reviewCount}
                                            shopName={product.storeName}
                                            numberSold={product.sold}
                                            storeId={product.storeId}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* Gợi ý hôm nay section */}
                            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border mt-2">
                                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Gợi ý hôm nay</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                                    {todaySuggestions.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            id={product.id}
                                            title={product.name}
                                            imageUrl={product.productImage}
                                            price={product.price}
                                            rating={product.starAverage}
                                            reviewCount={product.reviewCount}
                                            shopName={product.storeName}
                                            numberSold={product.sold}
                                            storeId={product.storeId}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}