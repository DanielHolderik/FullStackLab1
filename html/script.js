document.addEventListener("DOMContentLoaded", function(){
    console.log("---DOM LOADED---") //debug
fetchAlRecipes();
// console.log("fetched recipes" + recipes) //debug

    document.querySelector(".recipeForm").addEventListener("submit", async (event) => {
        event.preventDefault(); //no refresh
    
        const formInput = new FormData(event.target);
        const recipe = Object.fromEntries(formInput.entries()); //convert to JS object

        //recipe.name
        recipe.ingredients = recipe.ingredients.split(",").map(ingredient => ingredient.trim()); //array
        //recipe.preparation
        recipe.time = Number(recipe.time);
        recipe.spiceLevel = Number(recipe.spiceLevel);
        recipe.glutenFree = recipe.glutenFree === "on" ? true : false;
        recipe.vegan = recipe.vegan === "on" ? true : false;
        //console.log(recipe);

        await fetch('/api/dishes',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipe)
        })
    });
});

async function fetchAlRecipes(){
    const fetchResponse = await fetch('/api/dishes');
    const recipes = await fetchResponse.json();
    console.log("fetched recipes", recipes); //debug
    const tbody = document.querySelector(".tbody");
    console.log("tbody is:", tbody); //debug
    tbody.innerHTML = ""; //clear

    recipes.forEach(recipe => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input value="${recipe.name}"  id="name-${recipe._id}"></td>
            <td><input value="${recipe.ingredients}"  id="ingedients-${recipe._id}"></td>
            <td><input value="${recipe.landOfOrigin}" id="origin-${recipe._id}"></td>
            <td><input type="number" value="${recipe.time}" id="time-${recipe._id}"></td>
            <td><input type="number" value="${recipe.spiceLevel}" id="spice-${recipe._id}"></td>
            <td><input type="checkbox" id="gluten-${recipe._id}" ${recipe.glutenFree ? "checked" : ""} /></td>
            <td><input type="checkbox" id="vegan-${recipe._id}" ${recipe.vegan ? "checked" : ""} /></td>
            <td><button onclick="updateRecipe('${recipe._id}')">Save</button>
            <button onclick="deleteRecipe('${recipe._id}')">Delete</button></td>

            `;
            tbody.appendChild(tr);
    });

}

async function update(recipeId){
    //updated recupe object
    const updatedRecipe = {
        name: document.getElementById(`name-${recipeId}`).value,
        ingredients: document.getElementById(`ingredients-${recipeId}`).value.split(",").map(ingredient => ingredient.trim()),
        landOfOrigin: document.getElementById(`origin-${recipeId}`).value,
        time: Number(document.getElementById(`time-${recipeId}`).value),
        spiceLevel: Number(document.getElementById(`spice-${recipeId}`).value),
        glutenFree: document.getElementById(`gluten-${recipeId}`).checked,
        vegan: document.getElementById(`vegan-${recipeId}`).checked
    };
    // const name = document.getElementById(`name-${recipeId}`).value;
    // const ingredients = document.getElementById(`ingredients-${recipeId}`).value.split(",").map(ingredient => ingredient.trim());
    // const landOfOrigin = document.getElementById(`origin-${recipeId}`).value;
    // const time = Number(document.getElementById(`time-${recipeId}`).value);
    // const spiceLevel = Number(document.getElementById(`spice-${recipeId}`).value);
    // const glutenFree = document.getElementById(`gluten-${recipeId}`).checked;
    // const vegan = document.getElementById(`vegan-${recipeId}`).checked;
    //old code keep for now
    
    console.log(updatedRecipe); //debug

    //send PUT request
    await fetch(`/api/dishes/${recipeId}`, {
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRecipe)
    });

    //refresh the table w updated recipe 
    fetchAlRecipes();
};

async function deleteRecipe(recipeId){
    await fetch(`/api/dishes/${recipeId}`, {
        method: 'DELETE'
    });
    fetchAlRecipes();
}