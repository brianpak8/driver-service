const db = require('./dbconnection.js');
const axios = require('axios');
const redis = require('redis');
const promise = require('bluebird');
promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);
const client = redis.createClient();

const redisCount = () => client.getAsync('count');

const redisSetCount = (data) => client.setAsync('count', data[0]['count(*)']);

const redisGetDrivers = () => client.getAsync('drivers');

const redisSetDrivers = (data) => client.setAsync('drivers', JSON.stringify(data));

const redisSetLocation = (driver, location) => client.hsetAsync('locations', driver, location);

const redisGetLocations = (cb) => client.hgetall('locations', cb);

const driverCount = () => db.knex('available_rides')
  .count()
  .where('status', '=', 0)

const getDrivers = () => db.knex('available_rides')
  .innerJoin('drivers', 'available_rides.driver_id', '=', 'drivers.id')
  .innerJoin('vehicles', 'available_rides.vehicle_id', '=', 'vehicles.id')
  .select('available_rides.id', 'available_rides.driver_vehicle_id', 'driver_id', 'vehicle_id',
  'status', 'type', 'location', 'license_plate', 'make', 'model', 'color', 'year', 'capacity', 'vehicle_picture',
  'first_name', 'last_name', 'phone_number', 'picture', 'rating')
  .where('status', 0)
  //  this limit is inserted to make the query faster and pervent the
  //  server from timing out
  .limit('10000')

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

const cancelRide = (rideId, driver_vehicle_id) => db.knex('available_rides')
  .where('current_ride_id', '=', rideId )
  .update({
    current_ride_id: null,
    status: 0
  })

const endRide = (rideId) => db.knex('available_rides')
  .where('current_ride_id', '=', rideId)
  .update({
    current_ride_id: null,
    status: 0
  })

module.exports.redisCount = redisCount;
module.exports.redisSetCount = redisSetCount;
module.exports.redisGetDrivers = redisGetDrivers;
module.exports.redisSetDrivers = redisSetDrivers;
module.exports.redisSetLocation = redisSetLocation;
module.exports.redisGetLocations = redisGetLocations;
module.exports.driverCount = driverCount;
module.exports.getDrivers = getDrivers;
module.exports.updateLocation = updateLocation;
module.exports.assignRide = assignRide;
module.exports.cancelRide = cancelRide;
module.exports.endRide = endRide;
