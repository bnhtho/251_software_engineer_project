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
  getCourses: async (params?: CourseSearchParams): Promise<CourseDTO[]> => {
    // Try student endpoint first, fallback to sessions endpoint for admin
    let sessions: BackendSessionDTO[] = [];
    
    try {
      // Try GET /students/available-sessions (for STUDENT role)
      const response = await api.get<BaseResponse<BackendSessionDTO[]>>("/students/available-sessions");
      sessions = response.data.data;
      
      // If empty, try /sessions as fallback
      if (!sessions || sessions.length === 0) {
        console.log("No available sessions, trying /sessions as fallback...");
        const fallbackResponse = await api.get<BaseResponse<BackendSessionDTO[]>>("/sessions");
        sessions = fallbackResponse.data.data;
      }
    } catch (error: any) {
      // If 403, user might be ADMIN, try GET /sessions instead
      if (error?.response?.status === 403) {
        console.log("Student endpoint forbidden, trying /sessions for admin...");
        const response = await api.get<BaseResponse<BackendSessionDTO[]>>("/sessions");
        sessions = response.data.data;
      } else {
        throw error; // Re-throw other errors
      }
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
    const response = await api.post<BaseResponse<any>>(
      `/students/register-session?sessionId=${registration.courseId}`
    );
    return {
      id: response.data.data.id,
      status: 'PENDING',
      message: response.data.message,
    };
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
        console.log("Cannot access student history (probably admin viewing student page)");
        return [];
      }
      throw error;
    }
  },

  cancelRegistration: async (registrationId: number): Promise<boolean> => {
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
      `/students/history/${studentId}`
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
      status: item.status === 'CONFIRMED' ? 'SCHEDULED' : item.status,
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
      status: 'SCHEDULED',
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
};

export default api;
