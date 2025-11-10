import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <header>Admin Header</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
