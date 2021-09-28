# ************************************************************
#
# Host: 5.189.168.22 (MySQL 5.5.64-MariaDB)
# Database: smartiot_teamprojekt
#
# ************************************************************

SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION;
SET NAMES utf8;
SET NAMES utf8mb4;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0;


DROP TABLE IF EXISTS `device`;
CREATE TABLE `device`
(
    `id`          int(11) unsigned NOT NULL AUTO_INCREMENT,
    `placeholder` text DEFAULT NULL, #what was auth_string again?
    `location`    text DEFAULT NULL,
    `name`        text DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

LOCK TABLES `device` WRITE;
ALTER TABLE `device`
    DISABLE KEYS;
INSERT INTO `device` (`id`, `location`, `name`)
VALUES (1, 'Wohnzimmer', 'Das Teil das misst'),
       (2, 'Schlafzimmer', 'SmartIOT sensor'),
       (3, 'Schlafzimmer', NULL);
ALTER TABLE `device`
    ENABLE KEYS;
UNLOCK TABLES;


DROP TABLE IF EXISTS `ownership`;
CREATE TABLE `ownership`
(
    `id`     int(11) unsigned NOT NULL AUTO_INCREMENT,
    `device` int(11) unsigned NOT NULL,
    `user`   int(11) unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `device` (`device`),
    KEY `user` (`user`),
    CONSTRAINT `ownership_user_id` FOREIGN KEY (`user`) REFERENCES user (`id`),
    CONSTRAINT `ownership_device_id` FOREIGN KEY (`device`) REFERENCES `device` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

LOCK TABLES `ownership` WRITE;
ALTER TABLE `ownership`
    DISABLE KEYS;
INSERT INTO `ownership` (`id`, `device`, `user`)
VALUES (1, 1, 1),
       (2, 2, 2),
       (3, 3, 3);
ALTER TABLE `ownership`
    ENABLE KEYS;
UNLOCK TABLES;


DROP TABLE IF EXISTS `measurement`;
CREATE TABLE `measurement`
(
    `id`        int(11) unsigned NOT NULL AUTO_INCREMENT,
    `timestamp` int(11) unsigned NOT NULL,
    `device`    int(11) unsigned NOT NULL,
    `co2`       double DEFAULT NULL,
    `temp`      double DEFAULT NULL,
    `pressure`  double DEFAULT NULL,
    `humidity`  double DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `device` (`device`),
    CONSTRAINT measurement_min_data CHECK (COALESCE(co2, temp, pressure, humidity) IS NOT NULL),
    CONSTRAINT `measurement_device_id` FOREIGN KEY (`device`) REFERENCES `device` (`id`),
        Key (`timestamp`),
    CONSTRAINT `measurement_timestamp_id` FOREIGN KEY (`timestamp`) REFERENCES timestamp (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

LOCK TABLES `measurement` WRITE;
ALTER TABLE `measurement`
    DISABLE KEYS;
INSERT INTO `measurement` (`id`, `timestamp`, `device`, co2, temp, pressure, humidity)
VALUES (1, 1, 1, Null, 30, Null, Null),
       (2, 2, 2, Null, 21, 1014, 53),
       (3, 3, 3, Null, 15, Null, 24);
ALTER TABLE `measurement`
    ENABLE KEYS;
UNLOCK TABLES;


DROP TABLE IF EXISTS session;
CREATE TABLE session
(
    `id`        int(11) unsigned   NOT NULL AUTO_INCREMENT,
    `timestamp` int(11) unsigned   NOT NULL,
    `user`      int(11) unsigned   NOT NULL,
    `hash`      VARCHAR(64) UNIQUE NOT NULL,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user`),
    Key (`timestamp`),
    CONSTRAINT `session_timestamp_id` FOREIGN KEY (`timestamp`) REFERENCES timestamp (`id`),
    CONSTRAINT `session_user_id` FOREIGN KEY (`user`) REFERENCES user (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

LOCK TABLES `session` WRITE;
ALTER TABLE `session`
    DISABLE KEYS;
INSERT INTO `session` (`id`, `timestamp`, `user`, `hash`)
VALUES (1, 1, 1, '8383ac6ab372349e80f6c9317f50eecdcbc03b4f585f51adf2510106b04fc08f'),
       (2, 2, 2, '1208c2d356ec9a2e4cc53cd614bedb3a38a61267b15285e63d9de5a6877d21db'),
       (3, 3, 3, 'd2c632ea0cff0952f4e46c8e9378637baf1bd64cd4ae907b18faaa9f2e2d420c');

ALTER TABLE `session`
    ENABLE KEYS;
UNLOCK TABLES;


DROP TABLE IF EXISTS timestamp;
CREATE TABLE timestamp
(
    `id`        int(11) unsigned NOT NULL AUTO_INCREMENT,
    `timestamp` int(11) unsigned UNIQUE NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

LOCK TABLES `timestamp` WRITE;
ALTER TABLE `timestamp`
    DISABLE KEYS;
INSERT INTO `timestamp` (`id`, `timestamp`)
VALUES (1, UNIX_TIMESTAMP('2021-06-12 12:00:00')),
       (2, UNIX_TIMESTAMP('2020-05-12 18:35:00')),
       (3, UNIX_TIMESTAMP('2021-03-27 21:35:00'));
ALTER TABLE `timestamp`
    ENABLE KEYS;
UNLOCK TABLES;


DROP TABLE IF EXISTS user;
CREATE TABLE user
(
    `id`       int(11) unsigned NOT NULL AUTO_INCREMENT,
    `username` text,
    `password` VARCHAR(64),
    `creation` int(11) unsigned NOT NULL,
    `location` text DEFAULT NULL,
    `birthday` DATE DEFAULT NULL,
    PRIMARY KEY (`id`),
    Key (`creation`),
    CONSTRAINT `user_creation_id` FOREIGN KEY (`creation`) REFERENCES timestamp (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

LOCK TABLES `user` WRITE;
ALTER TABLE `user`
    DISABLE KEYS;
INSERT INTO `user` (`id`, `username`, `password`, `creation`)
VALUES (1, 'Karl', '1a5c947cdadea168aa6a4af103f6d906e71c4dc43040a0719faeb9f66093971b', 1),    #Passwort123
       (2, 'Sabrina', 'de4cbc7a973ecc21a14fc06ef72f47071fe93593cf538c1d1c0cf7eafdf2cd84', 2), #Katze1231
       (3, 'Peter', '4294598204880f05107af78cd4849b40a746341a5a3b3c363b0b59d735d8b842', 3); #Bosch123
ALTER TABLE `user`
    ENABLE KEYS;
UNLOCK TABLES;


SET SQL_NOTES = @OLD_SQL_NOTES;
SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT;
SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS;
SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION;
