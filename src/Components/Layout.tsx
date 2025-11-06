import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import { useState } from "react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Navbar></Navbar>
      {/* <Navbar onMenuClick={() => setSidebarOpen(true)} /> */}
      <div className="flex flex-1">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed top-[64px] left-0 z-50 h-full w-64 bg-white
            transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            transition-transform duration-200 ease-in-out
            md:translate-x-0 md:static md:block
          `}
        >
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout