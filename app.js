const express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const mongoose = require('mongoose');
var Phonebook = require('./phonebook.model');
var fs = require('fs');

//connection to mongodb database code 
var db = 'mongodb://127.0.0.1:27017/phonebook';
mongoose.connect(db);


app.get('/', function (req, res) {
  res.send('lets start the Secure Programming final project');
});

var regExptNameCode = /(.*[a-zA-Z][ ].*[a-zA-Z].*[a-zA-Z][ ].*|.*[’].*[\-].+[\-].*|.*[’].*[\-].*[\-].*|.+[’]{2}.*|.*[\d].*|.*[<>].*[<\/>].*|.*[\*;].*|^[’][a-zA-Z].*)/
var regExptNumberCode = /(^[\d]{3}$|^\(001\).*|^[\+][0-9]{4,}.*|.*[a-zA-Z].+|^[\+][0][1].*|^[0-9]{10}|.*[0-9][a-zA-z].*|.*[\/].*)/

//get all the records in phonebook
app.get('/PhoneBook/list', function (req, res) {
  Phonebook.find({})
    .exec(function (err, records) {
      if (err) {
        res.send('error has occured');
        // let date_ob = new Date();
        fs.appendFile("./logFile", "\n" + new Date() + " > GET > ERROR > Message: " + err, function (err) { });
      } else {
        res.json(records);
        fs.appendFile("./logFile", "\n" + new Date() + " > GET > Status : 200 > SUCCESS > Message: Successfully retrieved all the records from the Phonebook", function (err) { });
      }
    });
});


//get one member in a phonebook by name 
app.get('/PhoneBook/list/getByName', function (req, res) {
  const userName = req.query.name
  if (regExptNameCode.test(userName))
    return res.status(400).json({ status: 400, error: 'Invalid name format has been entered' })
  else {
    Phonebook.findOne({
      name: req.query.name
    })
      .exec(function (err, records) {
        if (err) {
          res.send('error has occured');
        } else {
          res.json({ status: 200, description: 'Success' })
        }
      });
  }
});


//get one record in a phonebook by number 
app.get('/PhoneBook/list/getByNumber', function (req, res) {
  const userNumber = req.query.phoneNumber
  if (regExptNumberCode.test(userNumber))
    return res.status(400).json({ status: 400, error: 'Invalid phonenumber has been entered' })
  else {
    Phonebook.findOne({
      phoneNumber: req.query.phoneNumber
    })
      .exec(function (err, records) {
        if (err) {
          res.send('error has occured');
        } else {
          res.json({ status: 200, description: 'Success' })
        }
      });
  }
});


//post record to phonebook
app.post('/PhoneBook/add', function (req, res) {

  const userName = req.body.name
  const userNumber = req.body.phoneNumber

  if (regExptNameCode.test(userName) && regExptNumberCode.test(userNumber)) {
    fs.appendFile("./logFile", "\n" + new Date() + " > POST > Status : 400 > ERROR > Message: Invalid name and phoneNumber format has been entered", function (err) { });
    return res.status(400).json({ status: 400, error: 'Invalid name and phoneNumber format has been entered' })
  }
  else if (regExptNameCode.test(userName)) {
    fs.appendFile("./logFile", "\n" + new Date() + " > POST > Status : 400 > ERROR > Message: Invalid name format has been entered", function (err) { });
    return res.status(400).json({ status: 400, error: 'Invalid name format has been entered' })
  }
  else if (regExptNumberCode.test(userNumber)) {
    fs.appendFile("./logFile", "\n" + new Date() + " > POST > Status : 400 > ERROR > Message: Invalid phoneNumber format has been entered", function (err) { });
    return res.status(400).json({ status: 400, error: 'Invalid phoneNumber format has been entered' })
  }
  else {
    Phonebook.create(req.body, function (err, records) {
      if (err) {
        fs.appendFile("./logFile", "\n" + new Date() + " > POST > ERROR > Message: " + err, function (err) { });
        res.send('error has occured');
      } else {
        res.json({ status: 200, description: 'Success' })
        fs.appendFile("./logFile", "\n" + new Date() + " > POST > Status : 200 > SUCCESS > Message: Successfully Added { name : " + userName + ", phoneNumber: " + userNumber + " }", function (err) { });
      }
    });
  }
});


//put - Remove someone from the database by name.
app.put("/PhoneBook/deleteByName", function (req, res) {
  const userName = req.query.name
  if (regExptNameCode.test(userName)) {
    fs.appendFile("./logFile", "\n" + new Date() + " > PUT > /PhoneBook/deleteByName > Status : 400 > ERROR > Message: Invalid name format has been entered", function (err) { });
    return res.status(400).json({ status: 400, error: 'Invalid name format has been entered' })
  }
  else {
    Phonebook.deleteOne(req.query, function (err, records) {
      if (err) {
        fs.appendFile("./logFile", "\n" + new Date() + " > PUT > /PhoneBook/deleteByName > ERROR > Message: " + err, function (err) { });
        res.send('error has occured');
      } else {
        if (records.deletedCount == 0) {
          fs.appendFile("./logFile", "\n" + new Date() + " > PUT > /PhoneBook/deleteByName > Status : 404 > ERROR > Message: An attempt to remove a non-existent name from the directory", function (err) { });
          return res.status(404).json({ status: 404, error: 'An attempt to remove a non-existent name from the directory' })
        }
        else {
          res.json({ status: 200, description: 'Success' })
          fs.appendFile("./logFile", "\n" + new Date() + " > PUT > /PhoneBook/deleteByName > Status : 200 > SUCCESS > Message: Successfully Deleted { name : " + userName + " }", function (err) { });
        }
      }
    });
  }
});


//put - Remove someone by telephone
app.put("/PhoneBook/deleteByNumber", function (req, res) {
  const userNumber = req.query.phoneNumber

  if (regExptNumberCode.test(userNumber)) {
    fs.appendFile("./logFile", "\n" + new Date() + " > PUT > /PhoneBook/deleteByNumber > Status : 400 > ERROR > Message: Invalid phoneNumber format has been entered", function (err) { });
    return res.status(400).json({ status: 400, error: 'Invalid phoneNumber format has been entered' })
  }
  else {
    Phonebook.deleteOne(req.query, function (err, records) {
      if (err) {
        fs.appendFile("./logFile", "\n" + new Date() + " > PUT > /PhoneBook/deleteByNumber > ERROR > Message: " + err, function (err) { });
        res.send('error has occured');
      } else {
        if (records.deletedCount == 0) {
          fs.appendFile("./logFile", "\n" + new Date() + " > PUT > /PhoneBook/deleteByNumber > Status : 404 > ERROR > Message: An attempt to remove a non-existent phoneNumber from the directory", function (err) { });
          return res.status(404).json({ status: 404, error: 'An attempt to remove a non-existent phoneNumber from the directory' })
        }
        else {
          fs.appendFile("./logFile", "\n" + new Date() + " > PUT > /PhoneBook/deleteByNumber > Status : 200 > SUCCESS > Message: Successfully Deleted { phoneNumber : " + userNumber + " }", function (err) { });
          res.json({ status: 200, description: 'Success' })
        }
      }
    });
  }
});


//code to listen on 8080 port
var port = 8080;
app.listen(port, function () {
  console.log("App is running on the Port " + port);
  fs.writeFile("./logFile", new Date() + " > Message: App is running on Port " + port, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The logFile has got created! You can now open this file anytime and check for the logs as any api has got executed or any error has occured...");
    }
  });
});