import { Skeleton } from '../skeleton/Skeleton';
import './CategoryTemplates.css';
import './Template3CategoryChip.css';

export default function Template3Loading() {
  return (
    <div className="category-page category-page--template3 cat-tpl3-loading">
      <div className="cat-tpl3-loading__hero">
        <Skeleton height="100%" />
      </div>
      <div className="cat-tpl3-page">
        <section className="cat-tpl3-block">
          <Skeleton height={28} width="40%" className="cat-tpl3-loading__title" />
          <div className="cat-tpl3-chip-scroll">
            <div className="cat-tpl3-chip-grid cat-tpl3-chip-grid--categories">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} height={56} className="cat-tpl3-loading__chip" />
            ))}
            </div>
          </div>
        </section>
        <section className="cat-tpl3-block">
          <Skeleton height={28} width="35%" className="cat-tpl3-loading__title" />
          <div className="cat-tpl3-chip-scroll">
            <div className="cat-tpl3-chip-grid cat-tpl3-chip-grid--subcategories">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} height={56} className="cat-tpl3-loading__chip" />
            ))}
            </div>
          </div>
        </section>
        <section className="cat-tpl3-block">
          <Skeleton height={28} width="30%" className="cat-tpl3-loading__title" />
          <div className="cat-tpl3-service-list">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} height={180} className="cat-tpl3-loading__card" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
