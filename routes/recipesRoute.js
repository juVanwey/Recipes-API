const express = require('express');  // On importe express pour pouvoir utiliser son routeur.
const router = express.Router();     // On crée un routeur d'express pour gérer les routes des recettes.
const recipeController = require('../controllers/recipeController.js');  // On importe le contrôleur des recettes pour gérer la logique.

router.get('/', recipeController.getAllRecipes);  // Route GET pour obtenir toutes les recettes.
// "Si la route est / (c’est-à-dire rien après /api/recipes), alors appelle getAllRecipes."
router.get('/search', recipeController.searchRecipes);  // Route GET pour rechercher des recettes par différents critères.
router.get('/:id', recipeController.getRecipeById);  // Route GET pour obtenir une recette spécifique par son identifiant unique.
router.post('/', recipeController.createRecipe);  // Route POST pour créer une nouvelle recette.
router.put('/:id', recipeController.updateRecipe);  // Route PUT pour mettre à jour une recette existante.
router.delete('/:id', recipeController.deleteRecipe);  // Route DELETE pour supprimer une recette par son identifiant.

module.exports = router;  // On exporte ce routeur pour l'utiliser dans le fichier principal.
