package com.test.controller;

import com.test.model.Document;
import com.test.model.User;
import com.test.service.DocumentService;
import com.test.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;
    private final UserService userService;
    private final com.test.service.AuditLogService auditLogService;

    private String getClientIp(jakarta.servlet.http.HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Document> createDocument(@Valid @RequestBody DocumentCreationRequest request, 
                                                   Authentication authentication) {
        String username = authentication.getName();
        User owner = userService.getUserByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Document document = Document.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .fileName(request.getFileName())
            .originalFileName(request.getOriginalFileName())
            .filePath(request.getFilePath())
            .contentType(request.getContentType())
            .fileSize(request.getFileSize())
            .build();

        Document createdDocument = documentService.createDocument(document, owner);
        return new ResponseEntity<>(createdDocument, HttpStatus.CREATED);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Document> uploadDocument(@RequestParam("file") MultipartFile file,
                                                  @RequestParam("title") String title,
                                                  @RequestParam(value = "description", required = false) String description,
                                                  Authentication authentication,
                                                  jakarta.servlet.http.HttpServletRequest request) {
        String username = authentication.getName();
        User owner = userService.getUserByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Document createdDocument = documentService.uploadDocument(file, title, description, owner);
        
        auditLogService.log("UPLOAD_DOCUMENT", username, "Uploaded file: " + file.getOriginalFilename(), getClientIp(request));
        
        return new ResponseEntity<>(createdDocument, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id, Authentication authentication) {
        Optional<Document> document = documentService.getDocumentById(id);
        
        if (document.isPresent()) {
            return ResponseEntity.ok(document.get());
        }
        
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Document>> getAllDocuments(Authentication authentication) {
        List<Document> documents = documentService.getAllDocuments();
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Document>> getMyDocuments(Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userService.getUserByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<Document> documents = documentService.getDocumentsByOwner(currentUser);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/search/title")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Document>> searchDocumentsByTitle(@RequestParam String title, 
                                                                 Authentication authentication) {
        List<Document> documents = documentService.searchDocumentsByTitle(title);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/search/description")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Document>> searchDocumentsByDescription(@RequestParam String description, 
                                                                        Authentication authentication) {
        List<Document> documents = documentService.searchDocumentsByDescription(description);
        return ResponseEntity.ok(documents);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Document> updateDocument(@PathVariable Long id, 
                                                 @Valid @RequestBody DocumentUpdateRequest request,
                                                 Authentication authentication) {
        Optional<Document> existingDocument = documentService.getDocumentById(id);
        
        if (existingDocument.isPresent()) {
            Document doc = existingDocument.get();
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (doc.getOwner().getId().equals(currentUser.getId()) || 
                authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                
                Document documentDetails = Document.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .fileName(request.getFileName())
                    .originalFileName(request.getOriginalFileName())
                    .filePath(request.getFilePath())
                    .contentType(request.getContentType())
                    .fileSize(request.getFileSize())
                    .build();
                
                Document updatedDocument = documentService.updateDocument(id, documentDetails);
                return ResponseEntity.ok(updatedDocument);
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id, Authentication authentication,
                                             jakarta.servlet.http.HttpServletRequest request) {
        Optional<Document> existingDocument = documentService.getDocumentById(id);
        
        if (existingDocument.isPresent()) {
            Document doc = existingDocument.get();
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (doc.getOwner().getId().equals(currentUser.getId()) || 
                authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                documentService.deleteDocument(id);
                
                auditLogService.log("DELETE_DOCUMENT", username, "Deleted document ID: " + id, getClientIp(request));
                
                return ResponseEntity.noContent().build();
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    public static class DocumentCreationRequest {
        private String title;
        private String description;
        private String fileName;
        private String originalFileName;
        private String filePath;
        private String contentType;
        private Long fileSize;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getOriginalFileName() { return originalFileName; }
        public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
        public String getFilePath() { return filePath; }
        public void setFilePath(String filePath) { this.filePath = filePath; }
        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }
        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    }

    public static class DocumentUpdateRequest {
        private String title;
        private String description;
        private String fileName;
        private String originalFileName;
        private String filePath;
        private String contentType;
        private Long fileSize;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getOriginalFileName() { return originalFileName; }
        public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
        public String getFilePath() { return filePath; }
        public void setFilePath(String filePath) { this.filePath = filePath; }
        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }
        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    }
}
