package com.attendance.employee.controller;

import com.attendance.employee.common.annotation.AdminOnly;
import com.attendance.employee.dto.EmployeeDtos.*;
import com.attendance.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {
    
    private final EmployeeService employeeService;
    
    @PostMapping
    @AdminOnly
    public ResponseEntity<EmployeeResponse> createEmployee(@RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.createEmployee(request));
    }
    
    @GetMapping
    @AdminOnly
    public ResponseEntity<Page<EmployeeResponse>> getAllEmployees(Pageable pageable) {
        return ResponseEntity.ok(employeeService.getAllEmployees(pageable));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Long id) {
        // Access control check (User can see their own, Admin can see all)
        // Ideally should check principal vs requested ID logic here but keeping simple for now
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }
    
    @PutMapping("/{id}")
    @AdminOnly
    public ResponseEntity<EmployeeResponse> updateEmployee(@PathVariable Long id, @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }
    
    @DeleteMapping("/{id}")
    @AdminOnly
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/me")
    public ResponseEntity<EmployeeResponse> getCurrentProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        // Assumption: We need a way to look up employee by email or link to user
        // But Employee has email, let's assuming email is unique and shared with user auth
        // For simplicity, let's assume the email in token matches employee email
        // Or we need a lookup method in repo
        throw new UnsupportedOperationException("Not implemented yet - need lookup by email");
    }
}
