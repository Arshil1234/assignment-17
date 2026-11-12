'use client';

import React from 'react';
import { AcademicCapIcon, UserGroupIcon, BuildingIcon, SparklesIcon } from './Icons';

interface SidebarProps {
  totalStudents: number;
  totalDepartments: number;
  dbStatus: 'connected' | 'error' | 'connecting';
}

export default function Sidebar({
  totalStudents,
  totalDepartments,
  dbStatus,
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between">
      <div>
        {/* Brand Logo & Title */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
            <AcademicCapIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-tight text-base leading-none">
              EduPortal
            </div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Student Admin
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Core Modules
            </div>
            <nav className="space-y-1">
              <a
                href="#students"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UserGroupIcon className="w-4 h-4 text-indigo-600" />
                  <span>Students Directory</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100/80 text-indigo-700 font-medium">
                  {totalStudents}
                </span>
              </a>

              <a
                href="#departments"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BuildingIcon className="w-4 h-4 text-slate-400" />
                  <span>Departments</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {totalDepartments}
                </span>
              </a>
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Technology Stack
            </div>
            <div className="px-3 py-2 space-y-2 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between">
                <span>Next.js App Router</span>
                <span className="text-emerald-600 font-mono font-medium">16.4</span>
              </div>
              <div className="flex items-center justify-between">
                <span>TypeScript</span>
                <span className="text-indigo-600 font-mono font-medium">5.x</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tailwind CSS</span>
                <span className="text-sky-600 font-mono font-medium">4.x</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Mongoose ORM</span>
                <span className="text-amber-600 font-mono font-medium">v8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Database Status */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700">MongoDB Database</span>
            <span className="flex h-2 w-2 relative">
              {dbStatus === 'connected' && (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              )}
              {dbStatus === 'connecting' && (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              )}
              {dbStatus === 'error' && (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              )}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {dbStatus === 'connected' && 'Online & synchronizing via Mongoose'}
            {dbStatus === 'connecting' && 'Testing database connection...'}
            {dbStatus === 'error' && 'Check MONGODB_URI connection'}
          </p>
        </div>
      </div>
    </aside>
  );
}
