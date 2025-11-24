import axios from 'axios';
import type {
  BaseResponse,
  SubjectDTO,
  DepartmentDTO,
  MajorDTO,
  SessionStatusDTO,
  TutorDTO,
  CourseDTO,
  StudentCourseDTO,
  SessionDTO,
  CourseRegistrationRequest,
  CourseRegistrationResponse,
  CourseSearchParams,
  LoginRequest,
  LoginResponse
} from '../types/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<BaseResponse<string>>('/auth/login', credentials);
    return {
      token: response.data.data,
      user: {
        id: 0, // This should come from JWT decode or separate endpoint
        email: credentials.email,
        firstName: '',
        lastName: '',
        role: ''
      }
    };
  }
};

// Public endpoints - no auth required
export const publicApi = {
  getSubjects: async (): Promise<SubjectDTO[]> => {
    const response = await api.get<BaseResponse<SubjectDTO[]>>('/subjects');
    return response.data.data;
  },

  getDepartments: async (): Promise<DepartmentDTO[]> => {
    const response = await api.get<BaseResponse<DepartmentDTO[]>>('/departments');
    return response.data.data;
  },

  getMajors: async (): Promise<MajorDTO[]> => {
    const response = await api.get<BaseResponse<MajorDTO[]>>('/majors');
    return response.data.data;
  },

  getMajorsByDepartment: async (departmentId: number): Promise<MajorDTO[]> => {
    const response = await api.get<BaseResponse<MajorDTO[]>>(`/majors/by-department/${departmentId}`);
    return response.data.data;
  },

  getSessionStatuses: async (): Promise<SessionStatusDTO[]> => {
    const response = await api.get<BaseResponse<SessionStatusDTO[]>>('/session-statuses');
    return response.data.data;
  },

  getStudentSessionStatuses: async (): Promise<SessionStatusDTO[]> => {
    const response = await api.get<BaseResponse<SessionStatusDTO[]>>('/student-session-statuses');
    return response.data.data;
  }
};

// Protected endpoints - require auth
export const courseApi = {
  // NOTE: These endpoints may not exist yet - need backend confirmation
  
  getCourses: async (params?: CourseSearchParams): Promise<CourseDTO[]> => {
    // MISSING ENDPOINT: GET /courses with search/filter params
    const response = await api.get<BaseResponse<CourseDTO[]>>('/courses', { params });
    return response.data.data;
  },

  getCourseById: async (id: number): Promise<CourseDTO> => {
    // MISSING ENDPOINT: GET /courses/{id}
    const response = await api.get<BaseResponse<CourseDTO>>(`/courses/${id}`);
    return response.data.data;
  },

  registerCourse: async (registration: CourseRegistrationRequest): Promise<CourseRegistrationResponse> => {
    // MISSING ENDPOINT: POST /courses/{id}/register or POST /registrations
    const response = await api.post<BaseResponse<CourseRegistrationResponse>>(
      `/courses/${registration.courseId}/register`, 
      registration
    );
    return response.data.data;
  },

  getStudentCourses: async (studentId: number): Promise<StudentCourseDTO[]> => {
    // MISSING ENDPOINT: GET /students/{id}/courses or GET /student-courses
    const response = await api.get<BaseResponse<StudentCourseDTO[]>>(`/students/${studentId}/courses`);
    return response.data.data;
  },

  cancelRegistration: async (registrationId: number): Promise<boolean> => {
    // MISSING ENDPOINT: DELETE /registrations/{id} or PUT /registrations/{id}/cancel
    await api.delete(`/registrations/${registrationId}`);
    return true;
  }
};

export const scheduleApi = {
  getStudentSessions: async (studentId: number, params?: { 
    startDate?: string; 
    endDate?: string; 
  }): Promise<SessionDTO[]> => {
    // MISSING ENDPOINT: GET /students/{id}/sessions or GET /sessions?studentId=
    const response = await api.get<BaseResponse<SessionDTO[]>>(`/students/${studentId}/sessions`, { params });
    return response.data.data;
  },

  getSessionById: async (sessionId: number): Promise<SessionDTO> => {
    // MISSING ENDPOINT: GET /sessions/{id}
    const response = await api.get<BaseResponse<SessionDTO>>(`/sessions/${sessionId}`);
    return response.data.data;
  },

  updateSession: async (sessionId: number, updates: Partial<SessionDTO>): Promise<SessionDTO> => {
    // MISSING ENDPOINT: PUT /sessions/{id}
    const response = await api.put<BaseResponse<SessionDTO>>(`/sessions/${sessionId}`, updates);
    return response.data.data;
  }
};

export const tutorApi = {
  getTutors: async (): Promise<TutorDTO[]> => {
    // EXISTS in README - requires auth
    const response = await api.get<BaseResponse<TutorDTO[]>>('/tutors');
    return response.data.data;
  },

  getTutorById: async (id: number): Promise<TutorDTO> => {
    // MISSING ENDPOINT: GET /tutors/{id}
    const response = await api.get<BaseResponse<TutorDTO>>(`/tutors/${id}`);
    return response.data.data;
  }
};

export default api;