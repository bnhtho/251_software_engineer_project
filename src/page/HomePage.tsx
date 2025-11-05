
import { useParams } from "react-router-dom";
// import {}
import ReviewCard from "../Components/ReviewCard";
import Announcement from "../Components/AnnoucementCard";
const reviewsData = [
  {
    courseName: "Cấu trúc rời rạc",
    reviewText:
      "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    authorName: "Nguyễn Văn Hiền",
    date: "30/10/2025",
    rating: 2,
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
    reviewText: "Review body",
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
    const idUser  = useParams();
    return  (
        <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Chào mừng trở lại, người dùng { idUser.userID }!
        
      </h1>
    {/* Load Review */}
              <Announcement annouceList={announcements} />
        {/*  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewsData.map((review, idx) => (
                <ReviewCard key={idx} {...review} />
            ))}
            </div>

    </div>
    

    )

};
    
    

export default HomePage;