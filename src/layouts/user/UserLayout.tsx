import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import TutorSidebar from "../../Components/TutorSidebar";
import { useUser } from "../../Context/UserContext";

const UserLayout = () => {
  const { user } = useUser();
  const location = useLocation();
  
  // Determine if user is in tutor routes
  const isTutorRoute = location.pathname.startsWith('/tutor');
  const isTutor = user?.role?.toLowerCase() === 'tutor';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-4rem)]">
          <div className="col-span-12 md:col-span-3 lg:col-span-2 hidden md:block">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto bg-white rounded-lg shadow-sm border border-gray-200">
              {isTutorRoute || isTutor ? <TutorSidebar /> : <Sidebar />}
            </div>
          </div>

          <div className="col-span-12 md:col-span-9 lg:col-span-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;

