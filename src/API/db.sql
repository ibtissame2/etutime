DROP DATABASE IF EXISTS `etutime_test_1`;
CREATE DATABASE `etutime_test_1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `etutime_test_1`;

CREATE TABLE `teams` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `current_team_id` INT DEFAULT NULL,
  `profile_photo_path` varchar(2048) DEFAULT NULL,
  `week_start` varchar(255) NOT NULL,
  `two_factor_secret` text,
  `two_factor_recovery_codes` text,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `modules` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `color` varchar(16) NOT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `team_id` INT NOT NULL,
  `progress` varchar(10) NOT NULL DEFAULT 'Début',
  PRIMARY KEY (`id`),
  KEY `modules_team_id_foreign` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `taches` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `team_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `taches_team_id_foreign` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- To Delete

INSERT INTO `teams` (`name`, `created_at`) VALUES ('Team A', NULL);

INSERT INTO `users` (`name`, `email`, `email_verified_at`, `password`, `remember_token`, `current_team_id`, `profile_photo_path`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`) VALUES
('Ibtissame', 'ibtissame@gmail.com', NULL, 'Ibtissame', NULL, 1, NULL, NULL, NULL, NULL),
('Oussama', 'oussama@gmail.com', NULL, 'Oussama', NULL, 1, NULL, NULL, NULL, NULL);
