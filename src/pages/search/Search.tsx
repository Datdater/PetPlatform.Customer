'use client'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/features/products/productCard';
import PetServiceCard from '@/components/features/petServices/PetServiceCard';
import { getProducts } from '@/services/product.service';
import { getPetServices } from '@/services/petService.service';
import { IProduct } from '@/types/IProduct';
import { IPetServiceCard } from '@/types/petServices/IPetServiceCard';
import { Button } from '@/components/ui/button';
import { categoryService, ICategory } from '@/services/category.service';
import { locationService, IProvince } from '@/services/location.service';

// Helper to get query params from URL
function useQueryParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function Search() {
  const query = useQueryParams();
  const navigate = useNavigate();

  // Active tab state
  const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');

  // Filters from URL
  const [searchTerm] = useState(query.get('searchTerm') || '');
  const [categoryId, setCategoryId] = useState(query.get('categoryId') || '');
  const [minPrice] = useState(query.get('minPrice') || '');
  const [maxPrice] = useState(query.get('maxPrice') || '');
  const [minRating] = useState(query.get('minRating') || '');
  const [inStock] = useState(query.get('inStock') || '');
  const [sortBy, setSortBy] = useState(query.get('sortBy') || '');
  const [sortDescending, ] = useState(query.get('sortDescending') || '');
  const [pageIndex, setPageIndex] = useState(Number(query.get('pageIndex')) || 1);
  const [pageSize] = useState(Number(query.get('pageSize')) || 12);

  // Data state for products
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsTotal, setProductsTotal] = useState(0);
  
  // Data state for services
  const [services, setServices] = useState<IPetServiceCard[]>([]);
  const [servicesTotal, setServicesTotal] = useState(0);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock filter data
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [showAllProvinces, setShowAllProvinces] = useState(false);

  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await categoryService.getAll();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await locationService.getProvinces();
      setProvinces(data);
    };
    fetchProvinces();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('searchTerm', searchTerm);
    if (categoryId) params.set('categoryId', categoryId);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRating) params.set('minRating', minRating);
    if (inStock) params.set('inStock', inStock);
    if (sortBy) params.set('sortBy', sortBy);
    if (sortDescending) params.set('sortDescending', sortDescending);
    params.set('pageIndex', String(pageIndex));
    params.set('pageSize', String(pageSize));
    navigate({ search: params.toString() }, { replace: true });
    // eslint-disable-next-line
  }, [searchTerm, categoryId, minPrice, maxPrice, minRating, inStock, sortBy, sortDescending, pageIndex, pageSize]);

  // Fetch products when filters change
  useEffect(() => {
    if (activeTab === 'products') {
      setLoading(true);
      setError(null);
      getProducts(pageIndex, pageSize, {
        searchTerm,
        categoryId,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minRating: minRating ? Number(minRating) : undefined,
        inStock: inStock ? inStock === 'true' : undefined,
        sortBy: sortBy as any,
        sortDescending: sortDescending ? sortDescending === 'true' : undefined,
      })
        .then((res) => {
          setProducts(res.items || []);
          setProductsTotal(res.totalCount || 0);
        })
        .catch(() => setError('Failed to load products'))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [activeTab, searchTerm, categoryId, minPrice, maxPrice, minRating, inStock, sortBy, sortDescending, pageIndex, pageSize]);

  // Fetch services when filters change
  useEffect(() => {
    if (activeTab === 'services') {
      setLoading(true);
      setError(null);
      getPetServices(pageIndex, pageSize, {
        searchTerm,
        categoryId,
      })
        .then((res) => {
          setServices(res.items || []);
          setServicesTotal(res.totalCount || 0);
        })
        .catch(() => setError('Failed to load services'))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [activeTab, searchTerm, categoryId, pageIndex, pageSize]);

  // Handlers for filters

  // Handlers for checkboxes
  const handleCheckbox = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    setSelected(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
  };

  // Handler for Apply button (implement actual filter logic as needed)
  const handleApplyFilters = () => {
    // You can update your product query here based on selected filters
    setCategoryId(selectedCategories.join(','));
    setPageIndex(1);
  };

  // Handler for tab change
  const handleTabChange = (tab: 'products' | 'services') => {
    setActiveTab(tab);
    setPageIndex(1);
  };

  const currentTotal = activeTab === 'products' ? productsTotal : servicesTotal;
  const currentItems = activeTab === 'products' ? products : services;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Filter Bar */}
        <div className=" px-6 py-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-between ">
          <div className="flex items-center gap-4 flex-1">
            {/* Star Rating Filter (uncomment if needed) */}
            {/* ... */}
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="text-gray-500 text-sm font-medium">Sắp xếp</span>
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setPageIndex(1); }}
              className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popularity">Phổ biến</option>
              <option value="price">Giá</option>
              <option value="rating">Đánh giá</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center border-b border-gray-200 mb-6">
          <div className="flex">
            <button
              onClick={() => handleTabChange('products')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sản phẩm ({productsTotal})
            </button>
            <button
              onClick={() => handleTabChange('services')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Dịch vụ ({servicesTotal})
            </button>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex justify-center">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl w-full">
            <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 sticky top-8">
              <div className="mb-4 flex items-center gap-2 text-gray-700 font-semibold text-base">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18m-16.5 6h15m-13.5 6h12" /></svg>
                BỘ LỌC TÌM KIẾM
              </div>
              {/* Category */}
              <div className="mb-4">
                <div className="font-medium text-gray-700 text-sm mb-2">Theo Danh Mục</div>
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 mb-1 text-gray-700 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCheckbox(cat.id, selectedCategories, setSelectedCategories)}
                      className="accent-orange-500"
                    />
                    {cat.name} 
                  </label>
                ))}
                <div className="text-xs text-blue-500 cursor-pointer mt-1">Thêm <span className="inline-block">▼</span></div>
              </div>
              <hr className="my-3" />
              {/* Location */}
              <div className="mb-4">
                <div className="font-medium text-gray-700 text-sm mb-2">Nơi Bán</div>
                {(showAllProvinces ? provinces : provinces.slice(0, 4)).map(province => (
                  <label key={province.id} className="flex items-center gap-2 mb-1 text-gray-700 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(province.name)}
                      onChange={() => handleCheckbox(province.name, selectedLocations, setSelectedLocations)}
                      className="accent-orange-500"
                    />
                    {province.name}
                  </label>
                ))}
                {provinces.length > 4 && (
                  <div
                    className="text-xs text-blue-500 cursor-pointer mt-1 select-none"
                    onClick={() => setShowAllProvinces(v => !v)}
                  >
                    {showAllProvinces ? 'Ẩn bớt' : 'Thêm'} <span className="inline-block">{showAllProvinces ? '▲' : '▼'}</span>
                  </div>
                )}
              </div>
              <hr className="my-3" />
              {/* Shipping */}
              {/* <div className="mb-4">
                <div className="font-medium text-gray-700 text-sm mb-2">Đơn Vị Vận Chuyển</div>
                {shippings.map(ship => (
                  <label key={ship} className="flex items-center gap-2 mb-1 text-gray-700 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedShippings.includes(ship)}
                      onChange={() => handleCheckbox(ship, selectedShippings, setSelectedShippings)}
                      className="accent-orange-500"
                    />
                    {ship}
                  </label>
                ))}
              </div> */}
              {/* <hr className="my-3" /> */}
              {/* Brand */}
              {/* <div className="mb-4">
                <div className="font-medium text-gray-700 text-sm mb-2">Thương Hiệu</div>
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 mb-1 text-gray-700 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleCheckbox(brand, selectedBrands, setSelectedBrands)}
                      className="accent-orange-500"
                    />
                    {brand}
                  </label>
                ))}
                <div className="text-xs text-blue-500 cursor-pointer mt-1">Thêm <span className="inline-block">▼</span></div>
              </div> */}
              {/* <hr className="my-3" /> */}
              {/* Price Range */}
              <div className="mb-4">
                <div className="font-medium text-gray-700 text-sm mb-2">Khoảng Giá</div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="₫ TỪ"
                    value={priceFrom}
                    onChange={e => setPriceFrom(e.target.value)}
                    className="w-1/2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="number"
                    placeholder="₫ ĐẾN"
                    value={priceTo}
                    onChange={e => setPriceTo(e.target.value)}
                    className="w-1/2 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <Button type="submit" className="h-10" onClick={handleApplyFilters}>
                  <span>ÁP DỤNG</span>
                </Button>
              </div>
            </div>
          </aside>
          {/* Product/Service Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-red-500 text-lg">{error}</div>
              </div>
            ) : currentItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-500 text-lg">No {activeTab === 'products' ? 'products' : 'services'} found matching your criteria.</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {activeTab === 'products' ? (
                    products.map(product => (
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
                    ))
                  ) : (
                    services.map(service => (
                      <PetServiceCard
                        key={service.id}
                        {...service}
                      />
                    ))
                  )}
                </div>
                {/* Pagination */}
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button 
                    variant="outline"
                    disabled={pageIndex === 1} 
                    onClick={() => setPageIndex(pageIndex - 1)}
                    className="px-6"
                  >
                    Previous
                  </Button>
                  <span className="text-gray-600">
                    Page {pageIndex} of {Math.ceil(currentTotal / pageSize) || 1}
                  </span>
                  <Button 
                    variant="outline"
                    disabled={pageIndex >= Math.ceil(currentTotal / pageSize)} 
                    onClick={() => setPageIndex(pageIndex + 1)}
                    className="px-6"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar Filters */}
          
          </div>
        </div>
      </div>
    </div>
  );
}
