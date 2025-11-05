import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import Schedule from "./page/Schedule";
import HomePage from "./page/HomePage";
import Profile from "./page/Profile";
import CoursePage from "./page/Course";
import Layout from "./Components/Layout";
import PageNotFound from "./page/PageNotFound";
import { UserProvider } from "./Context/UserContext";
export default function App() {
  return (
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
{/* NOTE: Ghi chú: Layout là trang template sẵn, có sidebar bên trái và navbar(header) trên đầu */}
        {/* ✅ Các route CÓ Layout */}
        <Route path="/home/:userID" element={<Layout />}>
          {/* Home page (index) */}
          <Route index element={<HomePage />} />

          {/* Schedule */}
          <Route path="schedule" element={<Schedule />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />} />
        
          {/* Courses */}
          <Route path="courses" element={<CoursePage />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />

      </Routes>
    </BrowserRouter>
    </UserProvider>
  );
}
