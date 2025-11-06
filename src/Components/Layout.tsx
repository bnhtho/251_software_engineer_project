import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import React from "react"; 
// Không cần useState hay useParams nếu các component con tự quản lý

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Full width */}
      <div className="sticky top-0 z-50"> 
        <Navbar /> 
      </div>

      {/* Main container with 12-column grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 min-h-[calc(100vh-4rem)]">
          
          {/* Sidebar - 3 columns on desktop, hidden on mobile */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2 hidden md:block">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto bg-white rounded-lg shadow-sm border border-gray-200">
              <Sidebar />
            </div>
          </div>

          {/* Main content - 9 columns on desktop, full width on mobile */}
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

export default Layout;