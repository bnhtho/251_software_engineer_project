import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Users } from "lucide-react";
import { scheduleApi, publicApi } from "../../services/api";
import toast from "react-hot-toast";

interface BackendSessionDTO {
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
}

interface SubjectDTO {
  id: number;
  name: string;
}

const AdminSessions = () => {
  const [sessions, setSessions] = useState<BackendSessionDTO[]>([]);
  const [subjects, setSubjects] = useState<SubjectDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<BackendSessionDTO | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    subjectId: 0,
    startTime: "",
    endTime: "",
    format: "OFFLINE",
    location: "",
    maxQuantity: 30,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sessionsData, subjectsData] = await Promise.all([
        scheduleApi.getAllSessions(),
        publicApi.getSubjects(),
      ]);
      setSessions(sessionsData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSession) {
        await scheduleApi.updateSession(editingSession.id, formData);
        toast.success("Cập nhật buổi học thành công");
      } else {
        await scheduleApi.createSession(formData);
        toast.success("Tạo buổi học thành công");
      }
      setShowModal(false);
      setEditingSession(null);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error("Error saving session:", error);

      // Handle 403 - only tutor can edit their own sessions
      if (error?.response?.status === 403) {
        toast.error(editingSession
          ? "Chỉ gia sư tạo buổi học mới có quyền chỉnh sửa"
          : "Không có quyền tạo buổi học. Vui lòng đăng nhập bằng tài khoản gia sư.");
      } else {
        toast.error(editingSession ? "Không thể cập nhật" : "Không thể tạo buổi học");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa buổi học này?")) return;
    try {
      await scheduleApi.deleteSession(id);
      toast.success("Xóa buổi học thành công");
      loadData();
    } catch (error: any) {
      console.error("Error deleting session:", error);

      // Handle 403 - only tutor can delete their own sessions
      if (error?.response?.status === 403) {
        toast.error("Chỉ gia sư tạo buổi học mới có quyền xóa");
      } else {
        toast.error("Không thể xóa buổi học");
      }
    }
  };

  const handleEdit = (session: BackendSessionDTO) => {
    setEditingSession(session);
    setFormData({
      subjectId: 0, // Would need subject mapping
      startTime: session.startTime,
      endTime: session.endTime,
      format: session.format,
      location: session.location,
      maxQuantity: session.maxQuantity,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      subjectId: 0,
      startTime: "",
      endTime: "",
      format: "OFFLINE",
      location: "",
      maxQuantity: 30,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSession(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý buổi học</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý các buổi học/lịch học</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Tạo buổi học mới
        </button>
      </div>

      {/* Permission Notice */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-800">Lưu ý về quyền hạn</h3>
            <p className="mt-1 text-sm text-yellow-700">
              Chỉ <strong>gia sư tạo buổi học</strong> mới có quyền chỉnh sửa hoặc xóa.
              Admin chỉ có thể xem danh sách và tạo buổi học mới (nếu đăng nhập với role Tutor).
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Tổng buổi học</p>
              <p className="text-2xl font-semibold text-gray-900">{sessions.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Học viên đã đăng ký</p>
              <p className="text-2xl font-semibold text-gray-900">
                {sessions.reduce((sum, s) => sum + s.currentQuantity, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Sức chứa tối đa</p>
              <p className="text-2xl font-semibold text-gray-900">
                {sessions.reduce((sum, s) => sum + s.maxQuantity, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Môn học
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  gia sư
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Thời gian
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Địa điểm
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Học viên
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Chưa có buổi học nào
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      #{session.id}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {session.subjectName}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {session.tutorName}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(session.startTime).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        {session.format === 'ONLINE' ? '💻' : '🏫'}
                        <span className="truncate max-w-[150px]" title={session.location}>
                          {session.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${session.currentQuantity >= session.maxQuantity
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                          }`}
                      >
                        {session.currentQuantity}/{session.maxQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(session)}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(session.id)}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              {editingSession ? "Chỉnh sửa buổi học" : "Tạo buổi học mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Môn học
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value={0}>Chọn môn học</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian bắt đầu
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hình thức
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="OFFLINE">Offline</option>
                  <option value="ONLINE">Online</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm / Link
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder={formData.format === 'ONLINE' ? 'https://meet.google.com/...' : 'Phòng A101'}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sức chứa tối đa
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxQuantity}
                  onChange={(e) => setFormData({ ...formData, maxQuantity: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  {editingSession ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSessions;

