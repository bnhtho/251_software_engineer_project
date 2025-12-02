import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useUser } from '../../Context/UserContext';
import toast from 'react-hot-toast';

interface RegistrationRequest {
  id: number;
  studentName: string;
  sessionSubject: string;
  sessionDate: string;
  sessionTime: string;
  registrationDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
}

const TutorRegistrationsPage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<RegistrationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadRegistrations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      // TODO: Call real API when available
      // For now, use mock data
      setRegistrations([
        {
          id: 1,
          studentName: 'Nguyễn Văn A',
          sessionSubject: 'Giải tích 1',
          sessionDate: '2025-12-05',
          sessionTime: '08:00 - 10:00',
          registrationDate: '2025-12-02T10:30:00',
          status: 'PENDING',
          notes: 'Học viên mới, cần hỗ trợ thêm',
        },
        {
          id: 2,
          studentName: 'Trần Thị B',
          sessionSubject: 'Vật lý 1',
          sessionDate: '2025-12-06',
          sessionTime: '14:00 - 16:00',
          registrationDate: '2025-12-02T11:15:00',
          status: 'PENDING',
        },
        {
          id: 3,
          studentName: 'Lê Văn C',
          sessionSubject: 'Toán rời rạc',
          sessionDate: '2025-12-04',
          sessionTime: '10:00 - 12:00',
          registrationDate: '2025-12-01T09:20:00',
          status: 'APPROVED',
        },
      ]);
    } catch (error) {
      console.error('Error loading registrations:', error);
      toast.error('Không thể tải danh sách đăng ký');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const handleApprove = async (registrationId: number) => {
    try {
      // TODO: Call real API
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === registrationId
            ? { ...reg, status: 'APPROVED' as const }
            : reg
        )
      );
      toast.success('Đã phê duyệt đăng ký!');
    } catch {
      toast.error('Không thể phê duyệt đăng ký');
    }
  };

  const handleReject = async (registrationId: number) => {
    try {
      // TODO: Call real API
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === registrationId
            ? { ...reg, status: 'REJECTED' as const }
            : reg
        )
      );
      toast.success('Đã từ chối đăng ký!');
    } catch {
      toast.error('Không thể từ chối đăng ký');
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = searchTerm === '' || 
      reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.sessionSubject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || reg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const pendingCount = registrations.filter(r => r.status === 'PENDING').length;
  const approvedCount = registrations.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = registrations.filter(r => r.status === 'REJECTED').length;

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
    <>
      <title>Quản lý đăng ký</title>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Quản lý Đăng ký
            </h1>
            <p className="mt-1 text-gray-600">
              Duyệt và quản lý các yêu cầu đăng ký từ sinh viên
            </p>
          </div>
          <button
            onClick={loadRegistrations}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="mt-2 text-3xl font-semibold text-orange-600">
                  {pendingCount}
                </p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                <p className="mt-2 text-3xl font-semibold text-green-600">
                  {approvedCount}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã từ chối</p>
                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {rejectedCount}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sinh viên hoặc môn học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Đã từ chối</option>
            </select>
          </div>
        </div>

        {/* Registrations List */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
          {filteredRegistrations.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Không có đăng ký nào
              </h3>
              <p className="mt-2 text-gray-500">
                Chưa có yêu cầu đăng ký nào từ sinh viên.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <div key={registration.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {registration.studentName}
                        </h3>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            registration.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : registration.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {registration.status === 'PENDING'
                            ? 'Chờ duyệt'
                            : registration.status === 'APPROVED'
                            ? 'Đã duyệt'
                            : 'Đã từ chối'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Môn học</p>
                          <p className="font-medium">{registration.sessionSubject}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Ngày học</p>
                          <p className="font-medium">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            {new Date(registration.sessionDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Giờ học</p>
                          <p className="font-medium">
                            <Clock className="inline h-4 w-4 mr-1" />
                            {registration.sessionTime}
                          </p>
                        </div>
                        <div className="md:col-span-3">
                          <p className="text-gray-500">Thời gian đăng ký</p>
                          <p className="font-medium">{formatDateTime(registration.registrationDate)}</p>
                        </div>
                      </div>

                      {registration.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{registration.notes}</p>
                        </div>
                      )}
                    </div>

                    {registration.status === 'PENDING' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApprove(registration.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Phê duyệt
                        </button>
                        <button
                          onClick={() => handleReject(registration.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
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
          )}
        </div>
      </div>
    </>
  );
};

export default TutorRegistrationsPage;