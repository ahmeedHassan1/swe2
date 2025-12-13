package com.attendance.payroll.mapper;

import com.attendance.payroll.dto.PayrollDtos.*;
import com.attendance.payroll.entity.Payroll;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PayrollMapper {
    Payroll toEntity(ProcessPayrollRequest request);

    PayrollResponse toResponse(Payroll payroll);

    List<PayrollResponse> toResponseList(List<Payroll> payrolls);
}
