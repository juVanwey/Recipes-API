const Ingredient = require('../models/Ingredient');

// Obtenir tous les ingrédients
// Quand l'utilisateur fait une requête GET /api/ingredients, cette fonction est appelée. Elle cherche tous les documents de la collection ingredients avec .find() et les renvoie.
// Cette fonction est exportée pour être utilisée dans les routes.
// Elle récupère tous les ingrédients enregistrés en base de données.
exports.getAllIngredients = async (req, res) => {
  try {
    // On utilise Mongoose pour trouver tous les documents dans la collection "ingredients"
    // Cela renvoie un tableau contenant tous les ingrédients
    const ingredients = await Ingredient.find();

    // Une fois les ingrédients récupérés, on renvoie une réponse HTTP 200 (OK)
    // avec les données sous forme de JSON
    res.status(200).json(ingredients);
  } catch (error) {
    // Si une erreur se produit (problème de connexion, bug MongoDB, etc.)
    // on renvoie une erreur 500 (erreur serveur) avec un message explicite
    res.status(500).json({
      message: 'Erreur lors de la récupération des ingrédients',
      error: error // on peut aussi juste écrire "error" (raccourci ES6)
    });
  }
};

// Fonction qui permet d'ajouter un nouvel ingrédient dans la base de données
exports.createIngredient = async (req, res) => {
  try {
    // On récupère le champ "name" envoyé dans le corps de la requête HTTP (POST)
    const { name } = req.body;

    // On vérifie si un ingrédient avec ce nom existe déjà (en minuscule pour uniformiser)
    // .findOne() retourne un seul document correspondant au filtre
    const existing = await Ingredient.findOne({ name: name.toLowerCase() });

    // Si on trouve déjà un ingrédient avec ce nom, on renvoie une erreur 409 (conflit)
    if (existing) {
      return res.status(409).json({ message: 'Ingrédient déjà existant' });
    }

    // Si aucun ingrédient n'existe encore avec ce nom, on en crée un nouveau
    const newIngredient = new Ingredient({
      name: name.toLowerCase() // On met le nom en minuscules pour éviter les doublons du style "Tomate" / "tomate"
    });

    // On sauvegarde le nouvel ingrédient dans la base de données
    await newIngredient.save();

    // On renvoie une réponse 201 (création réussie) avec l'objet créé
    res.status(201).json(newIngredient);
  } catch (error) {
    // En cas d'erreur (champ manquant, erreur mongoose...), on renvoie une erreur 400 (mauvaise requête)
    res.status(400).json({
      message: "Erreur lors de l'ajout de l'ingrédient",
      error: error
    });
  }
};

// .find() et .findOne()
// Ingredient.find() :
// ➜ Récupère tous les ingrédients de la base.
// ➜ Renvoie un tableau d’objets (même vide si aucun trouvé).
// Ingredient.findOne({ name: 'tomate' }) :
// ➜ Cherche le premier document qui correspond au filtre { name: 'tomate' }.
// ➜ Renvoie un seul objet ou null si rien n’est trouvé.
// Ces méthodes sont des fonctions asynchrones fournies par Mongoose, une surcouche de MongoDB en JavaScript/Node.js. On les utilise avec await pour attendre le résultat.
