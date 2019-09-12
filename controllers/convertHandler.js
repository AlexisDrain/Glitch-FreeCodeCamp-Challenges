/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.getNum = function(input) {
    
    if(this.catchError(input) != "input valid") {
      return this.catchError(input);
    }
    
    var result;
    var regWord = /[a-z]+/i;
    var whiteSpaceReg = /\s+/g;
    
    var numPart = input.replace(regWord, "").replace(whiteSpaceReg, "");
    
    if(numPart == "") {
      numPart = 1;
    }
    
    
    result = eval(numPart);
    
    return result;
  };
  
  this.getUnit = function(input) {
    
    if(this.catchError(input) != "input valid") {
      return this.catchError(input);
    }
    
    var result;
    
    var regUnit = /[a-z]+/i;
    input = input.match(regUnit).join('').toLowerCase();
    
      
      
    
    if(input == "gal" || input == "lbs" || input == "mi" || input == "kg" || input == 'km') {
      result = input;
    } else if(input == "l") {
      result = "L";
    }
    
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    
    if(this.catchError("1"+initUnit) != "input valid") {
      return this.catchError("1"+initUnit);
    };
    var result = "";
    initUnit = initUnit.toLowerCase();
    
    var validUnits = ["gal", "lbs", "mi", "l", "kg", "km"];
    var expectedUnits = ["l", "kg", "km", "gal", "lbs", "mi"];
    validUnits.forEach((ele, i)=> {
      if(ele == initUnit) {
        result = expectedUnits[i];
      }
    });
    
    return result;
  };

  this.spellOutUnit = function(unit) {
    
    if(this.catchError("1"+unit) != "input valid") {
      return this.catchError("1"+unit);
    };
    
    var result;
    unit = unit.toLowerCase();
    
    var validUnits = ["gal", "lbs", "mi", "l", "kg", "km"];
    var expectedUnits = ["gallons", "pounds", "miles", "liters", "kilograms", "kilometers"];
    validUnits.forEach((ele, i)=> {
      if(ele == unit) {
        result = expectedUnits[i];
      }
    });
    
    
    return result;
  };
  
  this.convert = function(initNum, initUnit) {
    
    if(this.catchError(initNum+initUnit) != "input valid") {
      return this.catchError(initNum+initUnit);
    };
    
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    var result;
    
    
    initUnit = initUnit.toLowerCase();
    if(initUnit == "gal") {
      result = initNum * galToL// + "l";
    } else if(initUnit == "l") {
      result = initNum / galToL //+ "gal";
    } else if(initUnit == "lbs") {
      result = initNum * lbsToKg //+ "kg";
    } else if(initUnit == "kg") {
      result = initNum / lbsToKg //+ "lbs";
    } else if(initUnit == "mi") {
      result = initNum * miToKm //+ "km";
    } else if(initUnit == "km") {
      result = initNum / miToKm //+ "mi";
    }
    
    return result;
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    
    if(this.catchError(initNum+initUnit) != "input valid") {
      return this.catchError(initNum+initUnit);
    };
    
    var result = initNum + " " + this.spellOutUnit(initUnit) + " converts to " + returnNum.toFixed(5) + " " + this.spellOutUnit(returnUnit);
    
    return result;
  };
  
  this.catchError = function(input) {
    
    var numIsValid = true, unitIsValid = true;
    
    var regWord = /[a-z]+/i;
    var whiteSpaceReg = /\s+/g;
    
    var numPart = input.replace(regWord, "").replace(whiteSpaceReg, "");
    var unitPart = input.match(regWord).join("").toLowerCase();
    
    if(numPart == "") {
      numPart = 1;
    }
    
    var regNumValidator = /^(\d+)?([.])?(\d+)?([\/\\])?(\d+)?([.])?(\d+)?$/;
    if(regNumValidator.test(numPart) == false) {
      numIsValid = false;
    }
    
    numPart = eval(numPart);
    if(typeof(numPart) != 'number' || Number.isNaN(numPart) == true) {
      numIsValid = false;
    }
    
    var validUnits = ["gal", "lbs", "mi", "l", "kg", "km"];
    var expectedUnits = ["l", "kg", "km", "gal", "lbs", "mi"];
    validUnits.some((ele, i)=> {
      if(ele == unitPart) {
        unitIsValid = true;
        return true; // break out of loop
      } else {
        unitIsValid = false;
      }
    });
    
    
    if(numIsValid == false && unitIsValid == false) {
      return 'invalid number and unit';
    } else if(numIsValid == false) {
      return "invalid number";
    } else if(unitIsValid == false) {
      return 'invalid unit';
    } else {
      return "input valid";
    }
  }
}

module.exports = ConvertHandler;
