package com.attendance.announcement.mapper;

import com.attendance.announcement.dto.AnnouncementDtos.*;
import com.attendance.announcement.entity.Announcement;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AnnouncementMapper {
    Announcement toEntity(CreateAnnouncementRequest request);

    AnnouncementResponse toResponse(Announcement announcement);

    List<AnnouncementResponse> toResponseList(List<Announcement> announcements);
}
