//brings in the inquirer
const inquirer = require("inquirer");
// brings in mysql
const mysql = require("mysql");
//brings in fs
const fs = require("fs");
//brings in path
const path = require("path");
//brings in util
const util = require("util");
//brings in the tables
const cTable = require("console.table");
//brings in the rawlist
const RawList = require("prompt-rawlist");
//creates the connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeedb",
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
        "Find Employee by Department",
        "Find Employee by Role",
        "Find all Employees",
        "Find Employee by Manager",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update Employee Role",
        "Delete an Employee",
      ],
    })
    
    .then((answer) => {
      switch (answer.action) {
        case "Find Employee by Department":
          departmentSearch();
          break;

        case "Find Employee by Role":
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

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

//Shows the employee by department
const departmentSearch = () => {
  const query =
    "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};
//Shows the employee by role
const roleSearch = () => {
  const query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;";
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
  const query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager from employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
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
      .then((res) => {
        console.log(res);
        connection.query(
          `INSERT INTO employeedb.employee (first_name, last_name, role_id) VALUES ("${res.first_name}", "${res.last_name}", ${res.role});`,
          (err, res) => {
            console.log("employee and role has been added");
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
  const query = "SELECT first_name, last_name, role_id FROM employee";
  connection.query(query, (req, res) => {
    let employee_choice = res.map((employee) => ({
      name: employee.first_name + employee.last_name,
      value: employee.role_id,
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
          name: "employee",
          message: "Which employee would you like to delete?",
          choices: employee_choice,
        },
      ])
      .then((res) => {
        console.log(res);
        connection.query(
          `DELETE FROM employeedb.employee (first_name, last_name) WHERE ("${res.employee_choice = first_name}", "${res.employee_choice = last_name}";`,
          (err, res) => {
            console.log("employee and role has been deleted");
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
