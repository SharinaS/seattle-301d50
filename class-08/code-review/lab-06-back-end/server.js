'use strict';
let lat;
let lng;

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const superagent = require('superagent');
app.use(cors());
const PORT = process.env.PORT;
// LOCATION DATA
function FormattedData(searchQuery, formattedQuery, latitude, longitude) {
  this.search_query = searchQuery;
  this.formatted_query = formattedQuery;
  this.latitude = latitude;
  this.longitude = longitude;
}
app.get('/location', (request, response) => {
  const searchQuery = request.query.data;
  const urlToVisit = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GEOCODE_API_KEY}`;
  // superagent.get('url as a string');
  superagent.get(urlToVisit).then(responseFromSuper => {
    //console.log('stuff', responseFromSuper.body);
    // replaced geoData required with the data in the body of my superagent response
    const geoData = responseFromSuper.body;
    // console.log('geodata', geoData);
    const specificGeoData = geoData.results[0];
    const formattedQuery = specificGeoData.formatted_address;
    lat = specificGeoData.geometry.location.lat;
    // console.log(lat);
    lng = specificGeoData.geometry.location.lng;
    response.send(new FormattedData(searchQuery, formattedQuery, lat, lng));
  }).catch(error => {
    response.status(500).send(error.message);
    console.error(error);
  });
})

// WEATHER DATA

function WeatherGetter(weatherValue) {
  this.forecast = weatherValue.summary;
  this.time = new Date(weatherValue.time * 1000).toDateString();
}

app.get('/weather', (request, response) => {
  const urlToVisit = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${lat},${lng}`;

  superagent.get(urlToVisit).then(responseFromSuper => {
    //console.log('stuff', responseFromSuper.body);
    const darkskyData = responseFromSuper.body;
    const dailyData = darkskyData.daily.data.map(value => new WeatherGetter(value));

    response.send(dailyData);
  }).catch (error =>  {
    console.error(error);
    response.status(500).send(error.message);
  });
})




// Event Data
// Write constructor function
function EventFinder(link, name, date, summary){
  this.link = link; 
  this.name = name;
  this.date = date;
  this.summary = summary;

}
app.get('/events', (request, response) => {
  const urlToVisit = `https://www.eventbriteapi.com/v3/events/search?location.longitude=${lng}&location.latitude=${lat}&token=${process.env.EVENTBRITE_API_KEY}`;
  console.log(urlToVisit);

  superagent.get(urlToVisit).then(responseFromSuper => {
    // console.log('things', responseFromSuper.body.events[0])
    ;
    const body = responseFromSuper.body;
    const events = body.events;

    const normalizedEvents = events.map(eventObj => new Eventbrite(eventObj));

    response.send(normalizedEvents);

  })

  

})


// app.get for /events
  // write urlToVisit based on format for API (add API key for events to .env)

  //superagent.get arrow function
  // console.log to see what the api bring back.
  // create variables that access the data we need to find - link, name, data, summary
  // response.send
  // catch error


/*
name: obj.name.text
summary: obj.description.text
link: obj.url
event_date : obj.start.local
link, name, event_date, summary
<li>
    <a href="{{ link }}">{{ name }}</a>
    <p>Event Date: {{ event_date }}</p>
    <p>{{ summary }}</p>
  </li>
*/
function Eventbrite(eventObj) {
  this.name = eventObj.name.text
  this.summary = eventObj.description.text
  this.link = eventObj.url
  this.event_date = eventObj.start.local
}



// commit messages with initials, and when making pull request



app.listen(PORT, () => { console.log(`app is up on PORT ${PORT}`) });
