package com.test.controller;

import com.test.model.SystemConfig;
import com.test.repository.SystemConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminSettingsController {
    
    private final SystemConfigRepository systemConfigRepository;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SystemConfig>> getAllConfigs() {
        return ResponseEntity.ok(systemConfigRepository.findAll());
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemConfig> updateConfig(@PathVariable Long id, @RequestBody SystemConfig details) {
        SystemConfig config = systemConfigRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Config not found"));
        
        config.setConfigValue(details.getConfigValue());
        if (details.getDescription() != null) {
            config.setDescription(details.getDescription());
        }
        
        return ResponseEntity.ok(systemConfigRepository.save(config));
    }
}
