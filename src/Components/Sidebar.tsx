import { NavLink, useParams } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import hcmutLogo from '/src/assets/logo.svg';
import { useState } from "react";
import { ChevronRight, Home, Users, BookOpen, FileText, Settings, Bell, User, Menu } from "lucide-react";
import React from "react"; 


type NavItemType = {
    label: string;
    path: string;
    icon: React.ElementType;
    isFooter?: boolean;
};

type NavItemDividerType = {
    divider: true;
};


const mainNavItems: (NavItemType | NavItemDividerType)[] = [
    { icon: Home, label: "Trang chủ", path: "" },
    { icon: Users, label: "Thông tin cá nhân", path: "profile" },
    { icon: BookOpen, label: "Lịch học", path: "schedule" },
    { icon: FileText, label: "Khóa học", path: "courses" },
    { icon: Users, label: "Danh sách Gia sư", path: "tutors" },
    { icon: FileText, label: "Phản hồi", path: "feedback" },
    { icon: Menu, label: "Báo cáo", path: "reports" },
    { divider: true }, 
    { icon: Settings, label: "Cài đặt", path: "settings" },
];

const bottomItems: NavItemType[] = [
    { icon: Bell, label: "Notifications", path: "notifications", isFooter: true },
    { icon: User, label: "Account", path: "account", isFooter: true },
];

export default function Sidebar() {
    const { user } = useUser();
    // Giữ lại state cho mobile toggle (cần được kích hoạt từ Layout/Navbar)
    const [isOpen, setIsOpen] = useState(false); 

    // Hàm render link (sử dụng NavLink hoặc Button)
    const renderNavItem = (item: NavItemType, key: number) => {
        // Nếu là mục footer, dùng button
        if (item.isFooter) {
            return (
                <button 
                    key={key}
                    onClick={() => { /* Xử lý sự kiện footer click */ }}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                </button>
            );
        }

        // Nếu là mục navigation, dùng NavLink
        const toPath = item.path === "" ? `/home/${user?.id}` : `/home/${user?.id}/${item.path}`;

        return (
            <NavLink
                key={key}
                to={toPath}
                end={item.path === ""}
                onClick={() => setIsOpen(false)} // Tự đóng khi click trên mobile
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${
                        isActive
                            ? "bg-gray-100 text-[#0E7AA0]" // Sử dụng màu xanh HCMUT
                            : "text-gray-700 hover:bg-gray-100 transition-colors"
                    }`
                }
            >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {/* Thêm lại ChevronRight nếu bạn muốn nó xuất hiện */}
                <ChevronRight className="ml-auto h-4 w-4 text-gray-400" /> 
            </NavLink>
        );
    };

    return (
              <aside
          className={`
            flex flex-col h-full w-full bg-white border-r border-gray-200 
            
          `}
        >
            {/* --- 2. Main Navigation (flex-grow để mở rộng và cuộn độc lập) --- */}
            <nav className="space-y-1 px-2 py-4 overflow-y-auto flex-grow">
                {mainNavItems.map((item, idx) => {
                    if ('divider' in item) {
                        return <hr key={idx} className="my-2 border-gray-200" />;
                    }
                    return renderNavItem(item as NavItemType, idx);
                })}
            </nav>

            {/* --- 3. Bottom Menu (Dính ở đáy nhờ Flexbox) --- */}
            <div className="w-full border-t border-gray-200 bg-white px-2 py-4 space-y-1 flex-shrink-0"> 
                {bottomItems.map((item, idx) => renderNavItem(item, idx + mainNavItems.length))}
            </div>
        </aside>
    );
}