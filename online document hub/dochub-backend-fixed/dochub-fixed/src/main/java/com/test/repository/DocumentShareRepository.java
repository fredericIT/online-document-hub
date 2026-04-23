package com.test.repository;

import com.test.model.DocumentShare;
import com.test.model.User;
import com.test.model.SharePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentShareRepository extends JpaRepository<DocumentShare, Long> {
    List<DocumentShare> findBySharedWithUser(User user);
    List<DocumentShare> findBySharedWithUserId(Long userId);
    List<DocumentShare> findBySharedById(Long userId);
    List<DocumentShare> findByDocumentId(Long documentId);

    // Returns List (not Optional) — a document can be shared multiple times
    // (e.g. revoked and reshared), so multiple rows may exist for the same pair.
    List<DocumentShare> findByDocumentIdAndSharedWithUserId(Long documentId, Long userId);
    
    @Query("SELECT ds FROM DocumentShare ds WHERE ds.active = true AND (ds.expiresAt IS NULL OR ds.expiresAt > :now)")
    List<DocumentShare> findActiveShares(@Param("now") LocalDateTime now);
    
    @Query("SELECT ds FROM DocumentShare ds WHERE ds.document.id = :documentId AND ds.active = true AND (ds.expiresAt IS NULL OR ds.expiresAt > :now)")
    List<DocumentShare> findActiveSharesByDocumentId(@Param("documentId") Long documentId, @Param("now") LocalDateTime now);
    
    @Query("SELECT ds FROM DocumentShare ds WHERE ds.sharedWithUser.id = :userId AND ds.active = true AND (ds.expiresAt IS NULL OR ds.expiresAt > :now)")
    List<DocumentShare> findActiveSharesSharedWithUser(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    @Query("SELECT ds FROM DocumentShare ds WHERE ds.sharedBy.id = :userId AND ds.active = true AND (ds.expiresAt IS NULL OR ds.expiresAt > :now)")
    List<DocumentShare> findActiveSharesSharedByUser(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    // Fixed: added :now parameter that was missing in original queries
    @Query("SELECT CASE WHEN COUNT(ds) > 0 THEN true ELSE false END FROM DocumentShare ds " +
           "WHERE ds.document.id = :documentId AND ds.sharedWithUser.id = :userId " +
           "AND ds.active = true AND (ds.expiresAt IS NULL OR ds.expiresAt > :now) " +
           "AND ds.permission = :permission")
    boolean hasPermission(@Param("documentId") Long documentId, @Param("userId") Long userId,
                          @Param("permission") SharePermission permission, @Param("now") LocalDateTime now);
    
    @Query("SELECT CASE WHEN COUNT(ds) > 0 THEN true ELSE false END FROM DocumentShare ds " +
           "WHERE ds.document.id = :documentId AND ds.sharedWithUser.id = :userId " +
           "AND ds.active = true AND (ds.expiresAt IS NULL OR ds.expiresAt > :now) " +
           "AND (ds.permission = com.test.model.SharePermission.READ_WRITE OR ds.permission = com.test.model.SharePermission.ADMIN)")
    boolean hasWritePermission(@Param("documentId") Long documentId, @Param("userId") Long userId,
                               @Param("now") LocalDateTime now);
    
    @Query("SELECT CASE WHEN COUNT(ds) > 0 THEN true ELSE false END FROM DocumentShare ds " +
           "WHERE ds.document.id = :documentId AND ds.sharedWithUser.id = :userId " +
           "AND ds.active = true AND (ds.expiresAt IS NULL OR ds.expiresAt > :now) " +
           "AND ds.permission = com.test.model.SharePermission.ADMIN")
    boolean hasAdminPermission(@Param("documentId") Long documentId, @Param("userId") Long userId,
                               @Param("now") LocalDateTime now);
}
