package com.attendance.employee.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", unique = true, nullable = false)
    private Long userId;
    
    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    @Email
    private String email;
    
    private String phone;
    
    private String address;
    
    private String department;
    
    private String position;
    
    @Column(name = "join_date")
    private LocalDate joinDate;
    
    @Column(nullable = false)
    private BigDecimal salary;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    private void validateSalary() {
        if (salary != null && salary.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("Salary must be positive");
        }
        if (joinDate != null && joinDate.isAfter(LocalDate.now())) {
            throw new IllegalStateException("Join date cannot be in the future");
        }
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (employeeId == null) {
            employeeId = "EMP" + System.currentTimeMillis();
        }
        validateSalary();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        validateSalary();
    }
}
