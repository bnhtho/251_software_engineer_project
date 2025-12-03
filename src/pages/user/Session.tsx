import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  RefreshCw,
  Eye,
  UserPlus,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useUser } from '../../Context/UserContext';
import { courseApi } from '../../services/api';
import toast from 'react-hot-toast';

// Types
interface Session {
  id: number;
  tutorName: string;
  studentNames: string[];
  subjectName: string;
  startTime: string;
  endTime: string;
  format: string;
  location: string;
  maxQuantity: number;
  currentQuantity: number;
  updatedDate: string;
  status?: string;
  sessionStatus?: string;
  isRegistered?: boolean;
}

interface StudentSession {
  id: number;
  studentId: number;
  studentName?: string;
  sessionId: number;
  sessionSubject: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionLocation: string;
  sessionFormat: string;
  sessionStatus: string;
  confirmedDate?: string;
  registeredDate: string;
  updatedDate: string;
  status: string;
}

const SessionCard: React.FC<{
  session: Session;
  onRegister: (sessionId: number) => void;
  onViewDetails: (session: Session) => void;
  isRegistered: boolean;
  loading: boolean;
}> = ({ session, onRegister, onViewDetails, isRegistered, loading }) => {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('vi-VN'),
        time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return { date: 'N/A', time: 'N/A' };
    }
  };

  const startDateTime = formatDateTime(session.startTime);
  const endDateTime = formatDateTime(session.endTime);

  const getStatusBadge = (status?: string, sessionStatus?: string) => {
    const displayStatus = sessionStatus || status;
    const statusMap = {
      'SCHEDULED': { label: 'Đã lên lịch', color: 'bg-blue-100 text-blue-800' },
      'COMPLETED': { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
      'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
      'RESCHEDULED': { label: 'Đã chuyển lịch', color: 'bg-yellow-100 text-yellow-800' },
      'FULL': { label: 'Đã đầy', color: 'bg-red-100 text-red-800' },
      'OPEN': { label: 'Có thể đăng ký', color: 'bg-green-100 text-green-800' },
      'PENDING': { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
    };
    
    const statusInfo = statusMap[displayStatus as keyof typeof statusMap] || { label: 'Chờ xác nhận', color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const isFull = session.currentQuantity >= session.maxQuantity;
  const isAvailable = !isFull && (session.status === 'OPEN' || session.sessionStatus !== 'CANCELLED');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.subjectName}</h3>
          <p className="text-sm text-gray-600 mb-1">Giảng viên: {session.tutorName}</p>
          {getStatusBadge(session.status, session.sessionStatus)}
        </div>
        <div className="text-right">
          <span className={`text-sm font-medium ${
            isFull ? 'text-red-600' : 
            session.currentQuantity > session.maxQuantity * 0.8 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {session.currentQuantity}/{session.maxQuantity}
          </span>
          <p className="text-xs text-gray-500 mt-1">Học viên</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {startDateTime.date}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {startDateTime.time} - {endDateTime.time}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="capitalize">{session.format.toLowerCase()}</span> - {session.location}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(session)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Eye className="h-4 w-4" />
          Chi tiết
        </button>
        
        {!isRegistered ? (
          <button
            onClick={() => onRegister(session.id)}
            disabled={loading || !isAvailable}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
              loading || !isAvailable
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            {loading ? 'Đang đăng ký...' : 
             isFull ? 'Đã đầy' : 
             session.status === 'CANCELLED' || session.sessionStatus === 'CANCELLED' ? 'Đã hủy' :
             'Đăng ký'}
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-800 rounded-md">
            <CheckCircle className="h-4 w-4" />
            Đã đăng ký
          </div>
        )}
      </div>
    </div>
  );
};

const SessionDetailModal: React.FC<{
  session: Session | null;
  onClose: () => void;
}> = ({ session, onClose }) => {
  if (!session) return null;

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết buổi học</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">{session.subjectName}</h3>
              <p className="text-gray-600">Giảng viên: <span className="font-medium">{session.tutorName}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thời gian</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Bắt đầu: {formatDateTime(session.startTime)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Kết thúc: {formatDateTime(session.endTime)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Địa điểm</h4>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="capitalize">{session.format.toLowerCase()}</span>
                  </div>
                  <p className="mt-1">{session.location}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Thông tin lớp học</h4>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Users className="h-4 w-4 mr-2" />
                Số lượng: {session.currentQuantity}/{session.maxQuantity} học viên
              </div>
              {session.studentNames.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Danh sách học viên đã đăng ký:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {session.studentNames.map((name, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionsPage: React.FC = () => {
  const { user, isLoading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState<'available' | 'registered'>('available');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [registeredSessions, setRegisteredSessions] = useState<StudentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Get token from localStorage
  const token = localStorage.getItem('authToken');

  // Refresh function for the refresh button
  const refreshData = useCallback(async () => {
    if (!token || userLoading) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch available sessions using API service
      const sessionsData = await courseApi.getCourses();
      
      // Transform courseApi response to Session format
      const transformedSessions: Session[] = sessionsData.map(course => {
        // Combine date and time to create full ISO timestamp
        let startTime = course.startDate;
        let endTime = course.endDate;
        
        // If we have timeslot info, combine date with time
        if (course.timeslots && course.timeslots[0]) {
          const timeslot = course.timeslots[0];
          // startDate is like "2024-01-01", startTime is like "08:00"
          startTime = `${course.startDate}T${timeslot.startTime}:00Z`;
          endTime = `${course.endDate}T${timeslot.endTime}:00Z`;
        }
        
        return {
          id: course.id,
          tutorName: course.tutorName,
          studentNames: [], // Will be populated from course details if needed
          subjectName: course.subjectName,
          startTime,
          endTime,
          format: course.timeslots?.[0]?.locationType || 'OFFLINE',
          location: course.timeslots?.[0]?.location || 'TBA',
          maxQuantity: course.capacity,
          currentQuantity: course.enrolled,
          updatedDate: course.updateDate,
          status: course.status,
          sessionStatus: course.status === 'FULL' ? 'FULL' : 'SCHEDULED',
        };
      });
      
      setSessions(transformedSessions);

      // Fetch registered sessions if user exists
      if (user?.id) {
        try {
          // Fetch student courses without passing user.id to avoid 403 errors
          const studentCourses = await courseApi.getStudentCourses();
          
          // Transform to StudentSession format
          const transformedRegisteredSessions: StudentSession[] = studentCourses.map(sc => ({
              id: sc.id,
              studentId: sc.studentId,
              sessionId: sc.courseId,
              sessionSubject: sc.course.subjectName || 'N/A',
              sessionStartTime: sc.sessionStartTime || new Date().toISOString(),
              sessionEndTime: sc.sessionEndTime || new Date().toISOString(),
              sessionLocation: sc.sessionLocation || 'TBA',
              sessionFormat: sc.sessionFormat || 'OFFLINE',
              sessionStatus: sc.status === 'APPROVED' ? 'SCHEDULED' : sc.status,
              registeredDate: sc.registrationDate,
              updatedDate: new Date().toISOString(),
              status: sc.status,
            }
          ));
          
          setRegisteredSessions(transformedRegisteredSessions);
        } catch (error) {
          console.error('Error fetching registered sessions:', error);
          // Don't show error toast for this since it might be normal for some users
          setRegisteredSessions([]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  }, [token, user?.id, userLoading]);

  // Register for a session
  const handleRegister = async (sessionId: number) => {
    if (!user?.id || !token) {
      toast.error('Vui lòng đăng nhập để đăng ký buổi học');
      return;
    }

    // Check if session is already registered
    if (isSessionRegistered(sessionId)) {
      toast.error('Bạn đã đăng ký buổi học này rồi');
      return;
    }

    // Check if session is full
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.currentQuantity >= session.maxQuantity) {
      toast.error('Buổi học đã đầy số lượng');
      return;
    }

    setRegistering(sessionId);

    try {
      await courseApi.registerCourse({
        courseId: sessionId,
        studentId: user.id,
        notes: ''
      });
      
      toast.success('Đăng ký buổi học thành công! Chờ giảng viên xác nhận.');
      await refreshData();
    } catch (err: unknown) {
      console.error('Error registering for session:', err);
      
      let errorMessage = 'Không thể đăng ký buổi học';
      
      const getErrorMessage = (error: unknown): string | undefined => {
        if (!error) return undefined;
        if (typeof error === 'string') return error;
        if (error instanceof Error && typeof error.message === 'string') return error.message;
        if (typeof error === 'object' && error !== null) {
          const obj = error as Record<string, unknown>;
          const resp = obj['response'];
          if (typeof resp === 'object' && resp !== null) {
            const respObj = resp as Record<string, unknown>;
            const data = respObj['data'];
            if (typeof data === 'object' && data !== null) {
              const dataObj = data as Record<string, unknown>;
              const msg = dataObj['message'];
              if (typeof msg === 'string') return msg;
            }
          }
          const msgProp = obj['message'];
          if (typeof msgProp === 'string') return msgProp;
        }
        return undefined;
      };
      
      const extracted = getErrorMessage(err);
      
      if (extracted) {
        if (extracted.includes('Session is not available')) {
          errorMessage = 'Buổi học này hiện tại không thể đăng ký';
        } else if (extracted.includes('already registered')) {
          errorMessage = 'Bạn đã đăng ký buổi học này rồi';
        } else if (extracted.includes('session is full')) {
          errorMessage = 'Buổi học đã đầy số lượng';
        } else {
          errorMessage = extracted;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setRegistering(null);
    }
  };

  useEffect(() => {
    if (!userLoading) {
      refreshData();
    }
  }, [refreshData, userLoading]);

  // Filter sessions based on search
  const filteredSessions = sessions.filter(session =>
    session.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.tutorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if session is registered
  const isSessionRegistered = (sessionId: number) => {
    return registeredSessions.some(rs => rs.sessionId === sessionId);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký buổi học</h1>
          <p className="text-gray-600">Tìm kiếm và đăng ký các buổi học phù hợp với bạn</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('available')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'available'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Buổi học có sẵn ({filteredSessions.length})
              </button>
              <button
                onClick={() => setActiveTab('registered')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'registered'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Đã đăng ký ({registeredSessions.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên môn học hoặc giảng viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              refreshData();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        {/* Content based on active tab */}
        {userLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải thông tin người dùng...</span>
          </div>
        ) : (
          <>
            {activeTab === 'available' && (
              <div>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Đang tải...</span>
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không có buổi học nào</h3>
                    <p className="text-gray-600">Hiện tại chưa có buổi học nào phù hợp với tìm kiếm của bạn.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onRegister={handleRegister}
                        onViewDetails={setSelectedSession}
                        isRegistered={isSessionRegistered(session.id)}
                        loading={registering === session.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'registered' && (
              <div>
                {registeredSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa đăng ký buổi học nào</h3>
                    <p className="text-gray-600">Bạn chưa đăng ký tham gia buổi học nào. Hãy chuyển sang tab "Buổi học có sẵn" để đăng ký!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registeredSessions.map((session) => (
                      <div key={session.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.sessionSubject}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(session.sessionStartTime).toLocaleString('vi-VN')}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span className="capitalize">{session.sessionFormat.toLowerCase()}</span> - {session.sessionLocation}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'APPROVED' || session.sessionStatus === 'COMPLETED' 
                                ? 'bg-green-100 text-green-800'
                                : session.status === 'PENDING' || session.sessionStatus === 'SCHEDULED'
                                ? 'bg-blue-100 text-blue-800' 
                                : session.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {session.status === 'APPROVED' || session.sessionStatus === 'COMPLETED' 
                                ? 'Đã phê duyệt'
                                : session.status === 'PENDING' || session.sessionStatus === 'SCHEDULED'
                                ? 'Chờ xác nhận'
                                : session.status === 'REJECTED'
                                ? 'Đã từ chối' 
                                : 'Chờ xử lý'
                              }
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              Đăng ký: {new Date(session.registeredDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Session Detail Modal */}
      <SessionDetailModal
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </div>
  );
};

export default SessionsPage;
