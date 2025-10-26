const mysql = require("mysql");
const config = require("./config");

const conn = mysql.createPool({
  connectionLimit: config.database.connectionLimit,
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
});

// connect to database and return connection for other files
conn.getConnection((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to database")

    
});

// get connection
module.exports = conn;
