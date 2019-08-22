'use strict';

//packages

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
require('dotenv').config();

//app
const app = express();
app.use(cors());

// postgres client
// postgres://USERNAME:PASSWORD@localhost:5432/DATABASENAME
// postgres://ncarignan:password@localhost:5432/city_explorer
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
// set up error logging
client.on('error', (error) => console.error(error));


const PORT = process.env.PORT || 3000;

//routes

app.get('/location', (request, response) => {
  const searchQuery = request.query.data;

  // Before i insert or get new data
  client.query(`SELECT * FROM locations WHERE search_query=$1`, [searchQuery]).then(sqlResult => {
    // console.log(sqlResult);
    //if it exists in the database, give it to the front end
    if(sqlResult.rowCount > 0){
      console.log('i found stuff in the db')
      response.send(sqlResult.rows[0]);
    } else {
      // if not, do everything else normally, namely go get data
  






  const urlToVisit = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GEOCODE_API_KEY}`;

  superagent.get(urlToVisit).then(responseFromSuper => {
    console.log('i got stuff from google');
    const geoData = responseFromSuper.body.results[0];
    const newLocation = new Location(geoData, searchQuery)

    //SQL INSERTION
    // client.query takes two arguments
    // a sql query, and values
    // client.query(
    //   // first arg
    //   `INSERT INTO locations 
    //   (search_query, formatted_query, latitude, longitude)
    //   VALUES
    //   ($1, $2, $3, $4);`,
    //   //second arg
    //   // $1 will be replaced with the value of the first index of my second argument array
    //   [newLocation.search_query, newLocation.formatted_query, newLocation.latitude, newLocation.longitude]
    //   )
    const sqlQueryInsert = `INSERT INTO locations 
      (search_query, formatted_query, latitude, longitude)
      VALUES
      ($1, $2, $3, $4);`;
    const valuesArray = [newLocation.search_query, newLocation.formatted_query, newLocation.latitude, newLocation.longitude];

    //client.query takes in a string and array and smooshes them into a proper sql statement that it sends to the db
    client.query(sqlQueryInsert, valuesArray);





    response.send(newLocation);
  }).catch(error => {
    response.status(500).send(error.message);
    console.error(error);
  });

// ================================
// THIS IS THE CLOSING OF MY IF ELSE THAT CHECKED THE DB
// ====================================
    }
  })
})

// helper function
function Location (geoObj, query){
  this.search_query = query;
  this.formatted_query = geoObj.formatted_address;
  this.latitude = geoObj.geometry.location.lat;
  this.longitude = geoObj.geometry.location.lng;
}


app.listen(PORT, () => console.log(`up on ${PORT}`));