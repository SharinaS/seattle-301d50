'use strict';

// packages
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride  = require('method-override');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

//express middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
//methodoverride is middleware
app.use(methodOverride((request, response) => {
  // var body = {
  //   _method: 'DELETE'
  // };

  if(request.body && typeof request.body === 'object' && '_method' in request.body){
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}));

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', e => console.error(e));


// Routes
app.get('/', getAllBooks);
app.get('/search', showSearch);
app.post('/search', makeASearch);
app.post('/books/save', saveBook);
app.get('/books/:bananas_book_id', showSingleBook);

// will refactor to delete
// app.post('/books/:bananas_book_id', deleteBook);
app.delete('/books/:bananas_book_id', deleteBook);

// Callbacks and helpers

function getAllBooks(req, res){

  client.query('SELECT * FROM books').then(sqlResponse => {
    // data that comes back from sql and is stored in sqlResponse.rows as an array of entries (objects)
    // console.log(sqlResponse);
    res.render('index.ejs', {savedBooks: sqlResponse.rows});
  });

}

function showSearch(req, res) {
  res.render('./pages/searches/new.ejs');
}

function makeASearch(req, res) {
  console.log(req.body);
  const searchType = req.body.search[0];
  const searchingFor = req.body.search[1];
  let bookUrl = `https://www.googleapis.com/books/v1/volumes?q=`;
  if (searchType === 'title') {
    const query = `+intitle:${searchingFor}`;
    bookUrl = bookUrl + query;
  } else {
    const query = `+inauthor:${searchingFor}`;
    bookUrl = bookUrl + query;
  }
  superagent.get(bookUrl).then(result => {

    //map over results, pass through constructor, show results
    const mappedBooks = result.body.items.map(bookObj => new Book(bookObj));

    res.render('./pages/searches/show.ejs', { mappedBooks: mappedBooks });
    // res.render('./pages/searches/show.ejs', { mappedBooks });
  });
}

function saveBook (req, res){
  console.log(req.body);
  client.query('INSERT INTO books (title, bookshelf) VALUES ($1, $2)', [req.body.title, req.body.category]).then(() => {
    res.redirect('/');
  });
}


function Book (bookObj){
  this.title = bookObj.volumeInfo.title;
  this.url = bookObj.volumeInfo.imageLinks.thumbnail;
}


function showSingleBook(req, res){
  console.log(req.params);
  client.query('SELECT * FROM books WHERE id=$1', [req.params.bananas_book_id]).then(sqlResult => {

    res.render('./pages/books/detail.ejs' , {specificBook : sqlResult.rows[0]});

  });

}

function deleteBook(req, res){
  const id = req.params.bananas_book_id;

  client.query('DELETE FROM books WHERE id=$1', [id]).then(() => {
    res.redirect('/');
  });

}


app.listen(PORT, () => console.log(`${PORT} up` ));
