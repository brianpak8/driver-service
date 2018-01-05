const { expect } = require('chai');
const db = require('../server/dbconnection.js');
const axios = require('axios');

// console.log(db.knex('drivers').select().then((data) => {
//   console.log(data, '--------------- this is the data');
//   console.log(data.length, 'this is the data length');
// }), 'eeeeeeeeeeeeee');

describe ('Database Schema', () => {
  it('contains a drivers table', (done) => {
    db.knex('drivers')
     .select()
     .where('id', 1)
     .then((data) => {
      // console.log('got here', data);
      expect(true).to.equal(true);
      done();
    })
    .catch((err) => {
      expect(false).to.equal(true);
      // console.log('drivers table has an issue', err);
      done();
    });
  });
  it('contains a vehicles table', (done) => {
    db.knex('vehicles')
     .select()
     .where('id', 1)
     .then((data) => {
      // console.log('got here', data);
      expect(true).to.equal(true);
      done();
    })
    .catch((err) => {
      expect(false).to.equal(true);
      // console.log('drivers table has an issue', err);
      done();
    });
  });
  it('contains a drivers_vehicles table', (done) => {
    db.knex('drivers_vehicles')
     .select()
     .where('id', 1)
     .then((data) => {
      // console.log('3rd test', data);
      expect(true).to.equal(true);
      done();
    })
    .catch((err) => {
      expect(false).to.equal(true);
      // console.log('drivers table has an issue', err);
      done();
    });
  });
  it('contains an available_drivers table', (done) => {
    db.knex('available_rides')
     .select()
     .where('id', 1)
     .then((data) => {
      // console.log('4th test', data);
      expect(true).to.equal(true);
      done();
    })
    .catch((err) => {
      // console.log('drivers table has an issue', err);
      expect(false).to.equal(true);
      done();
    });
  });

})
//  should write into the schema file to be consistent if the database ever has to be reloaded
describe ('database queries', () => {
  it('should be able to get driver data from a driverId', (done) => {
    db.knex('available_rides')
    .select()
    .where('id', 9)
    .then((data) => {
      db.knex('drivers')
      .select()
      .where('id', data[0].driver_id)
      .then((answer) => {
        expect(answer[0].first_name).to.equal('Will');
        done();
      })
    })
  })
  it('should be able to select drivers not currently on a ride', (done) => {
    db.knex('available_rides')
    .select()
    .where({
      status: 0,
      id: 4
    })
    .then((data) => {
      expect(data[0].driver_id).to.equal(16289);
      expect(data[0].vehicle_id).to.equal(19853);
      done();
    })
  })
  it('should allow for location updates', (done) => {
    db.knex('available_rides')
    .where('id', '=', 11)
    .update({
      location: 'Central Park, New York'
    })
    .then((data) => {
      db.knex('available_rides')
      .select()
      .where({
        id: 11
      })
      .then((response) => {
        expect(response[0].location).to.equal('Central Park, New York');
        done();
      })
    })
  })
})
