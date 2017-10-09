/* app.js */
var express = require('express');
var NodeGeocoder = require('node-geocoder');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.PORT || 5000;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// set the view engine to ejs
app.set('view engine', 'ejs')

// add middleware
app.use(function(req, res, next) {

  // allow any origin to access the server
  res.header("Access-Control-Allow-Origin", "*");

  // indicates available HTTP response headers
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// parameter middleware that will run before the next routes
app.param('name', function(req, res, next, name) {
  // save name to the request
  req.name = name;
  next();
});

app.use(express.static(__dirname + '/staticFiles'));

// ROUTES 

// - Home page
app.get('/', (req, res) => {

  // render `home.ejs` with the list of posts
  res.render('home')
})

// Sample get call that prints a user 
// Ex: http://localhost:5000/users/philip
app.get('/users/:name', function(req, res) {

  // the user was found and is available in req.user
  res.send('What is up ' + req.name + '!');
});

// post request gets user input from first form 
app.post('/', function(req, res) {
  console.log(req.body); 
  res.send(req.body);
});

// post request gets user input from second form 
app.post('/address', function(req, res) {

  // Tester code
  // console.log(req.body); 
  // res.send(req.body);
  console.log(req.body.address); 
  res.send(req.body.address);

  var options = { 
    provider: 'google',

    // Optional depending on the providers
    httpAdapter: 'https', // Default
    // apiKey: 'options.clientIdand options.apiKey', 
    formatter: null         // 'gpx', 'string', ...
  };

  var geocoder = NodeGeocoder(options);

  // Using callback
  geocoder.geocode(req.body.address, function(err, res) {
    console.log(res);
  });

  // // Or using Promise
  // geocoder.geocode(req.body[address])
  // .then(function(res) {
  //   console.log(res);
  // })
  // .catch(function(err) {
  //   console.log(err);
  // });
});

// start the server
app.listen(port, function() {
  console.log('Server started! At http://localhost:' + port);
});