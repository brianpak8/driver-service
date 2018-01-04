const axios = require('axios');
const query = require('./queries.js');

const cancelAndUpdate = (req, res) => {
  let rideId = req.body.rideId;
  // console.log('----------------------->', req.body);
  axios.patch('insertBookingendpointHere', {
    ride_id: rideId,
    driver_id: null,
    driver_picture: null,
    phone_number: null,
    make: null,
    model: null,
    color: null,
    picture: null,
    license: null,
    location: null
  })
  .then((data) => {
    res.end();
  })
  .catch((err) => {
    console.log(err);
  })
}

const endRide = (req, res) => {
  let driverId = req.body.driverId;
  axios.patch('/endride', {
    driverId: driverId,
    status: 0
  })
  .then((data) => {
    res.end();
  })
  .catch((err) => {
    console.log(err);
  })
}

const updateLocations = () => {
  // first query the cache for all locations
  query.redisGetLocations((err, data) => {
    axios.patch('/drivers/locations', {
      locations: data
    })
    .then((responseCode) => {
      console.log(responseCode);
    })
    .catch((err) => {
      console.log('ahaha', err);
    })
  });

  // send an http request
}


module.exports.cancelAndUpdate = cancelAndUpdate;
module.exports.endRide = endRide;
module.exports.updateLocations = updateLocations;
