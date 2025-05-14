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
    console.log(recipe); // Pour debug : tu peux le retirer plus tard

    displayRecipeDetails(recipe);
  } catch (err) {
    console.error("Erreur:", err);
    alert("Impossible de charger les détails de la recette.");
  }
});

function displayRecipeDetails(recipe) {
  
  const recipeDetails = document.getElementById("recipeDetails");

  recipeDetails.innerHTML = `
  <div class="recipe-detail">
    <h2 id="recipeTitle">${recipe.title}</h2>
    <p><strong>Catégorie :</strong> ${recipe.category}</p>
    <p><strong>Difficulté :</strong> ${getDifficultyEmoji(recipe.difficulty)} ${recipe.difficulty}</p>
    <p><strong>Temps de préparation :</strong> ${recipe.prepTime} min</p>
    <p><strong>Temps de cuisson :</strong> ${recipe.cookTime} min</p>

    <p><strong>Ingrédients :</strong></p>
    <ul>
      ${recipe.ingredients
        .map(
          (item) => `
            <li>${item.quantity || "?"} ${item.ingredient.unit || ""} de ${item.ingredient.name || "Ingrédient inconnu"}</li>
          `
        )
        .join("")}
    </ul>

    <p><strong>Instructions :</strong></p>
    <p>${recipe.instructions}</p>

    ${
      recipe.image
        ? `<img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" />`
        : ""
    }
    <div/>
  `;
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