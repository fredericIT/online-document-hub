-- =============================================
-- TiDB Cloud Compatible SQL Import - Part 3
-- Notifications table + data
-- =============================================
USE online_document_hub;

CREATE TABLE `notifications` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  `is_read` BIT(1) NOT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `type` VARCHAR(255) NOT NULL,
  `user_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) DEFAULT CHARSET=utf8mb4;

INSERT INTO `notifications` (`id`, `content`, `created_at`, `is_read`, `link`, `type`, `user_id`) VALUES
(1, 'New message from frederic_new', '2026-03-26 08:44:44.000000', b'1', '/chat?user=18', 'NEW_MESSAGE', 1),
(2, 'New document \'biology\' was uploaded by manzi', '2026-03-26 10:08:46.000000', b'1', '/documents/1', 'NEW_DOCUMENT', 1),
(3, 'New document \'biology\' was uploaded by manzi', '2026-03-26 10:08:46.000000', b'0', '/documents/1', 'NEW_DOCUMENT', 18),
(4, 'New message from frederic', '2026-03-26 15:17:14.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 28),
(5, 'New message from frederic', '2026-03-26 15:20:40.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 28),
(6, 'New message from frederic', '2026-03-26 15:31:00.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 28),
(7, 'New message from frederic', '2026-03-26 15:31:23.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 28),
(8, 'New message from frederic', '2026-03-26 15:33:06.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 1),
(9, 'New message from frederic', '2026-03-26 15:39:33.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 28),
(10, 'New message from frederic', '2026-03-26 15:40:57.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 28),
(11, 'New message from frederic', '2026-03-26 15:41:04.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 28),
(12, 'New message from frederic', '2026-03-26 16:54:06.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 1),
(13, 'New message from frederic', '2026-03-26 16:54:18.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 28),
(14, 'New document \'hhhh\' was uploaded by frederic', '2026-03-26 16:56:36.000000', b'1', '/documents/2', 'NEW_DOCUMENT', 1),
(15, 'New document \'hhhh\' was uploaded by frederic', '2026-03-26 16:56:36.000000', b'0', '/documents/2', 'NEW_DOCUMENT', 18),
(16, 'New document \'hhhh\' was uploaded by frederic', '2026-03-26 16:56:36.000000', b'1', '/documents/2', 'NEW_DOCUMENT', 28),
(17, 'New message from frederic', '2026-03-26 17:19:53.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 1),
(18, 'New message from frederic', '2026-03-26 19:13:56.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 1),
(19, 'New message from eko', '2026-03-26 19:28:27.000000', b'1', '/chat?user=33', 'NEW_MESSAGE', 28),
(20, 'New message from frederic', '2026-03-26 19:29:15.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 33),
(21, 'New message from eko', '2026-03-26 19:29:54.000000', b'1', '/chat?user=33', 'NEW_MESSAGE', 29),
(22, 'New message from frederic', '2026-03-26 19:31:05.000000', b'0', '/chat?user=29', 'NEW_MESSAGE', 33),
(23, 'Your account access has been revoked by an administrator.', '2026-03-26 19:31:47.000000', b'1', NULL, 'ACCESS_REVOKED', 33),
(24, 'Your account access has been granted by an administrator.', '2026-03-26 19:34:04.000000', b'0', NULL, 'ACCESS_GRANTED', 33),
(25, 'Your account access has been granted by an administrator.', '2026-03-26 19:34:07.000000', b'0', NULL, 'ACCESS_GRANTED', 32),
(26, 'Your account access has been revoked by an administrator.', '2026-03-26 19:34:08.000000', b'0', NULL, 'ACCESS_REVOKED', 32),
(27, 'Your account access has been revoked by an administrator.', '2026-03-26 19:38:06.000000', b'0', NULL, 'ACCESS_REVOKED', 33),
(28, 'Your account access has been revoked by an administrator.', '2026-03-26 19:38:07.000000', b'1', NULL, 'ACCESS_REVOKED', 33),
(29, 'Your account access has been revoked by an administrator.', '2026-03-26 19:38:08.000000', b'1', NULL, 'ACCESS_REVOKED', 33),
(30, 'Your account access has been granted by an administrator.', '2026-03-26 19:39:12.000000', b'1', NULL, 'ACCESS_GRANTED', 33),
(31, 'New message from eko', '2026-03-26 19:39:54.000000', b'1', '/chat?user=33', 'NEW_MESSAGE', 29),
(34, 'Your account access has been revoked by an administrator.', '2026-03-27 08:06:10.000000', b'1', NULL, 'ACCESS_REVOKED', 28),
(35, 'Your account access has been granted by an administrator.', '2026-03-27 08:09:13.000000', b'0', NULL, 'ACCESS_GRANTED', 31),
(36, 'Your account access has been revoked by an administrator.', '2026-03-27 08:10:43.000000', b'0', NULL, 'ACCESS_REVOKED', 31),
(38, 'New message from narame', '2026-03-27 08:17:22.000000', b'1', '/chat?user=34', 'NEW_MESSAGE', 29),
(41, 'New message from frederic', '2026-03-27 08:23:46.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 33),
(42, 'New message from frederic', '2026-03-27 08:33:10.000000', b'0', '/chat?user=29', 'NEW_MESSAGE', 18),
(43, 'Your account access has been granted by an administrator.', '2026-03-27 08:37:25.000000', b'0', NULL, 'ACCESS_GRANTED', 30),
(44, 'Your account access has been revoked by an administrator.', '2026-03-27 08:37:42.000000', b'0', NULL, 'ACCESS_REVOKED', 30),
(48, 'New message from frederic', '2026-03-27 10:33:06.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 35),
(49, 'New message from frederic', '2026-03-27 10:33:42.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 35),
(50, 'New message from frederic', '2026-03-27 10:34:01.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 29),
(51, 'New message from frederic', '2026-03-27 10:34:49.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 29),
(52, 'New message from frederic', '2026-03-27 10:46:08.000000', b'1', '/chat?user=frederic', 'NEW_MESSAGE', 29),
(53, 'New message from frederic', '2026-03-27 10:46:24.000000', b'1', '/chat?user=frederic', 'NEW_MESSAGE', 29),
(54, 'New message from frederic', '2026-03-27 10:49:14.000000', b'1', '/chat?user=frederic', 'NEW_MESSAGE', 29),
(55, 'New message from frederic', '2026-03-27 10:49:50.000000', b'0', '/chat?user=frederic', 'NEW_MESSAGE', 33),
(56, 'New message from narame', '2026-03-27 10:57:00.000000', b'1', '/chat?user=narame', 'NEW_MESSAGE', 29);

INSERT INTO `notifications` (`id`, `content`, `created_at`, `is_read`, `link`, `type`, `user_id`) VALUES
(57, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:21.000000', b'1', '/documents/3', 'NEW_DOCUMENT', 1),
(58, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:21.000000', b'0', '/documents/3', 'NEW_DOCUMENT', 18),
(59, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:21.000000', b'1', '/documents/3', 'NEW_DOCUMENT', 28),
(60, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:21.000000', b'1', '/documents/3', 'NEW_DOCUMENT', 29),
(61, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:21.000000', b'0', '/documents/3', 'NEW_DOCUMENT', 30),
(62, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:21.000000', b'0', '/documents/3', 'NEW_DOCUMENT', 31),
(63, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:21.000000', b'0', '/documents/3', 'NEW_DOCUMENT', 32),
(64, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:21.000000', b'0', '/documents/3', 'NEW_DOCUMENT', 33),
(65, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:21.000000', b'0', '/documents/3', 'NEW_DOCUMENT', 35),
(66, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:51.000000', b'1', '/documents/4', 'NEW_DOCUMENT', 1),
(67, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:51.000000', b'0', '/documents/4', 'NEW_DOCUMENT', 18),
(68, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:51.000000', b'1', '/documents/4', 'NEW_DOCUMENT', 28),
(69, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:51.000000', b'1', '/documents/4', 'NEW_DOCUMENT', 29),
(70, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:51.000000', b'0', '/documents/4', 'NEW_DOCUMENT', 30),
(71, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:51.000000', b'0', '/documents/4', 'NEW_DOCUMENT', 31),
(72, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:51.000000', b'0', '/documents/4', 'NEW_DOCUMENT', 32),
(73, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:51.000000', b'0', '/documents/4', 'NEW_DOCUMENT', 33),
(74, 'New document \'fghjkl\' was uploaded by betty', '2026-04-03 19:32:51.000000', b'0', '/documents/4', 'NEW_DOCUMENT', 35),
(75, 'New message from betty', '2026-04-03 19:33:13.000000', b'0', '/chat?user=betty', 'NEW_MESSAGE', 35),
(76, 'New message from betty', '2026-04-03 19:33:36.000000', b'1', '/chat?user=betty', 'NEW_MESSAGE', 29),
(77, 'New message from frederic', '2026-04-03 19:42:50.000000', b'1', '/chat?user=frederic', 'NEW_MESSAGE', 37),
(78, 'Your account access has been granted by an administrator.', '2026-04-03 19:56:49.000000', b'1', NULL, 'ACCESS_GRANTED', 28),
(79, 'New message from jose', '2026-04-08 20:52:20.000000', b'1', '/chat?user=jose', 'NEW_MESSAGE', 1),
(80, 'New message from frederic', '2026-04-09 14:04:08.000000', b'0', '/chat?user=frederic', 'NEW_MESSAGE', 37),
(81, 'Your account access has been granted by an administrator.', '2026-04-09 14:21:28.000000', b'0', NULL, 'ACCESS_GRANTED', 30),
(82, 'New message from frederic', '2026-04-09 14:35:24.000000', b'0', '/chat?user=frederic', 'NEW_MESSAGE', 30),
(83, 'New message from admin', '2026-04-09 14:40:20.000000', b'0', '/chat?user=admin', 'NEW_MESSAGE', 29),
(84, 'New message from admin', '2026-04-09 14:40:45.000000', b'0', '/chat?user=admin', 'NEW_MESSAGE', 30),
(85, 'New document \'handout\' was uploaded by admin', '2026-04-10 11:50:14.000000', b'0', '/documents/5', 'NEW_DOCUMENT', 18),
(86, 'New document \'handout\' was uploaded by admin', '2026-04-10 11:50:14.000000', b'0', '/documents/5', 'NEW_DOCUMENT', 28),
(87, 'New document \'handout\' was uploaded by admin', '2026-04-10 11:50:14.000000', b'0', '/documents/5', 'NEW_DOCUMENT', 29),
(88, 'New document \'handout\' was uploaded by admin', '2026-04-10 11:50:14.000000', b'0', '/documents/5', 'NEW_DOCUMENT', 30),
(89, 'New document \'handout\' was uploaded by admin', '2026-04-10 11:50:14.000000', b'0', '/documents/5', 'NEW_DOCUMENT', 31),
(90, 'New document \'handout\' was uploaded by admin', '2026-04-10 11:50:14.000000', b'0', '/documents/5', 'NEW_DOCUMENT', 32),
(91, 'New document \'handout\' was uploaded by admin', '2026-04-10 11:50:14.000000', b'0', '/documents/5', 'NEW_DOCUMENT', 33),
(92, 'New document \'handout\' was uploaded by admin', '2026-04-10 11:50:14.000000', b'0', '/documents/5', 'NEW_DOCUMENT', 35),
(93, 'New document \'handout\' was uploaded by admin', '2026-04-10 11:50:14.000000', b'0', '/documents/5', 'NEW_DOCUMENT', 37),
(94, 'New document \'handout\' was uploaded by admin', '2026-04-10 11:50:14.000000', b'0', '/documents/5', 'NEW_DOCUMENT', 38),
(95, 'New document \'note\' was uploaded by admin', '2026-04-10 11:51:51.000000', b'0', '/documents/6', 'NEW_DOCUMENT', 18),
(96, 'New document \'note\' was uploaded by admin', '2026-04-10 11:51:51.000000', b'0', '/documents/6', 'NEW_DOCUMENT', 28),
(97, 'New document \'note\' was uploaded by admin', '2026-04-10 11:51:51.000000', b'1', '/documents/6', 'NEW_DOCUMENT', 29),
(98, 'New document \'note\' was uploaded by admin', '2026-04-10 11:51:51.000000', b'0', '/documents/6', 'NEW_DOCUMENT', 30),
(99, 'New document \'note\' was uploaded by admin', '2026-04-10 11:51:51.000000', b'0', '/documents/6', 'NEW_DOCUMENT', 31),
(100, 'New document \'note\' was uploaded by admin', '2026-04-10 11:51:51.000000', b'0', '/documents/6', 'NEW_DOCUMENT', 32),
(101, 'New document \'note\' was uploaded by admin', '2026-04-10 11:51:51.000000', b'0', '/documents/6', 'NEW_DOCUMENT', 33),
(102, 'New document \'note\' was uploaded by admin', '2026-04-10 11:51:51.000000', b'0', '/documents/6', 'NEW_DOCUMENT', 35),
(103, 'New document \'note\' was uploaded by admin', '2026-04-10 11:51:51.000000', b'0', '/documents/6', 'NEW_DOCUMENT', 37),
(104, 'New document \'note\' was uploaded by admin', '2026-04-10 11:51:51.000000', b'0', '/documents/6', 'NEW_DOCUMENT', 38),
(105, 'New document \'yuh\' was uploaded by frederic', '2026-04-10 12:06:20.000000', b'1', '/documents/7', 'NEW_DOCUMENT', 1),
(106, 'New document \'yuh\' was uploaded by frederic', '2026-04-10 12:06:20.000000', b'0', '/documents/7', 'NEW_DOCUMENT', 18),
(107, 'New document \'yuh\' was uploaded by frederic', '2026-04-10 12:06:20.000000', b'0', '/documents/7', 'NEW_DOCUMENT', 28),
(108, 'New document \'yuh\' was uploaded by frederic', '2026-04-10 12:06:20.000000', b'0', '/documents/7', 'NEW_DOCUMENT', 30),
(109, 'New document \'yuh\' was uploaded by frederic', '2026-04-10 12:06:20.000000', b'0', '/documents/7', 'NEW_DOCUMENT', 31),
(110, 'New document \'yuh\' was uploaded by frederic', '2026-04-10 12:06:20.000000', b'0', '/documents/7', 'NEW_DOCUMENT', 32),
(111, 'New document \'yuh\' was uploaded by frederic', '2026-04-10 12:06:20.000000', b'0', '/documents/7', 'NEW_DOCUMENT', 33),
(112, 'New document \'yuh\' was uploaded by frederic', '2026-04-10 12:06:20.000000', b'0', '/documents/7', 'NEW_DOCUMENT', 35),
(113, 'New document \'yuh\' was uploaded by frederic', '2026-04-10 12:06:20.000000', b'0', '/documents/7', 'NEW_DOCUMENT', 37),
(114, 'New document \'yuh\' was uploaded by frederic', '2026-04-10 12:06:20.000000', b'0', '/documents/7', 'NEW_DOCUMENT', 38),
(115, 'New message from melanie', '2026-04-16 11:33:08.000000', b'0', '/chat?user=melanie', 'NEW_MESSAGE', 29),
(116, 'New message from melanie', '2026-04-16 11:33:11.000000', b'1', '/chat?user=melanie', 'NEW_MESSAGE', 29),
(117, 'New message from frederic', '2026-04-16 11:33:54.000000', b'0', '/chat?user=frederic', 'NEW_MESSAGE', 39),
(118, 'Your account access has been revoked by an administrator.', '2026-04-16 11:43:22.000000', b'0', NULL, 'ACCESS_REVOKED', 39),
(119, 'Your account access has been granted by an administrator.', '2026-04-16 11:43:59.000000', b'0', NULL, 'ACCESS_GRANTED', 39),
(120, 'New message from olivier', '2026-04-23 10:20:01.000000', b'1', '/chat?user=olivier', 'NEW_MESSAGE', 29),
(121, 'New message from frederic', '2026-04-23 10:20:31.000000', b'0', '/chat?user=frederic', 'NEW_MESSAGE', 40);

ALTER TABLE `notifications` AUTO_INCREMENT = 122;

-- --------------------------------------------------------
-- Views (TiDB compatible - no DEFINER, no ALGORITHM)
-- --------------------------------------------------------
CREATE VIEW `shared_documents_view` AS
SELECT
  `ds`.`id` AS `id`,
  `ds`.`document_id` AS `document_id`,
  `d`.`title` AS `document_title`,
  `d`.`file_name` AS `file_name`,
  `ds`.`shared_with_user_id` AS `shared_with_user_id`,
  `u`.`username` AS `shared_with_username`,
  `u`.`first_name` AS `shared_with_first_name`,
  `u`.`last_name` AS `shared_with_last_name`,
  `ds`.`shared_by_user_id` AS `shared_by_user_id`,
  `owner`.`username` AS `shared_by_username`,
  `owner`.`first_name` AS `shared_by_first_name`,
  `owner`.`last_name` AS `shared_by_last_name`,
  `ds`.`permission` AS `permission`,
  `ds`.`shared_at` AS `shared_at`,
  `ds`.`expires_at` AS `expires_at`,
  `ds`.`active` AS `active`
FROM `document_shares` `ds`
JOIN `documents` `d` ON `ds`.`document_id` = `d`.`id`
JOIN `users` `u` ON `ds`.`shared_with_user_id` = `u`.`id`
JOIN `users` `owner` ON `ds`.`shared_by_user_id` = `owner`.`id`
WHERE `ds`.`active` = 1
  AND (`ds`.`expires_at` IS NULL OR `ds`.`expires_at` > CURRENT_TIMESTAMP());

CREATE VIEW `user_documents` AS
SELECT
  `d`.`id` AS `id`,
  `d`.`title` AS `title`,
  `d`.`description` AS `description`,
  `d`.`file_name` AS `file_name`,
  `d`.`original_file_name` AS `original_file_name`,
  `d`.`file_path` AS `file_path`,
  `d`.`content_type` AS `content_type`,
  `d`.`file_size` AS `file_size`,
  `d`.`uploaded_at` AS `uploaded_at`,
  `d`.`updated_at` AS `updated_at`,
  `d`.`owner_id` AS `owner_id`,
  `u`.`username` AS `owner_username`,
  `u`.`first_name` AS `owner_first_name`,
  `u`.`last_name` AS `owner_last_name`
FROM `documents` `d`
JOIN `users` `u` ON `d`.`owner_id` = `u`.`id`
WHERE `u`.`enabled` = 1;

-- =============================================
-- IMPORT COMPLETE!
-- =============================================
