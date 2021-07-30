//brings in the inquirer
const inquirer = require('inquirer');
// brings in mysql
const mysql = require('mysql');
//brings in fs
const fs = require('fs');
//brings in path
const path = require('path');
//brings in util
const util = require('util');
//brings in the tables
const cTable = require('console.table');
//brings in the rawlist
const RawList = require('prompt-rawlist');
//creates the connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Canada1',
  database: 'employeedb',
});
//makes the connection
connection.connect((err) => {
  if (err) throw err;

  runSearch();
  
});
//starts the application
const runSearch = () => {
  //creates the list the user interacts with in the client
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Find All Departments",
        "Find All Roles",
        "Find all Employees",
        "Find Employee by Manager",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update Employee Role",
        "Delete an Employee",
        "Quit"
      ],
    })

    .then((answer) => {
      switch (answer.action) {
        case "Find All Departments":
          console.log (answer);
          departmentSearch();
          break;

        case "Find All Roles":
          roleSearch();
          break;

        case "Find all Employees":
          employeeSearch();
          break;

        case "Find Employee by Manager":
          managerSearch();
          break;

        case "Add a Department":
          addDepartmentSearch();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Add an Employee":
          addEmployeeSearch();
          break;

        case "Update Employee Role":
          updateRoleSearch();
          break;

        case "Delete an Employee":
          deleteEmployee();
          break;

          case "Quit":
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }

    });

};

//Shows the employee by department
const departmentSearch = () => {
  const query =
    "SELECT id, name from department;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log(err, res);
  
    console.table(res);
    runSearch();
  });
};
//Shows the employee by role
const roleSearch = () => {
  const query =
    "SELECT role.id, title, salary, department.name AS department from role LEFT JOIN department on role.department_id = department.id;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};
//Shows all the employees
const employeeSearch = () => {
  const query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};
//Shows tables availabe with the manager name and id
const managerSearch = () => {
  inquirer
    .prompt({
     name: 'manager',
     type: 'input',
      message: 'enter the manager name you would like to search employees responsible for',
    })
    .then((answer) => {
  //const manager = (answer.manager),
  const query = connection.query(
    "SELECT e.id, e.first_name, e.last_name, role.title FROM employeedb.employee e LEFT JOIN employeedb.role ON e.role_id = employeedb.role.id LEFT JOIN employeedb.employee m ON e.manager_id = m.id where m.last_name = ?",[(answer.manager)],
 // connection.query(query, {last_name: answer.manager}, (err, res) => {
  (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
});
};


//Adds a department
const addDepartmentSearch = () => {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      message: "Please select a new Department.",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department (department.name) VALUES (?)",
        answer.newDepartment,
        (err, res) => {
          if (err) throw err;
          {
            console.log("Department change has been added.. good show");

            runSearch();
          }
        }
      );
    });
};

//Create a new role with name, salary and department
const addRole = () => {
  const query = "SELECT * FROM department;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    let NewDepartment = [];
    res.map((results) => {
      NewDepartment.push({
        name: results.name,
        value: results.id,
      });
    });
    // NewDepartment.push("new department");
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "What is the name of the role you'd like to add?",
        },
        {
          name: "salary",
          type: "input",
          message: "money.?", 
        },
        {
          name: "department",
          type: "list",
          message: "Please select a new Department.?",
          choices: NewDepartment,
        },
      ])
      .then((res) => {
        connection.query(
          `INSERT INTO employeedb.role ( title, salary, department_id) values ("${res.name}", "${res.salary}", ${res.department})`,
          (err, res) => {
            if (err) {
              console.log(err);
            } else {
              runSearch();
            }
          }
        );
      });
  });
};
// adds an empoyee 
const addEmployeeSearch = () => {
  const query = "SELECT id, title, department_id FROM role";
  connection.query(query, (req, res) => {
    let role_choice = res.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the Employees First Name?",
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the Employees Last Name?",
        },
        {
          type: "list",
          name: "role",
          message: "What is the role assigned for the employee?",
          choices: role_choice,
        },
      ])
      .then((res) => {
        console.log(res);
        connection.query(
          `INSERT INTO employeedb.employee (first_name, last_name, role_id) VALUES ("${res.first_name}", "${res.last_name}", ${res.role});`,
          (err, res) => {
            console.log("employee has been added");
            if (err) {
              console.log(err);
            } else {
              runSearch();
            }
          }
        );
      });
  });
};
// updates the role id 
const updateRoleSearch = () => {
  const query = "SELECT id, title, department_id FROM role";
  connection.query(query, (req, res) => {
    let role_choice = res.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the Employees First Name?",
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the Employees Last Name?",
        },
        {
          type: "list",
          name: "role",
          message: "What is the role assigned for the employee?",
          choices: role_choice,
        },
      ])
      .then((answer) => {
        console.log(answer);
        connection.query(
          `UPDATE employeedb.employee set ? where ? `,
          [
              {role_id: answer.role,},
              {last_name: answer.last_name,},
              {first_name: answer.first_name,},

          ],
          (err) => {
            console.log("employee and role has been updated");
            if (err) {
              console.log(err);
            } else {
              runSearch();
            }
          }
        );
      });
  });
};

const deleteEmployee = () => {
  // // const query = "SELECT first_name, last_name, role_id FROM employee";
  // // connection.query(query, (req, res) => {
  //   let employee_choice = res.map((employee) => ({
  //     name: employee.first_name + employee.last_name,
  //     value: employee.role_id,
  //    }));
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the Employees First Name?",
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the Employees Last Name?",
        },
        

      ])
      .then((answer) => {
        console.log(answer);
        connection.query(
          `DELETE FROM employeedb.employee WHERE ?`,
        [
          {first_name: answer.first_name,},
          {last_name: answer.last_name,},
        ],
          (err) => {
            console.log("employee and role has been deleted");
            if (err) {
              console.log(err);
            } else {
              runSearch();
            }
          }
        );
      });
  };

