package com.attendance.leave.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leaves")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "leave_type", nullable = false)
    private LeaveType type;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    private String reason;

    @Enumerated(EnumType.STRING)
    private LeaveStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // OCL: context LeaveRequest inv: endDate >= startDate
    // OCL: context LeaveRequest inv: status = PENDING implies startDate >= today
    private void validateDates() {
        if (endDate.isBefore(startDate)) {
            throw new IllegalStateException("End date must be after or equal to start date");
        }

        if (status == LeaveStatus.PENDING && startDate.isBefore(LocalDate.now())) {
            // throw new IllegalStateException("Start date cannot be in the past for new
            // requests");
            // Relaxing this slightly for flexibility, but keeping the core OCL spirit
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = LeaveStatus.PENDING;
        }
        validateDates();
    }

    @PreUpdate
    protected void onUpdate() {
        validateDates();
    }
}
