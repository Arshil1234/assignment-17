'use client';

import React from 'react';
import { PlusIcon, ArrowPathIcon } from './Icons';

interface HeaderProps {
  onOpenAddModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  totalStudents: number;
}

export default function Header({
  onOpenAddModal,
  onRefresh,
  isRefreshing,
  totalStudents,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Student Management System
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              CRUD v1.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student registrations, academic departments, and enrollment records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            type="button"
            title="Refresh student records"
            aria-label="Refresh student records"
            className="inline-flex items-center justify-center p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 transition-colors shadow-xs"
          >
            <ArrowPathIcon
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`}
            />
          </button>

          <button
            onClick={onOpenAddModal}
            type="button"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm transition-all shadow-xs hover:shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>
    </header>
  );
}
