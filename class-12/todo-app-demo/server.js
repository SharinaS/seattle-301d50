'use strict';

// Application Dependencies
const express = require('express');
const pg = require('pg');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({extended: true}));
// Specify a directory for static resources
app.use(express.static('./public'));

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// API Routes
app.get('/', getTasks); // display all currently existing tasks

app.get('/tasks/:task_id', getOneTask); // look up a task using an id and show just that task, probably lives in a database

app.get('/add', showForm); // show a form with task details

app.post('/add', addTask); // when the form sends data to my server, ill add the task to a database

app.get('*', (req, res) => res.status(404).send('This route does not exist'));


function getTasks (request, response){
  // const dummyData = [
  //   {
  //     title: 'Walk the Ginger',
  //     description :'see above',
  //     contact : 'Ginger',
  //     status :'Ongoing',
  //     category : 'love',
  //     due : new Date().toDateString()
  //   },
  //   {
  //     title: 'Walk the Ginger2',
  //     description: 'see above',
  //     contact: 'Ginger',
  //     status: 'Ongoing',
  //     category: 'love',
  //     due: new Date().toDateString()
  //   }
  // ];
  client.query('SELECT * FROM tasks')
    .then(resultFromSQL => {
      response.render('./index.ejs', {taskList : resultFromSQL.rows});
    });
}

function getOneTask(request, response) {
  //
  // DATA CAN BE PASSED IN 3 WAYS TO YOUR SERVER
  // request.body (lives in the request object) (secret);
  // url https://google.com?query=anything&nicholasQuery=teacher
  // request.query (lives on the url), comes after the question mark, separated by &
  // request.params (lives on the url), come before the question mark, take the place of :params standins defined by the server
  // server will have a route app.get('/something/:param/:wizardParam)
  // visit https://ourServer/fire/gandalf
  // we will have access to request.params.param=fire
  // request.params.wizardParam = gandalf
  // our route is app.get('/tasks/:task_id'
  // so whatever comes after /tasks/ in the href of our a tag will be stored at request.params.task_id

  console.log(request.params.task_id);

  client.query('SELECT * FROM tasks WHERE id=$1', [request.params.task_id])
    .then(singleTaskResult => {
      console.log(singleTaskResult.rows[0]);
      response.render('./pages/detail-view', singleTaskResult.rows[0]);

    });


  // show one task
}

function showForm(request, response) {

}
function addTask(request, response) {

  /*
 id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  contact VARCHAR(255),
  status VARCHAR(255),
  category VARCHAR(255),
  due DATE NOT NULL DEFAULT NOW()
  */

}


function handleError(error, response) {
  response.render('pages/error-view', {error: 'Uh Oh'});
}



app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
