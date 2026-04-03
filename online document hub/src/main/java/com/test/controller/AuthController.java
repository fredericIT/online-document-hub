package com.test.controller;

import com.test.config.JwtTokenProvider;
import com.test.dto.ErrorResponse;
import com.test.dto.UserResponse;
import com.test.model.User;
import com.test.service.FileStorageService;
import com.test.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final com.test.service.EmailService emailService;
    private final FileStorageService fileStorageService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(loginRequest.getUsername());

            User user = userService.getUserByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("type", "Bearer");
            response.put("user", convertToUserResponse(user));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed for user: {}", loginRequest.getUsername(), e);
            ErrorResponse errorResponse = new ErrorResponse();
            errorResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            errorResponse.setMessage("Invalid username or password");
            errorResponse.setTimestamp(System.currentTimeMillis());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUser(
            @RequestPart("userData") @Valid RegisterRequest registerRequest,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        try {
            if (userService.getUserByUsername(registerRequest.getUsername()).isPresent()) {
                ErrorResponse errorResponse = new ErrorResponse();
                errorResponse.setStatus(HttpStatus.CONFLICT.value());
                errorResponse.setMessage("Username is already taken");
                errorResponse.setTimestamp(System.currentTimeMillis());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            if (userService.getUserByEmail(registerRequest.getEmail()).isPresent()) {
                ErrorResponse errorResponse = new ErrorResponse();
                errorResponse.setStatus(HttpStatus.CONFLICT.value());
                errorResponse.setMessage("Email is already in use");
                errorResponse.setTimestamp(System.currentTimeMillis());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            String avatarFileName = null;
            if (avatar != null && !avatar.isEmpty()) {
                avatarFileName = fileStorageService.storeFile(avatar);
            }

            User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .passwordHash(registerRequest.getPassword())
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .profileImage(avatarFileName)
                .enabled(false)
                .build();

            User createdUser = userService.createUser(user, registerRequest.getRoles());
            
            // Send verification email
            emailService.sendVerificationEmail(createdUser.getEmail(), createdUser.getVerificationToken());
            
            UserResponse userResponse = convertToUserResponse(createdUser);

            return ResponseEntity.status(HttpStatus.CREATED).body(userResponse);
        } catch (Exception e) {
            log.error("Registration failed for user: {}", registerRequest.getUsername(), e);
            ErrorResponse errorResponse = new ErrorResponse();
            errorResponse.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            errorResponse.setMessage("Registration failed. Please try again.");
            errorResponse.setTimestamp(System.currentTimeMillis());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam("token") String token) {
        boolean verified = userService.verifyUser(token);
        if (verified) {
            return ResponseEntity.ok(Map.of("message", "Email verified successfully. You can now login."));
        } else {
            ErrorResponse errorResponse = new ErrorResponse();
            errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
            errorResponse.setMessage("Invalid or expired verification token");
            errorResponse.setTimestamp(System.currentTimeMillis());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/heartbeat")
    public ResponseEntity<?> heartbeat(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            userService.updateLastSeen(authentication.getName());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping(value = "/upload-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String fileName = fileStorageService.storeFile(file);
            User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setProfileImage(fileName);
            userService.updateUser(user.getId(), user);

            return ResponseEntity.ok(convertToUserResponse(user));
        } catch (Exception e) {
            log.error("Avatar upload failed for user: {}", authentication.getName(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to upload avatar: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody com.test.dto.ForgotPasswordRequest request) {
        try {
            String token = userService.createPasswordResetToken(request.getEmail());
            emailService.sendResetPasswordEmail(request.getEmail(), token);
            return ResponseEntity.ok(Map.of("message", "Password reset link has been sent to your email."));
        } catch (Exception e) {
            log.error("Forgot password request failed for email: {}", request.getEmail(), e);
            // We return OK even if user not found to prevent email enumeration (standard security practice)
            return ResponseEntity.ok(Map.of("message", "If an account exists with this email, a reset link will be sent."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody com.test.dto.ResetPasswordRequest request) {
        try {
            userService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password has been successfully reset."));
        } catch (Exception e) {
            log.error("Password reset failed", e);
            ErrorResponse errorResponse = new ErrorResponse();
            errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
            errorResponse.setMessage(e.getMessage());
            errorResponse.setTimestamp(System.currentTimeMillis());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEnabled(user.getEnabled());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        response.setRoles(user.getRoles());
        response.setLastSeen(user.getLastSeen());
        if (user.getProfileImage() != null) {
            response.setProfileImage("/api/files/avatars/" + user.getProfileImage());
        }
        return response;
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String firstName;
        private String lastName;
        private java.util.Set<String> roles;

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
        public java.util.Set<String> getRoles() { return roles; }
        public void setRoles(java.util.Set<String> roles) { this.roles = roles; }
    }
}
