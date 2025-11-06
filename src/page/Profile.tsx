import ProfileCard from "../Components/ProfileCard"

// import InfoCard from "../Components/InfoForm"
import LearningHistoryItem from "../Components/LearningHistoryItem"
import InfoForm from "../Components/InfoForm"
import {useUser} from "../Context/UserContext";

const ProfilePage = () => {
  // const } = useUser();
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
      statusColor: "blue",
    },
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân và theo dõi lịch học tập</p>
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="col-span-12 lg:col-span-4">
          <ProfileCard name={user?.name ?? ""} mssv="2012345" />
        </div>
        
        {/* Info Form */}
        <div className="col-span-12 lg:col-span-8">
          <InfoForm />
        </div>
      </div>

      {/* Learning History Section */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Lịch sử học tập</h2>
            
            {/* Table Layout for Learning History */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khóa học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giảng viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày học
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
  )
}

export default ProfilePage
      