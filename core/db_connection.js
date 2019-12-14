const mysql = require('mysql');
const path = require('path');
const fs= require('fs');
const db_config = JSON.parse(fs.readFileSync(path.join(__dirname,'../config/db_config.json')));

//creating db connection

const connection = mysql.createConnection(db_config);
connection.connect((err) => {
    if (err) throw err;
    else console.log('database is connected');
});

module.exports = connection;