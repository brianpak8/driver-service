const db = require('./dbconnection.js');
const connection1 = db;
const connection2 = db;

connection2.connection.query('select * from drivers', (err, rows, fields) => {
  console.log('---------------------------------------------');
  console.log('---------------------------------------------');
  console.log('---------------------------------------------');
  console.log('---------------------------------------------');
  console.log('---------------------------------------------');

  console.log(Array.isArray(rows), '123456789', rows[1]);
});



module.exports = connection2.connection.query;
