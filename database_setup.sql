CREATE DATABASE IF NOT EXISTS clickfit;

USE clickfit;

CREATE TABLE IF NOT EXISTS users (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
    `password` VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
    `type` VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
    `active` TINYINT default 1,
    PRIMARY KEY (`ID`)
);

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS `addUser`(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255), 
    IN p_type VARCHAR(255)
)
BEGIN
    INSERT INTO users (email, password, type, active)
    VALUES (p_email, p_password, p_type, 1);
END//
DELIMITER ;

CALL addUser('admin@clickfit.com', 'admin123', 'admin');
CALL addUser('user@clickfit.com', 'user123', 'user'); 