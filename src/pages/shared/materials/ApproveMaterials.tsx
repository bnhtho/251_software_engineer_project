import { useState } from "react";
import {
  FileText,
  User,
  Calendar,
  Link as LinkIcon,
  Check,
  X,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface PendingMaterial {
  id: string;
  title: string;
  category: string;
  description: string;
  author: string;
  email: string;
  date: string;
  link: string;
  views: number;
}

export default function ApproveMaterials() {
  const [materials, setMaterials] = useState<PendingMaterial[]>([
    {
      id: "1",
      title: "Bài tập Giải tích nâng cao",
      category: "Toán học",
      description:
        "Tài liệu đầy đủ về Giải tích 1, bao gồm đạo hàm, tích phân và ứng dụng",
      author: "TS. Nguyễn Văn A",
      email: "nguyenvana@hcmut.edu.vn",
      date: "25/10/2025",
      link: "https://drive.google.com/file/d/abc123",
      views: 0,
    },
    {
      id: "2",
      title: "Hướng dẫn thực hành Vật lý cơ năm thái đỉnh",
      category: "Vật lý",
      description: "Tài liệu hướng dẫn thực hành vật lý đại cương",
      author: "ThS. Trần Thị B",
      email: "tranthib@hcmut.edu.vn",
      date: "24/10/2025",
      link: "https://drive.google.com/file/d/def456",
      views: 0,
    },
    {
      id: "3",
      title: "Bài giảng Cơ học kỹ thuật - Động học",
      category: "Cơ khí",
      description: "Slide bài giảng động học cho sinh viên cơ khí",
      author: "PGS. Lê Văn C",
      email: "levanc@hcmut.edu.vn",
      date: "23/10/2025",
      link: "https://drive.google.com/file/d/ghi789",
      views: 0,
    },
    {
      id: "4",
      title: "Đề thi thử Kỹ thuật lập trình",
      category: "Tin học",
      description: "10 đề thi thử kèm theo đáp án",
      author: "TS. Phạm Thị D",
      email: "phamthid@hcmut.edu.vn",
      date: "22/10/2025",
      link: "https://drive.google.com/file/d/jkl012",
      views: 0,
    },
    {
      id: "5",
      title: "Thiết kế kết cấu thép - Giáo trình và bài tập",
      category: "Xây dựng",
      description: "Giáo trình thiết kế kết cấu thép đầy đủ",
      author: "PGS.TS. Hoàng Văn E",
      email: "hoangvane@hcmut.edu.vn",
      date: "21/10/2025",
      link: "https://drive.google.com/file/d/mno345",
      views: 0,
    },
  ]);

  // States cho modal và processing theo Activity Diagram
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');
  const [selectedMaterial, setSelectedMaterial] = useState<PendingMaterial | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Implement theo Use Case UC02: Admin kiểm tra và duyệt tài liệu
  const handleApprove = async (material: PendingMaterial) => {
    // Step 1: Admin chọn chức năng Duyệt tài liệu (đã có)
    // Step 2: Xem thông tin tài liệu do gia sư gửi (đã có)
    // Step 3: Chọn "Duyệt"
    setSelectedMaterial(material);
    setModalType('approve');
    setShowModal(true);
  };

  const handleReject = async (material: PendingMaterial) => {
    // Step 3: Chọn "Từ chối"
    setSelectedMaterial(material);
    setModalType('reject');
    setShowModal(true);
  };

  // Implement theo Sequence Diagram: processReview(documentID, decision)
  const confirmAction = async () => {
    if (!selectedMaterial) return;

    setIsProcessing(true);
    setShowModal(false);

    try {
      // Step 4: Hệ thống cập nhật trạng thái tài liệu theo Activity Diagram
      console.log(`Processing ${modalType} for material:`, selectedMaterial.id);
      
      // Simulate API call - processReview(documentID, decision)
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (modalType === 'approve') {
        // Step 5: Hệ thống gửi thông báo "Đã duyệt" cho Gia sư
        // updateStatus(documentID, status) -> success
        setNotificationMessage(`Tài liệu "${selectedMaterial.title}" đã được duyệt thành công!`);
      } else {
        // Step 5: Hệ thống gửi thông báo "Từ chối" (kèm lý do) cho Gia sư
        setNotificationMessage(`Tài liệu "${selectedMaterial.title}" đã bị từ chối!`);
      }

      // Step 6: Hệ thống hiển thị thông báo xử lý thành công cho Admin
      setShowNotification(true);
      
      // Remove material from list - Step 6: Tài liệu được công khai cho sinh viên có thể truy cập
      setMaterials(materials.filter(m => m.id !== selectedMaterial.id));

      // Auto hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);

    } catch (error) {
      // Exception Flow: Lỗi DB khi cập nhật trạng thái
      console.error("Processing failed:", error);
      setNotificationMessage('Có lỗi xảy ra khi xử lý tài liệu!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setIsProcessing(false);
      setSelectedMaterial(null);
    }
  };

  const cancelAction = () => {
    setShowModal(false);
    setSelectedMaterial(null);
  };

  // Stats
  const pendingCount = materials.length;
  const approvedToday = 12;
  const rejectedCount = 3;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success/Error Notification - theo Step 6 */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-md rounded-lg bg-white p-4 shadow-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-gray-900">{notificationMessage}</p>
          </div>
        </div>
      )}

      {/* Processing Modal - theo Activity Diagram */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative mx-4 w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl">
            <div className="text-center">
              <Clock className="mx-auto mb-4 h-12 w-12 text-blue-600 animate-spin" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Đang xử lý...
              </h3>
              <p className="text-sm text-gray-600">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal - theo Use Case Main Flow */}
      {showModal && selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative mx-4 w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl">
            <div className="text-center">
              <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                modalType === 'approve' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {modalType === 'approve' ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {modalType === 'approve' ? 'Xác nhận duyệt tài liệu' : 'Xác nhận từ chối tài liệu'}
              </h3>
              
              <p className="mb-4 text-sm text-gray-600">
                Bạn có chắc chắn muốn {modalType === 'approve' ? 'duyệt' : 'từ chối'} tài liệu:
              </p>
              
              <div className="mb-6 rounded-lg bg-gray-50 p-3 text-left">
                <p className="font-medium text-gray-900">{selectedMaterial.title}</p>
                <p className="text-sm text-gray-500">Tác giả: {selectedMaterial.author}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelAction}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmAction}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    modalType === 'approve'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                >
                  {modalType === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 bg-teal-600 px-6 py-3 text-white">
        <p className="text-sm font-medium">Chế độ: Admin</p>
      </div>

      <div className="px-6">
        <div className="mx-auto max-w-7xl">
          {/* Page Title - theo Use Case: Admin chọn chức năng Duyệt tài liệu */}
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              Duyệt tài liệu
            </h1>
            <p className="text-sm text-gray-600">
              Xem xét và phê duyệt các tài liệu do gia sư gửi lên hệ thống
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Chờ duyệt</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingCount}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Đã duyệt hôm nay</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {approvedToday}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-gray-600">Từ chối hôm nay</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rejectedCount}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Materials Table - Step 2: Xem thông tin tài liệu do gia sư gửi */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase text-gray-700">
                <div className="col-span-3">Tài liệu</div>
                <div className="col-span-2">Người gửi</div>
                <div className="col-span-2">Ngày gửi</div>
                <div className="col-span-3">Link</div>
                <div className="col-span-2 text-center">Hành động</div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="px-6 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-3">
                      <div className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div>
                          <h3 className="mb-0.5 text-sm font-medium text-gray-900">
                            {material.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {material.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {material.author}
                          </p>
                          <p className="text-xs text-gray-500">
                            {material.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900">{material.date}</p>
                      </div>
                    </div>

                    <div className="col-span-3">
                      <a
                        href={material.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <LinkIcon className="h-4 w-4" />
                        <span className="truncate">Xem tài liệu</span>
                      </a>
                    </div>

                    {/* Action buttons - Step 3: Chọn "Duyệt" hoặc "Từ chối" */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleApprove(material)}
                        disabled={isProcessing}
                        className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Check className="h-3 w-3" />
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(material)}
                        disabled={isProcessing}
                        className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <X className="h-3 w-3" />
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines - giữ nguyên nội dung cũ */}
          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
              <FileText className="h-4 w-4" />
              Hướng dẫn duyệt tài liệu
            </h3>
            <ul className="list-decimal space-y-1 pl-5 text-xs text-blue-800">
              <li>
                Kiểm tra nội dung tài liệu có phù hợp với mục đích học tập không
              </li>
              <li>Đảm bảo link tài liệu có thể truy cập và xem được</li>
              <li>
                Kiểm tra tài liệu không vi phạm bản quyền, chứa nội dung không
                phù hợp
              </li>
              <li>
                Nếu có vấn đề, giải thích rõ lý do để gia sư hiểu và chỉnh sửa
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

