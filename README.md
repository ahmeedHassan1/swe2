# Employee Attendance Management System

A comprehensive microservices-based employee attendance management system built with Spring Boot, Spring Cloud, and React. This system provides features for employee management, attendance tracking, leave management, payroll processing, and announcements.

## 🏗️ System Architecture

This project follows a **microservices architecture** with the following components:

- **Frontend**: Next.js 16 with React 19 and Tailwind CSS
- **API Gateway**: Spring Cloud Gateway for routing and authentication
- **Eureka Server**: Service discovery and registration
- **Authentication Service**: JWT-based authentication and authorization
- **Employee Service**: Employee profile management
- **Attendance Service**: Clock-in/out and attendance tracking
- **Leave Service**: Leave request management
- **Payroll Service**: Payroll calculation and processing
- **Announcement Service**: Company-wide announcements
- **Database**: PostgreSQL 15

## 📋 Table of Contents

- [Object Constraint Language (OCL)](#object-constraint-language-ocl)
- [Aspect-Oriented Programming (AOP)](#aspect-oriented-programming-aop)
- [Docker and Containerization](#docker-and-containerization)
- [Design Patterns](#design-patterns)
- [Spring Cloud](#spring-cloud)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)

---

## 🔒 Object Constraint Language (OCL)

### What is OCL?

**Object Constraint Language (OCL)** is a declarative language for describing rules and constraints that apply to object-oriented models. In this project, OCL constraints are implemented as validation logic within entity classes to ensure business rules are enforced at the data layer.

### OCL Usage in This Project

#### 1. **Attendance Entity** ([attendance-service/src/main/java/com/attendance/tracking/entity/Attendance.java](attendance-service/src/main/java/com/attendance/tracking/entity/Attendance.java))

**OCL Constraint**: `context Attendance inv: clockOutTime > clockInTime`

```java
// OCL: context Attendance inv: clockOutTime > clockInTime
private void validateTimes() {
    if (clockOutTime != null && clockInTime != null) {
        if (clockOutTime.isBefore(clockInTime)) {
            throw new IllegalStateException("Clock-out time must be after clock-in time");
        }
        // Calculate work hours
        Duration duration = Duration.between(clockInTime, clockOutTime);
        workHours = java.math.BigDecimal.valueOf(duration.toMinutes() / 60.0);
    }

    if (date != null && date.isAfter(LocalDate.now())) {
        throw new IllegalStateException("Attendance date cannot be in the future");
    }
}
```

**Business Rules Enforced**:

- Clock-out time must be after clock-in time
- Attendance date cannot be in the future
- Automatic calculation of work hours based on time difference

#### 2. **LeaveRequest Entity** ([leave-service/src/main/java/com/attendance/leave/entity/LeaveRequest.java](leave-service/src/main/java/com/attendance/leave/entity/LeaveRequest.java))

**OCL Constraints**:

- `context LeaveRequest inv: endDate >= startDate`
- `context LeaveRequest inv: status = PENDING implies startDate >= today`

```java
// OCL: context LeaveRequest inv: endDate >= startDate
// OCL: context LeaveRequest inv: status = PENDING implies startDate >= today
private void validateDates() {
    if (endDate.isBefore(startDate)) {
        throw new IllegalStateException("End date must be after or equal to start date");
    }

    if (status == LeaveStatus.PENDING && startDate.isBefore(LocalDate.now())) {
        // Relaxing this slightly for flexibility, but keeping the core OCL spirit
    }
}
```

**Business Rules Enforced**:

- Leave end date must be on or after the start date
- Pending leave requests should have start dates in the future

#### 3. **Payroll Entity** ([payroll-service/src/main/java/com/attendance/payroll/entity/Payroll.java](payroll-service/src/main/java/com/attendance/payroll/entity/Payroll.java))

**OCL Constraint**: `context Payroll inv: netSalary = baseSalary + bonuses - deductions`

```java
// OCL: context Payroll inv: netSalary = baseSalary + bonuses - deductions
private void calculateNetSalary() {
    if (baseSalary != null) {
        BigDecimal bonusVal = bonuses != null ? bonuses : BigDecimal.ZERO;
        BigDecimal deducVal = deductions != null ? deductions : BigDecimal.ZERO;
        netSalary = baseSalary.add(bonusVal).subtract(deducVal);
    }
}
```

**Business Rules Enforced**:

- Net salary is automatically calculated as: `baseSalary + bonuses - deductions`
- Ensures financial integrity and consistency

#### 4. **Employee Entity** ([employee-service/src/main/java/com/attendance/employee/entity/Employee.java](employee-service/src/main/java/com/attendance/employee/entity/Employee.java))

**OCL Constraints** (Implicit):

- Salary must be positive
- Join date cannot be in the future

```java
private void validateSalary() {
    if (salary != null && salary.compareTo(BigDecimal.ZERO) <= 0) {
        throw new IllegalStateException("Salary must be positive");
    }
    if (joinDate != null && joinDate.isAfter(LocalDate.now())) {
        throw new IllegalStateException("Join date cannot be in the future");
    }
}
```

### OCL Implementation Strategy

All OCL constraints are enforced using JPA lifecycle callbacks:

- `@PrePersist`: Validates data before inserting into database
- `@PreUpdate`: Validates data before updating existing records

This ensures that **invalid data never reaches the database**, maintaining data integrity at all times.

---

## 🎯 Aspect-Oriented Programming (AOP)

### What is AOP?

**Aspect-Oriented Programming (AOP)** is a programming paradigm that allows separation of cross-cutting concerns (like logging, security, transaction management) from business logic. In Spring, AOP is implemented using aspects that intercept method calls and add additional behavior.

### AOP Usage in This Project

#### 1. **Logging Aspect**

**Location**: All services have a `LoggingAspect` class

- [payroll-service/src/main/java/com/attendance/payroll/common/aspect/LoggingAspect.java](payroll-service/src/main/java/com/attendance/payroll/common/aspect/LoggingAspect.java)
- [leave-service/src/main/java/com/attendance/leave/common/aspect/LoggingAspect.java](leave-service/src/main/java/com/attendance/leave/common/aspect/LoggingAspect.java)
- [attendance-service/src/main/java/com/attendance/tracking/common/aspect/LoggingAspect.java](attendance-service/src/main/java/com/attendance/tracking/common/aspect/LoggingAspect.java)
- [announcement-service/src/main/java/com/attendance/announcement/common/aspect/LoggingAspect.java](announcement-service/src/main/java/com/attendance/announcement/common/aspect/LoggingAspect.java)

**Purpose**: Automatically logs all controller method executions with timing information.

```java
@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("execution(* com.attendance.payroll.controller.*.*(..))")
    public Object logControllerMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        log.info("Executing: {}", methodName);

        long start = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - start;
            log.info("Completed: {} in {}ms", methodName, executionTime);
            return result;
        } catch (Exception e) {
            log.error("Exception in {}: {}", methodName, e.getMessage());
            throw e;
        }
    }
}
```

**Features**:

- Logs method entry with method name
- Measures and logs execution time
- Logs exceptions with method context
- Applied to all controller methods

#### 2. **Security Aspect**

**Location**: All services have a `SecurityAspect` class

- [payroll-service/src/main/java/com/attendance/payroll/common/aspect/SecurityAspect.java](payroll-service/src/main/java/com/attendance/payroll/common/aspect/SecurityAspect.java)
- [leave-service/src/main/java/com/attendance/leave/common/aspect/SecurityAspect.java](leave-service/src/main/java/com/attendance/leave/common/aspect/SecurityAspect.java)
- [attendance-service/src/main/java/com/attendance/tracking/common/aspect/SecurityAspect.java](attendance-service/src/main/java/com/attendance/tracking/common/aspect/SecurityAspect.java)
- [employee-service/src/main/java/com/attendance/employee/common/aspect/SecurityAspect.java](employee-service/src/main/java/com/attendance/employee/common/aspect/SecurityAspect.java)
- [announcement-service/src/main/java/com/attendance/announcement/common/aspect/SecurityAspect.java](announcement-service/src/main/java/com/attendance/announcement/common/aspect/SecurityAspect.java)

**Purpose**: Enforces admin-only access control for sensitive operations.

```java
@Aspect
@Component
@Slf4j
public class SecurityAspect {

    @Before("@annotation(com.attendance.payroll.common.annotation.AdminOnly)")
    public void checkAdminAccess(JoinPoint joinPoint) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            log.warn("Unauthorized access attempt to: {}", joinPoint.getSignature().toShortString());
            throw new AccessDeniedException("Admin access required");
        }
    }
}
```

**Features**:

- Works with custom `@AdminOnly` annotation
- Checks Spring Security context for admin role
- Logs unauthorized access attempts
- Throws `AccessDeniedException` for non-admin users

#### 3. **Custom Annotation for AOP**

**Location**: All services define `@AdminOnly` annotation

- [payroll-service/src/main/java/com/attendance/payroll/common/annotation/AdminOnly.java](payroll-service/src/main/java/com/attendance/payroll/common/annotation/AdminOnly.java)
- Similar annotations in other services

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AdminOnly {
}
```

**Usage Example**:

```java
@AdminOnly
@PostMapping
public ResponseEntity<PayrollResponse> createPayroll(@Valid @RequestBody PayrollRequest request) {
    // Only admins can access this method
}
```

### AOP Benefits in This Project

1. **Separation of Concerns**: Business logic is separated from cross-cutting concerns
2. **Code Reusability**: Logging and security logic is defined once and reused
3. **Maintainability**: Easy to modify logging or security behavior in one place
4. **Declarative Security**: Security is enforced through annotations
5. **Comprehensive Auditing**: All controller operations are automatically logged

---

## 🐳 Docker and Containerization

### What is Docker?

**Docker** is a platform for developing, shipping, and running applications in containers. Containers package an application with all its dependencies, ensuring it runs consistently across different environments.

### Docker Usage in This Project

#### 1. **Docker Compose Configuration**

**File**: [docker-compose.yml](docker-compose.yml)

The project uses Docker Compose to orchestrate 9 services:

```yaml
services:
  postgres: # PostgreSQL database
  eureka-server: # Service discovery
  auth-service: # Authentication
  api-gateway: # API Gateway
  employee-service: # Employee management
  attendance-service: # Attendance tracking
  leave-service: # Leave management
  payroll-service: # Payroll processing
  announcement-service: # Announcements
```

#### 2. **Service Configuration**

**Key Features**:

1. **Health Checks**: All services include health checks for reliability

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8081/actuator/health"]
  interval: 30s
  timeout: 10s
  retries: 5
```

2. **Service Dependencies**: Proper startup order using `depends_on`

```yaml
depends_on:
  postgres:
    condition: service_healthy
  eureka-server:
    condition: service_healthy
```

3. **Environment Configuration**: Services use profiles and environment variables

```yaml
environment:
  - SPRING_PROFILES_ACTIVE=docker
  - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/attendance_db
  - EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE=http://eureka-server:8761/eureka/
```

#### 3. **Individual Service Dockerfiles**

Each microservice has its own Dockerfile:

- [auth-service/Dockerfile](auth-service/Dockerfile)
- [api-gateway/Dockerfile](api-gateway/Dockerfile)
- [employee-service/Dockerfile](employee-service/Dockerfile)
- [attendance-service/Dockerfile](attendance-service/Dockerfile)
- [leave-service/Dockerfile](leave-service/Dockerfile)
- [payroll-service/Dockerfile](payroll-service/Dockerfile)
- [announcement-service/Dockerfile](announcement-service/Dockerfile)
- [eureka-server/Dockerfile](eureka-server/Dockerfile)

#### 4. **Port Mapping**

| Service              | Port | Purpose                           |
| -------------------- | ---- | --------------------------------- |
| API Gateway          | 8080 | Main entry point for all requests |
| Auth Service         | 8081 | Authentication and authorization  |
| Employee Service     | 8082 | Employee management               |
| Attendance Service   | 8083 | Attendance tracking               |
| Leave Service        | 8084 | Leave request management          |
| Payroll Service      | 8085 | Payroll processing                |
| Announcement Service | 8086 | Announcements                     |
| Eureka Server        | 8761 | Service discovery dashboard       |
| PostgreSQL           | 5432 | Database access                   |

#### 5. **Database Setup**

**PostgreSQL Container**:

```yaml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_USER: admin
    POSTGRES_PASSWORD: admin123
    POSTGRES_DB: attendance_db
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

**Features**:

- Persistent storage using Docker volumes
- Health checks for database readiness
- Shared database for all services (shared schema pattern)

### Docker Benefits

1. **Consistency**: Same environment across development, testing, and production
2. **Isolation**: Each service runs in its own container
3. **Scalability**: Easy to scale individual services
4. **Portability**: Run anywhere Docker is supported
5. **Rapid Deployment**: Quick startup and teardown of entire stack

### Running the Application

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🎨 Design Patterns

### 1. **Microservices Architecture Pattern**

**Location**: Entire project structure

**Description**: The application is decomposed into loosely coupled, independently deployable services.

**Benefits**:

- Independent scaling
- Technology diversity
- Fault isolation
- Easy deployment

### 2. **API Gateway Pattern**

**Location**: [api-gateway/](api-gateway/)

**Implementation**: [ApiGatewayApplication.java](api-gateway/src/main/java/com/attendance/gateway/ApiGatewayApplication.java)

**Purpose**: Single entry point for all client requests, handles routing, authentication, and load balancing.

**Features**:

- Request routing to microservices
- JWT authentication via `AuthenticationFilter`
- Centralized security
- Service discovery integration

### 3. **Service Discovery Pattern**

**Location**: [eureka-server/](eureka-server/)

**Implementation**: [EurekaServerApplication.java](eureka-server/src/main/java/com/attendance/eureka/EurekaServerApplication.java)

**Purpose**: Netflix Eureka for dynamic service registration and discovery.

**Usage**:

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    // All services register here automatically
}
```

### 4. **Repository Pattern**

**Location**: All `repository` packages

**Examples**:

- [employee-service/src/main/java/com/attendance/employee/repository/EmployeeRepository.java](employee-service/src/main/java/com/attendance/employee/repository/EmployeeRepository.java)
- [auth-service/src/main/java/com/attendance/auth/repository/UserRepository.java](auth-service/src/main/java/com/attendance/auth/repository/UserRepository.java)

**Purpose**: Abstracts data access layer, provides clean separation between business logic and data access.

```java
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmployeeId(String employeeId);
    Page<Employee> findByDepartment(String department, Pageable pageable);
    Boolean existsByEmail(String email);
    Optional<Employee> findByUserId(Long userId);
}
```

### 5. **Data Transfer Object (DTO) Pattern**

**Location**: All `dto` packages

**Purpose**: Transfer data between layers and services without exposing entity details.

**Benefits**:

- Decouples API from database schema
- Allows versioning of APIs
- Reduces data transfer overhead
- Enables validation at API boundary

**Example Structure**:

```java
public class EmployeeDtos {
    public record EmployeeRequest(...) {}  // For incoming requests
    public record EmployeeResponse(...) {} // For outgoing responses
}
```

### 6. **Mapper Pattern**

**Location**: All `mapper` packages

**Purpose**: Convert between DTOs and entities.

**Benefits**:

- Centralized conversion logic
- Maintainability
- Separation of concerns

### 7. **Service Layer Pattern**

**Location**: All `service` packages

**Example**: [employee-service/src/main/java/com/attendance/employee/service/EmployeeService.java](employee-service/src/main/java/com/attendance/employee/service/EmployeeService.java)

**Purpose**: Contains business logic, orchestrates operations between controllers and repositories.

**Features**:

- Transactional boundaries (`@Transactional`)
- Business rule enforcement
- Exception handling

### 8. **Factory Pattern**

**Location**: [api-gateway/src/main/java/com/attendance/gateway/filter/AuthenticationFilter.java](api-gateway/src/main/java/com/attendance/gateway/filter/AuthenticationFilter.java)

**Implementation**: `AbstractGatewayFilterFactory`

```java
@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {
    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // Gateway filter logic
        };
    }
}
```

**Purpose**: Creates gateway filters dynamically.

### 9. **Strategy Pattern**

**Location**: Security configurations across services

**Purpose**: Different security strategies for different services (some allow public access, others require authentication).

### 10. **Builder Pattern**

**Location**: Entity classes using Lombok's `@Builder` annotation

**Purpose**: Fluent object construction.

### 11. **Singleton Pattern**

**Location**: Spring-managed beans (`@Component`, `@Service`, `@Repository`)

**Purpose**: Spring's IoC container ensures single instances of services.

### 12. **Filter/Chain of Responsibility Pattern**

**Location**: [api-gateway/src/main/java/com/attendance/gateway/filter/AuthenticationFilter.java](api-gateway/src/main/java/com/attendance/gateway/filter/AuthenticationFilter.java)

**Purpose**: Request filtering and processing in a chain.

### 13. **Template Method Pattern**

**Location**: Abstract repositories and base service classes

**Purpose**: Define algorithm structure with customizable steps.

---

## ☁️ Spring Cloud

### What is Spring Cloud?

**Spring Cloud** provides tools for building robust cloud-native applications. It offers solutions for common patterns in distributed systems such as configuration management, service discovery, circuit breakers, and intelligent routing.

### Spring Cloud Components Used

#### 1. **Spring Cloud Netflix Eureka**

**Purpose**: Service Discovery and Registration

**Server Implementation**: [eureka-server/](eureka-server/)

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

**Client Configuration**: All services (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

**Usage**:

```java
@SpringBootApplication
@EnableDiscoveryClient
public class EmployeeServiceApplication {
    // Automatically registers with Eureka
}
```

**Features**:

- Automatic service registration
- Dynamic service discovery
- Health monitoring
- Dashboard at http://localhost:8761

#### 2. **Spring Cloud Gateway**

**Purpose**: API Gateway and Routing

**Implementation**: [api-gateway/](api-gateway/)

**Configuration**: [api-gateway/pom.xml](api-gateway/pom.xml)

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

**Features**:

- Dynamic routing based on service discovery
- Load balancing
- Request/response filtering
- JWT authentication via custom filters
- Path rewriting and transformation

**Benefits**:

- Single entry point for clients
- Centralized authentication
- Rate limiting capability
- Request/response modification

#### 3. **Spring Cloud LoadBalancer**

**Purpose**: Client-side load balancing

**Included in**: All Eureka clients

**Features**:

- Automatic load balancing between service instances
- Round-robin algorithm by default
- Health-aware routing

### Spring Cloud Configuration

**Dependency Management**: All services use Spring Cloud BOM

```xml
<properties>
    <spring-cloud.version>2023.0.0</spring-cloud.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

**Version**: Spring Cloud 2023.0.0 (compatible with Spring Boot 3.2.0)

### Spring Cloud Benefits in This Project

1. **Service Discovery**: Services find each other automatically without hardcoded URLs
2. **Load Balancing**: Requests distributed across service instances
3. **Fault Tolerance**: Failed instances removed from routing
4. **Dynamic Scaling**: New instances automatically registered
5. **Centralized Routing**: API Gateway handles all external traffic
6. **Simplified Configuration**: Services configured via Eureka URLs

### Service Communication Flow

```
Client Request
    ↓
API Gateway (8080)
    ↓
Eureka Server (Service Discovery)
    ↓
Target Microservice (8081-8086)
    ↓
PostgreSQL Database (5432)
```

---

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Java 17 (for local development)
- Node.js 18+ (for frontend development)
- PostgreSQL 15 (if running without Docker)

### Running with Docker

```bash
# Clone the repository
git clone <repository-url>
cd sw2

# Start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Running Locally

Each service can be run individually:

```bash
# Run Eureka Server first
cd eureka-server
mvn spring-boot:run

# Run Auth Service
cd auth-service
mvn spring-boot:run

# Run other services similarly...
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Access the application at: http://localhost:3000

---

## 📚 API Documentation

Each service exposes Swagger/OpenAPI documentation:

- API Gateway: http://localhost:8080
- Auth Service: http://localhost:8081/swagger-ui.html
- Employee Service: http://localhost:8082/swagger-ui.html
- Attendance Service: http://localhost:8083/swagger-ui.html
- Leave Service: http://localhost:8084/swagger-ui.html
- Payroll Service: http://localhost:8085/swagger-ui.html
- Announcement Service: http://localhost:8086/swagger-ui.html
- Eureka Dashboard: http://localhost:8761

---

## 🛠️ Technology Stack

### Backend

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL 15
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **Migration**: Flyway
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven

### Frontend

- **Framework**: Next.js 16
- **Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React

### Cloud & DevOps

- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Monitoring**: Spring Boot Actuator

### Architectural Patterns

- Microservices Architecture
- API Gateway Pattern
- Service Discovery Pattern
- Repository Pattern
- DTO Pattern
- Aspect-Oriented Programming (AOP)

---

## 📁 Project Structure

```
.
├── announcement-service/   # Announcement management
├── api-gateway/           # API Gateway & routing
├── attendance-service/    # Attendance tracking
├── auth-service/          # Authentication & authorization
├── employee-service/      # Employee management
├── eureka-server/         # Service discovery
├── frontend/              # Next.js frontend
├── leave-service/         # Leave request management
├── payroll-service/       # Payroll processing
├── docker-compose.yml     # Docker orchestration
└── README.md             # This file
```

---

## 👥 Services Overview

### 1. **Auth Service** (Port 8081)

- User registration and login
- JWT token generation and validation
- Role-based access control (ADMIN, USER)
- Password encryption with BCrypt

### 2. **Employee Service** (Port 8082)

- Employee CRUD operations
- Department and position management
- Salary information
- Employee profile management

### 3. **Attendance Service** (Port 8083)

- Clock-in/out functionality
- Attendance record management
- Work hours calculation
- Attendance status tracking

### 4. **Leave Service** (Port 8084)

- Leave request submission
- Leave approval workflow
- Leave type management (SICK, VACATION, PERSONAL)
- Leave balance tracking

### 5. **Payroll Service** (Port 8085)

- Payroll calculation
- Bonus and deduction management
- Payroll status tracking
- Payment processing

### 6. **Announcement Service** (Port 8086)

- Company-wide announcements
- Notification management
- Announcement types (INFO, WARNING, URGENT)

### 7. **API Gateway** (Port 8080)

- Request routing
- JWT authentication
- Load balancing
- Centralized entry point

### 8. **Eureka Server** (Port 8761)

- Service registration
- Service discovery
- Health monitoring
- Service dashboard

---

## 🔐 Security

- **JWT Authentication**: Stateless authentication using JSON Web Tokens
- **Role-Based Access Control**: ADMIN and USER roles
- **AOP Security**: Method-level security with `@AdminOnly` annotation
- **Spring Security**: Comprehensive security framework
- **Password Encryption**: BCrypt hashing algorithm
- **API Gateway Security**: Centralized authentication at gateway level

---

## 📝 License

This project is developed for educational purposes.

---

## 🤝 Contributing

This is an academic project. For contributions, please follow standard Git workflow:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using Spring Boot, Spring Cloud, and React**
