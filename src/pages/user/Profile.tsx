import ProfileCard from "../../Components/ProfileCard";
import LearningHistoryItem from "../../Components/LearningHistoryItem";
import InfoForm from "../../Components/InfoForm";
import { useUser } from "../../Context/UserContext";

const ProfilePage = () => {
  const { user } = useUser();

  const learningHistory = [
    {
      courseName: "Toán Cao Cấp 1",
      instructor: "TS. Nguyễn Văn A",
      date: "28/10/2025",
      duration: "2 giờ",
      status: "Đã hoàn thành",
      statusColor: "green",
    },
    {
      courseName: "Vật Lý Đại Cương",
      instructor: "PGS. Trần Thị B",
      date: "25/10/2025",
      duration: "1.5 giờ",
      status: "Đã hoàn thành",
      statusColor: "green",
    },
    {
      courseName: "Cấu trúc Dữ liệu",
      instructor: "TS. Lê Văn C",
      date: "05/11/2025",
      duration: "2 giờ",
      status: "Sắp diễn ra",
      statusColor: "orange",
    },
  ];

  return (
    <>
      <title>Thông tin cá nhân</title>
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Thông tin cá nhân
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin cá nhân và theo dõi lịch học tập
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <ProfileCard name={user?.name ?? ""} mssv="2012345" />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <InfoForm />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-bold text-gray-900">
                Lịch sử học tập
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Khóa học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Giảng viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Ngày học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Thời lượng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {learningHistory.map((item, idx) => (
                      <LearningHistoryItem
                        key={idx}
                        courseName={item.courseName}
                        instructor={item.instructor}
                        date={item.date}
                        duration={item.duration}
                        status={item.status}
                        statusColor={item.statusColor}
                      />
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
};

export default ProfilePage;

