import { useState } from 'react';
import { Icon } from '../../utils/iconResolver';
import './FAQAccordion.css';

export default function FAQAccordion({ items, config = {} }) {
  const openIcon = config.openIcon || 'FaPlus';
  const closeIcon = config.closeIcon || 'FaMinus';
  const accentColor = config.accentColor || '#2563eb';
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const faqItems = items || config.items || [];

  return (
    <div className="faq-accordion" style={{ '--faq-accent': accentColor }}>
      {faqItems.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className={`faq-accordion__item ${isOpen ? 'faq-accordion__item--open' : ''}`}>
            <button
              type="button"
              className="faq-accordion__question"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
            >
              <span className="faq-accordion__question-text">{item.question}</span>
              <span className="faq-accordion__icon-wrap" aria-hidden="true">
                <Icon name={isOpen ? closeIcon : openIcon} className="faq-accordion__icon" />
              </span>
            </button>
            <div className={`faq-accordion__panel ${isOpen ? 'faq-accordion__panel--open' : ''}`}>
              <div className="faq-accordion__panel-inner">
                <p className="faq-accordion__answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
