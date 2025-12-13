package com.attendance.leave.controller;

import com.attendance.leave.common.annotation.AdminOnly;
import com.attendance.leave.dto.LeaveDtos.*;
import com.attendance.leave.entity.LeaveStatus;
import com.attendance.leave.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping
    public ResponseEntity<LeaveRequestResponse> createLeaveRequest(@RequestBody CreateLeaveRequest request) {
        return ResponseEntity.ok(leaveService.createLeaveRequest(request));
    }

    @PutMapping("/{id}/status")
    @AdminOnly
    public ResponseEntity<LeaveRequestResponse> updateStatus(@PathVariable Long id,
            @RequestBody UpdateLeaveStatusRequest request) {
        return ResponseEntity.ok(leaveService.updateStatus(id, request));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveRequestResponse>> getEmployeeLeaves(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getEmployeeLeaves(employeeId));
    }

    @GetMapping
    @AdminOnly
    public ResponseEntity<List<LeaveRequestResponse>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @GetMapping("/status/{status}")
    @AdminOnly
    public ResponseEntity<List<LeaveRequestResponse>> getLeavesByStatus(@PathVariable LeaveStatus status) {
        return ResponseEntity.ok(leaveService.getLeavesByStatus(status));
    }
}
