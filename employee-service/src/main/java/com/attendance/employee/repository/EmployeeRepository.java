package com.attendance.employee.repository;

import com.attendance.employee.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmployeeId(String employeeId);
    Page<Employee> findByDepartment(String department, Pageable pageable);
    Boolean existsByEmail(String email);
    Optional<Employee> findByUserId(Long userId);
}
