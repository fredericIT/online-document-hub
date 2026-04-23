package com.test.config;

import com.test.model.Role;
import com.test.model.User;
import com.test.repository.RoleRepository;
import com.test.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.primary.username:frederic}")
    private String primaryAdminUsername;

    @Value("${app.admin.primary.email:ntawukuriryayofrederic817@gmail.com}")
    private String primaryAdminEmail;

    @Value("${app.admin.primary.password:123}")
    private String primaryAdminPassword;

    @Value("${app.admin.standard.username:admin}")
    private String standardAdminUsername;

    @Value("${app.admin.standard.email:admin@documenthub.com}")
    private String standardAdminEmail;

    @Value("${app.admin.standard.password:admin}")
    private String standardAdminPassword;

    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Initialize Roles
        Role userRole = ensureRole("ROLE_USER", "Standard user role");
        Role adminRole = ensureRole("ROLE_ADMIN", "Administrator role with full access");

        // Initialize Super Admin User (Primary)
        ensureAdminUser(primaryAdminUsername, primaryAdminEmail, primaryAdminPassword, "Frederic", "Admin", adminRole, userRole);

        // Initialize Standard Admin User (Convention)
        ensureAdminUser(standardAdminUsername, standardAdminEmail, standardAdminPassword, "System", "Administrator", adminRole, userRole);
    }

    private void ensureAdminUser(String username, String email, String password, String firstName, String lastName, Role adminRole, Role userRole) {
        userRepository.findByUsername(username).ifPresentOrElse(user -> {
            // Update existing user to ensure admin roles and known password
            user.setPasswordHash(passwordEncoder.encode(password));
            user.getRoles().add(adminRole);
            user.getRoles().add(userRole);
            user.setEnabled(true);
            userRepository.save(user);
            System.out.println("Admin user '" + username + "' updated/verified (Password: " + password + ")");
        }, () -> {
            // Create new admin user
            User admin = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .firstName(firstName)
                .lastName(lastName)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .roles(new HashSet<>(Arrays.asList(userRole, adminRole)))
                .build();
            userRepository.save(admin);
            System.out.println("Admin user '" + username + "' created successfully (Password: " + password + ")");
        });
    }

    private Role ensureRole(String name, String description) {
        return roleRepository.findByName(name).orElseGet(() -> {
            Role role = Role.builder()
                .name(name)
                .description(description)
                .build();
            return roleRepository.save(role);
        });
    }
}
