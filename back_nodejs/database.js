const mysql = require('mysql');

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root', 
    password : '0000',
    database : 'my_project',
    port : 3306
});