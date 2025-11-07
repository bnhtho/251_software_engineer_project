import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import TutorCard from "../Components/TutorCard";

// ---- Types ----
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
    faculty: string; // For filtering
};

// ---- Sample Data ----
const sampleTutors: Tutor[] = [
    {
        id: 1,
        name: "TS. Nguyễn Văn Minh",
        title: "Tiến sĩ",
        department: "Khoa Toán - Tin học",
        description: "Giảng viên với hơn 8 năm kinh nghiệm giảng dạy Toán Cao Cấp, tận tâm hỗ trợ sinh viên.",
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
        description: "Chuyên gia về lập trình và thuật toán, đã hướng dẫn nhiều sinh viên đạt giải thưởng.",
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
        description: "Chuyên gia về Vật lý đại cương và Vật lý lượng tử, phương pháp giảng dạy dễ hiểu.",
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
        description: "Nhiều năm kinh nghiệm giảng dạy Hóa học hữu cơ và vô cơ, hỗ trợ sinh viên tận tình.",
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
    const [selectedFaculty, setSelectedFaculty] = useState<string>("Tất cả các khoa");

    // Get unique faculties for filter
    const faculties = useMemo(() => {
        const uniqueFaculties = Array.from(new Set(sampleTutors.map((t) => t.faculty)));
        return ["Tất cả các khoa", ...uniqueFaculties];
    }, []);

    // Filter tutors
    const filteredTutors = useMemo(() => {
        return sampleTutors.filter((tutor) => {
            const matchesSearch =
                tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tutor.specializations.some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesFaculty = selectedFaculty === "Tất cả các khoa" || tutor.faculty === selectedFaculty;
            return matchesSearch && matchesFaculty;
        });
    }, [searchTerm, selectedFaculty]);

    // Handlers
    const handleMessage = (tutorId: number) => {
        console.log("Message tutor:", tutorId);
        // TODO: Implement message functionality
    };

    const handleSchedule = (tutorId: number) => {
        console.log("Schedule with tutor:", tutorId);
        // TODO: Implement schedule functionality
    };

    return (
        <>
            <title>Danh sách Gia sư</title>
            <div className="p-6 space-y-8">
                {/* Header Section */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Danh sách Gia sư</h1>
                        <p className="text-gray-600">
                            Tìm kiếm và kết nối với các gia sư phù hợp với nhu cầu học tập của bạn
                        </p>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="grid grid-cols-12 gap-4">
                                {/* Search Input */}
                                <div className="col-span-12 lg:col-span-8">
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Tìm kiếm theo tên gia sư hoặc lĩnh vực..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7AA0] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Faculty Filter */}
                                <div className="col-span-12 lg:col-span-4">
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select
                                            value={selectedFaculty}
                                            onChange={(e) => setSelectedFaculty(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0E7AA0] focus:border-transparent appearance-none bg-white"
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

                {/* Results Count */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <p className="text-sm text-gray-600">
                            Tìm thấy <span className="font-semibold text-gray-900">{filteredTutors.length}</span> gia sư
                        </p>
                    </div>
                </div>

                {/* Tutor List Section */}
                <div className="grid grid-cols-12 gap-6">
                    {filteredTutors.length > 0 ? (
                        filteredTutors.map((tutor) => (
                            <div key={tutor.id} className="col-span-12">
                                <TutorCard {...tutor} onMessage={handleMessage} onSchedule={handleSchedule} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-12">
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Không tìm thấy gia sư nào.</p>
                                <p className="text-gray-400 text-sm mt-2">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TutorList;
