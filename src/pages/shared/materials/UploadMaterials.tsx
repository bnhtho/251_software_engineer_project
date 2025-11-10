import { useState } from "react";
import { FileText, Link as LinkIcon, AlertCircle, Save, X } from "lucide-react";
import type {
  MaterialFormData,
  SubmittedMaterial,
} from "./types/material.types";

export default function UploadMaterials() {
  const [formData, setFormData] = useState<MaterialFormData>({
    title: "",
    category: "",
    description: "",
    link: "",
  });

  const [errors, setErrors] = useState<Partial<MaterialFormData>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = ["Toán học", "Vật lý", "Tin học", "Hóa học", "Cơ khí"];

  const submittedMaterials: SubmittedMaterial[] = [
    {
      id: "1",
      title: "Bài tập Giải tích nâng cao",
      category: "Toán học",
      description: "",
      author: "Gia sư",
      date: "29/10/2025",
      views: 0,
      status: "pending",
      submittedDate: "29/10/2025",
    },
    {
      id: "2",
      title: "Slide Cấu trúc dữ liệu",
      category: "Tin học",
      description: "",
      author: "Gia sư",
      date: "20/10/2025",
      views: 0,
      status: "approved",
      submittedDate: "20/10/2025",
    },
    {
      id: "3",
      title: "Đề cương ôn tập Vật lý",
      category: "Vật lý",
      description: "",
      author: "Gia sư",
      date: "15/10/2025",
      views: 0,
      status: "approved",
      submittedDate: "15/10/2025",
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<MaterialFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề";
    }

    if (!formData.category) {
      newErrors.category = "Vui lòng chọn danh mục";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả";
    }

    if (!formData.link.trim()) {
      newErrors.link = "Vui lòng nhập link tài liệu";
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = "Link không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Submitting material:", formData);
      setShowSuccess(true);

      setFormData({
        title: "",
        category: "",
        description: "",
        link: "",
      });
      setErrors({});

      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      link: "",
    });
    setErrors({});
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    const labels = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Từ chối",
    };
    return (
      <span
        className={`rounded px-3 py-1 text-xs font-medium ${badges[status as keyof typeof badges]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6 bg-teal-600 px-6 py-3 text-white">
        <p className="text-sm font-medium">Chế độ: Gia sư</p>
      </div>

      <div className="px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold text-gray-900">
              Tải tài liệu lên
            </h1>
            <p className="text-sm text-gray-600">
              Chia sẻ tài liệu học tập với sinh viên qua link
            </p>
          </div>

          {showSuccess && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                ✓
              </div>
              <p className="text-sm text-green-800">
                Tài liệu đã được gửi thành công! Vui lòng đợi admin duyệt.
              </p>
            </div>
          )}

          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex items-start gap-3 border-b border-blue-100 bg-blue-50 p-4">
              <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
              <div>
                <h3 className="mb-0.5 text-sm font-semibold text-blue-900">
                  Thông tin tài liệu
                </h3>
                <p className="text-xs text-blue-700">
                  Vui lòng điền đầy đủ thông tin bên dưới
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Tiêu đề tài liệu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Giáo trình Toán Cao Cấp 1"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Đặt tên ngắn gọn, dễ hiểu để sinh viên dễ tìm kiếm
                </p>
                {errors.title && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.category
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Mô tả chi tiết về nội dung tài liệu, phạm vi kiến thức, đối tượng phù hợp..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`w-full resize-none rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.description
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Mô tả càng chi tiết sẽ giúp sinh viên hiểu rõ hơn về tài liệu
                </p>
                {errors.description && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Link tài liệu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="https://drive.google.com/file/d/..."
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className={`w-full rounded-lg border px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.link
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Hỗ trợ link từ Google Drive, Dropbox, OneDrive, hoặc link trực
                  tiếp đến file PDF
                </p>
                {errors.link && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    {errors.link}
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <div className="mb-2 flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                  <h4 className="text-sm font-semibold text-blue-900">
                    Lưu ý khi tải tài liệu
                  </h4>
                </div>
                <ul className="list-disc space-y-1 pl-6 text-xs text-blue-800">
                  <li>
                    Tài liệu cần phải được admin duyệt trước khi cho sinh viên
                    xem
                  </li>
                  <li>Đảm bảo link tài liệu có thể truy cập công khai</li>
                  <li>Nội dung tài liệu phải phù hợp với mục đích học tập</li>
                  <li>Không vi phạm bản quyền hoặc chứa nội dung không phù hợp</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  <Save className="h-4 w-4" />
                  Gửi duyệt
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-8 py-3 text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                  Xóa form
                </button>
              </div>
            </form>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-900">
                Tài liệu đã gửi gần đây
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {submittedMaterials.map((material) => (
                <div
                  key={material.id}
                  className="px-6 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 text-sm font-medium text-gray-900">
                        {material.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Gửi ngày {material.submittedDate}
                      </p>
                    </div>
                    {getStatusBadge(material.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

