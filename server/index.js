const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const faker = require('faker');
const promise = require('bluebird');
const db = require('./dbconnection.js');
const query = require('./queries.js');
const request = require('./bookingrequests.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// pricing service requests for current number of drivers available
// tested

app.get('/api/v1/drivers/count', (req, res) => {
  // console.log('is this undefined?', query.driverCount);
  query.driverCount()
    .then((data) => {
      console.log('i am a teapot short and stout', data);
      res.end(JSON.stringify({count: data.length}));
    })
});

// booking service requests for driver data to match with riders
// tested

app.get('/api/v1/drivers/available', (req, res) => {
  query.getDrivers()
    .then((data) => {
      // console.log('look at the data ----->', data);
      res.end(JSON.stringify(data));
    })
})

// new route for drivers to update position

app.patch('/api/v1/drivers/location', (req, res) => {
  let driver = req.body.driverId;
  let location = req.body.location;
  query.updateLocation(driver, location)
    .then((data) => {
      console.log('ahahahahahahahaahahaha', data);
      res.end();
    })
})

//  booking service notification to change status of drivers after a match occurs


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

// app.post('/api/v1/ride', (req, res) => {
//   let id = req.body.rideId;
//   let driver = req.body.driverId;
//   db.knex('available_rides')
//     .where('driver_id', '=', driver)
//     .update({
//       status: 1,
//       current_ride_id: id
//     })
//     .then((driverRecord) => {
//       res.end(JSON.stringify(driverRecord));
//     })
//
// });

  app.patch('/api/v1/cancel', (req, res) => {
    let rideId = req.body.rideId;
    let driver_vehicle_id = req.body.driver_vehicle_id;
    query.cancelRide(rideId, driver_vehicle_id)
      .then((record) => {
        console.log('working');
        request.cancelAndUpdate(req, res)
      })
  })
// app.patch('/api/v1/cancel', (req, res) => {
//   let rideId = req.body.rideId;
//   let driver_vehicle_id = req.body.driver_vehicle_id;
//   db.knex('available_rides')
//     .where('current_ride_id', '=', rideId)
//     .update({
//       current_ride_id: null,
//       status: 0
//     })
//     .then((id) => {
//       console.log('I made it this far');
//       axios.patch('insertBookingendpointHere', {
//         ride_id: rideId,
//         driver_id: null,
//         driver_picture: null,
//         phone_number: null,
//         make: null,
//         model: null,
//         color: null,
//         picture: null,
//         license: null,
//         location: null
//       })
//         .then((data) => {
//           res.end();
//         })
//       res.end();
//     })
//
// });

//  client request to end a ride and reset status

app.patch('/api/v1/ride/end', (req, res) => {
  let rideId = req.body.rideId;
  let driverId = req.body.driverId;
  query.endRide(rideId)
  .then((record) => {
    // console.log('got to this spot');
    request.endRide(req, res);
  })

})



// app.patch('/api/v1/ride/end', (req, res) => {
//   let rideId = req.body.rideId;
//   db.knex('available_rides')
//     .where('current_ride_id', '=', rideId)
//     .update({
//       current_ride_id: null,
//       status: 0
//     })
//     .then((record) => {
//       axios.patch('insertBookingEndpointHere', {
//         status: 0
//       })
//       .then((data) => {
//         res.end();
//       })
//     })
//
// });




//
// // client login that changes status of driver
// app.post('/api/v1/login', (req, res) => {
//
// });
//
//
//
// // client request to reset status and end session
// app.post('/api/v1/logout', (req, res) => {
//
// });



// just a test
app.get('/', (req, res) => {
  // knex(`drivers`).insert({
  //   first_name: 'peter'
  // });
  for (let i = 0; i < 1500000; i++) {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    db.knex(`drivers`).insert({
      first_name: `${firstName}`,
      last_name: `${lastName}`
    })
    .then((data) => {
      //console.log('inserted!!!!');
    })

  }
  // console.log('test, test, test');
  // //console.log('!!!!!!!!!', typeof db, '-------', db);
  // console.log('before db connection');
  // //db2();
  // knex.select().table('drivers')
  //   .then((data) => {
  //     console.log(data);
  //   });
  // knex.select().table('vehicles')
  //   .then((data) => {
  //     console.log(data);
  //   });
  // knex.select().table('drivers_vehicles')
  //   .then((data) => {
  //     console.log(data);
  //   });
  // knex.select().table('available_rides')
  //   .then((data) => {
  //     console.log(data);
  //   });
  // knex('available_rides').where({
  //   status: 1
  // }).select('id')
  // .then((data) => {
  //   console.log('HEY', data);
  // });
  // console.log('after db connection');
  // db.connection.query('select * from drivers', (err, rows, fields) => {
  //   console.log(Array.isArray(rows), '123456789', rows[1]);
  // });
  // .then((data) => {
  //   console.log('data', typeof data, '----', data);
  // });

//res.send();
});


app.listen(9100, () => {
  console.log('listening on port 9100');
});

// request({
//   uri: '127.0.0.1:9100/api/v1/ride',
//   method: 'POST',
//   form: {
//     driverId: 2,
//     rideId: 5
//   }
// }, function(err, response, body) {
//   if (err) {
//
//     console.log('this is an error', err);
//   } else {
//
//     console.log('this is the response', response);
//     console.log('this is the body', body);
//   }
// })
// axios.post('localhost:9100/api/v1/ride', {
//   rideId: 5,
// driverId: 2})
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   })

/* advice form beth: use faker (npm)
random data generator for cars
*/
