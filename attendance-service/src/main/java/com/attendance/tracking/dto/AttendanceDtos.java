package com.attendance.tracking.dto;

import com.attendance.tracking.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AttendanceDtos {

    @Data
    public static class ClockInRequest {
        @NotNull
        private Long employeeId;

        private String notes;
    }

    @Data
    public static class ClockOutRequest {
        @NotNull
        private Long employeeId;

        private String notes;
    }

    @Data
    public static class AttendanceResponse {
        private Long id;
        private Long employeeId;
        private LocalDateTime clockInTime;
        private LocalDateTime clockOutTime;
        private LocalDate date;
        private AttendanceStatus status;
        private java.math.BigDecimal workHours;
        private String notes;
    }
}
