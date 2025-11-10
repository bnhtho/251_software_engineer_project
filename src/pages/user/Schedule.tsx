import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Laptop,
  BookOpen,
} from "lucide-react";

const scheduleData = [
  {
    id: 1,
    courseName: "Toán Cao Cấp 1 - Giải tích",
    courseCode: "MT1003",
    instructor: "TS. Nguyễn Văn Minh",
    date: "Thứ 2\n04/11/2025",
    time: "07:30 - 09:30",
    location: "Phòng H1-101",
    locationType: "Offline",
  },
  {
    id: 2,
    courseName: "Vật Lý Đại Cương",
    courseCode: "PH1003",
    instructor: "ThS. Lê Văn Tuấn",
    date: "Thứ 2\n04/11/2025",
    time: "13:30 - 15:30",
    location: "Phòng H2-203",
    locationType: "Offline",
  },
  {
    id: 3,
    courseName: "Lập trình OOP",
    courseCode: "CO1027",
    instructor: "PGS.TS. Trần Thị Hương",
    date: "Thứ 3\n05/11/2025",
    time: "13:30 - 16:00",
    location: "Google Meet",
    locationType: "Online",
  },
  {
    id: 4,
    courseName: "Cơ sở Dữ liệu",
    courseCode: "CO2003",
    instructor: "TS. Phạm Thị Lan",
    date: "Thứ 7\n09/11/2025",
    time: "09:00 - 11:00",
    location: "Microsoft Teams",
    locationType: "Online",
  },
];

export default function SchedulePage() {
  const [weekStart] = useState("04/11/2025");
  const [weekEnd] = useState("10/11/2025");

  return (
    <>
      <title>Lịch học</title>
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Calendar className="h-6 w-6 text-blue-600" />
              Lịch học
            </h1>
            <p className="text-gray-600">
              Xem danh sách các buổi học sắp tới và quản lý lịch trình của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <div className="flex items-center justify-center gap-4 rounded-lg border border-gray-200 bg-white p-6">
              <button className="rounded-md border border-gray-300 px-3 py-2 transition-colors hover:bg-gray-50">
                <ChevronLeft />
              </button>
              <div className="text-center">
                <p className="flex items-center justify-center gap-2 text-sm font-medium text-gray-900">
                  <Calendar className="h-4 w-4" />
                  Tuần: {weekStart} - {weekEnd}
                </p>
              </div>
              <button className="rounded-md border border-gray-300 px-3 py-2 transition-colors hover:bg-gray-50">
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Tổng buổi học</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {scheduleData.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Laptop className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Online</p>
                  <p className="text-2xl font-semibold text-gray-900">2</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Offline</p>
                  <p className="text-2xl font-semibold text-gray-900">2</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Tuần này</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {scheduleData.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-900">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Lịch học sắp tới
              </h2>
              <p className="mb-6 text-sm text-gray-600">
                Danh sách các buổi học trong tuần hiện tại
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">
                        #
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">
                        Tên môn
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">
                        Mã môn
                      </th>
                      <th className="hidden px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:table-cell">
                        Giảng viên
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">
                        Ngày
                      </th>
                      <th className="hidden px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 sm:table-cell">
                        Giờ
                      </th>
                      <th className="hidden px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4 md:table-cell">
                        Địa điểm
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 sm:px-4">
                        Hình thức
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {scheduleData.map((course, idx) => (
                      <tr
                        key={course.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-2 py-4 text-center font-medium text-gray-900 sm:px-4">
                          {idx + 1}
                        </td>
                        <td className="px-2 py-4 font-medium text-gray-900 sm:px-4">
                          {course.courseName}
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <span className="inline-block rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                            {course.courseCode}
                          </span>
                        </td>
                        <td className="hidden px-2 py-4 text-sm text-gray-700 sm:px-4 sm:table-cell">
                          {course.instructor}
                        </td>
                        <td className="whitespace-pre-line px-2 py-4 text-sm text-gray-700 sm:px-4">
                          {course.date}
                        </td>
                        <td className="hidden px-2 py-4 text-sm text-gray-700 sm:px-4 sm:table-cell">
                          {course.time}
                        </td>
                        <td className="hidden px-2 py-4 text-sm text-gray-700 sm:px-4 md:table-cell">
                          {course.location}
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-3 py-1 text-xs font-medium ${
                              course.locationType === "Offline"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {course.locationType === "Offline" ? (
                              <MapPin className="h-3 w-3" />
                            ) : (
                              <Laptop className="h-3 w-3" />
                            )}
                            {course.locationType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

