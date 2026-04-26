-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 26, 2026 at 06:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online_document_hub`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) NOT NULL,
  `action` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(255) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `content_type` varchar(255) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `owner_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `title`, `description`, `file_name`, `original_file_name`, `file_path`, `content_type`, `file_size`, `uploaded_at`, `updated_at`, `owner_id`) VALUES
(1, 'biology', 'book of biologys', '10d20793-260a-4285-bfea-9517a69de30c.docx', 'Linux System Administration Exam s muhammad(1).docx', 'uploads/10d20793-260a-4285-bfea-9517a69de30c.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 41282, '2026-03-26 08:08:46', '2026-03-27 08:31:40', 28),
(2, 'hhhh', 'ghjklkjhgfdsa', 'cbd11a65-e888-4e4e-a8ca-2fb0d34f71e0.pdf', 'administer Linux system .pdf', 'uploads/cbd11a65-e888-4e4e-a8ca-2fb0d34f71e0.pdf', 'application/pdf', 392874, '2026-03-26 14:56:36', '2026-03-26 14:56:36', 29),
(3, 'fghjkl', 'hjkl;\'', 'cf7bd6bc-bfc7-4e9d-af85-3e69ac437b7c.odt', 'Untitled 1.odt', 'uploads/cf7bd6bc-bfc7-4e9d-af85-3e69ac437b7c.odt', 'application/vnd.oasis.opendocument.text', 56351, '2026-04-03 17:32:21', '2026-04-03 17:32:21', 37),
(4, 'fghjkl', 'dfghjkl;\'\r\nefrtyujk', '528caa99-5984-4382-91ab-642048192f90.txt', 'Hospitality Admin123.txt', 'uploads/528caa99-5984-4382-91ab-642048192f90.txt', 'text/plain', 22, '2026-04-03 17:32:51', '2026-04-03 17:32:51', 37),
(5, 'handout', 'handout ', '100925a3-5e40-4193-86e5-0b23b242fed3.pptx', 'DOC-20260219-WA0101..pptx', 'uploads/100925a3-5e40-4193-86e5-0b23b242fed3.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 2218723, '2026-04-10 09:50:14', '2026-04-10 09:50:14', 1),
(6, 'note', 'notes', 'f138e6b9-b9a8-458c-a2ee-860a9c5aeea8.pdf', 'Questions and answers of the project .pdf', 'uploads/f138e6b9-b9a8-458c-a2ee-860a9c5aeea8.pdf', 'application/pdf', 52244, '2026-04-10 09:51:51', '2026-04-10 09:51:51', 1),
(7, 'yuh', 'yuh', 'a472add4-f1a2-4ef4-9cb7-595ca2694e2d.png', '14. Class Diagram.drawio.png', 'uploads/a472add4-f1a2-4ef4-9cb7-595ca2694e2d.png', 'image/png', 48393, '2026-04-10 10:06:20', '2026-04-10 10:06:20', 29);

--
-- Triggers `documents`
--
DELIMITER $$
CREATE TRIGGER `update_document_timestamp` BEFORE UPDATE ON `documents` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `document_shares`
--

CREATE TABLE `document_shares` (
  `id` bigint(20) NOT NULL,
  `document_id` bigint(20) NOT NULL,
  `shared_with_user_id` bigint(20) NOT NULL,
  `shared_by_user_id` bigint(20) NOT NULL,
  `permission` enum('READ_ONLY','READ_WRITE','ADMIN') NOT NULL,
  `shared_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_verification_token`
--

CREATE TABLE `email_verification_token` (
  `id` bigint(20) NOT NULL,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) NOT NULL,
  `content` text DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `is_read` bit(1) NOT NULL,
  `sent_at` datetime(6) NOT NULL,
  `recipient_id` bigint(20) NOT NULL,
  `sender_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `content`, `file_name`, `file_path`, `file_size`, `file_type`, `is_read`, `sent_at`, `recipient_id`, `sender_id`) VALUES
(1, 'hehelp me ', NULL, NULL, NULL, NULL, b'1', '2026-03-26 08:44:44.000000', 1, 18),
(2, 'amakuru', NULL, NULL, NULL, NULL, b'0', '2026-03-26 15:17:14.000000', 28, 29),
(3, 'Hello manzi, I am testing the visibility of the text in this chat input field. It should be black or dark gray now. Can you see this long message clearly? I hope the color issue is fixed.', NULL, NULL, NULL, NULL, b'0', '2026-03-26 15:20:40.000000', 28, 29),
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

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL,
  `content` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

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
(23, '⚠️ Your account access has been revoked by an administrator. Please contact support for more information.', '2026-03-26 19:31:47.000000', b'1', NULL, 'ACCESS_REVOKED', 33),
(24, '✅ Your account access has been granted by an administrator. You can now log in.', '2026-03-26 19:34:04.000000', b'0', NULL, 'ACCESS_GRANTED', 33),
(25, '✅ Your account access has been granted by an administrator. You can now log in.', '2026-03-26 19:34:07.000000', b'0', NULL, 'ACCESS_GRANTED', 32),
(26, '⚠️ Your account access has been revoked by an administrator. Please contact support for more information.', '2026-03-26 19:34:08.000000', b'0', NULL, 'ACCESS_REVOKED', 32),
(27, '⚠️ Your account access has been revoked by an administrator. Please contact support for more information.', '2026-03-26 19:38:06.000000', b'0', NULL, 'ACCESS_REVOKED', 33),
(28, '⚠️ Your account access has been revoked by an administrator. Please contact support for more information.', '2026-03-26 19:38:07.000000', b'1', NULL, 'ACCESS_REVOKED', 33),
(29, '⚠️ Your account access has been revoked by an administrator. Please contact support for more information.', '2026-03-26 19:38:08.000000', b'1', NULL, 'ACCESS_REVOKED', 33),
(30, '✅ Your account access has been granted by an administrator. You can now log in.', '2026-03-26 19:39:12.000000', b'1', NULL, 'ACCESS_GRANTED', 33),
(31, 'New message from eko', '2026-03-26 19:39:54.000000', b'1', '/chat?user=33', 'NEW_MESSAGE', 29),
(34, '⚠️ Your account access has been revoked by an administrator. Please contact support for more information.', '2026-03-27 08:06:10.000000', b'1', NULL, 'ACCESS_REVOKED', 28),
(35, '✅ Your account access has been granted by an administrator. You can now log in.', '2026-03-27 08:09:13.000000', b'0', NULL, 'ACCESS_GRANTED', 31),
(36, '⚠️ Your account access has been revoked by an administrator. Please contact support for more information.', '2026-03-27 08:10:43.000000', b'0', NULL, 'ACCESS_REVOKED', 31),
(38, 'New message from narame', '2026-03-27 08:17:22.000000', b'1', '/chat?user=34', 'NEW_MESSAGE', 29),
(41, 'New message from frederic', '2026-03-27 08:23:46.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 33),
(42, 'New message from frederic', '2026-03-27 08:33:10.000000', b'0', '/chat?user=29', 'NEW_MESSAGE', 18),
(43, '✅ Your account access has been granted by an administrator. You can now log in.', '2026-03-27 08:37:25.000000', b'0', NULL, 'ACCESS_GRANTED', 30),
(44, '⚠️ Your account access has been revoked by an administrator. Please contact support for more information.', '2026-03-27 08:37:42.000000', b'0', NULL, 'ACCESS_REVOKED', 30),
(48, 'New message from frederic', '2026-03-27 10:33:06.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 35),
(49, 'New message from frederic', '2026-03-27 10:33:42.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 35),
(50, 'New message from frederic', '2026-03-27 10:34:01.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 29),
(51, 'New message from frederic', '2026-03-27 10:34:49.000000', b'1', '/chat?user=29', 'NEW_MESSAGE', 29),
(52, 'New message from frederic', '2026-03-27 10:46:08.000000', b'1', '/chat?user=frederic', 'NEW_MESSAGE', 29),
(53, 'New message from frederic', '2026-03-27 10:46:24.000000', b'1', '/chat?user=frederic', 'NEW_MESSAGE', 29),
(54, 'New message from frederic', '2026-03-27 10:49:14.000000', b'1', '/chat?user=frederic', 'NEW_MESSAGE', 29),
(55, 'New message from frederic', '2026-03-27 10:49:50.000000', b'0', '/chat?user=frederic', 'NEW_MESSAGE', 33),
(56, 'New message from narame', '2026-03-27 10:57:00.000000', b'1', '/chat?user=narame', 'NEW_MESSAGE', 29),
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
(78, '✅ Your account access has been granted by an administrator. You can now log in.', '2026-04-03 19:56:49.000000', b'1', NULL, 'ACCESS_GRANTED', 28),
(79, 'New message from jose', '2026-04-08 20:52:20.000000', b'1', '/chat?user=jose', 'NEW_MESSAGE', 1),
(80, 'New message from frederic', '2026-04-09 14:04:08.000000', b'0', '/chat?user=frederic', 'NEW_MESSAGE', 37),
(81, '✅ Your account access has been granted by an administrator. You can now log in.', '2026-04-09 14:21:28.000000', b'0', NULL, 'ACCESS_GRANTED', 30),
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
(118, '⚠️ Your account access has been revoked by an administrator. Please contact support for more information.', '2026-04-16 11:43:22.000000', b'0', NULL, 'ACCESS_REVOKED', 39),
(119, '✅ Your account access has been granted by an administrator. You can now log in.', '2026-04-16 11:43:59.000000', b'0', NULL, 'ACCESS_GRANTED', 39),
(120, 'New message from olivier', '2026-04-23 10:20:01.000000', b'1', '/chat?user=olivier', 'NEW_MESSAGE', 29),
(121, 'New message from frederic', '2026-04-23 10:20:31.000000', b'0', '/chat?user=frederic', 'NEW_MESSAGE', 40);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'USER', 'Regular user with document access', '2026-03-07 15:30:57', '2026-03-07 15:30:57'),
(2, 'ADMIN', 'Administrator with full system access', '2026-03-07 15:30:57', '2026-03-07 15:30:57'),
(9, 'ROLE_USER', 'Standard User Role', '2026-03-07 17:44:24', '2026-03-07 17:44:24'),
(10, 'ROLE_ADMIN', 'Administrator Role', '2026-03-07 17:44:24', '2026-03-07 17:44:24');

-- --------------------------------------------------------

--
-- Stand-in structure for view `shared_documents_view`
-- (See below for the actual view)
--
CREATE TABLE `shared_documents_view` (
`id` bigint(20)
,`document_id` bigint(20)
,`document_title` varchar(255)
,`file_name` varchar(255)
,`shared_with_user_id` bigint(20)
,`shared_with_username` varchar(255)
,`shared_with_first_name` varchar(255)
,`shared_with_last_name` varchar(255)
,`shared_by_user_id` bigint(20)
,`shared_by_username` varchar(255)
,`shared_by_first_name` varchar(255)
,`shared_by_last_name` varchar(255)
,`permission` enum('READ_ONLY','READ_WRITE','ADMIN')
,`shared_at` timestamp
,`expires_at` timestamp
,`active` tinyint(1)
);

-- --------------------------------------------------------

--
-- Table structure for table `system_configs`
--

CREATE TABLE `system_configs` (
  `id` bigint(20) NOT NULL,
  `config_key` varchar(255) NOT NULL,
  `config_value` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_configs`
--

INSERT INTO `system_configs` (`id`, `config_key`, `config_value`, `description`) VALUES
(1, 'MAX_FILE_SIZE', '52428800', 'Maximum file upload size in bytes (50MB)'),
(2, 'ALLOWED_FILE_TYPES', 'pdf,doc,docx,txt,jpg,png', 'Allowed file extensions (comma-separated)'),
(3, 'MAINTENANCE_MODE', 'false', 'Disable system access for non-admin users');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `verification_token` varchar(255) DEFAULT NULL,
  `last_seen` datetime(6) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

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

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `update_user_timestamp` BEFORE UPDATE ON `users` FOR EACH ROW BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_documents`
-- (See below for the actual view)
--
CREATE TABLE `user_documents` (
`id` bigint(20)
,`title` varchar(255)
,`description` text
,`file_name` varchar(255)
,`original_file_name` varchar(255)
,`file_path` varchar(255)
,`content_type` varchar(255)
,`file_size` bigint(20)
,`uploaded_at` timestamp
,`updated_at` timestamp
,`owner_id` bigint(20)
,`owner_username` varchar(255)
,`owner_first_name` varchar(255)
,`owner_last_name` varchar(255)
);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

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

--
-- Structure for view `shared_documents_view`
--
DROP TABLE IF EXISTS `shared_documents_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `shared_documents_view`  AS SELECT `ds`.`id` AS `id`, `ds`.`document_id` AS `document_id`, `d`.`title` AS `document_title`, `d`.`file_name` AS `file_name`, `ds`.`shared_with_user_id` AS `shared_with_user_id`, `u`.`username` AS `shared_with_username`, `u`.`first_name` AS `shared_with_first_name`, `u`.`last_name` AS `shared_with_last_name`, `ds`.`shared_by_user_id` AS `shared_by_user_id`, `owner`.`username` AS `shared_by_username`, `owner`.`first_name` AS `shared_by_first_name`, `owner`.`last_name` AS `shared_by_last_name`, `ds`.`permission` AS `permission`, `ds`.`shared_at` AS `shared_at`, `ds`.`expires_at` AS `expires_at`, `ds`.`active` AS `active` FROM (((`document_shares` `ds` join `documents` `d` on(`ds`.`document_id` = `d`.`id`)) join `users` `u` on(`ds`.`shared_with_user_id` = `u`.`id`)) join `users` `owner` on(`ds`.`shared_by_user_id` = `owner`.`id`)) WHERE `ds`.`active` = 1 AND (`ds`.`expires_at` is null OR `ds`.`expires_at` > current_timestamp()) ;

-- --------------------------------------------------------

--
-- Structure for view `user_documents`
--
DROP TABLE IF EXISTS `user_documents`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_documents`  AS SELECT `d`.`id` AS `id`, `d`.`title` AS `title`, `d`.`description` AS `description`, `d`.`file_name` AS `file_name`, `d`.`original_file_name` AS `original_file_name`, `d`.`file_path` AS `file_path`, `d`.`content_type` AS `content_type`, `d`.`file_size` AS `file_size`, `d`.`uploaded_at` AS `uploaded_at`, `d`.`updated_at` AS `updated_at`, `d`.`owner_id` AS `owner_id`, `u`.`username` AS `owner_username`, `u`.`first_name` AS `owner_first_name`, `u`.`last_name` AS `owner_last_name` FROM (`documents` `d` join `users` `u` on(`d`.`owner_id` = `u`.`id`)) WHERE `u`.`enabled` = 1 ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `file_name` (`file_name`),
  ADD KEY `idx_documents_owner_id` (`owner_id`),
  ADD KEY `idx_documents_title` (`title`),
  ADD KEY `idx_documents_file_name` (`file_name`);

--
-- Indexes for table `document_shares`
--
ALTER TABLE `document_shares`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_document_shares_document_id` (`document_id`),
  ADD KEY `idx_document_shares_shared_with_user_id` (`shared_with_user_id`),
  ADD KEY `idx_document_shares_shared_by_user_id` (`shared_by_user_id`),
  ADD KEY `idx_document_shares_active` (`active`),
  ADD KEY `idx_document_shares_expires_at` (`expires_at`);

--
-- Indexes for table `email_verification_token`
--
ALTER TABLE `email_verification_token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKidu2ippaks8bn6vcsq62khvdu` (`token`),
  ADD UNIQUE KEY `UK1sxbwflvq4skafkocq315i9dt` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKhdkwfnspwb3s60j27vpg0rpg6` (`recipient_id`),
  ADD KEY `FK4ui4nnwntodh6wjvck53dbk9m` (`sender_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `system_configs`
--
ALTER TABLE `system_configs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKpk5mof051xp5r3e75s2e23s8s` (`config_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_username` (`username`),
  ADD KEY `idx_users_email` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `document_shares`
--
ALTER TABLE `document_shares`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_verification_token`
--
ALTER TABLE `email_verification_token`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `system_configs`
--
ALTER TABLE `system_configs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `document_shares`
--
ALTER TABLE `document_shares`
  ADD CONSTRAINT `document_shares_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `document_shares_ibfk_2` FOREIGN KEY (`shared_with_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `document_shares_ibfk_3` FOREIGN KEY (`shared_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_verification_token`
--
ALTER TABLE `email_verification_token`
  ADD CONSTRAINT `FKknax5in7pcatm2uf9uyple35x` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `FK4ui4nnwntodh6wjvck53dbk9m` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKhdkwfnspwb3s60j27vpg0rpg6` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
