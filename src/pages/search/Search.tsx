'use client'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/features/products/productCard';
import { getProducts } from '@/services/product.service';
import { IProduct } from '@/types/IProduct';
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

  // Data state
  const [products, setProducts] = useState<IProduct[]>([]);
  const [total, setTotal] = useState(0);
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
        setTotal(res.totalCount || 0);
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [searchTerm, categoryId, minPrice, maxPrice, minRating, inStock, sortBy, sortDescending, pageIndex, pageSize]);

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

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
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
          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-red-500 text-lg">{error}</div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-gray-500 text-lg">No products found matching your criteria.</div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
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
                    />
                  ))}
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
                    Page {pageIndex} of {Math.ceil(total / pageSize) || 1}
                  </span>
                  <Button 
                    variant="outline"
                    disabled={pageIndex >= Math.ceil(total / pageSize)} 
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
  );
}
