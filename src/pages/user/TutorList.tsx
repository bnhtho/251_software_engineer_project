import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import TutorCard from "../../Components/TutorCard";

type Tutor = {
  id: number;
  name: string;
  title: string;
  department: string;
  description: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  studentCount: number;
  experienceYears: number;
  isAvailable: boolean;
  faculty: string;
};

const sampleTutors: Tutor[] = [
  {
    id: 1,
    name: "TS. Nguyễn Văn Minh",
    title: "Tiến sĩ",
    department: "Khoa Toán - Tin học",
    description:
      "Với hơn 8 năm kinh nghiệm giảng dạy Toán Cao Cấp, tận tâm hỗ trợ sinh viên.",
    specializations: ["Toán Cao Cấp", "Giải tích", "Đại số"],
    rating: 4.9,
    reviewCount: 124,
    studentCount: 45,
    experienceYears: 8,
    isAvailable: true,
    faculty: "Khoa Toán - Tin học",
  },
  {
    id: 2,
    name: "PGS.TS. Trần Thị Hương",
    title: "Phó Giáo sư, Tiến sĩ",
    department: "Khoa Khoa học và Kỹ thuật Máy tính",
    description:
      "Chuyên gia về lập trình và thuật toán, đã hướng dẫn nhiều sinh viên đạt giải thưởng.",
    specializations: ["Lập trình C++", "Cấu trúc dữ liệu", "Thuật toán"],
    rating: 5.0,
    reviewCount: 89,
    studentCount: 32,
    experienceYears: 12,
    isAvailable: true,
    faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
  },
  {
    id: 3,
    name: "TS. Lê Văn An",
    title: "Tiến sĩ",
    department: "Khoa Vật lý",
    description:
      "Chuyên gia về Vật lý đại cương và Vật lý lượng tử, phương pháp giảng dạy dễ hiểu.",
    specializations: ["Vật lý đại cương", "Vật lý lượng tử", "Cơ học"],
    rating: 4.8,
    reviewCount: 67,
    studentCount: 28,
    experienceYears: 6,
    isAvailable: true,
    faculty: "Khoa Vật lý",
  },
  {
    id: 4,
    name: "PGS.TS. Phạm Thị Lan",
    title: "Phó Giáo sư, Tiến sĩ",
    department: "Khoa Hóa học",
    description:
      "Nhiều năm kinh nghiệm giảng dạy Hóa học hữu cơ và vô cơ, hỗ trợ sinh viên tận tình.",
    specializations: ["Hóa học hữu cơ", "Hóa học vô cơ", "Hóa phân tích"],
    rating: 4.7,
    reviewCount: 95,
    studentCount: 38,
    experienceYears: 10,
    isAvailable: false,
    faculty: "Khoa Hóa học",
  },
];

const TutorList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] =
    useState<string>("Tất cả các khoa");

  const faculties = useMemo(() => {
    const uniqueFaculties = Array.from(
      new Set(sampleTutors.map((t) => t.faculty)),
    );
    return ["Tất cả các khoa", ...uniqueFaculties];
  }, []);

  const filteredTutors = useMemo(() => {
    return sampleTutors.filter((tutor) => {
      const matchesSearch =
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.specializations.some((spec) =>
          spec.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesFaculty =
        selectedFaculty === "Tất cả các khoa" ||
        tutor.faculty === selectedFaculty;
      return matchesSearch && matchesFaculty;
    });
  }, [searchTerm, selectedFaculty]);

  const handleMessage = (tutorId: number) => {
    console.log("Message tutor:", tutorId);
  };

  const handleSchedule = (tutorId: number) => {
    console.log("Schedule with tutor:", tutorId);
  };

  return (
    <>
      <title>Danh sách Gia sư</title>
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Danh sách Gia sư
            </h1>
            <p className="text-gray-600">
              Tìm kiếm và kết nối với các gia sư phù hợp với nhu cầu học tập của
              bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-8">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm theo tên gia sư hoặc lĩnh vực..."
                      className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0E7AA0]"
                    />
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <select
                      value={selectedFaculty}
                      onChange={(e) => setSelectedFaculty(e.target.value)}
                      className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0E7AA0]"
                    >
                      {faculties.map((faculty) => (
                        <option key={faculty} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <p className="text-sm text-gray-600">
              Tìm thấy{" "}
              <span className="font-semibold text-gray-900">
                {filteredTutors.length}
              </span>{" "}
              gia sư
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {filteredTutors.length > 0 ? (
            filteredTutors.map((tutor) => (
              <div key={tutor.id} className="col-span-12">
                <TutorCard
                  {...tutor}
                  onMessage={handleMessage}
                  onSchedule={handleSchedule}
                />
              </div>
            ))
          ) : (
            <div className="col-span-12">
              <div className="py-12 text-center">
                <p className="text-lg text-gray-500">
                  Không tìm thấy gia sư nào.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TutorList;

