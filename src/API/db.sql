DROP DATABASE IF EXISTS `etutime_test_1`;
CREATE DATABASE `etutime_test_1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `etutime_test_1`;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Table users
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NULL,
    level VARCHAR(50) NOT NULL,
    remember_token VARCHAR(100) NULL,
    profile_photo_path VARCHAR(2048) NULL,
    week_start VARCHAR(255) NOT NULL DEFAULT 'Monday',
    two_factor_secret TEXT NULL,
    two_factor_recovery_codes TEXT NULL,
    two_factor_confirmed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table modules
CREATE TABLE modules (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(16) NOT NULL,
    is_public TINYINT(1) NOT NULL DEFAULT 1,
    progress VARCHAR(10) NOT NULL DEFAULT 'Début',
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (name, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table chapitres
CREATE TABLE chapitres (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(500) NOT NULL,
    module_id INT,
    user_id INT NOT NULL,
    is_done TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY (name, module_id, user_id),
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table minuteurs
CREATE TABLE minuteurs (
    id INT NOT NULL AUTO_INCREMENT,
    module_id INT,
    chapitre_id INT,
    user_id INT NOT NULL,
    start TIMESTAMP NOT NULL,
    end TIMESTAMP NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL,
    FOREIGN KEY (chapitre_id) REFERENCES chapitres(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table taches
CREATE TABLE taches (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (name, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table de jointure pour relation many-to-many entre minuteurs et taches
CREATE TABLE minuteur_taches (
    minuteur_id INT NOT NULL,
    tache_id INT NOT NULL,
    PRIMARY KEY (minuteur_id, tache_id),
    FOREIGN KEY (minuteur_id) REFERENCES minuteurs(id) ON DELETE CASCADE,
    FOREIGN KEY (tache_id) REFERENCES taches(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table notes
CREATE TABLE notes (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content JSON NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table emplois_du_temps
CREATE TABLE emplois_du_temps (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    module_id INT,
    emploi JSON NOT NULL,
    horaire_fixe JSON,
    niveau_concentration ENUM('faible', 'moyen', 'élevé') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;  