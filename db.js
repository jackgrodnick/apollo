// Making our db connection

const Pool = require('pg').Pool; // Establish node connection to sql db client

// Info for establishing connection with the sql db
const pool = new Pool({
    user: "postgres",
    password: "1234",
    host: "localhost",
    port: 5432,
    database: "vehicle_db"
});

module.exports = pool;