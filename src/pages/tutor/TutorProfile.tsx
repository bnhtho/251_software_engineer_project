// import ProfileCard from "../../Components/ProfileCard";
import InfoForm from "../../Components/InfoForm";
import { useUser } from "../../Context/UserContext";
// import { fetchProfile } from "../../Context/UserContext";
import { useEffect, useState } from "react";
import ProfileCard from "../../Components/StudentCard";
import HistoryLearning from "../../Components/HistoryLearning";
import { Edit } from "lucide-react";
import TutorCard from "../../Components/TutorCard";
const TutorProfilePage = () => {
  const { user, logout } = useUser();

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
            <TutorCard
              id={user?.id ?? 0}
              name={user?.firstName || ""}
              lastName={user?.lastName || ""}
              title={user?.title || ""}
              department={user?.department || ""}
              description={user?.bio || ""}
              specializations={user?.subjects?.map((s) => s.name) || []}
              rating={user?.rating || 0}
              reviewCount={0}
              studentCount={user?.totalSessionsCompleted || 0}
              experienceYears={user?.experienceYears || 0}
              isAvailable={user?.isAvailable ?? false}
              onMessage={(id) => console.log("Message", id)}
              onSchedule={(id) => console.log("Schedule", id)}
            />
          </div>
          <div className="col-span-12 lg:col-span-8">
            {/* InforForm: Nhận theo Role */}
            <InfoForm />
          </div>
        </div>
        {/* <HistoryLearning /> */}

      </div>
    </>
  );

}
export default TutorProfilePage;
