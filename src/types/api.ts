// API Response Types from Backend
export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// From README_FE.md - existing endpoints
export interface SubjectDTO {
  id: number;
  name: string;
}

export interface DepartmentDTO {
  id: number;
  name: string;
}

export interface MajorDTO {
  id: number;
  name: string;
  majorCode: string;
  programCode: string;
  note: string;
  departmentId: number;
  departmentName: string;
}

export interface SessionStatusDTO {
  id: number; // byte in Java
  name: string;
  description: string;
}

export interface TutorDTO {
  id: number;
  hcmutId: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  academicStatus: string;
  dob: string; // LocalDate: "yyyy-MM-dd"
  phone: string;
  otherMethodContact: string;
  role: string;
  createdDate: string; // Instant ISO-8601
  updateDate: string;
  lastLogin: string;
  title: string;
  majorId: number;
  majorName: string;
  department: string;
  description: string;
  specializations: string[]; // subject names
  rating: number;
  reviewCount: number;
  studentCount: number;
  experienceYears: number;
  isAvailable: boolean;
}

// Extended types needed for Course management (may need backend endpoints)
export interface CourseDTO {
  id: number;
  name: string;
  code: string;
  description?: string;
  subjectId: number;
  subjectName: string;
  tutorId: number;
  tutorName: string;
  majorId: number;
  majorName: string;
  departmentId: number;
  departmentName: string;
  capacity: number;
  enrolled: number;
  status: 'OPEN' | 'CLOSED' | 'FULL' | 'PENDING';
  startDate: string; // LocalDate
  endDate: string; // LocalDate
  createdDate: string; // Instant
  updateDate: string; // Instant
  timeslots: TimeslotDTO[];
  rating?: number;
  ratingCount?: number;
}

export interface TimeslotDTO {
  id: number;
  courseId: number;
  dayOfWeek: string; // "MONDAY", "TUESDAY", etc.
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
  location?: string;
  locationType: 'ONLINE' | 'OFFLINE';
  meetingLink?: string;
}

export interface StudentCourseDTO {
  id: number;
  studentId: number;
  courseId: number;
  course: CourseDTO;
  registrationDate: string; // Instant
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  notes?: string;
}

export interface SessionDTO {
  id: number;
  courseId: number;
  course?: CourseDTO;
  studentId: number;
  tutorId: number;
  sessionDate: string; // LocalDate
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  location?: string;
  locationType: 'ONLINE' | 'OFFLINE';
  meetingLink?: string;
  sessionStatus: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'; // Updated to match backend
  notes?: string;
  createdDate: string; // Instant
  updateDate: string; // Instant
}

// Registration request types
export interface CourseRegistrationRequest {
  courseId: number;
  studentId: number;
  notes?: string;
}

export interface CourseRegistrationResponse {
  id: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message: string;
  conflictSessions?: SessionDTO[];
}

// Search/Filter types
export interface CourseSearchParams {
  search?: string;
  majorId?: number;
  departmentId?: number;
  status?: string;
  page?: number;
  size?: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}