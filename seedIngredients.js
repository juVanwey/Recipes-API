const mongoose = require('mongoose');
const Ingredient = require('./models/Ingredient');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/recipesdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB réussie.');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB : ', err);
  });

// Ingrédients à insérer
const ingredients = [
  { name: "Lentilles corail", unit: "g" },
  { name: "Lait de coco", unit: "ml" },
  { name: "Oignon", unit: "unité" },
  { name: "Ail", unit: "gousse" },
  { name: "Gingembre", unit: "cuillère" },
  { name: "Curry", unit: "cuillère" },
  { name: "Coriandre", unit: "cuillère" },
  { name: "Fraises", unit: "g" },
  { name: "Framboises", unit: "g" },
  { name: "Myrtilles", unit: "g" },
  { name: "Kiwi", unit: "unité" },
  { name: "Menthe", unit: "feuille" },
  { name: "Pois chiches", unit: "g" },
  { name: "Tomates", unit: "unité" },
  { name: "Concombre", unit: "unité" },
  { name: "Citron", unit: "unité" },
  { name: "Avocat", unit: "unité" },
  { name: "Quinoa", unit: "g" },
  { name: "Épinards", unit: "g" },
  { name: "Patate douce", unit: "unité" },
  { name: "Huile d'olive", unit: "cuillère" },
  { name: "Basilic", unit: "feuille" },
  { name: "Banane", unit: "unité" },
  { name: "Lait d'amande", unit: "ml" },
  { name: "Chia", unit: "cuillère" },
  { name: "Mangue", unit: "unité" },
  { name: "Tofu", unit: "g" },
  { name: "Soja", unit: "ml" },
  { name: "Carotte", unit: "unité" },
  { name: "Courgette", unit: "unité" }
];

// Fonction pour insérer les ingrédients
async function insertIngredients() {
  try {
    // Supprimer les anciens ingrédients avant d'ajouter les nouveaux
    await Ingredient.deleteMany({});

    // Insérer les nouveaux ingrédients
    await Ingredient.insertMany(ingredients);

    console.log('✅ Ingrédients insérés avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de l\'insertion des ingrédients : ', err.message);
  } finally {
    mongoose.disconnect();
  }
}

// Exécuter l'insertion
insertIngredients();
