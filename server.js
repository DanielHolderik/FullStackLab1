//import all the stuff we need
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const Recipe = require('./database/database.js');

//innitialize the app
const server = express();
server.use(bodyParser.json());
dotenv.config();

const{CONNECTION_URL} = process.env;

//connect to DB
mongoose.connect(CONNECTION_URL,{useNewUrlParser: true, useUnifiedTopology: true})
.then(() =>{
    console.log('connected to DB \n');
}).catch((err) =>{
    console.error("connection to DB failed!", err);
});

//----API stuff---

//get all recipes
server.get('/api/dishes', async function (req, res){
try{
    const allRecipes = await Recipe.find();
    res.status(200).json(allRecipes);
}
catch(err){
    res.status(500).json({message: "error retrieving recipes" + err.message});
}
});

//get recipe by name
server.get('/api/dishes/:name', async function (req, res){
    try{
        const recipeName = req.params.name;
        const recipeFound = await Recipe.findOne({name: recipeName});
        if(recipeFound){
            res.status(200).json(recipeFound);
        }else{
            res.status(404).json({message: 'Recipe not found'});
        }
    }
    catch(err){
        res.status(500).json({message: "error getting recipe by name" + err.message});
    }
});

//uopdate dish
server.put('/api/dishes/:id', async function (req, res){
    const recipeId = req.params.id;

    try {
       const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
         req.body,
         {new: true}); 

         if (!  updatedRecipe) {
            return res.status(404).json({ message: 'recipe doesnt exist' });
        }
    } 
    catch (err){
        res.status(500).json({ message: "error in updating dish" + err.message });
    }
});

//delete recipe
server.delete('/api/dishes/:id', async function (req, res){
    const recipeId = req.params.id;

    try{
        const recipeToDelete = await Recipe.findByIdAndDelete(recipeId);
        if (!recipeToDelete){
            return res.status(404).json({ message: 'recipe not found' + recipeId });
        } 
        res.status(200).json({ message: 'recipe deleted successfully' });
    } 
    catch (err){
        res.status(500).json({ message: 'error deleting recipe' + err.message });
    }
});
    

//post new recipe
server.post('/api/dishes', async function (req, res){
const { name, ingredients, preparation, time, landOfOrigin, glutenFree, vegan, spiceLevel } = req.body;

if (!name || !ingredients || !preparation || !time || !landOfOrigin || glutenFree === undefined || vegan === undefined || spiceLevel === undefined) {
    return res.status(400).json({ message: 'some required fields are empty' });
}
    
try{
    const existingRecipe = await Recipe.findOne({name: req.body.name});
    
    if(!existingRecipe){
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json(newRecipe);
    }else{
        res.status(409).json({message: 'dish exists'});
    }
}
catch(err){
    res.status(500).json({message: "error adding new recipe" + err.message});
}
});


server.listen(5000, () =>{
    console.log('------------------  \nserver running on port 5000  \n');
  });