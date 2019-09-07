/*
https://learn.freecodecamp.org/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice

  https://thread-paper.glitch.me/

*/

'use strict';

var express = require('express');
var mongo = require('mongodb').MongoClient;
var linksCollection;
var mongoose = require('mongoose');
var bodyparser = require("body-parser");
const dns = require('dns');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }, function(err) {
  return (err ? console.error(err) : console.log("mongoose successfully connected to database"));
});


app.use(cors());
app.use(bodyparser.urlencoded({ extended:false }))
app.use(bodyparser.json());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


var LinkSchema = new mongoose.Schema({

  "original":{type:String},
  "userIndex":Number
});

var Link = mongoose.model("Link", LinkSchema);
module.exports = Link;
  

app.post("/api/shorturl/new", function (req, res) {
  
  
  // validate url
  var httpRegex = /^(https?:\/\/)/gi
  var dnsValidationRegex = /^(https?:\/\/)|(\/+.+)|(\/)/gi
  
  var linkWithoutHTTP = req.body.url.replace(httpRegex,'');
  var validatedDNS = req.body.url.replace(dnsValidationRegex,'');
  
  dns.lookup(validatedDNS, (err)=> {
    if(err) {
      return res.json({"error":"Invalid URL"});
      
    } else {
      // url is valid
      
      var newLink;

      Link.findOne({"original": linkWithoutHTTP}, function(err, data) {
        if (err) {
          return console.error(err);
        }
        newLink = data;
        
        // not found, create new
        if(newLink == null) {
            
          Link.countDocuments(function(err,c) {
            if(err) {
              return console.error(err);
            }
            newLink = new Link({
              "original":linkWithoutHTTP,
              "userIndex":c
            });
            
            newLink.save(newLink, (err, data)=> {
              if(err) {
                return console.error(err);
              } else {
                res.send(data);
              }
            });
            
            res.json({original_url: newLink.original,
                     short_url: "https://fcc-api3.glitch.me/api/shorturl/" + newLink.userIndex});
          });

        } else {
          
          res.json({original_url: newLink.original,
                   short_url: "https://fcc-api3.glitch.me/api/shorturl/" + newLink.userIndex});
        }
        
              
      })
      
    }
  });
});
app.get("/api/shorturl/:urlCode", function(req,res) {
  
  Link.findOne({userIndex: req.params.urlCode}, function(err, data) {
    if(err) {
      console.error(err);
    } else {
      
      if(data == null) {
        
        res.redirect("https://fcc-api3.glitch.me/");
      } else {
        
        res.redirect("https://" + data.original);
      }
    }
    
  })
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});