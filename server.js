/*

https://learn.freecodecamp.org/apis-and-microservices/apis-and-microservices-projects/request-header-parser-microservice

  https://dandelion-roar.glitch.me/
*/

// server.js
// where your node app starts

// init project
var express = require('express');
const requestIp = require('request-ip');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.use(requestIp.mw())

// your first API endpoint... 
app.get("/api/whoami", function (req, res) {
  //res.send(req);
  res.json({
    "ipaddress":req.clientIp,
    "language":req.get('Accept-Language'),
    "software":req.get('User-Agent')});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
