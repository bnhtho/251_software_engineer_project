import { useState } from "react";
import {
  FileText,
  User,
  Calendar,
  Link as LinkIcon,
  Check,
  X,
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

  const handleApprove = (id: string) => {
    console.log("Approved material:", id);
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const handleReject = (id: string) => {
    console.log("Rejected material:", id);
    setMaterials(materials.filter((m) => m.id !== id));
  };

  const pendingCount = materials.length;
  const approvedToday = 12;
  const rejectedCount = 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 bg-teal-600 px-6 py-3 text-white">
        <p className="text-sm font-medium">Chế độ: Admin</p>
      </div>

      <div className="px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              Duyệt tài liệu
            </h1>
            <p className="text-sm text-gray-600">
              Xem xét và phê duyệt các tài liệu do gia sư gửi lên
            </p>
          </div>

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

                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleApprove(material.id)}
                        className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700"
                      >
                        <Check className="h-3 w-3" />
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(material.id)}
                        className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
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
                Nếu có chốc, cảnh giải rõ lý do để gia sư hiểu và chỉnh sửa
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

