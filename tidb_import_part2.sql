-- =============================================
-- TiDB Cloud Compatible SQL Import - Part 2
-- Messages table + data
-- =============================================
USE online_document_hub;

CREATE TABLE `messages` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `content` TEXT DEFAULT NULL,
  `file_name` VARCHAR(255) DEFAULT NULL,
  `file_path` VARCHAR(255) DEFAULT NULL,
  `file_size` BIGINT DEFAULT NULL,
  `file_type` VARCHAR(255) DEFAULT NULL,
  `is_read` BIT(1) NOT NULL,
  `sent_at` DATETIME(6) NOT NULL,
  `recipient_id` BIGINT NOT NULL,
  `sender_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhdkwfnspwb3s60j27vpg0rpg6` (`recipient_id`),
  KEY `FK4ui4nnwntodh6wjvck53dbk9m` (`sender_id`),
  CONSTRAINT `FK4ui4nnwntodh6wjvck53dbk9m` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKhdkwfnspwb3s60j27vpg0rpg6` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`)
) DEFAULT CHARSET=utf8mb4;

INSERT INTO `messages` (`id`, `content`, `file_name`, `file_path`, `file_size`, `file_type`, `is_read`, `sent_at`, `recipient_id`, `sender_id`) VALUES
(1, 'hehelp me ', NULL, NULL, NULL, NULL, b'1', '2026-03-26 08:44:44.000000', 1, 18),
(2, 'amakuru', NULL, NULL, NULL, NULL, b'0', '2026-03-26 15:17:14.000000', 28, 29),
(3, 'Hello manzi, I am testing the visibility of the text in this chat input field.', NULL, NULL, NULL, NULL, b'0', '2026-03-26 15:20:40.000000', 28, 29),
(4, 'hello my bro', NULL, NULL, NULL, NULL, b'0', '2026-03-26 15:31:00.000000', 28, 29),
(5, 'hello bro', NULL, NULL, NULL, NULL, b'0', '2026-03-26 15:31:23.000000', 28, 29),
(6, 'hello', NULL, NULL, NULL, NULL, b'1', '2026-03-26 15:33:06.000000', 1, 29),
(7, 'hello', NULL, NULL, NULL, NULL, b'0', '2026-03-26 15:39:33.000000', 28, 29),
(8, 'hello', NULL, NULL, NULL, NULL, b'0', '2026-03-26 15:40:57.000000', 28, 29),
(9, 'hello', NULL, NULL, NULL, NULL, b'0', '2026-03-26 15:41:04.000000', 28, 29),
(10, 'hello', NULL, NULL, NULL, NULL, b'1', '2026-03-26 16:54:06.000000', 1, 29),
(11, 'hello', NULL, NULL, NULL, NULL, b'0', '2026-03-26 16:54:18.000000', 28, 29),
(12, 'hello', NULL, NULL, NULL, NULL, b'1', '2026-03-26 17:19:53.000000', 1, 29),
(13, 'hello', NULL, NULL, NULL, NULL, b'1', '2026-03-26 19:13:56.000000', 1, 29),
(14, 'amakuru', NULL, NULL, NULL, NULL, b'0', '2026-03-26 19:28:27.000000', 28, 33),
(15, 'amakuru yawe boss', NULL, NULL, NULL, NULL, b'1', '2026-03-26 19:29:15.000000', 33, 29),
(16, 'nimeza musore wange ', NULL, NULL, NULL, NULL, b'1', '2026-03-26 19:29:54.000000', 29, 33),
(17, NULL, 'Screenshot from 2026-03-26 20-59-44.png', 'uploads/messages/9ea619ac-a3b6-4efb-99f9-3b50950c66f8_Screenshot from 2026-03-26 20-59-44.png', 237588, 'image/png', b'1', '2026-03-26 19:31:05.000000', 33, 29),
(18, 'merci ware', NULL, NULL, NULL, NULL, b'1', '2026-03-26 19:39:54.000000', 29, 33),
(23, 'yego', NULL, NULL, NULL, NULL, b'1', '2026-03-27 08:23:46.000000', 33, 29),
(24, 'hello', NULL, NULL, NULL, NULL, b'0', '2026-03-27 08:33:10.000000', 18, 29),
(25, 'amakuru jojo', NULL, NULL, NULL, NULL, b'1', '2026-03-27 10:33:06.000000', 35, 29),
(26, 'hello', NULL, NULL, NULL, NULL, b'1', '2026-03-27 10:33:42.000000', 35, 29),
(27, 'hello', NULL, NULL, NULL, NULL, b'1', '2026-03-27 10:34:01.000000', 29, 29),
(28, 'amakuru', NULL, NULL, NULL, NULL, b'1', '2026-03-27 10:34:49.000000', 29, 29),
(29, 'amakuru vaz', NULL, NULL, NULL, NULL, b'1', '2026-03-27 10:46:08.000000', 29, 29),
(30, 'hello', NULL, NULL, NULL, NULL, b'1', '2026-03-27 10:46:24.000000', 29, 29),
(31, 'ndagukumbuye', NULL, NULL, NULL, NULL, b'1', '2026-03-27 10:49:14.000000', 29, 29),
(32, 'ndagushaka cyane ', NULL, NULL, NULL, NULL, b'0', '2026-03-27 10:49:50.000000', 33, 29),
(33, 'bite', NULL, NULL, NULL, NULL, b'1', '2026-03-27 10:57:00.000000', 29, 35),
(34, 'amakuru', NULL, NULL, NULL, NULL, b'0', '2026-04-03 19:33:13.000000', 35, 37),
(35, 'hello frederic', NULL, NULL, NULL, NULL, b'1', '2026-04-03 19:33:36.000000', 29, 37),
(36, 'hi amakuru betty', NULL, NULL, NULL, NULL, b'1', '2026-04-03 19:42:50.000000', 37, 29),
(37, 'hello', NULL, NULL, NULL, NULL, b'0', '2026-04-08 20:52:20.000000', 1, 38),
(38, 'urakomeye cyane ariko', NULL, NULL, NULL, NULL, b'1', '2026-04-09 14:04:08.000000', 37, 29),
(39, 'hello', NULL, NULL, NULL, NULL, b'0', '2026-04-09 14:35:24.000000', 30, 29),
(40, 'amakuru', NULL, NULL, NULL, NULL, b'0', '2026-04-09 14:40:20.000000', 29, 1),
(41, 'vazi bite byawe', NULL, NULL, NULL, NULL, b'0', '2026-04-09 14:40:45.000000', 30, 1),
(42, 'amakuru ', NULL, NULL, NULL, NULL, b'1', '2026-04-16 11:33:08.000000', 29, 39),
(43, 'yawe ', NULL, NULL, NULL, NULL, b'1', '2026-04-16 11:33:11.000000', 29, 39),
(44, 'nimeza', NULL, NULL, NULL, NULL, b'1', '2026-04-16 11:33:54.000000', 39, 29),
(45, 'hello', NULL, NULL, NULL, NULL, b'1', '2026-04-23 10:20:01.000000', 29, 40),
(46, 'amakuru', NULL, NULL, NULL, NULL, b'1', '2026-04-23 10:20:31.000000', 40, 29);

ALTER TABLE `messages` AUTO_INCREMENT = 47;
-- Part 2 complete.
