package com.attendance.tracking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(name = "clock_in_time", nullable = false)
    private LocalDateTime clockInTime;

    @Column(name = "clock_out_time")
    private LocalDateTime clockOutTime;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status; // PRESENT, ABSENT, LATE, HALF_DAY

    @Column(name = "work_hours")
    private java.math.BigDecimal workHours;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // OCL: context Attendance inv: clockOutTime > clockInTime
    @PrePersist
    @PreUpdate
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

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (date == null) {
            date = LocalDate.now();
        }
    }
}
