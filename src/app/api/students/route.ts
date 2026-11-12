import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import Student from '@/models/Student';
import { validateStudentInput } from '@/lib/validations';
import { ApiResponse } from '@/types/student';

/**
 * GET /api/students
 * Fetch all students, sorted by createdAt descending
 */
export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    await connectDB();

    const students = await Student.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        count: students.length,
        data: students,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching students:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch students from database';

    return NextResponse.json(
      {
        success: false,
        error: errorMessage.includes('MONGODB_URI')
          ? 'Database configuration missing. Please verify MONGODB_URI in environment variables.'
          : errorMessage.includes('timed out')
          ? 'Database connection timed out. Please verify cluster status and network accessibility.'
          : 'Unable to connect to database or fetch students. Please try again later.',
      },
      { status: 503 }
    );
  }
}

/**
 * POST /api/students
 * Create a new student
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
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

  // Validate inputs before database access
  const validation = validateStudentInput({ name, email, phone, department }, false);
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

    // Check for existing student with same email before creating
    const existingStudent = await Student.findOne({ email: email.trim().toLowerCase() });
    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error: 'A student with this email address already exists.',
          details: { email: 'Email address must be unique.' },
        },
        { status: 409 }
      );
    }

    const newStudent = await Student.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      department: department.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Student added successfully.',
        data: newStudent,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Error creating student:', error);

    // MongoDB duplicate key error (code 11000)
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
          : 'Failed to create student record. Please try again.',
      },
      { status: isConnError ? 503 : 500 }
    );
  }
}
