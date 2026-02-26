package com.test.repository;

import com.test.model.Document;
import com.test.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByOwner(User owner);
    List<Document> findByOwnerId(Long ownerId);
    boolean existsByFileName(String fileName);
}
