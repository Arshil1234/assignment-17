'use client';

import React, { useState, useMemo } from 'react';
import { IStudent } from '@/types/student';
import {
  SearchIcon,
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
  PlusIcon,
  MailIcon,
  PhoneIcon,
  AcademicCapIcon,
  XMarkIcon,
} from './Icons';

interface StudentTableProps {
  students: IStudent[];
  isLoading: boolean;
  onEdit: (student: IStudent) => void;
  onDelete: (student: IStudent) => void;
  onOpenAddModal: () => void;
}

// Deterministic color palette for student avatars
const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
];

function getInitials(name: string): string {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

export default function StudentTable({
  students,
  isLoading,
  onEdit,
  onDelete,
  onOpenAddModal,
}: StudentTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');

  // Distinct departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.department) set.add(s.department);
    });
    return Array.from(set).sort();
  }, [students]);

  // Filter students based on search and department
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        student.phone.toLowerCase().includes(q) ||
        student.department.toLowerCase().includes(q);

      const matchesDept =
        selectedDepartment === 'ALL' || student.department === selectedDepartment;

      return matchesSearch && matchesDept;
    });
  }, [students, searchQuery, selectedDepartment]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Controls Bar: Search & Filter */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, phone, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Department Filter & Count */}
        <div className="flex items-center gap-3">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
          >
            <option value="ALL">All Departments ({departments.length})</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-500 whitespace-nowrap font-medium hidden md:inline-block">
            Showing {filteredStudents.length} of {students.length}
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3.5 pl-6 pr-3">
                Student Name
              </th>
              <th scope="col" className="py-3.5 px-3">
                Email Address
              </th>
              <th scope="col" className="py-3.5 px-3">
                Phone Number
              </th>
              <th scope="col" className="py-3.5 px-3">
                Department
              </th>
              <th scope="col" className="py-3.5 px-3 hidden lg:table-cell">
                Enrolled
              </th>
              <th scope="col" className="py-3.5 pl-3 pr-6 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Loading State Skeleton */}
            {isLoading && (
              <>
                {[1, 2, 3, 4, 5].map((index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="py-4 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
                        <div className="space-y-1.5">
                          <div className="h-4 w-28 bg-slate-200 rounded"></div>
                          <div className="h-3 w-16 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="h-4 w-36 bg-slate-200 rounded"></div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="h-6 w-32 bg-slate-200 rounded-full"></div>
                    </td>
                    <td className="py-4 px-3 hidden lg:table-cell">
                      <div className="h-4 w-20 bg-slate-200 rounded"></div>
                    </td>
                    <td className="py-4 pl-3 pr-6 text-right">
                      <div className="inline-flex gap-2">
                        <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                        <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}

            {/* Empty State: No students at all in DB */}
            {!isLoading && students.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
                      <UserGroupIcon className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No students found</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs">
                      There are currently no student records in your MongoDB database. Start by
                      registering your first student.
                    </p>
                    <button
                      onClick={onOpenAddModal}
                      type="button"
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Add First Student</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Empty State: Filter produced no matches */}
            {!isLoading && students.length > 0 && filteredStudents.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="max-w-sm mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                      <SearchIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">No matching students</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      No records matched your search query "{searchQuery}".
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedDepartment('ALL');
                      }}
                      type="button"
                      className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Reset filters
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Data Rows */}
            {!isLoading &&
              filteredStudents.map((student) => {
                const colorClass = getAvatarColor(student.name);
                const initials = getInitials(student.name);

                return (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Name & Avatar */}
                    <td className="py-4 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${colorClass}`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 text-sm truncate">
                            {student.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">
                            ID: {student._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-3">
                      <a
                        href={`mailto:${student.email}`}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 transition-colors group-hover:text-slate-900"
                        title={student.email}
                      >
                        <MailIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{student.email}</span>
                      </a>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-3">
                      <a
                        href={`tel:${student.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        <PhoneIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-xs">{student.phone}</span>
                      </a>
                    </td>

                    {/* Department Badge */}
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/80">
                        <AcademicCapIcon className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate max-w-[180px]">{student.department}</span>
                      </span>
                    </td>

                    {/* Enrolled Date */}
                    <td className="py-4 px-3 text-xs text-slate-500 whitespace-nowrap hidden lg:table-cell">
                      {formatDate(student.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onEdit(student)}
                          type="button"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit student"
                          aria-label={`Edit ${student.name}`}
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDelete(student)}
                          type="button"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete student"
                          aria-label={`Delete ${student.name}`}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      {!isLoading && students.length > 0 && (
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total: <strong>{students.length}</strong> registered students
          </span>
          <span className="text-slate-400">All data fetched in real-time from MongoDB</span>
        </div>
      )}
    </div>
  );
}
