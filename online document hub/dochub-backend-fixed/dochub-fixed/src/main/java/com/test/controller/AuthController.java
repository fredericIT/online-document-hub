package com.test.controller;

import com.test.config.JwtTokenProvider;
import com.test.dto.ErrorResponse;
import com.test.dto.UserResponse;
import com.test.model.User;
import com.test.service.FileStorageService;
import com.test.service.UserService;
import com.test.service.EmailService;
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
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final EmailService emailService;
    private final FileStorageService fileStorageService;

    // ── LOGIN ─────────────────────────────────────────────────────────────────

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

    // ── REGISTER (JSON — no avatar) ───────────────────────────────────────────

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerUserJson(@Valid @RequestBody RegisterRequest registerRequest) {
        return doRegister(registerRequest, null);
    }

    // ── REGISTER (multipart — with optional avatar) ───────────────────────────

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUserMultipart(
            @RequestPart("userData") @Valid RegisterRequest registerRequest,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        return doRegister(registerRequest, avatar);
    }

    private ResponseEntity<?> doRegister(RegisterRequest registerRequest, MultipartFile avatar) {
        try {
            if (userService.getUserByUsername(registerRequest.getUsername()).isPresent()) {
                ErrorResponse err = buildError(HttpStatus.CONFLICT, "Username is already taken");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
            }
            if (userService.getUserByEmail(registerRequest.getEmail()).isPresent()) {
                ErrorResponse err = buildError(HttpStatus.CONFLICT, "Email is already in use");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
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
                .build();

            User createdUser = userService.createUser(user, registerRequest.getRoles());

            // Send verification email (non-blocking — EmailService swallows SMTP errors)
            emailService.sendVerificationEmail(createdUser.getEmail(), createdUser.getVerificationToken());

            return ResponseEntity.status(HttpStatus.CREATED).body(convertToUserResponse(createdUser));
        } catch (RuntimeException e) {
            // Expose validation errors (email format, weak password, etc.) to the client
            log.error("Registration failed for user: {}", registerRequest.getUsername(), e);
            ErrorResponse err = buildError(HttpStatus.BAD_REQUEST, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        } catch (Exception e) {
            log.error("Unexpected registration error for user: {}", registerRequest.getUsername(), e);
            ErrorResponse err = buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Registration failed. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    // ── EMAIL VERIFICATION ────────────────────────────────────────────────────

    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam("token") String token) {
        boolean verified = userService.verifyUser(token);
        if (verified) {
            return ResponseEntity.ok(Map.of("message", "Email verified successfully. You can now login."));
        }
        ErrorResponse err = buildError(HttpStatus.BAD_REQUEST, "Invalid or expired verification token");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }

    // ── HEARTBEAT ─────────────────────────────────────────────────────────────

    @PostMapping("/heartbeat")
    public ResponseEntity<?> heartbeat(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            userService.updateLastSeen(authentication.getName());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // ── AVATAR UPLOAD ─────────────────────────────────────────────────────────

    @PostMapping(value = "/upload-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file,
                                          Authentication authentication) {
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

    // ── FORGOT / RESET PASSWORD ───────────────────────────────────────────────

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody com.test.dto.ForgotPasswordRequest request) {
        try {
            String token = userService.createPasswordResetToken(request.getEmail());
            emailService.sendResetPasswordEmail(request.getEmail(), token);
        } catch (Exception e) {
            log.error("Forgot password request failed for email: {}", request.getEmail(), e);
            // Intentionally swallow — prevent email enumeration
        }
        // Always return the same message regardless of whether the email exists
        return ResponseEntity.ok(Map.of("message",
            "If an account exists with this email, a reset link will be sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody com.test.dto.ResetPasswordRequest request) {
        try {
            userService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password has been successfully reset."));
        } catch (Exception e) {
            log.error("Password reset failed", e);
            ErrorResponse err = buildError(HttpStatus.BAD_REQUEST, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }
    }

    // ── HELPERS ───────────────────────────────────────────────────────────────

    private ErrorResponse buildError(HttpStatus status, String message) {
        ErrorResponse err = new ErrorResponse();
        err.setStatus(status.value());
        err.setMessage(message);
        err.setTimestamp(System.currentTimeMillis());
        return err;
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

    // ── INNER REQUEST CLASSES ─────────────────────────────────────────────────

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
        private Set<String> roles;
        public String getUsername() { return username; }
        public void setUsername(String u) { this.username = u; }
        public String getEmail() { return email; }
        public void setEmail(String e) { this.email = e; }
        public String getPassword() { return password; }
        public void setPassword(String p) { this.password = p; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String f) { this.firstName = f; }
        public String getLastName() { return lastName; }
        public void setLastName(String l) { this.lastName = l; }
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> r) { this.roles = r; }
    }
}
