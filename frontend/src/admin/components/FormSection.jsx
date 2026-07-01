import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function FormSection({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="adm-form-section">
      <div className="adm-form-section__header">
        <div>
          <h3 className="adm-form-section__title">{title}</h3>
          {description && <p className="adm-form-section__desc">{description}</p>}
        </div>
        {collapsible && (
          <button
            type="button"
            className="adm-form-section__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>
      {(!collapsible || open) && (
        <div className="adm-form-section__body">{children}</div>
      )}
    </section>
  );
}
