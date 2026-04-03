package com.test.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private String type;
    private String content;
    private String link;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
