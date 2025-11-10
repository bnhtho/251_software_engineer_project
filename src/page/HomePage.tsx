
import ReviewCard from "../Components/ReviewCard";
import Announcement from "../Components/AnnoucementCard";
const reviewsData = [
  {
    courseName: "Cấu trúc rời rạc",
    reviewText:
      "Thầy giảng dễ hiểu , đi sâu vào trọng tâm môn học",
    authorName: "Nguyễn Văn Hiền",
    date: "30/10/2025",
    rating: 5,
  },
  {
    courseName: "Toán rời rạc",
    reviewText: "Giáo viên giảng dạy rất hiệu quả",
    authorName: "Nguyễn Thị Thu",
    date: "31/10/2025",
    rating: 5,
  },
  {
    courseName: "Tiếng Anh 2",
    reviewText: "Môn học cực kì thú vị",
    authorName: "Nguyễn Tân Lực",
    date: "30/10/2025",
    rating: 5,
  },
]
const announcements = [
  { title: "Lịch học tuần này", content: "Cập nhật lịch học mới nhất." },
  { title: "Thông báo nghỉ lễ", content: "Trường nghỉ từ 10/11 đến 12/11." },
];
const HomePage = () => {
    return  (
        <>
        <title>Trang chủ</title>
        <div className="p-6 space-y-8">
            {/* Header Section */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Trang chủ</h1>
                    <p className="text-gray-600">Chào mừng bạn đến với hệ thống gia sư HCMUT</p>
                </div>
            </div>

            {/* Announcements Section */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8">
                    <Announcement annouceList={announcements} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    {/* Quick Stats or Additional Info */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">Thống kê nhanh</h3>
                        <div className="space-y-2 text-sm text-blue-800">
                            <div className="flex justify-between">
                                <span>Tổng đánh giá:</span>
                                <span className="font-medium">{reviewsData.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Thông báo mới:</span>
                                <span className="font-medium">{announcements.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Đánh giá gần đây</h2>
                </div>
                
                {/* Reviews Grid */}
                {reviewsData.map((review, idx) => (
                    <div key={idx} className="col-span-12 md:col-span-6 lg:col-span-4">
                        <ReviewCard {...review} />
                    </div>
                ))}
            </div>
        </div>
        </>
    )
};
    
    

export default HomePage;