package com.attendance.employee.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeDtos {

    @Data
    public static class EmployeeRequest {
        @NotBlank
        private String firstName;
        
        @NotBlank
        private String lastName;
        
        @Email
        @NotBlank
        private String email;
        
        private String phone;
        private String address;
        private String department;
        private String position;
        
        @NotNull
        private LocalDate joinDate;
        
        @NotNull
        @Positive
        private java.math.BigDecimal salary;
        
        @NotNull
        private Long userId;

        public String getEmail() { return email; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public String getPhone() { return phone; }
        public String getAddress() { return address; }
        public String getDepartment() { return department; }
        public String getPosition() { return position; }
        public LocalDate getJoinDate() { return joinDate; }
        public java.math.BigDecimal getSalary() { return salary; }
        public Long getUserId() { return userId; }
        
        public void setEmail(String email) { this.email = email; }
        public void setUserId(Long userId) { this.userId = userId; }
    }

    @Data
    public static class EmployeeResponse {
        private Long id;
        private String employeeId;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String address;
        private String department;
        private String position;
        private LocalDate joinDate;
        private java.math.BigDecimal salary;
        private LocalDateTime createdAt;
    }
}
