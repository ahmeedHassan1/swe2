package com.attendance.announcement.dto;

import com.attendance.announcement.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class AnnouncementDtos {

    @Data
    public static class CreateAnnouncementRequest {
        @NotBlank
        private String title;
        @NotBlank
        private String message;
        @NotNull
        private NotificationType type;
    }

    @Data
    public static class AnnouncementResponse {
        private Long id;
        private String title;
        private String message;
        private NotificationType type;
        private LocalDateTime createdAt;
    }
}
