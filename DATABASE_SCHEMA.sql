-- Online Document Hub Database Schema
-- MySQL 8.0+ compatible

-- Create database
CREATE DATABASE IF NOT EXISTS online_document_hub;

-- Use the database
USE online_document_hub;

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL UNIQUE,
    original_file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    owner_id BIGINT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Document shares table
CREATE TABLE IF NOT EXISTS document_shares (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_id BIGINT NOT NULL,
    shared_with_user_id BIGINT NOT NULL,
    shared_by_user_id BIGINT NOT NULL,
    permission ENUM('READ_ONLY', 'READ_WRITE', 'ADMIN') NOT NULL,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_documents_owner_id ON documents(owner_id);
CREATE INDEX idx_documents_title ON documents(title);
CREATE INDEX idx_documents_file_name ON documents(file_name);
CREATE INDEX idx_document_shares_document_id ON document_shares(document_id);
CREATE INDEX idx_document_shares_shared_with_user_id ON document_shares(shared_with_user_id);
CREATE INDEX idx_document_shares_shared_by_user_id ON document_shares(shared_by_user_id);
CREATE INDEX idx_document_shares_active ON document_shares(active);
CREATE INDEX idx_document_shares_expires_at ON document_shares(expires_at);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('USER', 'Regular user with document access'),
('ADMIN', 'Administrator with full system access');

-- Sample data for testing
INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES 
('admin', 'admin@example.com', '$2a$10$dummy_hash_for_demo', 'Admin', 'User'),
('john_doe', 'john@example.com', '$2a$10$dummy_hash_for_demo', 'John', 'Doe');

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id) VALUES 
(1, (SELECT id FROM roles WHERE name = 'ADMIN')),
(2, (SELECT id FROM roles WHERE name = 'USER'));

-- Sample documents
INSERT INTO documents (title, description, file_name, original_file_name, file_path, content_type, file_size, owner_id) VALUES 
('Project Proposal', 'Q1 2024 project proposal document', 'project_proposal.pdf', 'Project Proposal.pdf', '/uploads/2024/project_proposal.pdf', 'application/pdf', 1024000, 1),
('Meeting Notes', 'Team meeting notes from March', 'meeting_notes.docx', 'Meeting Notes.docx', '/uploads/2024/meeting_notes.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 25600, 2),
('Budget Spreadsheet', 'Annual budget calculations', 'budget_2024.xlsx', 'Budget 2024.xlsx', '/uploads/2024/budget_2024.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 512000, 1);

-- Sample document shares
INSERT INTO document_shares (document_id, shared_with_user_id, shared_by_user_id, permission, expires_at) VALUES 
(1, 2, 1, 'READ_WRITE', DATE_ADD(NOW(), INTERVAL 30 DAY)),
(2, 1, 2, 'READ_ONLY', DATE_ADD(NOW(), INTERVAL 7 DAY)),
(3, 2, 1, 'ADMIN', DATE_ADD(NOW(), INTERVAL 60 DAY));

-- Views for common queries
CREATE VIEW user_documents AS
SELECT d.*, u.username as owner_username, u.first_name as owner_first_name, u.last_name as owner_last_name
FROM documents d
JOIN users u ON d.owner_id = u.id
WHERE u.enabled = TRUE;

CREATE VIEW shared_documents_view AS
SELECT 
    ds.id,
    ds.document_id,
    d.title as document_title,
    d.file_name,
    ds.shared_with_user_id,
    u.username as shared_with_username,
    u.first_name as shared_with_first_name,
    u.last_name as shared_with_last_name,
    ds.shared_by_user_id,
    owner.username as shared_by_username,
    owner.first_name as shared_by_first_name,
    owner.last_name as shared_by_last_name,
    ds.permission,
    ds.shared_at,
    ds.expires_at,
    ds.active
FROM document_shares ds
JOIN documents d ON ds.document_id = d.id
JOIN users u ON ds.shared_with_user_id = u.id
JOIN users owner ON ds.shared_by_user_id = owner.id
WHERE ds.active = TRUE AND (ds.expires_at IS NULL OR ds.expires_at > NOW());

-- Stored procedures for common operations
DELIMITER //

CREATE PROCEDURE GetDocumentsByUser(IN userId BIGINT)
BEGIN
    SELECT d.*, u.username as owner_username
    FROM documents d
    JOIN users u ON d.owner_id = u.id
    WHERE d.owner_id = userId
    ORDER BY d.uploaded_at DESC;
END //

CREATE PROCEDURE GetSharedDocumentsForUser(IN userId BIGINT)
BEGIN
    SELECT dv.*
    FROM shared_documents_view dv
    WHERE dv.shared_with_user_id = userId
    ORDER BY dv.shared_at DESC;
END //

CREATE PROCEDURE CheckDocumentAccess(IN documentId BIGINT, IN userId BIGINT, IN requiredPermission VARCHAR(20))
BEGIN
    DECLARE hasAccess BOOLEAN DEFAULT FALSE;
    
    -- Check if user is owner
    SELECT COUNT(*) INTO @ownerCount
    FROM documents d
    WHERE d.id = documentId AND d.owner_id = userId;
    
    IF @ownerCount > 0 THEN
        SET hasAccess = TRUE;
    ELSE
        -- Check shared access
        SELECT COUNT(*) INTO @shareCount
        FROM document_shares ds
        WHERE ds.document_id = documentId 
          AND ds.shared_with_user_id = userId 
          AND ds.active = TRUE 
          AND (ds.expires_at IS NULL OR ds.expires_at > NOW());
        
        IF @shareCount > 0 THEN
            -- Check permission level
            CASE requiredPermission
                WHEN 'READ_ONLY' THEN
                    SET hasAccess = (SELECT COUNT(*) > 0 FROM document_shares ds 
                                         WHERE ds.document_id = documentId 
                                           AND ds.shared_with_user_id = userId 
                                           AND ds.permission IN ('READ_ONLY', 'READ_WRITE', 'ADMIN'));
                WHEN 'READ_WRITE' THEN
                    SET hasAccess = (SELECT COUNT(*) > 0 FROM document_shares ds 
                                         WHERE ds.document_id = documentId 
                                           AND ds.shared_with_user_id = userId 
                                           AND ds.permission IN ('READ_WRITE', 'ADMIN'));
                WHEN 'ADMIN' THEN
                    SET hasAccess = (SELECT COUNT(*) > 0 FROM document_shares ds 
                                         WHERE ds.document_id = documentId 
                                           AND ds.shared_with_user_id = userId 
                                           AND ds.permission = 'ADMIN');
            END CASE;
        END IF;
    END IF;
    
    SELECT hasAccess as access_granted;
END //

DELIMITER ;

-- Triggers for automatic timestamp updates
DELIMITER //

CREATE TRIGGER update_document_timestamp 
BEFORE UPDATE ON documents
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER update_user_timestamp 
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- Cleanup procedure for expired shares
CREATE PROCEDURE CleanupExpiredShares()
BEGIN
    UPDATE document_shares 
    SET active = FALSE 
    WHERE active = TRUE 
      AND expires_at IS NOT NULL 
      AND expires_at < NOW();
END //

DELIMITER ;
