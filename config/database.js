var mysql      = require('mysql2');

var mysqlHost = process.env.MYSQL_HOST || 'localhost';
var mysqlPort = process.env.MYSQL_PORT || '3306';
var mysqlUser = process.env.MYSQL_USER || 'root';
var mysqlPass = process.env.MYSQL_PASS || 'root';
var mysqlDB   = process.env.MYSQL_DB   || 'node_db';

var connectionOptions = {
  host: mysqlHost,
  port: mysqlPort,
  user: mysqlUser,
  password: mysqlPass,
  database: mysqlDB
};

var connection = mysql.createConnection(connectionOptions);

connection.connect(function(err) {
  if (err) throw err;
  console.log("User Profile Service DB is connected!");
});
 
module.exports = connection
 