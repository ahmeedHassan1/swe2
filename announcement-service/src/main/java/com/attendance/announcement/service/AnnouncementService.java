package com.attendance.announcement.service;

import com.attendance.announcement.dto.AnnouncementDtos.*;
import com.attendance.announcement.entity.Announcement;
import com.attendance.announcement.entity.User;
import com.attendance.announcement.mapper.AnnouncementMapper;
import com.attendance.announcement.repository.AnnouncementRepository;
import com.attendance.announcement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementMapper announcementMapper;
    private final UserRepository userRepository;

    @Transactional
    public AnnouncementResponse createAnnouncement(CreateAnnouncementRequest request) {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User, " + email + ", not found"));

        Announcement announcement = announcementMapper.toEntity(request);
        announcement.setCreatedBy(user.getId());
        return announcementMapper.toResponse(announcementRepository.save(announcement));
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAllAnnouncements() {
        return announcementMapper.toResponseList(announcementRepository.findAllByOrderByCreatedAtDesc());
    }
}
