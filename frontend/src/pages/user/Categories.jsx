import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import catalogData from '../../json/catalog.json';
import { useCategories } from '../../contexts/CategoryContext';
import { Icon } from '../../utils/iconResolver';
import CategoryItem from '../../components/cards/CategoryItem';
import SubCategoryCard from '../../components/cards/SubCategoryCard';
import EmptyState from '../../components/common/EmptyState';
import './Categories.css';

export default function Categories() {
  const config = catalogData.categoriesPage;
  const { productCategories, serviceCategories, getSubcategories } = useCategories();
  const navigate = useNavigate();

  const [activeType, setActiveType] = useState(config.productTab.key);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    productCategories[0]?.id || null
  );

  const categories = activeType === config.serviceTab.key
    ? serviceCategories
    : productCategories;

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
    || categories[0];
  const subcategories = selectedCategory ? getSubcategories(selectedCategory.id) : [];

  const handleTypeChange = (type) => {
    setActiveType(type);
    const list = type === config.serviceTab.key ? serviceCategories : productCategories;
    setSelectedCategoryId(list[0]?.id || null);
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategoryId(catId);
  };

  const catalogPath = activeType === config.serviceTab.key ? '/services' : '/products';

  const handleViewAll = () => {
    if (!selectedCategory) return;
    navigate(`${catalogPath}?category=${selectedCategory.id}`);
  };

  const handleSubcategoryClick = (subId) => {
    if (!selectedCategory) return;
    navigate(`${catalogPath}?category=${selectedCategory.id}&subcategory=${subId}`);
  };

  return (
    <div className="categories-page">
      <h1 className="categories-page__title">{config.title}</h1>

      <div className="categories-page__tabs" role="tablist">
        {[config.productTab, config.serviceTab].map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeType === tab.key}
            className={`categories-page__tab ${activeType === tab.key ? 'categories-page__tab--active' : ''}`}
            onClick={() => handleTypeChange(tab.key)}
          >
            <Icon name={tab.icon} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="categories-page__layout">
        <aside className="categories-page__main-panel">
          <h2 className="categories-page__panel-title">{config.mainPanelTitle}</h2>
          <div className="categories-page__main-list">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`categories-page__main-item ${selectedCategoryId === cat.id ? 'categories-page__main-item--active' : ''}`}
              >
                <CategoryItem
                  category={cat}
                  type={activeType}
                  active={selectedCategoryId === cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                />
              </div>
            ))}
          </div>
        </aside>

        <section className="categories-page__sub-panel">
          <div className="categories-page__sub-header">
            <h2 className="categories-page__panel-title">
              {config.subPanelTitle}
              {selectedCategory && (
                <span className="categories-page__panel-subtitle">{selectedCategory.name}</span>
              )}
            </h2>
            {selectedCategory && (
              <button
                type="button"
                className="categories-page__view-all"
                onClick={handleViewAll}
              >
                {config.viewAllLabel}
                <Icon name={config.viewAllIcon} />
              </button>
            )}
          </div>

          {subcategories.length === 0 ? (
            <EmptyState
              config={{
                icon: 'FaThLarge',
                title: config.emptySubcategories,
                message: '',
              }}
            />
          ) : (
            <div className="categories-page__sub-grid">
              {subcategories.map((sub) => (
                <SubCategoryCard
                  key={sub.id}
                  subcategory={sub}
                  categoryType={activeType}
                  onClick={() => handleSubcategoryClick(sub.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
