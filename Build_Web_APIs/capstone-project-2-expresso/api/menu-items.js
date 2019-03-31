const express = require('express');
const menuItemRouter = express.Router({mergeParams:true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const validateMenuItem = (req, res, next) => {
    const menuItem = req.body.menuItem;
    if (!(menuItem.name && menuItem.inventory && menuItem.price)) {
        return res.status(400).send();
    }
    if (!menuItem.description) {
        menuItem.description = '';
    }
    req.menuItem = menuItem;
    next();
};

menuItemRouter.param('menuItemId', (req, res, next, id) => {
    db.get(`select * from MenuItem where id = $id`, {$id: id}, (err, row) => {
        if (err) {
            next(err);
        } else if (row) {
            req.menuItem = row;
            next();
        } else {
            res.status(404).send();
        }
    })
});

menuItemRouter.get('/', (req, res, next) => {
    db.all(`select * from MenuItem where menu_id = $id`, {$id: req.params.menuId}, (err, rows) => {
        if (err) {
            next(err);
        } else if (rows) {
            res.json({menuItems: rows});
        } else {
            res.status(404).send();
        }
    })
});

menuItemRouter.post('/', validateMenuItem, (req, res, next) => {
    // validate employee exists? already covered in employee.js?
    db.run(`insert into MenuItem (name, description, inventory, price, menu_id) values ($name, $description, $inventory, $price, $menuId)`, {
        $name: req.menuItem.name,
        $description: req.menuItem.description,
        $inventory: req.menuItem.inventory,
        $price: req.menuItem.price,
        $menuId: req.params.menuId
    }, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from MenuItem where id = ${this.lastID}`, (err, row) => {
                if (err) {
                    next(err);
                } else if (row) {
                    res.status(201).json({menuItem:row});
                } else {
                    res.status(404).send();
                }
            })
        }
    })
});

menuItemRouter.put('/:menuItemId', validateMenuItem, (req, res, next) => {
    db.run(`update MenuItem set name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menuId`, {
        $name: req.menuItem.name,
        $description: req.menuItem.description,
        $inventory: req.menuItem.inventory,
        $price: req.menuItem.price,
        $menuId: req.params.menuId
    }, function(err) {
        if (err) {
            next(err);
        } else {
            db.get(`select * from MenuItem where id = ${req.params.menuItemId}`, (err, row) => {
                if (err) {
                    next(err);
                } else if (row) {
                    res.status(200).json({menuItem: row});
                } else {
                    res.status(404).send();
                }
            })
        }
    })
});

menuItemRouter.delete('/:menuItemId', (req, res, next) => {
    db.run(`delete from MenuItem where id = $id`, {$id: req.params.menuItemId}, (err) => {
        if (err) {
            next(err);
        } else {
            res.status(204).send();
        }
    })
});

module.exports = menuItemRouter;
