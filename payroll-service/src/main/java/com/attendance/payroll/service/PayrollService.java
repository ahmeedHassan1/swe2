package com.attendance.payroll.service;

import com.attendance.payroll.dto.PayrollDtos.*;
import com.attendance.payroll.entity.Payroll;
import com.attendance.payroll.entity.PayrollStatus;
import com.attendance.payroll.mapper.PayrollMapper;
import com.attendance.payroll.repository.PayrollRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final PayrollMapper payrollMapper;

    @Transactional
    public PayrollResponse processPayroll(ProcessPayrollRequest request) {
        if (payrollRepository
                .findByEmployeeIdAndMonthAndYear(request.getEmployeeId(), request.getMonth(), request.getYear())
                .isPresent()) {
            throw new RuntimeException("Payroll already processed for this employee and period");
        }

        Payroll payroll = payrollMapper.toEntity(request);
        if (payroll.getBonuses() == null)
            payroll.setBonuses(BigDecimal.ZERO);
        if (payroll.getDeductions() == null)
            payroll.setDeductions(BigDecimal.ZERO);

        // Net salary calculated in PrePersist/PreUpdate or we can do it here explicitly
        // to be safe before save
        payroll.setNetSalary(payroll.getBaseSalary().add(payroll.getBonuses()).subtract(payroll.getDeductions()));

        return payrollMapper.toResponse(payrollRepository.save(payroll));
    }

    @Transactional
    public PayrollResponse markAsPaid(Long id) {
        Payroll payroll = payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll record not found"));

        if (payroll.getStatus() == PayrollStatus.PAID) {
            throw new RuntimeException("Payroll already paid");
        }

        payroll.setStatus(PayrollStatus.PAID);
        payroll.setPaymentDate(LocalDateTime.now());
        return payrollMapper.toResponse(payrollRepository.save(payroll));
    }

    @Transactional(readOnly = true)
    public List<PayrollResponse> getEmployeePayroll(Long employeeId) {
        return payrollMapper.toResponseList(payrollRepository.findByEmployeeId(employeeId));
    }

    @Transactional(readOnly = true)
    public List<PayrollResponse> getPayrollByPeriod(Integer month, Integer year) {
        return payrollMapper.toResponseList(payrollRepository.findByMonthAndYear(month, year));
    }
}
