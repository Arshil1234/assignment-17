import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentDocument extends Document {
  name: string;
  email: string;
  phone: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudentDocument>(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Prevent mongoose from recompiling the model during hot-reloads
const Student: Model<IStudentDocument> =
  mongoose.models.Student || mongoose.model<IStudentDocument>('Student', StudentSchema);

export default Student;
