import { useMemo, useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Filter, CheckCircle, Clock, XCircle } from "lucide-react";
import { useUser } from "../../Context/UserContext";
import { courseApi, publicApi } from "../../services/api";
import type { CourseDTO, DepartmentDTO, StudentCourseDTO } from "../../types/api";
import { Award } from "lucide-react";
import toast from "react-hot-toast";

export default function CoursePage() {
  const { user } = useUser();
  const studentId = user?.id || 0;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<'all' | 'registered' | 'available'>('all');

  // API data states
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<CourseDTO[]>([]);
  const [registeredDetails, setRegisteredDetails] = useState<StudentCourseDTO[]>([]);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<number | null>(null);

  const [message, setMessage] = useState<string>("");

  const registeredCount = useMemo(
    () => registeredCourses.length,
    [registeredCourses]
  );

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Check if user is logged in via UserContext
      if (!user) {
        // User not logged in yet, wait for context to load
        setLoading(false);
        return;
      }

      // Try to load courses from API
      let coursesData: CourseDTO[] = [];
      try {
        coursesData = await courseApi.getCourses();
      } catch (error: any) {
        // Handle 401 (unauthorized) - token expired
        if (error?.response?.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          localStorage.removeItem('token');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }

        coursesData = [];
        toast.error("Không thể tải danh sách khoá học từ server");
      }

      // Try to load other data from public APIs
      const departmentsData = await publicApi.getDepartments().catch(() => [
        { id: 1, name: "Khoa Toán - Tin" },
        { id: 2, name: "Khoa Khoa học và Kỹ thuật Máy tính" },
        { id: 3, name: "Khoa Kỹ thuật Hóa học" },
      ]);

      // Try to load registered courses if user is logged in
      let registeredData: StudentCourseDTO[] = [];
      if (studentId) {
        try {
          const studentCourses = await courseApi.getStudentCourses(studentId);
          registeredData = studentCourses;
        } catch (error: any) {
          // Silently handle errors - admin won't have student courses
          registeredData = [];
        }
      }

      setCourses(coursesData);
      setDepartments(departmentsData);
      setRegisteredCourses(registeredData.map((sc) => sc.course || sc));
      setRegisteredDetails(registeredData);

    } catch (error) {
      toast.error("Không thể tải dữ liệu khóa học");
      // Set empty data on error
      setCourses([]);
      setDepartments([
        { id: 1, name: "Khoa Toán - Tin" },
        { id: 2, name: "Khoa Khoa học và Kỹ thuật Máy tính" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [user, studentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const submitRegistration = async (courseId: number) => {
    if (registering || !studentId) {
      if (!studentId) {
        toast.error("Vui lòng đăng nhập để đăng ký khóa học");
      }
      return;
    }

    // Check if user is admin
    if (user?.role === 'admin') {
      toast.error("Admin không thể đăng ký khoá học. Vui lòng đăng nhập bằng tài khoản sinh viên.");
      return;
    }

    try {
      setRegistering(courseId);

      // Try API call, fallback to simulation
      try {
        alert("Submit")
        const result = await courseApi.registerCourse({
          courseId,
          studentId,
          notes: "",
        });

        if (result.status === "PENDING") {
          setMessage("✅ Gửi yêu cầu thành công. Đang chờ phê duyệt.");
          toast.success("Đăng ký thành công!");
          // Reload registered courses
          const updatedRegistered = await courseApi.getStudentCourses(
            studentId
          );
          setRegisteredCourses(updatedRegistered.map((sc) => sc.course));
          setRegisteredDetails(updatedRegistered);
        }
      } catch (apiError: unknown) {
        // Simulate successful registration when API is not available
        const isNetworkError =
          (apiError instanceof Error &&
            "response" in apiError &&
            (apiError as { response?: { status?: number } }).response
              ?.status === 403) ||
          (apiError as { code?: string }).code === "ERR_NETWORK";

        if (isNetworkError) {
          setMessage("✅ Đăng ký thành công (Demo mode - API chưa sẵn sàng)");
          toast.success("Đăng ký thành công!");
          // Add course to registered list locally
          const course = courses.find((c) => c.id === courseId);
          if (course && !registeredCourses.find((r) => r.id === courseId)) {
            setRegisteredCourses((prev) => [...prev, course]);
          }
        } else {
          throw apiError;
        }
      }
    } catch (error: unknown) {
      let errorMessage = "Đăng ký thất bại";

      if (error && typeof error === "object") {
        if ("response" in error && error.response && typeof error.response === "object") {
          const response = error.response as any;

          // Try to get message from response.data
          if ("data" in response && response.data) {
            if (typeof response.data === "object" && "message" in response.data) {
              errorMessage = String(response.data.message);
            } else if (typeof response.data === "string") {
              errorMessage = response.data;
            }
          }

          // Add status code info
          if ("status" in response) {
            errorMessage = `${errorMessage} (HTTP ${response.status})`;
          }
        } else if ("message" in error) {
          const rawMessage = String((error as Error).message);

          // Make error messages more user-friendly
          if (rawMessage.includes("not available for registration")) {
            errorMessage = "⚠️ Khóa học này không còn khả dụng. Có thể đã đầy, đã qua thời gian hoặc đã đóng đăng ký.";
          } else if (rawMessage.includes("already registered")) {
            errorMessage = "ℹ️ Bạn đã đăng ký khóa học này rồi.";
          } else if (rawMessage.includes("full") || rawMessage.includes("capacity")) {
            errorMessage = "⚠️ Khóa học đã đầy. Vui lòng chọn khóa học khác.";
          } else {
            errorMessage = rawMessage;
          }
        }
      }

      setMessage(`❌ ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setRegistering(null);
    }
  };

  // Filter courses based on search, filters, and tabs
  const filteredCourses = useMemo(() => {
    if (loading) return [];

    return courses.filter((course) => {
      const matchesSearch =
        searchTerm === "" ||
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tutorName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "" ||
        course.departmentId.toString() === selectedDepartment;

      const matchesStatus =
        selectedStatus === "" || course.status === selectedStatus;

      const isRegistered = registeredCourses.some((r) => r.id === course.id);
      const matchesTab =
        selectedTab === 'all' ||
        (selectedTab === 'registered' && isRegistered) ||
        (selectedTab === 'available' && !isRegistered);

      return matchesSearch && matchesDepartment && matchesStatus && matchesTab;
    });
  }, [courses, searchTerm, selectedDepartment, selectedStatus, selectedTab, registeredCourses, loading]);

  // Get registration status for a course
  const getRegistrationStatus = (courseId: number) => {
    return registeredDetails.find(r => r.courseId === courseId);
  };

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center max-w-md">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Vui lòng đăng nhập</h3>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem danh sách khoá học và đăng ký</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }


  if (user?.role !== 'student') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chỉ dành cho sinh viên</h3>
          <p className="text-gray-600">Chức năng này chỉ dành cho tài khoản sinh viên muốn đăng ký làm gia sư.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Danh sách buổi học hiện có</title>

      <div className="space-y-8 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh sách buổi học hiện có</h1>
        {/* Giới thiệu */}
        {/* Information Banner */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-1">Quy trình đăng ký buổi học</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. <b>Sinh viên</b> chọn khoá học cần đăng ký</li>
                <li>2. Nhấp vào <b>đăng ký</b></li>
                <li>3. Sẽ hiện thông báo thành công nếu đủ điều kiện</li>
              </ul>
            </div>
          </div>
        </div>
        {/* 
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="flex items-center justify-between">
              <div>

              </div>
              <button
                onClick={() => loadData()}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
            </div>
          </div>
        </div> */}

        {/* Filter Tabs */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="rounded-lg border border-gray-200 bg-white p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTab('all')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedTab === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Filter className="h-4 w-4" />
                  Tất cả ({courses.length})
                </button>
                <button
                  onClick={() => setSelectedTab('registered')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedTab === 'registered'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  Đã đăng ký ({registeredCount})
                </button>
                <button
                  onClick={() => setSelectedTab('available')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedTab === 'available'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Clock className="h-4 w-4" />
                  Chưa đăng ký ({courses.length - registeredCount})
                </button>
              </div>
            </div>
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
                      placeholder="Tìm kiếm khóa học theo tên, mã, gia sư..."
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
                {courses.filter((c) => c.status === "OPEN").length}
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
                {courses.filter((c) => c.status === "FULL").length}
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div
                className={`rounded-md p-3 text-sm ${message.startsWith("❌")
                  ? "bg-red-50 text-red-700"
                  : "bg-blue-50 text-blue-700"
                  }`}
              >
                {message}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Danh sách buổi học
            </h2>
          </div>

          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const progress = Math.round(
                (course.enrolled / course.capacity) * 100
              );
              const times = course.timeslots
                .map(
                  (t) =>
                    `${t.dayOfWeek.slice(0, 3)}, ${t.startTime}-${t.endTime}`
                )
                .join(" • ");
              const isRegistered = registeredCourses.some(
                (r) => r.id === course.id
              );
              const isRegistering = registering === course.id;
              const registrationStatus = getRegistrationStatus(course.id);
              const isFull = course.status === 'FULL' || course.enrolled >= course.capacity;
              const isNearlyFull = progress >= 80 && !isFull;

              return (
                <div key={course.id} className="col-span-12">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 lg:col-span-9">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {course.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${isFull
                              ? "bg-red-100 text-red-700"
                              : isNearlyFull
                                ? "bg-orange-100 text-orange-700"
                                : course.status === "OPEN"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {isFull && <XCircle className="h-3 w-3" />}
                            {isFull
                              ? "Đã đầy"
                              : isNearlyFull
                                ? `Sắp đầy (${progress}%)`
                                : course.status === "OPEN"
                                  ? "Đang mở"
                                  : course.status === "CLOSED"
                                    ? "Đã đóng"
                                    : "Sắp mở"}
                          </span>
                          {registrationStatus && (
                            <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${registrationStatus.status === 'APPROVED'
                              ? 'bg-green-100 text-green-700'
                              : registrationStatus.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-700'
                                : registrationStatus.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                              {registrationStatus.status === 'APPROVED' ? (
                                <><CheckCircle className="h-3 w-3" /> Đã xác nhận</>
                              ) : registrationStatus.status === 'PENDING' ? (
                                <><Clock className="h-3 w-3" /> Chờ duyệt</>
                              ) : registrationStatus.status === 'REJECTED' ? (
                                <><XCircle className="h-3 w-3" /> Bị từ chối</>
                              ) : (
                                <><XCircle className="h-3 w-3" /> {registrationStatus.status}</>
                              )}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-12 gap-4 text-xs text-gray-500">
                          <div className="col-span-12 sm:col-span-6">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="font-medium">Mã khóa học:</span>
                              <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-gray-800">
                                {course.id}
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
                              className={`h-1.5 rounded transition-colors ${isFull
                                ? 'bg-red-500'
                                : isNearlyFull
                                  ? 'bg-orange-500'
                                  : 'bg-blue-600'
                                }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                            <span>
                              ⭐ {course.rating?.toFixed(1) || "N/A"} (
                              {course.ratingCount || 0})
                            </span>
                            <span className={isFull ? 'text-red-600 font-semibold' : isNearlyFull ? 'text-orange-600 font-semibold' : ''}>
                              {course.enrolled}/{course.capacity} học viên
                              {isFull && ' - Đã đầy'}
                              {isNearlyFull && ' - Chỉ còn ' + (course.capacity - course.enrolled) + ' chỗ'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 flex items-start justify-end lg:col-span-3">
                        <button
                          onClick={() => submitRegistration(course.id)}
                          disabled={
                            isRegistered ||
                            isRegistering ||
                            isFull ||
                            course.status === "CLOSED" ||
                            user?.role === 'admin'
                          }
                          className={`w-full rounded-md px-4 py-2 text-sm lg:w-auto disabled:cursor-not-allowed flex items-center justify-center gap-2
                            ${isRegistered
                              ? 'bg-green-100 text-green-700 border-2 border-green-300'
                              : isFull || course.status === "CLOSED" || user?.role === 'admin'
                                ? 'bg-gray-400 text-white opacity-50'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          title={
                            user?.role === 'admin'
                              ? 'Admin không thể đăng ký khoá học'
                              : isRegistered
                                ? 'Bạn đã đăng ký khóa học này'
                                : isFull
                                  ? 'Khóa học đã đầy'
                                  : ''
                          }
                        >
                          {isRegistered && <CheckCircle className="h-4 w-4" />}
                          {isFull && <XCircle className="h-4 w-4" />}
                          {user?.role === 'admin'
                            ? "Không thể đăng ký"
                            : isRegistering
                              ? "Đang xử lý..."
                              : isRegistered
                                ? "Đã đăng ký"
                                : isFull
                                  ? "Đã đầy"
                                  : course.status === "CLOSED"
                                    ? "Đã đóng"
                                    : "Đăng ký"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-12">
              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <div className="text-center">
                  <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học nào</h3>
                  <p className="text-gray-500 mb-4">Hiện tại chưa có khóa học nào được tạo trong hệ thống.</p>
                  <p className="text-sm text-gray-400">Vui lòng liên hệ với quản trị viên hoặc thử lại sau.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
