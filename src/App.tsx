import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import Schedule from "./page/Schedule";
import HomePage from "./page/HomePage";
import Profile from "./page/Profile";
import CoursePage from "./page/Course";
import Layout from "./Components/Layout";
import PageNotFound from "./page/PageNotFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import { UserProvider } from "./Context/UserContext";

export default function App() {
    
  return (

    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* ========== ROOT REDIRECT ========== */}
          {/* Redirect root to login page */}
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* ========== PUBLIC ROUTES ========== */}
          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Register Page - TODO: Create RegisterPage component */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          
          {/* Forgot Password Page - TODO: Create ForgotPasswordPage component */}
          {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

          {/* ========== PROTECTED ROUTES (User Dashboard) ========== */}
          {/* Layout wrapper cho các trang cần authentication */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard/HomePage */}
            <Route index element={<HomePage />} />
            
            {/* Profile */}
            <Route path="profile" element={<Profile />} />
            
            {/* Schedule */}
            <Route path="schedule" element={<Schedule />} />
            
            {/* Courses */}
            <Route path="courses" element={<CoursePage />} />
            
            {/* Settings - TODO: Create Settings component */}
            {/* <Route path="settings" element={<Settings />} /> */}
            
            {/* Notifications - TODO: Create Notifications component */}
            {/* <Route path="notifications" element={<Notifications />} /> */}
            
            {/* Help - TODO: Create HelpPage component */}
            {/* <Route path="help" element={<HelpPage />} /> */}
          </Route>

          {/* ========== ADMIN ROUTES ========== */}
          {/* Admin Layout - TODO: Create AdminLayout component */}
          {/* <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          > */}
            {/* Admin Dashboard - TODO: Create AdminDashboard component */}
            {/* <Route index element={<AdminDashboard />} /> */}
            {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
            
            {/* User Management - TODO: Create UserManagement component */}
            {/* <Route path="users" element={<UserManagement />} /> */}
            
            {/* Reports - TODO: Create Reports component */}
            {/* <Route path="reports" element={<Reports />} /> */}
          {/* </Route> */}

          {/* ========== ERROR HANDLING ========== */}
          {/* 404 Page */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
