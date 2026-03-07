package com.test.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DocumentResponse {
    private Long id;
    private String title;
    private String description;
    private String fileName;
    private String originalFileName;
    private String filePath;
    private String contentType;
    private Long fileSize;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
    private UserResponse owner;
}
