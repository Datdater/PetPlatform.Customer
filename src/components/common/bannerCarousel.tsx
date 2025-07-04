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
        imageUrl: 'https://img.freepik.com/free-vector/gradient-national-pet-day-horizontal-sale-banner-template_23-2151341114.jpg?t=st=1748919021~exp=1748922621~hmac=f9ef337f7963941ebfcb0ac2098840ca2450aabc86163853189e99833f406210&w=1380', 
        title: 'Khuyến mãi thức ăn cho thú cưng',
        description: 'Giảm đến 30% cho tất cả các sản phẩm thức ăn cao cấp',
        ctaText: 'Mua ngay',
        ctaLink: '/promotions/pet-food',
        backgroundColor: '#EFFBF7',
      },
      {
        id: 2,
        imageUrl: 'https://img.freepik.com/free-vector/veterinary-clinic-social-media-promo-template_23-2149713982.jpg?t=st=1748919116~exp=1748922716~hmac=d7cba50b6f238477e10d6123316178c95da1a31e6755ea07659f89cf6c2680eb&w=1380',
        title: 'Dịch vụ spa & làm đẹp',
        description: 'Đặt lịch ngay hôm nay để nhận ưu đãi 20%',
        ctaText: 'Đặt lịch',
        ctaLink: '/services/grooming',
        backgroundColor: '#FEF5F5',
      },
      {
        id: 3,
        imageUrl: 'https://img.freepik.com/free-vector/pet-sitting-service-hand-drawn-social-media-cover-template_23-2149650423.jpg?t=st=1748919170~exp=1748922770~hmac=152c5d3c4664322691d338efd9f1fff48c07ff157323e58c5fd498b1ff15a002&w=1380',
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
      <div className="relative max-w-7xl mx-auto my-4 px-1 sm:px-4">
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
          <div className="flex">
            {bannerSlides.map((slide) => (
              <div 
                key={slide.id} 
                className="flex-[0_0_100%] min-w-0 relative"
                style={{ backgroundColor: slide.backgroundColor }}
              >
                <div className="flex flex-col-reverse md:flex-row-reverse h-40 sm:h-56 md:h-72">
                  <div className="w-full md:w-1/2 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title}
                      className="max-h-full object-contain w-full h-28 sm:h-40 md:h-64"
                    />
                  </div>
                  <div className="w-full md:w-1/2 p-3 sm:p-8 flex flex-col justify-center items-center text-center md:items-start md:text-left">
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">{slide.title}</h2>
                    <p className="text-gray-700 mb-3 sm:mb-6 text-sm sm:text-base">{slide.description}</p>
                    <Button asChild className="w-max text-xs sm:text-base">
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
          className="absolute top-1/2 left-2 sm:left-6 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10 p-1 sm:p-2"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-1/2 right-2 sm:right-6 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10 p-1 sm:p-2"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-2 sm:mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-colors ${
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