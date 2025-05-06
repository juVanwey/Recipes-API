const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Le nom de l\'ingrédient est obligatoire'],
    trim: true,
    unique: true // Pour éviter les doublons
  },
  allergens: {
    type: [String], 
    default: [] // Optionnel : liste d’allergènes
  },
  unit: { 
    type: String, 
    enum: ['g', 'ml', 'cuillère', 'kg', 'L', 'tasse', 'pincée'], // Unités possibles
  },
}, { timestamps: true });

module.exports = mongoose.model('Ingredient', ingredientSchema);

// On exporte un modèle Mongoose nommé Ingredient, basé sur ce schéma. Ce modèle permet d’effectuer des requêtes MongoDB comme .find(), .save(), .findById()…
