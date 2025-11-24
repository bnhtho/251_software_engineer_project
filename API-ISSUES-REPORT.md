# 📋 BÁO CÁO TÌNH TRẠNG API - FRONTEND & BACKEND

**Ngày:** 24/11/2025  
**Dự án:** Hệ thống Quản lý Khoá học - TutorSystem  
**Backend:** Spring Boot (Java) - Port 8081  
**Frontend:** React + TypeScript + Vite

---

## 📊 TỔNG QUAN

### Thống kê API:
- ✅ **Hoạt động tốt:** 10 endpoints
- ⚠️ **Có vấn đề:** 2 endpoints  
- ❌ **Thiếu/Không tồn tại:** 8 endpoints
- 🟡 **Cần bổ sung:** 4 endpoints

---

## ❌ API THIẾU / KHÔNG TỒN TẠI

### 1. Course Management

Frontend mong đợi các endpoint quản lý "Course" (Khoá học), nhưng Backend chỉ có "Session" (Buổi học):

```http
❌ GET    /courses              # Danh sách courses
❌ POST   /courses              # Tạo course mới
❌ GET    /courses/{id}         # Chi tiết course
❌ PUT    /courses/{id}         # Cập nhật course
❌ DELETE /courses/{id}         # Xóa course
```

**Giải pháp đã áp dụng (Frontend):**
```typescript
// Mapping: Session → Course
GET /sessions                      // Admin/Tutor xem tất cả
GET /students/available-sessions   // Student xem sessions khả dụng
```

**Lý do:** 
- Backend sử dụng kiến trúc: `Subject` (Môn học) + `Session` (Buổi học đơn lẻ)
- Frontend thiết kế cho: `Course` (Khoá học) với nhiều timeslots

---

### 2. Student Course Registration

```http
❌ POST /courses/{id}/register        # Đăng ký khoá học
❌ GET  /students/{id}/courses        # Xem courses đã đăng ký
```

**Giải pháp đã áp dụng:**
```http
✅ POST /students/register-session?sessionId={id}
✅ GET  /students/history/{userId}
```

---

### 3. Cancel Registration

```http
❌ DELETE /students/registrations/{id}      # Hủy đăng ký
❌ PUT    /students/registrations/{id}/cancel
```

**Tình trạng Frontend:**
```typescript
// courseApi.cancelRegistration() - Đã implement
// Hiện throw error: "Cancel registration not supported yet"
```

**⚠️ CẦN THÊM VÀO BACKEND**

---

## ⚠️ API CÓ NHƯNG BỊ LỖI 403 FORBIDDEN

### 1. 🔴 URGENT: Student History Empty Bug

```http
GET /students/history/{userId}
```

**Vấn đề:**
- User đăng nhập đúng (studentId = 4, role = STUDENT)
- Token hợp lệ và match userId
- Backend vẫn trả về `403 Forbidden`

**Test case:**
```bash
# Login thành công
POST /auth/login
→ Token: eyJhbGciOiJIUzI1NiJ9...
→ Decoded: {sub: "4", role: "student"}

# Gọi API với chính userId trong token
GET /students/history/4
Authorization: Bearer {token}
→ Response: 403 Forbidden  ❌
```

**Nguyên nhân có thể:**
1. Logic ownership check sai trong Backend
2. Student chưa có history nào → Backend throw 403 thay vì return []
3. Database constraint issue

**Code cần kiểm tra (Backend):**
```java
// StudentController.java
@GetMapping("/history/{userId}")
public ResponseEntity<BaseResponse> getStudentHistory(
    @PathVariable Integer userId,
    Authentication authentication
) {
    Integer currentUserId = getCurrentUserId(authentication);
    
    // ⚠️ Check logic này
    if (!currentUserId.equals(userId)) {
        return ResponseEntity.status(403).body(...);
    }
    
    List<StudentSessionDTO> history = studentService.getHistory(userId);
    
    // ⚠️ Có thể đang throw 403 khi empty?
    if (history.isEmpty()) {
        // FIX: Nên return 200 với empty array
        return ResponseEntity.ok(
            new BaseResponse<>(200, "No history found", new ArrayList<>())
        );
    }
    
    return ResponseEntity.ok(new BaseResponse<>(200, "Success", history));
}
```

**Frontend đã xử lý:**
```typescript
// Xử lý 403 im lặng, hiển thị empty state
catch (error) {
  if (error?.response?.status === 403) {
    setSessions([]); // Show empty state instead of error
  }
}
```

---

### 2. 🔴 URGENT: Available Sessions Trả Về Rỗng

```http
GET /students/available-sessions
```

**Vấn đề:**
- Database có 3 sessions (đã verify qua `GET /sessions`)
- Endpoint trả về `[]` (empty array)
- Không có error, nhưng không có data

**Test kết quả:**
```bash
GET /sessions
→ 200 OK, data: [
    {id: 1, subjectName: "Giải tích 1", maxQuantity: 50, currentQuantity: 0},
    {id: 2, subjectName: "Vật lý 1", maxQuantity: 50, currentQuantity: 0},
    {id: 3, ...}
]

GET /students/available-sessions
→ 200 OK, data: []  ❌
```

**Nguyên nhân có thể:**
1. Filter logic quá strict (status? date? student already registered?)
2. Join query sai
3. Missing data trong related tables

**Code cần kiểm tra (Backend):**
```java
@GetMapping("/students/available-sessions")
public ResponseEntity<BaseResponse> getAvailableSessions(Authentication authentication) {
    Integer studentId = getCurrentUserId(authentication);
    
    // ⚠️ Check filter conditions
    List<SessionDTO> sessions = sessionService.getAvailableSessions(studentId);
    // - Filter theo status?
    // - Filter theo ngày hiện tại?
    // - Exclude sessions đã đăng ký?
    // - Check maxQuantity > currentQuantity?
    
    return ResponseEntity.ok(new BaseResponse<>(200, "Success", sessions));
}
```

**Frontend đã xử lý:**
```typescript
// Fallback: Nếu available-sessions rỗng → gọi /sessions
if (!sessions || sessions.length === 0) {
  sessions = await api.get("/sessions").data;
}
```

---

### 3. Admin Không Thể Edit/Delete Sessions

```http
PUT    /sessions/{id}      # Chỉ cho Tutor owner
DELETE /sessions/{id}      # Chỉ cho Tutor owner
```

**Vấn đề:**
- Backend check ownership: `currentUserId === sessionTutorId`
- Admin không thể edit/delete sessions của Tutor khác

**Code Backend:**
```java
@PutMapping("/{id}")
public ResponseEntity<BaseResponse> updateSession(
    @PathVariable Integer id,
    Authentication authentication
) {
    Integer currentUserId = getCurrentUserId(authentication);
    Integer sessionTutorId = sessionService.getTutorIdFromSession(id);
    
    // ⚠️ Admin bị chặn ở đây
    if (!currentUserId.equals(sessionTutorId)) {
        return ResponseEntity.status(403).body(...);
    }
    
    // Update logic...
}
```

**Frontend đã xử lý:**
```typescript
// Hiển thị warning banner và toast messages
toast.error("Chỉ giảng viên tạo buổi học mới có quyền chỉnh sửa");
```

**🟡 CẦN BỔ SUNG: Admin override permissions**

---

## ✅ API HOẠT ĐỘNG TỐT

### Authentication
```http
✅ POST /auth/login
   Body: {email, password}
   Response: {statusCode: 200, data: "JWT_TOKEN"}
```

### Public Endpoints
```http
✅ GET /subjects               # 36 môn học
✅ GET /departments            # 12 khoa
✅ GET /tutors                 # 2 giảng viên
✅ GET /session-statuses       # Danh sách trạng thái session
✅ GET /student-session-statuses
✅ GET /majors
```

### Sessions (Với điều kiện)
```http
✅ GET    /sessions            # Tất cả sessions (Admin/Tutor)
✅ POST   /sessions            # Tạo session (Tutor)
✅ PUT    /sessions/{id}       # Cập nhật (Tutor owner only)
✅ DELETE /sessions/{id}       # Xóa (Tutor owner only)
```

### Student Actions
```http
✅ POST /students/register-session?sessionId={id}
✅ GET  /students/profile/{userId}
✅ PUT  /students/profile/{userId}
```

### Tutor Actions
```http
✅ GET /tutors/profile/{userId}
✅ PUT /tutors/profile/{userId}
✅ GET /tutors/pending-registrations
✅ PUT /tutors/student-sessions/{id}/approve
✅ PUT /tutors/student-sessions/{id}/reject
```

---

## 🟡 API CẦN BỔ SUNG

### 1. Admin Override Permissions

**Khuyến nghị thêm:**
```http
POST   /admin/sessions              # Admin tạo session cho bất kỳ tutor
PUT    /admin/sessions/{id}         # Admin edit bất kỳ session
DELETE /admin/sessions/{id}         # Admin xóa bất kỳ session
GET    /admin/students/{id}/history # Admin xem history của student
```

**Implementation suggestion:**
```java
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @PutMapping("/sessions/{id}")
    public ResponseEntity<BaseResponse> adminUpdateSession(
        @PathVariable Integer id,
        @RequestBody SessionDTO sessionDTO
    ) {
        // No ownership check - Admin can edit any session
        Session updated = sessionService.updateSession(id, sessionDTO);
        return ResponseEntity.ok(new BaseResponse<>(200, "Updated", updated));
    }
}
```

---

### 2. Cancel Registration

```http
DELETE /students/registrations/{studentSessionId}
PUT    /students/registrations/{studentSessionId}/cancel
```

**Frontend đã sẵn sàng:**
```typescript
async cancelRegistration(registrationId: number): Promise<boolean> {
  await api.delete(`/students/registrations/${registrationId}`);
  return true;
}
```

---

### 3. Profile từ Token (Me Endpoints)

**Thay vì:**
```http
GET /students/profile/{userId}  # Phải biết userId trước
GET /tutors/profile/{userId}
```

**Nên thêm:**
```http
GET /students/profile/me        # Tự động lấy từ token
GET /tutors/profile/me
PUT /students/profile/me
PUT /tutors/profile/me
```

**Lợi ích:**
- Đơn giản hóa Frontend code
- Không cần truyền userId
- Bảo mật hơn (không thể xem profile người khác)

---

### 4. Batch Operations

```http
POST /students/register-sessions    # Đăng ký nhiều sessions cùng lúc
Body: {sessionIds: [1, 2, 3]}

DELETE /students/registrations      # Hủy nhiều registrations
Body: {registrationIds: [1, 2, 3]}
```

---

## 📊 BẢNG TỔNG HỢP CHI TIẾT

| Endpoint | Method | Status | Frontend | Backend | Priority | Note |
|----------|--------|--------|----------|---------|----------|------|
| `/courses` | GET | ❌ Không có | Cần | Không | ✅ Đã fallback `/sessions` | - |
| `/courses/{id}/register` | POST | ❌ Không có | Cần | Không | ✅ Đã dùng `/students/register-session` | - |
| `/students/history/{id}` | GET | ⚠️ 403 Bug | Cần | Có | 🔴 URGENT | **Cần fix Backend** |
| `/students/available-sessions` | GET | ⚠️ Rỗng | Cần | Có | 🔴 URGENT | **Cần kiểm tra logic** |
| `/students/registrations/{id}` | DELETE | ❌ Không có | Cần | Không | 🟡 High | Cần thêm |
| `/admin/sessions/{id}` | PUT | ❌ Không có | Muốn | Không | 🟡 Medium | Cần thêm |
| `/admin/sessions/{id}` | DELETE | ❌ Không có | Muốn | Không | 🟡 Medium | Cần thêm |
| `/students/profile/me` | GET | ❌ Không có | Muốn | Không | 🟢 Low | Enhancement |
| `/tutors/profile/me` | GET | ❌ Không có | Muốn | Không | 🟢 Low | Enhancement |
| `/students/register-sessions` | POST | ❌ Không có | Muốn | Không | 🟢 Low | Batch operation |

**Legend:**
- 🔴 URGENT: Blocking user experience
- 🟡 High/Medium: Important but có workaround
- 🟢 Low: Nice to have

---

## 🔧 CÁCH KIỂM TRA & DEBUG

### Script PowerShell đã tạo:

#### 1. Test tất cả APIs:
```powershell
cd "d:\HK251\Đồ án tổng hợp\app\251_software_engineer_project"
.\test-api.ps1
```

**Output mẫu:**
```
=== KIEM TRA BACKEND API ===

1. Kiem tra Subjects (Mon hoc)...
   [OK] Thanh cong! So mon hoc: 36

2. Kiem tra Departments (Khoa)...
   [OK] Thanh cong! So khoa: 12

3. Test Login...
   [OK] Login thanh cong!
   Token: eyJhbGciOiJIUzI1NiJ9...

4. Kiem tra Sessions (Buoi hoc)...
   [OK] Thanh cong! So buoi hoc: 3

5. Kiem tra Available Sessions (cho Student)...
   [OK] Thanh cong! So buoi hoc kha dung: 0
   [WARNING] Khong co buoi hoc nao kha dung!
```

#### 2. Debug Student History bug:
```powershell
.\test-student-history.ps1
```

**Output khi có lỗi:**
```
Login with student account...
[OK] Login successful!

Token payload:
  User ID (sub): 4
  Role: student

Trying GET /students/history/4 ...
[ERROR] Failed with status 403

[ANALYSIS] 403 Forbidden even though:
  - User is authenticated (has valid token)
  - User ID matches (4)
  - Role is STUDENT

[POSSIBLE CAUSES]:
  1. Backend has bug in ownership check logic
  2. Student record not found in database
  3. Backend requires different user ID format

[SOLUTION]:
  - Check backend StudentController.java ownership logic
  - Verify student exists in database with ID = 4
  - Frontend should show empty state instead of error
```

---

## 🎯 KHUYẾN NGHỊ HÀNH ĐỘNG

### Backend Team (Java/Spring Boot):

#### 🔴 URGENT - Cần fix ngay:

1. **Fix Student History 403 Bug**
   - File: `StudentController.java`
   - Method: `getStudentHistory()`
   - Issue: Trả 403 khi student xem history của mình
   - Fix: Return empty array thay vì 403

2. **Fix Available Sessions Logic**
   - File: `StudentController.java` hoặc `SessionService.java`
   - Method: `getAvailableSessions()`
   - Issue: Trả [] mặc dù có sessions trong DB
   - Fix: Kiểm tra filter conditions

#### 🟡 HIGH Priority - Nên thêm:

3. **Cancel Registration Endpoint**
   ```java
   @DeleteMapping("/students/registrations/{id}")
   public ResponseEntity<BaseResponse> cancelRegistration(
       @PathVariable Integer id,
       Authentication authentication
   ) {
       // Logic hủy đăng ký
   }
   ```

4. **Admin Override Permissions**
   ```java
   @PutMapping("/admin/sessions/{id}")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<BaseResponse> adminUpdateSession(...) {
       // No ownership check
   }
   ```

#### 🟢 NICE TO HAVE:

5. **Me Endpoints**
   ```java
   @GetMapping("/students/profile/me")
   public ResponseEntity<BaseResponse> getMyProfile(Authentication auth) {
       Integer userId = getCurrentUserId(auth);
       return getStudentProfile(userId);
   }
   ```

---

### Frontend Team (React/TypeScript):

#### ✅ DONE - Đã hoàn thành:

1. ✅ Xử lý fallback khi APIs thiếu
2. ✅ Error handling cho 403 Forbidden
3. ✅ Empty states đẹp với CTAs
4. ✅ Warning messages cho admin
5. ✅ Debug logs và test scripts

#### 🔄 CẦN DUY TRÌ:

6. Monitor console warnings
7. Update khi Backend fix bugs
8. Test sau mỗi Backend deployment

---

## 📝 NOTES

### Frontend Workarounds đã implement:

```typescript
// 1. Course → Session mapping
getCourses() {
  try {
    sessions = await api.get("/students/available-sessions");
    if (sessions.length === 0) {
      sessions = await api.get("/sessions"); // Fallback
    }
  } catch (403) {
    sessions = await api.get("/sessions"); // Admin fallback
  }
}

// 2. 403 Error handling
catch (error) {
  if (error.status === 403) {
    // Don't show error toast
    // Show empty state instead
    return [];
  }
}

// 3. Cancel registration
cancelRegistration() {
  throw new Error("Not supported yet");
  // Will implement when Backend ready
}
```

---

## 📞 CONTACTS

**Backend Issues:** Liên hệ Backend team để fix 2 bugs urgent  
**Frontend Questions:** Check file này hoặc xem code comments  
**API Documentation:** `251_software_engineer_project_be/README_FE.md`

---

**Last Updated:** 24/11/2025 23:37  
**Report By:** Frontend Team  
**Next Review:** After Backend fixes urgent bugs
