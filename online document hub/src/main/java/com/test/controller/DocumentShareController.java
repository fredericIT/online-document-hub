package com.test.controller;

import com.test.model.DocumentShare;
import com.test.model.User;
import com.test.model.SharePermission;
import com.test.service.DocumentShareService;
import com.test.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/document-shares")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocumentShareController {

    private final DocumentShareService documentShareService;
    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<DocumentShare> shareDocument(@Valid @RequestBody DocumentShareRequest request,
                                                     Authentication authentication) {
        String username = authentication.getName();
        User sharedByUser = userService.getUserByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        DocumentShare documentShare = documentShareService.shareDocument(
            request.getDocumentId(),
            request.getSharedWithUserId(),
            sharedByUser.getId(),
            request.getPermission(),
            request.getExpiresAt()
        );

        return new ResponseEntity<>(documentShare, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<DocumentShare> getDocumentShareById(@PathVariable Long id, 
                                                             Authentication authentication) {
        Optional<DocumentShare> documentShare = documentShareService.getDocumentShareById(id);
        
        if (documentShare.isPresent()) {
            DocumentShare share = documentShare.get();
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (share.getSharedBy().getId().equals(currentUser.getId()) || 
                share.getSharedWithUser().getId().equals(currentUser.getId()) ||
                authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.ok(share);
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/document/{documentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DocumentShare>> getSharesByDocument(@PathVariable Long documentId,
                                                                   Authentication authentication) {
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            List<DocumentShare> shares = documentShareService.getSharesByDocument(documentId);
            return ResponseEntity.ok(shares);
        } else {
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            List<DocumentShare> allShares = documentShareService.getSharesByDocument(documentId);
            List<DocumentShare> userShares = allShares.stream()
                .filter(share -> share.getSharedBy().getId().equals(currentUser.getId()))
                .toList();
            return ResponseEntity.ok(userShares);
        }
    }

    @GetMapping("/shared-with-me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DocumentShare>> getSharesSharedWithMe(Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userService.getUserByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<DocumentShare> shares = documentShareService.getActiveSharesSharedWithMe(currentUser.getId());
        return ResponseEntity.ok(shares);
    }

    @GetMapping("/shared-by-me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<DocumentShare>> getSharedByMe(Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userService.getUserByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<DocumentShare> shares = documentShareService.getSharesSharedByMe(currentUser.getId());
        return ResponseEntity.ok(shares);
    }

    @PutMapping("/{id}/permission")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<DocumentShare> updateSharePermission(@PathVariable Long id,
                                                               @RequestBody PermissionUpdateRequest request,
                                                               Authentication authentication) {
        Optional<DocumentShare> existingShare = documentShareService.getDocumentShareById(id);
        
        if (existingShare.isPresent()) {
            DocumentShare share = existingShare.get();
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (share.getSharedBy().getId().equals(currentUser.getId()) || 
                authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                
                DocumentShare updatedShare = documentShareService.updateSharePermission(id, request.getPermission());
                return ResponseEntity.ok(updatedShare);
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/extend")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<DocumentShare> extendShareExpiry(@PathVariable Long id,
                                                          @RequestBody ExpiryUpdateRequest request,
                                                          Authentication authentication) {
        Optional<DocumentShare> existingShare = documentShareService.getDocumentShareById(id);
        
        if (existingShare.isPresent()) {
            DocumentShare share = existingShare.get();
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (share.getSharedBy().getId().equals(currentUser.getId()) || 
                authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                
                DocumentShare updatedShare = documentShareService.extendShareExpiry(id, request.getExpiresAt());
                return ResponseEntity.ok(updatedShare);
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/revoke")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> revokeShare(@PathVariable Long id, Authentication authentication) {
        Optional<DocumentShare> existingShare = documentShareService.getDocumentShareById(id);
        
        if (existingShare.isPresent()) {
            DocumentShare share = existingShare.get();
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (share.getSharedBy().getId().equals(currentUser.getId()) || 
                authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                documentShareService.revokeShare(id);
                return ResponseEntity.ok().build();
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteShare(@PathVariable Long id, Authentication authentication) {
        Optional<DocumentShare> existingShare = documentShareService.getDocumentShareById(id);
        
        if (existingShare.isPresent()) {
            DocumentShare share = existingShare.get();
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (share.getSharedBy().getId().equals(currentUser.getId()) || 
                authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                documentShareService.deleteShare(id);
                return ResponseEntity.noContent().build();
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/check-access/{documentId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Boolean> checkAccess(@PathVariable Long documentId,
                                           @RequestParam SharePermission requiredPermission,
                                           Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userService.getUserByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean hasAccess = documentShareService.hasAccess(documentId, currentUser.getId(), requiredPermission);
        return ResponseEntity.ok(hasAccess);
    }

    public static class DocumentShareRequest {
        private Long documentId;
        private Long sharedWithUserId;
        private SharePermission permission;
        private LocalDateTime expiresAt;

        public Long getDocumentId() { return documentId; }
        public void setDocumentId(Long documentId) { this.documentId = documentId; }
        public Long getSharedWithUserId() { return sharedWithUserId; }
        public void setSharedWithUserId(Long sharedWithUserId) { this.sharedWithUserId = sharedWithUserId; }
        public SharePermission getPermission() { return permission; }
        public void setPermission(SharePermission permission) { this.permission = permission; }
        public LocalDateTime getExpiresAt() { return expiresAt; }
        public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    }

    public static class PermissionUpdateRequest {
        private SharePermission permission;

        public SharePermission getPermission() { return permission; }
        public void setPermission(SharePermission permission) { this.permission = permission; }
    }

    public static class ExpiryUpdateRequest {
        private LocalDateTime expiresAt;

        public LocalDateTime getExpiresAt() { return expiresAt; }
        public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    }
}
