const mongoose = require("mongoose");
const Recipe = require("./models/Recipe");
const Ingredient = require("./models/Ingredient");

mongoose.connect("mongodb://localhost:27017/recipesdb", { useUnifiedTopology: true })
  .then(() => {
    console.log("Connexion à MongoDB réussie.");
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB : ", err);
  });

// Fonction pour insérer des recettes
const insertRecipes = async () => {
  try {
    // Liste des ingrédients déjà insérés (les ObjectIds récupérés précédemment)
    const ingredients = [
      "681b535746193e62aa4d8dda", // Lentilles corail
      "681b535746193e62aa4d8ddb", // Lait de coco
      "681b535746193e62aa4d8ddc", // Oignon
      "681b535746193e62aa4d8ddd", // Ail
      "681b535746193e62aa4d8dde", // Gingembre
      "681b535746193e62aa4d8ddf", // Curry
      "681b535746193e62aa4d8de0", // Coriandre
      "681b535746193e62aa4d8de1", // Fraises
      "681b535746193e62aa4d8de2", // Framboises
      "681b535746193e62aa4d8de3", // Myrtilles
      "681b535746193e62aa4d8de4", // Kiwi
      "681b535746193e62aa4d8de5", // Menthe
      "681b535746193e62aa4d8de6", // Pois chiches
      "681b535746193e62aa4d8de7", // Tomates
      "681b535746193e62aa4d8de8", // Concombre
      "681b535746193e62aa4d8de9", // Citron
      "681b535746193e62aa4d8dea", // Avocat
      "681b535746193e62aa4d8deb", // Quinoa
      "681b535746193e62aa4d8dec", // Épinards
      "681b535746193e62aa4d8ded", // Patate douce
      "681b535746193e62aa4d8dee", // Huile d'olive
      "681b535746193e62aa4d8def", // Basilic
      "681b535746193e62aa4d8df0", // Banane
      "681b535746193e62aa4d8df1", // Lait d'amande
      "681b535746193e62aa4d8df2", // Chia
      "681b535746193e62aa4d8df3", // Mangue
      "681b535746193e62aa4d8df4", // Tofu
      "681b535746193e62aa4d8df5", // Soja
      "681b535746193e62aa4d8df6", // Carotte
      "681b535746193e62aa4d8df7"  // Courgette
    ];

    // Fonction pour récupérer l'id de l'ingrédient
    const getIngredientId = (index) => ingredients[index];

    // Liste des recettes à insérer
    const recipes = [
      {
        title: "Salade de Fruits Fraîches",
        ingredients: [
          { ingredient: getIngredientId(20), quantity: 2, unit: "unité" }, // Banane
          { ingredient: getIngredientId(7), quantity: 100, unit: "g" }, // Fraises
          { ingredient: getIngredientId(8), quantity: 100, unit: "g" }, // Framboises
          { ingredient: getIngredientId(9), quantity: 100, unit: "g" }, // Myrtilles
          { ingredient: getIngredientId(4), quantity: 1, unit: "unité" }, // Kiwi
          { ingredient: getIngredientId(5), quantity: 10, unit: "feuille" } // Menthe
        ],
        instructions: "Coupez les fruits en morceaux, mélangez et ajoutez quelques feuilles de menthe.",
        prepTime: 10,
        cookTime: 0,
        difficulty: "facile",
        category: "dessert",
        image: "https://example.com/salade-fruits.jpg"
      },
      {
        title: "Dhal de Lentilles Corail",
        ingredients: [
          { ingredient: getIngredientId(0), quantity: 200, unit: "g" }, // Lentilles corail
          { ingredient: getIngredientId(3), quantity: 2, unit: "gousse" }, // Ail
          { ingredient: getIngredientId(2), quantity: 1, unit: "unité" }, // Oignon
          { ingredient: getIngredientId(4), quantity: 1, unit: "cuillère" }, // Gingembre
          { ingredient: getIngredientId(5), quantity: 1, unit: "cuillère" }, // Curry
          { ingredient: getIngredientId(6), quantity: 1, unit: "cuillère" }, // Coriandre
          { ingredient: getIngredientId(1), quantity: 200, unit: "ml" }, // Lait de coco
          { ingredient: getIngredientId(7), quantity: 2, unit: "unité" } // Tomates
        ],
        instructions: "Faites cuire les lentilles. Faites revenir les épices et légumes, ajoutez les lentilles et laissez mijoter.",
        prepTime: 15,
        cookTime: 30,
        difficulty: "moyen",
        category: "plat",
        image: "https://example.com/dhal-lentilles.jpg"
      },
      {
        title: "Curry de Légumes",
        ingredients: [
          { ingredient: getIngredientId(18), quantity: 1, unit: "unité" }, // Patate douce
          { ingredient: getIngredientId(6), quantity: 2, unit: "unité" }, // Carottes
          { ingredient: getIngredientId(10), quantity: 1, unit: "unité" }, // Courgette
          { ingredient: getIngredientId(3), quantity: 2, unit: "gousse" }, // Ail
          { ingredient: getIngredientId(5), quantity: 1, unit: "cuillère" }, // Curry
          { ingredient: getIngredientId(1), quantity: 200, unit: "ml" } // Lait de coco
        ],
        instructions: "Faites cuire les légumes avec les épices et ajoutez du lait de coco pour obtenir une sauce crémeuse.",
        prepTime: 20,
        cookTime: 25,
        difficulty: "moyen",
        category: "plat",
        image: "https://example.com/curry-legumes.jpg"
      }
    ];

    // Insérer les recettes dans la base de données
    await Recipe.insertMany(recipes);
    console.log("Recettes insérées avec succès !");
  } catch (error) {
    console.error("Erreur pendant l'insertion des recettes : ", error);
  } finally {
    mongoose.connection.close();
  }
};

// Appel de la fonction pour insérer les recettes
insertRecipes();
