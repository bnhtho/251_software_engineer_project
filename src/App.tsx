import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import AdminLoginPage from "./page/AdminLoginPage";
import Schedule from "./pages/user/Schedule";
import HomePage from "./pages/user/HomePage";
import Profile from "./pages/user/Profile";
import CoursePage from "./pages/user/Course";
import TutorList from "./pages/user/TutorList";
import Materials from "./pages/shared/materials";
import UserLayout from "./layouts/user/UserLayout";
import AdminLayout from "./layouts/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCourses from "./pages/admin/Courses";
import AdminSessions from "./pages/admin/Sessions";
import AdminReports from "./pages/admin/Reports";
import AdminFeedback from "./pages/admin/Feedback";
import AdminSettings from "./pages/admin/Settings";
import PageNotFound from "./page/PageNotFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import { UserProvider } from "./Context/UserContext";
// Tutor
import TutorHomePage from "./pages/tutor/TutorHomepage";
import TutorProfilePage from "./pages/tutor/TutorProfile";
// import StudentHomePage from "./pages/student/StudentHomePage"; // Student dashboard
import { Home } from "lucide-react";
export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* ========== ROOT REDIRECT ========== */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ========== PROTECTED ROUTES (User Dashboard) ========== */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} /> {/* Student Dashboard */}
            <Route path="profile" element={<Profile />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="courses" element={<CoursePage />} />
            <Route path="tutors" element={<TutorList />} />
            <Route path="materials" element={<Materials />} />
          </Route>

          {/* ========== TUTOR ROUTES ========== */}
          <Route
            path="/tutor"
            element={
              <ProtectedRoute requireTutor> {/* Đảm bảo người dùng là tutor */}
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TutorHomePage />} /> {/* Tutor Dashboard */}
            <Route path="dashboard" element={<TutorHomePage />} />
            <Route path="profile" element={<TutorProfilePage />} />
            {/* Các route khác của tutor */}
          </Route>

          {/* ========== ADMIN ROUTES ========== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="sessions" element={<AdminSessions />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ========== ERROR HANDLING ========== */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
