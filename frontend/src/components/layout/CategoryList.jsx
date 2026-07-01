import { useCmsContent } from '../../contexts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../contexts/CategoryContext';
import CategoryItem from '../cards/CategoryItem';
import CardCarousel from '../common/CardCarousel';
import Sidebar from '../common/Sidebar';
import { Icon } from '../../utils/iconResolver';
import './CategoryList.css';

export default function CategoryList({ categories, type = 'product' }) {
  const sidebarConfig = useCmsContent('sidebar');
  const categoriesData = useCmsContent('categories');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { moreLabel, moreIcon, moreColor, productCategories, serviceCategories } = useCategories();
  const navigate = useNavigate();
  const iconsConfig = categoriesData.categoryIcons || {};
  const gapStyle = {
    '--category-grid-gap': iconsConfig.gridGap || '1.5rem',
    '--category-grid-gap-mobile': iconsConfig.mobileGridGap || '1.25rem',
  };

  const handleCategoryClick = (cat) => {
    navigate(`/category/${cat.id}?type=${type}`);
  };

  return (
    <>
      <CardCarousel configKey="categories" variant="categories" style={gapStyle}>
        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            category={cat}
            type={type}
            onClick={() => handleCategoryClick(cat)}
          />
        ))}
        <CategoryItem
          category={{ id: 'more', name: moreLabel, icon: moreIcon, color: moreColor }}
          type={type}
          onClick={() => setSidebarOpen(true)}
        />
      </CardCarousel>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={sidebarConfig.title}
      >
        <div className="category-sidebar">
          <h3 className="category-sidebar__section">
            <Icon name={sidebarConfig.productSection.icon} />
            {sidebarConfig.productSection.title}
          </h3>
          <div className="category-sidebar__grid" style={gapStyle}>
            {productCategories.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                type="product"
                onClick={() => { handleCategoryClick(cat); setSidebarOpen(false); }}
              />
            ))}
          </div>
          <h3 className="category-sidebar__section">
            <Icon name={sidebarConfig.serviceSection.icon} />
            {sidebarConfig.serviceSection.title}
          </h3>
          <div className="category-sidebar__grid" style={gapStyle}>
            {serviceCategories.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                type="service"
                onClick={() => { navigate(`/category/${cat.id}?type=service`); setSidebarOpen(false); }}
              />
            ))}
          </div>
        </div>
      </Sidebar>
    </>
  );
}
