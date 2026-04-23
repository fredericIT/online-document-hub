package com.test.dto;

import com.test.model.SharePermission;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DocumentShareResponse {
    private Long id;
    private DocumentResponse document;
    private UserResponse sharedWithUser;
    private UserResponse sharedBy;
    private SharePermission permission;
    private LocalDateTime sharedAt;
    private LocalDateTime expiresAt;
    private Boolean active;
}
