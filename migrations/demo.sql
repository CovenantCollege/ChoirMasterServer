CREATE DATABASE choirmaster;
CREATE USER 'choirmaster'@'localhost' IDENTIFIED BY 'choirmaster';
GRANT ALL PRIVILEGES ON choirmaster.* TO 'choirmaster'@'localhost';

USE choirmaster;
CREATE TABLE singers (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), height VARCHAR(255));
