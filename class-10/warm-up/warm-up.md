# Warm-Up Exercise
Read through this code as if you are the interpreter. Find all of the mistakes in this code and write down the correct syntax for each mistake.

## server.js

```
'use strict';

const express = require('express');
const pg= require('pg');

const app = express();

const client = new pg.Client('DATABASE_URL (http://postgres:5432/city_explorer')
client.connect();
client.on('error', () => do things); 

app.get('/user' , (request, response) => {
  let SQL = 'INSERT INTO users(username, password, age) VALUES ($1, $2, $3)';

  let values = [request.query.username, request.query.password, request.query.age];
  
  client.query(SQL, values)
    .then({
      response.send(result.rowCount);
    })
})

// port undefined
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)}
);
```


## schema.sql

```
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255),
  age NUMERIC
);
```
