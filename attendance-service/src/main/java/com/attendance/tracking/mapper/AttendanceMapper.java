package com.attendance.tracking.mapper;

import com.attendance.tracking.dto.AttendanceDtos.*;
import com.attendance.tracking.entity.Attendance;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AttendanceMapper {
    AttendanceResponse toResponse(Attendance attendance);

    List<AttendanceResponse> toResponseList(List<Attendance> attendances);
}
