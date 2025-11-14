import { useState, useEffect } from "react";
import { Search, AlertTriangle, RefreshCw } from "lucide-react";
import MaterialCard from "../../../Components/MaterialCard";
import type { Material } from "./types/material.types";

export default function ViewMaterials() {
  const [searchQuery, setSearchQuery] = useState("");
  // States theo Activity Diagram
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);

  // Mock data
  const mockMaterials: Material[] = [
    {
      id: "1",
      title: "Giáo trình Toán Cao Cấp 1",
      category: "Toán học",
      description:
        "Tài liệu đầy đủ về Giải tích 1, bao gồm đạo hàm, tích phân và ứng dụng",
      author: "TS. Nguyễn Văn A",
      date: "15/10/2025",
      views: 245,
    },
    {
      id: "2",
      title: "Bài tập Vật Lý Đại Cương",
      category: "Vật lý",
      description:
        "Tổng hợp 100 bài tập vật lý cơ lớn giải chi tiết cho sinh viên năm nhất",
      author: "PGS. Trần Thị B",
      date: "12/10/2025",
      views: 189,
    },
    {
      id: "3",
      title: "Cấu trúc dữ liệu và Giải thuật",
      category: "Tin học",
      description:
        "Slide bài giảng và code mẫu về các cấu trúc dữ liệu cơ bản",
      author: "TS. Lê Văn C",
      date: "08/10/2025",
      views: 412,
    },
    {
      id: "4",
      title: "Hóa học Đại cương - Chương 1",
      category: "Hóa học",
      description:
        "Tài liệu lý thuyết và bài tập về cấu tạo nguyên tử, bảng tuần hoàn",
      author: "PGS.TS. Phạm Thị D",
      date: "05/10/2025",
      views: 156,
    },
    {
      id: "5",
      title: "Kỹ thuật lập trình C++",
      category: "Tin học",
      description:
        "Hướng dẫn chi tiết về OOP, STL và các kỹ thuật lập trình nâng cao",
      author: "TS. Hoàng Văn E",
      date: "01/10/2025",
      views: 567,
    },
    {
      id: "6",
      title: "Cơ học kỹ thuật - Tĩnh học",
      category: "Cơ khí",
      description: "Bài giảng về tĩnh học, phân tích lực và momen",
      author: "PGS. Võ Thị F",
      date: "28/09/2025",
      views: 234,
    },
  ];

  // Implement theo Use Case UC03: Sinh viên xem danh sách tất cả tài liệu có trên hệ thống
  useEffect(() => {
    // Step 1: Sinh viên chọn chức năng "Xem tài liệu" (đã có trong routing)
    loadDocuments();
  }, []);

  // Implement theo Sequence Diagram: viewDocumentList() -> getDocumentList()
  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 2: Hệ thống truy xuất và hiển thị danh sách tài liệu
      // Simulate API call - getDocumentList()
      console.log("Loading document list...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Kiểm tra theo Activity Diagram: Có tài liệu?
      if (mockMaterials.length === 0) {
        // Alternative Flow: Nếu hệ thống không có tài liệu nào
        setError("Chưa có tài liệu");
      } else {
        // Main Flow: displayDocumentList(documentList)
        setMaterials(mockMaterials);
      }
    } catch (err) {
      // Exception Flow: Lỗi DB khi truy xuất
      console.error("Load documents failed:", err);
      setError("Lỗi khi tải danh sách tài liệu");
    } finally {
      setIsLoading(false);
    }
  };

  // Implement search functionality theo Use Case
  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Retry function cho Exception Flow
  const handleRetry = () => {
    loadDocuments();
  };

  // Loading state theo Activity Diagram
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="rounded-t-lg bg-teal-600 px-6 py-3 text-white">
              <p className="text-sm">Chế độ: Sinh viên</p>
            </div>
            <div className="rounded-b-lg bg-white p-6 shadow-sm">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Danh sách Tài liệu
              </h1>
              <p className="text-gray-600">
                Tìm kiếm và xem các tài liệu học tập đã được duyệt
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="mx-auto h-12 w-12 text-teal-600 animate-spin" />
              <p className="mt-4 text-gray-600">Đang tải danh sách tài liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state theo Exception Flow
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="rounded-t-lg bg-teal-600 px-6 py-3 text-white">
              <p className="text-sm">Chế độ: Sinh viên</p>
            </div>
            <div className="rounded-b-lg bg-white p-6 shadow-sm">
              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Danh sách Tài liệu
              </h1>
              <p className="text-gray-600">
                Tìm kiếm và xem các tài liệu học tập đã được duyệt
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <AlertTriangle className="mx-auto h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error === "Chưa có tài liệu" ? "Chưa có tài liệu" : "Có lỗi xảy ra"}
            </h3>
            <p className="text-gray-600 mb-4">
              {error === "Chưa có tài liệu"
                ? "Hiện tại chưa có tài liệu nào được đăng tải. Vui lòng quay lại sau."
                : "Không thể tải danh sách tài liệu. Vui lòng thử lại."}
            </p>
            {error !== "Chưa có tài liệu" && (
              <button
                onClick={handleRetry}
                className="group rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <RefreshCw className="mr-2 h-4 w-4 inline group-hover:rotate-180 transition-transform duration-300" />
                Thử lại
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header - Step 1: Sinh viên chọn chức năng "Xem tài liệu" */}
        <div className="mb-8">
          <div className="rounded-t-lg bg-teal-600 px-6 py-3 text-white">
            <p className="text-sm">Chế độ: Sinh viên</p>
          </div>

          <div className="rounded-b-lg bg-white p-6 shadow-sm">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Danh sách Tài liệu
            </h1>
            <p className="text-gray-600">
              Xem danh sách tất cả tài liệu đã được duyệt trên hệ thống
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu theo tên, mô tả, hoặc người đăng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500 hover:border-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {searchQuery
              ? `Tìm thấy ${filteredMaterials.length} tài liệu phù hợp với "${searchQuery}"`
              : `Hiển thị ${filteredMaterials.length} tài liệu`}
          </p>

          {materials.length > 0 && (
            <button
              onClick={handleRetry}
              className="group flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-1 rounded px-2 py-1"
            >
              <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
              Làm mới
            </button>
          )}
        </div>

        {/* Materials List - Step 2: displayDocumentList(documentList) */}
        <div className="space-y-4">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <div key={material.id} className="transform hover:scale-[1.02] transition-transform duration-200">
                <MaterialCard material={material} />
              </div>
            ))
          ) : (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
              {searchQuery ? (
                <>
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-pulse" />
                  <p className="text-gray-500">
                    Không tìm thấy tài liệu nào phù hợp với "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Hãy thử tìm kiếm với từ khóa khác
                  </p>
                </>
              ) : (
                <p className="text-gray-500">Không có tài liệu nào</p>
              )}
            </div>
          )}
        </div>

        {/* Instructions - theo Use Case Post-condition */}
        {materials.length > 0 && (
          <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
              <Search className="h-4 w-4" />
              Hướng dẫn sử dụng
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-xs text-blue-800">
              <li>
                Sử dụng thanh tìm kiếm để tìm tài liệu theo tên, mô tả hoặc tác giả
              </li>
              <li>Click vào tài liệu để xem chi tiết và tải về</li>
              <li>
                Tất cả tài liệu đã được kiểm duyệt và phù hợp cho việc học tập
              </li>
              <li>
                Click "Làm mới" để cập nhật danh sách tài liệu mới nhất
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

