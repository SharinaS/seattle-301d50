'use strict';

const express = require('express');
const cors = require('cors');
//superagent talks to the internet over http
const superagent = require('superagent');
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
    const query = request.query.data; //seattle

    const urlToVisit = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=AIzaSyBt-Y_4KtCaKJtFOMkhzegnVxwVy4KrNic`;

    // superagent.get('url as a string');
    superagent.get(urlToVisit).then(responseFromSuper => {
      console.log('stuff', responseFromSuper.body);

      // I simply replaced my geodata require, with the data in the body of my superagent response
      const geoData = responseFromSuper.body;

      const specificGeoData = geoData.results[0];

      const formatted = specificGeoData.formatted_address;
      const lat = specificGeoData.geometry.location.lat;
      const lng = specificGeoData.geometry.location.lng;

      const newLocation = new Location(query, formatted, lat, lng)
      response.send(newLocation);
    }).catch(error => {
      response.status(500).send(error.message);
      console.error(error);
    })
    // console.log('thingsfrominternets', thingFromInternet);
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


// Simple superagent request
// superagent.get('http://localhost:3000/location?data=sandiego', thing => {
//   console.log(thing.body);
// })