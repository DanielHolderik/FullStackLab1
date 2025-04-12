document.addEventListener("DOMContentLoaded", function(){
fetchAlRecipes();

    document.getElementsByClassName("recipeForm").addEventListener("submit", async (event) =>{
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
    const tbody = document.getElementsByClassName("tbody");
    tbody.innerHTML = ""; //clear

    

}