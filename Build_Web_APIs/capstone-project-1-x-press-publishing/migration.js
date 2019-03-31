const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run('drop table if exists Artist');
    db.run(`create table if not exists Artist(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            date_of_birth TEXT NOT NULL,
            biography TEXT NOT NULL,
            is_currently_employed INTEGER DEFAULT 1
    )`);
    db.run(`drop table if exists Series`);
    db.run(`create table if not exists Series(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL
    )`);
    db.run(`drop table if exists Issue`);
    db.run(`create table if not exists Issue(
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        issue_number TEXT NOT NULL,
        publication_date text NOT NULL,
        artist_id INTEGER NOT NULL,
        series_id INTEGER NOT NULL
    )`)
});
