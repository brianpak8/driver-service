const db = require('./dbconnection.js');

const driverCount = () => db.knex.select().table('available_rides')

const getDrivers = () => db.knex('available_rides')
  .innerJoin('drivers', 'available_rides.driver_id', '=', 'drivers.id')
  .innerJoin('vehicles', 'available_rides.vehicle_id', '=', 'vehicles.id')
  .select()
  .where('status', 0)

const updateLocation = (driver, location) => db.knex('available_rides')
  .where('driver_id', '=', driver)
  .update({
    location: location
  })

const assignRide = (driver, ride) => db.knex('available_rides')
  .where('driver_id', '=', driver)
  .update({
    status: 1,
    current_ride_id: ride
  })



module.exports.driverCount = driverCount;
module.exports.getDrivers = getDrivers;
module.exports.updateLocation = updateLocation;
module.exports.assignRide = assignRide;
