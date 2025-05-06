const express = require('express');  // On importe express pour pouvoir utiliser son routeur.
const router = express.Router();     // On crée un routeur d'express pour gérer les routes d'ingrédients.
const ingredientController = require('../controllers/ingredientController'); // On importe le contrôleur qui gère les logiques liées aux ingrédients.

// Route GET pour obtenir tous les ingrédients
router.get('/', ingredientController.getAllIngredients); 
// Route POST pour créer un nouvel ingrédient
router.post('/', ingredientController.createIngredient);

module.exports = router;  // On exporte le routeur pour pouvoir l'utiliser dans le fichier principal (server.js).
