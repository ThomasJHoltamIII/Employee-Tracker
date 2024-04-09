
### Employee Tracker


## Description

Employee Tracker offers a streamlined command-line interface for navigating and managing a company's employee database. Designed to simplify the complexities of database management, this application empowers users to effortlessly access and manipulate data related to departments, roles, and employees. Developed with Node.js, Inquirer, and MySQL, it provides a user-friendly platform for business organization and planning, making it an ideal tool for individuals without a development background to efficiently oversee intricate databases.

## Features

- **Employee Management:**
  - `View All Employees`: Display a list of all employees.
  - `Add Employee`: Add a new employee to the database.
  - `Update Employee Role`: Change the role of an existing employee.
  - `Update Employee Manager`: Assign a new manager to an employee.
  - `Delete Employee`: Remove an employee from the database.

- **Department Management:**
  - `View All Departments`: List all departments.
  - `Add Department`: Create a new department.
  - `Delete Department`: Remove a department.

- **Role Management:**
  - `View All Roles`: Show all roles within the company.
  - `Delete Role`: Eliminate a role from the company.

- **Viewing Options:**
  - `View Employees By Manager`: See employees grouped by their manager.
  - `View Employees By Departments`: Display employees based on their department.

- **Budget Management:**
  - `View Budget of a Department`: Calculate the total salaries for a department.


## Video

https://drive.google.com/file/d/1ClCu3mYbjR9rXXdolidkyrCZd9-KRYq4/view?usp=drive_link

## Usage

## Getting Started with Employee Tracker

Follow these steps to set up the Employee Tracker application on your system:

1. **Clone the Repository**
   - Clone the repository to your local machine.

2. **Install Dependencies**
   - Navigate into the cloned repository directory:

   - Install the required dependencies with npm: npm i

3. **Database Setup**
   - Log into your MySQL shell: mysql -u root -p
   
   - Source the `schema.sql` file to create the database and tables: SOURCE schema.sql;
   - Optionally, source the `seeds.sql` file to populate the database with initial data:

4. **Run the Application**
   - Start the application with: npm start

Now, you're ready to use the Employee Tracker to manage your company's database!


## Author

Thomas Holtam
