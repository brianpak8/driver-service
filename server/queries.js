const db = require('./dbconnection.js');

const driverCount = function(req, res) {
  return db.knex.select().table('available_rides')
}

module.exports.driverCount = driverCount;
