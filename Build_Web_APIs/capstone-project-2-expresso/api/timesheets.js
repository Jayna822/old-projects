const express = require('express');
const timesheetRouter = express.Router({mergeParams:true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const validateTimesheet = (req, res, next) => {
    const timesheet = req.body.timesheet;
    if (!(timesheet.hours && timesheet.rate && timesheet.date)) {
        return res.status(400).send();
    }
    req.timesheet = timesheet;
    next();
};

timesheetRouter.param('timesheetId', (req, res, next, id) => {
    db.get(`select * from Timesheet where id = $id`, {$id: id}, (err, row) => {
        if (err) {
            next(err);
        } else if (row) {
            req.timesheet = row;
            next();
        } else {
            res.status(404).send();
        }
    })
});

timesheetRouter.get('/', (req, res, next) => {
    db.all(`select * from Timesheet where employee_id = $id`, {$id: req.params.employeeId}, (err, rows) => {
        if (err) {
            next(err);
        } else if (rows) {
            res.json({timesheets: rows});
        } else {
            res.status(404).send();
        }
    })
});

timesheetRouter.post('/', validateTimesheet, (req, res, next) => {
    // validate employee exists? already covered in employee.js?
    db.run(`insert into Timesheet (hours, rate, date, employee_id) values ($hours, $rate, $date, $employeeId)`, {
        $hours: req.timesheet.hours,
        $rate: req.timesheet.rate,
        $date: req.timesheet.date,
        $employeeId: req.params.employeeId
    }, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from Timesheet where id = ${this.lastID}`, (err, row) => {
                if (err) {
                    next(err);
                } else if (row) {
                    res.status(201).json({timesheet:row});
                } else {
                    res.status(404).send();
                }
            })
        }
    })
});

timesheetRouter.put('/:timesheetId', validateTimesheet, (req, res, next) => {
    db.run(`update Timesheet set hours = $hours, rate = $rate, date = $date, employee_id = $employeeId`, {
        $hours: req.timesheet.hours,
        $rate: req.timesheet.rate,
        $date: req.timesheet.date,
        $employeeId: req.params.employeeId
    }, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from Timesheet where id = ${req.params.timesheetId}`, (err, row) => {
                if (err) {
                    next(err);
                } else if (row) {
                    res.status(200).json({timesheet: row});
                } else {
                    res.status(404).send();
                }
            })
        }
    })
});

timesheetRouter.delete('/:timesheetId', (req, res, next) => {
    db.run(`delete from Timesheet where id = $id`, {$id: req.params.timesheetId}, (err) => {
        if (err) {
            next(err);
        } else {
            res.status(204).send();
        }
    })
});

module.exports = timesheetRouter;
