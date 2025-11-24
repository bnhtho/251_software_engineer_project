import { useMemo, useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { useUser } from "../../Context/UserContext";
import { courseApi, publicApi } from "../../services/api";
import type { CourseDTO, DepartmentDTO, MajorDTO } from "../../types/api";
import toast from 'react-hot-toast';

type ServiceResult = {
  status: "PENDING" | "FAILED";
  message: string;
};

// Sample courses removed - using API data

// Conflict checking moved to backend

export default function CoursePage() {
  const { user } = useUser();
  const studentId = user?.id || 0;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  
  // API data states
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<CourseDTO[]>([]);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [majors, setMajors] = useState<MajorDTO[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<number | null>(null);
  
  const [message, setMessage] = useState<string>("");
  
  const registeredCount = useMemo(
    () => registeredCourses.length,
    [registeredCourses],
  );

  // Load initial data
  useEffect(() => {
    loadData();
  }, [studentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, departmentsData, majorsData, registeredData] = await Promise.all([
        courseApi.getCourses().catch(() => []), // MISSING ENDPOINT - using empty array as fallback
        publicApi.getDepartments(),
        publicApi.getMajors(),
        studentId ? courseApi.getStudentCourses(studentId).catch(() => []) : [] // MISSING ENDPOINT
      ]);
      
      setCourses(coursesData);
      setDepartments(departmentsData);
      setMajors(majorsData);
      setRegisteredCourses(registeredData.map(sc => sc.course));
    } catch (error) {
      console.error('Error loading course data:', error);
      toast.error('Không thể tải dữ liệu khóa học');
    } finally {
      setLoading(false);
    }
  };

  const submitRegistration = async (courseId: number) => {
    if (registering || !studentId) return;
    
    try {
      setRegistering(courseId);
      const result = await courseApi.registerCourse({ // MISSING ENDPOINT
        courseId,
        studentId,
        notes: ""
      });
      
      if (result.status === 'PENDING') {
        setMessage("✅ Gửi yêu cầu thành công. Đang chờ phê duyệt.");
        toast.success("Đăng ký thành công!");
        // Reload registered courses
        const updatedRegistered = await courseApi.getStudentCourses(studentId);
        setRegisteredCourses(updatedRegistered.map(sc => sc.course));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Đăng ký thất bại";
      setMessage(`❌ ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setRegistering(null);
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    if (loading) return [];
    
    return courses.filter((course) => {
      const matchesSearch = searchTerm === "" || 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tutorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === "" || 
        course.departmentId.toString() === selectedDepartment;
        
      const matchesStatus = selectedStatus === "" || course.status === selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [courses, searchTerm, selectedDepartment, selectedStatus, loading]);

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
      <title>Danh sách Khoá học</title>
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="text-2xl font-bold text-gray-900">Khóa học</h1>
            <p className="mt-1 text-gray-600">
              Tìm kiếm và đăng ký các khóa học phù hợp
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-6">
                  <div className="flex items-center rounded-md border border-gray-300 px-3 py-2">
                    <Search className="mr-2 h-4 w-4 text-gray-500" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm khóa học theo tên, mã, giảng viên..."
                      className="w-full text-sm placeholder-gray-400 outline-none"
                    />
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <select 
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="OPEN">Đang mở</option>
                    <option value="CLOSED">Đã đóng</option>
                    <option value="FULL">Đã đầy</option>
                    <option value="PENDING">Sắp mở</option>
                  </select>
                </div>

                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <select 
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Tất cả khoa</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 sm:col-span-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-600">Khả dụng</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {courses.filter(c => c.status === 'OPEN').length}
                </p>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-600">Đã đăng ký</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {registeredCount}
                </p>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm text-gray-600">Đã đầy</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {courses.filter(c => c.status === 'FULL').length}
                </p>
              </div>
            </div>
        </div>

        {message && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div
                className={`rounded-md p-3 text-sm ${message.startsWith("❌") ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}
              >
                {message}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Danh sách khóa học
            </h2>
          </div>

          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const progress = Math.round((course.enrolled / course.capacity) * 100);
              const times = course.timeslots
                .map((t) => `${t.dayOfWeek.slice(0,3)}, ${t.startTime}-${t.endTime}`)
                .join(" • ");
              const isRegistered = registeredCourses.some(r => r.id === course.id);
              const isRegistering = registering === course.id;
              
              return (
                <div key={course.id} className="col-span-12">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 lg:col-span-9">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {course.name}
                          </h3>
                          <span className={`inline-block rounded px-2 py-0.5 text-xs ${
                            course.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                            course.status === 'FULL' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {course.status === 'OPEN' ? 'Đang mở' :
                             course.status === 'FULL' ? 'Đã đầy' :
                             course.status === 'CLOSED' ? 'Đã đóng' : 'Sắp mở'}
                          </span>
                          {isRegistered && (
                            <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                              Đã đăng ký
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-12 gap-4 text-xs text-gray-500">
                          <div className="col-span-12 sm:col-span-6">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="font-medium">Mã khóa học:</span>
                              <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-gray-800">
                                {course.code}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div>👨‍🏫 {course.tutorName}</div>
                              <div>🏫 {course.departmentName}</div>
                            </div>
                          </div>

                          <div className="col-span-12 sm:col-span-6">
                            <div className="space-y-1">
                              <div>📚 {course.subjectName}</div>
                              <div>📅 {times}</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="h-1.5 rounded bg-gray-200">
                            <div
                              className="h-1.5 rounded bg-blue-600"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                            <span>
                              ⭐ {course.rating?.toFixed(1) || 'N/A'} ({course.ratingCount || 0})
                            </span>
                            <span>
                              {course.enrolled}/{course.capacity} học viên
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 flex items-start justify-end lg:col-span-3">
                        <button
                          onClick={() => submitRegistration(course.id)}
                          disabled={isRegistered || isRegistering || course.status !== 'OPEN'}
                          className="w-full rounded-md px-4 py-2 text-sm text-white lg:w-auto disabled:opacity-50 disabled:cursor-not-allowed
                            bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {isRegistering ? 'Đang xử lý...' : 
                           isRegistered ? 'Đã đăng ký' :
                           course.status === 'FULL' ? 'Đã đầy' :
                           course.status === 'CLOSED' ? 'Đã đóng' : 'Đăng ký'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-12">
              <div className="py-8 text-center">
                <p className="text-gray-500">Không tìm thấy khóa học nào.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

