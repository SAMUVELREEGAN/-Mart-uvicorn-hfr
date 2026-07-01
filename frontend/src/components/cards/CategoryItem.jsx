import { useCmsContent } from '../../contexts';
import { Link } from 'react-router-dom';
import { Icon } from '../../utils/iconResolver';
import { isUploadedMedia, resolveMediaUrl } from '../../utils/mediaUrl';
import './CategoryItem.css';

export default function CategoryItem({ category, onClick, to, type = 'product', active = false }) {
  const categoriesData = useCmsContent('categories');
  const iconsConfig = categoriesData.categoryIcons || {};
  const themeColor = iconsConfig.themeColor || '#2563eb';
  const isMore = category.id === 'more';
  const iconType = isMore ? 'more' : type;
  const styleConfig = iconsConfig[iconType] || iconsConfig.product || {};
  const shape = styleConfig.shape || (type === 'service' ? 'circle' : 'box');
  const color = isMore ? categoriesData.moreColor : themeColor;

  const borderColor = iconsConfig.borderColor || '#94a3b8';
  const borderWidth = iconsConfig.borderWidth || '1.5px';
  const containerBackground = iconsConfig.containerBackground || '#ffffff';
  const iconSize = iconsConfig.iconSize || styleConfig.iconSize || '2.5rem';
  const tabletIconSize = iconsConfig.tabletIconSize || styleConfig.tabletIconSize || '2.375rem';
  const mobileIconSize = iconsConfig.mobileIconSize || styleConfig.mobileIconSize || '2.25rem';
  const iconImageSize = iconsConfig.iconImageSize || styleConfig.iconImageSize || '3.25rem';
  const tabletIconImageSize = iconsConfig.tabletIconImageSize || styleConfig.tabletIconImageSize || '3rem';
  const mobileIconImageSize = iconsConfig.mobileIconImageSize || styleConfig.mobileIconImageSize || '2.875rem';
  const containerSize = styleConfig.containerSize || iconsConfig.containerSize || '80px';
  const mobileContainerSize = styleConfig.mobileContainerSize || '72px';

  const content = (
    <>
      <div
        className={`category-item__icon-wrap category-item__icon-wrap--${shape}`}
        style={{
          '--cat-color': color,
          '--cat-border-color': isMore ? undefined : borderColor,
          '--cat-border-width': isMore ? undefined : borderWidth,
          '--cat-radius': styleConfig.borderRadius || (shape === 'circle' ? '50%' : '14px'),
          '--cat-size': containerSize,
          '--cat-size-mobile': mobileContainerSize,
          '--cat-icon-size': iconSize,
          '--cat-icon-size-tablet': tabletIconSize,
          '--cat-icon-size-mobile': mobileIconSize,
          '--cat-icon-img-size': iconImageSize,
          '--cat-icon-img-size-tablet': tabletIconImageSize,
          '--cat-icon-img-size-mobile': mobileIconImageSize,
          '--cat-min-width': styleConfig.minWidth || '96px',
          '--cat-min-width-mobile': styleConfig.mobileMinWidth || '88px',
          '--cat-name-max': styleConfig.nameMaxWidth || '88px',
          '--cat-name-max-mobile': styleConfig.mobileNameMaxWidth || '92px',
          background: isMore ? undefined : containerBackground,
          color,
        }}
      >
        {isUploadedMedia(category.icon) ? (
          <img src={resolveMediaUrl(category.icon)} alt="" className="category-item__icon-img" />
        ) : category.icon ? (
          <Icon name={category.icon} className="category-item__icon" />
        ) : (
          <span className="category-item__icon-fallback" />
        )}
      </div>
      <span className="category-item__name">{category.name || category.title}</span>
    </>
  );

  const className = [
    'category-item',
    `category-item--${shape}`,
    isMore ? 'category-item--more' : '',
    active ? 'category-item--active' : '',
  ].filter(Boolean).join(' ');

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to || `/category/${category.id}`} className={className}>
      {content}
    </Link>
  );
}
