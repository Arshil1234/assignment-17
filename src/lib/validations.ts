import { StudentFormData } from '@/types/student';

/**
 * Validates whether a given string is a valid 24-character hexadecimal MongoDB ObjectId.
 * Pure regex implementation ensuring it works in both client and server environments
 * without bundling Node.js native modules.
 */
export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id.trim());
}

/**
 * Validates email format using RFC 5322 compliant simplified regex
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone format (allows international +, digits, spaces, parentheses, hyphens)
 */
export function isValidPhone(phone: string): boolean {
  const phoneClean = phone.replace(/[\s\-\(\)\.]/g, '');
  return phoneClean.length >= 7 && phoneClean.length <= 16 && /^(\+)?[0-9]+$/.test(phoneClean);
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates student input fields for create/update operations.
 */
export function validateStudentInput(
  data: Partial<StudentFormData>,
  isUpdate: boolean = false
): ValidationResult {
  const errors: Record<string, string> = {};

  // Name validation
  if (!isUpdate || data.name !== undefined) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.name = 'Student name is required';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (data.name.trim().length > 100) {
      errors.name = 'Name cannot exceed 100 characters';
    }
  }

  // Email validation
  if (!isUpdate || data.email !== undefined) {
    if (!data.email || typeof data.email !== 'string' || data.email.trim().length === 0) {
      errors.email = 'Email address is required';
    } else if (!isValidEmail(data.email)) {
      errors.email = 'Please provide a valid email address';
    }
  }

  // Phone validation
  if (!isUpdate || data.phone !== undefined) {
    if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(data.phone)) {
      errors.phone = 'Please provide a valid phone number (e.g. +1 234 567 8900)';
    }
  }

  // Department validation
  if (!isUpdate || data.department !== undefined) {
    if (
      !data.department ||
      typeof data.department !== 'string' ||
      data.department.trim().length === 0
    ) {
      errors.department = 'Department is required';
    } else if (data.department.trim().length < 2) {
      errors.department = 'Department name is too short';
    } else if (data.department.trim().length > 100) {
      errors.department = 'Department name cannot exceed 100 characters';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
