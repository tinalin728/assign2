const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'movies',
});

db.connect((err) => {

    if (err) {
        console.log("ERROR!!!! ", err);
        return;
    }

    console.log("connected");

});

module.exports = db;
