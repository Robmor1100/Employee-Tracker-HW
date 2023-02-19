
const { prompt } = require("inquirer");
const db = require("./db/connection");

const start = () => {
    prompt({
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
            {
                name: "View all departments",
                value: "viewDepartments"
            },
            {
                name: "View all roles",
                value: "viewRoles"
            },
            {
                name: "View all employees",
                value: "viewEmployees"
            },
            {
                name: "Add a department",
                value: "addDepartment"
            },
            {
                name: "Add a role",
                value: "addRole"
            },

            {
                name: "Add an employee",
                value: "addEmployee"
            },
            {
                name: "Update an employee role",
                value: "updateEmployeeRole"
            },
            {
                name: "Exit",
                value: "exit"
            }
        ]
    })
    .then(res => {
        switch (res.choice) {
            case "viewDepartments":
                viewDepartments();
            break;
            case "viewRoles":
                viewRoles();
                break;
            case "viewEmployees":
                viewEmployees();
                break;
            case "addDepartment":
                addDepartment();
                break;
            case "addRole":
                addRole();
                break;
            case "addEmployee":
                addEmployee();
                break;
            case "updateEmployeeRole":
                updateEmployeeRole();
                break;
                default:
                    db.end();
    }
    });
};

const viewDepartments = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) {
            console.log(err);    
        } else {
            console.table(res);
            start();
        }
    });
};

const viewRoles = () => {
    db.query("SELECT * FROM role", (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table(res);
            start();
        }
    });
};

const viewEmployees = () => {
    db.query("SELECT * FROM employee", (err,res) => {
        if (err) {
            console.log(err);
        } else {
            console.table(res);
            start();
        }
    });
};

const addDepartment = () => {
    prompt({
        type: "input",
        name: "name",
        message: "Enter the name of the department you would like to add."
    })
    .then(res => {
        db.query("INSERT INTO department SET ?", {name: res.name}, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`${res.name} department added.`);
                start();
            }
        });
    });
};

const addRole = () => {
    prompt([
        {
            type: "input",
            name: "title",
            message: "Enter the title of the role you would like to add."
        },
        {
            type: "input",
            name: "salary",
            message: "Enter the salary for this role."
        },
        {
            type: "input",
            name: "department",
            message: "Enter the department id for this role."
        }
    ])
    .then(res => {
        db.query("INSERT INTO role SET ?", {title: res.title, salary: res.salary, department_id: res.department} , (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Role added.");
                start();
            }
        });

    });
};

const addEmployee = () => {
    prompt([
        {
            type: "input",
            name: "first_name",
            message: "Enter the first name of the employee you would like to add."
        },
        {
            type: "input",
            name: "last_name",
            message: "Enter the last name of the employee you would like to add."
        },
        {
            type: "input",
            name: "role",
            message: "Enter the role id for this employee."
        },
        {
            type: "input",
            name: "manager",
            message: "Enter the manager id for this employee."
        }
    ])
    .then(res => {
        db.query("INSERT INTO employee SET ?", {first_name: res.first_name, last_name: res.last_name, role_id: res.role, manager_id: res.manager}, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Employee added.");
                start();
            }
        });
    });
};

const updateEmployeeRole = () => {
db.query("SELECT * FROM employee", (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.table(res);
        prompt([
            {
                type: "list",
                name: "employee",
                message: "Select the employee you would like to update.",
                choices: res.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }))
            },
            {
                type: "input",
                name: "role",
                message: "Enter the new role id for this employee."
            }
        ])
        .then(res => {
            db.query("UPDATE employee SET role_id = ? WHERE id = ?", [res.role, res.employee], (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Employee role updated.");
                    start();
                }});
            });
        }
    })};


start();
