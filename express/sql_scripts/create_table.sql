DROP TABLE IF EXISTS Apparts;
DROP TABLE IF EXISTS Apparts_Users;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Zones;
DROP TABLE IF EXISTS Geo;


CREATE TABLE IF NOT EXISTS `devbot`.`Apparts` (
  `_id` int NOT NULL AUTO_INCREMENT ,
  `title` VARCHAR(300) ,
  `price` SMALLINT ,
  FOREIGN KEY (geo_id) NOT NULL REFERENCES Geo (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  `link` VARCHAR(255) ,
  `description` VARCHAR(400) ,
  `date` DATETIME ,
  `rooms` ENUM( '1', '2', '3', '4', '5', '6', '7' ) ,
  PRIMARY KEY (`_id`) );

CREATE TABLE IF NOT EXISTS `devbot`.`Apparts_Users` (
  `_id` int NOT NULL AUTO_INCREMENT ,
  FOREIGN KEY (appart_id) REFERENCES Apparts (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (users_id) REFERENCES Users (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  PRIMARY KEY (appart_id, users_id,)
  PRIMARY KEY (`_id`) );


CREATE TABLE IF NOT EXISTS `devbot`.`Users` (
  `_id` int NOT NULL AUTO_INCREMENT ,
  `lastname` VARCHAR(100) ,
  `firstname` VARCHAR(100) ,
  `email` VARCHAR(100) ,
  `coins` int ,
  PRIMARY KEY (`_id`) );

CREATE TABLE IF NOT EXISTS `devbot`.`Zones` (
  `_id` int NOT NULL AUTO_INCREMENT ,
  FOREIGN KEY (users_id) REFERENCES Users (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  PRIMARY KEY (`_id`) );

CREATE TABLE IF NOT EXISTS `devbot`.`Geo` (
  `_id` int NOT NULL AUTO_INCREMENT ,
  FOREIGN KEY (zone_id) REFERENCES Zones (_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  `lat` DECIMAL(10, 8) ,
  `lng` DECIMAL(11, 8)  ,
  PRIMARY KEY (`_id`) );