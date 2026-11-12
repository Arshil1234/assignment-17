'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import StatsOverview from '@/components/StatsOverview';
import StudentTable from '@/components/StudentTable';
import StudentFormModal from '@/components/StudentFormModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import ToastNotification, { ToastMessage } from '@/components/ToastNotification';
import { IStudent, StudentFormData, ApiResponse } from '@/types/student';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@/components/Icons';

export default function DashboardPage() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [studentToEdit, setStudentToEdit] = useState<IStudent | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<IStudent | null>(null);

  // Toast feedback state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Database connectivity status
  const [dbStatus, setDbStatus] = useState<'connected' | 'error' | 'connecting'>('connecting');
  const [dbErrorMessage, setDbErrorMessage] = useState<string | null>(null);

  const showToast = useCallback(
    (type: 'success' | 'error' | 'info', title: string, message: string) => {
      setToast({
        id: Date.now().toString(),
        type,
        title,
        message,
      });
    },
    []
  );

  /**
   * Fetch all students from API: GET /api/students
   */
  const fetchStudents = useCallback(
    async (isManualRefresh: boolean = false) => {
      if (isManualRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const res = await fetch('/api/students', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        const data: ApiResponse<IStudent[]> = await res.json();

        if (res.ok && data.success && Array.isArray(data.data)) {
          setStudents(data.data);
          setDbStatus('connected');
          setDbErrorMessage(null);
          if (isManualRefresh) {
            showToast('success', 'Refreshed', 'Student list updated successfully.');
          }
        } else {
          setDbStatus('error');
          const errorMsg = data.error || 'Failed to fetch students from database.';
          setDbErrorMessage(errorMsg);
          if (isManualRefresh) {
            showToast('error', 'Sync Error', errorMsg);
          }
        }
      } catch (err: unknown) {
        console.error('Fetch error:', err);
        setDbStatus('error');
        const msg =
          err instanceof Error
            ? err.message
            : 'Unable to reach the server. Please check your network or MONGODB_URI.';
        setDbErrorMessage(msg);
        if (isManualRefresh) {
          showToast('error', 'Connection Error', msg);
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  /**
   * Handle Create or Update Student
   */
  const handleSaveStudent = async (formData: StudentFormData): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const isEditing = Boolean(studentToEdit);
      const url = isEditing ? `/api/students/${studentToEdit?._id}` : '/api/students';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<IStudent> = await res.json();

      if (!res.ok || !result.success) {
        const errorDetail =
          result.details && Object.values(result.details).length > 0
            ? Object.values(result.details)[0]
            : result.error || 'Operation failed.';
        showToast('error', isEditing ? 'Update Failed' : 'Creation Failed', errorDetail);
        return false;
      }

      showToast(
        'success',
        isEditing ? 'Student Updated' : 'Student Created',
        result.message || (isEditing ? 'Student updated successfully.' : 'New student registered.')
      );

      // Re-fetch to ensure list is synchronized with MongoDB
      await fetchStudents(false);
      return true;
    } catch (err: unknown) {
      console.error('Submit error:', err);
      showToast(
        'error',
        'Request Error',
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Delete Student
   */
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/students/${studentToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const result: ApiResponse = await res.json();

      if (!res.ok || !result.success) {
        showToast(
          'error',
          'Delete Failed',
          result.error || 'Unable to delete student from database.'
        );
        return;
      }

      showToast(
        'success',
        'Student Deleted',
        result.message || `Student "${studentToDelete.name}" was successfully removed.`
      );

      // Immediately update local state
      setStudents((prev) => prev.filter((s) => s._id !== studentToDelete._id));
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (err: unknown) {
      console.error('Delete error:', err);
      showToast(
        'error',
        'Network Error',
        err instanceof Error ? err.message : 'Failed to delete student.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Open modal for Create
  const handleOpenAddModal = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (student: IStudent) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  // Open modal for Delete Confirmation
  const handleOpenDeleteModal = (student: IStudent) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  // Calculated statistics
  const totalStudents = students.length;

  const totalDepartments = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.department) set.add(s.department);
    });
    return set.size;
  }, [students]);

  const latestStudent = useMemo(() => {
    return students.length > 0 ? students[0] : null;
  }, [students]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row antialiased">
      {/* Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Sidebar Navigation */}
      <Sidebar
        totalStudents={totalStudents}
        totalDepartments={totalDepartments}
        dbStatus={dbStatus}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <Header
          onOpenAddModal={handleOpenAddModal}
          onRefresh={() => fetchStudents(true)}
          isRefreshing={isRefreshing}
          totalStudents={totalStudents}
        />

        {/* Dashboard Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Database Alert Banner (shown when connection error occurs) */}
          {dbErrorMessage && (
            <div
              className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs"
              role="alert"
            >
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm">
                <span className="font-bold">Database Connectivity Notice: </span>
                {dbErrorMessage}
                <div className="mt-1 text-xs text-amber-700">
                  Ensure your MongoDB database is running and reachable, and that{' '}
                  <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-amber-900">
                    MONGODB_URI
                  </code>{' '}
                  is correctly set in your{' '}
                  <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-amber-900">
                    .env.local
                  </code>{' '}
                  file.
                </div>
              </div>
              <button
                onClick={() => fetchStudents(true)}
                disabled={isRefreshing}
                type="button"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <ArrowPathIcon className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Statistics Overview Cards */}
          <StatsOverview
            totalStudents={totalStudents}
            totalDepartments={totalDepartments}
            latestStudent={latestStudent}
            isLoading={isLoading}
          />

          {/* Students Data Table Section */}
          <section id="students" aria-label="Student Directory">
            <StudentTable
              students={students}
              isLoading={isLoading}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onOpenAddModal={handleOpenAddModal}
            />
          </section>
        </main>
      </div>

      {/* Add / Edit Student Form Modal */}
      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveStudent}
        studentToEdit={studentToEdit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        student={studentToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
