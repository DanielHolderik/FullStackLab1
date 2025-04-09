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

//----API stuff---

//get all recipes
server.get('api/dishes', async function (req, res){
try{
    const allRecipes = await recipe.find();
    res.status(200).json(allRecipes);
}
catch(err){
    res.status(500).json({message: err.message});
}
});

//get recipe by name
server.get('/api/dishes/:name', async function (req, res){
    try{
        const recipeName = req.params.name;
        const recipeFound = await recipe.findOne({name: recipeName});
        if(recipeFound){
            res.status(200).json(recipeFound);
        }else{
            res.status(404).json({message: 'Recipe not found'});
        }
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

//post new recipe
server.post('/api/dishes', async function (req, res){
try{
    const existingRecipe = await recipe.findOne({name: req.body.name});
    
    if(!existingRecipe){
        const newRecipe = new recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    }else{
        res.status(409).json({message: 'dish exists'});
    }
}catch(err){
    res.status(500).json({message: err.message});
}
});


server.listen(5000, () =>{
    console.log('server running on port 5000');
  });