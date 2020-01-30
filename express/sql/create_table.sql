DROP TABLE IF EXISTS Apparts_Users;
DROP TABLE IF EXISTS Apparts;
DROP TABLE IF EXISTS Geo;
DROP TABLE IF EXISTS Zones;
DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS `devbot`.`Users` (
  `_id` int NOT NULL AUTO_INCREMENT ,
  `lastname` VARCHAR(100) ,
  `firstname` VARCHAR(100) ,
  `password` BLOB ,
  `email` VARCHAR(100) UNIQUE,
  `coins` int ,
  PRIMARY KEY (`_id`) );

CREATE TABLE IF NOT EXISTS `devbot`.`Zones` (
  `_id` int NOT NULL AUTO_INCREMENT ,
  `users_id` int NOT NULL,
  FOREIGN KEY (users_id) REFERENCES Users (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  PRIMARY KEY (`_id`) );


CREATE TABLE IF NOT EXISTS `devbot`.`Geo` (
  `_id` int NOT NULL AUTO_INCREMENT ,
  `zone_id` int,
  `lat` DECIMAL(10, 8) ,
  `lng` DECIMAL(11, 8)  ,
  FOREIGN KEY (zone_id) REFERENCES Zones (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  PRIMARY KEY (`_id`) );

CREATE TABLE IF NOT EXISTS `devbot`.`Apparts` (
  `_id` int NOT NULL AUTO_INCREMENT ,
  `geo_id` int NOT NULL  ,
  `title` VARCHAR(300) ,
  `price` SMALLINT ,
  `link` VARCHAR(255) ,
  `description` VARCHAR(400) ,
  `date` DATETIME ,
  `rooms` ENUM( '1', '2', '3', '4', '5', '6', '7' ) ,
  FOREIGN KEY (geo_id) REFERENCES Geo (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  PRIMARY KEY (`_id`) );

CREATE TABLE IF NOT EXISTS `devbot`.`Apparts_Users` (
  `appart_id` int NOT NULL ,
  `users_id` int NOT NULL ,
  FOREIGN KEY (appart_id) REFERENCES Apparts (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (users_id) REFERENCES Users (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  PRIMARY KEY (appart_id,users_id)
  );


