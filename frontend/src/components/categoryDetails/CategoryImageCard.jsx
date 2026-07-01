import { Icon } from '../../utils/iconResolver';
import { resolveMediaUrl, isUploadedMedia } from '../../utils/mediaUrl';

function resolveCardImage(category) {
  if (category?.bannerImage) return resolveMediaUrl(category.bannerImage);
  if (category?.image && (category.image.startsWith('http') || category.image.startsWith('/'))) {
    return resolveMediaUrl(category.image);
  }
  if (category?.icon && isUploadedMedia(category.icon)) return resolveMediaUrl(category.icon);
  return null;
}

export default function CategoryImageCard({ category, active = false, onClick, accentColor = '#2563eb' }) {
  const imageSrc = resolveCardImage(category);
  const color = category?.color || accentColor;

  return (
    <button
      type="button"
      className={`cat-tpl2-img-card ${active ? 'cat-tpl2-img-card--active' : ''}`}
      onClick={onClick}
      style={{ '--cat-tpl2-accent': color }}
    >
      <div className="cat-tpl2-img-card__frame">
        {imageSrc ? (
          <img src={imageSrc} alt="" className="cat-tpl2-img-card__photo" loading="lazy" />
        ) : category?.icon ? (
          <div className="cat-tpl2-img-card__icon-fallback">
            <Icon name={category.icon} />
          </div>
        ) : (
          <div className="cat-tpl2-img-card__icon-fallback cat-tpl2-img-card__icon-fallback--empty" />
        )}
      </div>
      <span className="cat-tpl2-img-card__label">{category.name || category.title}</span>
    </button>
  );
}
