import { Icon } from '../../utils/iconResolver';
import { resolveMediaUrl, isUploadedMedia } from '../../utils/mediaUrl';

export default function Template3CategoryChip({
  category,
  active = false,
  onClick,
  accentColor = '#2563eb',
}) {
  const color = category?.color || accentColor;
  const hasUploadedIcon = category?.icon && isUploadedMedia(category.icon);

  return (
    <button
      type="button"
      className={`tpl3-chip ${active ? 'tpl3-chip--active' : ''}`}
      onClick={onClick}
      style={{ '--tpl3-chip-accent': color }}
    >
      <span className="tpl3-chip__icon" aria-hidden="true">
        {hasUploadedIcon ? (
          <img src={resolveMediaUrl(category.icon)} alt="" />
        ) : category?.icon ? (
          <Icon name={category.icon} />
        ) : (
          <Icon name="FaThLarge" />
        )}
      </span>
      <span className="tpl3-chip__label">{category.name || category.title}</span>
    </button>
  );
}
