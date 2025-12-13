package com.attendance.payroll.controller;

import com.attendance.payroll.common.annotation.AdminOnly;
import com.attendance.payroll.dto.PayrollDtos.*;
import com.attendance.payroll.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping
    @AdminOnly
    public ResponseEntity<PayrollResponse> processPayroll(@RequestBody ProcessPayrollRequest request) {
        return ResponseEntity.ok(payrollService.processPayroll(request));
    }

    @PutMapping("/{id}/pay")
    @AdminOnly
    public ResponseEntity<PayrollResponse> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.markAsPaid(id));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayrollResponse>> getEmployeePayroll(@PathVariable Long employeeId) {
        return ResponseEntity.ok(payrollService.getEmployeePayroll(employeeId));
    }

    @GetMapping("/period")
    @AdminOnly
    public ResponseEntity<List<PayrollResponse>> getPayrollByPeriod(@RequestParam Integer month,
            @RequestParam Integer year) {
        return ResponseEntity.ok(payrollService.getPayrollByPeriod(month, year));
    }
}
