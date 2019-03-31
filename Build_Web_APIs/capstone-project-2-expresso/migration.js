const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run('drop table if exists Employee');
    db.run(`create table if not exists Employee(
        id integer primary key,
        name text not null,
        position text not null,
        wage integer not null,
        is_current_employee integer default 1)
        `);
    db.run(`drop table if exists Timesheet`);
    db.run(`create table if not exists Timesheet(
        id integer primary key,
        hours integer not null,
        rate integer not null,
        date integer not null,
        employee_id integer not null,
        FOREIGN KEY(employee_id) REFERENCES Employee(id))
        `);
    db.run(`drop table if exists Menu`);
    db.run(`create table if not exists Menu(
        id integer primary key,
        title text not null)`);
    db.run(`drop table if exists MenuItem`);
    db.run(`create table if not exists MenuItem(
        id integer primary key,
        name text not null,
        description text,
        inventory integer not null,
        price integer not null,
        menu_id integer not null,
        foreign key(menu_id) references Menu(id))
        `);
});
