import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BannerSlide } from '@/types/bannerSlide';
export default function BannerCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, skipSnaps: false });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  
    // Sample banner slides - replace with your actual content
    const bannerSlides: BannerSlide[] = [
      {
        id: 1,
        imageUrl: '/banners/pet-food-promo.png', 
        title: 'Khuyến mãi thức ăn cho thú cưng',
        description: 'Giảm đến 30% cho tất cả các sản phẩm thức ăn cao cấp',
        ctaText: 'Mua ngay',
        ctaLink: '/promotions/pet-food',
        backgroundColor: '#EFFBF7',
      },
      {
        id: 2,
        imageUrl: '/banners/pet-grooming.png',
        title: 'Dịch vụ spa & làm đẹp',
        description: 'Đặt lịch ngay hôm nay để nhận ưu đãi 20%',
        ctaText: 'Đặt lịch',
        ctaLink: '/services/grooming',
        backgroundColor: '#FEF5F5',
      },
      {
        id: 3,
        imageUrl: '/banners/pet-toys.png',
        title: 'Đồ chơi thú cưng mới nhất',
        description: 'Mua 2 tặng 1 cho tất cả đồ chơi mới nhập',
        ctaText: 'Khám phá',
        ctaLink: '/products/toys',
        backgroundColor: '#F0F4FE',
      },
    ];
  
    const scrollPrev = useCallback(() => {
      if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);
  
    const scrollNext = useCallback(() => {
      if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);
  
    const scrollTo = useCallback(
      (index: number) => emblaApi && emblaApi.scrollTo(index),
      [emblaApi]
    );
  
    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);
  
    useEffect(() => {
      if (!emblaApi) return;
      
      onSelect();
      setScrollSnaps(emblaApi.scrollSnapList());
      emblaApi.on('select', onSelect);
      
      return () => {
        emblaApi.off('select', onSelect);
      };
    }, [emblaApi, onSelect]);
  
    return (
      <div className="relative max-w-7xl mx-auto my-6 px-4">
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex">
            {bannerSlides.map((slide) => (
              <div 
                key={slide.id} 
                className="flex-[0_0_100%] min-w-0 relative"
                style={{ backgroundColor: slide.backgroundColor }}
              >
                <div className="flex flex-row-reverse h-[320px]">
                  <div className="w-1/2 p-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title}
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="w-1/2 p-8 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-gray-700 mb-6">{slide.description}</p>
                    <Button asChild className="w-max">
                      <a href={slide.ctaLink}>{slide.ctaText}</a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Navigation arrows */}
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10"
          onClick={scrollNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
  
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === selectedIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }