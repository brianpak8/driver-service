const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const query = require('./queries.js');
const request = require('./bookingrequests.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// pricing service requests for current number of drivers available
// tested

app.get('/api/v1/drivers/count', (req, res) => {
  query.redisCount().then((data) => {
    if (data !== 'nil' && data !== null) {
      res.end(JSON.stringify({count: data}));
    } else {
      query.driverCount()
      .then((data) => {
        // console.log('i am a teapot short and stout', data[0]['count(*)']);
        query.redisSetCount(data);
        res.end(JSON.stringify({count: data[0]['count(*)']}));
      })
    }
  })
});

// booking service requests for driver data to match with riders
// tested

app.get('/api/v1/drivers/available', (req, res) => {
  query.redisGetDrivers().then((data) => {
    if (data !== null) {
      res.end(data);
    } else {
      query.getDrivers()
      .then((data) => {
        query.redisSetDrivers(data);
        res.end(JSON.stringify(data));
      })

    }
  })
})

// new route for drivers to update position
// tested

app.patch('/api/v1/drivers/location', (req, res) => {
  let driver = req.body.driverId;
  let location = req.body.location;
  query.redisSetLocation(driver, location);
  query.updateLocation(driver, location)
    .then((data) => {
      res.end();
    })
})

//  booking service notification to change status of drivers after a match occurs
//  tested

app.post('/api/v1/ride', (req, res) => {
  console.log('!!!!!!!!!!!!!!!!!!!!!!!', req.body);
  let id = req.body.rideId;
  let driver = req.body.driverId;
  query.assignRide(driver, id)
    .then((id) => {
      console.log(id);
      res.end(JSON.stringify(id));
    })
    .catch((err) => {
      console.log(err);
    })
})

//  client(driver) request to cancel a ride
//  tested, but request to booking needs a correct endpoint
app.patch('/api/v1/cancel', (req, res) => {
  let rideId = req.body.rideId;
  let driver_vehicle_id = req.body.driver_vehicle_id;
  query.cancelRide(rideId, driver_vehicle_id)
    .then((record) => {
      console.log('working');
      request.cancelAndUpdate(req, res)
      })
  })

//  client request to end a ride and reset status
//  tested but needs a correct endpoint

app.patch('/api/v1/ride/end', (req, res) => {
  let rideId = req.body.rideId;
  let driverId = req.body.driverId;
  query.endRide(rideId)
  .then((record) => {
    request.endRide(req, res);
  })
})

// uncomment for periodic updates of driver locations for
// booking service

/*
const updateLocations = () => {
  console.log('teehee');
  setTimeout(updateLocations, 60000);
  request.updateLocations();
};

updateLocations();
*/

app.listen(9100, () => {
  console.log('listening on port 9100');
});
