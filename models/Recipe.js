const mongoose = require("mongoose");

// On importe le modèle Ingredient
const Ingredient = require("./Ingredient");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
      minlength: [3, "Le titre doit contenir au moins 3 caractères"],
    },
    ingredients: [
      // ingredient : fait référence à un _id d’un ingrédient existant (ref: 'Ingredient') → relation entre les deux modèles.
      // populate('ingredients.ingredient') dans les contrôleurs permet ensuite d’afficher tous les détails.
      // unit : contrôlée par une énumération d’unités valides.
      {
        ingredient: {
          type: mongoose.Schema.Types.ObjectId,
          // Référence à l'ID d'un ingrédient existant
          // On utilise mongoose.Schema.Types.ObjectId pour faire référence à un autre document dans MongoDB
          // On utilise le modèle Ingredient pour faire référence à l'ID d'un ingrédient existant
          ref: "Ingredient",
          required: true,
        },
        quantity: {
          type: Number,
          required: [true, "La quantité est obligatoire"],
          min: [0.1, "La quantité doit être supérieure à 0.1"],
        },
        unit: {
          type: String,
          required: [true, "L'unité est obligatoire"],
          enum: ['g', 'ml', 'cuillère', 'kg', 'L', 'tasse', 'pincée', 'feuille', 'tranche', 'unité', "gousse", "cuillère à café", "cuillère à soupe", "verre", "sachet", "barquette", "bocal", "pot", "boîte", "barre"],
        },
      },
    ],
    instructions: {
      type: String,
      required: [true, "Les instructions sont obligatoires"],
      minlength: [
        10,
        "Les instructions doivent contenir au moins 10 caractères",
      ],
    },
    prepTime: {
      type: Number,
      required: [true, "Le temps de préparation est obligatoire"],
      min: [1, "Le temps de préparation doit être au moins de 1 minute"],
    },
    cookTime: {
      type: Number,
      required: [false], // Maintenant il est optionnel
      min: [0, "Le temps de cuisson ne peut pas être négatif"],
      default: 0, // Si non fourni, on mettra 0 par défaut
    },
    difficulty: {
      type: String,
      enum: {
        values: ["facile", "moyen", "difficile"],
        message: "La difficulté doit être facile, moyen ou difficile",
      },
      required: [true, "La difficulté est obligatoire"],
    },
    category: {
      type: String,
      required: [true, "La catégorie est obligatoire"],
      trim: true,
      enum: {
        values: ["entrée", "plat", "dessert", "accompagnement", "boisson"],
        message:
          "La catégorie doit être entrée, plat, dessert, accompagnement ou boisson",
      },
    },
    image: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
        },
        message: (props) => `${props.value} n'est pas une URL d'image valide`,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
