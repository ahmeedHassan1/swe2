package com.attendance.payroll.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private BigDecimal baseSalary;

    @Column(nullable = false)
    private BigDecimal bonuses;

    @Column(nullable = false)
    private BigDecimal deductions;

    @Column(name = "net_salary", nullable = false)
    private BigDecimal netSalary;

    @Enumerated(EnumType.STRING)
    private PayrollStatus status;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    // OCL: context Payroll inv: netSalary = baseSalary + bonuses - deductions
    @PrePersist
    @PreUpdate
    private void calculateNetSalary() {
        if (baseSalary != null) {
            BigDecimal bonusVal = bonuses != null ? bonuses : BigDecimal.ZERO;
            BigDecimal deducVal = deductions != null ? deductions : BigDecimal.ZERO;
            netSalary = baseSalary.add(bonusVal).subtract(deducVal);
        }
    }

    @PrePersist
    protected void onCreate() {
        processedAt = LocalDateTime.now();
        if (status == null) {
            status = PayrollStatus.PENDING;
        }
    }
}
