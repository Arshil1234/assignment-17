'use client';

import React, { useState, useEffect } from 'react';
import { IStudent, StudentFormData } from '@/types/student';
import { validateStudentInput } from '@/lib/validations';
import {
  XMarkIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  ArrowPathIcon,
} from './Icons';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: StudentFormData) => Promise<boolean>;
  studentToEdit: IStudent | null;
  isSubmitting: boolean;
}

const COMMON_DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electrical & Electronic Engineering',
  'Business Administration',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Mathematics & Statistics',
  'Biotechnology',
  'Economics',
];

export default function StudentFormModal({
  isOpen,
  onClose,
  onSubmit,
  studentToEdit,
  isSubmitting,
}: StudentFormModalProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    email: '',
    phone: '',
    department: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name || '',
        email: studentToEdit.email || '',
        phone: studentToEdit.phone || '',
        department: studentToEdit.department || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
      });
    }
    setErrors({});
    setTouched({});
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation if field was touched
    if (touched[name]) {
      const validation = validateStudentInput({ ...formData, [name]: value }, false);
      setErrors((prev) => ({
        ...prev,
        [name]: validation.errors[name] || '',
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateStudentInput(formData, false);
    setErrors((prev) => ({
      ...prev,
      [field]: validation.errors[field] || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      department: true,
    });

    const validation = validateStudentInput(formData, false);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-slate-900">
              {studentToEdit ? 'Edit Student Details' : 'Add New Student'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {studentToEdit
                ? 'Update student records in MongoDB'
                : 'Fill in the information to register a new student'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${
                  errors.name
                    ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MailIcon className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. john.doe@university.edu"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${
                  errors.email
                    ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <PhoneIcon className="w-4 h-4" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="e.g. +1 (555) 234-5678"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${
                  errors.phone
                    ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
          </div>

          {/* Department Field */}
          <div>
            <label htmlFor="department" className="block text-xs font-semibold text-slate-700 mb-1">
              Department <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <BuildingIcon className="w-4 h-4" />
              </div>
              <input
                id="department"
                name="department"
                type="text"
                list="department-suggestions"
                placeholder="Select or enter department"
                value={formData.department}
                onChange={handleChange}
                onBlur={() => handleBlur('department')}
                disabled={isSubmitting}
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border outline-none transition-colors ${
                  errors.department
                    ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                }`}
              />
              <datalist id="department-suggestions">
                {COMMON_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} />
                ))}
              </datalist>
            </div>
            {errors.department && (
              <p className="text-xs text-rose-600 mt-1">{errors.department}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              type="button"
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs hover:shadow transition-all disabled:opacity-50"
            >
              {isSubmitting && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
              <span>{studentToEdit ? 'Save Changes' : 'Add Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
