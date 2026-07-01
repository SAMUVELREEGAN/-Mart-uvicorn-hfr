import { useCmsContent } from '../../contexts';
import { Icon } from '../../utils/iconResolver';
import { isUploadedMedia, resolveMediaUrl } from '../../utils/mediaUrl';
import './SubCategoryCard.css';

export default function SubCategoryCard({ subcategory, active, onClick, categoryType = 'product' }) {
  const categoriesData = useCmsContent('categories');
  const iconsConfig = categoriesData.categoryIcons || {};
  const themeColor = iconsConfig.themeColor || '#2563eb';
  const styleConfig = iconsConfig[categoryType] || iconsConfig.product || {};
  const shape = styleConfig.shape || (categoryType === 'service' ? 'circle' : 'box');
  const color = themeColor;
  const iconSize = iconsConfig.iconSize || styleConfig.iconSize || '2.5rem';
  const tabletIconSize = iconsConfig.tabletIconSize || styleConfig.tabletIconSize || '2.375rem';
  const mobileIconSize = iconsConfig.mobileIconSize || styleConfig.mobileIconSize || '2.25rem';
  const iconImageSize = iconsConfig.iconImageSize || styleConfig.iconImageSize || '3.25rem';
  const tabletIconImageSize = iconsConfig.tabletIconImageSize || styleConfig.tabletIconImageSize || '3rem';
  const mobileIconImageSize = iconsConfig.mobileIconImageSize || styleConfig.mobileIconImageSize || '2.875rem';
  const containerSize = styleConfig.containerSize || iconsConfig.containerSize || '80px';
  const mobileContainerSize = styleConfig.mobileContainerSize || '72px';

  return (
    <button
      type="button"
      className={`subcategory-card subcategory-card--${shape} ${active ? 'subcategory-card--active' : ''}`}
      onClick={onClick}
      style={{
        '--sub-color': color,
        '--sub-radius': styleConfig.borderRadius || (shape === 'circle' ? '50%' : '14px'),
        '--sub-size': containerSize,
        '--sub-size-mobile': mobileContainerSize,
        '--sub-icon-size': iconSize,
        '--sub-icon-size-tablet': tabletIconSize,
        '--sub-icon-size-mobile': mobileIconSize,
        '--sub-icon-img-size': iconImageSize,
        '--sub-icon-img-size-tablet': tabletIconImageSize,
        '--sub-icon-img-size-mobile': mobileIconImageSize,
        '--sub-min-width': styleConfig.minWidth || '96px',
        '--sub-name-max': styleConfig.nameMaxWidth || '88px',
        '--sub-name-max-mobile': styleConfig.mobileNameMaxWidth || '92px',
        '--sub-min-width-mobile': styleConfig.mobileMinWidth || '88px',
      }}
    >
      <div className="subcategory-card__icon-wrap">
        {isUploadedMedia(subcategory.icon) ? (
          <img src={resolveMediaUrl(subcategory.icon)} alt="" className="subcategory-card__icon-img" />
        ) : subcategory.icon ? (
          <Icon name={subcategory.icon} className="subcategory-card__icon" />
        ) : null}
      </div>
      <span className="subcategory-card__name">{subcategory.name}</span>
    </button>
  );
}
