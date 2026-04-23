package com.test.dto;

import com.test.model.SharePermission;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DocumentShareCreateRequest {
    
    @NotNull(message = "Document ID is required")
    private Long documentId;
    
    @NotNull(message = "Shared with user ID is required")
    private Long sharedWithUserId;
    
    @NotNull(message = "Permission is required")
    private SharePermission permission;
    
    private LocalDateTime expiresAt;
}
