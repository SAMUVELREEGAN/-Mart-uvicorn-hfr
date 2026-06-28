import { useState } from 'react';
import { Icon } from '../../utils/iconResolver';
import './BrandGallery.css';

function getYoutubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
}

export default function BrandGallery({ brand, labels }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = brand.photos || [];
  const videos = brand.youtubeLinks || [];
  const hasPhotos = photos.length > 0;
  const hasVideos = videos.length > 0;

  if (!hasPhotos && !hasVideos) return null;

  return (
    <section className="brand-gallery">
      {hasPhotos && (
        <div className="brand-gallery__main">
          <img src={photos[activePhoto]} alt="" className="brand-gallery__hero-img" />
          {photos.length > 1 && (
            <div className="brand-gallery__thumbs">
              {photos.map((photo, i) => (
                <button
                  key={photo}
                  type="button"
                  className={`brand-gallery__thumb ${i === activePhoto ? 'brand-gallery__thumb--active' : ''}`}
                  onClick={() => setActivePhoto(i)}
                >
                  <img src={photo} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {hasVideos && (
        <div className="brand-gallery__videos">
          <h3 className="brand-gallery__videos-title">
            <Icon name="FaYoutube" /> {labels.videosTab}
          </h3>
          <div className="brand-gallery__video-grid">
            {videos.map((url) => {
              const id = getYoutubeId(url);
              if (!id) return null;
              return (
                <div key={url} className="brand-gallery__video">
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title="Brand video"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
