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
  status?: string;
}

// Pagination response structure
interface PaginationResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  totalItems?: number;
  pageSize?: number;
  currentPage?: number;
}

// Student history item (matches StudentSessionHistoryDTO from backend)
interface StudentHistoryItem {
  studentSessionId: number; // Primary ID
  sessionId: number;
  tutorName: string;
  subjectName: string;
  startTime: string; // Instant ISO-8601
  endTime: string; // Instant ISO-8601
  format: string; // ONLINE or OFFLINE
  location: string;
  dayOfWeek?: string;
  sessionStatus: string; // Session status
  registrationStatus: string; // PENDING, CONFIRMED, REJECTED
  registeredDate: string; // Instant ISO-8601
  updatedDate: string; // Instant ISO-8601
}

// Student Session DTO (matches StudentSessionDTO from backend)
// Used for tutor pending registrations
interface StudentSessionItem {
  id: number; // Primary ID
  studentId: number;
  studentName: string;
  sessionId: number;
  sessionSubject: string;
  sessionStartTime: string; // Instant ISO-8601
  sessionEndTime: string; // Instant ISO-8601
  sessionFormat: string; // ONLINE or OFFLINE
  sessionDayOfWeek?: string;
  status: string; // PENDING, CONFIRMED, REJECTED
  registeredDate: string; // Instant ISO-8601
  confirmedDate?: string;
  updatedDate: string; // Instant ISO-8601
  sessionLocation: string;
}

// Registration response
interface RegistrationResponseData {
  id?: number;
  message?: string;
}

// Session creation data (matches backend SessionRequest)
interface CreateSessionData {
  tutorId: number;
  subjectId: number;
  startTime: string; // ISO-8601
  endTime: string; // ISO-8601
  format: string;
  location: string;
  maxQuantity: number;
  sessionStatusId?: number; // 1=PENDING (default for new sessions), 2=SCHEDULED, 3=IN_PROGRESS, 4=COMPLETED, 5=CANCELLED
}

// Tutor registration data
interface TutorRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
}

// Generic API response for various endpoints
interface GenericApiResponse {
  id?: number;
  message?: string;
  [key: string]: unknown;
}

// Protected endpoints - require auth
export const courseApi = {
  // Map Sessions from Backend to Course-like structure for FE compatibility
  getCourses: async (): Promise<CourseDTO[]> => {
    // Try student endpoint first, fallback to sessions endpoint for admin
    let sessions: BackendSessionDTO[] = [];
    
    try {
      // Try GET /students/available-sessions (for STUDENT role)
      const response = await api.get<BaseResponse<PaginationResponse<BackendSessionDTO> | BackendSessionDTO[]>>("/students/available-sessions");
      
      // Check BaseResponse structure
      if (response.data.statusCode === 200 && response.data.data) {
        let data = response.data.data;
        
        // Check if data has pagination structure (PaginationUtil format)
        if (data && typeof data === 'object' && 'content' in data) {
          data = (data as PaginationResponse<BackendSessionDTO>).content;
        }
        
        // Ensure data is array
        if (Array.isArray(data)) {
          sessions = data as BackendSessionDTO[];
        }
      }
      
      // If empty, try /sessions as fallback
      if (!sessions || sessions.length === 0) {
        try {
          const fallbackResponse = await api.get<BaseResponse<PaginationResponse<BackendSessionDTO> | BackendSessionDTO[]>>("/sessions");
          
          if (fallbackResponse.data.statusCode === 200 && fallbackResponse.data.data) {
            let fallbackData = fallbackResponse.data.data;
            
            // Handle pagination if present
            if (fallbackData && typeof fallbackData === 'object' && 'content' in fallbackData) {
              fallbackData = (fallbackData as PaginationResponse<BackendSessionDTO>).content;
            }
            
            sessions = Array.isArray(fallbackData) ? fallbackData as BackendSessionDTO[] : [];
          }
        } catch {
          sessions = [];
        }
      }
    } catch (error: unknown) {
      // If 403, user might be ADMIN, try GET /sessions instead
      if ((error as { response?: { status: number } })?.response?.status === 403) {
        const response = await api.get<BaseResponse<PaginationResponse<BackendSessionDTO> | BackendSessionDTO[]>>("/sessions");
        
        if (response.data.statusCode === 200 && response.data.data) {
          let data = response.data.data;
          
          // Handle pagination if present
          if (data && typeof data === 'object' && 'content' in data) {
            data = (data as PaginationResponse<BackendSessionDTO>).content;
          }
          
          sessions = Array.isArray(data) ? data as BackendSessionDTO[] : [];
        }
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
    // Use POST /students/register-session with query param
    const response = await api.post<BaseResponse<RegistrationResponseData>>(
      `/students/register-session?sessionId=${registration.courseId}`
    );
    
    // Check if backend returned error (statusCode 500, 400, etc.)
    if (response.data.statusCode >= 400) {
      const error = new Error(response.data.message || 'Đăng ký thất bại') as Error & { statusCode?: number; apiMessage?: string };
      error.statusCode = response.data.statusCode;
      error.apiMessage = response.data.message;
      throw error;
    }
    
    return {
      id: response.data.data?.id || registration.courseId,
      status: 'PENDING',
      message: response.data.message || 'Đăng ký thành công',
    };
  },

  getStudentCourses: async (studentId?: number): Promise<StudentCourseDTO[]> => {
    // Try multiple endpoints for getting student courses
    
    try {
      // Try 1: GET /students/history without studentId (current user)
      let response;
      
      try {
        response = await api.get<BaseResponse<PaginationResponse<StudentHistoryItem>>>(
          '/students/history'
        );
      } catch (error: unknown) {
        // Try 2: GET /students/history/{studentId} if studentId provided
        if (studentId && (error as { response?: { status: number } })?.response?.status === 404) {
          response = await api.get<BaseResponse<PaginationResponse<StudentHistoryItem>>>(
            `/students/history/${studentId}`
          );
        } else {
          throw error;
        }
      }
      
      // Check BaseResponse structure
      if (response.data.statusCode !== 200 || !response.data.data) {
        return [];
      }
      
      // Extract content from pagination response
      let history: StudentHistoryItem[];
      const data = response.data.data;
      
      // Check if paginated response or direct array
      if (data && typeof data === 'object' && 'content' in data) {
        history = (data as PaginationResponse<StudentHistoryItem>).content;
      } else if (Array.isArray(data)) {
        history = data as unknown as StudentHistoryItem[];
      } else {
        return [];
      }
      
      // Transform to StudentCourseDTO structure
      return history.map((item: StudentHistoryItem) => {
        const transformed = {
          id: item.studentSessionId,
          studentId: studentId || item.studentSessionId, // Use studentSessionId as fallback
          courseId: item.sessionId,
          course: {
            id: item.sessionId,
            name: item.subjectName,
            code: `SESSION-${item.sessionId}`,
            subjectName: item.subjectName,
            tutorName: item.tutorName,
          } as CourseDTO,
          registrationDate: item.registeredDate,
          status: (item.registrationStatus === 'CONFIRMED' ? 'APPROVED' : 
                  item.registrationStatus === 'PENDING' ? 'PENDING' : 
                  item.registrationStatus === 'REJECTED' ? 'REJECTED' : 
                  'CANCELLED') as 'PENDING' | 'CANCELLED' | 'APPROVED' | 'REJECTED',
          notes: '',
          // Preserve session details from backend
          sessionStartTime: item.startTime,
          sessionEndTime: item.endTime,
          sessionLocation: item.location,
          sessionFormat: item.format,
        };
        return transformed;
      });
    } catch (error: unknown) {
      const errorResponse = error as { response?: { status: number; data?: { message?: string } } };
      
      console.error('Error fetching student courses:', {
        status: errorResponse?.response?.status,
        message: errorResponse?.response?.data?.message,
        studentId
      });
      
      // If 403, try getting from current user's registration list
      if (errorResponse?.response?.status === 403) {
        try {
          // Fallback: Try getting user's own registrations via student-sessions endpoint
          const fallbackResponse = await api.get<BaseResponse<PaginationResponse<StudentHistoryItem> | StudentHistoryItem[]>>(
            '/students/student-sessions'
          );
          
          if (fallbackResponse.data.statusCode === 200 && fallbackResponse.data.data) {
            let history: StudentHistoryItem[];
            const fallbackData = fallbackResponse.data.data;
            
            // Handle pagination if present
            if (fallbackData && typeof fallbackData === 'object' && 'content' in fallbackData) {
              history = (fallbackData as PaginationResponse<StudentHistoryItem>).content;
            } else if (Array.isArray(fallbackData)) {
              history = fallbackData as StudentHistoryItem[];
            } else {
              return [];
            }
            return history.map((item: StudentHistoryItem) => {
              const transformed = {
                id: item.studentSessionId,
                studentId: studentId || item.studentSessionId,
                courseId: item.sessionId,
                course: {
                  id: item.sessionId,
                  name: item.subjectName,
                  code: `SESSION-${item.sessionId}`,
                  subjectName: item.subjectName,
                  tutorName: item.tutorName,
                } as CourseDTO,
                registrationDate: item.registeredDate,
                status: (item.registrationStatus === 'CONFIRMED' ? 'APPROVED' : 
                        item.registrationStatus === 'PENDING' ? 'PENDING' : 
                        item.registrationStatus === 'REJECTED' ? 'REJECTED' : 
                        'CANCELLED') as 'PENDING' | 'CANCELLED' | 'APPROVED' | 'REJECTED',
                notes: '',
                // Preserve session details from backend
                sessionStartTime: item.startTime,
                sessionEndTime: item.endTime,
                sessionLocation: item.location,
                sessionFormat: item.format,
              };
              return transformed;
            });
          }
        } catch (fallbackError) {
          console.warn('Fallback endpoint also failed:', fallbackError);
        }
        
        return []; // Return empty array for 403 instead of throwing
      }
      
      // For other errors, return empty array to prevent app crash
      return [];
    }
  },

  cancelRegistration: async (): Promise<boolean> => {
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
    // Use GET /students/history to get enrolled sessions for current user
    let response;
    
    try {
      response = await api.get<BaseResponse<PaginationResponse<StudentHistoryItem> | StudentHistoryItem[]>>(
        '/students/history'
      );
    } catch (error: unknown) {
      // If current user endpoint fails, try with studentId
      if ((error as { response?: { status: number } })?.response?.status === 403) {
        try {
          response = await api.get<BaseResponse<PaginationResponse<StudentHistoryItem> | StudentHistoryItem[]>>(
            `/students/history/${studentId}`
          );
        } catch {
          return []; // Return empty array if both endpoints fail
        }
      } else {
        return [];
      }
    }
    
    // Check BaseResponse structure
    if (response.data.statusCode !== 200 || !response.data.data) {
      return [];
    }
    
    let history = response.data.data;
    
    // Handle pagination if present
    if (history && typeof history === 'object' && 'content' in history) {
      history = (history as PaginationResponse<StudentHistoryItem>).content;
    }
    
    if (!Array.isArray(history)) {
      return [];
    }
    
    // Filter by date range if provided and transform to SessionDTO
    let filteredHistory = history as StudentHistoryItem[];
    if (params?.startDate && params?.endDate) {
      const start = new Date(params.startDate);
      const end = new Date(params.endDate);
      filteredHistory = (history as StudentHistoryItem[]).filter((item: StudentHistoryItem) => {
        const sessionDate = new Date(item.startTime);
        return sessionDate >= start && sessionDate <= end;
      });
    }
    
    return filteredHistory.map((item: StudentHistoryItem) => ({
      id: item.studentSessionId,
      courseId: item.sessionId,
      course: {
        id: item.sessionId,
        name: item.subjectName,
        code: `SESSION-${item.sessionId}`,
        tutorName: item.tutorName,
      } as CourseDTO,
      studentId: studentId,
      tutorId: 0,
      sessionDate: new Date(item.startTime).toISOString().split('T')[0],
      startTime: new Date(item.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(item.endTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      location: item.location,
      locationType: item.format === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
      meetingLink: item.format === 'ONLINE' ? item.location : undefined,
      sessionStatus: (item.registrationStatus === 'CONFIRMED' ? 'SCHEDULED' : 
                     item.sessionStatus === 'COMPLETED' ? 'COMPLETED' : 
                     item.sessionStatus === 'CANCELLED' ? 'CANCELLED' : 
                     'RESCHEDULED') as 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED',
      notes: '',
      createdDate: item.registeredDate,
      updateDate: item.updatedDate,
    }));
  },

  getAllSessions: async (): Promise<BackendSessionDTO[]> => {
    // Actual backend endpoint
    const response = await api.get<BaseResponse<PaginationResponse<BackendSessionDTO> | BackendSessionDTO[]>>("/sessions");
    
    // Check BaseResponse structure
    if (response.data.statusCode !== 200 || !response.data.data) {
      return [];
    }
    
    let data = response.data.data;
    
    // Handle pagination if present
    if (data && typeof data === 'object' && 'content' in data) {
      data = (data as PaginationResponse<BackendSessionDTO>).content;
    }
    
    return Array.isArray(data) ? data as BackendSessionDTO[] : [];
  },

  // Thọ: Cập nhật lại endpoint : /sessions/tutor{id}/page=0
  getTutorSessions: async (
  tutorId: number,
  page: number = 0
): Promise<{ content: BackendSessionDTO[], totalPages: number, totalElements: number }> => {
  const defaultResult = { content: [], totalPages: 0, totalElements: 0 };

  try {
    const response = await api.get<BaseResponse<PaginationResponse<BackendSessionDTO> | BackendSessionDTO[]>>(
      `/sessions/tutor/${tutorId}?page=${page}`
    );

    // Check BaseResponse structure
    if (response.data.statusCode !== 200 || !response.data.data) {
      return defaultResult;
    }

    const data = response.data.data;

    // Case 1: pagination object
    if (data && typeof data === 'object' && 'content' in data) {
      return {
        content: (data as PaginationResponse<BackendSessionDTO>).content ?? [],
        totalPages: (data as PaginationResponse<BackendSessionDTO>).totalPages ?? 0,
        totalElements: (data as PaginationResponse<BackendSessionDTO>).totalElements ?? 0
      };
    }

    // Case 2: array
    if (Array.isArray(data)) {
      return {
        content: data as BackendSessionDTO[],
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
  
  createSession: async (sessionData: CreateSessionData): Promise<BackendSessionDTO> => {
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
  getDashboardStats: async (): Promise<GenericApiResponse> => {
    // TODO: Replace with actual endpoint when available
    throw new Error('Dashboard stats API not yet implemented in backend');
  },

  // Tutor Sessions Management
  getTutorSessions: async (): Promise<BackendSessionDTO[]> => {
    // Fallback: Use GET /sessions and filter by tutor
    const response = await api.get<BaseResponse<BackendSessionDTO[]>>("/sessions");
    return response.data.data;
  },

  // Student Registration Management
  getPendingRegistrations: async (): Promise<StudentSessionItem[]> => {
    try {
      const response = await api.get<BaseResponse<PaginationResponse<StudentSessionItem> | StudentSessionItem[]>>('/tutors/pending-registrations');
      
      // Check BaseResponse structure
      if (response.data.statusCode !== 200 || !response.data.data) {
        return [];
      }
      
      const data = response.data.data;
      
      // Handle pagination if present
      if (data && typeof data === 'object' && 'content' in data) {
        return (data as PaginationResponse<StudentSessionItem>).content;
      }
      
      return Array.isArray(data) ? data as StudentSessionItem[] : [];
    } catch {
      return [];
    }
  },

  approveRegistration: async (studentSessionId: number): Promise<void> => {
    // API expects array of IDs
    await api.put<BaseResponse<GenericApiResponse>>(
      '/tutors/student-sessions/approve',
      [studentSessionId]
    );
  },

  rejectRegistration: async (studentSessionId: number): Promise<void> => {
    // API expects array of IDs
    await api.put<BaseResponse<GenericApiResponse>>(
      '/tutors/student-sessions/reject',
      [studentSessionId]
    );
  },

  // Tutor Schedule
  getTutorSchedule: async (): Promise<GenericApiResponse[]> => {
    // TODO: Replace with actual endpoint when available
    throw new Error('Tutor schedule API not yet implemented in backend');
  },

  // Tutor Profile Management
  registerAsTutor: async (data: TutorRegistrationData): Promise<GenericApiResponse> => {
    // Endpoint used in BecomeTutor.tsx
    const response = await api.post<BaseResponse<GenericApiResponse>>('/tutors', data);
    return response.data.data;
  },

  // Get tutor profile with subjects
  getTutorProfile: async (): Promise<GenericApiResponse> => {
    // GET /tutors/profile - requires authentication
    const response = await api.get<BaseResponse<GenericApiResponse>>('/tutors/profile');
    return response.data.data;
  },

  // Get subjects that tutor can teach from /tutors/profile
  getTutorSubjects: async (): Promise<SubjectDTO[]> => {
    try {
      const tutorProfile = await tutorApi.getTutorProfile();
      // Extract subjects from profile
      const subjects = (tutorProfile.subjects as SubjectDTO[]) || [];
      return subjects;
    } catch (error) {
      console.error('Error fetching tutor subjects:', error);
      return [];
    }
  },
};

export default api;
