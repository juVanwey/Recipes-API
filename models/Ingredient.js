const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Le nom de l\'ingrédient est obligatoire'],
    match: /^[a-zA-ZÀ-ÿ0-9\s\-’']+$/,
    // Regex pour valider les noms d'ingrédients (lettres, chiffres, espaces, tirets, apostrophes)

    trim: true,
    unique: true // Pour éviter les doublons
  },
  allergens: {
    type: [String], 
    default: [] // Optionnel : liste d’allergènes
  },
  unit: {
    type: String,
    enum: ['g', 'ml', 'cuillère', 'kg', 'L', 'tasse', 'pincée', 'feuille', 'tranche', 'unité', "gousse", "cuillère à café", "cuillère à soupe", "verre", "sachet", "barquette", "bocal", "pot", "boîte", "barre"],
  },
  // Unités possibles  
}, { timestamps: true });

module.exports = mongoose.model('Ingredient', ingredientSchema);

// On exporte un modèle Mongoose nommé Ingredient, basé sur ce schéma. Ce modèle permet d’effectuer des requêtes MongoDB comme .find(), .save(), .findById()…