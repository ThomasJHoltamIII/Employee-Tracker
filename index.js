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

const mainLoop = async () => {
  while (true) {
    const answer = await prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View Employees By Manager',
          'View all Employees',
          'Add Employee',
          'View all Departments',
          'Add Department',
          // 'Delete Department',
          'View all Roles',
          'Exit',
        ],
      },
    ])
    switch (answer.action) {
      case 'View Employees By Manager':
        await viewEmployeesByManager()
        break;

      case 'View all Employees':
        await viewAllEmployees()
        break;

      case 'View all Departments':
        await viewDepartments()
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
        
        // case 'Delete Department':
        //   await deleteDepartments()
        //   break;

        case 'Exit':
        connection.end()
        console.log('See you again soon!')
        process.exit()
    }
  }
};

const getManagers = async () => {
  const query = 'SELECT manager_id, CONCAT(first_name, " ", last_name) AS manager_name FROM managers'
  try {
    const managers = await queryAsync(query)
    return managers
  } catch (err) {
    console.log(err)
    return []
  }
};

const getEmployee = async () => {
  const query = 'SELECT employee_id, CONCAT(first_name, " ", last_name) AS employee_name FROM employees'
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

const getRoles= async () => {
  const query = 'SELECT role_id, CONCAT(title) AS role_name FROM role'
  try {
    const roles = await queryAsync(query)
    return roles
  } catch (err) {
    console.log(err)
    return []
  }
};

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
const insertQuery = 'INSERT IGNORE INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
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
    const employees = await queryAsync(departmentQuery, departmentValues)
    console.table(employees)
  } catch (err) {
    console.log(err)
  }
};

const viewEmployeesByManager = async () => {
  const managers = await getManagers()
  const managerSelect = await prompt({
    type: 'list',
    name: 'manager_choice',
    message: 'Select a manager:',
    choices: managers.map(manager => ({
      name: manager.manager_name,
      value: manager.manager_id,
    })).concat('Back'),
  })
  if (managerSelect.manager_choice === 'Back') {return}
  const employeeByManagerQuery = 'SELECT * FROM employees WHERE manager_id = ?'
  const employeeByManagerValues = [managerSelect.manager_choice]
  try {
    const employeesByManager = await queryAsync(employeeByManagerQuery, employeeByManagerValues)
    console.table(employeesByManager)
  } catch (err) {
    console.log(err)
  }
};

const viewAllEmployees = async () => {
  const employees = await getEmployee()
  const employeeSelect = await prompt({
    type: `list`,
    name: `employee_choice`,
    choices: employees.map(employee => ({
      name: employee.employee_name,
      value: employee.employee_id,
    })).concat(`Back`)
  })
  if (employeeSelect.employee_choice === `Back`) {return}
  const employeeQuery = `
  SELECT employees.*, managers.first_name AS manager_first_name, managers.last_name AS manager_last_name
  FROM employees
  JOIN managers ON employees.manager_id = managers.manager_id
  WHERE employees.employee_id = ?`
  const employeeView = [employeeSelect.employee_choice]
  try {
    const employees = await queryAsync(employeeQuery, employeeView)
    console.table(employees)
  } catch (err) {
    console.log(err)
  }
};


mainLoop()


