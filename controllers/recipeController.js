// Importation du modèle Recipe
const Recipe = require("../models/Recipe");

// Obtenir toutes les recettes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("ingredients.ingredient");
    // .find() renvoie toutes les recettes sans filtrage particulier
    // .populate('ingredients.ingredient') permet de peupler les informations des ingrédients
    // Grâce à cette méthode, on obtient plus de détails sur chaque ingrédient que juste son ID
    // Ici, il va aller chercher l'objet complet de chaque ingrédient, pas seulement l'_id (on obtient par exemple le nom, la date de création, etc.)
    // ingredients est le tableau qui contient les différents ingrédients de la recette.
    // ingredient à l'intérieur de chaque élément de ce tableau est la clé qui fait référence à l'_id de l'ingrédient dans la collection Ingredient.
    res.status(200).json(recipes);
    // Une fois les recettes trouvées, on renvoie une réponse JSON avec un code de statut 200 (succès)
  } catch (error) {
    // Si une erreur survient pendant la récupération des recettes, on renvoie une erreur 500
    // avec un message d'erreur et les détails techniques
    res
      .status(500).json({ message: "Erreur lors de la récupération des recettes", error });
  }
};

// Rechercher des recettes selon différents critères (titre, ingrédient, catégorie)
exports.searchRecipes = async (req, res) => {
  // On extrait les paramètres de recherche passés dans l'URL, par exemple : 
  // /api/recipes/search?title=pâtes&ingredient=ID&category=plat
  const { title, ingredient, category } = req.query;

  // On initialise un objet filtre vide qui sera rempli selon les paramètres donnés
  const filter = {};

  // Si un titre est fourni, on ajoute un filtre pour le champ "title"
  // $regex permet de faire une recherche partielle (comme "contient...")
  // $options: "i" rend la recherche insensible à la casse (majuscules/minuscules)
  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

  // Si un ingrédient est fourni (sous forme d’ObjectId), on filtre les recettes 
  // dont le tableau ingredients contient un ingrédient ayant ce même _id
  if (ingredient) {
    filter["ingredients.ingredient"] = ingredient;
  }

  // Si une catégorie est précisée (ex: "dessert", "plat"), on filtre sur ce champ
  if (category) {
    filter.category = category;
  }

  try {
    // On recherche les recettes correspondant au filtre
    // .populate("ingredients.ingredient") va aller chercher les détails de chaque ingrédient
    // à partir de son ObjectId (ex: son nom), pour renvoyer des infos complètes
    const recipes = await Recipe.find(filter).populate("ingredients.ingredient");

    // On renvoie les recettes trouvées avec un code de succès HTTP 200
    res.status(200).json(recipes);
  } catch (error) {
    // En cas d’erreur (ex: base de données non accessible), on renvoie un message d’erreur
    res.status(500).json({
      message: "Erreur lors de la recherche des recettes",
      error,
    });
  }
};

// Obtenir une recette par ID
exports.getRecipeById = async (req, res) => {
  try {
    // Recherche d'une recette spécifique par son ID
    // Utilisation de req.params.id pour récupérer l'ID passé dans l'URL
    // .populate() pour obtenir les informations des ingrédients
    const recipe = await Recipe.findById(req.params.id).populate(
      "ingredients.ingredient"
    );

    // Si aucune recette n'est trouvée, renvoyer une erreur 404
    if (!recipe)
      return res.status(404).json({ message: "Recette non trouvée" });

    // Si la recette est trouvée, la renvoyer avec un code de succès 200
    res.status(200).json(recipe);
  } catch (error) {
    // En cas d'erreur, renvoyer un message d'erreur avec un code 500
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de la recette", error });
  }
};

// Ajouter une recette
exports.createRecipe = async (req, res) => {
  try {
    // Récupération des données envoyées dans la requête HTTP POST
    const {
      title,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      difficulty,
      category,
      image,
    } = req.body;

    // Création d'une nouvelle instance de Recipe avec les données reçues
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      difficulty,
      category,
      image,
    });

    // Sauvegarde de la recette dans la base de données
    await newRecipe.save();

    // Une fois la recette sauvegardée, on renvoie une réponse JSON avec un code de succès 201
    res.status(201).json({ message: "Recette ajoutée", recipe: newRecipe });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse d'erreur avec un code 400
    res
      .status(400)
      .json({ message: "Erreur lors de l'ajout de la recette", error });
  }
};

// Mettre à jour une recette
exports.updateRecipe = async (req, res) => {
  try {
    // Mise à jour de la recette avec l'ID spécifié dans l'URL
    // req.params.id contient l'ID de la recette à mettre à jour
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body, // Le corps de la requête contient les nouvelles données pour la recette
      { new: true } // { new: true } permet de retourner la recette mise à jour
    );

    // Si aucune recette n'est trouvée, renvoyer une erreur 404
    if (!updatedRecipe)
      return res.status(404).json({ message: "Recette non trouvée" });

    // Si la recette est mise à jour, renvoyer une réponse avec un code de succès 200
    res
      .status(200)
      .json({ message: "Recette mise à jour", recipe: updatedRecipe });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse d'erreur avec un code 400
    res.status(400).json({ message: "Erreur lors de la mise à jour", error });
  }
};

// Supprimer une recette
exports.deleteRecipe = async (req, res) => {
  try {
    // Suppression d'une recette par son ID
    const deleted = await Recipe.findByIdAndDelete(req.params.id);

    // Si aucune recette n'est trouvée, renvoyer une erreur 404
    if (!deleted)
      return res.status(404).json({ message: "Recette non trouvée" });

    // Si la recette est supprimée, renvoyer une réponse avec un code de succès 200
    res.status(200).json({ message: "Recette supprimée" });
  } catch (error) {
    // En cas d'erreur, renvoyer une réponse d'erreur avec un code 500
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};
