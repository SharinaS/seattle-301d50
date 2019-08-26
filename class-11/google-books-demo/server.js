'use strict';

const express = require('express');
const superagent = require('superagent');

const app = express();

app.set('view engine', 'ejs');

// middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'))

const PORT = process.env.PORT || 3000;

app.get('/', newSearch);

app.post('/book-search', searchForBook);



// Route Handlers

function newSearch (request, response) {
  response.render('pages/index');  
  
}

function searchForBook(request, response) {
  // request.body comes from the form from ejs
  // .search is the name of the input
  // [0] is the first thing which was the radio buttons
  // console.log(request.body.search[0]);
  const searchType = request.body.search[0];

  const searchingFor = request.body.search[1];

  let url = 'https://www.googleapis.com/books/v1/volumes?q='
  if (searchType === 'title'){
    const query = `+intitle:${searchingFor}`
    url = url + query;
  } else {
    const query = `+inauthor:${searchingFor}`
    url = url + query;
  }
  
  superagent.get(url).then(result => {
    // console.log(result.body);
    response.send(result.body);
    // response.render('pages/booklist')
  })
}




app.listen(PORT, () => console.log(`up on PORT ${PORT}`));