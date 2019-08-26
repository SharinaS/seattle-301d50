'use strict';

const express = require('express');

const app = express();

// this sets the default view engine (used to render html) to be ejs
app.set('view engine', 'ejs');

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;






// when using ejs my file needs to live in a "views" folder
app.get('/', (request, response) => {
  // response.sendFile 
  response.render('index')
})

app.get('/list', (request, response) => {
  // Array of groceries for /list route
  let list = ['apples', 'celery', 'butter', 'milk', 'eggs'];

  // from within my ejs file i will have access to a global variable called myList that will have my array
  response.render('list', {myList : list});
})

app.get('/quantities', (request, response) => {
  // Array of quantities for /details route
  let quantities = [
    { name: 'apples', quantity: 4 },
    { name: 'celery', quantity: 1 },
    { name: 'butter', quantity: 1 },
    { name: 'cookies', quantity: 14 },
    { name: 'skittles', quantity: 5.5 },
    { name: 'oranges', quantity: 1000 },
    { name: 'liquid', quantity: 1 },
    { name: 'milk', quantity: 2 },
    { name: 'eggs', quantity: 12 }
  ];

  // the second argument, the data object:
  // all of the keys get stored as global variables for the ejs file to use
  response.render('quantities', {myQuantities : quantities, nicholas: 'teacher missed ginger', nums: [1,2,3]});

})

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
