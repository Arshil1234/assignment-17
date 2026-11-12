'use client';

import React from 'react';
import { UserGroupIcon, BuildingIcon, SparklesIcon, CheckCircleIcon } from './Icons';
import { IStudent } from '@/types/student';

interface StatsOverviewProps {
  totalStudents: number;
  totalDepartments: number;
  latestStudent?: IStudent | null;
  isLoading: boolean;
}

export default function StatsOverview({
  totalStudents,
  totalDepartments,
  latestStudent,
  isLoading,
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Students Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Students
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <UserGroupIcon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          {isLoading ? (
            <div className="h-8 w-16 bg-slate-200 animate-pulse rounded"></div>
          ) : (
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {totalStudents}
            </div>
          )}
          <span className="text-xs text-slate-500">enrolled</span>
        </div>
        <p className="mt-2 text-xs text-slate-400">Total active records in database</p>
      </div>

      {/* Departments Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Departments
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <BuildingIcon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          {isLoading ? (
            <div className="h-8 w-12 bg-slate-200 animate-pulse rounded"></div>
          ) : (
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              {totalDepartments}
            </div>
          )}
          <span className="text-xs text-slate-500">academic disciplines</span>
        </div>
        <p className="mt-2 text-xs text-slate-400">Distinct departments offering courses</p>
      </div>

      {/* Latest Enrolled Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Latest Registration
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <SparklesIcon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          {isLoading ? (
            <div className="h-8 w-24 bg-slate-200 animate-pulse rounded"></div>
          ) : latestStudent ? (
            <div>
              <div className="text-base font-bold text-slate-900 truncate">
                {latestStudent.name}
              </div>
              <p className="text-xs text-slate-500 truncate">{latestStudent.department}</p>
            </div>
          ) : (
            <div className="text-sm font-medium text-slate-400 italic">None registered yet</div>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-400">Most recently added student</p>
      </div>

      {/* System Status Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            CRUD Status
          </span>
          <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
            <CheckCircleIcon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <div className="text-base font-bold tracking-tight text-emerald-600 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
            Operational
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-400">Next.js App Router API Handlers active</p>
      </div>
    </div>
  );
}
