package com.attendance.leave.dto;

import com.attendance.leave.entity.LeaveStatus;
import com.attendance.leave.entity.LeaveType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveDtos {

    @Data
    public static class CreateLeaveRequest {
        @NotNull
        private Long employeeId;
        @NotNull
        private LeaveType type;
        @NotNull
        private LocalDate startDate;
        @NotNull
        private LocalDate endDate;
        private String reason;
    }

    @Data
    public static class LeaveRequestResponse {
        private Long id;
        private Long employeeId;
        private LeaveType type;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
        private LeaveStatus status;
        private LocalDateTime createdAt;
    }

    @Data
    public static class UpdateLeaveStatusRequest {
        @NotNull
        private LeaveStatus status;
    }
}
