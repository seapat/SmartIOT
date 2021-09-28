# ************************************************************
#
# Host: 5.189.168.22 (MySQL 5.5.64-MariaDB)
# Database: smartiot_teamprojekt
#
# ************************************************************

/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;


DROP TABLE IF EXISTS `device`;
CREATE TABLE `device`
(
    `id`          int(11) unsigned NOT NULL AUTO_INCREMENT,
    `placeholder` text DEFAULT NULL,
    `location`    text DEFAULT NULL,
    `name`        text DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;


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


DROP TABLE IF EXISTS `sample_data`;
CREATE TABLE `sample_data`
(
    `id`        int(11) unsigned NOT NULL AUTO_INCREMENT,
    `text`      text,
    `timestamp` int(11) unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY (`timestamp`),
    CONSTRAINT `sample_timestamp_id` FOREIGN KEY (`timestamp`) REFERENCES `timestamp` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;

LOCK TABLES `sample_data` WRITE;
/*!40000 ALTER TABLE `sample_data`
    DISABLE KEYS */;

INSERT INTO `sample_data` (`id`, `text`, `timestamp`)
VALUES (1, 'thats the first entry ', 1625217851),
       (2, 'test', 1625340021),
       (3, 'fgidhskjfasbj', 1);

/*!40000 ALTER TABLE `sample_data`
    ENABLE KEYS */;
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
#`additional_data` double DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `device` (`device`),
    KEY (`timestamp`),
    CONSTRAINT measurement_min_data UNIQUE (co2, temp, pressure, humidity),
    CONSTRAINT `measurement_device_id` FOREIGN KEY (`device`) REFERENCES `device` (`id`),
    CONSTRAINT `measurement_timestamp_id` FOREIGN KEY (`timestamp`) REFERENCES `timestamp` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;


DROP TABLE IF EXISTS session;
CREATE TABLE session
(
    `id`        int(11) unsigned NOT NULL AUTO_INCREMENT,
    `timestamp` int(11) unsigned NOT NULL,
    `user`      int(11) unsigned NOT NULL,
    `hash`      text UNIQUE      NOT NULL,
    PRIMARY KEY (`id`),
    KEY `user` (`user`),
    KEY (`timestamp`),
    CONSTRAINT `session_user_id` FOREIGN KEY (`user`) REFERENCES user (`id`),
    CONSTRAINT `session_timestamp_id` FOREIGN KEY (`timestamp`) REFERENCES `timestamp` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;


DROP TABLE IF EXISTS timestamp;
CREATE TABLE timestamp
(
    `id`        int(11) unsigned NOT NULL AUTO_INCREMENT,
    `timestamp` TIMESTAMP        NOT NULL, # UNIQUE
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;


DROP TABLE IF EXISTS user;
CREATE TABLE user
(
    `id`       int(11) unsigned NOT NULL AUTO_INCREMENT,
    `username` text,
    `password` text, #DEFAULT NULL
    `creation` int(11)          NOT NULL,
    `location` text DEFAULT NULL,
    `birthday` DATE DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = latin1;


/*!40111 SET SQL_NOTES = @OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE = @OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
