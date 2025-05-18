// === GLOBALS ===


// Fonction pour créer une card de recette
function createRecipeCard(recipe) {
  // Création d'un élément <div> qui représentera la card
  const card = document.createElement("div");

  // Attribution de la classe CSS "recipe-card" à cette div
  card.className = "recipe-card";

  // Insertion du contenu HTML à l'intérieur de la card, avec les infos de la recette
  card.innerHTML = `
    <!-- Image de la recette, ou image par défaut si absente -->
    <img src="${recipe.image || "./assets/images/default-recipe.jpg"}"
 alt="${recipe.title}">

    <!-- Contenu principal de la recette -->
    <div class="recipe-card-content">
      <!-- Titre de la recette -->
      <h3 class="recipe-title">${recipe.title}</h3>

      <!-- Infos complémentaires : catégorie, difficulté, temps -->
      <div class="recipe-meta">
        <span>${recipe.category}</span>

        <!-- Emoji + difficulté -->
        <span>${getDifficultyEmoji(recipe.difficulty)} ${
    recipe.difficulty
  }</span>

        <!-- Temps total (prépa + cuisson) -->
        <span>⏱️ ${recipe.prepTime + (recipe.cookTime || 0)} min</span>
      </div>
    </div>

    <!-- Boutons d'action : voir, modifier, supprimer -->
    <div class="recipe-card-actions">
      <!-- Bouton "Voir" redirige vers une page dédiée (avec l'ID dans l'URL) -->
      <button onclick="window.location.href='recipe.html?id=${
        recipe._id
      }'">👁️ Voir</button>

      <!-- Bouton "Modifier", appelle une fonction JS avec l'ID -->
      <button onclick="editRecipe('${recipe._id}')">✏️ Modifier</button>

      <!-- Bouton "Supprimer", appelle une autre fonction JS avec l'ID -->
      <button onclick="deleteRecipe('${recipe._id}')">🗑️ Supprimer</button>
    </div>
  `;

  // La fonction retourne la card construite, prête à être insérée dans le DOM
  return card;
}

// Fonction pour obtenir l'emoji de difficulté
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

// === FILTRES ===

document
  .getElementById("applyFiltersBtn")
  ?.addEventListener("click", async () => {
    const queryParams = new URLSearchParams();
    ["title", "ingredient", "category", "difficulty"].forEach((field) => {
      const val = document.getElementById(`filter${capitalize(field)}`)?.value;
      if (val) queryParams.append(field, val);
    });

    try {
      const res = await fetch(`/api/recipes/search?${queryParams.toString()}`);
      const data = await res.json();
      const list = document.getElementById("recipesList");
      list.innerHTML = "";
      data.forEach((recipe) => list.appendChild(createRecipeCard(recipe)));
    } catch (err) {
      console.error("Erreur de filtrage :", err);
    }
  });

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// === RECETTES / GET / READ / OBTENIR TOUTES LES RECETTES ===

// Fonction asynchrone pour charger les recettes depuis l'API
async function loadRecipes() {
  try {
    // Envoie une requête GET à l'API pour récupérer toutes les recettes
    const res = await fetch("/api/recipes");

    // Attend la conversion de la réponse en JSON (tableau d'objets recette)
    const data = await res.json();

    // Trie les recettes par date de création décroissante (les plus récentes d'abord)
    const sorted = data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Sélectionne l'élément HTML où les recettes seront affichées
    const list = document.getElementById("recipesList");

    // Vide la liste avant d'ajouter les nouvelles cards (évite les doublons si la fonction est rappelée)
    list.innerHTML = "";

    // Pour chaque recette triée, crée une card HTML et l'ajoute à la liste
    sorted.forEach((recipe) => list.appendChild(createRecipeCard(recipe)));
  } catch (err) {
    // Si une erreur survient (ex : API indisponible), l'affiche dans la console
    console.error("Erreur lors du chargement des recettes :", err);
  }
}

// === RECETTE / POST / CREATE / AJOUTER UNE RECETTE ===
// === MODALE D'AJOUT ===

// Ouvre la modale d'ajout de recette lorsqu'on clique sur le bouton "Ajouter une nouvelle recette"
document.getElementById("addRecipeBtn")?.addEventListener("click", () => {
  document.getElementById("addModal").classList.remove("hidden");
});

// Ferme la modale lorsque l'on clique sur le bouton "Annuler"
document.getElementById("closeModalBtn")?.addEventListener("click", () => {
  document.getElementById("addModal").classList.add("hidden");
  document.getElementById("addRecipeForm").reset(); // Réinitialise le formulaire
});

// === Récupérer les unités via l'API ===
async function getUnits() {
  try {
    const res = await fetch("/api/ingredients/units");
    const units = await res.json();
    return units; // Renvoie la liste des unités disponibles
  } catch (error) {
    console.error("Erreur lors de la récupération des unités", error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

// === Ajouter un ingrédient dans le formulaire ===
document
  .getElementById("addIngredientField")
  ?.addEventListener("click", async () => {
    const container = document.getElementById("ingredientInputsContainer");
    const row = document.createElement("div");
    row.classList.add("ingredient-input");

    // Récupérer les unités à partir de l'API
    const units = await getUnits();

    // Créer un tableau d'options pour le sélecteur d'unités
    const unitOptions = units
      .map((unit) => `<option value="${unit}">${unit}</option>`)
      .join("");

    row.innerHTML = `
    <input type="text" placeholder="Nom de l'ingrédient" class="ingredient-name" required />
    <input type="number" placeholder="Quantité" class="ingredient-qty" min="0.01" step="0.01" required />
    <select class="ingredient-unit" required>
      <option value="">Unité</option>
      ${unitOptions}
    </select>
    <button type="button" class="remove-ingredient">❌</button>
  `;

    // Ajoute un écouteur d'événements pour supprimer cette ligne si l'utilisateur clique sur ❌
    row.querySelector(".remove-ingredient")?.addEventListener("click", () => {
      row.remove();
    });

    // Ajoute la ligne d'ingrédient au formulaire
    container.appendChild(row);
  });

// === Ajouter la recette via le formulaire ===
document
  .getElementById("addRecipeForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche l'envoi par défaut du formulaire (rechargement de page)

    const ingredientRows = document.querySelectorAll(
      "#ingredientInputsContainer .ingredient-input"
    );
    const ingredients = [];

    // Parcours chaque ligne d'ingrédient et extrait les valeurs
    ingredientRows.forEach((row) => {
      const name = row.querySelector(".ingredient-name").value.trim();
      const quantity = parseFloat(row.querySelector(".ingredient-qty").value);
      const unit = row.querySelector(".ingredient-unit").value.trim();
      console.log(name);
      
      if (name && !isNaN(quantity) && unit) {
        // Ajoute l'ingrédient à la liste des ingrédients si les informations sont valides
        ingredients.push({ name, quantity, unit });
      }
    });

    const newRecipe = {
      title: document.getElementById("title").value,
      ingredients,
      instructions: document.getElementById("instructions").value,
      prepTime: parseInt(document.getElementById("prepTime").value),
      cookTime: parseInt(document.getElementById("cookTime").value),
      difficulty: document.getElementById("difficulty").value,
      category: document.getElementById("category").value,
      image: document.getElementById("image").value.trim(),
    };

    try {
      // Envoie la nouvelle recette via une requête POST à l'API
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      });

      const data = await res.json(); // Récupère la réponse JSON du serveur

      if (res.ok) {
        document.getElementById("addRecipeForm").reset()
        document.getElementById("IngredientInputsContainer").innerHTML = "";
        alert("Recette ajoutée !"); // Affiche un message de succès
        loadRecipes(); // Recharge la liste des recettes
        document.getElementById("addModal").classList.add("hidden"); // Ferme la modale
      } else {
        alert("Erreur lors de l'ajout de la recette : " + data.message); // Affiche une erreur si la réponse n'est pas ok
      }
    } catch (err) {
      console.error("Erreur de soumission de la recette", err); // Affiche une erreur si le fetch échoue
    }
  });

// === RECETTE / PUT / UPDATE / MODIFIER UNE RECETTE ===
// === MODALE MODIFICATION ===

// Fonction qui permet de modifier une recette en la récupérant, pré-remplissant les champs dans une modale, et permettant d'ajouter ou de supprimer des ingrédients
async function editRecipe(recipeId) {
  try {
    // Récupération des données de la recette depuis l'API
    const res = await fetch(`/api/recipes/${recipeId}`);
    const recipe = await res.json();

    console.log("Recipe récupérée:", recipe);

    // Pré-remplissage des champs de la modale avec les données de la recette
    document.getElementById("editTitle").value = recipe.title;
    document.getElementById("editInstructions").value = recipe.instructions;
    document.getElementById("editPrepTime").value = recipe.prepTime;
    document.getElementById("editCookTime").value = recipe.cookTime;
    document.getElementById("editDifficulty").value = recipe.difficulty;
    document.getElementById("editCategory").value = recipe.category;
    document.getElementById("editImage").value = recipe.image;

    // Gestion des ingrédients
    const container = document.getElementById("editIngredientInputsContainer");
    container.innerHTML = ""; // Réinitialise le conteneur des ingrédients
    
    
    const units = await getUnits(); // Récupère la liste des unités disponibles
    const unitOptions = units
      .map((unit) => `<option value="${unit}">${unit}</option>`)
      .join("");

    // Pré-remplir les ingrédients existants dans la recette
    recipe.ingredients.forEach(({ ingredient, quantity, unit }) => {
   
      
      
      if (ingredient) {
        
        container.appendChild(
          createIngredientRow(
            ingredient.name,
            quantity,
            unit,
            unitOptions
          )
        );
      }
    });

    // Ajouter un nouvel ingrédient
    const addButton = document.getElementById("editAddIngredientField");
    if (!addButton.dataset.listenerAttached) {
      addButton.addEventListener("click", () => {
        container.appendChild(createIngredientRow("", "", "", unitOptions));
      });
      addButton.dataset.listenerAttached = "true"; // Marque que l'événement a été attaché
    }

    // Afficher la modale
    document.getElementById("editModal").classList.remove("hidden");

    // Stocker l'ID de la recette dans le formulaire
    document.getElementById("editRecipeForm").dataset.recipeId = recipeId;
  } catch (err) {
    console.error("Erreur lors de la récupération de la recette :", err);
  }
}

// Fonction utilitaire pour créer une ligne d'ingrédient
function createIngredientRow(name = "", quantity = "", unit = "", unitOptions) {
  const row = document.createElement("div");
  row.classList.add("ingredient-input");

  row.innerHTML = `
    <input type="text" value="${name}" placeholder="Nom de l'ingrédient" class="ingredient-name" required />
    <input type="number" value="${quantity}" placeholder="Quantité" class="ingredient-qty" min="0.01" step="0.01" required />
    <select class="ingredient-unit" required>
      <option value="">Unité</option>
      ${unitOptions}
    </select>
    <button type="button" class="remove-ingredient">❌</button>
  `;

  // Pré-sélectionne l'unité si elle est fournie
  if (unit) {
    row.querySelector(".ingredient-unit").value = unit;
  }

  // Ajoute un écouteur d'événement pour supprimer la ligne
  row
    .querySelector(".remove-ingredient")
    .addEventListener("click", () => row.remove());

  return row;
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
  document.getElementById("editRecipeForm").reset();
  document.getElementById("editIngredientInputsContainer").innerHTML = "";
  document.getElementById("editRecipeForm").dataset.recipeId = "";
}

document.getElementById("editRecipeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const recipeId = form.dataset.recipeId;

  const title = document.getElementById("editTitle").value.trim();
  const instructions = document.getElementById("editInstructions").value.trim();
  const prepTime = document.getElementById("editPrepTime").value;
  const cookTime = document.getElementById("editCookTime").value;
  const difficulty = document.getElementById("editDifficulty").value;
  const category = document.getElementById("editCategory").value;
  const image = document.getElementById("editImage").value;

  const ingredients = Array.from(
    document.querySelectorAll("#editIngredientInputsContainer .ingredient-input")
  )
    .map((row) => {
      const name = row.querySelector(".ingredient-name").value.trim();
      const unit = row.querySelector(".ingredient-unit").value;
      const quantityValue = row.querySelector(".ingredient-qty").value;
      const quantity = parseFloat(quantityValue);

      if (!name || !unit || isNaN(quantity) || quantity <= 0) {
        return null; // On ignore les ingrédients invalides
      }

      return {
        ingredient: { name, unit },
        quantity,
      };
    })
    .filter((item) => item !== null); // Supprime les lignes invalides

  const updatedRecipe = {
    title,
    instructions,
    prepTime,
    cookTime,
    difficulty,
    category,
    image,
    ingredients,
  };
console.log("Recette mise à jour :", updatedRecipe);
  try {
    const res = await fetch(`/api/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipe),
    });

    if (res.ok) {
      alert("Recette mise à jour !");
      closeEditModal();
      loadRecipes?.();
    } else {
      alert("Erreur lors de la mise à jour.");
    }
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
  }
});


// === RECETTE / DELETE / SUPPRIMER UNE RECETTE ===
// === MODALE SUPPRESSION ===
let recipeIdToDelete = null;

function deleteRecipe(recipeId) {
  recipeIdToDelete = recipeId;
  document.getElementById("deleteModal").classList.remove("hidden");
}

document
  .getElementById("confirmDeleteBtn")
  ?.addEventListener("click", async () => {
    if (!recipeIdToDelete) return;

    try {
      const res = await fetch(`/api/recipes/${recipeIdToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Recette supprimée !");
        loadRecipes();
      } else {
        alert("Erreur lors de la suppression de la recette");
      }

      closeDeleteModal();
    } catch (err) {
      console.error("Erreur de suppression de la recette", err);
    }
  });

function closeDeleteModal() {
  document.getElementById("deleteModal").classList.add("hidden");
  recipeIdToDelete = null;
}

// === INIT ===

window.onload = loadRecipes;