# Missing Backend Endpoints Report

## Overview
During the frontend API integration for course and schedule management features, the following endpoints are required but not currently documented in README_FE.md or may be missing from the backend implementation.

## Missing Endpoints

### 1. Course Management Endpoints

#### GET /api/courses
**Purpose**: Get all available courses for course listing page  
**Expected Response**:
```typescript
BaseResponse<CourseDTO[]>

interface CourseDTO {
  id: number;
  name: string;
  code: string;
  description?: string;
  credits: number;
  tutorName?: string;
  tutorId?: number;
  subjectId: number;
  subject?: {
    id: number;
    name: string;
  };
  schedule?: string;
  maxStudents?: number;
  currentStudents?: number;
  price?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}
```

#### POST /api/courses/register
**Purpose**: Register student for a course  
**Request Body**:
```typescript
{
  courseId: number;
  studentId: number;
}
```
**Expected Response**:
```typescript
BaseResponse<{
  success: boolean;
  message: string;
  registrationId?: number;
}>
```

### 2. Schedule Management Endpoints

#### GET /api/schedules/student/{studentId}
**Purpose**: Get student's schedule/sessions  
**Query Parameters**:
- `startDate` (optional): Start date filter (YYYY-MM-DD format)
- `endDate` (optional): End date filter (YYYY-MM-DD format)

**Expected Response**:
```typescript
BaseResponse<SessionDTO[]>

interface SessionDTO {
  id: number;
  courseId: number;
  course?: {
    id: number;
    name: string;
    code: string;
    tutorName?: string;
  };
  studentId: number;
  sessionDate: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  location?: string;
  meetingLink?: string;
  locationType: 'ONLINE' | 'OFFLINE';
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}
```

### 3. User Profile Endpoints (May need enhancement)

#### GET /api/users/profile/{userId}
**Purpose**: Get detailed user profile information  
**Current Status**: May exist but need to verify response format matches ProfileDTO

**Expected Response**:
```typescript
BaseResponse<ProfileDTO>

interface ProfileDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  studentId?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  avatar?: string;
  department?: {
    id: number;
    name: string;
  };
  major?: {
    id: number;
    name: string;
  };
  yearOfStudy?: number;
  gpa?: number;
  totalCredits?: number;
}
```

#### PUT /api/users/profile/{userId}
**Purpose**: Update user profile information  
**Request Body**: Partial ProfileDTO

## Backend Implementation Notes

### Database Considerations
1. **Course Registration Table**: May need a junction table for student-course registrations
2. **Session Table**: Need to store individual session data with course relationships
3. **User Profile**: Ensure all profile fields are properly stored

### API Response Format
All endpoints should follow the existing BaseResponse pattern:
```typescript
interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
```

### Authentication
- All endpoints except public course listing should require JWT authentication
- Student endpoints should verify student role/permissions

## Priority Implementation Order

1. **HIGH PRIORITY**:
   - GET /api/courses (for course listing)
   - GET /api/schedules/student/{studentId} (for schedule display)

2. **MEDIUM PRIORITY**:
   - POST /api/courses/register (for course registration)
   - Enhanced user profile endpoints

3. **LOW PRIORITY**:
   - Additional filtering and search capabilities
   - Pagination for large course lists

## Notes for Backend Developer

1. **Error Handling**: Ensure proper HTTP status codes and error messages
2. **Validation**: Implement proper request validation for all endpoints
3. **Pagination**: Consider implementing pagination for course listing if needed
4. **Caching**: Consider implementing caching for frequently accessed data
5. **Database Optimization**: Ensure proper indexing for course and schedule queries

## Testing Requirements

Each endpoint should be tested for:
- Happy path scenarios
- Error handling (invalid IDs, unauthorized access)
- Data validation
- Response format consistency

---

**Generated on**: $(Get-Date)  
**Frontend Integration Status**: In Progress  
**Backend Implementation Status**: Pending Review