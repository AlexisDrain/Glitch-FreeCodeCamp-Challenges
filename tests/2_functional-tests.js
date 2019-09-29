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
var expect = chai.expect;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  var testThreadId_delete, testThreadId_general;
  var testReplyId_delete, testReplyId_general;
  
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    
    suite('POST', function(done) {
      test("valid thread text and password", function(done) {
        
      chai.request(server)
        .post('/api/threads/general')
        .type("form")
        .send({text: "test",
              delete_password: "test-password"})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          expect(res).to.redirect;
          done();
        });
      });
    });
    
    suite('GET', function() {
      test("get latest thread (and save id value)", function(done) {
        
      chai.request(server)
        .get('/api/threads/general')
        .type("form")
        .end(function(err, res) {
          
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.notProperty(res.body[res.body.length-1], "delete_password", "delete password field should not be sent");
          assert.notProperty(res.body[res.body.length-1], "reported", "delete password field should not be sent");
        
          testThreadId_delete = res.body[res.body.length-1]._id;
          testThreadId_general = res.body[0]._id;
        
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test("delete latest thread", function(done) {
        
      chai.request(server)
        .delete('/api/threads/general')
        .type("form")
        .send({thread_id:testThreadId_delete ,delete_password: 'test-password'})
        .end(function(err, res) {
          
          assert.equal(res.status, 200);
          assert.equal(res.text,'success');
          done();
        });
      });
    });
    
    suite('PUT', function() {
      
      test("report first thread", function(done) {
        
      chai.request(server)
        .put('/api/threads/general')
        .type("form")
        .send({report_id:testThreadId_general})
        .end(function(err, res) {
          
          assert.equal(res.status, 200);
          assert.equal(res.text,'success');
          done();
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test("valid reply text and password", function(done) {
        
      chai.request(server)
        .post('/api/replies/general')
        .type("form")
        .send({
        'text': 'test reply text',
        'delete_password': 'test-password',
        thread_id:testThreadId_general
          })
        .end(function(err, res){
          if(err) {
            console.log(err);
          }
          assert.equal(res.status, 200);              
          expect(res).to.redirect;
          done()
         });
      });
    });
    
    suite('GET', function() {
      
      test('get replies', function(done) {
      chai.request(server)
    .get('/api/replies/general')
    .query({thread_id: testThreadId_general})
    .end(function(err, res){
        assert.equal(res.status, 200);

        assert.property(res.body.replies[res.body.replies.length-1], 'text');
        assert.equal(res.body.replies[res.body.replies.length-1].text,'test reply text');
        assert.notProperty(res.body.replies[res.body.replies.length-1], 'delete_password', 'The delete_passwords fields will not be sent');
        assert.notProperty(res.body.replies[res.body.replies.length-1], 'reported', 'The reported fields will not be sent');
        testReplyId_delete=res.body.replies[res.body.replies.length-1]._id;
        
        done();
        });
      });
    });
    
    suite('PUT', function() {
      
      test('report reply', function(done) {
      chai.request(server)
    .put('/api/replies/general')
    .send({thread_id: testThreadId_general, reply_id:testReplyId_delete})
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text,'success');
        done();
        });
      });
    });
    
    suite('DELETE', function() {
      
      test('delete reply', function(done) {
      chai.request(server)
    .put('/api/replies/general/')
    .send({thread_id: testThreadId_general, reply_id:testReplyId_delete, delete_password:"test-password"})
    .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.text,'success');
        done();
        });
      });
    });
    
  });

});
