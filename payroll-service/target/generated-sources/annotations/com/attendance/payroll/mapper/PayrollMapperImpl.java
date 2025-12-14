package com.attendance.payroll.mapper;

import com.attendance.payroll.dto.PayrollDtos;
import com.attendance.payroll.entity.Payroll;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-14T11:09:40+0200",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class PayrollMapperImpl implements PayrollMapper {

    @Override
    public Payroll toEntity(PayrollDtos.ProcessPayrollRequest request) {
        if ( request == null ) {
            return null;
        }

        Payroll payroll = new Payroll();

        payroll.setBaseSalary( request.getBaseSalary() );
        payroll.setBonuses( request.getBonuses() );
        payroll.setDeductions( request.getDeductions() );
        payroll.setEmployeeId( request.getEmployeeId() );
        payroll.setMonth( request.getMonth() );
        payroll.setYear( request.getYear() );

        return payroll;
    }

    @Override
    public PayrollDtos.PayrollResponse toResponse(Payroll payroll) {
        if ( payroll == null ) {
            return null;
        }

        PayrollDtos.PayrollResponse payrollResponse = new PayrollDtos.PayrollResponse();

        payrollResponse.setBaseSalary( payroll.getBaseSalary() );
        payrollResponse.setBonuses( payroll.getBonuses() );
        payrollResponse.setDeductions( payroll.getDeductions() );
        payrollResponse.setEmployeeId( payroll.getEmployeeId() );
        payrollResponse.setId( payroll.getId() );
        payrollResponse.setMonth( payroll.getMonth() );
        payrollResponse.setNetSalary( payroll.getNetSalary() );
        payrollResponse.setPaymentDate( payroll.getPaymentDate() );
        payrollResponse.setProcessedAt( payroll.getProcessedAt() );
        payrollResponse.setStatus( payroll.getStatus() );
        payrollResponse.setYear( payroll.getYear() );

        return payrollResponse;
    }

    @Override
    public List<PayrollDtos.PayrollResponse> toResponseList(List<Payroll> payrolls) {
        if ( payrolls == null ) {
            return null;
        }

        List<PayrollDtos.PayrollResponse> list = new ArrayList<PayrollDtos.PayrollResponse>( payrolls.size() );
        for ( Payroll payroll : payrolls ) {
            list.add( toResponse( payroll ) );
        }

        return list;
    }
}
