const mysql = require('mysql2/promise'); // Import the promise version of mysql2

// Create the connection pool to use async/await with promises
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

module.exports = pool; // Export the connection pool
