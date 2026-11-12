'use client';

import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from './Icons';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastNotificationProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export default function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-200"
      role="alert"
      aria-live="assertive"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md ${
          isSuccess
            ? 'bg-emerald-50/95 border-emerald-200 text-emerald-950'
            : isError
            ? 'bg-rose-50/95 border-rose-200 text-rose-950'
            : 'bg-blue-50/95 border-blue-200 text-blue-950'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {isSuccess && <CheckCircleIcon className="w-5 h-5 text-emerald-600" />}
          {isError && <ExclamationTriangleIcon className="w-5 h-5 text-rose-600" />}
          {!isSuccess && !isError && <CheckCircleIcon className="w-5 h-5 text-blue-600" />}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
          <p className="text-xs mt-0.5 leading-relaxed opacity-90 break-words">{toast.message}</p>
        </div>

        <button
          onClick={onClose}
          type="button"
          aria-label="Close notification"
          className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
