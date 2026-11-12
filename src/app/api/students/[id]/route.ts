import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Student from '@/models/Student';
import { isValidObjectId, validateStudentInput } from '@/lib/validations';
import { ApiResponse } from '@/types/student';

interface RouteContext {
  params: Promise<{ id: string }>;
}

function handleDbError(error: unknown, defaultMessage: string): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : 'Database error';
  const isConnError =
    errorMessage.includes('timed out') ||
    errorMessage.includes('ENOTFOUND') ||
    errorMessage.includes('ETIMEOUT') ||
    errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('connection');

  return NextResponse.json(
    {
      success: false,
      error: isConnError
        ? 'Database connection unavailable. Please check your MongoDB server status.'
        : defaultMessage,
    },
    { status: isConnError ? 503 : 500 }
  );
}

/**
 * GET /api/students/[id]
 * Fetch a single student by MongoDB ObjectId
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid student ID format. Must be a valid 24-character hexadecimal ObjectId.',
        },
        { status: 400 }
      );
    }

    await connectDB();

    const student = await Student.findById(id).lean();

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: `Student with ID '${id}' not found.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: student,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching student by ID:', error);
    return handleDbError(error, 'Failed to retrieve student record. Please try again.');
  }
}

/**
 * PATCH /api/students/[id]
 * Update an existing student's details
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid student ID format. Must be a valid 24-character hexadecimal ObjectId.',
      },
      { status: 400 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid JSON payload received in request body.',
      },
      { status: 400 }
    );
  }

  const { name, email, phone, department } = body;

  // Validate provided fields
  const validation = validateStudentInput({ name, email, phone, department }, true);
  if (!validation.isValid) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed. Please verify the entered fields.',
        details: validation.errors,
      },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    // Check if student exists
    const currentStudent = await Student.findById(id);
    if (!currentStudent) {
      return NextResponse.json(
        {
          success: false,
          error: `Student with ID '${id}' not found.`,
        },
        { status: 404 }
      );
    }

    // If email is changing, check uniqueness against other students
    if (email && email.trim().toLowerCase() !== currentStudent.email.toLowerCase()) {
      const emailConflict = await Student.findOne({
        _id: { $ne: id },
        email: email.trim().toLowerCase(),
      });

      if (emailConflict) {
        return NextResponse.json(
          {
            success: false,
            error: 'A student with this email address already exists.',
            details: { email: 'Email address is already in use by another student.' },
          },
          { status: 409 }
        );
      }
    }

    // Build update payload
    const updateData: Record<string, string> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (department !== undefined) updateData.department = department.trim();

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json(
      {
        success: true,
        message: 'Student updated successfully.',
        data: updatedStudent,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error updating student:', error);

    // Duplicate key error
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'A student with this email address already exists.',
          details: { email: 'Email address is already in use.' },
        },
        { status: 409 }
      );
    }

    // Mongoose validation error
    if (error instanceof mongoose.Error.ValidationError) {
      const details: Record<string, string> = {};
      for (const [key, errItem] of Object.entries(error.errors)) {
        details[key] = errItem.message;
      }
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed.',
          details,
        },
        { status: 400 }
      );
    }

    return handleDbError(error, 'Failed to update student record. Please try again.');
  }
}

/**
 * DELETE /api/students/[id]
 * Delete a student by ID
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse>> {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid student ID format. Must be a valid 24-character hexadecimal ObjectId.',
        },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedStudent = await Student.findByIdAndDelete(id).lean();

    if (!deletedStudent) {
      return NextResponse.json(
        {
          success: false,
          error: `Student with ID '${id}' not found. It may have already been deleted.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Student deleted successfully.',
        data: { _id: id, name: deletedStudent.name },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error deleting student:', error);
    return handleDbError(error, 'Failed to delete student record. Please try again.');
  }
}
