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
          'View employees by manager',
          'View all employees',
          'Exit',
        ],
      },
    ])
    switch (answer.action) {
      case 'View employees by manager':
        await viewEmployeesByManager()
        break;

      case 'View all employees':
        await viewAllEmployees()
        break;

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
  const employeeQuery = `SELECT * FROM employees WHERE employee_id = ?`
  const employeeView = [employeeSelect.employee_choice]
  try {
    const employees = await queryAsync(employeeQuery, employeeView)
    console.table(employees)
  } catch (err) {
    console.log(err)
  }
};


mainLoop()


