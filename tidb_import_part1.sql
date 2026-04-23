-- =============================================
-- TiDB Cloud Compatible SQL Import - Part 1
-- Schema + Data for: roles, users, user_roles,
-- audit_logs, documents, document_shares,
-- email_verification_token
-- =============================================

CREATE DATABASE IF NOT EXISTS online_document_hub;
USE online_document_hub;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

-- --------------------------------------------------------
-- Table: roles (must be created before users due to FK)
-- --------------------------------------------------------
CREATE TABLE `roles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'USER', 'Regular user with document access', '2026-03-07 15:30:57', '2026-03-07 15:30:57'),
(2, 'ADMIN', 'Administrator with full system access', '2026-03-07 15:30:57', '2026-03-07 15:30:57'),
(9, 'ROLE_USER', 'Standard User Role', '2026-03-07 17:44:24', '2026-03-07 17:44:24'),
(10, 'ROLE_ADMIN', 'Administrator Role', '2026-03-07 17:44:24', '2026-03-07 17:44:24');

ALTER TABLE `roles` AUTO_INCREMENT = 11;

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `enabled` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `verification_token` VARCHAR(255) DEFAULT NULL,
  `last_seen` DATETIME(6) DEFAULT NULL,
  `profile_image` VARCHAR(255) DEFAULT NULL,
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expiry` DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_username` (`username`),
  KEY `idx_users_email` (`email`)
) DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `first_name`, `last_name`, `enabled`, `created_at`, `updated_at`, `verification_token`, `last_seen`, `profile_image`, `reset_token`, `reset_token_expiry`) VALUES
(1, 'admin', 'admin@example.com', '$2a$10$VvXCwpfS4Zt0BKaF31wi6.r6u.YK/XvXErBtSAo67b/CMlzfGKXaq', 'Admin', 'User', 1, '2026-03-07 15:30:57', '2026-04-23 07:03:39', NULL, '2026-04-23 05:51:39.000000', NULL, NULL, NULL),
(18, 'new', 'ntawukuriryayofrederic124@gmail.com', '$2a$10$u.0o4BUCIIm270yLQOsbjOvCxe2pTEDiWML4BBtPYXMTa7HfQuz0G', 'vaz', 'N', 1, '2026-03-22 10:04:06', '2026-03-26 15:07:37', NULL, NULL, NULL, NULL, NULL),
(28, 'manzi', 'gilberto250k@gmail.com', '$2a$10$uUpK0VD7tgkbP1t3ZN79JugYpNYNnw7HpxN133TEUyN2xlL0gWi7a', 'gilbert', 'mugisha', 1, '2026-03-26 08:05:17', '2026-04-09 14:05:05', NULL, '2026-04-09 14:05:05.000000', NULL, NULL, NULL),
(29, 'frederic', 'ntawukuriryayofrederic817@gmail.com', '$2a$10$F6sK0Hry2vqYwFRjzdXlCOc6lLGV/Upl5biJKQumbhBUvmBzC9t.O', 'Ntawukurirya Updatedyo', 'frederic', 1, '2026-03-26 13:08:01', '2026-04-23 10:58:01', NULL, '2026-04-23 10:58:01.000000', '50ff30ca-3977-4345-a589-165aafbd4d60.png', NULL, NULL),
(30, 'vaz', 'vazelodie096@gmail.com', '$2a$10$Oe/Z9oUCloIq3dFLc9baZuSSEUNV5X3iUw6BiVbk/V7aPNnp0pPva', 'vaz', 'elodie', 1, '2026-03-26 15:01:32', '2026-04-09 17:06:42', '339728', '2026-04-09 17:06:42.000000', NULL, NULL, NULL),
(31, 'shimo', 'shimoclaudine2@gmail.com', '$2a$10$HBExsJvz2awMPiQVyc1R5uSWNiPv.vePnn8PUzeGvBLKJB2R/VJ.K', 'Shimo', 'Claudine', 0, '2026-03-26 15:14:47', '2026-03-27 08:10:43', '404435', NULL, NULL, NULL, NULL),
(32, 'fixtestuser', 'fixtest@gmail.com', '$2a$10$JA7xjlk/K7pOIpxdQmP2OO.M6lwFE2.yYtstAVC1tvoKfm1FENIDK', 'Fix', 'Test', 0, '2026-03-26 15:20:42', '2026-03-26 19:34:08', '622179', NULL, NULL, NULL, NULL),
(33, 'eko', 'ekomisiyoneri@gmail.com', '$2a$10$klfnzwPkmjc6RSwNoSBTwuDrhSUFWZeBg7AEurwDDo2qbjjXo5MGO', 'eko', 'misiyoneri', 1, '2026-03-26 17:27:07', '2026-03-27 10:13:47', NULL, '2026-03-27 10:13:47.000000', 'a18748ec-7022-4681-aaed-5a7d9175e127.jpeg', NULL, NULL),
(35, 'naryame', 'josenarame111@gmail.com', '$2a$10$jcKd0YotFXulA5C5AfHHyeXNPI6cLAx8HnMYzQjbM7tY70GWOciAO', 'narameee', 'j00ose', 1, '2026-03-27 08:31:22', '2026-04-08 20:47:14', NULL, '2026-03-27 11:21:44.000000', '082c309a-dc7a-4df3-ab7f-3a4230dd2b3a.jpeg', '4b8677e0-9c9d-4160-9044-55befcafae97', '2026-04-03 20:54:38.000000'),
(37, 'betty', 'bettyakimana462@gmail.com', '$2a$10$fn0hQtoGO6MCA16O9TfOtOwLcvKqGKCpC6b7sfCsJz/LaDLR/Umgm', 'betty', 'akimana', 1, '2026-04-03 17:18:20', '2026-04-23 08:00:30', NULL, '2026-04-23 08:00:30.000000', NULL, '29f89d42-1068-4f47-99be-37de2749f38b', '2026-04-03 20:20:45.000000'),
(38, 'jose', 'josenarame@gmail.com', '$2a$10$UNU6Xi9VQ5C.KISvy1rAieaBs10yHG4UE/nOCTKSVVBcyGfmci/wC', 'narame', 'jose', 1, '2026-04-08 18:49:20', '2026-04-23 08:04:57', NULL, '2026-04-23 08:04:57.000000', NULL, NULL, NULL),
(39, 'melanie', 'nyimelanie829@gmail.com', '$2a$10$0FJ95Vh6MG4SzqFvh6tdwO/6Pkm9tb0uZGWUjRxwg3jaIaWY3UnYS', 'nyirabacumbitsi', 'melanie', 1, '2026-04-16 09:31:26', '2026-04-16 11:43:59', NULL, '2026-04-16 11:41:36.000000', '3a56d3ab-3fbe-478f-b713-97ad6026c960.jpeg', NULL, NULL),
(40, 'olivier', 'holivies@gmail.com', '$2a$10$iKZXNka6Hmseg1fp.8o4bexXH3WanJT96rCiZsxfjxGSDnboi3w1S', 'xcvbhj', 'sdfghjk', 1, '2026-04-23 06:24:37', '2026-04-23 10:58:00', NULL, '2026-04-23 10:58:00.000000', NULL, NULL, NULL);

ALTER TABLE `users` AUTO_INCREMENT = 41;

-- --------------------------------------------------------
-- Table: user_roles
-- --------------------------------------------------------
CREATE TABLE `user_roles` (
  `user_id` BIGINT NOT NULL,
  `role_id` BIGINT NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 9),
(1, 10),
(29, 2),
(29, 9),
(29, 10),
(37, 1),
(38, 1),
(39, 1),
(40, 1);

-- --------------------------------------------------------
-- Table: audit_logs
-- --------------------------------------------------------
CREATE TABLE `audit_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `action` VARCHAR(255) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(255) NOT NULL,
  `timestamp` DATETIME(6) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARSET=utf8mb4;

INSERT INTO `audit_logs` (`id`, `action`, `details`, `ip_address`, `timestamp`, `username`) VALUES
(1, 'UPLOAD_DOCUMENT', 'Uploaded file: Linux System Administration Exam s muhammad(1).docx', '127.0.0.1', '2026-03-26 10:08:46.000000', 'manzi'),
(2, 'UPLOAD_DOCUMENT', 'Uploaded file: administer Linux system .pdf', '0:0:0:0:0:0:0:1', '2026-03-26 16:56:36.000000', 'frederic'),
(3, 'DISABLE_USER', 'Disabled user: eko (ID: 33)', '127.0.0.1', '2026-03-26 19:31:47.000000', 'frederic'),
(4, 'ENABLE_USER', 'Enabled user: eko (ID: 33)', '127.0.0.1', '2026-03-26 19:34:04.000000', 'frederic'),
(5, 'ENABLE_USER', 'Enabled user: fixtestuser (ID: 32)', '127.0.0.1', '2026-03-26 19:34:07.000000', 'frederic'),
(6, 'DISABLE_USER', 'Disabled user: fixtestuser (ID: 32)', '127.0.0.1', '2026-03-26 19:34:08.000000', 'frederic'),
(7, 'DISABLE_USER', 'Disabled user: eko (ID: 33)', '127.0.0.1', '2026-03-26 19:38:10.000000', 'frederic'),
(8, 'DISABLE_USER', 'Disabled user: eko (ID: 33)', '127.0.0.1', '2026-03-26 19:38:12.000000', 'frederic'),
(9, 'DISABLE_USER', 'Disabled user: eko (ID: 33)', '127.0.0.1', '2026-03-26 19:38:12.000000', 'frederic'),
(10, 'ENABLE_USER', 'Enabled user: eko (ID: 33)', '127.0.0.1', '2026-03-26 19:39:16.000000', 'frederic'),
(11, 'DISABLE_USER', 'Disabled user: narame (ID: 34)', '0:0:0:0:0:0:0:1', '2026-03-27 08:02:59.000000', 'frederic'),
(12, 'ENABLE_USER', 'Enabled user: narame (ID: 34)', '0:0:0:0:0:0:0:1', '2026-03-27 08:03:26.000000', 'frederic'),
(13, 'DISABLE_USER', 'Disabled user: manzi (ID: 28)', '127.0.0.1', '2026-03-27 08:06:16.000000', 'frederic'),
(14, 'ENABLE_USER', 'Enabled user: shimo (ID: 31)', '127.0.0.1', '2026-03-27 08:09:18.000000', 'frederic'),
(15, 'DISABLE_USER', 'Disabled user: shimo (ID: 31)', '127.0.0.1', '2026-03-27 08:10:47.000000', 'frederic'),
(16, 'ENABLE_USER', 'Enabled user: vaz (ID: 30)', '0:0:0:0:0:0:0:1', '2026-03-27 08:37:32.000000', 'frederic'),
(17, 'DISABLE_USER', 'Disabled user: vaz (ID: 30)', '0:0:0:0:0:0:0:1', '2026-03-27 08:37:46.000000', 'frederic'),
(18, 'DISABLE_USER', 'Disabled user: narame (ID: 34)', '127.0.0.1', '2026-03-27 09:11:49.000000', 'frederic'),
(19, 'ENABLE_USER', 'Enabled user: narame (ID: 34)', '127.0.0.1', '2026-03-27 09:12:49.000000', 'frederic'),
(20, 'DISABLE_USER', 'Disabled user: narame (ID: 34)', '0:0:0:0:0:0:0:1', '2026-03-27 10:27:40.000000', 'frederic'),
(21, 'DELETE_USER', 'Deleted user: narame (ID: 34)', '0:0:0:0:0:0:0:1', '2026-03-27 10:29:00.000000', 'frederic'),
(22, 'UPLOAD_DOCUMENT', 'Uploaded file: Untitled 1.odt', '0:0:0:0:0:0:0:1', '2026-04-03 19:32:21.000000', 'betty'),
(23, 'UPLOAD_DOCUMENT', 'Uploaded file: Hospitality Admin123.txt', '0:0:0:0:0:0:0:1', '2026-04-03 19:32:51.000000', 'betty'),
(24, 'ENABLE_USER', 'Enabled user: manzi (ID: 28)', '0:0:0:0:0:0:0:1', '2026-04-03 19:56:53.000000', 'frederic'),
(25, 'ENABLE_USER', 'Enabled user: vaz (ID: 30)', '0:0:0:0:0:0:0:1', '2026-04-09 14:21:34.000000', 'frederic'),
(26, 'UPLOAD_DOCUMENT', 'Uploaded file: DOC-20260219-WA0101..pptx', '0:0:0:0:0:0:0:1', '2026-04-10 11:50:14.000000', 'admin'),
(27, 'UPLOAD_DOCUMENT', 'Uploaded file: Questions and answers of the project .pdf', '0:0:0:0:0:0:0:1', '2026-04-10 11:51:51.000000', 'admin'),
(28, 'UPLOAD_DOCUMENT', 'Uploaded file: 14. Class Diagram.drawio.png', '0:0:0:0:0:0:0:1', '2026-04-10 12:06:20.000000', 'frederic'),
(29, 'DISABLE_USER', 'Disabled user: melanie (ID: 39)', '0:0:0:0:0:0:0:1', '2026-04-16 11:43:26.000000', 'frederic'),
(30, 'ENABLE_USER', 'Enabled user: melanie (ID: 39)', '0:0:0:0:0:0:0:1', '2026-04-16 11:44:02.000000', 'frederic');

ALTER TABLE `audit_logs` AUTO_INCREMENT = 31;

-- --------------------------------------------------------
-- Table: documents
-- --------------------------------------------------------
CREATE TABLE `documents` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `original_file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `content_type` VARCHAR(255) NOT NULL,
  `file_size` BIGINT NOT NULL,
  `uploaded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `owner_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `file_name` (`file_name`),
  KEY `idx_documents_owner_id` (`owner_id`),
  KEY `idx_documents_title` (`title`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;

INSERT INTO `documents` (`id`, `title`, `description`, `file_name`, `original_file_name`, `file_path`, `content_type`, `file_size`, `uploaded_at`, `updated_at`, `owner_id`) VALUES
(1, 'biology', 'book of biologys', '10d20793-260a-4285-bfea-9517a69de30c.docx', 'Linux System Administration Exam s muhammad(1).docx', 'uploads/10d20793-260a-4285-bfea-9517a69de30c.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 41282, '2026-03-26 08:08:46', '2026-03-27 08:31:40', 28),
(2, 'hhhh', 'ghjklkjhgfdsa', 'cbd11a65-e888-4e4e-a8ca-2fb0d34f71e0.pdf', 'administer Linux system .pdf', 'uploads/cbd11a65-e888-4e4e-a8ca-2fb0d34f71e0.pdf', 'application/pdf', 392874, '2026-03-26 14:56:36', '2026-03-26 14:56:36', 29),
(3, 'fghjkl', 'hjkl;', 'cf7bd6bc-bfc7-4e9d-af85-3e69ac437b7c.odt', 'Untitled 1.odt', 'uploads/cf7bd6bc-bfc7-4e9d-af85-3e69ac437b7c.odt', 'application/vnd.oasis.opendocument.text', 56351, '2026-04-03 17:32:21', '2026-04-03 17:32:21', 37),
(4, 'fghjkl', 'dfghjkl; efrtyujk', '528caa99-5984-4382-91ab-642048192f90.txt', 'Hospitality Admin123.txt', 'uploads/528caa99-5984-4382-91ab-642048192f90.txt', 'text/plain', 22, '2026-04-03 17:32:51', '2026-04-03 17:32:51', 37),
(5, 'handout', 'handout ', '100925a3-5e40-4193-86e5-0b23b242fed3.pptx', 'DOC-20260219-WA0101..pptx', 'uploads/100925a3-5e40-4193-86e5-0b23b242fed3.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 2218723, '2026-04-10 09:50:14', '2026-04-10 09:50:14', 1),
(6, 'note', 'notes', 'f138e6b9-b9a8-458c-a2ee-860a9c5aeea8.pdf', 'Questions and answers of the project .pdf', 'uploads/f138e6b9-b9a8-458c-a2ee-860a9c5aeea8.pdf', 'application/pdf', 52244, '2026-04-10 09:51:51', '2026-04-10 09:51:51', 1),
(7, 'yuh', 'yuh', 'a472add4-f1a2-4ef4-9cb7-595ca2694e2d.png', '14. Class Diagram.drawio.png', 'uploads/a472add4-f1a2-4ef4-9cb7-595ca2694e2d.png', 'image/png', 48393, '2026-04-10 10:06:20', '2026-04-10 10:06:20', 29);

ALTER TABLE `documents` AUTO_INCREMENT = 8;

-- NOTE: TiDB does NOT support triggers.
-- The 'update_document_timestamp' trigger is handled by
-- ON UPDATE CURRENT_TIMESTAMP in the column definition above.

-- --------------------------------------------------------
-- Table: document_shares
-- --------------------------------------------------------
CREATE TABLE `document_shares` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `document_id` BIGINT NOT NULL,
  `shared_with_user_id` BIGINT NOT NULL,
  `shared_by_user_id` BIGINT NOT NULL,
  `permission` ENUM('READ_ONLY','READ_WRITE','ADMIN') NOT NULL,
  `shared_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_document_shares_document_id` (`document_id`),
  KEY `idx_document_shares_shared_with_user_id` (`shared_with_user_id`),
  KEY `idx_document_shares_shared_by_user_id` (`shared_by_user_id`),
  KEY `idx_document_shares_active` (`active`),
  KEY `idx_document_shares_expires_at` (`expires_at`),
  CONSTRAINT `document_shares_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
  CONSTRAINT `document_shares_ibfk_2` FOREIGN KEY (`shared_with_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `document_shares_ibfk_3` FOREIGN KEY (`shared_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: email_verification_token
-- --------------------------------------------------------
CREATE TABLE `email_verification_token` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `expiry_date` DATETIME(6) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `user_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKidu2ippaks8bn6vcsq62khvdu` (`token`),
  UNIQUE KEY `UK1sxbwflvq4skafkocq315i9dt` (`user_id`),
  CONSTRAINT `FKknax5in7pcatm2uf9uyple35x` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table: system_configs
-- --------------------------------------------------------
CREATE TABLE `system_configs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `config_key` VARCHAR(255) NOT NULL,
  `config_value` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpk5mof051xp5r3e75s2e23s8s` (`config_key`)
) DEFAULT CHARSET=utf8mb4;

INSERT INTO `system_configs` (`id`, `config_key`, `config_value`, `description`) VALUES
(1, 'MAX_FILE_SIZE', '52428800', 'Maximum file upload size in bytes (50MB)'),
(2, 'ALLOWED_FILE_TYPES', 'pdf,doc,docx,txt,jpg,png', 'Allowed file extensions (comma-separated)'),
(3, 'MAINTENANCE_MODE', 'false', 'Disable system access for non-admin users');

ALTER TABLE `system_configs` AUTO_INCREMENT = 4;

-- Part 1 complete. Run Part 2 next for messages, notifications, and views.
