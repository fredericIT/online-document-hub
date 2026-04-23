package com.test.service;

import com.test.model.Document;
import com.test.model.User;
import com.test.repository.DocumentRepository;
import com.test.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public Document uploadDocument(MultipartFile file, String title, String description, User owner) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Document document = Document.builder()
                .title(title)
                .description(description)
                .fileName(fileName)
                .originalFileName(originalFileName)
                .filePath(filePath.toString())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .owner(owner)
                .uploadedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

            Document saved = documentRepository.save(document);

            // Notify all other users about the new document
            List<User> allUsers = userRepository.findAll();
            for (User user : allUsers) {
                if (!user.getId().equals(owner.getId())) {
                    notificationService.createNotification(
                        user,
                        "NEW_DOCUMENT",
                        "New document '" + title + "' was uploaded by " + owner.getUsername(),
                        "/documents/" + saved.getId()
                    );
                }
            }

            return saved;
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

        if (documentDetails.getFileName() != null &&
            !document.getFileName().equals(documentDetails.getFileName()) &&
            documentRepository.existsByFileName(documentDetails.getFileName())) {
            throw new RuntimeException("File name already exists");
        }

        if (documentDetails.getTitle() != null) document.setTitle(documentDetails.getTitle());
        if (documentDetails.getDescription() != null) document.setDescription(documentDetails.getDescription());
        if (documentDetails.getFileName() != null) document.setFileName(documentDetails.getFileName());
        if (documentDetails.getOriginalFileName() != null) document.setOriginalFileName(documentDetails.getOriginalFileName());
        if (documentDetails.getFilePath() != null) document.setFilePath(documentDetails.getFilePath());
        if (documentDetails.getContentType() != null) document.setContentType(documentDetails.getContentType());
        if (documentDetails.getFileSize() != null) document.setFileSize(documentDetails.getFileSize());
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
