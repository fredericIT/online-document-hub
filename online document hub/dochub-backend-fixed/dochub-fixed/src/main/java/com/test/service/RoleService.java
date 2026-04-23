package com.test.service;

import com.test.model.Role;
import com.test.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;

    public Role createRole(Role role) {
        if (roleRepository.findByName(role.getName()).isPresent()) {
            throw new RuntimeException("Role already exists");
        }
        return roleRepository.save(role);
    }

    public Optional<Role> getRoleById(Long id) {
        return roleRepository.findById(id);
    }

    public Optional<Role> getRoleByName(String name) {
        return roleRepository.findByName(name);
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role updateRole(Long id, Role roleDetails) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Role not found"));

        if (!role.getName().equals(roleDetails.getName()) && 
            roleRepository.findByName(roleDetails.getName()).isPresent()) {
            throw new RuntimeException("Role name already exists");
        }

        role.setName(roleDetails.getName());
        role.setDescription(roleDetails.getDescription());

        return roleRepository.save(role);
    }

    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Role not found"));
        roleRepository.delete(role);
    }

    public Role findOrCreateRole(String name, String description) {
        return roleRepository.findByName(name)
            .orElseGet(() -> {
                Role newRole = Role.builder()
                    .name(name)
                    .description(description)
                    .build();
                return roleRepository.save(newRole);
            });
    }
}
