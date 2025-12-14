package com.attendance.employee.common.aspect;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class SecurityAspect {
    private static final Logger log = LoggerFactory.getLogger(SecurityAspect.class);
    
    @Before("@annotation(com.attendance.employee.common.annotation.AdminOnly)")
    public void checkAdminAccess(JoinPoint joinPoint) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            log.warn("Unauthorized access attempt to: {}", joinPoint.getSignature().toShortString());
            throw new AccessDeniedException("Admin access required");
        }
    }
}
