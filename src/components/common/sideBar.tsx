import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';

// You'll need to import or create these icons, or use an icon library
// These are placeholder imports - replace with your actual icons
import dogIcon from '@/assets/dog.png';
import catIcon from '@/assets/cat.png';
// import foodIcon from '@/assets/icons/pet-food.png';
// import toyIcon from '@/assets/icons/pet-toy.png';
// import medicalIcon from '@/assets/icons/medical.png';
// import groomIcon from '@/assets/icons/grooming.png';
// import accessoryIcon from '@/assets/icons/accessory.png';
// import cageIcon from '@/assets/icons/cage.png';
// import fishIcon from '@/assets/icons/fish.png';
// import birdIcon from '@/assets/icons/bird.png';

type CategoryType = {
  id: string;
  name: string;
  icon: string;
  link: string;
  subCategories?: {
    id: string;
    name: string;
    link: string;
  }[];
};

export default function Sidebar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories: CategoryType[] = [
    {
      id: 'dogs',
      name: 'Chó Cưng',
      icon:dogIcon,
      link: '/categories/dogs',
      subCategories: [
        { id: 'dog-food', name: 'Thức ăn cho chó', link: '/categories/dogs/food' },
        { id: 'dog-toys', name: 'Đồ chơi cho chó', link: '/categories/dogs/toys' },
        { id: 'dog-accessories', name: 'Phụ kiện cho chó', link: '/categories/dogs/accessories' },
      ]
    },
    {
      id: 'cats',
      name: 'Mèo Cưng',
      icon:dogIcon,
      link: '/categories/cats',
      subCategories: [
        { id: 'cat-food', name: 'Thức ăn cho mèo', link: '/categories/cats/food' },
        { id: 'cat-toys', name: 'Đồ chơi cho mèo', link: '/categories/cats/toys' },
        { id: 'cat-accessories', name: 'Phụ kiện cho mèo', link: '/categories/cats/accessories' },
      ]
    },
    {
      id: 'food',
      name: 'Thức Ăn Thú Cưng',
      icon: dogIcon,
      link: '/categories/food',
    },
    {
      id: 'toys',
      name: 'Đồ Chơi - Phụ Kiện',
      icon:dogIcon,
      link: '/categories/toys-accessories',
    },
    {
      id: 'medical',
      name: 'Thuốc & Sức Khỏe',
      icon: dogIcon,
      link: '/categories/medical-health',
    },
    {
      id: 'grooming',
      name: 'Làm Đẹp & Spa',
      icon: dogIcon,
      link: '/categories/grooming',
    },
    {
      id: 'accessories',
      name: 'Vòng Cổ & Dây Dắt',
      icon: dogIcon,
      link: '/categories/collars-leashes',
    },
    {
      id: 'houses',
      name: 'Chuồng - Nhà - Nệm',
      icon: dogIcon,
      link: '/categories/houses',
    },
    {
      id: 'fish',
      name: 'Cá & Thủy Sinh',
      icon: dogIcon,
      link: '/categories/fish',
    },
    {
      id: 'birds',
      name: 'Chim & Động Vật Nhỏ',
      icon: dogIcon,
      link: '/categories/birds',
    },
  ];

  // Handle mouse enter on a category
  const handleMouseEnter = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border w-full max-w-[260px]"
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 font-medium border-b">
        Danh mục
      </div>
      
      <ul className="py-2">
        {categories.map((category) => (
          <li 
            key={category.id}
            className="relative"
            onMouseEnter={() => handleMouseEnter(category.id)}
          >
            <Link
              to={category.link}
              className={`flex items-center px-4 py-2.5 gap-3 hover:bg-gray-50 group ${
                activeCategory === category.id ? 'text-blue-600 bg-blue-50' : ''
              }`}
            >
              <img 
                src={category.icon} 
                alt={category.name}
                className="w-7 h-7 object-contain"
              />
              <span className="text-sm">{category.name}</span>
              
              {category.subCategories && (
                <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${
                  activeCategory === category.id ? 'rotate-90 text-blue-600' : 'text-gray-400'
                }`} />
              )}
            </Link>
            
            {/* Subcategories flyout menu */}
            {category.subCategories && activeCategory === category.id && (
              <div 
                className="absolute top-0 left-[260px] bg-white shadow-md rounded-r-lg border w-64 z-50"
                style={{ minHeight: '100%' }}
              >
                <ul className="py-2">
                  {category.subCategories.map(subCat => (
                    <li key={subCat.id}>
                      <Link
                        to={subCat.link}
                        className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-blue-600"
                      >
                        {subCat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}