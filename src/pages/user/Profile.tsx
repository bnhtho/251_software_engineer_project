import { useState } from "react";
import ProfileCard from "../../Components/ProfileCard";
import InfoForm from "../../Components/InfoForm";
import HistoryLearning from "../../Components/HistoryLearning";
import SchedulePage from "../../pages/user/Schedule";

// Dùng hằng số để tránh lặp lại chuỗi
const TABS = {
  INFO: "info",
  HISTORY: "history",
};

const tabItems = [
  { id: TABS.INFO, label: "Thông tin cá nhân" },
  { id: TABS.HISTORY, label: "Lịch sử đăng ký môn học" },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(TABS.INFO);

  return (
    <>
      <title>Thông tin cá nhân</title>
      {/* Main Container - Tăng padding và background nhẹ */}
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Cài đặt Hồ sơ
          </h1>
          <p className="mt-1 text-base text-gray-600">
            Quản lý thông tin cá nhân và theo dõi quá trình học tập của bạn.
          </p>
        </header>

        {/* Tabs Navigation - Thanh Tabs tối giản, hiện đại */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap border-b-2 py-3 px-1 text-base font-medium transition-colors duration-200 ease-in-out
                  ${activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content Area */}
        <div className="py-4">
          {activeTab === TABS.INFO && (
            // Layout "Thông tin cá nhân" - Dùng Grid cho màn hình lớn, chia 1/3 và 2/3
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 xl:grid-cols-12">
              {/* Profile Card (1/3 or 4/12) */}
              <div className="lg:col-span-1 xl:col-span-4">
                <div className="sticky top-6">
                  <ProfileCard />
                </div>
              </div>

              {/* Info Form (2/3 or 8/12) */}
              <div className="lg:col-span-2 xl:col-span-8">
                <InfoForm />
              </div>
            </div>
          )}

          {activeTab === TABS.HISTORY && (
            // Layout "Lịch sử đăng ký môn học
            <div className="space-y-6">
              <HistoryLearning />
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ProfilePage;