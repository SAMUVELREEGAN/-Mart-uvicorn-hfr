import { useState } from 'react';
import { Icon } from '../../utils/iconResolver';
import './Carousel.css';

export default function Carousel({ images = [], alt = 'Gallery image' }) {
  const [current, setCurrent] = useState(0);
  if (!images.length) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="carousel">
      <div className="carousel__main">
        <img src={images[current]} alt={`${alt} ${current + 1}`} className="carousel__image" />
        {images.length > 1 && (
          <>
            <button type="button" className="carousel__nav carousel__nav--prev" onClick={prev} aria-label="Previous">
              <Icon name="FaChevronLeft" />
            </button>
            <button type="button" className="carousel__nav carousel__nav--next" onClick={next} aria-label="Next">
              <Icon name="FaChevronRight" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="carousel__thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              className={`carousel__thumb ${i === current ? 'carousel__thumb--active' : ''}`}
              onClick={() => setCurrent(i)}
            >
              <img src={img} alt={`${alt} thumb ${i + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
