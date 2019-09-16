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
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(res.body.created_by, "Functional Test - Every field filled in");
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          assert.isTrue(res.body.open);
          
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post("/api/issues/test")
          .send({
            issue_title: 'Title',
            issue_text: 'only required fields',
            created_by: 'only required fields',
        })
          .end(function(err, res){
            assert.equal(res.status, 200);
            
            assert.equal(res.body.issue_title, "Title");
            assert.equal(res.body.issue_text, "only required fields");
            assert.equal(res.body.created_by, "only required fields");
            assert.isUndefined(res.body.assigned_to);
            assert.isUndefined(res.body.status_text);
                         
            done();
        })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post("/api/issues/test")
          .send({
            issue_title: 'Missing required field: Text'
        })
          .end(function(err, res){
            assert.equal(res.status, 200);
            
            assert.isEmpty(res.body);
            assert.equal(res.text, "Error: Required field issue_text is empty. can't complete.");
          
            /*
            assert.isUndefined(res.body.issue_title);
            assert.isUndefined(res.body.issue_text);
            assert.isUndefined(res.body.created_on);
            assert.isUndefined(res.body.updated_on);
            assert.isUndefined(res.body.created_by);
            assert.isUndefined(res.body.assigned_to);
            assert.isUndefined(res.body.open);
            assert.isUndefined(res.body.status_text);
            assert.isUndefined(res.body._id);
            */
            done();
        })
        
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        
        chai.request(server)
          .put("/api/issues/test")
          .send({
        })
          .end(function(err, res){
            assert.equal(res.status, 200);
            
            assert.isEmpty(res.body);
            assert.equal(res.text, 'no updated field sent');
                         
            done();
        })
      });
      
      test('One field to update', function(done) {
        
        chai.request(server)
          .put("/api/issues/test")
          .send({
          _id: "5d7d9e03da39a10080193188",
          assigned_to: "newValue"
          
        })
          .end(function(err, res){
            assert.equal(res.status, 200);
          
            assert.equal(res.text, "successfully updated");
        });
        chai.request(server)
        .get('/api/issues/test')
        .query({
          _id: "5d7d9e03da39a10080193188"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.equal(res.body[0].assigned_to, 'newValue');
          done();
        });
        
      });
      
      test('Multiple fields to update', function(done) {
        
        
        chai.request(server)
          .put("/api/issues/test")
          .send({
          _id: "5d7d9e03da39a10080193188",
          created_by: "newValue",
          assigned_to: "newValue"
          
        })
          .end(function(err, res){
            assert.equal(res.status, 200);
            
            assert.equal(res.text, "successfully updated");
        });
        chai.request(server)
        .get('/api/issues/test')
        .query({
          _id: "5d7d9e03da39a10080193188"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          
          assert.equal(res.body[0].created_by, 'newValue');
          assert.equal(res.body[0].assigned_to, 'newValue');
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        // create query filter
        chai.request(server)
        .get('/api/issues/test')
        .query({
          issue_title:"test reserved .get",
          open:true
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          
          assert.equal(res.body[0].issue_title, "test reserved .get");
          assert.equal(res.body[0].open, true);
          done();
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        // create query filter
        chai.request(server)
        .get('/api/issues/test')
        .query({
          issue_title:"test reserved .get",
          issue_text:"test reserved .get",
          status_text:"test reserved .get",
          created_by:"test reserved .get",
          assigned_to:"test reserved .get",
          open:true
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          
          assert.equal(res.body[0].issue_title, "test reserved .get");
          assert.equal(res.body[0].issue_text, "test reserved .get");
          assert.equal(res.body[0].status_text, "test reserved .get");
          assert.equal(res.body[0].created_by, "test reserved .get");
          assert.equal(res.body[0].assigned_to, "test reserved .get");
          assert.equal(res.body[0].open, true);
          done();
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id:"nonono"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isNotArray(res.body);
          assert.equal(res.text, "could not delete nonono");
          done();
        });
      });
      
      test('Valid _id', function(done) {
        var saveId;
        
        chai.request(server)
        // create new issue to delete
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          
          saveId = res.body._id;
        })
        chai.request(server)
        // delete
        .delete('/api/issues/test')
        .send({
          _id: saveId
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          
          assert.isNotArray(res.body);
          assert.equal(res.text, "deleted " + saveId);
          done();
        });
      });
      
    });

});
