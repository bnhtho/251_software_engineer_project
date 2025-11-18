import ReviewCard from "../../Components/ReviewCard";
import Announcement from "../../Components/AnnoucementCard";
import axios from 'axios';

const reviewsData = [
  {
    courseName: "Cấu trúc rời rạc",
    reviewText: "Thầy giảng dễ hiểu , đi sâu vào trọng tâm môn học",
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
];

async function majors() {
  
  console.log("Tính năng majors đang được phát triển...");
}
const announcements = [
  { title: "Lịch học tuần này", content: "Cập nhật lịch học mới nhất." },
  { title: "Thông báo nghỉ lễ", content: "Trường nghỉ từ 10/11 đến 12/11." },
];

const HomePage = () => {
  return (
    <>
      <title>Trang chủ</title>
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="text-2xl font-bold text-gray-900">Trang chủ</h1>
            <p className="text-gray-600">
              Chào mừng bạn đến với hệ thống gia sư HCMUT
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Announcement annouceList={announcements} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">Thống kê nhanh</h3>
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

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Đánh giá gần đây
            </h2>
          </div>

          {reviewsData.map((review, idx) => (
            <div key={idx} className="col-span-12 md:col-span-6 lg:col-span-4">
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;

