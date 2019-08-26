'use strict';

const express = require('express');

const app = express();

//Middleware
//app.use tells express to use the function passed in in the middle of routes
//express.static directs you to the public folder, by default if there is an index, it gives you the index
// additionally it makes other files like images, css, frontend javascript available
app.use(express.static('./public'));

//this line of code takes all the form data and stores it in the request.body
app.use(express.urlencoded({extended: true}));


app.post('/contact', (req, res) => {
  console.log(req.body);
  // as long as the file is in the public folder, specified in express.static, i can send the file
  res.sendFile('./thanks.html', {root: './public'});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`app is up on PORT number ${PORT}`));