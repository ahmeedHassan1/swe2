# Software Requirements Specification (SRS)

## Employee Attendance and Management System

**Version:** 1.0  
**Date:** December 14, 2025

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete description of the Employee Attendance and Management System. This system is designed to manage employee information, track attendance, handle leave requests, process payroll, and distribute company announcements.

### 1.2 Scope

The Employee Attendance and Management System is a microservices-based web application that consists of:

- **Frontend**: Next.js-based responsive web application
- **Backend Microservices**:
  - Auth Service
  - Employee Service
  - Attendance Service
  - Leave Service
  - Payroll Service
  - Announcement Service
- **API Gateway**: Routes requests to appropriate microservices
- **Service Discovery**: Eureka Server for service registration

### 1.3 Definitions, Acronyms, and Abbreviations

- **SRS**: Software Requirements Specification
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **REST**: Representational State Transfer
- **UI**: User Interface
- **ADMIN**: Administrative user role
- **EMPLOYEE**: Standard employee user role

### 1.4 References

- Spring Boot Documentation
- Next.js Documentation
- Spring Cloud Gateway Documentation
- Netflix Eureka Documentation

---

## 2. Overall Description

### 2.1 Product Perspective

The system is a self-contained web-based application built using microservices architecture. It provides:

- Role-based access control (ADMIN and EMPLOYEE roles)
- Real-time attendance tracking
- Leave management workflow
- Automated payroll processing
- Company-wide announcement distribution

### 2.2 Product Functions

The major functions include:

#### For ADMIN Users:

1. **Employee Management**: Create, view, update, and delete employee records
2. **Attendance Monitoring**: View daily attendance across all employees
3. **Leave Approval**: Review and approve/reject leave requests
4. **Payroll Processing**: Process monthly payroll with bonuses and deductions
5. **Announcement Creation**: Create and publish company announcements

#### For EMPLOYEE Users:

1. **Attendance Tracking**: Clock in/out for daily attendance
2. **Leave Requests**: Submit and track leave requests
3. **Payroll Viewing**: View personal pay slips
4. **Announcements**: View company announcements
5. **Profile Viewing**: View personal information

### 2.3 User Classes and Characteristics

#### Administrator (ADMIN)

- **Technical Expertise**: High
- **Frequency of Use**: Daily
- **Functions**: Complete access to all system features including employee management, attendance monitoring, leave approvals, and payroll processing

#### Employee (EMPLOYEE)

- **Technical Expertise**: Low to Medium
- **Frequency of Use**: Daily
- **Functions**: Self-service features including clock in/out, leave requests, and viewing personal information

### 2.4 Operating Environment

- **Client-Side**: Modern web browsers (Chrome, Firefox, Safari, Edge)
- **Server-Side**:
  - Java 17+ runtime
  - Node.js 18+ for frontend
  - Docker containers for deployment
  - PostgreSQL/MySQL databases for each microservice

### 2.5 Design and Implementation Constraints

- JWT-based authentication across all services
- RESTful API architecture
- Microservices must be independently deployable
- Frontend must be responsive for mobile and desktop
- All services communicate through API Gateway

---

## 3. System Features

### 3.1 Authentication and Authorization

#### 3.1.1 Description

Secure user authentication using email and password with JWT token generation.

#### 3.1.2 Functional Requirements

- **FR-AUTH-1**: System shall allow users to login with email and password
- **FR-AUTH-2**: System shall generate JWT tokens upon successful authentication
- **FR-AUTH-3**: System shall validate JWT tokens for protected endpoints
- **FR-AUTH-4**: System shall support two roles: ADMIN and EMPLOYEE
- **FR-AUTH-5**: System shall allow ADMIN to register new employee accounts
- **FR-AUTH-6**: Tokens shall expire after 24 hours

### 3.2 Employee Management

#### 3.2.1 Description

Comprehensive employee information management for administrators.

#### 3.2.2 Functional Requirements

- **FR-EMP-1**: ADMIN shall create new employee records with required fields (firstName, lastName, email, phone, address, department, position, joinDate, salary, userId)
- **FR-EMP-2**: ADMIN shall view paginated list of all employees
- **FR-EMP-3**: ADMIN shall view individual employee details
- **FR-EMP-4**: ADMIN shall update employee information
- **FR-EMP-5**: ADMIN shall delete employee records
- **FR-EMP-6**: System shall auto-generate unique employeeId (format: EMP{timestamp})
- **FR-EMP-7**: System shall prevent duplicate email addresses
- **FR-EMP-8**: System shall validate that salary is positive and joinDate is not in the future
- **FR-EMP-9**: EMPLOYEE shall view their own profile using userId lookup
- **FR-EMP-10**: System shall link employee records to user accounts via userId

### 3.3 Attendance Tracking

#### 3.3.1 Description

Real-time attendance tracking with clock in/out functionality.

#### 3.3.2 Functional Requirements

- **FR-ATT-1**: EMPLOYEE shall clock in at the start of their workday
- **FR-ATT-2**: EMPLOYEE shall clock out at the end of their workday
- **FR-ATT-3**: System shall record clockInTime automatically as current timestamp
- **FR-ATT-4**: System shall record clockOutTime when employee clocks out
- **FR-ATT-5**: System shall automatically set status to LATE if clock-in is after 9:00 AM
- **FR-ATT-6**: System shall automatically set status to PRESENT if clock-in is before 9:00 AM
- **FR-ATT-7**: System shall prevent multiple clock-ins on the same date
- **FR-ATT-8**: System shall prevent clocking out without clocking in
- **FR-ATT-9**: System shall automatically calculate work hours (duration between clock-in and clock-out)
- **FR-ATT-10**: System shall validate that clockOutTime is after clockInTime
- **FR-ATT-11**: System shall validate that attendance date is not in the future
- **FR-ATT-12**: EMPLOYEE shall view their attendance history
- **FR-ATT-13**: EMPLOYEE shall check today's attendance status
- **FR-ATT-14**: ADMIN shall view daily attendance for all employees by date
- **FR-ATT-15**: System shall support attendance statuses: PRESENT, ABSENT, LATE, HALF_DAY

### 3.4 Leave Management

#### 3.4.1 Description

Complete leave request and approval workflow.

#### 3.4.2 Functional Requirements

- **FR-LEAVE-1**: EMPLOYEE shall create leave requests with type, startDate, endDate, and reason
- **FR-LEAVE-2**: System shall support leave types: SICK_LEAVE, CASUAL_LEAVE, ANNUAL_LEAVE, EMERGENCY_LEAVE, UNPAID_LEAVE
- **FR-LEAVE-3**: System shall automatically set new requests to PENDING status
- **FR-LEAVE-4**: System shall validate that endDate is not before startDate
- **FR-LEAVE-5**: System shall validate that startDate is not in the past for new requests
- **FR-LEAVE-6**: EMPLOYEE shall view all their leave requests
- **FR-LEAVE-7**: ADMIN shall view all leave requests from all employees
- **FR-LEAVE-8**: ADMIN shall filter leave requests by status (PENDING, APPROVED, REJECTED)
- **FR-LEAVE-9**: ADMIN shall approve leave requests
- **FR-LEAVE-10**: ADMIN shall reject leave requests
- **FR-LEAVE-11**: EMPLOYEE shall see leave request status updates

### 3.5 Payroll Management

#### 3.5.1 Description

Automated payroll processing with bonuses and deductions.

#### 3.5.2 Functional Requirements

- **FR-PAY-1**: ADMIN shall process payroll for employees by month and year
- **FR-PAY-2**: System shall use employee base salary from employee record
- **FR-PAY-3**: ADMIN shall specify bonuses for each employee
- **FR-PAY-4**: ADMIN shall specify deductions for each employee
- **FR-PAY-5**: System shall automatically calculate netSalary = baseSalary + bonuses - deductions
- **FR-PAY-6**: System shall prevent duplicate payroll processing for same employee and period
- **FR-PAY-7**: System shall create payroll records with PENDING status
- **FR-PAY-8**: ADMIN shall mark payroll as PAID
- **FR-PAY-9**: System shall record paymentDate when marked as PAID
- **FR-PAY-10**: ADMIN shall view payroll for specific month/year period
- **FR-PAY-11**: EMPLOYEE shall view their own pay slips
- **FR-PAY-12**: Frontend shall support tax deduction toggle (10% of base salary)
- **FR-PAY-13**: System shall validate that payroll status transitions are valid

### 3.6 Announcement System

#### 3.6.1 Description

Company-wide announcement distribution system.

#### 3.6.2 Functional Requirements

- **FR-ANN-1**: ADMIN shall create announcements with title, content, and priority
- **FR-ANN-2**: System shall support priority levels: NORMAL, HIGH, URGENT
- **FR-ANN-3**: System shall automatically record createdBy as current admin's userId
- **FR-ANN-4**: System shall automatically timestamp announcements
- **FR-ANN-5**: All users (ADMIN and EMPLOYEE) shall view announcements
- **FR-ANN-6**: System shall display announcements ordered by creation date (newest first)
- **FR-ANN-7**: Frontend shall display priority-based visual indicators (color coding)

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 Login Page

- Email and password input fields
- Sign-in button
- Error message display
- Responsive design with decorative background

#### 4.1.2 Dashboard (ADMIN)

- Statistics cards showing:
  - Total employees count
  - Pending leaves count
- Navigation to all modules
- User information display

#### 4.1.3 Dashboard (EMPLOYEE)

- Statistics cards showing:
  - Hours worked this week
  - Used leaves count
- Navigation to available modules
- User information display

#### 4.1.4 Employee Management (ADMIN only)

- Employee list table with columns: ID, Name, Email, Department, Position
- "Add Employee" button
- Pagination support
- Add/Edit employee form with all required fields

#### 4.1.5 Attendance Page (ADMIN)

- Date selector for daily attendance view
- Table showing: Employee ID, Clock In, Clock Out, Status
- Real-time data updates

#### 4.1.6 Attendance Page (EMPLOYEE)

- Clock In/Clock Out button (context-aware)
- Attendance history table: Date, In, Out, Hours, Status
- Today's status indicator

#### 4.1.7 Leave Management (ADMIN)

- Leave requests table: Employee, Type, Reason, Dates, Status
- Approve/Reject action buttons for PENDING requests
- Status filter options

#### 4.1.8 Leave Management (EMPLOYEE)

- Personal leave history table
- "New Request" button
- Leave request form: Type dropdown, Start Date, End Date, Reason

#### 4.1.9 Payroll (ADMIN)

- Month/Year selector
- Process Payroll dialog with:
  - Employee list with salary details
  - Bonuses and deductions input fields
  - Tax deduction toggle (10%)
  - Net salary calculation
- Payroll records table
- "Mark as Paid" action button

#### 4.1.10 Payroll (EMPLOYEE)

- Pay slips table: Period, Base, Bonus, Deductions, Net, Status, Payment Date

#### 4.1.11 Announcements (ADMIN)

- Create announcement form
- Announcements list with priority indicators
- Color-coded priority display

#### 4.1.12 Announcements (EMPLOYEE)

- Read-only announcements list
- Priority-based visual styling

### 4.2 Hardware Interfaces

Not applicable - web-based application.

### 4.3 Software Interfaces

#### 4.3.1 Database Interfaces

Each microservice connects to its own database:

- **Auth Service**: users table
- **Employee Service**: employees table
- **Attendance Service**: attendance table
- **Leave Service**: leaves table
- **Payroll Service**: payroll table
- **Announcement Service**: announcements, users tables

#### 4.3.2 API Gateway

- **Port**: 8080
- **Protocol**: HTTP/HTTPS
- **Routes**:
  - `/api/auth/**` → Auth Service (8081)
  - `/api/employees/**` → Employee Service (8082)
  - `/api/attendance/**` → Attendance Service (8083)
  - `/api/leaves/**` → Leave Service (8084)
  - `/api/payroll/**` → Payroll Service (8085)
  - `/api/announcements/**` → Announcement Service (8086)

#### 4.3.3 Service Discovery

- **Eureka Server**: Port 8761
- All microservices register with Eureka on startup

### 4.4 Communications Interfaces

- **Protocol**: HTTPS
- **Data Format**: JSON
- **Authentication**: JWT Bearer tokens in Authorization header
- **Token Format**: `Bearer {token}`

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

- **NFR-PERF-1**: System shall respond to user requests within 2 seconds under normal load
- **NFR-PERF-2**: System shall support at least 100 concurrent users
- **NFR-PERF-3**: Database queries shall be optimized with proper indexing

### 5.2 Security Requirements

- **NFR-SEC-1**: All passwords shall be encrypted using BCrypt
- **NFR-SEC-2**: JWT tokens shall be used for authentication
- **NFR-SEC-3**: Token expiration shall be enforced (24 hours)
- **NFR-SEC-4**: ADMIN-only endpoints shall reject EMPLOYEE access
- **NFR-SEC-5**: All API calls (except auth endpoints) shall require valid JWT
- **NFR-SEC-6**: HTTPS shall be used for all communications in production

### 5.3 Software Quality Attributes

#### 5.3.1 Availability

- **NFR-AVAIL-1**: System shall be available 99% of the time during business hours

#### 5.3.2 Maintainability

- **NFR-MAINT-1**: Each microservice shall be independently deployable
- **NFR-MAINT-2**: Code shall follow clean code principles
- **NFR-MAINT-3**: Services shall be loosely coupled

#### 5.3.3 Usability

- **NFR-USE-1**: UI shall be responsive for mobile and desktop
- **NFR-USE-2**: Error messages shall be user-friendly
- **NFR-USE-3**: Loading states shall be indicated to users

#### 5.3.4 Scalability

- **NFR-SCALE-1**: Each microservice can be scaled independently
- **NFR-SCALE-2**: System shall use stateless architecture for horizontal scaling

#### 5.3.5 Reliability

- **NFR-REL-1**: System shall validate all user inputs
- **NFR-REL-2**: Database constraints shall prevent data inconsistency
- **NFR-REL-3**: Business rule validations shall be enforced at entity level

---

## 6. Other Requirements

### 6.1 Database Requirements

- **DR-1**: Each microservice shall have its own database (database per service pattern)
- **DR-2**: Foreign key relationships shall be managed logically (userId links users to employees)
- **DR-3**: Timestamps (createdAt, updatedAt) shall be automatically managed

### 6.2 Legal Requirements

- **LR-1**: System shall comply with data protection regulations
- **LR-2**: Employee personal information shall be protected

---

## Appendix A: Technology Stack

### Backend

- **Language**: Java 17
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security, JWT
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Database**: PostgreSQL/MySQL
- **ORM**: Spring Data JPA
- **Validation**: Jakarta Validation
- **Mapping**: MapStruct
- **Build Tool**: Maven

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (React)
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Fetch API

### DevOps

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Version Control**: Git

---

## Appendix B: API Endpoints Summary

### Auth Service (Port 8081)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/validate` - Validate token
- `POST /api/auth/admin/register` - Admin registration

### Employee Service (Port 8082)

- `POST /api/employees` - Create employee (ADMIN)
- `GET /api/employees` - Get all employees (ADMIN, paginated)
- `GET /api/employees/{id}` - Get employee by ID
- `GET /api/employees/by-user/{userId}` - Get employee by userId
- `PUT /api/employees/{id}` - Update employee (ADMIN)
- `DELETE /api/employees/{id}` - Delete employee (ADMIN)

### Attendance Service (Port 8083)

- `POST /api/attendance/clock-in` - Clock in
- `POST /api/attendance/clock-out` - Clock out
- `GET /api/attendance/daily?date={date}` - Get daily attendance (ADMIN)
- `GET /api/attendance/employee/{employeeId}` - Get employee attendance
- `GET /api/attendance/today?employeeId={id}` - Get today's status

### Leave Service (Port 8084)

- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/{id}/status` - Update leave status (ADMIN)
- `GET /api/leaves/employee/{employeeId}` - Get employee leaves
- `GET /api/leaves` - Get all leaves (ADMIN)
- `GET /api/leaves/status/{status}` - Get leaves by status (ADMIN)

### Payroll Service (Port 8085)

- `POST /api/payroll` - Process payroll (ADMIN)
- `PUT /api/payroll/{id}/pay` - Mark as paid (ADMIN)
- `GET /api/payroll/employee/{employeeId}` - Get employee payroll
- `GET /api/payroll/period?month={m}&year={y}` - Get payroll by period (ADMIN)

### Announcement Service (Port 8086)

- `POST /api/announcements` - Create announcement (ADMIN)
- `GET /api/announcements` - Get all announcements

---

_End of Software Requirements Specification_
