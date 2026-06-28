import './Card.css';

export default function Card({ children, className = '', onClick, hoverable = false, padding = true }) {
  return (
    <div
      className={`card ${hoverable ? 'card--hoverable' : ''} ${padding ? 'card--padded' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    >
      {children}
    </div>
  );
}
