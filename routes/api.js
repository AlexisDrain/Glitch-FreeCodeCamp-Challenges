/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
var mongoose = require("mongoose");

mongoose.connect(process.env.DB, function(err, data) {
  if(err) {
    return console.err("mongoose could not connect");
  }
  return console.log("connected successfully");
})

var BookSchema = mongoose.Schema({
  "title":String,
  "comments": [String],
  "commentcount": Number,
  "index": {type:Number, index:true}
});
var Book = mongoose.model("Book", BookSchema);


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
    
    
      Book.find({}, function(err, doc) {
        if(err) {
          console.error(err);
        }
        
        var getResponse = new Array(doc.length);
        
        doc.forEach(function(ele,i) {
          
          getResponse[i] = {};
          
          getResponse[i]._id = ele._id
          getResponse[i].title = ele.title
          getResponse[i].commentcount = ele.comments.length
        });
        return res.send(getResponse);
      });
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      var title = req.body.title;
      if(title == undefined || title == "") {
        return res.send("post: error: title field is empty");
      }
      
      var newBook = new Book({
        title: title,
        comments: [],
        commentcount: 0
      });
      newBook.save(function(err, doc) {
          if(err) {
            return console.error(err);
          } else {
            return res.send(doc);
          }
       })
    })
    
    .delete(function(req, res){
    
      Book.remove({}, function(err) {
        if(err) { console.error (err); }
        return res.send('complete delete successful');
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findOne({"_id": bookid}, function(err, doc) {
        if(doc == null) {
          return res.send("id not in database");
        }
        return res.send(doc);
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
    
      Book.findOne({"_id": bookid}, function(err, doc) {
        
        if(err) { console.error (err); }
        if(doc == null) {
          return res.send("id not in database");
        }
        doc.comments.push(comment);
        doc.save(function (err, doc) {
          
          if(err) { console.error (err); }
            return res.send(doc);
          });
      });
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
    
      Book.findByIdAndRemove(bookid, function(err) {
        if(err) { console.error (err); }
        return res.send('delete successful');
      });
      //if successful response will be 'delete successful'
    });
  
};
