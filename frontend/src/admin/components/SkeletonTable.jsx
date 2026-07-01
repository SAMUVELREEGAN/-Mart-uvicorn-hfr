export default function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div className="skeleton-table" aria-hidden="true">
      <div className="skeleton-table__header">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton skeleton--cell" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="skeleton-table__row">
          {Array.from({ length: cols }).map((_, col) => (
            <div key={col} className="skeleton skeleton--cell" />
          ))}
        </div>
      ))}
    </div>
  );
}
