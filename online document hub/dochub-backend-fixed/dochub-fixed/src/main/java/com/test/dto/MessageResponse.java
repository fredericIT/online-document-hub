package com.test.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderUsername;
    private Long recipientId;
    private String recipientUsername;
    private String content;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private Boolean isRead;
    private LocalDateTime sentAt;
}
