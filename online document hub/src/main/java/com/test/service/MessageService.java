package com.test.service;

import com.test.model.Message;
import com.test.model.User;
import com.test.repository.MessageRepository;
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
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final NotificationService notificationService;
    
    @Value("${app.upload.dir}/messages")
    private String messageUploadDir;
    
    public Message sendMessage(User sender, User recipient, String content, MultipartFile attachment) {
        Message message = Message.builder()
            .sender(sender)
            .recipient(recipient)
            .content(content)
            .sentAt(LocalDateTime.now())
            .build();
            
        if (attachment != null && !attachment.isEmpty()) {
            try {
                Path uploadPath = Paths.get(messageUploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                String originalName = attachment.getOriginalFilename();
                String fileName = UUID.randomUUID().toString() + "_" + originalName;
                Path filePath = uploadPath.resolve(fileName);
                
                Files.copy(attachment.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                message.setFileName(originalName);
                message.setFilePath(filePath.toString());
                message.setFileType(attachment.getContentType());
                message.setFileSize(attachment.getSize());
            } catch (IOException e) {
                throw new RuntimeException("Could not store message attachment", e);
            }
        }
        
        Message saved = messageRepository.save(message);
        
        // Notify recipient
        notificationService.createNotification(
            recipient, 
            "NEW_MESSAGE", 
            "New message from " + sender.getUsername(), 
            "/chat?user=" + sender.getId()
        );
        
        return saved;
    }
    
    public List<Message> getConversation(Long user1Id, Long user2Id) {
        return messageRepository.findConversation(user1Id, user2Id);
    }
    
    public void markConversationAsRead(User recipient, User sender) {
        List<Message> unread = messageRepository.findConversation(recipient.getId(), sender.getId())
            .stream()
            .filter(m -> m.getRecipient().getId().equals(recipient.getId()) && !m.getIsRead())
            .toList();
        
        unread.forEach(m -> m.setIsRead(true));
        messageRepository.saveAll(unread);
    }
    public java.util.Optional<Message> getMessageById(Long id) {
        return messageRepository.findById(id);
    }
}

