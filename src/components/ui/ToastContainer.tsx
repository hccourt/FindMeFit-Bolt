import React from 'react';
import { createPortal } from 'react-dom';
import { Toast } from './Toast';
import { useNotificationStore } from '../../lib/store';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotificationStore();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-in-right"
          style={{
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <Toast toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>,
    document.body
  );
};
