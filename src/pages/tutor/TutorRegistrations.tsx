import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  User,
  BookOpen,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useUser } from "../../Context/UserContext";
import toast from "react-hot-toast";

interface Registration {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  sessionId: number;
  sessionSubject: string;
  sessionStartTime: string;
  sessionEndTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  registrationDate: string;
  notes?: string;
}

const TutorRegistrations = () => {
  const { user } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadRegistrations();
  }, [user]);

  const loadRegistrations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // TODO: Call real API
      // const response = await tutorApi.getPendingRegistrations(user.id);
      
      // Mock data
      setRegistrations([
        {
          id: 1,
          studentId: 101,
          studentName: "Nguyễn Văn A",
          studentEmail: "nguyenvana@hcmut.edu.vn",
          sessionId: 1,
          sessionSubject: "Giải tích 1",
          sessionStartTime: "2025-11-26T08:00:00",
          sessionEndTime: "2025-11-26T10:00:00",
          status: "PENDING",
          registrationDate: "2025-11-25T10:30:00",
          notes: "Muốn học thêm về tích phân",
        },
        {
          id: 2,
          studentId: 102,
          studentName: "Trần Thị B",
          studentEmail: "tranthib@hcmut.edu.vn",
          sessionId: 2,
          sessionSubject: "Vật lý 1",
          sessionStartTime: "2025-11-27T14:00:00",
          sessionEndTime: "2025-11-27T16:00:00",
          status: "PENDING",
          registrationDate: "2025-11-25T11:15:00",
        },
        {
          id: 3,
          studentId: 103,
          studentName: "Lê Văn C",
          studentEmail: "levanc@hcmut.edu.vn",
          sessionId: 3,
          sessionSubject: "Toán rời rạc",
          sessionStartTime: "2025-11-28T10:00:00",
          sessionEndTime: "2025-11-28T12:00:00",
          status: "APPROVED",
          registrationDate: "2025-11-24T09:00:00",
        },
        {
          id: 4,
          studentId: 104,
          studentName: "Phạm Thị D",
          studentEmail: "phamthid@hcmut.edu.vn",
          sessionId: 1,
          sessionSubject: "Giải tích 1",
          sessionStartTime: "2025-11-26T08:00:00",
          sessionEndTime: "2025-11-26T10:00:00",
          status: "REJECTED",
          registrationDate: "2025-11-24T15:30:00",
          notes: "Buổi học đã đầy",
        },
      ]);
    } catch (error) {
      console.error("Error loading registrations:", error);
      toast.error("Không thể tải danh sách đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId: number) => {
    try {
      setProcessingIds(prev => new Set(prev).add(registrationId));
      
      // TODO: Call real API
      // await tutorApi.approveRegistration(registrationId);
      
      setRegistrations(registrations.map(r => 
        r.id === registrationId ? { ...r, status: "APPROVED" as const } : r
      ));
      toast.success("Đã chấp nhận yêu cầu đăng ký");
    } catch (error) {
      console.error("Error approving registration:", error);
      toast.error("Không thể chấp nhận đăng ký");
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  const handleReject = async (registrationId: number) => {
    try {
      setProcessingIds(prev => new Set(prev).add(registrationId));
      
      // TODO: Call real API
      // await tutorApi.rejectRegistration(registrationId);
      
      setRegistrations(registrations.map(r => 
        r.id === registrationId ? { ...r, status: "REJECTED" as const } : r
      ));
      toast.success("Đã từ chối yêu cầu đăng ký");
    } catch (error) {
      console.error("Error rejecting registration:", error);
      toast.error("Không thể từ chối đăng ký");
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(registrationId);
        return newSet;
      });
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      searchTerm === "" ||
      reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.sessionSubject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "ALL" || reg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = registrations.filter(r => r.status === "PENDING").length;
  const approvedCount = registrations.filter(r => r.status === "APPROVED").length;
  const rejectedCount = registrations.filter(r => r.status === "REJECTED").length;

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
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quản lý đăng ký
                </h1>
                <p className="mt-1 text-gray-600">
                  Duyệt và quản lý yêu cầu đăng ký từ sinh viên
                </p>
              </div>
              <button
                onClick={loadRegistrations}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-yellow-100 p-2">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã chấp nhận</p>
                <p className="text-2xl font-semibold text-gray-900">{approvedCount}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đã từ chối</p>
                <p className="text-2xl font-semibold text-gray-900">{rejectedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sinh viên hoặc môn học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="APPROVED">Đã chấp nhận</option>
              <option value="REJECTED">Đã từ chối</option>
            </select>
          </div>
        </div>

        {/* Registrations List */}
        <div className="space-y-4">
          {filteredRegistrations.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Không có yêu cầu đăng ký nào
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || statusFilter !== "ALL"
                  ? "Thử thay đổi bộ lọc để xem thêm kết quả"
                  : "Chưa có sinh viên nào đăng ký buổi học của bạn"}
              </p>
            </div>
          ) : (
            filteredRegistrations.map((registration) => {
              const isProcessing = processingIds.has(registration.id);
              
              return (
                <div
                  key={registration.id}
                  className="rounded-lg border border-gray-200 bg-white p-6"
                >
                  <div className="flex items-start justify-between">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-100 p-3">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {registration.studentName}
                          </h3>
                          <p className="text-sm text-gray-600">{registration.studentEmail}</p>
                          
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <BookOpen className="h-4 w-4" />
                              <span className="font-medium">{registration.sessionSubject}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {formatDateTime(registration.sessionStartTime)} - 
                                {new Date(registration.sessionEndTime).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>Đăng ký lúc: {formatDateTime(registration.registrationDate)}</span>
                            </div>
                            {registration.notes && (
                              <div className="flex items-start gap-2 text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                                <MessageSquare className="h-4 w-4 mt-0.5" />
                                <span>{registration.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="flex flex-col items-end gap-3 ml-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          registration.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : registration.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {registration.status === "PENDING" && <Clock className="h-3 w-3" />}
                        {registration.status === "APPROVED" && <CheckCircle className="h-3 w-3" />}
                        {registration.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                        {registration.status === "PENDING"
                          ? "Chờ duyệt"
                          : registration.status === "APPROVED"
                          ? "Đã chấp nhận"
                          : "Đã từ chối"}
                      </span>

                      {registration.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(registration.id)}
                            disabled={isProcessing}
                            className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Chấp nhận
                          </button>
                          <button
                            onClick={() => handleReject(registration.id)}
                            disabled={isProcessing}
                            className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="h-4 w-4" />
                            Từ chối
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default TutorRegistrations;
