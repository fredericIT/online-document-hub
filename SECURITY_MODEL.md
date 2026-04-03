# Online Document Hub: Security Model

The Online Document Hub employs a robust, industry-standard security architecture designed to protect user data, ensure privacy, and provide granular access control. This document explains the core components of our security model.

## 1. Authentication Component

### JSON Web Tokens (JWT)
Our system uses **JWT** for stateless authentication. Unlike traditional session-based systems, JWTs allow the backend to remain stateless, improving scalability.
- **Generation**: Upon successful login, the server generates a signed JWT containing the user's identity.
- **Storage**: The token is stored securely in the client's `localStorage` (or `cookie`).
- **Validation**: Every request to a protected endpoint includes the token in the `Authorization: Bearer <token>` header. The server verifies the signature before processing the request.

### Password Security
- **Hashing**: We never store plain-text passwords. We use **BCrypt**, a strong adaptive hashing algorithm that incorporates a unique salt for every password, protecting against rainbow table and brute-force attacks.
- **Validation**: Passwords must meet complexity requirements (minimum length, uppercase, lowercase, numbers, and special characters).

---

## 2. Authorization & RBAC

The system implements **Role-Based Access Control (RBAC)** to manage permissions.

### Roles
- `ROLE_USER`: Standard access to personal documents, chat, and profile.
- `ROLE_ADMIN`: Full administrative access, including user management, system settings, and audit logs.

### Backend Enforcement
We use **Spring Security Method Security** (`@PreAuthorize`) to protect sensitive service methods and controller endpoints.
```java
@PreAuthorize("hasRole('ADMIN')")
public List<User> getAllUsers() { ... }
```

### Frontend Enforcement
The React frontend uses a higher-order component (`PrivateRoute`) to guard routes based on the authenticated user's roles.
- **Example**: Accessing `/admin` requires `ROLE_ADMIN`. Users without this role are redirected to an "Unauthorized" page.

---

## 3. Account Protection Flow

### Email Verification
New accounts are created with `enabled = false`. A 6-digit verification code is sent to the user's email. The account is only activated once the user provides the correct code.

### Password Recovery
A secure, time-limited `resetToken` is generated when a user forgets their password. This token is sent via email and allows the user to set a new password exactly once.

---

## 4. Technical Safeguards

- **CORS Configuration**: Cross-Origin Resource Sharing is strictly configured to allow requests only from trusted frontend domains.
- **CSRF Protection**: While JWT-based systems are inherently resistant to CSRF when tokens aren't stored in cookies, we ensure all state-changing operations are protected.
- **Secure File Storage**: Uploaded documents and avatars are stored with randomized filenames to prevent directory traversal and direct access vulnerabilities.
