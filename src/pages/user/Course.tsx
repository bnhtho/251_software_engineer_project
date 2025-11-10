import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useUser } from "../../Context/UserContext";

type Timeslot = {
  day: string;
  start: string;
  end: string;
};

type Course = {
  id: number;
  name: string;
  code: string;
  timeslots: Timeslot[];
  teacher: string;
  faculty: string;
  weeks: string;
  enrolled: number;
  capacity: number;
  rating: number;
  ratingCount: number;
};

type ServiceResult = {
  status: "PENDING" | "FAILED";
  message: string;
};

const sampleCourses: Course[] = [
  {
    id: 1,
    name: "Toán Cao Cấp 1",
    code: "MT1003",
    timeslots: [
      { day: "Mon", start: "07:30", end: "09:30" },
      { day: "Wed", start: "07:30", end: "09:30" },
    ],
    teacher: "TS. Nguyễn Văn Minh",
    faculty: "Khoa Toán - Tin học",
    weeks: "15 tuần (30 buổi)",
    enrolled: 45,
    capacity: 50,
    rating: 4.8,
    ratingCount: 28,
  },
  {
    id: 2,
    name: "Lập trình Hướng đối tượng",
    code: "CO2017",
    timeslots: [{ day: "Tue", start: "13:30", end: "16:00" }],
    teacher: "PGS.TS. Trần Thị Hương",
    faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
    weeks: "15 tuần (30 buổi)",
    enrolled: 42,
    capacity: 45,
    rating: 4.9,
    ratingCount: 35,
  },
];

function timeOverlap(a: Timeslot, b: Timeslot) {
  if (a.day !== b.day) return false;
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const aStart = toMin(a.start);
  const aEnd = toMin(a.end);
  const bStart = toMin(b.start);
  const bEnd = toMin(b.end);
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

export default function CoursePage() {
  const { user } = useUser();
  const studentId = user?.id || 0;

  const [searchTerm, setSearchTerm] = useState("");
  const [registeredCourses] = useState<Course[]>([
    {
      id: 99,
      name: "Cấu trúc dữ liệu",
      code: "CO2013",
      timeslots: [{ day: "Mon", start: "13:30", end: "15:30" }],
      teacher: "TS. Nguyễn Văn D",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      weeks: "15 tuần (30 buổi)",
      enrolled: 40,
      capacity: 45,
      rating: 4.7,
      ratingCount: 25,
    },
    {
      id: 98,
      name: "Vật lý đại cương",
      code: "PH1003",
      timeslots: [{ day: "Tue", start: "07:30", end: "09:30" }],
      teacher: "PGS. Trần Văn E",
      faculty: "Khoa Vật lý",
      weeks: "15 tuần (30 buổi)",
      enrolled: 35,
      capacity: 40,
      rating: 4.5,
      ratingCount: 20,
    },
    {
      id: 97,
      name: "Xác suất thống kê",
      code: "MA2003",
      timeslots: [{ day: "Thu", start: "09:00", end: "11:00" }],
      teacher: "TS. Lê Thị F",
      faculty: "Khoa Toán - Tin học",
      weeks: "15 tuần (30 buổi)",
      enrolled: 38,
      capacity: 42,
      rating: 4.6,
      ratingCount: 22,
    },
  ]);
  const registeredCount = useMemo(
    () => registeredCourses.length,
    [registeredCourses],
  );
  const [message, setMessage] = useState<string>("");

  const filterData = sampleCourses.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function getRegisteredCount(_studentId: number) {
    return registeredCount;
  }

  function checkScheduleConflict(courseId: number, _studentId: number) {
    const course = sampleCourses.find((c) => c.id === courseId);
    if (!course) return false;
    for (const reg of registeredCourses) {
      for (const t1 of reg.timeslots) {
        for (const t2 of course.timeslots) {
          if (timeOverlap(t1, t2)) return true;
        }
      }
    }
    return false;
  }

  function saveRegistrationRequest(
    _courseId: number,
    _studentId: number,
    _status: "PENDING",
  ) {
    return { success: true } as const;
  }

  function processRegistrations(
    courseId: number,
    studentIdParam: number,
  ): ServiceResult {
    const count = getRegisteredCount(studentIdParam);
    const conflict = checkScheduleConflict(courseId, studentIdParam);
    const isValid = !conflict && count < 5;
    if (isValid) {
      const saved = saveRegistrationRequest(courseId, studentIdParam, "PENDING");
      if (saved.success) {
        return {
          status: "PENDING",
          message: "Gửi yêu cầu thành công. Đang chờ phê duyệt.",
        };
      }
    }
    return {
      status: "FAILED",
      message: "❌ Trùng lịch hoặc vượt giới hạn số môn học.",
    };
  }

  function submitRegistrations(courseId: number) {
    const result = processRegistrations(courseId, studentId);
    setMessage(result.message);
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
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option>Tất cả trạng thái</option>
                    <option>Đang học</option>
                    <option>Sắp mở</option>
                    <option>Đã hoàn thành</option>
                  </select>
                </div>

                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    <option>Tất cả khoa</option>
                    <option>Khoa Toán - Tin học</option>
                    <option>Khoa Khoa học và Kỹ thuật Máy tính</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">Đang học</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {sampleCourses.length}
              </p>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">Sắp mở</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">0</p>
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

          {filterData.length > 0 ? (
            filterData.map((c) => {
              const progress = Math.round((c.enrolled / c.capacity) * 100);
              const times = c.timeslots
                .map((t) => `${t.day}, ${t.start}-${t.end}`)
                .join(" • ");
              return (
                <div key={c.id} className="col-span-12">
                  <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 lg:col-span-9">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-900">
                            {c.name}
                          </h3>
                          <span className="inline-block rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">
                            Đang học
                          </span>
                        </div>

                        <div className="grid grid-cols-12 gap-4 text-xs text-gray-500">
                          <div className="col-span-12 sm:col-span-6">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="font-medium">Mã khóa học:</span>
                              <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-gray-800">
                                {c.code}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div>👨‍🏫 {c.teacher}</div>
                              <div>🏫 {c.faculty}</div>
                            </div>
                          </div>

                          <div className="col-span-12 sm:col-span-6">
                            <div className="space-y-1">
                              <div>⏱ {c.weeks}</div>
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
                              ⭐ {c.rating.toFixed(1)} ({c.ratingCount})
                            </span>
                            <span>
                              {c.enrolled}/{c.capacity} học viên
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 flex items-start justify-end lg:col-span-3">
                        <button
                          onClick={() => submitRegistrations(c.id)}
                          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 lg:w-auto"
                        >
                          Đăng ký
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

