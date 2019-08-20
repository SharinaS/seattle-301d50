'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.get('/location', (request, response) => {
  try{


  // const x = {
  //   search_query: "seattle",
  //   "formatted_query": "Seattle, WA, USA",
  //   "latitude": "47.606210",
  //   "longitude": "-122.332071"
  // }

  const geoData = require('data/geo.json');

  // search query comes from the front end;
  // given today
  const searchQuery = request.query.data;

  // formatted_query, latitude, longitude are in my geoData

  const formattedQuery = geoData.results[0].formatted_address;

  const lat = geoData.results[0].geometry.location.lat;
  const lng = geoData.results[0].geometry.location.lng;

  const formattedData = {
    search_query: searchQuery,
    formatted_query: formattedQuery,
    latitude: lat,
    longitude: lng
  }


  
  response.send(formattedData);

  } catch(error){
    // console.log
    console.error(error);
    response.send(error.message);
  }

})

app.listen(PORT, () => {console.log(`app is up on PORT ${PORT}`)});