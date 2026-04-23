package com.test.controller;

import com.test.model.User;
import com.test.dto.UserResponse;
import com.test.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final com.test.service.AuditLogService auditLogService;
    private final com.test.service.NotificationService notificationService;
    private final com.test.service.EmailService emailService;

    private String getClientIp(jakarta.servlet.http.HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreationRequest request,
                                         jakarta.servlet.http.HttpServletRequest httpRequest,
                                         org.springframework.security.core.Authentication authentication) {
        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .passwordHash(request.getPassword())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .enabled(true)
            .build();
        
        User createdUser = userService.createUserByAdmin(user, request.getRoles());
        
        notificationService.createNotification(
            createdUser,
            "ACCOUNT_CREATED",
            "🎉 Welcome! Your account has been created by an administrator.",
            null
        );
        
        auditLogService.log("CREATE_USER", authentication.getName(), "Created user: " + request.getUsername(), getClientIp(httpRequest));
        
        return new ResponseEntity<>(convertToResponse(createdUser), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userService.getUserById(#id).get().username == authentication.name")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                  .map(u -> ResponseEntity.ok(convertToResponse(u)))
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.name")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username)
                  .map(u -> ResponseEntity.ok(convertToResponse(u)))
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                  .map(u -> ResponseEntity.ok(convertToResponse(u)))
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers().stream()
            .map(this::convertToResponse)
            .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userService.getUserById(#id).get().username == authentication.name")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        User userDetails = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .passwordHash(request.getPassword())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .build();
        
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(convertToResponse(updatedUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id,
                                         jakarta.servlet.http.HttpServletRequest httpRequest,
                                         org.springframework.security.core.Authentication authentication) {
        // Get user info before deletion for audit log
        userService.getUserById(id).ifPresent(targetUser -> {
            // Notify user via Email before deletion
            emailService.sendAccountDeletedEmail(targetUser.getEmail());

            // Note: notification is not sent as user is being deleted
            auditLogService.log(
                "DELETE_USER",
                authentication.getName(),
                "Deleted user: " + targetUser.getUsername() + " (ID: " + id + ")",
                getClientIp(httpRequest)
            );
        });
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> enableUser(@PathVariable Long id,
                                         jakarta.servlet.http.HttpServletRequest httpRequest,
                                         org.springframework.security.core.Authentication authentication) {
        User user = userService.enableUser(id);
        
        notificationService.createNotification(
            user,
            "ACCESS_GRANTED",
            "✅ Your account access has been granted by an administrator. You can now log in.",
            null
        );
        
        emailService.sendAccountEnabledEmail(user.getEmail());
        auditLogService.log("ENABLE_USER", authentication.getName(), "Enabled user: " + user.getUsername() + " (ID: " + id + ")", getClientIp(httpRequest));
        return ResponseEntity.ok(convertToResponse(user));
    }

    @PutMapping("/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> disableUser(@PathVariable Long id,
                                          jakarta.servlet.http.HttpServletRequest httpRequest,
                                          org.springframework.security.core.Authentication authentication) {
        User user = userService.disableUser(id);
        
        notificationService.createNotification(
            user,
            "ACCESS_REVOKED",
            "⚠️ Your account access has been revoked by an administrator. Please contact support for more information.",
            null
        );
        
        emailService.sendAccountDisabledEmail(user.getEmail());
        auditLogService.log("DISABLE_USER", authentication.getName(), "Disabled user: " + user.getUsername() + " (ID: " + id + ")", getClientIp(httpRequest));
        return ResponseEntity.ok(convertToResponse(user));
    }

    private UserResponse convertToResponse(User u) {
        UserResponse dto = new UserResponse();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setEmail(u.getEmail());
        dto.setFirstName(u.getFirstName());
        dto.setLastName(u.getLastName());
        dto.setEnabled(u.getEnabled());
        dto.setCreatedAt(u.getCreatedAt());
        dto.setUpdatedAt(u.getUpdatedAt());
        dto.setRoles(u.getRoles());
        dto.setLastSeen(u.getLastSeen());
        dto.setProfileImage(u.getProfileImage());
        return dto;
    }

    public static class UserCreationRequest {
        private String username;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private Set<String> roles;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }
    }

    public static class UserUpdateRequest {
        private String username;
        private String email;
        private String password;
        private String firstName;
        private String lastName;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
    }
}
