//import all the stuff we need
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const recipe = require('./database/database.js');

//innitialize the app
const server = express();
server.use(bodyParser.json());
dotenv.config();

const{CONNECTION_URL} = process.env;

//connect to DB
mongoose.connect(CONNECTION_URL,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() =>{
    console.log('connected to DB');
}).catch((err) =>{
    console.error("connection to DB failed!", err);
});

//API stuff
server.get('api/dishes', function async (req, res){

});


server.listen(5000, () =>{
    console.log('server running on port 5000');
  });