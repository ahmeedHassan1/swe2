package com.attendance.payroll.dto;

import com.attendance.payroll.entity.PayrollStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PayrollDtos {

    @Data
    public static class ProcessPayrollRequest {
        @NotNull
        private Long employeeId;
        @NotNull
        private Integer month;
        @NotNull
        private Integer year;
        @NotNull
        private BigDecimal baseSalary;
        private BigDecimal bonuses;
        private BigDecimal deductions;
    }

    @Data
    public static class PayrollResponse {
        private Long id;
        private Long employeeId;
        private Integer month;
        private Integer year;
        private BigDecimal baseSalary;
        private BigDecimal bonuses;
        private BigDecimal deductions;
        private BigDecimal netSalary;
        private PayrollStatus status;
        private LocalDateTime paymentDate;
        private LocalDateTime processedAt;
    }

    @Data
    public static class MarkPaidRequest {
        private String notes; // Placeholder for future use
    }
}
