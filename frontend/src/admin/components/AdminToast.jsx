import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import './AdminToast.css';

export default function AdminToast({ toasts, onDismiss }) {
  useEffect(() => {
    const timers = toasts.map((t) => {
      if (t.duration === 0) return null;
      return setTimeout(() => onDismiss(t.id), t.duration ?? 4000);
    });
    return () => timers.forEach((timer) => timer && clearTimeout(timer));
  }, [toasts, onDismiss]);

  if (!toasts.length) return null;

  return (
    <div className="adm-toast-stack" role="status">
      {toasts.map((toast) => (
        <div key={toast.id} className={`adm-toast adm-toast--${toast.type}`}>
          <span className="adm-toast__icon">
            {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          </span>
          <span className="adm-toast__message">{toast.message}</span>
          <button type="button" className="adm-toast__close" onClick={() => onDismiss(toast.id)} aria-label="Dismiss">
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
}

export function useAdminToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const push = (message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  };

  return {
    toasts,
    push,
    dismiss,
    success: (msg) => push(msg, 'success'),
    error: (msg) => push(msg, 'error'),
  };
}
