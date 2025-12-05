import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import AdminLoginPage from "./page/AdminLoginPage";
import HomePage from "./pages/user/HomePage";
import Profile from "./pages/user/Profile";
import Sessions from "./pages/user/Session";
import UserLayout from "./layouts/user/UserLayout";
import AdminLayout from "./layouts/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTutorsPending from "./pages/admin/Tutors";
import AdminCourses from "./pages/admin/Courses";
import AdminSessions from "./pages/admin/Sessions";
import AdminSettings from "./pages/admin/Settings";
import PageNotFound from "./page/PageNotFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import { UserProvider } from "./Context/UserContext";
// Scheduler
import SchedulePage from "./pages/user/Schedule";
// Tutor
import TutorHomePage from "./pages/tutor/TutorHomepage";
import TutorProfilePage from "./pages/tutor/TutorProfile";
import TutorSessions from "./pages/tutor/TutorSessions";
import TutorRegistrationsPage from "./pages/tutor/TutorRegistrationsPage";
import { ToastContainer } from 'react-toastify';
import BecomeTutorPage from "./pages/user/BecomeTutor";
// import Sessions from "./pages/admin/Sessions";
// import Courses from "./pages/user/Course";
export default function App() {
  return (
    <>

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
              <Route path="sessions" element={<Sessions />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="become-tutor" element={<BecomeTutorPage />} />
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
              <Route path="sessions" element={<TutorSessions />} />
              <Route path="registrations" element={<TutorRegistrationsPage />} />
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
              <Route path="tutors" element={<AdminTutorsPending />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="sessions" element={<AdminSessions />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* ========== ERROR HANDLING ========== */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
      <ToastContainer />
    </>
  );
}
