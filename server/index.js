const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const faker = require('faker');
const promise = require('bluebird');
const db = require('./dbconnection.js');
// const db2 = require('./queries.js');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    database: 'driverservice'
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// pricing service requests for current number of drivers available
app.get('/api/v1/drivers/count', (req, res) => {
  knex.select().table('available_rides')
    .then((data) => {
      console.log(data);
      res.end(JSON.stringify({count: data.length}));
    })

});

// booking service requests for driver data to match with riders
app.get('/api/v1/drivers/available', (req, res) => {
  // Knex('aps')
  //       .select()
  //       .innerJoin('wlcs','aps.wlc_id','=','wlc.id')
  //       .innerJoin('switchs','aps.switch_id','=','switch.id')
  //       .innerJoin('venues','aps.venue_name','=','venue.name')
  //       .where(Qu)
  //       .debug(true)
  //       .then(function (resultCol){
  //            console.log("resultCol",resultCol);
  //       })
  //       .catch(function (err){
  //           console.log("Err",err);
  //       });


  knex('available_rides')
    .innerJoin('drivers', 'available_rides.driver_id', '=', 'drivers.id')
    .innerJoin('vehicles', 'available_rides.vehicle_id', '=', 'vehicles.id')
    .select()
    .then((data) => {
      console.log(data);
    })

  // knex.select().table('available_rides')
  //   .then((data) => {
  //     data.forEach((record) => {
  //       knex.from('drivers').innerJoin('vehicles')
  //     })
  //   })



  // const drivers = [];
  // const vehicles = [];
  // const driversToSend = [];
  // const vehiclesToSend = [];
  //
  // // let firstQuery = knex.select().table('available_rides');
  // //
  // // // firstQuery.then((data) => {
  // // //   data.forEach((record) => {
  // // //     knex('drivers_vehicles').where({id: driver.driver_vehicle_id});
  // // //   })
  // // // })
  // //
  //
  // console.time("test");
  //
  // knex.select().table('available_rides')
  //   .then((data) => {
  //     data.forEach((driver) => {
  //       // drivers.push(driver);
  //       console.log('1111111111111111111', driver.driver_vehicle_id);
  //       return knex('drivers_vehicles').where({id: driver.driver_vehicle_id})
  //         .then((driverProfiles) => {
  //           console.log('2222222222222222222', driverProfiles);
  //           driverProfiles.forEach((driverProfile) => {
  //             console.log('3333333333333333333', driverProfile.driver_id);
  //              //drivers.push(driverProfile);
  //             return knex('drivers').where({
  //               id: driverProfile.driver_id
  //             })
  //               .then((driverToSend) => {
  //                 console.log('444444444444444444', driverToSend);
  //                 drivers.push(driverToSend);
  //                 console.log('5555555555555', drivers);
  //               })
  //           })
  //         })
  //         console.log('got here ^^^^^^^^^^^^^^^^^^^');
  //     });
  //     console.log('got to here  $$$$$$$$$$$$$$');
  //     data.forEach((vehicle) => {
  //       console.log('666666666666', vehicle);
  //       return knex('drivers_vehicles').where({id: vehicle.driver_vehicle_id})
  //         .then((vehicleProfiles) => {
  //           vehicleProfiles.forEach((vehicleProfile) => {
  //             console.log('777777777777777777', vehicleProfile);
  //             // vehicles.push(vehicleProfile);
  //             return knex('vehicles').where({
  //               id: vehicleProfile.vehicle_id
  //             })
  //               .then((vehicleToSend) => {
  //                 vehicles.push(vehicleToSend);
  //                 console.log('88888888888888888', vehicles);
  //               })
  //           })
  //         })
  //     });
  //   })
  //   .then(() => {
  //     drivers.forEach((arrayRecord) => {
  //       let obj = arrayRecord[0];
  //       driversToSend.push(obj);
  //     });
  //     vehicles.forEach((vehicleRecord) => {
  //       let obj = vehicleRecord[0];
  //       vehicleToSend.push(obj);
  //     });
  //     console.log('999999999999999999999', driversToSend);
  //     const ObjToSend = {
  //       drivers: driversToSend,
  //       vehicles: vehiclesToSend
  //     }
  //     console.log('YEAHHHHHHHH BOYYYYYYYYYY', JSON.stringify(ObjToSend));
  //     console.timeEnd("test");
  //     res.end(JSON.stringify(ObjToSend));
  //
  //   })
  //   .catch((err) => {
  //     console.err();
  //     throw err;
  //   })

});

//  booking service notification to change status of drivers after a match occurs
app.post('/api/v1/ride', (req, res) => {

});

// client request to cancel a ride and reset status

// knex('books')
// .where('published_date', '<', 2000)
// .update({
//   status: 'archived',
//   thisKeyIsSkipped: undefined
// })
// Outputs:
// update `books` set `status` = 'archived' where `published_date` < 2000

app.patch('/api/v1/cancel', (req, res) => {
  let rideId = req.body.rideId;
  let driver_vehicle_id = req.body.driver_vehicle_id;
  knex('available_rides')
    .where('current_ride_id', '=', rideId)
    .update({
      current_ride_id: null,
      status: 0
    })
    .then((id) => {
      console.log('I made it this far');
      axios.patch('/driverInfo', {
        ride_id: rideId,
        driver_id: null,
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
    })

});

//  client request to end a ride and reset status
app.patch('/api/v1/ride/end', (req, res) => {
  let rideId = req.body.rideId;
  let driver_vehicle_id = req.body.driver_vehicle_id;


});




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
    knex(`drivers`).insert({
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


/* advice form beth: use faker (npm)
random data generator for cars
*/
