-- -----------------------------------------------------
-- Schema weatherStation
-- -----------------------------------------------------
SET @OLD_SQL_MODE=@@SQL_MODE;
SET SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS;
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS;
SET FOREIGN_KEY_CHECKS=0;

CREATE DATABASE IF NOT EXISTS `weatherStation` DEFAULT CHARACTER SET utf8 ;
USE `weatherStation` ;

-- -----------------------------------------------------
-- Table `weatherStation`.`Sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `weatherStation`.`Sensor` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(128) NULL,
  `Status` VARCHAR(128) NULL,
  `LastStatus` DATETIME NULL,
  `APIKey` VARCHAR(16) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE INDEX `ID_UNIQUE` (`ID` ASC),
  UNIQUE INDEX `APIKey_UNIQUE` (`APIKey` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `weatherStation`.`Data`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `weatherStation`.`Data` (
  `Time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `SensorID` INT NOT NULL,
  `Temperature` FLOAT NULL,
  `Humidity` FLOAT NULL,
  INDEX `SensorIDd_idx` (`SensorID` ASC),
  CONSTRAINT `SensorIDd`
    FOREIGN KEY (`SensorID`)
    REFERENCES `weatherStation`.`Sensor` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `weatherStation`.`SensorConfig`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `weatherStation`.`SensorConfig` (
  `SensorID` INT NOT NULL,
  `Interval` INT NULL,
  `Debug` TINYINT(1) NOT NULL DEFAULT 0,
  `DebugHost` VARCHAR(128) NULL,
  PRIMARY KEY (`SensorID`),
  UNIQUE INDEX `SensorID_UNIQUE` (`SensorID` ASC),
  CONSTRAINT `SensorIDsc`
    FOREIGN KEY (`SensorID`)
    REFERENCES `weatherStation`.`Sensor` (`ID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
