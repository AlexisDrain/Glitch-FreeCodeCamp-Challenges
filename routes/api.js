/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

var mongoose = require("mongoose");
mongoose.Promise = Promise;
mongoose.connect(process.env.DB, function(err) {
  if(err) { console.error(err); }
  else { console.log("mongoose connected successfuly"); }
});



var ThreadSchema = new mongoose.Schema({
  board: String,
  text: String,
  created_on: Date,
  bumped_on: Date,
  reported: {type: Boolean, select: false},
  delete_password: {type: String, select: false},
  replies: [{
    thread_id: String,
    text: String,
    reported: {type: Boolean, select: false},
    delete_password: {type: String, select: false}
  }]
})
var Thread = mongoose.model("Thread", ThreadSchema);

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    // post thread in board
    .post(function(req, res) {
      var newThread = new Thread({
        board: req.params.board,
        text: req.body.text,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        delete_password: req.body.delete_password,
        replies: []
      });
      
      newThread.save(function(err, doc){
        if(err) {console.error(err); }
        else {
          res.redirect("/b/" + req.params.board);
        }
      });

    })
    
    .get(function(req, res) {
    
      Thread.find({}, null, {sort:"-bumped_on", limit:10}, function(err, docs) {
        if(docs == null) {
          return console.error("no docs found")
        } else {
          return docs;
        }
        

      }).lean().exec(function(err, docs) {
        
        
          // only show last 3 replies
          docs.forEach(function(doc,i) {
            doc.replies = doc.replies.slice(-3);//.reverse();
          });
          
          res.send(docs);
      })
    
    })
  .delete(function(req,res) {
    
    Thread.findOne({board: req.params.board, _id: req.body.thread_id}, '+delete_password', function(err, doc) {
      if(err) {
        return res.send('error: ' + err);
      } else {
        
        if(doc == null) {
          return res.send('thread not found');
        } else {
          
          if(doc.delete_password != req.body.delete_password) {
              return res.send('incorrect password');
          } else {
            doc.remove(function(err) {
              if(err) {console.error(err);} else {
                return res.send('success');
              }
            });
          }
          
        }
        
        
      }
    })
  })
  // reporting thread
  .put(function(req,res) {
    
    Thread.findOne({board: req.params.board, _id: req.body.report_id}, '+replies.reported', function(err, doc) {
      if(err) {
        console.error(err);
      }
      
      if(doc == null) {
        return res.send("doc wasn't found");
      }
      doc.reported = true;

      doc.save(); 
      return res.send('success');
    });
  })
    
  app.route('/api/replies/:board')
    // post reply to thread in board
    .post(function(req, res) {
    
      Thread.findOne({ _id: req.body.thread_id }, function(err, doc) {
        
        if(doc == null) {
          return res.send("doc not found");
        } else {
          var newReply = {
            thread_id: req.body.thread_id,
            text: req.body.text,
            reported: false,
            delete_password: req.body.delete_password
          }

          doc.bumped_on = new Date();
          doc.replies.push(newReply);

          doc.save(function(err, doc){
            if(err) {console.error(err); }
            else {
              res.redirect("/b/" + req.params.board + "/" + req.body.thread_id);
            }
          });
        }
        

      });
      
    })
    
    .get(function(req, res) {
    
      Thread.findOne({ _id: req.query.thread_id }, function(err, docs) {
        if(docs == null) {
          return console.error("no docs found")
        } else {
          return docs;
        }
        

      })
      .then(function(docResult) {
        
          res.send(docResult);
      });
    
    })
  
  .delete(function(req,res) {
    Thread.findOne({board: req.params.board, _id: req.body.thread_id}, '+replies.delete_password', function(err, doc) {
      if(err) {
        return res.send('find error: ' + err);
      } else {
        
        if(doc == null) {
          
          return res.send("doc not found")
        } else {
          var foundReply = false;
          doc.replies.forEach(function(reply, i) {
            
            if(reply._id == req.body.reply_id && reply.delete_password == req.body.delete_password) {
              foundReply = true;
              reply.text = "[deleted]";
              doc.save(function(err) {
                if(err) {console.error(err);} else {
                  
                  //res.redirect("/b/" + req.params.board);
                  return res.send('success');
                }
              });
            }
          });
          if(foundReply == false) {
            return res.send("incorrect reply id or delete password");
          }
        }
        
      }
    });
  })
  
  // reporting reply
  .put(function(req,res) {
    
    Thread.findOne({board: req.params.board, _id: req.body.thread_id}, '+replies.reported', function(err, doc) {
      if(err) {
        return res.send('incorrect thread id or password');
      } else {
        if(doc == null) {
          
          return res.send("doc not found");
        }
        
        var foundReply = false;
        doc.replies.forEach(function(reply, i) {
          
          if(reply._id == req.body.reply_id) {
            foundReply = true;
            reply.reported = true;
            doc.save(function(err) {
              if(err) {console.error(err);} else {
                return res.send('success');
              }
            })
          }
        });
        if(foundReply == false) {
          return res.send("reply not found");
        }
      }
    });
  });
};
