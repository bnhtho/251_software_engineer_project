import ReviewCard from "../../Components/ReviewCard";
import Announcement from "../../Components/AnnoucementCard";

const HomePage = () => {
  return (
    <>
      <title>Trang chủ</title>
      <div className="space-y-8 p-6">
        <div
          className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3"
          role="alert"
        >
          <p className="font-bold">Thông báo</p>
          <p className="text-sm">Hệ thống đã cập nhật đăng ký làm gia sư.</p>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="text-2xl font-bold text-gray-900">Trang chủ</h1>
            <p className="text-gray-600">
              Chào mừng bạn đến với hệ thống gia sư HCMUT
            </p>
          </div>
        </div>

        {/* Callout */}
        
      </div>
    </>
  );
};

export default HomePage;
