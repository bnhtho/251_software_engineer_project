import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Laptop,
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import type { BaseResponse } from '../../types/api';
import toast from 'react-hot-toast';

interface SessionDTO {
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
  sessionStatus?: string;
}

interface PaginatedResponse {
  content: SessionDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const Sessions = () => {
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [pendingSessions, setPendingSessions] = useState<SessionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pendingPage, setPendingPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pendingTotalPages, setPendingTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Load all sessions with pagination
  const loadAllSessions = async (page: number = 0) => {
    try {
      const response = await api.get<BaseResponse<PaginatedResponse>>(`/sessions?page=${page}`);
      const data = response.data.data;

      if (data && Array.isArray(data.content)) {
        setSessions(data.content);
        setTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error loading all sessions:', error);
      toast.error('Không thể tải danh sách buổi học');
    }
  };

  // Load pending sessions with pagination
  // Load pending sessions with pagination COME WITH TUTOR_ID
  const loadPendingSessions = async (page: number = 0) => {
    try {
      const response = await api.get<BaseResponse<PaginatedResponse>>(`/admin/sessions/pending?page=${page}`);
      const data = response.data.data;

      if (data && Array.isArray(data.content)) {
        setPendingSessions(data.content);
        setPendingTotalPages(data.totalPages || 0);
      }
    } catch (error) {
      console.error('Error loading pending sessions:', error);
      toast.error('Không thể tải danh sách buổi học chờ duyệt');
    }
  };
  // --------------------------------------
  // const fetch
  // --------------------------------------
  // Approve session
  const approveSession = async (sessionId: number) => {
    try {
      await api.put(`/admin/sessions/${sessionId}?setStatus=SCHEDULED`);
      toast.success('Phê duyệt buổi học thành công!');
      // Reload both lists
      loadPendingSessions(pendingPage);
      loadAllSessions(currentPage);
    } catch (error) {
      console.error('Error approving session:', error);
      toast.error('Không thể phê duyệt buổi học');
    }
  };

  // Reject session
  const rejectSession = async (sessionId: number) => {
    try {
      await api.put(`/admin/sessions/${sessionId}?setStatus=CANCELLED`);
      toast.success('Từ chối buổi học thành công!');
      // Reload both lists
      loadPendingSessions(pendingPage);
      loadAllSessions(currentPage);
    } catch (error) {
      console.error('Error rejecting session:', error);
      toast.error('Không thể từ chối buổi học');
    }
  };

  // Initial load
  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadAllSessions(0),
      loadPendingSessions(0)
    ]).finally(() => setLoading(false));
  }, []);

  // Handle pagination
  const handlePageChange = (newPage: number, type: 'all' | 'pending') => {
    if (type === 'all') {
      setCurrentPage(newPage);
      loadAllSessions(newPage);
    } else {
      setPendingPage(newPage);
      loadPendingSessions(newPage);
    }
  };

  // Filter sessions based on search and status
  const getFilteredSessions = (sessionsList: SessionDTO[]) => {
    return sessionsList.filter(session => {
      const matchesSearch = searchTerm === '' ||
        session.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === '' || session.format === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Duyệt buổi học
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Quản lý những buổi học trong hệ thống.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Tổng buổi học</h3>
              <p className="text-2xl font-bold text-blue-600">{sessions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Chờ duyệt</h3>
              <p className="text-2xl font-bold text-orange-600">{pendingSessions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Tổng Sinh viên</h3>
              <p className="text-2xl font-bold text-green-600">
                {sessions.reduce((total, session) => total + session.currentQuantity, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'pending'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Buổi học chờ duyệt ({pendingSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'all'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Tất cả buổi học ({sessions.length})
            </button>
          </nav>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo giảng viên, môn học, địa điểm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả hình thức</option>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="p-6">
          {activeTab === 'pending' ? (
            <SessionsList
              sessions={getFilteredSessions(pendingSessions)}
              showActions={true}
              onApprove={approveSession}
              onReject={rejectSession}
              emptyMessage="Không có buổi học nào chờ duyệt"
            />
          ) : (
            <SessionsList
              sessions={getFilteredSessions(sessions)}
              showActions={false}
              emptyMessage="Không có buổi học nào"
            />
          )}
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={activeTab === 'pending' ? pendingPage : currentPage}
            totalPages={activeTab === 'pending' ? pendingTotalPages : totalPages}
            onPageChange={(page) => handlePageChange(page, activeTab)}
          />
        </div>
      </div>
    </div>
  );
};

// Sessions List Component
interface SessionsListProps {
  sessions: SessionDTO[];
  showActions: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  emptyMessage: string;
}

const SessionsList: React.FC<SessionsListProps> = ({
  sessions,
  showActions,
  onApprove,
  onReject,
  emptyMessage
}) => {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <div key={session.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-lg font-medium text-gray-900">{session.subjectName}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${session.format === 'ONLINE'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
                  }`}>
                  {session.format === 'ONLINE' ? (
                    <>
                      <Laptop className="w-3 h-3 mr-1" />
                      Online
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3 mr-1" />
                      Offline
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Giảng viên</p>
                  <p className="font-medium">{session.tutorName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Thời gian bắt đầu</p>
                  <p className="font-medium">{formatDateTime(session.startTime)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Thời gian kết thúc</p>
                  <p className="font-medium">{formatDateTime(session.endTime)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Địa điểm</p>
                  <p className="font-medium">{session.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Sinh viên</p>
                  <p className="font-medium">{session.currentQuantity}/{session.maxQuantity}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cập nhật</p>
                  <p className="font-medium">{formatDateTime(session.updatedDate)}</p>
                </div>
              </div>

              {session.studentNames && session.studentNames.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-500 text-sm mb-2">Sinh viên đã đăng ký:</p>
                  <div className="flex flex-wrap gap-1">
                    {session.studentNames.map((name, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onApprove?.(session.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Phê duyệt
                </button>
                <button
                  onClick={() => onReject?.(session.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Từ chối
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 text-sm text-gray-700">
          Trang {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-sm text-gray-500">
        Hiển thị {Math.min((currentPage * 10) + 1, totalPages * 10)} - {Math.min((currentPage + 1) * 10, totalPages * 10)} trên tổng số {totalPages * 10}
      </div>
    </div>
  );
};

export default Sessions;

