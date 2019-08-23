'use strict'

//when should we update our database
// system to update daily
// update them when we access them
// update differently on schedules
// location? never
// weather? hourly, 15 minutes, second, pilots get it every hour
//you must check weather every 15 seconds
// event? daily events, hourly, cancellations? 
// trails? once a week, once a day
// yelp? weekly
// movies? monthly, quarterly

// Updated constructor function, schema file, and insertion statement



//require() is an import statement built into node.js - it reads complex files.
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');

const app = express();
app.use(cors());

//postgres client
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', (error) => console.error(error));



const PORT = process.env.PORT;

//Constructors

//location
function Location(query, format, lat, lng) {
  this.search_query = query;
  this.formatted_query = format;
  this.latitude = lat;
  this.longitude = lng;
}
//weather
function Day (summary, time) {
  this.forecast = summary;
  this.time = new Date(time *1000).toDateString();
  this.created_at = Date.now();
}
//

// =========== TARGET LOCATION from API ===========

app.get('/location', (request, response) => {
  const searchQuery = request.query.data; //request.query is part of the request (NewJohn's hand) and is a vector for questions. It lives in the URL, public info. Postal service of internet.

  client.query(`SELECT * FROM locations WHERE search_query=$1`, [searchQuery]).then(sqlResult => {
    // console.log('locatio nsql result', sqlResult);
    //if stuff:
    if(sqlResult.rowCount >0){
      console.log('Found data in database')
      response.send(sqlResult.rows[0]);
    } else {

      console.log('nothing found in database, asking google')
      const urlToVisit = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${process.env.GEOCODE_API_KEY}`;
      
      superagent.get(urlToVisit).then(responseFromSuper => {

        const geoData = responseFromSuper.body;
        const specificGeoData = geoData.results[0];
        
        const formatted = specificGeoData.formatted_address;
        const lat = specificGeoData.geometry.location.lat;
        const lng = specificGeoData.geometry.location.lng;
        
        const newLocation = new Location(searchQuery, formatted, lat, lng);
        //start the response cycle
        
        //Within superagent, creating placeholders so we can add information to database
        
        //action(insert) "into" where (values)
        const sqlQueryInsert = `INSERT INTO locations
        (search_query, formatted_query, latitude, longitude)
        VALUES
        ($1, $2, $3, $4)`;

        const valuesArray = [newLocation.search_query, newLocation.formatted_query, newLocation.latitude, newLocation.longitude];


        //sqlQueryInsert is the affore mentioned string, which is sql script(instructions)
        //values Array is that array
        //client.query combies the string and array, and per the string's instructions, creates rows, and then fills the rows with the array's contents
        
        client.query(sqlQueryInsert, valuesArray);
        
        response.send(newLocation);

      }).catch(error => {
        response.status(500).send(error.message);
        console.error(error);
      })

    }      
  })
})

    
    // =========== TARGET WEATHER from API ===========
    
app.get('/weather', getWeather)

  // does data exist
  // if not => give to front end
  // is it too old? => get new data
  // doesnt exist => get new data

  function getWeather(request, response){
  // console.log(request);

  const localData = request.query.data;
  // console.log(localData);
  
  client.query(`SELECT * FROM weather WHERE search_query=$1`, [localData.search_query]).then(sqlResult => {

    
    let notTooOld = true;
    if(sqlResult.rowCount > 0){
      const age = sqlResult.rows[0].created_at;  //150000000000
      const ageInSeconds = (Date.now() - age) / 1000;  // 15
      if(ageInSeconds > 15){
        notTooOld = false;
        client.query('DELETE FROM weather WHERE search_query=$1', [localData.search_query]);
      }
      console.log('age in seconds', ageInSeconds);
    }

  //found stuff in database
  // and it is not too old
    if(sqlResult.rowCount > 0 && notTooOld){

      //check if the existing data is old

      console.log('found weather stuff in databse')
      response.send(sqlResult.rows);
      
    // didnt find stuff
    }else {
      console.log('did not find in database, googling now!');

    const urlDarkSky = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${localData.latitude},${localData.longitude}`;


    superagent.get(urlDarkSky).then(responseFromSuper => {

      const weatherData = responseFromSuper.body;
      const eightDays = weatherData.daily.data;
      const formattedDays = eightDays.map(day => new Day(day.summary, day.time));

      //forEach for each day
    
      formattedDays.forEach(day => {

        const sqlQueryInsert = `INSERT INTO weather
      (search_query, forecast, time, created_at)
      VALUES
      ($1, $2, $3, $4)`;

      const valuesArray = [localData.search_query, day.forecast, day.time, day.created_at];
      client.query(sqlQueryInsert, valuesArray);
      // console.log('accessing values array', valuesArray);
    })
      

      response.send(formattedDays)
    }).catch(error => {
      response.status(500).send(error.message);
      console.error(error);
    })
  };

  });
}





// ============ EVENTBRITE from API ==============

app.get('/events', getEvents)

function getEvents(request, response){
  let eventData = request.query.data;

  //check the database for data
  // client.query('query message/string', data:Array of values)
  // then check the if statements

  client.query('SELECT * FROM events WHERE search_query=$1', [eventData.search_query]).then(sqlResult => {

  if(sqlResult.rowCount === 0){
    console.log('stuff from internet / eventbrite');
    const urlfromEventbrite = `https://www.eventbriteapi.com/v3/events/search/?sort_by=date&location.latitude=${eventData.latitude}&location.longitude=${eventData.longitude}&token=${process.env.EVENTBRITE_API_KEY}`;

    superagent.get(urlfromEventbrite).then(responseFromSuper => {
      // console.log(responseFromSuper.body)

      const eventbriteData = responseFromSuper.body.events;

      const formattedEvents = eventbriteData.map(event => new Event(event.url, event.name.text, event.start.local, event.description.text));
    

      response.send(formattedEvents);

      formattedEvents.forEach(event => {
        const insertEvent = `
      INSERT INTO events 
      (name, search_query,link, event_date, summary)
      VALUES 
      ($1, $2, $3, $4, $5);`
        client.query(insertEvent, [event.name, eventData.search_query, event.link, event.event_date, event.summary])
      })

      

      // add data to the db
      // client.query('query string', array of values)
      // put the values in the table
      // INSERT INTO events (name, search_query,link, event_date, summary) VALUES ($1, $2, $3, $4, $5);



    }).catch(error => {
      response.status(500).send(error.message);
      console.error(error);
    })
  } else {
    console.log('stuff already in event db');
    'use the data that exists in the db';
    response.send(sqlResult.rows);
  }

  })

  
  
}

// ====================================

app.listen(PORT, () => {
  console.log(`app is running on ${PORT}`);
});


function Event(link, name, event_date, summary) {
  this.link = link;
  this.name = name;
  this.event_date = new Date(event_date).toDateString();
  this.summary = summary;
}

// class notes

// API is a server that lives on the internet. Places where code lives.
//1. Go to google api console developer website.
// 2. Copy URL in Postman and in server.js under /location
// 3. install superagent = require('superagent') ---> NOT EXPRESS (recieves http request, ears of operation). SUPERAGENT is the mouth, it talks to the internet over http.
// 4. rnpm install -S superagent
//5. superagent.get('url from string')
//......
//10. The dynamic part of the code is in the addess.


//lab tomorrow
//1. Get location (just did in class) and weather and eventbite data from the internet.
//2. Trello board has everything I need for days instructions.
