package com.attendance.leave.mapper;

import com.attendance.leave.dto.LeaveDtos.*;
import com.attendance.leave.entity.LeaveRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LeaveMapper {
    LeaveRequest toEntity(CreateLeaveRequest request);

    LeaveRequestResponse toResponse(LeaveRequest leaveRequest);

    List<LeaveRequestResponse> toResponseList(List<LeaveRequest> leaveRequests);
}
