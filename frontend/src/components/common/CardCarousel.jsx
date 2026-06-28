import { useCarouselMode } from '../../hooks/useCarousel';
import './CardCarousel.css';

export default function CardCarousel({
  configKey,
  children,
  variant = 'products',
  className = '',
}) {
  const { isCarousel, config } = useCarouselMode(configKey);

  if (!isCarousel) {
    return (
      <div className={`card-carousel__grid card-carousel__grid--${variant} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`card-carousel card-carousel--${variant} ${config.hideScrollbar ? 'card-carousel--hide-scrollbar' : ''} ${config.snap ? 'card-carousel--snap' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
