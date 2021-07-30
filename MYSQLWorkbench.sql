DROP DATABASE IF EXISTS employeedb;
CREATE DATABASE employeedb;

USE employeedb;


CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT, 
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL, 
  manager_id INT, 
  PRIMARY KEY (id)
);
USE employeedb;

INSERT INTO department (name)
VALUES ("DEV"), ("Engineering"), ("HR"), ("Legal"), ("Writters");

INSERT INTO role (title, salary, department_id)
VALUES  ("Developer", 55000, "1"), ("Engineer", 65000, "2"), 
("Lawyer", 90000, "4"), ("Administrative", 40000, "3"), ("Accountant", 80000, "5"), ("Senior Writter", 110000, "2"), ('Payroll', 45000, '5');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Todd", "Kelly", "1", "1"), ("Mary", "Scrim", "2", "1"), 
("Kevin", "Newell", "4", "1"), ("Becca", "Newell", "3", "1"), ("Copper", "Canine", "3", "1"), ("Lilly", "Lagotto", "2", "2"), ('Eric', 'Church', '3', '2');