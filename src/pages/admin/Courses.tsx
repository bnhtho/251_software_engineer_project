import { useState, useEffect, useCallback } from "react";
import { BookOpen, Search } from "lucide-react";
import { publicApi, scheduleApi } from "../../services/api";
import toast from "react-hot-toast";

interface SubjectDTO {
  id: number;
  name: string;
}

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

const AdminCourses = () => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-gray-900">Hệ thống khoá học</h1>
      <p className="mt-2 text-sm text-gray-500">
        Hệ thống khóa học đang được cập nhật.
      </p>
    </div>
  );
};

// const [subjects, setSubjects] = useState<SubjectDTO[]>([]);
// const [sessions, setSessions] = useState<BackendSessionDTO[]>([]);
// const [loading, setLoading] = useState(true);
// const [searchTerm, setSearchTerm] = useState("");

// const loadData = useCallback(async () => {
//   try {
//     setLoading(true);
//     const [subjectsData, sessionsData] = await Promise.all([
//       publicApi.getSubjects(),
//       scheduleApi.getAllSessions(),
//     ]);
//     setSubjects(subjectsData);
//     setSessions(sessionsData);
//   } catch (error) {
//     console.error("Error loading data:", error);
//     toast.error("Không thể tải dữ liệu");
//   } finally {
//     setLoading(false);
//   }
// }, []);

// useEffect(() => {
//   loadData();
// }, [loadData]);

// // Get statistics for each subject
// const getSubjectStats = (subjectName: string) => {
//   const subjectSessions = sessions.filter(s => s.subjectName === subjectName);
//   const totalSessions = subjectSessions.length;
//   const totalStudents = subjectSessions.reduce((sum, s) => sum + s.currentQuantity, 0);
//   const totalCapacity = subjectSessions.reduce((sum, s) => sum + s.maxQuantity, 0);

//   return { totalSessions, totalStudents, totalCapacity };
// };

// const filteredSubjects = subjects.filter(subject =>
//   subject.name.toLowerCase().includes(searchTerm.toLowerCase())
// );

// if (loading) {
//   return (
//     <div className="flex items-center justify-center min-h-64">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
//         <p className="text-gray-600">Đang tải...</p>
//       </div>
//     </div>
//   );
// }

// return (
//   <div className="space-y-6">
//     <div className="flex items-center justify-between">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Quản lý Môn học</h1>
//         <p className="text-gray-600 mt-1">Xem thống kê các môn học và buổi học tương ứng</p>
//       </div>
//     </div>

//     {/* Stats Overview */}
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//       <div className="rounded-lg border border-gray-200 bg-white p-4">
//         <div className="flex items-center gap-2">
//           <BookOpen className="h-5 w-5 text-blue-600" />
//           <div>
//             <p className="text-sm text-gray-600">Tổng số môn học</p>
//             <p className="text-2xl font-semibold text-gray-900">{subjects.length}</p>
//           </div>
//         </div>
//       </div>
//       <div className="rounded-lg border border-gray-200 bg-white p-4">
//         <div className="flex items-center gap-2">
//           <BookOpen className="h-5 w-5 text-green-600" />
//           <div>
//             <p className="text-sm text-gray-600">Tổng buổi học</p>
//             <p className="text-2xl font-semibold text-gray-900">{sessions.length}</p>
//           </div>
//         </div>
//       </div>
//       <div className="rounded-lg border border-gray-200 bg-white p-4">
//         <div className="flex items-center gap-2">
//           <BookOpen className="h-5 w-5 text-purple-600" />
//           <div>
//             <p className="text-sm text-gray-600">Tổng Sinh viên</p>
//             <p className="text-2xl font-semibold text-gray-900">
//               {/* {sessions.push((sum, s) => sum + s.currentQuantity, 0)} */}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Search */}
//     <div className="rounded-lg border border-gray-200 bg-white p-4">
//       <div className="flex items-center rounded-md border border-gray-300 px-3 py-2">
//         <Search className="mr-2 h-4 w-4 text-gray-500" />
//         <input
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Tìm kiếm môn học..."
//           className="w-full text-sm placeholder-gray-400 outline-none"
//         />
//       </div>
//     </div>

//     {/* Subjects List */}
//     <div className="rounded-lg border border-gray-200 bg-white">
//       <div className="p-4 border-b border-gray-200">
//         <h2 className="text-lg font-semibold text-gray-900">Danh sách môn học</h2>
//         <p className="text-sm text-gray-600 mt-1">Thống kê số buổi học và Sinh viên cho từng môn</p>
//       </div>
//       <div className="divide-y divide-gray-200">
//         {filteredSubjects.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             {searchTerm ? "Không tìm thấy môn học nào" : "Chưa có môn học nào"}
//           </div>
//         ) : (
//           filteredSubjects.map((subject) => {
//             const stats = getSubjectStats(subject.name);
//             const utilizationRate = stats.totalCapacity > 0
//               ? Math.round((stats.totalStudents / stats.totalCapacity) * 100)
//               : 0;

//             return (
//               <div key={subject.id} className="p-4 hover:bg-gray-50">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
//                         <BookOpen className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div>
//                         <h3 className="text-base font-semibold text-gray-900">
//                           {subject.name}
//                         </h3>
//                         <p className="text-sm text-gray-500">ID: {subject.id}</p>
//                       </div>
//                     </div>

//                     <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
//                       <div className="rounded-lg bg-gray-50 p-3">
//                         <p className="text-xs text-gray-600">Buổi học</p>
//                         <p className="mt-1 text-lg font-semibold text-gray-900">
//                           {stats.totalSessions}
//                         </p>
//                       </div>
//                       <div className="rounded-lg bg-gray-50 p-3">
//                         <p className="text-xs text-gray-600">Sinh viên</p>
//                         <p className="mt-1 text-lg font-semibold text-gray-900">
//                           {stats.totalStudents}
//                         </p>
//                       </div>
//                       <div className="rounded-lg bg-gray-50 p-3">
//                         <p className="text-xs text-gray-600">Sức chứa</p>
//                         <p className="mt-1 text-lg font-semibold text-gray-900">
//                           {stats.totalCapacity}
//                         </p>
//                       </div>
//                       <div className="rounded-lg bg-gray-50 p-3">
//                         <p className="text-xs text-gray-600">Tỉ lệ sử dụng</p>
//                         <p className="mt-1 text-lg font-semibold text-gray-900">
//                           {utilizationRate}%
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>

//     {/* Info Note */}
//     <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
//       <p className="text-sm text-blue-800">
//         <strong>Lưu ý:</strong> Trang này hiển thị thống kê các môn học từ hệ thống.
//         Để tạo buổi học mới cho môn học, vui lòng truy cập trang <strong>Quản lý Buổi học</strong>.
//       </p>
//     </div>
//   </div>
// );

export default AdminCourses;

