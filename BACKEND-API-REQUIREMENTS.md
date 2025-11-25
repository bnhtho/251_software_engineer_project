# 🔌 YÊU CẦU API TỪ BACKEND

**Ngày:** 25/11/2025  
**Mục đích:** Document các API endpoints Frontend cần Backend implement

---

## 🚨 CRITICAL PRIORITY (Cần ngay)

### 1. GET /tutors/{tutorId}/sessions
**Mục đích:** Lấy danh sách buổi học của gia sư  
**Used by:** TutorSessions.tsx  
**Importance:** HIGH

**Request:**
```
GET /tutors/{tutorId}/sessions?status={status}&startDate={date}&endDate={date}
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): SCHEDULED, COMPLETED, CANCELLED
- `startDate` (optional): ISO date
- `endDate` (optional): ISO date

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "tutorName": "Nguyễn Văn A",
      "studentNames": ["Student 1", "Student 2"],
      "subjectName": "Giải tích 1",
      "startTime": "2025-11-26T08:00:00Z",
      "endTime": "2025-11-26T10:00:00Z",
      "format": "ONLINE",
      "location": "Google Meet link",
      "maxQuantity": 5,
      "currentQuantity": 2,
      "updatedDate": "2025-11-25T10:00:00Z"
    }
  ]
}
```

---

### 2. GET /tutors/{tutorId}/registrations
**Mục đích:** Lấy danh sách đăng ký chờ duyệt  
**Used by:** TutorRegistrations.tsx  
**Importance:** HIGH

**Request:**
```
GET /tutors/{tutorId}/registrations?status={status}
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): PENDING, APPROVED, REJECTED, ALL

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 123,
      "studentId": 456,
      "studentName": "Nguyễn Văn B",
      "studentEmail": "student@hcmut.edu.vn",
      "sessionId": 789,
      "sessionSubject": "Giải tích 1",
      "sessionStartTime": "2025-11-26T08:00:00Z",
      "status": "PENDING",
      "registeredDate": "2025-11-25T10:00:00Z"
    }
  ]
}
```

---

### 3. GET /tutors/{tutorId}/schedule
**Mục đích:** Lấy lịch dạy theo tuần/tháng  
**Used by:** TutorSchedule.tsx  
**Importance:** HIGH

**Request:**
```
GET /tutors/{tutorId}/schedule?startDate={date}&endDate={date}
Authorization: Bearer {token}
```

**Query Parameters:**
- `startDate` (required): ISO date (start of week)
- `endDate` (required): ISO date (end of week)

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "sessionId": 789,
      "subjectName": "Giải tích 1",
      "studentCount": 3,
      "startTime": "2025-11-26T08:00:00Z",
      "endTime": "2025-11-26T10:00:00Z",
      "format": "ONLINE",
      "location": "Google Meet",
      "status": "SCHEDULED"
    }
  ]
}
```

---

### 4. GET /tutors/{tutorId}/dashboard
**Mục đích:** Lấy thống kê cho dashboard gia sư  
**Used by:** TutorHomePage.tsx  
**Importance:** HIGH

**Request:**
```
GET /tutors/{tutorId}/dashboard
Authorization: Bearer {token}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "stats": {
      "totalSessions": 24,
      "upcomingSessions": 5,
      "pendingRegistrations": 3,
      "totalStudents": 18,
      "completedSessions": 19,
      "cancelledSessions": 0
    },
    "upcomingSessions": [
      {
        "id": 1,
        "subjectName": "Giải tích 1",
        "studentName": "Nguyễn Văn A",
        "startTime": "2025-11-26T08:00:00Z",
        "endTime": "2025-11-26T10:00:00Z",
        "format": "ONLINE",
        "location": "Google Meet"
      }
    ],
    "pendingRegistrations": [
      {
        "id": 123,
        "studentName": "Trần Thị B",
        "sessionSubject": "Vật lý 1",
        "registrationDate": "2025-11-25T10:00:00Z"
      }
    ]
  }
}
```

---

## 🔶 HIGH PRIORITY (Cần sớm)

### 5. GET /admin/users
**Mục đích:** Lấy danh sách users (students + tutors)  
**Used by:** AdminUsers.tsx  
**Importance:** HIGH

**Request:**
```
GET /admin/users?role={role}&page={page}&size={size}
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `role` (optional): STUDENT, TUTOR, ADMIN, ALL
- `page` (optional): default 0
- `size` (optional): default 20

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "content": [
      {
        "id": 1,
        "email": "user@hcmut.edu.vn",
        "firstName": "Nguyễn",
        "lastName": "Văn A",
        "role": "STUDENT",
        "createdDate": "2025-01-01T00:00:00Z",
        "isActive": true
      }
    ],
    "totalElements": 100,
    "totalPages": 5,
    "currentPage": 0
  }
}
```

---

### 6. GET /admin/tutor-registrations
**Mục đích:** Admin xem tất cả đơn đăng ký gia sư  
**Used by:** Admin Panel (chưa có UI)  
**Importance:** MEDIUM

**Request:**
```
GET /admin/tutor-registrations?status={status}
Authorization: Bearer {admin_token}
```

**Query Parameters:**
- `status` (optional): PENDING, APPROVED, REJECTED, ALL

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "studentId": 123,
      "studentName": "Nguyễn Văn A",
      "studentEmail": "student@hcmut.edu.vn",
      "title": "Gia sư Toán",
      "majorId": 5,
      "majorName": "Computer Science",
      "subjects": [
        {"id": 1, "name": "Giải tích 1"},
        {"id": 2, "name": "Đại số"}
      ],
      "experienceYears": 2,
      "description": "Có 2 năm kinh nghiệm...",
      "status": "PENDING",
      "submittedDate": "2025-11-25T10:00:00Z",
      "reviewedDate": null,
      "rejectionReason": null
    }
  ]
}
```

---

### 7. POST /admin/tutor-registrations/{id}/approve
**Mục đích:** Admin duyệt đơn đăng ký gia sư  
**Used by:** Admin Panel  
**Importance:** MEDIUM

**Request:**
```
POST /admin/tutor-registrations/{id}/approve
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "notes": "Đạt yêu cầu"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Approved successfully",
  "data": {
    "userId": 123,
    "newRole": "TUTOR",
    "tutorProfileId": 456
  }
}
```

**Side Effects:**
- Update user role từ STUDENT → TUTOR
- Create TutorProfile record
- Send email notification

---

### 8. POST /admin/tutor-registrations/{id}/reject
**Mục đích:** Admin từ chối đơn đăng ký  
**Used by:** Admin Panel  
**Importance:** MEDIUM

**Request:**
```
POST /admin/tutor-registrations/{id}/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "reason": "GPA chưa đạt yêu cầu tối thiểu"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Rejected successfully"
}
```

**Side Effects:**
- Update registration status = REJECTED
- Send email notification với lý do

---

### 9. GET /admin/statistics
**Mục đích:** Thống kê tổng quan hệ thống  
**Used by:** AdminDashboard.tsx  
**Importance:** MEDIUM

**Request:**
```
GET /admin/statistics
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "totalUsers": 150,
    "totalStudents": 120,
    "totalTutors": 25,
    "totalAdmins": 5,
    "totalSessions": 300,
    "activeSessions": 50,
    "completedSessions": 200,
    "cancelledSessions": 10,
    "pendingRegistrations": 30,
    "approvedRegistrations": 250,
    "rejectedRegistrations": 20,
    "pendingTutorApplications": 5
  }
}
```

---

## 🟡 MEDIUM PRIORITY (Có thể đợi)

### 10. GET /materials
**Mục đích:** Lấy danh sách tài liệu  
**Used by:** Materials.tsx  
**Importance:** MEDIUM

**Request:**
```
GET /materials?subjectId={id}&type={type}
Authorization: Bearer {token}
```

**Query Parameters:**
- `subjectId` (optional): filter by subject
- `type` (optional): PDF, VIDEO, DOC, PPT

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "title": "Bài giảng Giải tích 1",
      "description": "Chương 1: Giới hạn",
      "subjectId": 1,
      "subjectName": "Giải tích 1",
      "tutorId": 5,
      "tutorName": "Nguyễn Văn A",
      "type": "PDF",
      "fileUrl": "https://...",
      "fileSize": 2048576,
      "downloadCount": 100,
      "uploadedDate": "2025-11-01T00:00:00Z",
      "status": "APPROVED"
    }
  ]
}
```

---

### 11. POST /materials/upload
**Mục đích:** Tutor upload tài liệu  
**Used by:** Materials.tsx  
**Importance:** MEDIUM

**Request:**
```
POST /materials/upload
Authorization: Bearer {tutor_token}
Content-Type: multipart/form-data

{
  "file": <binary>,
  "title": "Bài giảng...",
  "description": "Mô tả...",
  "subjectId": 1,
  "type": "PDF"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Uploaded successfully",
  "data": {
    "id": 123,
    "fileUrl": "https://...",
    "status": "PENDING"
  }
}
```

---

### 12. DELETE /materials/{id}
**Mục đích:** Xóa tài liệu  
**Used by:** Materials.tsx  
**Importance:** LOW

**Request:**
```
DELETE /materials/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Deleted successfully"
}
```

---

### 13. POST /admin/materials/{id}/approve
**Mục đích:** Admin duyệt tài liệu  
**Used by:** Admin Materials Management  
**Importance:** LOW

**Request:**
```
POST /admin/materials/{id}/approve
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Approved successfully"
}
```

---

### 14. GET /admin/courses
**Mục đích:** Admin quản lý courses  
**Used by:** AdminCourses.tsx  
**Importance:** MEDIUM

**Request:**
```
GET /admin/courses?page={page}&size={size}
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "content": [...],
    "totalElements": 50,
    "totalPages": 3
  }
}
```

---

## 🟢 LOW PRIORITY (Có thể bỏ qua)

### 15. DELETE /students/cancel-registration/{registrationId}
**Mục đích:** Student hủy đăng ký khóa học  
**Used by:** Course.tsx  
**Importance:** LOW

**Request:**
```
DELETE /students/cancel-registration/{registrationId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Cancelled successfully"
}
```

---

### 16. GET /students/{studentId}/registration-status/{sessionId}
**Mục đích:** Kiểm tra trạng thái đăng ký cụ thể  
**Used by:** Course.tsx  
**Importance:** LOW

---

### 17. GET /tutor-registrations/{studentId}/status
**Mục đích:** Student kiểm tra trạng thái đơn đăng ký GS  
**Used by:** Trang "Trạng thái đơn đăng ký" (chưa có)  
**Importance:** LOW

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "registrationId": 123,
    "status": "PENDING",
    "submittedDate": "2025-11-25T10:00:00Z",
    "reviewedDate": null,
    "rejectionReason": null
  }
}
```

---

## 📊 TỔNG KẾT

### Phân loại theo Priority
```
🚨 CRITICAL:  4 endpoints (Tutor dashboard & management)
🔶 HIGH:      5 endpoints (Admin management)
🟡 MEDIUM:    5 endpoints (Materials, courses)
🟢 LOW:       3 endpoints (Cancel, status check)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TỔNG:      17 endpoints mới cần implement
```

### Phân loại theo Module
```
Tutor Management:        4 endpoints
Admin Management:        5 endpoints
Materials:               4 endpoints
Student Additional:      3 endpoints
Statistics:              1 endpoint
```

---

## ✅ ENDPOINTS ĐÃ CÓ (Tham khảo)

Frontend đang dùng các endpoints sau (OK):
- ✅ POST /auth/login
- ✅ GET /subjects
- ✅ GET /departments
- ✅ GET /majors
- ✅ GET /tutors
- ✅ GET /students/available-sessions
- ✅ POST /students/register-session
- ✅ GET /students/history/{userId}
- ✅ GET /sessions
- ✅ POST /sessions
- ✅ PUT /sessions/{id}
- ✅ DELETE /sessions/{id}
- ✅ POST /tutors/approveStudentSession
- ✅ POST /tutors/rejectStudentSession
- ✅ PUT /admin/tutors/{userId}
- ✅ PUT /admin/students/{userId}
- ✅ POST /api/tutor-profiles

**Tổng đã có:** 17 endpoints

---

## 🎯 RECOMMENDATIONS

### Implement theo thứ tự:
1. **Week 1:** Tutor management APIs (4 critical endpoints)
2. **Week 2:** Admin management APIs (5 high endpoints)
3. **Week 3:** Materials APIs (4 medium endpoints)
4. **Week 4:** Additional features (3 low endpoints)

### Notes:
- Tất cả endpoints cần support JWT authentication
- Response format nên consistent (BaseResponse<T>)
- Error handling cần rõ ràng (status codes, messages)
- Pagination cho list endpoints
- Filter/Search cho các GET list endpoints

---

**Last Updated:** 25/11/2025  
**Contact:** Frontend Team
