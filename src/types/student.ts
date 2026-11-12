export interface IStudent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  department: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
  details?: Record<string, string>;
}

export interface DashboardStats {
  totalStudents: number;
  totalDepartments: number;
  departments: string[];
  departmentCounts: Record<string, number>;
  latestStudent?: IStudent | null;
}
