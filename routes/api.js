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
var request = require("request");
var rp = require("request-promise");

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

mongoose.connect(CONNECTION_STRING, function(err) {
  if(err) {
    console.error(err);
  } else {
    console.log("mongoose connected to db");
  }
});

/*
  Nasdaq apis are borken (google's, yahoo's, and free open source ones). 
  we're going to use a simple api that generates random values that I wrote. This challenge is old and due to be replaced anyway.
  
  https://fcc-qa4-stockcreate.glitch.me/api/stock/goog
*/

var StockSchema = mongoose.Schema({
  "name": String,
  "price": String,
  "likes": Number,
  "likerIp": [String],
  "rel_likes": Number
});
StockSchema.set('toObject', { getters: true });
var Stock = mongoose.model("Stock", StockSchema);

function requestNasdaq(stockName) {
  
  return new Promise(function(resolve, reject) {
    
      var responseType, nasdaqResponse;
    
      request("https://fcc-qa4-stockcreate.glitch.me/api/stock/"+stockName)
        .on('response', function(response) {
          responseType = response.headers['content-type'];
        })
        .on('data', function(data) {
          if(responseType != "application/json; charset=utf-8"){
            
            reject("stock name" + stockName + "invalid")
          } else {
            
            nasdaqResponse = JSON.parse(data);
            resolve(nasdaqResponse);
          }
      });
    
  })
}

/*
function createNewDoc(stockName, price) {
  
  return new Promise(function(resolve, reject) {
    
    var newStock = new Stock({
        "name": stockName,
        "price": price,
        "likes": 0,
        "likerIp": []
      });

      newStock.save(function(err) {
        if(err) { reject(err); }
        resolve(newStock);
      });
  })
}
function findDoc(stockName) {
  
  return new Promise(function(resolve, reject) {
    
      Stock.findOne({ "name": stockName }, function(err, doc) {
        if(err) { reject(err); }
        if(doc == null) {

         resolve(null); 
        } else {
          resolve(doc);
        }
    
    })
  })
}
function addLikeToDoc(doc, ip) {
  
  return new Promise(function(resolve, reject) {
    
      
    
  })
}
*/

var result_find;
var nasdaqResponse;
      
function locateDoc(stockName, like, ip) {
  return new Promise(function(resolve, reject) {
    console.log(" ---- start locateDoc promise ----");
    resolve();
  })
  .catch(function (err) {
      console.error(err);
  })
  .then(function(){
    return rp("https://fcc-qa4-stockcreate.glitch.me/api/stock/"+stockName)
      .then(function(data) {
        nasdaqResponse = JSON.parse(data);
        console.log("found nasdaq ");
        return(nasdaqResponse);
      })
  })
  .catch(function (err) {
      console.error(err);
  })


  .then(function(nasdaqResult) {

    return Stock.findOne({ "name": nasdaqResult.stock }, function(err, doc) {
      if(err) { console.error(err); }
    })
  })
  .catch(function (err) {
      console.error(err);
  })
  .then(function(foundResult) {

      if(foundResult == null) {

        var result_find = new Stock({
          "name": nasdaqResponse.stock,
          "price": nasdaqResponse.price,
          "likes": 0,
          "likerIp": []
        });

        console.log("not found. create new");

        return result_find.save().then(function(savedDoc) {
          return savedDoc;
        });

      } else {
        console.log("found doc");
        return(foundResult);
      }
    })

  .catch(function (err) {
      console.error(err);
  })
  .then(function(docResult) {

    if(like == true) {
      if(docResult.likerIp.includes(ip)) {
        console.error("like failed: ip already in record. same ip can't like the stock more than once");
        return docResult;
      } else {
        docResult.likes += 1;
        docResult.likerIp.push(ip);
        return docResult.save().then(function(savedDoc) {
          return savedDoc;
        });
      }

    } else {
      return docResult;
    }
  })

  .catch(function (err) {
      console.error(err);
  })
  
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      
      var stockNames = new Array();
      var stockDoc = new Array();

      if(typeof(req.query.stock) == "object") {
        stockNames.push(req.query.stock[0]);
        stockNames.push(req.query.stock[1]);
      } else {
        stockNames.push(req.query.stock);
      }
      var like = (String(req.query.like).toLowerCase() == "true");
    
      
      var results = [];
      new Promise(function(resolve, reject) {
        console.log(" ---- start get promise ----");
        resolve();
      }).then(function() {;
        return locateDoc(stockNames[0], like, req.clientIp);
      })
    
      .catch(function (err) {
          console.error(err);
      })
    
      .then(function(result_doc) {
        
        results.push(result_doc);
        
        if(stockNames[1] != null) {
          console.log("check second dock")
          return locateDoc(stockNames[1], like, req.clientIp);
        } else {
          console.log("don't check second dock");
          return null;
        }
      })
      .catch(function (err) {
          console.error(err);
      })
      .then(function(result_doc) {
        
        results.push(result_doc);
        
        if(results[1] == null) {
          // show single stock
          res.send(results[0]);
        } else {
          // compare stocks
          results[0] = results[0].toObject();
          results[1] = results[1].toObject();
          
          results[0].rel_likes = results[0].likes - results[1].likes;
          results[1].rel_likes = results[1].likes - results[0].likes;
          
          delete results[0].likes;
          delete results[1].likes;
          
          res.send(results);
        }
      })
      .catch(function (err) {
          console.error(err);
      })
    
      /*
      var stock1Name, stock2Name;
      // array
      if(typeof(req.query.stock) == "object") {
        stock1Name = req.query.stock[0];
        stock2Name = req.query.stock[1];
      } else {
        stock1Name = req.query.stock;
      }
      var like = (String(req.query.like).toLowerCase() == "true");
    
      var requestNasdaqPromise = requestNasdaq(stock1Name);
      var requestNasdaq2Promise = requestNasdaq(stock2Name);
    
      requestNasdaqPromise.then(function(result_nasdaq) {
        
        var result_find1, result_find2;

        Stock.findOne({ "name": result_nasdaq.stock }, function(err, doc) {

          result_find1 = doc;
          return result_find1;
          
        }).then(function(result) {
          if(stock2Name != null) {
          console.log(stock2Name)
            return result_find2 = requestNasdaq2Promise.then(function(result) {
              return result;
            }).catch(function(err) {
              console.error(err);
            });
          } else {
            return null;
          }
        })
          .then(function() {
            
          if(result_find1 == null) {
              var newStock = new Stock({
                "name": result_nasdaq.stock,
                "price": result_nasdaq.price,
                "likes": 0,
                "likerIp": []
              });
              newStock.save(function(err) {
                if(err) { console.error(err); }
                result_find1 = newStock;
                return result_find1;
              });
            }
          
        }).then(function() {
            
          if(result_find2 == null && stock2Name != null) {
              var newStock = new Stock({
                "name": result_nasdaq.stock,
                "price": result_nasdaq.price,
                "likes": 0,
                "likerIp": []
              });
              newStock.save(function(err) {
                if(err) { console.error(err); }
                result_find2 = newStock;
                return result_find2;
              });
            }
          
        }).then(function() {
          
          
          // doc found. add like
          
          if(like == true) {
            if(result_find1.likerIp.includes(req.clientIp)) {
              console.error("like failed: ip already in record. same ip can't like the stock more than once");

            } else {
              result_find1.likes += 1;
              result_find1.likerIp.push(req.clientIp);
              result_find1.save(function(err) {
              if(err) { console.error(err); }
                
                return result_find1;
              });
            }
            
          } else {
            return result_find1;
          }
          
        }).then(function() {
          
          
          if(result_find2 == null && stock2Name != null) {
          
            if(like == true) {
              if(result_find1.likerIp.includes(req.clientIp)) {
                console.error("like failed: ip already in record. same ip can't like the stock more than once");

              } else {
                result_find2.likes += 1;
                result_find2.likerIp.push(req.clientIp);
                result_find2.save(function(err) {
                if(err) { console.error(err); }

                  return result_find2;
                });
              }

            } else {
              return result_find2;
            }
          } else {
            return null;
          }
          
        }).then(function() {
          
          if(result_find2 == null) {
           res.send(result_find1);
           
          } else {
            res.send(result_find1 + result_find2);
          
          }
          
        })

      }).catch(function(err) {
          
        console.error("fetching nasdaq api failed: " + err);
      });
    */
    });
    
}
