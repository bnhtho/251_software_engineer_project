import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <header>Admin Header</header>
      <main>
        <Outlet /> {/* Đây sẽ render SimpleDashboardPage hoặc các route nested khác */}
      </main>
    </div>
  );
}
