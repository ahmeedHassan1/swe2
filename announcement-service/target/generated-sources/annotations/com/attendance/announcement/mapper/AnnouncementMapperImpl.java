package com.attendance.announcement.mapper;

import com.attendance.announcement.dto.AnnouncementDtos;
import com.attendance.announcement.entity.Announcement;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-14T11:30:15+0200",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class AnnouncementMapperImpl implements AnnouncementMapper {

    @Override
    public Announcement toEntity(AnnouncementDtos.CreateAnnouncementRequest request) {
        if ( request == null ) {
            return null;
        }

        Announcement announcement = new Announcement();

        announcement.setTitle( request.getTitle() );
        announcement.setContent( request.getContent() );
        announcement.setPriority( request.getPriority() );

        return announcement;
    }

    @Override
    public AnnouncementDtos.AnnouncementResponse toResponse(Announcement announcement) {
        if ( announcement == null ) {
            return null;
        }

        AnnouncementDtos.AnnouncementResponse announcementResponse = new AnnouncementDtos.AnnouncementResponse();

        announcementResponse.setId( announcement.getId() );
        announcementResponse.setTitle( announcement.getTitle() );
        announcementResponse.setContent( announcement.getContent() );
        announcementResponse.setPriority( announcement.getPriority() );
        announcementResponse.setCreatedAt( announcement.getCreatedAt() );

        return announcementResponse;
    }

    @Override
    public List<AnnouncementDtos.AnnouncementResponse> toResponseList(List<Announcement> announcements) {
        if ( announcements == null ) {
            return null;
        }

        List<AnnouncementDtos.AnnouncementResponse> list = new ArrayList<AnnouncementDtos.AnnouncementResponse>( announcements.size() );
        for ( Announcement announcement : announcements ) {
            list.add( toResponse( announcement ) );
        }

        return list;
    }
}
