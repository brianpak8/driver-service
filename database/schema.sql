DROP DATABASE if exists `driverservice`;
CREATE DATABASE `driverservice`;

USE `driverservice`;

CREATE TABLE `drivers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR (25),
  `password` VARCHAR (25),
  `first_name` VARCHAR (25),
  `last_name` VARCHAR (25),
  `phone_number` VARCHAR (11),
  `picture` VARCHAR (255),
  `rating` FLOAT (3, 2),
  PRIMARY KEY (`id`)
);

CREATE TABLE `vehicles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `license_plate` VARCHAR(25),
  `make` VARCHAR (25),
  `model` VARCHAR (25),
  `color` VARCHAR (25),
  `year` YEAR,
  `capacity` INT,
  `picture` VARCHAR (255),
  PRIMARY KEY (`id`)
);

CREATE TABLE `drivers_vehicles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `driver_id` INT,
  `vehicle_id` INT,
  PRIMARY KEY (`id`)
);

CREATE TABLE `available_rides` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `driver_vehicle_id` INT,
  `status` BOOL,
  `latitude` DOUBLE,
  `longitude` DOUBLE,
  `current_ride_id` INT,
  `type` VARCHAR (25),
  PRIMARY KEY (`id`)
);


ALTER TABLE `drivers_vehicles` ADD FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`);
ALTER TABLE `drivers_vehicles` ADD FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`);
ALTER TABLE `available_rides` ADD FOREIGN KEY (`driver_vehicle_id`) REFERENCES `drivers_vehicles` (`id`);


INSERT INTO drivers (first_name, last_name) VALUES ('Allen', 'Price');
INSERT INTO drivers (first_name, last_name) VALUES ('Beth', 'Johnson');
INSERT INTO drivers (first_name, last_name) VALUES ('Doug', 'Calhoun');
INSERT INTO drivers (first_name, last_name) VALUES ('Easak', 'Hong');
