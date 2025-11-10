import { useState } from "react";
import { Search } from "lucide-react";
import MaterialCard from "../../../Components/MaterialCard";
import type { Material } from "./types/material.types";

export default function ViewMaterials() {
  const [searchQuery, setSearchQuery] = useState("");

  const materials: Material[] = [
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

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu theo tên, mô tả, hoặc người đăng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Tìm thấy {filteredMaterials.length} tài liệu
          </p>
        </div>

        <div className="space-y-4">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))
          ) : (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
              <p className="text-gray-500">Không tìm thấy tài liệu nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

