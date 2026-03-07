package com.test.service;

import com.test.model.Document;
import com.test.model.User;
import com.test.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public Document uploadDocument(MultipartFile file, String title, String description, User owner) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique file name to avoid collisions
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            // Save file to disk
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create document entity
            Document document = Document.builder()
                .title(title)
                .description(description)
                .fileName(fileName)
                .originalFileName(originalFileName)
                .filePath(filePath.toString())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .owner(owner)
                .build();

            return documentRepository.save(document);
        } catch (IOException e) {
            throw new RuntimeException("Could not store file. Error: " + e.getMessage());
        }
    }

    public Document createDocument(Document document, User owner) {
        if (documentRepository.existsByFileName(document.getFileName())) {
            throw new RuntimeException("File name already exists");
        }

        document.setOwner(owner);
        document.setUploadedAt(LocalDateTime.now());
        document.setUpdatedAt(LocalDateTime.now());

        return documentRepository.save(document);
    }

    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public List<Document> getDocumentsByOwner(User owner) {
        return documentRepository.findByOwner(owner);
    }

    public List<Document> getDocumentsByOwnerId(Long ownerId) {
        return documentRepository.findByOwnerId(ownerId);
    }

    public Document updateDocument(Long id, Document documentDetails) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!document.getFileName().equals(documentDetails.getFileName()) && 
            documentRepository.existsByFileName(documentDetails.getFileName())) {
            throw new RuntimeException("File name already exists");
        }

        document.setTitle(documentDetails.getTitle());
        document.setDescription(documentDetails.getDescription());
        document.setFileName(documentDetails.getFileName());
        document.setOriginalFileName(documentDetails.getOriginalFileName());
        document.setFilePath(documentDetails.getFilePath());
        document.setContentType(documentDetails.getContentType());
        document.setFileSize(documentDetails.getFileSize());
        document.setUpdatedAt(LocalDateTime.now());

        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        documentRepository.delete(document);
    }

    public List<Document> searchDocumentsByTitle(String title) {
        return documentRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Document> searchDocumentsByDescription(String description) {
        return documentRepository.findByDescriptionContainingIgnoreCase(description);
    }
}
