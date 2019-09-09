/*
  https://fuschia-custard.glitch.me/api/exercise/log?userId=SyKsUMHNm&from=2014-01-08&to=2018-07-24&limit=5
  limit: how many logs to display
*/

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB || 'mongodb://localhost/exercise-track',
                 { 
                  useNewUrlParser: true,
                  useCreateIndex: true
                 })

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

var UserSchema = new mongoose.Schema({
  "username":String,
  "userId":{type:String, index:true},
  "exerciseLog": Array
})

var ExerciseUser = mongoose.model("ExerciseUser", UserSchema);

/*
var genericELog = new Exercise({
  "userId":"asdf",
  "descrption":"cardio",
  duration:50,
  date:new Date()
})
genericELog.save(function(err,data) {
  if(err) {
    console.error(err);
  }
})
*/

/*
// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})
*/
app.post("/api/exercise/new-user", function(req,res) {
  
  if(req.body.username == null) {
    console.error("userID field must not be empty");
    return res.send("userID field must not be empty")
  }
  
  
  var newUser = new ExerciseUser({
    "username":req.body.username,
    // _id index auto generated,
    "exerciseLog": []
  });
  
  newUser.save((err,data) => {
    
    if(err) {
      return console.error(err);
    } else {
      
      res.json({
        "username": data.username,
        "userId": data._id
      });
    }
            
  });
  
});

app.post("/api/exercise/add", function(req,res) {
  
  if(req.body.userId == "=") {
    console.error("userID field must not be empty");
    return res.send("userID field must not be empty")
  }
  if(req.body.description == "") {
    console.error("exercise description field must not be empty");
    return res.send("exercise description field must not be empty")
  }
  if(req.body.duration == "") {
    console.error("exercise duration field must not be empty");
    return res.send("exercise duration field must not be empty")
  }
  if(req.body.date == "") {
    console.error("exercise date field must not be empty");
    return res.send("exercise date field must not be empty")
  }
  
  var parsedDate = new Date(req.body.date);
  if(parsedDate == "Invalid Date") {
    
    console.error("Invalid Date. must be yyyy-mm-dd");
    return res.send("Invalid Date. must be yyyy-mm-dd");
  }
  
  ExerciseUser.findOne({"_id": req.body.userId},(err,data)=> {
    if(err) {
      console.error(err);
      return res.send(err);
    }
    if(data == null) {
      console.error("userId not registered");
      return res.send("userId not registered");
    }
    
    data.exerciseLog.push({
        "description": req.body.description,
        "duration": req.body.duration,
        "date": req.body.date
      });
    
    data.save((err,data) => {
    
      if(err) {
        return console.error(err);
      }
    
      res.json({
        "username": data.username,
        "userId": data._id,
         "description":req.body.description,
         "duration": req.body.duration,
         "date": req.body.date
      });
    });
  });
  
  
});

app.get("/api/exercise/log", function(req,res) {
  /* quick test
    https://fcc-api4.glitch.me/api/exercise/log?userId=5d76a8e862cc9b68928ffb7c
    https://fcc-api4.glitch.me/api/exercise/log?userId=5d76a8e862cc9b68928ffb7c&from=2000-10-10&to=2019-10-10&limit=5
  */
  var fromDate, toDate, limit;
  if(req.query.from == "") {
    fromDate = new Date("1900-01-01");
  } else {
    
    fromDate = new Date(req.query.from);
    
    if(fromDate == "Invalid Date") {
      
      fromDate = new Date("1900-01-01");
    }
  }
  
  if(req.query.to== "") {
    toDate = new Date("2100-01-01");
  } else {
    toDate = new Date(req.query.to);
    
    if(toDate == "Invalid Date") {
      
      toDate = new Date("2100-01-01");
    }
  }
  limit = Number(req.query.limit);
  
  if(limit == "" || Number.isNaN(limit) == true || limit == null || typeof(limit) != "number") {
    limit = Number.MAX_VALUE;
  }
  
  
  ExerciseUser.findOne({"_id": req.query.userId}, (err,data)=> {
    if(err) {
      return console.error(err);
    } else {
      if(data == null) {
        return console.error("userId not found.")
      }
      
      var exerciseLogToDisplay = [];
      for(var i = 0; (i < limit) && (i < data.exerciseLog.length); i+=1) {
        
        var date = new Date(data.exerciseLog[i].date);
        
        if((fromDate < date) && (date < toDate)) { // js unexpected behavior? date comparision only works on pairs of 2
          exerciseLogToDisplay.push(data.exerciseLog[i]);
        }
      }
      
      res.json({
        "username": data.username,
        "userId": data._id,
        "exerciseLog": exerciseLogToDisplay
              
      });
      
    }
  })
  
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
