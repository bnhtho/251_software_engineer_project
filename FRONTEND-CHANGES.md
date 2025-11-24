# 📝 FRONTEND CHANGES LOG

## Session: 24/11/2025 - API Integration & Bug Fixes

### 🎯 Objective
Fix Frontend implementation của "Course" và "Schedule" features bằng cách tích hợp đúng với Backend APIs.

---

## ✅ COMPLETED CHANGES

### 1. API Services (src/services/api.ts)

#### Modified courseApi.getCourses()
- Old: Called GET /courses (doesn't exist)
- New: Multi-level fallback
  1. Try GET /students/available-sessions (for STUDENT)
  2. If 403 → Fallback to GET /sessions (for ADMIN)
  3. If empty → Fallback to GET /sessions
  4. Transform BackendSessionDTO → CourseDTO

#### Modified courseApi.registerCourse()
- Old: POST /courses/{id}/register
- New: POST /students/register-session?sessionId={id}

#### Modified courseApi.getStudentCourses()
- Old: GET /students/{id}/courses
- New: GET /students/history/{userId} with 403 handling

#### Modified scheduleApi.getStudentSessions()
- Old: GET /students/{id}/sessions
- New: GET /students/history/{userId} with date filtering

#### Added Error Handling
- Graceful 403 handling for admin viewing student pages
- Return empty array instead of throwing errors

---

### 2. Course Page (src/pages/user/Course.tsx)

#### User Authentication Check
- Check user from Context instead of localStorage
- Show Login Prompt UI instead of toast error

#### Admin Warning Banner
- Display info banner when admin views student page
- Message: "Bạn đang xem với quyền Admin"

#### Disabled Registration for Admin
- Check role before allowing registration
- Disabled button with message "Không thể đăng ký"

#### Error Handling
- Handle 401 (token expired) → redirect to login
- Handle 403 gracefully → show empty state

---

### 3. Schedule Page (src/pages/user/Schedule.tsx)

#### Week Navigation
- Added changeWeek() function for prev/next week
- Connected to ChevronLeft and ChevronRight buttons

#### 403 Error Handling
- Silent handling when student has no sessions
- Show empty state instead of error toast

#### Empty State with CTA
- Beautiful empty state UI
- Call-to-action button: "Đăng ký khoá học"
- Redirects to /dashboard/courses

#### User Check
- Return login prompt if user not authenticated
- Check studentId before loading data

---

### 4. Admin Sessions (src/pages/admin/Sessions.tsx)

#### Full Implementation
- View all sessions (GET /sessions)
- Create session form (POST /sessions)
- Edit session (PUT /sessions/{id})
- Delete session (DELETE /sessions/{id})
- Statistics cards (total, students, capacity)

#### Permission Warning
- Warning banner about ownership restrictions
- Error messages on 403: "Chỉ giảng viên tạo buổi học mới có quyền..."

---

### 5. Admin Courses (src/pages/admin/Courses.tsx)

#### Statistics View
- Display all subjects from backend
- Show statistics per subject:
  - Number of sessions
  - Number of students
  - Total capacity
  - Utilization rate
- Search functionality

#### Info Note
- Guide users to Sessions page for creating new sessions
- Explain that this page is view-only

---

## 🔧 TESTING TOOLS CREATED

### 1. test-api.ps1
PowerShell script to test all APIs:
- Subjects, Departments, Sessions
- Login and token validation
- Available sessions for students
- Tutors list

### 2. test-student-history.ps1
Debug script for Student History bug:
- Login with student account
- Decode JWT token
- Test GET /students/history/{userId}
- Analyze 403 errors

---

## 🎨 UI/UX IMPROVEMENTS

### Before:
- Red error toasts everywhere
- No explanation for errors
- Broken features without data

### After:
- Graceful error handling
- Beautiful empty states
- Clear warning messages
- Call-to-action buttons
- Role-based UI adjustments

---

## 📊 FILES MODIFIED

1. src/services/api.ts - API services layer
2. src/pages/user/Course.tsx - Course listing page
3. src/pages/user/Schedule.tsx - Schedule/Calendar page
4. src/pages/admin/Sessions.tsx - Admin session management
5. src/pages/admin/Courses.tsx - Admin course statistics
6. test-api.ps1 - API testing script
7. test-student-history.ps1 - Debug script

---

## 🐛 BUGS FOUND & REPORTED

### Backend Issues:
1. GET /students/history/{userId} returns 403 even with correct auth
2. GET /students/available-sessions returns empty array
3. Admin cannot edit/delete sessions (ownership check)

### Frontend Workarounds:
1. Fallback to /sessions when available-sessions empty
2. Handle 403 silently and show empty state
3. Display warning messages for permission issues

---

## 📝 TODO / PENDING

### Waiting for Backend:
- [ ] Fix Student History 403 bug
- [ ] Fix Available Sessions logic
- [ ] Add Cancel Registration endpoint
- [ ] Add Admin override permissions

### Frontend Enhancements:
- [ ] Remove debug logs when Backend fixes are confirmed
- [ ] Update error messages when APIs are ready
- [ ] Add more detailed session information
- [ ] Implement calendar view for schedule

---

## 🔗 REFERENCES

- Backend README: 251_software_engineer_project_be/README_FE.md
- API Issues Report: API-ISSUES-REPORT.md
- Quick Checklist: QUICK-API-CHECKLIST.md

---

Last Updated: 24/11/2025 23:37
