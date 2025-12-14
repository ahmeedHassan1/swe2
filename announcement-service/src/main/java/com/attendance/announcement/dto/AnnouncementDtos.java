package com.attendance.announcement.dto;

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
        private String content;
        @NotNull
        private String priority;
    }

    @Data
    public static class AnnouncementResponse {
        private Long id;
        private String title;
        private String content;
        private String priority;
        private LocalDateTime createdAt;
    }
}
