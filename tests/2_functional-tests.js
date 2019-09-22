/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'newl'})
        .end(function(err, res){
          
          //complete this one too
          assert.property(res.body, "_id");
          assert.property(res.body, "name");
          assert.property(res.body, "price");
          assert.property(res.body, "likes");
         
          assert.equal(res.body.name, "NEWL");
          assert.isAbove(new Number(res.body.price), 0);
         
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'newl',
               like: true})
        .end(function(err, res){
          
          //complete this one too
          assert.property(res.body, "_id");
          assert.property(res.body, "name");
          assert.property(res.body, "price");
          assert.property(res.body, "likes");
         
          assert.equal(res.body.name, "NEWL");
          assert.isAbove(new Number(res.body.price), 0);
          assert.isAbove(res.body.likes, 0);
         
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        
        
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'newl',
               like: true})
        .end(function(err, res){
          
          //complete this one too
          assert.property(res.body, "_id");
          assert.property(res.body, "name");
          assert.property(res.body, "price");
          assert.property(res.body, "likes");
         
          assert.equal(res.body.name, "NEWL");
          assert.isAbove(new Number(res.body.price), 0);
          assert.equal(res.body.likes, 1);
          //assert(res.text, "like failed: ip already in record. same ip can't like the stock more than once")
         
          done();
        });
      });
      
      test('2 stocks', function(done) {
        
        
        chai.request(server)
        .get('/api/stock-prices?stock=newl&stock=othr')
        .end(function(err, res){
          
          //complete this one too
          assert.isArray(res.body);
          
          assert.property(res.body[0], "_id");
          assert.property(res.body[0], "name");
          assert.property(res.body[0], "price");
          assert.property(res.body[0], "rel_likes");
          
          
          assert.property(res.body[1], "_id");
          assert.property(res.body[1], "name");
          assert.property(res.body[1], "price");
          assert.property(res.body[1], "rel_likes");
          
         
          assert.equal(res.body[0].name, "NEWL");
          assert.isAbove(new Number(res.body[0].price), 0);
          assert.isNumber(res.body[0].rel_likes, 0);
          
          assert.equal(res.body[1].name, "OTHR");
          assert.isAbove(new Number(res.body[1].price), 0);
          assert.isNumber(res.body[1].rel_likes, 0);
          
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        
          chai.request(server)
        .get('/api/stock-prices?stock=newl&stock=othr&like=true')
        .end(function(err, res){
          
          //complete this one too
          assert.isArray(res.body);
          
          assert.property(res.body[0], "_id");
          assert.property(res.body[0], "name");
          assert.property(res.body[0], "price");
          assert.property(res.body[0], "rel_likes");
          
          
          assert.property(res.body[1], "_id");
          assert.property(res.body[1], "name");
          assert.property(res.body[1], "price");
          assert.property(res.body[1], "rel_likes");
          
         
          assert.equal(res.body[0].name, "NEWL");
          assert.isAbove(new Number(res.body[0].price), 0);
          assert.isNumber(res.body[0].rel_likes, 0);
          
          assert.equal(res.body[1].name, "OTHR");
          assert.isAbove(new Number(res.body[1].price), 0);
          assert.isNumber(res.body[1].rel_likes, 0);
          
          done();
        });
      });
      
    });

});
