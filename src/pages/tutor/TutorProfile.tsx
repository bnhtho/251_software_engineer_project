// import ProfileCard from "../../Components/ProfileCard";
import InfoForm from "../../Components/InfoForm";
import { useUser } from "../../Context/UserContext";
// import { fetchProfile } from "../../Context/UserContext";
import { useEffect, useState } from "react";
import ProfileCard from "../../Components/ProfileCard";
import HistoryLearning from "../../Components/HistoryLearning";
import { Edit } from "lucide-react";
const TutorProfilePage = () => {

  return (
    <>
      <title>Thông tin cá nhân của gia sư</title>
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Thông tin cá nhân giá sư
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin cá nhân của gia sư
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <ProfileCard/>
          </div>
          <div className="col-span-12 lg:col-span-8">
            {/* NOTE: [x] Đã fetch xong Data từ API */}
            <InfoForm />
          </div>
        </div>
    {/* NOTE [x] History  */}
    <HistoryLearning/>
    {/* NOTE: [ ] Edit profile */}
    
      </div>
    </>
  );

}
export default TutorProfilePage;
