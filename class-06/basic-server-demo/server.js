'use strict';

const express = require('express');
require('dotenv').config();

const app = express();

// We access env variables using process.env.VARIABLENAME
const PORT = process.env.PORT
// console.log(process.env.nicholas);

//Routes;
app.get('/dani-california', (request, response)  => {
  response.send('dani rocks');
});

app.get('/cool-students', (request, response) => {
  response.send(['James Dansie', 'Sharina Stubbs',
'Jon Veach']);
});

app.get('/random-num-obj', (req, res) => {
  const randomNumber = Math.random() * 99;

  res.send({
    number: randomNumber
  })
})


app.listen(PORT, () => console.log(`App started up on port ${PORT}`));