package com.attendance.tracking.service;

import com.attendance.tracking.dto.AttendanceDtos.*;
import com.attendance.tracking.entity.Attendance;
import com.attendance.tracking.entity.AttendanceStatus;
import com.attendance.tracking.mapper.AttendanceMapper;
import com.attendance.tracking.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final AttendanceMapper attendanceMapper;

    @Transactional
    public AttendanceResponse clockIn(ClockInRequest request) {
        LocalDate today = LocalDate.now();

        if (attendanceRepository.findByEmployeeIdAndDate(request.getEmployeeId(), today).isPresent()) {
            throw new RuntimeException("Already clocked in today");
        }

        Attendance attendance = new Attendance();
        attendance.setEmployeeId(request.getEmployeeId());
        attendance.setClockInTime(LocalDateTime.now());
        attendance.setDate(today);
        attendance.setNotes(request.getNotes());

        // Simple logic for status: Late if after 9:00 AM
        if (LocalDateTime.now().getHour() >= 9) {
            attendance.setStatus(AttendanceStatus.LATE);
        } else {
            attendance.setStatus(AttendanceStatus.PRESENT);
        }

        return attendanceMapper.toResponse(attendanceRepository.save(attendance));
    }

    @Transactional
    public AttendanceResponse clockOut(ClockOutRequest request) {
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(request.getEmployeeId(), today)
                .orElseThrow(() -> new RuntimeException("No clock-in record found for today"));

        if (attendance.getClockOutTime() != null) {
            throw new RuntimeException("Already clocked out today");
        }

        attendance.setClockOutTime(LocalDateTime.now());
        if (request.getNotes() != null) {
            attendance.setNotes(attendance.getNotes() + " | Out: " + request.getNotes());
        }

        return attendanceMapper.toResponse(attendanceRepository.save(attendance));
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getDailyAttendance(LocalDate date) {
        return attendanceMapper.toResponseList(attendanceRepository.findByDate(date));
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getEmployeeAttendance(Long employeeId) {
        return attendanceMapper.toResponseList(attendanceRepository.findByEmployeeId(employeeId));
    }

    @Transactional(readOnly = true)
    public AttendanceResponse getTodayStatus(Long employeeId) {
        return attendanceRepository.findByEmployeeIdAndDate(employeeId, LocalDate.now())
                .map(attendanceMapper::toResponse)
                .orElse(null);
    }
}
