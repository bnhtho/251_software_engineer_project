import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import React from "react"; 
// Không cần useState hay useParams nếu các component con tự quản lý

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      
      <div className="flex-shrink-0"> 
          <Navbar /> 
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        <div className="flex-shrink-0 w-64 hidden md:block border-r border-gray-200 bg-white">
          {/*
          */}
          <Sidebar />
        </div>

        <div className="w-full space-y-6 px-6 pb-6">
          
          <div className="flex flex-1 w-full">
            <Outlet />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Layout;