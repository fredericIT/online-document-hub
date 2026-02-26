package com.test.repository;

import com.test.model.DocumentShare;
import com.test.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentShareRepository extends JpaRepository<DocumentShare, Long> {
    List<DocumentShare> findBySharedWithUser(User user);
    List<DocumentShare> findBySharedWithUserId(Long userId);
    List<DocumentShare> findByDocumentId(Long documentId);
}
