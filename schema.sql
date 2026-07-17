-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS people_hub;
USE people_hub;

-- Table 1: departments
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departmentName VARCHAR(100) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: employees
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeCode VARCHAR(20) UNIQUE,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    mobile VARCHAR(15),
    departmentId INT,
    designation VARCHAR(100),
    salary DECIMAL(10,2),
    status ENUM('Active','Inactive') DEFAULT 'Active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (departmentId) REFERENCES departments(id)
);

-- Seed Data (Optional but recommended for testing)
INSERT IGNORE INTO departments (id, departmentName) VALUES
(1, 'Human Resources'),
(2, 'Engineering'),
(3, 'Marketing'),
(4, 'Sales');

INSERT IGNORE INTO employees (employeeCode, fullName, email, mobile, departmentId, designation, salary, status) VALUES
('EMP001', 'John Doe', 'john.doe@example.com', '9876543210', 2, 'Senior Software Engineer', 95000.00, 'Active'),
('EMP002', 'Jane Smith', 'jane.smith@example.com', '9876543211', 1, 'HR Manager', 75000.00, 'Active'),
('EMP003', 'Bob Johnson', 'bob.johnson@example.com', '9876543212', 2, 'QA Engineer', 60000.00, 'Inactive'),
('EMP004', 'Alice Brown', 'alice.brown@example.com', '9876543213', 3, 'Marketing Lead', 70000.00, 'Active');
