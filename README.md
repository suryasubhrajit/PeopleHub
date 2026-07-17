# People Hub API

A Node.js and Express.js REST API for managing departments and employees with a MySQL database.

## Prerequisites
- Node.js (v16+)
- MySQL Server

## Getting Started

### 1. Installation
Clone/extract the project, navigate to the directory, and install dependencies:
```bash
npm install
```

### 2. Database Setup
1. Open your MySQL client (e.g. MySQL Command Line Client, phpMyAdmin, Workbench).
2. Execute the commands in [schema.sql](schema.sql) to create the `people_hub` database, create the required tables, and insert test seed data.

### 3. Environment Configuration
Create a `.env` file in the root directory (an example is provided in `.env`) and adjust the configuration:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=people_hub
```

### 4. Running the Server
Run the following command to start the application:
```bash
npm start
```
The server will start on the port configured in `.env` (default is `3000`).

---

## API Documentation

### Departments

#### 1. Create Department
- **URL:** `/departments`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "departmentName": "Finance"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Department created successfully",
    "data": {
      "id": 5,
      "departmentName": "Finance"
    }
  }
  ```

#### 2. List Departments
- **URL:** `/departments`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "count": 4,
    "data": [
      { "id": 1, "departmentName": "Human Resources", "createdAt": "..." }
    ]
  }
  ```

#### 3. Update Department
- **URL:** `/departments/:id`
- **Method:** `PUT`
- **Body:**
  ```json
  {
    "departmentName": "Human Resources & Talent"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Department updated successfully",
    "data": {
      "id": 1,
      "departmentName": "Human Resources & Talent"
    }
  }
  ```

#### 4. Delete Department
- **URL:** `/departments/:id`
- **Method:** `DELETE`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Department deleted successfully"
  }
  ```
- *Note:* Returns `400 Bad Request` if employees exist in the department.

---

### Employees

#### 1. Add Employee
- **URL:** `/employees`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "employeeCode": "EMP100",
    "fullName": "Sarah Connor",
    "email": "sarah.connor@example.com",
    "mobile": "1234567890",
    "departmentId": 2,
    "designation": "Staff Engineer",
    "salary": 110000.00,
    "status": "Active"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Employee added successfully",
    "data": { ... }
  }
  ```

#### 2. List Employees (with pagination, search, filters)
- **URL:** `/employees`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `search` (searches fullName, employeeCode, email)
  - `departmentId` (filter by department ID)
  - `status` (filter by 'Active' or 'Inactive')
- **Example URL:** `/employees?page=1&limit=5&search=John&status=Active`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 5,
      "totalPages": 1
    },
    "data": [ ... ]
  }
  ```

#### 3. Get Employee Details (with department name)
- **URL:** `/employees/:id`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "employeeCode": "EMP001",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "mobile": "9876543210",
      "departmentId": 2,
      "designation": "Senior Software Engineer",
      "salary": "95000.00",
      "status": "Active",
      "createdAt": "...",
      "departmentName": "Engineering"
    }
  }
  ```

#### 4. Update Employee
- **URL:** `/employees/:id`
- **Method:** `PUT`
- **Body:** (same as Add Employee)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Employee updated successfully",
    "data": { ... }
  }
  ```

#### 5. Delete Employee
- **URL:** `/employees/:id`
- **Method:** `DELETE`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Employee deleted successfully"
  }
  ```

#### 6. Activate/Deactivate Employee
- **URL:** `/employees/:id/status`
- **Method:** `PATCH`
- **Body:**
  ```json
  {
    "status": "Inactive"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Employee status updated to Inactive successfully"
  }
  ```

#### 7. Export Employees to CSV (Bonus)
- **URL:** `/employees/export`
- **Method:** `GET`
- **Query Parameters:** (Supports same filters as List: `search`, `departmentId`, `status`)
- **Response:** Downloads a `.csv` file (`employees_export.csv`) containing the filtered records.

---

### Dashboard Statistics

#### 1. Get Statistics
- **URL:** `/dashboard`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "totalDepartments": 4,
      "totalEmployees": 4,
      "statusBreakdown": [
        { "status": "Active", "count": 3 },
        { "status": "Inactive", "count": 1 }
      ],
      "departmentBreakdown": [
        { "departmentId": 1, "departmentName": "Human Resources", "employeeCount": 1 },
        { "departmentId": 2, "departmentName": "Engineering", "employeeCount": 2 }
      ],
      "salaryAnalytics": {
        "averageSalary": 75000,
        "maxSalary": 95000,
        "minSalary": 60000
      }
    }
  }
  ```

---

## Submission Artifacts
- **Source Code:** Fully contained in this directory.
- **SQL Schema Script:** [schema.sql](schema.sql)
- **Postman Collection:** [People_Hub_API.postman_collection.json](People_Hub_API.postman_collection.json)
