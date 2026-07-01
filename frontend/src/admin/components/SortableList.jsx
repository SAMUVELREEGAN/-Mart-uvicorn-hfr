import { useState } from 'react';
import { FaGripVertical } from 'react-icons/fa';
import './SortableList.css';

export default function SortableList({ items, onReorder, renderItem, keyField = 'id' }) {
  const [dragIndex, setDragIndex] = useState(null);

  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setDragIndex(index);
    onReorder(next);
  };

  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="sortable-list">
      {items.map((item, index) => (
        <div
          key={item[keyField]}
          className={`sortable-list__item ${dragIndex === index ? 'sortable-list__item--dragging' : ''}`}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          <span className="sortable-list__handle" title="Drag to reorder" aria-label="Drag to reorder">
            <FaGripVertical />
          </span>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
