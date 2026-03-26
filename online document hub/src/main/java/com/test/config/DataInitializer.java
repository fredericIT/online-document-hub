package com.test.config;

import com.test.model.Role;
import com.test.model.User;
import com.test.repository.RoleRepository;
import com.test.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Initialize Roles
        Role userRole = ensureRole("ROLE_USER", "Standard user role");
        Role adminRole = ensureRole("ROLE_ADMIN", "Administrator role with full access");

        // Initialize Super Admin User
        String username = "frederic";
        if (!userRepository.existsByUsername(username)) {
            User admin = User.builder()
                .username(username)
                .email("ntawukuriryayofrederic817@gmail.com")
                .passwordHash(passwordEncoder.encode("123"))
                .firstName("Frederic")
                .lastName("Admin")
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .roles(new HashSet<>(Arrays.asList(userRole, adminRole)))
                .build();
            
            userRepository.save(admin);
            System.out.println("Super admin user 'frederic' created successfully.");
        } else {
            // Update existing user to be admin if they aren't
            userRepository.findByUsername(username).ifPresent(user -> {
                boolean hasAdmin = user.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_ADMIN"));
                if (!hasAdmin) {
                    user.getRoles().add(adminRole);
                    user.setEnabled(true);
                    userRepository.save(user);
                    System.out.println("Existing user 'frederic' promoted to ROLE_ADMIN.");
                }
            });
        }
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
