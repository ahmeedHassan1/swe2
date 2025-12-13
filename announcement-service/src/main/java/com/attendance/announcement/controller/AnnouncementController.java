package com.attendance.announcement.controller;

import com.attendance.announcement.common.annotation.AdminOnly;
import com.attendance.announcement.dto.AnnouncementDtos.*;
import com.attendance.announcement.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping
    @AdminOnly
    public ResponseEntity<AnnouncementResponse> createAnnouncement(@RequestBody CreateAnnouncementRequest request) {
        return ResponseEntity.ok(announcementService.createAnnouncement(request));
    }

    @GetMapping
    public ResponseEntity<List<AnnouncementResponse>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }
}
