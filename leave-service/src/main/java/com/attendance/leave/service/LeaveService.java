package com.attendance.leave.service;

import com.attendance.leave.dto.LeaveDtos.*;
import com.attendance.leave.entity.LeaveRequest;
import com.attendance.leave.entity.LeaveStatus;
import com.attendance.leave.mapper.LeaveMapper;
import com.attendance.leave.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveMapper leaveMapper;

    @Transactional
    public LeaveRequestResponse createLeaveRequest(CreateLeaveRequest request) {
        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start date cannot be in the past");
        }

        LeaveRequest leaveRequest = leaveMapper.toEntity(request);
        leaveRequest.setStatus(LeaveStatus.PENDING);
        return leaveMapper.toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Transactional
    public LeaveRequestResponse updateStatus(Long id, UpdateLeaveStatusRequest request) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        leaveRequest.setStatus(request.getStatus());
        return leaveMapper.toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getEmployeeLeaves(Long employeeId) {
        return leaveMapper.toResponseList(leaveRequestRepository.findByEmployeeId(employeeId));
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getAllLeaves() {
        return leaveMapper.toResponseList(leaveRequestRepository.findAll());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> getLeavesByStatus(LeaveStatus status) {
        return leaveMapper.toResponseList(leaveRequestRepository.findByStatus(status));
    }
}
