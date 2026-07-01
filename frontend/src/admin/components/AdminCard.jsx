export default function AdminCard({ children, className = '', padding = true }) {
  return (
    <div className={`adm-card ${padding ? 'adm-card--padded' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}
