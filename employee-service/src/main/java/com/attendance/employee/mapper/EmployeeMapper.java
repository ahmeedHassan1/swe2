package com.attendance.employee.mapper;

import com.attendance.employee.dto.EmployeeDtos.*;
import com.attendance.employee.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    Employee toEntity(EmployeeRequest request);
    EmployeeResponse toResponse(Employee employee);
    List<EmployeeResponse> toResponseList(List<Employee> employees);
    void updateEntityFromRequest(EmployeeRequest request, @MappingTarget Employee employee);
}
