import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCmsContent } from '../../contexts';
import { Icon } from '../../utils/iconResolver';
import { formatPrice } from '../../utils/helpers';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import './Template3ServiceListing.css';

function formatTag(value) {
  if (!value) return '';
  return String(value)
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function phoneDigits(phone) {
  return String(phone || '').replace(/\D/g, '');
}

export default function Template3ServiceListing({ service }) {
  const cardConfig = useCmsContent('icons');
  const actions = cardConfig.serviceCard?.actions || {};
  const servicePath = `/services/${service.id}`;
  const images = [service.image, ...(service.gallery || [])].filter(Boolean).map(resolveMediaUrl);
  const [imageIndex, setImageIndex] = useState(0);
  const hasPrice = service.price != null && service.price !== '' && !Number.isNaN(Number(service.price));
  const phone = service.contactPhone;
  const whatsappHref = phone ? `https://wa.me/${phoneDigits(phone)}` : servicePath;
  const tags = [service.subcategory, service.serviceArea].filter(Boolean).map(formatTag);

  const prevImage = () => setImageIndex((i) => (i - 1 + images.length) % images.length);
  const nextImage = () => setImageIndex((i) => (i + 1) % images.length);

  return (
    <article className="tpl3-service">
      <div className="tpl3-service__media">
        <Link to={servicePath} tabIndex={-1} aria-hidden="true">
          <img src={images[imageIndex] || images[0]} alt="" loading="lazy" />
        </Link>
        {images.length > 1 && (
          <>
            <button type="button" className="tpl3-service__nav tpl3-service__nav--prev" onClick={prevImage} aria-label="Previous image">
              <Icon name="FaChevronLeft" />
            </button>
            <button type="button" className="tpl3-service__nav tpl3-service__nav--next" onClick={nextImage} aria-label="Next image">
              <Icon name="FaChevronRight" />
            </button>
          </>
        )}
      </div>

      <div className="tpl3-service__body">
        <div className="tpl3-service__head">
          <Link to={servicePath} className="tpl3-service__title-row">
            <Icon name="FaThumbsUp" className="tpl3-service__thumb" />
            <h3 className="tpl3-service__title">{service.name}</h3>
          </Link>
          <div className="tpl3-service__rating-row">
            {service.rating != null && (
              <span className="tpl3-service__rating-badge">
                {Number(service.rating).toFixed(1)}
                <Icon name="FaStar" />
              </span>
            )}
            {service.reviewCount != null && (
              <span className="tpl3-service__rating-count">{service.reviewCount} Ratings</span>
            )}
          </div>
        </div>

        {(service.location || service.city) && (
          <p className="tpl3-service__location">
            <Icon name="FaMapMarkerAlt" />
            <span>{service.location || service.city}</span>
          </p>
        )}

        {service.vendorName && (
          <p className="tpl3-service__vendor">
            <Icon name="FaStore" />
            <span>{service.vendorName}</span>
          </p>
        )}

        {tags.length > 0 && (
          <div className="tpl3-service__tags">
            {tags.map((tag) => (
              <span key={tag} className="tpl3-service__tag">{tag}</span>
            ))}
          </div>
        )}

        {hasPrice && (
          <p className="tpl3-service__price">{formatPrice(service.price)}</p>
        )}

        {service.description && (
          <p className="tpl3-service__desc">{service.description}</p>
        )}

        <div className="tpl3-service__actions">
          {phone && (
            <a href={`tel:${phone}`} className="tpl3-service__btn tpl3-service__btn--call">
              <Icon name="FaPhone" />
              <span>{phone}</span>
            </a>
          )}
          <a
            href={whatsappHref}
            className="tpl3-service__btn tpl3-service__btn--whatsapp"
            target={phone ? '_blank' : undefined}
            rel={phone ? 'noopener noreferrer' : undefined}
          >
            <Icon name="FaWhatsapp" />
            <span>WhatsApp</span>
          </a>
          <Link to={servicePath} className="tpl3-service__btn tpl3-service__btn--enquiry">
            <Icon name={actions.primary?.icon || 'FaCommentDots'} />
            <span>{actions.primary?.label || 'Send Enquiry'}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
