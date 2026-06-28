import { Link } from 'react-router-dom';
import { Icon } from '../../utils/iconResolver';
import categoriesData from '../../json/categories.json';
import './CategoryItem.css';

export default function CategoryItem({ category, onClick, to, type = 'product' }) {
  const color = category.color || categoriesData.moreColor;
  const isMore = category.id === 'more';
  const iconType = isMore ? 'more' : type;
  const styleConfig = categoriesData.categoryIcons?.[iconType] || categoriesData.categoryIcons?.product || {};
  const shape = styleConfig.shape || (type === 'service' ? 'circle' : 'box');

  const content = (
    <>
      <div
        className={`category-item__icon-wrap category-item__icon-wrap--${shape}`}
        style={{
          '--cat-color': color,
          '--cat-radius': styleConfig.borderRadius || (shape === 'circle' ? '50%' : '14px'),
          '--cat-size': styleConfig.containerSize || '72px',
          '--cat-size-mobile': styleConfig.mobileContainerSize || styleConfig.containerSize || '68px',
          '--cat-icon-size': styleConfig.iconSize || '1.5rem',
          '--cat-icon-size-circle': styleConfig.iconSize || '1.4375rem',
          '--cat-icon-scale-mobile': styleConfig.mobileIconScale || '1.12',
          '--cat-min-width': styleConfig.minWidth || '96px',
          '--cat-min-width-mobile': styleConfig.mobileMinWidth || '88px',
          '--cat-name-max': styleConfig.nameMaxWidth || '88px',
          '--cat-name-max-mobile': styleConfig.mobileNameMaxWidth || '92px',
          background: `linear-gradient(145deg, ${color}18, ${color}06)`,
          color,
        }}
      >
        <Icon name={category.icon} className="category-item__icon" />
      </div>
      <span className="category-item__name">{category.name || category.title}</span>
    </>
  );

  const className = [
    'category-item',
    `category-item--${shape}`,
    isMore ? 'category-item--more' : '',
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
