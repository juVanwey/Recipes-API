document.addEventListener("DOMContentLoaded", async () => {
  // Récupérer l'ID de la recette dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (!recipeId) {
    alert("Aucune recette spécifiée.");
    return;
  }

  try {
    const res = await fetch(`/api/recipes/${recipeId}`);
    if (!res.ok) throw new Error("Erreur lors du chargement de la recette");

    const recipe = await res.json();
    console.log(recipe);
    // Afficher les détails de la recette
    displayRecipeDetails(recipe);
  } catch (err) {
    console.error("Erreur:", err);
    alert("Impossible de charger les détails de la recette.");
  }
});

async function displayRecipeDetails(recipe) {
  const recipeDetails = document.getElementById("recipeDetails");

  // Récupérer les informations des ingrédients en fonction de leurs IDs
  const ingredientDetails = await getIngredientDetails(recipe.ingredients);

  recipeDetails.innerHTML = `
      <h2>${recipe.title}</h2>
      <p><strong>Catégorie :</strong> ${recipe.category}</p>
      <p><strong>Difficulté :</strong> ${getDifficultyEmoji(
        recipe.difficulty
      )} ${recipe.difficulty}</p>
      <p><strong>Temps de préparation :</strong> ${recipe.prepTime} min</p>
      <p><strong>Temps de cuisson :</strong> ${recipe.cookTime} min</p>
      
      <h3>Ingrédients :</h3>
      <ul>
        ${ingredientDetails
          .map(
            (ingredient) => `
          <li>${ingredient.quantity} ${ingredient.unit} de ${ingredient.name}</li>
        `
          )
          .join("")}
      </ul>
      
      <h3>Instructions :</h3>
      <p>${recipe.instructions}</p>
      
      ${
        recipe.image
          ? `<img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" />`
          : ""
      }
    `;
}

// Fonction pour récupérer les informations des ingrédients en fonction de leurs IDs
async function getIngredientDetails(ingredients) {
  const ingredientIds = ingredients.map((ingredient) => ingredient.ingredient);

  try {
    const res = await fetch(`/api/ingredients?ids=${ingredientIds.join(",")}`);
    const ingredientData = await res.json();

    // Retourner une liste d'ingrédients avec leurs détails complets
    return ingredients.map((ingredient) => {
      const ingredientDetail = ingredientData.find(
        (data) => data._id === ingredient.ingredient
      );
      return {
        ...ingredient,
        name: ingredientDetail ? ingredientDetail.name : "Inconnu", // Si l'ingrédient n'est pas trouvé, affiche 'Inconnu'
      };
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des ingrédients :", err);
    return ingredients.map((ingredient) => ({
      ...ingredient,
      name: "Inconnu", // Si la requête échoue, les ingrédients sont affichés comme 'Inconnu'
    }));
  }
}

function getDifficultyEmoji(level) {
  switch (level) {
    case "facile":
      return "🟢";
    case "moyen":
      return "🟠";
    case "difficile":
      return "🔴";
    default:
      return "";
  }
}
