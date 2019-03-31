const express = require('express');
const employeeRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


const validateEmployee = (req, res, next) => {
    const employee = req.body.employee;
    if (!(employee.name && employee.position && employee.wage)) {
        return res.status(400).send();
    }
    if (!employee.isCurrentEmployee) {
        employee.isCurrentEmployee = 1;
    }
    req.employee = employee;
    next();
};

employeeRouter.param('employeeId', (req, res, next, id) => {
    db.get(`select * from Employee where id = $id`, {$id: id}, (err, row) => {
        if (err) {
            next(err);
        } else if (row) {
            req.employee = row;
            next();
        } else {
            res.status(404).send();
        }
    })
});

employeeRouter.get('/', (req, res, next) => {
    db.all(`select * from Employee where is_current_employee = 1`, (err, rows) => {
        if (err) {
            next(err);
        } else if (rows) {
            res.json({employees: rows});
        } else {
            res.status(404).send();
        }
    })
});

employeeRouter.post('/', validateEmployee, (req, res, next) => {
    db.run(`insert into Employee (name, position, wage, is_current_employee) values ($name, $position, $wage, $isCurrentEmployee)`, {
        $name: req.employee.name,
        $position: req.employee.position,
        $wage: req.employee.wage,
        $isCurrentEmployee: req.employee.isCurrentEmployee
    }, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from Employee where id = ${this.lastID}`, (err, row) => {
                if (err) {
                    next(err);
                } else if (row) {
                    res.status(201).json({employee: row});
                } else {
                    res.status(404).send();
                }
            })
        }
    })
});

employeeRouter.get('/:employeeId', (req, res, next) => {
    res.json({employee: req.employee});
});

employeeRouter.put('/:employeeId', validateEmployee, (req, res, next) => {
    db.run(`update Employee set name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee where id = $id`, {
        $name: req.employee.name,
        $position: req.employee.position,
        $wage: req.employee.wage,
        $isCurrentEmployee: req.employee.isCurrentEmployee,
        $id: req.params.employeeId
    }, function(err) {
        if(err) {
            next(err);
        } else {
            db.get(`select * from Employee where id = ${req.params.employeeId}`, (err, row) => {
                if (err) {
                    next(err);
                } else if (row) {
                    res.json({employee: row});
                } else {
                    res.status(404).send();
                }
            })
        }
    })
});

employeeRouter.delete('/:employeeId', (req, res, next) => {
    db.run(`update Employee set is_current_employee = 0 where id = $id`, {$id: req.params.employeeId}, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from Employee where id = ${req.params.employeeId}`, (err, row) => {
                if (err) {
                    next(err);
                } else if (row) {
                    res.json({employee:row});
                } else {
                    res.status(204).send();
                }
            })
        }
    })
});

const timesheetRouter = require('./timesheets');
employeeRouter.use('/:employeeId/timesheets', timesheetRouter);

module.exports = employeeRouter;
