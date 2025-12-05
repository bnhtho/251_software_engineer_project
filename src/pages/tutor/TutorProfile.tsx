import InfoForm from "../../Components/InfoForm";
import { useUser } from "../../Context/UserContext";
import TutorCard from "../../Components/TutorCard";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const TutorProfilePage = () => {
  const { user, isLoading } = useUser();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if not tutor
  if (user.role?.toLowerCase() !== "tutor") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Toaster position="top-right" />
      <title>Thông tin cá nhân của gia sư</title>
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Thông tin cá nhân gia sư
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin cá nhân của gia sư
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4">
            <TutorCard
              name={user.firstName || ""}
              lastName={user.lastName || ""}
              title={user.title || ""}
              department={user.department || ""}
              description={user.bio || ""}
              specializations={user.subjects?.map((s) => s.name) || []}
              rating={user.rating || 0}
              reviewCount={0}
              studentCount={user.totalSessionsCompleted || 0}
              experienceYears={user.experienceYears || 0}
              isAvailable={user.isAvailable ?? false}
            />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <InfoForm />
          </div>
        </div>
      </div>
    </>
  );

}
export default TutorProfilePage;
