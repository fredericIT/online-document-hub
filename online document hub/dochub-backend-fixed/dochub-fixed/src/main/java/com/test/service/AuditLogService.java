package com.test.service;

import com.test.model.AuditLog;
import com.test.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {
    
    private final AuditLogRepository auditLogRepository;
    
    public void log(String action, String username, String details, String ipAddress) {
        AuditLog log = AuditLog.builder()
            .action(action)
            .username(username)
            .details(details)
            .ipAddress(ipAddress)
            .timestamp(LocalDateTime.now())
            .build();
        auditLogRepository.save(log);
    }
    
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
