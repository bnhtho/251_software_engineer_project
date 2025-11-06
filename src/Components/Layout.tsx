import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar cố định bên trái */}
        <div className="w-64 h-full fixed top-[64px] left-0 bg-white shadow-lg">
          <Sidebar />
        </div>

        <div className="flex-1 ml-64 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
