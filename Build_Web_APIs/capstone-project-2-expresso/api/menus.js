const express = require('express');
const menuRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const validateMenu = (req, res, next) => {
    const menu = req.body.menu;
    if (!menu.title) {
        return res.status(400).send();
    }
    req.menu = menu;
    next();
};

menuRouter.param('menuId', (req, res, next, id) => {
    db.get(`select * from Menu where id = $id`, {$id: id}, (err, row) => {
        if (err) {
            next(err);
        } else if (row) {
            req.menu = row;
            next();
        } else {
            res.status(404).send();
        }
    })
});

menuRouter.get('/', (req, res, next) => {
    db.all(`select * from Menu`, (err, rows) => {
        if (err) {
            next(err);
        } else if (rows) {
            res.json({menus: rows});
        } else {
            res.status(404).send();
        }
    })
});

menuRouter.post('/', validateMenu, (req, res, next) => {
    db.run(`insert into Menu (title) values ($title)`, {
        $title: req.menu.title,
    }, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from Menu where id = ${this.lastID}`, (err, row) => {
                if (err) {
                    next(err);
                } else if (row) {
                    res.status(201).json({menu: row});
                } else {
                    res.status(404).send();
                }
            })
        }
    })
});

menuRouter.get('/:menuId', (req, res, next) => {
    res.json({menu: req.menu});
});

menuRouter.put('/:menuId', validateMenu, (req, res, next) => {
    db.run(`update Menu set title = $title where id = $id`, {
        $title: req.menu.title,
        $id: req.params.menuId
    }, function(err) {
        if(err) {
            next(err);
        } else {
            db.get(`select * from Menu where id = ${req.params.menuId}`, (err, row) => {
                if (err) {
                    next(err);
                } else if (row) {
                    res.json({menu: row});
                } else {
                    res.status(404).send();
                }
            })
        }
    })
});

menuRouter.delete('/:menuId', (req, res, next) => {
    db.get(`select * from MenuItem where menu_id = $id`, {$id: req.params.menuId}, (err, row) => {
        if (err) {
            next(err);
        } else if (row) {
            res.status(400).send();
        } else {
            db.run(`delete from Menu where id = $id`, {$id: req.params.menuId}, (err) => {
                if (err) {
                    next(err);
                } else {
                    res.status(204).send();
                }
            })
        }
    })
});


const menuItemRouter = require('./menu-items');
menuRouter.use('/:menuId/menu-items', menuItemRouter);

module.exports = menuRouter;
