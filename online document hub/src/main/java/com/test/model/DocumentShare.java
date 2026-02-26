package com.test.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "document_shares")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentShare {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_user_id", nullable = false)
    private User sharedWithUser;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_by_user_id", nullable = false)
    private User sharedBy;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SharePermission permission;
    
    @Column(nullable = false)
    private LocalDateTime sharedAt;
    
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @PrePersist
    protected void onCreate() {
        sharedAt = LocalDateTime.now();
    }
    
    public enum SharePermission {
        READ_ONLY,
        READ_WRITE,
        ADMIN
    }
}
