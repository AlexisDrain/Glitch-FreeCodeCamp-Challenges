/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB;
mongoose.connect(CONNECTION_STRING, function(err, db) {});

var IssueSchema = mongoose.Schema({
  "project":String,
  "issue_title":String,
  "issue_text":String,
  "created_by":String,
  "assigned_to":String, //opt
  "status_text":String, //opt
  "created_on":Date, // automatically filled
  "updated_on":Date, // automatically filled
  "open":Boolean,
  "index": {type:Number, Index:true}
});
var Issue = mongoose.model("Issue", IssueSchema);

var checkFieldNotEmpty = function(field, fieldName) {
  
  if(field == undefined) {
    return "Error: Required field " + fieldName + " is empty. can't complete.";
  } else {
    return "valid";
  }
};

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
    
      var _id = req.query._id;
      var issue_title = req.query.issue_title;
      var issue_text = req.query.issue_text;
      var created_by = req.query.created_by;
      var assigned_to = req.query.assigned_to; // opt
      var status_text = req.query.status_text; // opt
      var created_on = req.query.created_on;
      var updated_on = req.query.updated_on;
      var open = req.query.open;
    
      var filter = {
        
        "project":project,
        "issue_title":issue_title,
        "issue_text":issue_text,
        "created_by":created_by,
        "assigned_to":assigned_to, //opt
        "status_text":status_text, //opt
        "created_on":created_on, // automatically filled
        "updated_on":updated_on, // automatically filled
        "open":open,
        "_id": _id
      }
      var filterAfterRemovedNull = {}
      Object.keys(filter).forEach((ele, i) => {
        if(filter[ele] != undefined) {
          filterAfterRemovedNull[ele] = filter[ele];
        }
      });
    
      Issue.find(filterAfterRemovedNull, (err, data) => {
        res.send(data);
      })
    })
    
  // create new issue
    .post(function (req, res){
      var project = req.params.project;
      var issue_title = req.body.issue_title;
      if(checkFieldNotEmpty(issue_title, "issue_title") != "valid") {
         return res.send(checkFieldNotEmpty(issue_title, "issue_title")); 
      }
      var issue_text = req.body.issue_text;
      if(checkFieldNotEmpty(issue_text, "issue_text") != "valid") {
         return res.send(checkFieldNotEmpty(issue_text, "issue_text")); 
      }
      var created_by = req.body.created_by;
      if(checkFieldNotEmpty(created_by, "created_by") != "valid") {
         return res.send(checkFieldNotEmpty(created_by, "created_by")); 
      }
      var assigned_to = req.body.assigned_to; // opt
      var status_text = req.body.status_text; // opt
      var created_on = new Date();
      var updated_on = new Date();
      var open = true;
    
      var newIssue = new Issue({
        
        "project":project,
        "issue_title":issue_title,
        "issue_text":issue_text,
        "created_by":created_by,
        "assigned_to":assigned_to, //opt
        "status_text":status_text, //opt
        "created_on":created_on, // automatically filled
        "updated_on":updated_on, // automatically filled
        "open":open
      });
    
      newIssue.save((err, data) => {
        if(err) { return res.send(err); }
        res.send(data);
      })
    })
    
  // update issue
    .put(function (req, res){
      var project = req.params.project;
    
      
      var issue_title = req.body.issue_title;
      if(checkFieldNotEmpty(issue_title, "issue_title") != "valid") {
         issue_title = undefined;
      }
      var issue_text = req.body.issue_text;
      if(checkFieldNotEmpty(issue_text, "issue_text") != "valid") {
         issue_text = undefined;
      }
      var created_by = req.body.created_by;
      if(checkFieldNotEmpty(created_by, "created_by") != "valid") {
         created_by = undefined;
      }
      var assigned_to = req.body.assigned_to;
      if(checkFieldNotEmpty(assigned_to, "assigned_to") != "valid") {
         assigned_to = undefined;
      }
    
      var status_text = req.body.status_text;
      if(checkFieldNotEmpty(status_text, "status_text") != "valid") {
         status_text = undefined;
      }
      var open = !req.body.open;
    
      if(issue_title == undefined && issue_text == undefined && created_by == undefined && assigned_to == undefined && status_text == undefined) {
        return res.send('no updated field sent');
      }
      var updated_on = new Date();
          
    
      Issue.findOne({"_id": req.body._id}, function(err, data) {
        if(err) { return res.send(err); }
        if(data == null) {
          return res.send('could not update '+ req.body._id);
        } else {
          
          
          
          if(issue_title != undefined) {
            
            data.issue_title = issue_title;
          }
          if(issue_text != undefined) {
            
            data.issue_text = issue_text;
          }
          if(created_by != undefined) {
            
            data.created_by = created_by;
          }
          if(assigned_to != undefined) {
            
            data.assigned_to = assigned_to;
          }
          if(status_text != undefined) {
            
            data.status_text = status_text;
          }
          if(open != undefined) {
            
            data.open = open;
          }
          
          data.save((err, data) => {
            if(err) { return res.send(err); }
            
            return res.send('successfully updated');
          })
        }
      });
    
    })
    
    .delete(function (req, res){
      var project = req.params.project;
    
      Issue.findByIdAndRemove(req.body._id, function(err, doc) {
        if(err) { return res.send('could not delete '+ req.body._id); }
        return res.send('deleted '+ req.body._id);
      });
    
    });
    
};
