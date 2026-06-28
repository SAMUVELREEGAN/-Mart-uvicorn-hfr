import { Icon } from '../../utils/iconResolver';
import categoriesData from '../../json/categories.json';
import './SubCategoryCard.css';

export default function SubCategoryCard({ subcategory, active, onClick, categoryType = 'product' }) {
  const color = subcategory.color || '#2563eb';
  const styleConfig = categoriesData.categoryIcons?.[categoryType] || categoriesData.categoryIcons?.product || {};
  const shape = styleConfig.shape || (categoryType === 'service' ? 'circle' : 'box');

  return (
    <button
      type="button"
      className={`subcategory-card subcategory-card--${shape} ${active ? 'subcategory-card--active' : ''}`}
      onClick={onClick}
      style={{
        '--sub-color': color,
        '--sub-radius': styleConfig.borderRadius || (shape === 'circle' ? '50%' : '14px'),
        '--sub-size': styleConfig.containerSize || '72px',
        '--sub-size-mobile': styleConfig.mobileContainerSize || styleConfig.containerSize || '68px',
        '--sub-icon-size': styleConfig.iconSize || '1.4375rem',
        '--sub-min-width': styleConfig.minWidth || '96px',
        '--sub-name-max': styleConfig.nameMaxWidth || '88px',
        '--sub-name-max-mobile': styleConfig.mobileNameMaxWidth || '92px',
        '--sub-min-width-mobile': styleConfig.mobileMinWidth || '88px',
      }}
    >
      <div className="subcategory-card__icon-wrap">
        <Icon name={subcategory.icon} className="subcategory-card__icon" />
      </div>
      <span className="subcategory-card__name">{subcategory.name}</span>
    </button>
  );
}
