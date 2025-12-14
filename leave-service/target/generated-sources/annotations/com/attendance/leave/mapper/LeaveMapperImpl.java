package com.attendance.leave.mapper;

import com.attendance.leave.dto.LeaveDtos;
import com.attendance.leave.entity.LeaveRequest;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-14T11:07:51+0200",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class LeaveMapperImpl implements LeaveMapper {

    @Override
    public LeaveRequest toEntity(LeaveDtos.CreateLeaveRequest request) {
        if ( request == null ) {
            return null;
        }

        LeaveRequest leaveRequest = new LeaveRequest();

        leaveRequest.setEmployeeId( request.getEmployeeId() );
        leaveRequest.setEndDate( request.getEndDate() );
        leaveRequest.setReason( request.getReason() );
        leaveRequest.setStartDate( request.getStartDate() );
        leaveRequest.setType( request.getType() );

        return leaveRequest;
    }

    @Override
    public LeaveDtos.LeaveRequestResponse toResponse(LeaveRequest leaveRequest) {
        if ( leaveRequest == null ) {
            return null;
        }

        LeaveDtos.LeaveRequestResponse leaveRequestResponse = new LeaveDtos.LeaveRequestResponse();

        leaveRequestResponse.setCreatedAt( leaveRequest.getCreatedAt() );
        leaveRequestResponse.setEmployeeId( leaveRequest.getEmployeeId() );
        leaveRequestResponse.setEndDate( leaveRequest.getEndDate() );
        leaveRequestResponse.setId( leaveRequest.getId() );
        leaveRequestResponse.setReason( leaveRequest.getReason() );
        leaveRequestResponse.setStartDate( leaveRequest.getStartDate() );
        leaveRequestResponse.setStatus( leaveRequest.getStatus() );
        leaveRequestResponse.setType( leaveRequest.getType() );

        return leaveRequestResponse;
    }

    @Override
    public List<LeaveDtos.LeaveRequestResponse> toResponseList(List<LeaveRequest> leaveRequests) {
        if ( leaveRequests == null ) {
            return null;
        }

        List<LeaveDtos.LeaveRequestResponse> list = new ArrayList<LeaveDtos.LeaveRequestResponse>( leaveRequests.size() );
        for ( LeaveRequest leaveRequest : leaveRequests ) {
            list.add( toResponse( leaveRequest ) );
        }

        return list;
    }
}
