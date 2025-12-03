import axios from "axios";
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
  LoginResponse,
} from "../types/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<BaseResponse<string>>(
      "/auth/login",
      credentials
    );
    return {
      token: response.data.data,
      user: {
        id: 0, // This should come from JWT decode or separate endpoint
        email: credentials.email,
        firstName: "",
        lastName: "",
        role: "",
      },
    };
  },
};

// Public endpoints - no auth required
export const publicApi = {
  getSubjects: async (): Promise<SubjectDTO[]> => {
    const response = await api.get<BaseResponse<SubjectDTO[]>>("/subjects");
    return response.data.data;
  },

  getDepartments: async (): Promise<DepartmentDTO[]> => {
    const response = await api.get<BaseResponse<DepartmentDTO[]>>(
      "/departments"
    );
    return response.data.data;
  },

  getMajors: async (): Promise<MajorDTO[]> => {
    const response = await api.get<BaseResponse<MajorDTO[]>>("/majors");
    return response.data.data;
  },

  getMajorsByDepartment: async (departmentId: number): Promise<MajorDTO[]> => {
    const response = await api.get<BaseResponse<MajorDTO[]>>(
      `/majors/by-department/${departmentId}`
    );
    return response.data.data;
  },

  getSessionStatuses: async (): Promise<SessionStatusDTO[]> => {
    const response = await api.get<BaseResponse<SessionStatusDTO[]>>(
      "/session-statuses"
    );
    return response.data.data;
  },

  getStudentSessionStatuses: async (): Promise<SessionStatusDTO[]> => {
    const response = await api.get<BaseResponse<SessionStatusDTO[]>>(
      "/student-session-statuses"
    );
    return response.data.data;
  },
};

// Backend Session DTO (actual from BE)
interface BackendSessionDTO {
  id: number;
  tutorName: string;
  studentNames: string[];
  subjectName: string;
  startTime: string; // Instant ISO-8601
  endTime: string; // Instant ISO-8601
  format: string; // "ONLINE" or "OFFLINE"
  location: string;
  maxQuantity: number;
  currentQuantity: number;
  updatedDate: string;
}

// Protected endpoints - require auth
export const courseApi = {
  // Map Sessions from Backend to Course-like structure for FE compatibility
  getCourses: async (_params?: CourseSearchParams): Promise<CourseDTO[]> => {
    // Try student endpoint first, fallback to sessions endpoint for admin
    let sessions: BackendSessionDTO[] = [];
    
    try {
      // Try GET /students/available-sessions (for STUDENT role)
      const response = await api.get<BaseResponse<any>>("/students/available-sessions");
      
      let data = response.data.data;
      
      // Check if data has pagination structure (PaginationUtil format)
      if (data && typeof data === 'object' && 'content' in data) {
        data = data.content;
      }
      
      // Ensure data is array
      if (Array.isArray(data)) {
        sessions = data;
      } else {
        sessions = [];
      }
      
      // If empty, try /sessions as fallback
      if (!sessions || sessions.length === 0) {
        try {
          const fallbackResponse = await api.get<BaseResponse<any>>("/sessions");
          let fallbackData = fallbackResponse.data.data;
          
          // Handle pagination if present
          if (fallbackData && typeof fallbackData === 'object' && 'content' in fallbackData) {
            fallbackData = fallbackData.content;
          }
          
          sessions = Array.isArray(fallbackData) ? fallbackData : [];
        } catch (fallbackError) {
          sessions = [];
        }
      }
    } catch (error: any) {
      // If 403, user might be ADMIN, try GET /sessions instead
      if (error?.response?.status === 403) {
        const response = await api.get<BaseResponse<BackendSessionDTO[]>>("/sessions");
        const data = response.data.data;
        sessions = Array.isArray(data) ? data : [];
      } else {
        sessions = []; // Return empty array instead of throwing
      }
    }
    
    // Ensure sessions is array before mapping
    if (!Array.isArray(sessions)) {
      return [];
    }
    
    // Transform sessions to course-like structure
    return sessions.map((session, index) => ({
      id: session.id,
      name: session.subjectName,
      code: `SESSION-${session.id}`,
      description: `Lịch học môn ${session.subjectName}`,
      subjectId: 0,
      subjectName: session.subjectName,
      tutorId: 0,
      tutorName: session.tutorName,
      majorId: 0,
      majorName: "",
      departmentId: (index % 3) + 1, // Simulate department assignment
      departmentName: "",
      capacity: session.maxQuantity,
      enrolled: session.currentQuantity,
      status: (session.currentQuantity >= session.maxQuantity ? 'FULL' : 'OPEN') as 'OPEN' | 'CLOSED' | 'FULL' | 'PENDING',
      startDate: new Date(session.startTime).toISOString().split('T')[0],
      endDate: new Date(session.endTime).toISOString().split('T')[0],
      createdDate: session.updatedDate,
      updateDate: session.updatedDate,
      timeslots: [{
        id: session.id,
        courseId: session.id,
        dayOfWeek: new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
        startTime: new Date(session.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(session.endTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        location: session.location,
        locationType: session.format === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
        meetingLink: session.format === 'ONLINE' ? session.location : undefined,
      }],
      rating: 4.5,
      ratingCount: 10,
    }));
  },

  getCourseById: async (id: number): Promise<CourseDTO> => {
    // Fallback: get from available sessions
    const courses = await courseApi.getCourses();
    const course = courses.find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    return course;
  },

  registerCourse: async (
    registration: CourseRegistrationRequest
  ): Promise<CourseRegistrationResponse> => {
    try {
      // Use POST /students/register-session with query param
      const response = await api.post<BaseResponse<any>>(
        `/students/register-session?sessionId=${registration.courseId}`
      );
      
      // Check if backend returned error (statusCode 500, 400, etc.)
      if (response.data.statusCode >= 400) {
        const error = new Error(response.data.message || 'Đăng ký thất bại');
        (error as any).statusCode = response.data.statusCode;
        (error as any).apiMessage = response.data.message;
        throw error;
      }
      
      return {
        id: response.data.data?.id || registration.courseId,
        status: 'PENDING',
        message: response.data.message || 'Đăng ký thành công',
      };
    } catch (error: any) {
      throw error;
    }
  },

  getStudentCourses: async (studentId: number): Promise<StudentCourseDTO[]> => {
    // Use GET /students/history/{userId}
    try {
      const response = await api.get<BaseResponse<any[]>>(
        `/students/history/${studentId}`
      );
      const history = response.data.data;
      
      // Transform to StudentCourseDTO structure
      return history.map((item: any) => ({
        id: item.id,
        studentId: studentId,
        courseId: item.sessionId || item.id,
        course: {
          id: item.sessionId || item.id,
          name: item.sessionSubject || item.courseName || 'N/A',
          code: `SESSION-${item.sessionId || item.id}`,
          subjectName: item.sessionSubject || item.courseName || 'N/A',
          tutorName: item.tutorName || 'N/A',
        } as CourseDTO,
        registrationDate: item.registeredDate,
        status: item.status === 'CONFIRMED' ? 'APPROVED' : item.status,
        notes: '',
      }));
    } catch (error: any) {
      // If 403, user might be ADMIN viewing student page - return empty
      if (error?.response?.status === 403) {
        return [];
      }
      throw error;
    }
  },

  cancelRegistration: async (_registrationId: number): Promise<boolean> => {
    // No cancel endpoint exists, return false
    throw new Error('Cancel registration not supported yet');
  },
};

export const scheduleApi = {
  getStudentSessions: async (
    studentId: number,
    params?: {
      startDate?: string;
      endDate?: string;
    }
  ): Promise<SessionDTO[]> => {
    // Use GET /students/history/{userId} to get enrolled sessions
    const response = await api.get<BaseResponse<any[]>>(
      `/students/history`
    );
    const history = response.data.data;
    
    // Filter by date range if provided and transform to SessionDTO
    let filteredHistory = history;
    if (params?.startDate && params?.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      filteredHistory = history.filter((item: any) => {
        const sessionDate = new Date(item.sessionStartTime);
        return sessionDate >= start && sessionDate <= end;
      });
    }
    
    return filteredHistory.map((item: any) => ({
      id: item.id,
      courseId: item.sessionId || item.id,
      course: {
        id: item.sessionId || item.id,
        name: item.sessionSubject || 'N/A',
        code: `SESSION-${item.sessionId || item.id}`,
        tutorName: item.tutorName || 'N/A',
      } as any,
      studentId: studentId,
      tutorId: 0,
      sessionDate: new Date(item.sessionStartTime).toISOString().split('T')[0],
      startTime: new Date(item.sessionStartTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(item.sessionEndTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      location: item.sessionLocation || 'N/A',
      locationType: item.sessionFormat === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
      meetingLink: item.sessionFormat === 'ONLINE' ? item.sessionLocation : undefined,
      sessionStatus: item.status === 'CONFIRMED' ? 'SCHEDULED' : item.status, // Updated to sessionStatus
      notes: '',
      createdDate: item.registeredDate,
      updateDate: item.updatedDate,
    }));
  },

  getAllSessions: async (): Promise<BackendSessionDTO[]> => {
    // Actual backend endpoint
    const response = await api.get<BaseResponse<BackendSessionDTO[]>>("/sessions");
    return response.data.data;
  },

  // Thọ: Cập nhật lại endpoint : /sessions/tutor{id}/page=0
  getTutorSessions: async (
  tutorId: number,
  page: number = 0
): Promise<{ content: BackendSessionDTO[], totalPages: number, totalElements: number }> => {
  const defaultResult = { content: [], totalPages: 0, totalElements: 0 };

  try {
    const response = await api.get<BaseResponse<any>>(
      `/sessions/tutor/${tutorId}?page=${page}`
    );

    const data = response.data?.data;

    // Case 1: pagination object
    if (data && typeof data === 'object' && 'content' in data) {
      return {
        content: data.content ?? [],
        totalPages: data.totalPages ?? 0,
        totalElements: data.totalElements ?? 0
      };
    }

    // Case 2: array
    if (Array.isArray(data)) {
      return {
        content: data,
        totalPages: Math.ceil(data.length / 10),
        totalElements: data.length
      };
    }

    return defaultResult;
  } catch (error) {
    console.error("Error fetching tutor sessions:", error);
    return defaultResult;
  }
},


  getSessionById: async (sessionId: number): Promise<SessionDTO> => {
    // Get all sessions and find by ID
    const sessions = await scheduleApi.getStudentSessions(0);
    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');
    return session;
  },

  updateSession: async (
    sessionId: number,
    updates: Partial<SessionDTO>
  ): Promise<SessionDTO> => {
    // Use PUT /sessions/{id} - this exists in backend
    const response = await api.put<BaseResponse<BackendSessionDTO>>(
      `/sessions/${sessionId}`,
      updates
    );
    // Transform backend response to SessionDTO
    const session = response.data.data;
    return {
      id: session.id,
      courseId: session.id,
      studentId: 0,
      tutorId: 0,
      sessionDate: new Date(session.startTime).toISOString().split('T')[0],
      startTime: new Date(session.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(session.endTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      location: session.location,
      locationType: session.format === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
      sessionStatus: 'SCHEDULED', // Updated to sessionStatus
      createdDate: session.updatedDate,
      updateDate: session.updatedDate,
    } as SessionDTO;
  },
  
  createSession: async (sessionData: any): Promise<BackendSessionDTO> => {
    // POST /sessions - exists in backend
    const response = await api.post<BaseResponse<BackendSessionDTO>>("/sessions", sessionData);
    return response.data.data;
  },
  
  deleteSession: async (sessionId: number): Promise<void> => {
    // DELETE /sessions/{id} - exists in backend
    await api.delete(`/sessions/${sessionId}`);
  },
};

export const tutorApi = {
  getTutors: async (): Promise<TutorDTO[]> => {
    // Public endpoint - no auth required according to backend
    const response = await api.get<BaseResponse<TutorDTO[]>>("/tutors");
    return response.data.data;
  },

  getTutorById: async (id: number): Promise<TutorDTO> => {
    // Fallback: get all tutors and filter
    const tutors = await tutorApi.getTutors();
    const tutor = tutors.find(t => t.id === id);
    if (!tutor) throw new Error('Tutor not found');
    return tutor;
  },

  // Tutor Dashboard & Statistics
  getDashboardStats: async (_tutorId: number): Promise<any> => {
    // TODO: Replace with actual endpoint when available
    // const response = await api.get<BaseResponse<any>>(`/tutors/${tutorId}/dashboard`);
    // return response.data.data;
    throw new Error('Dashboard stats API not yet implemented in backend');
  },

  // Tutor Sessions Management
  getTutorSessions: async (_tutorId: number, _params?: any): Promise<BackendSessionDTO[]> => {
    // TODO: Replace with actual endpoint when available
    // const response = await api.get<BaseResponse<BackendSessionDTO[]>>(`/tutors/${tutorId}/sessions`, { params });
    // return response.data.data;
    
    // Fallback: Use GET /sessions and filter by tutor
    const response = await api.get<BaseResponse<BackendSessionDTO[]>>("/sessions");
    return response.data.data;
  },

  // Student Registration Management
  getPendingRegistrations: async (_tutorId: number): Promise<any[]> => {
    try {
      const response = await api.get<BaseResponse<any>>('/tutors/pending-registrations');
      let data = response.data.data;
      
      // Handle pagination if present
      if (data && typeof data === 'object' && 'content' in data) {
        return data.content;
      }
      
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  },

  approveRegistration: async (studentSessionId: number): Promise<void> => {
    // API expects array of IDs
    await api.put<BaseResponse<any>>(
      '/tutors/student-sessions/approve',
      [studentSessionId]
    );
  },

  rejectRegistration: async (studentSessionId: number): Promise<void> => {
    // API expects array of IDs
    await api.put<BaseResponse<any>>(
      '/tutors/student-sessions/reject',
      [studentSessionId]
    );
  },

  // Tutor Schedule
  getTutorSchedule: async (_tutorId: number, _startDate: string, _endDate: string): Promise<any[]> => {
    // TODO: Replace with actual endpoint when available
    // const response = await api.get<BaseResponse<any[]>>(`/tutors/${tutorId}/schedule`, {
    //   params: { startDate, endDate }
    // });
    // return response.data.data;
    throw new Error('Tutor schedule API not yet implemented in backend');
  },

  // Tutor Profile Management
  registerAsTutor: async (data: any): Promise<any> => {
    // Endpoint used in BecomeTutor.tsx
    const response = await api.post<BaseResponse<any>>('/tutors', data);
    return response.data.data;
  },

  // Get tutor profile with subjects
  getTutorProfile: async (): Promise<any> => {
    // GET /tutors/profile - requires authentication
    const response = await api.get<BaseResponse<any>>('/tutors/profile');
    return response.data.data;
  },

  // Get subjects that tutor can teach
  getTutorSubjects: async (): Promise<any[]> => {
    try {
      // Use existing endpoint that returns tutor profile with subjects
      const tutorProfile = await tutorApi.getTutorProfile();
      return tutorProfile.subjects || [];
    } catch (error) {
      console.log('Failed to get tutor subjects:', error);
      // Fallback to all subjects if tutor profile not available
      try {
        const response = await api.get<BaseResponse<any[]>>('/subjects');
        return response.data.data;
      } catch (fallbackError) {
        return [];
      }
    }
  },
};

export default api;
