// Importation des modèles Recipe et Ingredient
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
const { log } = require("console");

// Récupérer toutes les recettes
exports.getAllRecipes = async (req, res) => {
  try {
    // Recherche toutes les recettes et peupler les détails des ingrédients
    const recipes = await Recipe.find().populate("ingredients.ingredient");

    // Envoie la liste des recettes trouvées en réponse
    res.status(200).json(recipes);
  } catch (error) {
    // Si une erreur survient lors de la récupération des recettes, on renvoie une erreur 500
    res.status(500).json({ message: "Erreur lors de la récupération des recettes", error });
  }
};

// Rechercher des recettes selon différents critères
exports.searchRecipes = async (req, res) => {
  const { title, ingredient, category } = req.query;

  // Initialisation d'un objet de filtrage vide
  const filter = {};

  // Si un titre est fourni, ajouter un filtre pour le champ "title"
  if (title) {
    filter.title = { $regex: title, $options: "i" }; // Recherche insensible à la casse
  }

  // Si un ingrédient est fourni, filtrer par l'ID de l'ingrédient
  if (ingredient) {
    filter["ingredients.ingredient"] = ingredient;
  }

  // Si une catégorie est fournie, ajouter un filtre pour la catégorie
  if (category) {
    filter.category = category;
  }

  try {
    // Recherche des recettes correspondant au filtre
    const recipes = await Recipe.find(filter).populate("ingredients.ingredient");

    // Envoie les recettes trouvées en réponse
    res.status(200).json(recipes);
  } catch (error) {
    // En cas d'erreur lors de la recherche des recettes, renvoyer une erreur 500
    res.status(500).json({ message: "Erreur lors de la recherche des recettes", error });
  }
};

// Obtenir une recette par son ID
exports.getRecipeById = async (req, res) => {
  try {
    // Recherche d'une recette spécifique par son ID
    const recipe = await Recipe.findById(req.params.id).populate("ingredients.ingredient");

    // Si la recette n'est pas trouvée, renvoyer une erreur 404
    if (!recipe) return res.status(404).json({ message: "Recette non trouvée" });

    // Si la recette est trouvée, la renvoyer en réponse avec le code 200
    res.status(200).json(recipe);
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse d'erreur avec un code 500
    res.status(500).json({ message: "Erreur lors de la récupération de la recette", error });
  }
};

// Ajouter une nouvelle recette
exports.createRecipe = async (req, res) => {
  try {
    // Extraction des données envoyées dans la requête
    const { title, ingredients, instructions, prepTime, cookTime, difficulty, category, image } = req.body;

    const resolvedIngredients = [];

    // Résolution des ingrédients : vérification de leur existence et création si nécessaire
    for (const item of ingredients) {
      const { name, quantity, unit } = item;

      // Recherche de l'ingrédient par son nom
      let ingredient = await Ingredient.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });

      if (!ingredient) {
        // Si l'ingrédient n'existe pas, on le crée
        ingredient = await Ingredient.create({ name, unit });
      }

      resolvedIngredients.push({
        ingredient: ingredient._id,
        quantity,
        unit
      });
    }

    // Création de la nouvelle recette
    const newRecipe = new Recipe({
      title,
      ingredients: resolvedIngredients,
      instructions,
      prepTime,
      cookTime,
      difficulty,
      category,
      image,
    });

    // Sauvegarde de la recette dans la base de données
    await newRecipe.save();

    // Réponse de succès avec la recette ajoutée
    res.status(201).json({ message: "Recette ajoutée", recipe: newRecipe });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse d'erreur avec un code 400
    res.status(400).json({ message: "Erreur lors de l'ajout de la recette", error });
  }
};

// Mettre à jour une recette existante
// exports.updateRecipe = async (req, res) => {
//   try {
//     // Mise à jour de la recette avec l'ID dans l'URL et les données dans la requête
//     const updatedRecipe = await Recipe.findByIdAndUpdate(
//       req.params.id,
//       req.body, // Les nouvelles données de la recette
//       { new: true } // Retourner la recette mise à jour
//     );

//     // Si la recette n'est pas trouvée, renvoyer une erreur 404
//     if (!updatedRecipe) return res.status(404).json({ message: "Recette non trouvée" });

//     // Réponse de succès avec la recette mise à jour
//     res.status(200).json({ message: "Recette mise à jour", recipe: updatedRecipe });
//   } catch (error) {
//     // En cas d'erreur lors de la mise à jour, renvoyer une erreur 400
//     res.status(400).json({ message: "Erreur lors de la mise à jour", error });
//   }
// };

// Mettre à jour une recette existante
exports.updateRecipe = async (req, res) => {
  try {
    // Extraction des données envoyées dans la requête
    const { title, ingredients, instructions, prepTime, cookTime, difficulty, category, image } = req.body;

    // Ingrédients : vérification de leur existence et création si nécessaire
    const updatedIngredients = [];
    for (const item of ingredients) {


      const { name, unit } = item.ingredient;
      

      // Recherche de l'ingrédient par son nom
      let ingredient = await Ingredient.findOne({ name: name });


      if (!ingredient) {
        // Si l'ingrédient n'existe pas, on le crée

        ingredient = new Ingredient({ name, unit });
        await ingredient.save()
      }

      updatedIngredients.push({
        ingredient: ingredient._id,
        quantity: item.quantity,
        unit: item.ingredient.unit
      });
    }
    

    // Mise à jour de la recette avec l'ID dans l'URL et les nouvelles données
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        title,
        ingredients: updatedIngredients, // On met à jour les ingrédients
        instructions,
        prepTime,
        cookTime,
        difficulty,
        category,
        image,
      },
      { new: true } // Retourner la recette mise à jour
    );

    // Si la recette n'est pas trouvée, renvoyer une erreur 404
    if (!updatedRecipe) return res.status(404).json({ message: "Recette non trouvée" });

    // Réponse de succès avec la recette mise à jour
    res.status(200).json({ message: "Recette mise à jour", recipe: updatedRecipe });
  } catch (error) {
    console.log(error);

    // En cas d'erreur lors de la mise à jour, renvoyer une erreur 400
    res.status(400).json({ message: "Erreur lors de la mise à jour", error });
  }
};


// Supprimer une recette par son ID
exports.deleteRecipe = async (req, res) => {
  try {
    // Suppression de la recette par son ID
    const deleted = await Recipe.findByIdAndDelete(req.params.id);

    // Si la recette n'est pas trouvée, renvoyer une erreur 404
    if (!deleted) return res.status(404).json({ message: "Recette non trouvée" });

    // Réponse de succès une fois la recette supprimée
    res.status(200).json({ message: "Recette supprimée" });
  } catch (error) {
    // En cas d'erreur lors de la suppression, renvoyer une erreur 500
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};
