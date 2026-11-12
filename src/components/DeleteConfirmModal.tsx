'use client';

import React from 'react';
import { IStudent } from '@/types/student';
import { ExclamationTriangleIcon, ArrowPathIcon } from './Icons';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  student: IStudent | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  student,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen || !student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
              <ExclamationTriangleIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 id="delete-dialog-title" className="text-base font-bold text-slate-900">
                Delete Student Record
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-slate-800">"{student.name}"</span>? This
                record will be permanently removed from MongoDB. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="font-medium text-slate-700">{student.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Email:</span>
              <span className="font-medium text-slate-700 truncate max-w-[200px]">
                {student.email}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              type="button"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={isDeleting}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-xs hover:shadow transition-all disabled:opacity-50"
            >
              {isDeleting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
              <span>{isDeleting ? 'Deleting...' : 'Delete Student'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
