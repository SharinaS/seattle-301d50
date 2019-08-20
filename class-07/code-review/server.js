'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express();
app.use(cors());

const PORT = process.env.PORT;

function Location(query, format, lat, lng){
  this.search_query = query;
  this.formatted_query = format;
  this.latitude = lat;
  this.longitude = lng;
}

app.get('/location', (request, response) => {
  try {

    const geoData = require('./data/geo.json');
    const query = request.query.data;
    
    const specificGeoData = geoData.results[0];

    const formatted = specificGeoData.formatted_address;
    const lat = specificGeoData.geometry.location.lat;
    const lng = specificGeoData.geometry.location.lng;
    
    const newLocation = new Location(query, formatted, lat, lng)
    response.send(newLocation);
  } catch(e){
    console.error(e);
    response.status(500).send(e.message);
  }
})

app.get('/weather', getWeather)

function getWeather(request, response){
  try{
    const weatherData = require('./data/darksky.json');

    const eightDays = weatherData.daily.data;

    const formattedDays = eightDays.map(
      day => new Day(day.summary, day.time)
      );

    response.send(formattedDays)
  } catch (e) {
    console.error(e);
    response.status(500).send(e.message);
  }
}

function Day (summary, time){
  this.forecast = summary;
  this.time = new Date(time *1000).toDateString();
}

app.listen(PORT, () => {console.log(`app is up on PORT ${PORT}`)});