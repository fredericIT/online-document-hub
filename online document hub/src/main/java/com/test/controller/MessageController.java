package com.test.controller;

import com.test.dto.MessageResponse;
import com.test.model.Message;
import com.test.model.User;
import com.test.repository.UserRepository;
import com.test.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(
        @RequestParam("recipientId") Long recipientId,
        @RequestParam(value = "content", required = false) String content,
        @RequestParam(value = "file", required = false) MultipartFile file,
        Authentication authentication
    ) {
        User sender = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        Message message = messageService.sendMessage(sender, recipient, content, file);
        return ResponseEntity.ok(convertToDto(message));
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<MessageResponse>> getConversation(
        @PathVariable Long userId,
        Authentication authentication
    ) {
        User currentUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Message> conversation = messageService.getConversation(currentUser.getId(), userId);
        
        // Mark as read
        User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Other user not found"));
        messageService.markConversationAsRead(currentUser, otherUser);
        
        return ResponseEntity.ok(conversation.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList()));
    }

    @GetMapping("/attachment/{messageId}")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long messageId, Authentication authentication) {
        Message message = messageService.getMessageById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        User currentUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Security check: Only sender, recipient or admin can download
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ADMIN"));
                
        if (!isAdmin && !message.getSender().getId().equals(currentUser.getId()) && 
            !message.getRecipient().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (message.getFilePath() == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path file = Paths.get(message.getFilePath());
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = message.getFileType();
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + message.getFileName() + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    private MessageResponse convertToDto(Message m) {
        MessageResponse dto = new MessageResponse();
        dto.setId(m.getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderUsername(m.getSender().getUsername());
        dto.setRecipientId(m.getRecipient().getId());
        dto.setRecipientUsername(m.getRecipient().getUsername());
        dto.setContent(m.getContent());
        dto.setFileName(m.getFileName());
        dto.setFileType(m.getFileType());
        dto.setFileSize(m.getFileSize());
        dto.setIsRead(m.getIsRead());
        dto.setSentAt(m.getSentAt());
        return dto;
    }
}
