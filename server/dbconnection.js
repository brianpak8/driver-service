const mysql = require('mysql');

// ignore comments for setup
// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat"
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    database: 'driverservice'
  }
});

// module.exports.connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'driverservice'
// });
module.exports.knex = knex;
