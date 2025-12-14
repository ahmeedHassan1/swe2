package com.attendance.tracking.mapper;

import com.attendance.tracking.dto.AttendanceDtos;
import com.attendance.tracking.entity.Attendance;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-14T11:01:40+0200",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class AttendanceMapperImpl implements AttendanceMapper {

    @Override
    public AttendanceDtos.AttendanceResponse toResponse(Attendance attendance) {
        if ( attendance == null ) {
            return null;
        }

        AttendanceDtos.AttendanceResponse attendanceResponse = new AttendanceDtos.AttendanceResponse();

        attendanceResponse.setClockInTime( attendance.getClockInTime() );
        attendanceResponse.setClockOutTime( attendance.getClockOutTime() );
        attendanceResponse.setDate( attendance.getDate() );
        attendanceResponse.setEmployeeId( attendance.getEmployeeId() );
        attendanceResponse.setId( attendance.getId() );
        attendanceResponse.setNotes( attendance.getNotes() );
        attendanceResponse.setStatus( attendance.getStatus() );
        attendanceResponse.setWorkHours( attendance.getWorkHours() );

        return attendanceResponse;
    }

    @Override
    public List<AttendanceDtos.AttendanceResponse> toResponseList(List<Attendance> attendances) {
        if ( attendances == null ) {
            return null;
        }

        List<AttendanceDtos.AttendanceResponse> list = new ArrayList<AttendanceDtos.AttendanceResponse>( attendances.size() );
        for ( Attendance attendance : attendances ) {
            list.add( toResponse( attendance ) );
        }

        return list;
    }
}
