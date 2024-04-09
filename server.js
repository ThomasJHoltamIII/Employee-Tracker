const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee_tracker_db',
});

const queryAsync = util.promisify(connection.query).bind(connection);
const prompt = inquirer.createPromptModule();

connection.connect((err) => {
  if (err) throw err
  console.log('Roger Roger')
});

// Main Inquirer pormpt loop
const mainLoop = async () => {
  while (true) {
    try {
    const answer = await prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View employee By Manager',
          'View all employee',
          'Add Employee',
          'Update Employee Role',
          'View all Roles',
          'Update Employee Manager',
          'View Employee By Departments',
          'View all Departments',
          'View Departments Budget',
          'Add Department',
          'Delete Department',
          'Delete Employee',
          'Delete Role',
          'Exit',
        ],
      },
    ])
    // Functions to fire off prompts for specific queries
    switch (answer.action) {
      case 'View employee By Manager':
        await viewEmployeesByManager()
        break;

      case 'View all employee':
        await viewAllEmployees()
        break;

      case 'View all Departments':
        await viewDepartments()
        break;

      case 'View Departments Budget':
        await viewDepartmentBudget()
        break;

      case 'View all Roles':
        await viewRoles()
        break;

      case 'Add Department':
        await addDepartment()
        break;

      case 'Add Employee':
        await addEmployee()
        break;

      case 'Update Employee Role':
        await updateEmployeeRole()
        break;

      case 'Update Employee Manager':
        await updateEmployeeManager()
        break;

      case 'View Employee By Departments':
        await viewEmployeesByDepartment()
        break;
        
        case 'Delete Department':
          await deleteDepartments()
          break;
        
        case 'Delete Employee':
          await deleteEmployees()
          break;
        
        case 'Delete Role':
          await deleteRoles()
          break;

          case 'Exit':
            console.log('See you again soon!');
            connection.end();
            process.exit();
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

// Get functions using async that are called on in later queries that specify certian data that is needed, such as first and last names
const getManagers = async () => {
  const query = `
    SELECT employee_id AS manager_id, CONCAT(first_name, " ", last_name) AS manager_name 
    FROM employee
    WHERE employee_id IN (SELECT DISTINCT manager_id FROM employee WHERE manager_id IS NOT NULL)
  `;
  try {
    const managers = await queryAsync(query);
    return managers;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getEmployee = async () => {
  const query = 'SELECT employee_id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee'
  try {
    const managers = await queryAsync(query)
    return managers
  } catch (err) {
    console.log(err)
    return []
  }
};

const getDepartments = async () => {
  const query = 'SELECT * FROM department'
  try {
    const departments = await queryAsync(query)
    return departments
  } catch (err) {
    console.log(err)
    return []
  }
};

const getRoles = async () => {
  const query = 'SELECT role_id, title AS role_name FROM role';
  try {
    const roles = await queryAsync(query);
    return roles;
  } catch (err) {
    console.log(err);
    return [];
  }
};

// Add department
const addDepartment = async () => {
  const newDepartment = await prompt([
    {
      type: 'input',
      name: 'department_name',
      message: 'Enter the name of the new department:'
    }
  ])
  const insertQuery = 'INSERT INTO department (department_name) VALUES (?)'
  try {
    const newDepartmentAdded = await queryAsync(insertQuery, [newDepartment.department_name])
    console.table(newDepartmentAdded)
  } catch (err) {
    console.error(err)
  }
};


// Add employee
const addEmployee = async () => {
  const roles = await getRoles()
  const managers = await getManagers()
  const roleChoices = roles.map(role => ({
    name: role.role_name,
    value: role.role_id
  }))
  const managerChoices = managers.map(manager => ({
    name: manager.manager_name,
    value: manager.manager_id
  }))
  const employeeDetails = await prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter the first name of the new Employee:'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter the last name of the new Employee:'
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the role of the new Employee:',
      choices: roleChoices
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select the manager of the new Employee:',
      choices: managerChoices
    }
  ])
const insertQuery = 'INSERT IGNORE INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
  try {
    const newEmployeeAdded = await queryAsync(insertQuery, [
      employeeDetails.first_name,
      employeeDetails.last_name,
      employeeDetails.role_id,
      employeeDetails.manager_id
    ])
    console.table(newEmployeeAdded)
    console.log('Employee added successfully.')
  } catch (err) {
    console.error(err)
  }
};


//  Update Employee Role
const updateEmployeeRole = async () => {
  const employee = await getEmployee()
  const employeeSelect = await prompt({
    type: `list`,
    name: `employee_choice`,
    choices: employee.map(employee => ({
      name: employee.employee_name,
      value: employee.employee_id,
    })).concat(`Back`)
  })
  if (employeeSelect.employee_id === 'Back') {
    return
  }

  // This structure is used in almost every function, calling upon earlier get functions and then taking their data into a prompt
  // This prompt data is selected by the user and used in the SQL query

  const roles = await getRoles()
  const roleSelect = await prompt({
    type: 'list',
    name: 'role_choice',
    message: 'Select a role',
    choices: roles.map(role => ({
      name: role.role_name,
      value: role.role_id,
    })).concat('Back'),
  })
  if (roleSelect.role_choice === 'Back') {
    return
  }
  if (roleSelect.role_id === 'Back') {
    return
  }
  const updateQuery = 'UPDATE employee SET role_id = ? WHERE employee_id = ?'
  const updateValues = [roleSelect.role_id, employeeSelect.employee_id]

  try {
    await queryAsync(updateQuery, updateValues)
    console.log('Employee role updated successfully.')
  } catch (err) {
    console.error(err)
  }
};


// Update Employee Manager
const updateEmployeeManager = async () => {
  const employee = await getEmployee()
  const employeeSelect = await prompt({
    type: `list`,
    name: `employee_choice`,
    choices: employee.map(employee => ({
      name: employee.employee_name,
      value: employee.employee_id,
    })).concat(`Back`)
  })
  if (employeeSelect.employee_id === 'Back') {
    return
  }
  const managers = await getManagers()
  const managerChoices = managers.map(manager => ({
    name: manager.manager_name,
    value: manager.manager_id
  }))
  const managerChoice = await prompt({
    type: 'list',
    name: 'manager_id',
    message: 'Select the new manager for the employee:',
    choices: managerChoices.concat('Back'),
  })
  if (managerChoice.manager_id === 'Back') {
    return
  }
  const updateQuery = 'UPDATE employee SET manager_id = ? WHERE employee_id = ?'
  const updateValues = [managerChoice.manager_id, employeeSelect.employee_id]
  try {
    await queryAsync(updateQuery, updateValues)
    console.log('Employee manager updated successfully.')
  } catch (err) {
    console.error(err)
  }
}


// View Roles
const viewRoles = async () => {
  const roles = await getRoles()
  const roleSelect = await prompt({
    type: 'list',
    name: 'role_choice',
    message: 'Select a role',
    choices: roles.map(role => ({
      name: role.role_name,
      value: role.role_id,
    })).concat('Back'),
  });
  if (roleSelect.role_choice === 'Back') {
    return
  }
  // Query made to show the name of the department and not just the ID in the table
  const roleQuery = `
  SELECT role.*, department.department_name
  FROM role
  JOIN department ON role.department_id = department.department_id
  WHERE role.role_id = ?`;
  const roleValues = [roleSelect.role_choice]
  try {
    const rolesTable = await queryAsync(roleQuery, roleValues)
    console.table(rolesTable)
  } catch (err) {
    console.log(err)
  }
};


// View department
const viewDepartments = async () => {
  const departments = await getDepartments()
  const departmentSelect = await prompt({
    type: 'list',
    name: 'department_choice',
    message: 'Select a department',
    choices: departments.map(department => ({
      name: department.department_name,
      value: department.department_id,
    })).concat('Back'),
  });
  if (departmentSelect.department_choice === 'Back') {
    return
  }
  const departmentQuery = 'SELECT * FROM department WHERE department_id = ?'
  const departmentValues = [departmentSelect.department_choice]
  try {
    const employee = await queryAsync(departmentQuery, departmentValues)
    console.table(employee)
  } catch (err) {
    console.log(err)
  }
};

// View department budget
const viewDepartmentBudget = async () => {
  const departments = await getDepartments();
  const departmentSelect = await prompt({
    type: 'list',
    name: 'department_choice',
    message: 'Select a department to view its utilized budget:',
    choices: departments.map(department => ({
      name: department.department_name,
      value: department.department_id,
    })).concat('Back'),
  });
  if (departmentSelect.department_choice === 'Back') {
    return;
  }
  const budgetQuery = `
    SELECT d.department_name, SUM(r.salary) AS total_budget
    FROM employee e
    JOIN role r ON e.role_id = r.role_id
    JOIN department d ON r.department_id = d.department_id
    WHERE d.department_id = ?
    GROUP BY d.department_name`;
  try {
    const [budget] = await queryAsync(budgetQuery, [departmentSelect.department_choice]);
    if (budget.total_budget) {
      console.log(`The total budget for the ${budget.department_name} is: $${budget.total_budget}`);
    } else {
      console.log(`No budget for the ${budget.department_name} department.`);
    }
  } catch (err) {
    console.error(err);
  }
};


// View Employee by manager
const viewEmployeesByManager = async () => {
  const managers = await getManagers();
  const managerSelect = await prompt({
    type: 'list',
    name: 'manager_choice',
    message: 'Select a manager:',
    choices: managers.map(manager => ({
      name: manager.manager_name,
      value: manager.manager_id,
    })).concat('Back'),
  });
  if (managerSelect.manager_choice === 'Back') return;

  const employeeByManagerQuery = 'SELECT * FROM employee WHERE manager_id = ?';
  const employeeByManagerValues = [managerSelect.manager_choice];
  try {
    const employeesByManager = await queryAsync(employeeByManagerQuery, employeeByManagerValues);
    console.table(employeesByManager);
  } catch (err) {
    console.log(err);
  }
};

//  View Employee by department
const viewEmployeesByDepartment = async () => {
  const departments = await getDepartments()
  const departmentSelect = await prompt({
    type: 'list',
    name: 'department_choice',
    message: 'Select a Department',
    choices: departments.map(department => ({
      name: department.department_name,
      value: department.department_id,
    })).concat('Back'),
  })
  if (departmentSelect.department_choice === 'Back') {
    return
  }
  const employeeByDepartmentQuery = 'SELECT * FROM employee WHERE role_id IN (SELECT role_id FROM role WHERE department_id = ?)'
  const employeeByDepartmentValues = [departmentSelect.department_choice]
  try {
    const employeesByDepartment = await queryAsync(employeeByDepartmentQuery, employeeByDepartmentValues)
    console.table(employeesByDepartment);
  } catch (err) {
    console.log(err)
  }
};


// view all employee
const viewAllEmployees = async () => {
  const employees = await getEmployee();
  const employeeSelect = await prompt({
    type: `list`,
    name: `employee_choice`,
    choices: employees.map(employee => ({
      name: employee.employee_name,
      value: employee.employee_id,
    })).concat(`Back`)
  });
  if (employeeSelect.employee_choice === `Back`) {return;}
  const employeeQuery = `
    SELECT e.employee_id, e.first_name, e.last_name, m.first_name AS manager_first_name, m.last_name AS manager_last_name
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.employee_id
    WHERE e.employee_id = ?`;
  const employeeView = [employeeSelect.employee_choice];
  try {
    const employeeDetails = await queryAsync(employeeQuery, employeeView);
    console.table(employeeDetails);
  } catch (err) {
    console.log(err);
  }
};


//  All the delete functions work about the same, using the same structure as earlier they have helper functions they call on
const deleteDepartment = async (departmentId) => {
  const deleteQuery = 'DELETE IGNORE FROM department WHERE department_id = ?'
  try {
    await queryAsync(deleteQuery, [departmentId])
    console.log(`Department deleted.`)
  } catch (err) {
    console.error(err)
  }
}

const deleteDepartments = async () => {
  // calling upon getDepartments and using the same prompt scaffold as the main functions
  const departments = await getDepartments()
  const departmentSelect = await prompt({
    type: 'list',
    name: 'department_choice',
    message: 'Select a department to delete:',
    choices: departments.map(department => ({
      name: department.department_name,
      value: department.department_id,
    })).concat('Back'),
  })
  if (departmentSelect.department_choice === 'Back') {
    return
  }
  try {
    // calling on the helper function to actually run the delete qeury
    await deleteDepartment(departmentSelect.department_choice)
    console.log('Department deleted successfully.')
  } catch (err) {
    console.error(err)
  }
};


// Delete Employee
const deleteEmployee = async (employeeId) => {
  const deleteQuery = 'DELETE IGNORE FROM employee WHERE employee_id = ?'
  try {
    await queryAsync(deleteQuery, [employeeId])
    console.log(`Employee deleted.`)
  } catch (err) {
    console.error(err)
  }
};

const deleteEmployees = async () => {
  const employee = await getEmployee()
  const employeeSelect = await prompt({
    type: `list`,
    name: `employee_choice`,
    choices: employee.map(employee => ({
      name: employee.employee_name,
      value: employee.employee_id,
    })).concat(`Back`)
  })
  if (employeeSelect.employee_choice === 'Back') {
    return
  }
  try {
    await deleteEmployee(employeeSelect.employee_choice)
    console.log('Employee deleted successfully.')
  } catch (err) {
    console.error(err)
  }
};

// Delete Role
const deleteRole = async (roleId) => {
  const deleteQuery = 'DELETE IGNORE FROM role WHERE role_id = ?';
  try {
    await queryAsync(deleteQuery, [roleId])
    console.log(`Role deleted.`)
  } catch (err) {
    console.error(err)
  }
};

const deleteRoles = async () => {
  const roles = await getRoles()
  const roleSelect = await prompt({
    type: 'list',
    name: 'role_choice',
    message: 'Select a role',
    choices: roles.map(role => ({
      name: role.role_name,
      value: role.role_id,
    })).concat('Back'),
  });
  if (roleSelect.role_choice === 'Back') {
    return;
  }
  try {
    await deleteRole(roleSelect.role_choice)
    console.log('Role deleted successfully.')
  } catch (err) {
    console.error(err);
  }
};

// Run the Command line prompts
mainLoop()


