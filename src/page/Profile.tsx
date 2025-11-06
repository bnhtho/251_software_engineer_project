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
    <div className="flex h-screen bg-gray-50">
        <div className="flex-1 overflow-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân và theo dõi lịch học tập</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div>
    {/* #NOTE: Trả về userContext.name => Tên người dùng, userContext.role="Vai trò" Ghi chú:  */}
              <ProfileCard name={user?.name ?? ""}  mssv="2012345" />
            </div>
            <div className="lg:col-span-2">
                <InfoForm/>
            </div>
          </div>

          {/* Learning History Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Lịch sử học tập</h2>
            <div className="space-y-3">
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
            </div>
          </div>
          </div>
    </div>
  )
}

export default ProfilePage
      