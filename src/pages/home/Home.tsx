import BannerCarousel from "@/components/common/bannerCarousel";
import Sidebar from "@/components/common/sideBar";
import PetServiceCard from "@/components/features/petServices/PetServiceCard";
import NewestProducts from "@/components/features/products/NewestProduct";
import { getPetServices } from "@/services/petService.service";
import { IPetServiceCard } from "@/types/petServices/IPetServiceCard";
import { use, useEffect, useState } from "react";




export default function Home() {
    const [petServices, setPetServices] = useState<IPetServiceCard[]>([]);
    useEffect(() => {
        const fetchPetServices = async () => {
            const res = await getPetServices();
            setPetServices(res.items);
        }
        fetchPetServices();
    }, []);
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
                                <h2 className="text-xl font-semibold mb-4">Dịch vụ nổi bật</h2>
                                {/* Featured products grid would go here */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {/* Product cards would go here */}
                                    {petServices.map((service) => (
                                        <PetServiceCard key={service.id} {...service} />
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