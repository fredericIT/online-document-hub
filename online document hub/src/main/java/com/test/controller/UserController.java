package com.test.controller;

import com.test.model.User;
import com.test.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final com.test.service.AuditLogService auditLogService;

    private String getClientIp(jakarta.servlet.http.HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserCreationRequest request,
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
        
        User createdUser = userService.createUser(user, request.getRoles());
        
        auditLogService.log("CREATE_USER", authentication.getName(), "Created user: " + request.getUsername(), getClientIp(httpRequest));
        
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userService.getUserById(#id).get().username == authentication.name")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    @PreAuthorize("hasRole('ADMIN') or #username == authentication.name")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @userService.getUserById(#id).get().username == authentication.name")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        User userDetails = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .passwordHash(request.getPassword())
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .build();
        
        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id,
                                         jakarta.servlet.http.HttpServletRequest httpRequest,
                                         org.springframework.security.core.Authentication authentication) {
        userService.deleteUser(id);
        auditLogService.log("DELETE_USER", authentication.getName(), "Deleted user ID: " + id, getClientIp(httpRequest));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/enable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> enableUser(@PathVariable Long id,
                                         jakarta.servlet.http.HttpServletRequest httpRequest,
                                         org.springframework.security.core.Authentication authentication) {
        User user = userService.enableUser(id);
        auditLogService.log("ENABLE_USER", authentication.getName(), "Enabled user ID: " + id, getClientIp(httpRequest));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}/disable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> disableUser(@PathVariable Long id,
                                          jakarta.servlet.http.HttpServletRequest httpRequest,
                                          org.springframework.security.core.Authentication authentication) {
        User user = userService.disableUser(id);
        auditLogService.log("DISABLE_USER", authentication.getName(), "Disabled user ID: " + id, getClientIp(httpRequest));
        return ResponseEntity.ok(user);
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
