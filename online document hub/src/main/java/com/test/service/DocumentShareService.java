package com.test.service;

import com.test.model.DocumentShare;
import com.test.model.Document;
import com.test.model.User;
import com.test.model.SharePermission;
import com.test.repository.DocumentShareRepository;
import com.test.repository.DocumentRepository;
import com.test.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentShareService {

    private final DocumentShareRepository documentShareRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public DocumentShare shareDocument(Long documentId, Long sharedWithUserId, Long sharedByUserId, 
                                     SharePermission permission, LocalDateTime expiresAt) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        User sharedWithUser = userRepository.findById(sharedWithUserId)
            .orElseThrow(() -> new RuntimeException("User to share with not found"));
        
        User sharedByUser = userRepository.findById(sharedByUserId)
            .orElseThrow(() -> new RuntimeException("User sharing not found"));

        Optional<DocumentShare> existingShare = documentShareRepository
            .findByDocumentIdAndSharedWithUserId(documentId, sharedWithUserId)
            .stream()
            .filter(share -> share.getActive())
            .findFirst();

        if (existingShare.isPresent()) {
            throw new RuntimeException("Document already shared with this user");
        }

        DocumentShare documentShare = DocumentShare.builder()
            .document(document)
            .sharedWithUser(sharedWithUser)
            .sharedBy(sharedByUser)
            .permission(permission)
            .sharedAt(LocalDateTime.now())
            .expiresAt(expiresAt)
            .active(true)
            .build();

        return documentShareRepository.save(documentShare);
    }

    public Optional<DocumentShare> getDocumentShareById(Long id) {
        return documentShareRepository.findById(id);
    }

    public List<DocumentShare> getSharesByDocument(Long documentId) {
        return documentShareRepository.findByDocumentId(documentId);
    }

    public List<DocumentShare> getSharesSharedWithUser(Long userId) {
        return documentShareRepository.findBySharedWithUserId(userId);
    }

    public List<DocumentShare> getActiveSharesSharedWithUser(Long userId) {
        return documentShareRepository.findBySharedWithUserId(userId).stream()
            .filter(share -> share.getActive() && 
                  (share.getExpiresAt() == null || share.getExpiresAt().isAfter(LocalDateTime.now())))
            .toList();
    }

    public List<DocumentShare> getActiveSharesSharedWithMe(Long userId) {
        return documentShareRepository.findBySharedWithUserId(userId).stream()
            .filter(share -> share.getActive() && 
                  (share.getExpiresAt() == null || share.getExpiresAt().isAfter(LocalDateTime.now())))
            .toList();
    }

    public List<DocumentShare> getSharesSharedByMe(Long userId) {
        return documentShareRepository.findBySharedById(userId);
    }

    public DocumentShare updateSharePermission(Long id, SharePermission permission) {
        DocumentShare documentShare = documentShareRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document share not found"));
        
        documentShare.setPermission(permission);
        return documentShareRepository.save(documentShare);
    }

    public DocumentShare extendShareExpiry(Long id, LocalDateTime newExpiryDate) {
        DocumentShare documentShare = documentShareRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document share not found"));
        
        documentShare.setExpiresAt(newExpiryDate);
        return documentShareRepository.save(documentShare);
    }

    public void revokeShare(Long id) {
        DocumentShare documentShare = documentShareRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document share not found"));
        
        documentShare.setActive(false);
        documentShareRepository.save(documentShare);
    }

    public void deleteShare(Long id) {
        DocumentShare documentShare = documentShareRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document share not found"));
        
        documentShareRepository.delete(documentShare);
    }

    public boolean hasAccess(Long documentId, Long userId, SharePermission requiredPermission) {
        return documentShareRepository.hasPermission(documentId, userId, requiredPermission) ||
               getActiveSharesSharedWithUser(userId).stream()
                   .filter(share -> share.getDocument().getId().equals(documentId))
                   .anyMatch(share -> hasPermission(share.getPermission(), requiredPermission));
    }

    private boolean hasPermission(SharePermission userPermission, SharePermission requiredPermission) {
        return switch (userPermission) {
            case ADMIN -> true;
            case READ_WRITE -> requiredPermission != SharePermission.ADMIN;
            case READ_ONLY -> requiredPermission == SharePermission.READ_ONLY;
        };
    }
    
    public List<DocumentShare> getActiveSharesSharedWithUserOptimized(Long userId) {
        return documentShareRepository.findActiveSharesSharedWithUser(userId, LocalDateTime.now());
    }
    
    public List<DocumentShare> getActiveSharesSharedByUserOptimized(Long userId) {
        return documentShareRepository.findActiveSharesSharedByUser(userId, LocalDateTime.now());
    }
    
    public List<DocumentShare> getActiveSharesByDocumentOptimized(Long documentId) {
        return documentShareRepository.findActiveSharesByDocumentId(documentId, LocalDateTime.now());
    }
    
    public boolean checkDocumentAccess(Long documentId, Long userId, SharePermission requiredPermission) {
        return documentShareRepository.hasPermission(documentId, userId, requiredPermission);
    }
    
    public boolean checkDocumentWriteAccess(Long documentId, Long userId) {
        return documentShareRepository.hasWritePermission(documentId, userId);
    }
    
    public boolean checkDocumentAdminAccess(Long documentId, Long userId) {
        return documentShareRepository.hasAdminPermission(documentId, userId);
    }
    
    public void cleanupExpiredShares() {
        List<DocumentShare> expiredShares = documentShareRepository.findActiveShares(LocalDateTime.now()).stream()
            .filter(share -> share.getExpiresAt() != null && share.getExpiresAt().isBefore(LocalDateTime.now()))
            .toList();
            
        expiredShares.forEach(share -> {
            share.setActive(false);
            documentShareRepository.save(share);
        });
    }

    public List<DocumentShare> getAllActiveShares() {
        return documentShareRepository.findActiveShares(LocalDateTime.now());
    }
}
