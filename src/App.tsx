import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import Schedule from "./page/Schedule";
import HomePage from "./page/HomePage";
import Profile from "./page/Profile";
import CoursePage from "./page/Course";
import TutorList from "./page/TutorList";
import Materials from "./page/materials"; // Import index.tsx - tự động routing theo role
import Layout from "./Components/Layout";
// import AdminLayout from "";
import AdminLayout from "./Components/admin/layout";
import PageNotFound from "./page/PageNotFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AdminDashboardPage } from "./page/admin/dashboard";
import { UserProvider } from "./Context/UserContext";
// import {UserList} from ""
import { AdminUsersPage } from "./page/admin/UserList";
export default function App() {
    return (
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    {/* ========== ROOT REDIRECT ========== */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* ========== PUBLIC ROUTES ========== */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Register Page - TODO: Create RegisterPage component */}
                    {/* <Route path="/register" element={<RegisterPage />} /> */}

                    {/* Forgot Password Page - TODO: Create ForgotPasswordPage component */}
                    {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

                    {/* ========== PROTECTED ROUTES (User Dashboard) ========== */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<HomePage />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="schedule" element={<Schedule />} />
                        <Route path="courses" element={<CoursePage />} />
                        <Route path="tutors" element={<TutorList />} />
                        
                        {/* Materials - Tự động routing theo role:
                            - Student: ViewMaterials (xem danh sách)
                            - Tutor: UploadMaterials (form upload)
                            - Admin: ViewMaterials (xem danh sách để duyệt) */}
                        <Route path="materials" element={<Materials />} />

                        {/* Settings - TODO: Create Settings component */}
                        {/* <Route path="settings" element={<Settings />} /> */}

                        {/* Notifications - TODO: Create Notifications component */}
                        {/* <Route path="notifications" element={<Notifications />} /> */}

                        {/* Help - TODO: Create HelpPage component */}
                        {/* <Route path="help" element={<HelpPage />} /> */}
                    </Route>

                    {/* ========== ADMIN ROUTES ========== */}
                    {/* Admin Layout - TODO: Create AdminLayout component */}
                    
                    <Route 
  path="/admin" 
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  {/* Admin Dashboard */}
  {/* <Route index element={<SimpleDashboardPage />} /> */}
{/* <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> */}
  {/* User Management - TODO */}
  {/* <Route path="users" element={<UserManagement />} /> */}
  {/* Reports - TODO */}
  {/* <Route path="reports" element={<Reports />} /> */}
</Route>
                    {/* Admin Dashboard - TODO: Create AdminDashboard component */}
                    <Route index element={<AdminDashboardPage />} />
                    {/* User Management - TODO: Create UserManagement component */}
                    <Route path="user" element={<AdminUsersPage />} />

                    {/* Reports - TODO: Create Reports component */}
                    {/* <Route path="reports" element={<Reports />} /> */}
                    {/* </Route> */}

                    {/* ========== ERROR HANDLING ========== */}
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    );
}
