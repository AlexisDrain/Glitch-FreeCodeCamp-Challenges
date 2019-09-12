/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert = chai.assert;
var ConvertHandler = require('../controllers/convertHandler.js');

var convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  
  suite('Function convertHandler.getNum(input)', function() {
    
    test('Whole number input', function(done) {
      var input = '32L';
      assert.equal(convertHandler.getNum(input),32);
      done();
    });
    
    test('Decimal Input', function(done) {
      var input = '30.05 L';
      assert.equal(convertHandler.getNum(input), 30.05);
      done();
    });
    
    test('Fractional Input', function(done) {
      var input = "3/5gal";
      assert.equal(convertHandler.getNum(input), 3/5);
      assert.equal(convertHandler.getNum(input), 0.6);
      done();
    });
    
    test('Fractional Input w/ Decimal', function(done) {
      var input = "3.1/5 gal";
      assert.equal(convertHandler.getNum(input), 3.1/5);
      assert.equal(convertHandler.getNum(input), 0.62);
      done();
    });
    
    test('Invalid Input (double fraction)', function(done) {
      var input =  "3.1/5/5 gal";
      assert.equal(convertHandler.getNum(input), "invalid number");
      assert.notEqual(convertHandler.getNum(input), 3.1/5/5);
      done();
    });
    
    test('No Numerical Input', function(done) {
      var input = "gal";
      assert.equal(convertHandler.getNum(input), 1);
      done();
    }); 
    
  });
  
  suite('Function convertHandler.getUnit(input)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
      input.forEach(function(ele) {
        assert.equal(convertHandler.getUnit(ele).toLowerCase(), ele.toLowerCase());
      });
      done();
    });
    
    test('Unknown Unit Input', function(done) {
      var knownUnits = ['gal','l','mi','km','lbs','kg'];
      var input = "kilo";
      knownUnits.forEach(function(validUnit) {
        assert.notEqual(convertHandler.getUnit(input).toLowerCase(), validUnit);
      })
      assert.equal(convertHandler.getUnit(input), "invalid unit");
      done();
    });  
    
  });
  
  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','l','mi','km','lbs','kg'];
      var expect = ['l','gal','km','mi','kg','lbs'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.getReturnUnit(ele).toLowerCase(), expect[i].toLowerCase());
      });
      done();
    });
    
  });  
  
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      var input = ['gal','l','mi','km','lbs','kg'];
      var expect = ['gallons','liters','miles','kilometers','pounds','kilograms'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
      })
      done();
    });
    
  });
  
  suite('Function convertHandler.convert(num, unit)', function() {
    
    test('Gal to L', function(done) {
      var input = [5, 'gal'];
      var expected = 18.9271;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('L to Gal', function(done) {
      
      var input = [5, 'l'];
      var expected = 1.320864;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('Mi to Km', function(done) {
      
      var input = [5, 'mi'];
      var expected = 8.04672;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('Km to Mi', function(done) {
      
      var input = [5, 'km'];
      var expected = 3.106856;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('Lbs to Kg', function(done) {
      
      var input = [5, 'lbs'];
      var expected = 2.267962;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
    test('Kg to Lbs', function(done) {
      
      var input = [5, 'kg'];
      var expected = 11.02311;
      assert.approximately(convertHandler.convert(input[0],input[1]),expected,0.1); //0.1 tolerance
      done();
    });
    
  });

});