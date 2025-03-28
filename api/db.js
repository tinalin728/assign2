// Import mysql2 to work with MySQL database
const mysql = require('mysql2');

// Create a database connection with credentials
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'movies',
});

// Try to connect to the database and log success or error
db.connect((err) => {

    if (err) {
        console.log("OH NO ERROR! ", err);
        return;
    }

    console.log("connected");

});

// Export the db connection so other files can use it
module.exports = db;
