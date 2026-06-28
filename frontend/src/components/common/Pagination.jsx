import { Icon } from '../../utils/iconResolver';
import './Pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination__btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <Icon name="FaChevronLeft" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        className="pagination__btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <Icon name="FaChevronRight" />
      </button>
    </nav>
  );
}
