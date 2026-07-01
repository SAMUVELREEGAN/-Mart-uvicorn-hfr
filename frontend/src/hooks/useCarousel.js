import { useCmsContent } from '../contexts';
import { useState, useEffect } from 'react';

export function useCarouselMode(configKey) {
  const carouselConfig = useCmsContent('icons');
  const config = carouselConfig.carousels?.[configKey] || { carousel: false };
  const [isCarousel, setIsCarousel] = useState(false);

  useEffect(() => {
    if (!config.carousel) {
      setIsCarousel(false);
      return undefined;
    }

    const check = () => {
      if (config.responsiveOnly) {
        setIsCarousel(window.innerWidth < (config.breakpoint || 992));
      } else {
        setIsCarousel(true);
      }
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [config.carousel, config.responsiveOnly, config.breakpoint]);

  return { isCarousel, config };
}
