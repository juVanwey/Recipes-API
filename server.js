// Importation des modules nécessaires
const cors = require('cors');
const express = require('express');   // Framework minimaliste pour créer des serveurs web en Node.js, l'API (API = application qui sert des données). Permet de gérer facilement les requêtes HTTP (GET, POST, PUT, DELETE, etc.).
const mongoose = require('mongoose'); // ORM pour MongoDB. Permet de modéliser les données sous forme d'objets JavaScript et de les enregistrer dans la base de données MongoDB.
const bodyParser = require('body-parser'); // Middleware pour parser le corps des requêtes HTTP (principalement pour les requêtes POST). Permet de récupérer les données envoyées dans le corps des requêtes et de les transformer en objets JavaScript.
require('dotenv').config();  // Charger les variables d'environnement depuis le fichier .env. Utile pour stocker des informations sensibles (comme la connexion à la base de données) sans les hardcoder.

// Création de l'application Express
const app = express(); // app sera utilisée pour configurer les routes, gérer les requêtes, et démarrer le serveur.

// Récupération du port sur lequel le serveur va écouter depuis les variables d'environnement (ou utilisation du port 3000 par défaut)
const port = process.env.PORT || 3000;

// Middleware pour parser le corps des requêtes JSON
app.use(bodyParser.json());

// Autoriser toutes les origines
app.use(cors());
// Ou pour autoriser des origines spécifiques
// app.use(cors({ origin: 'http://localhost:3000' }));

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Connexion à MongoDB via Mongoose
mongoose.connect(process.env.MONGO_URI
//   , 
//   {
//   useNewUrlParser: true,     // Utilisation du nouveau parser d'URL de MongoDB
//   useUnifiedTopology: true,  // Utilisation de la nouvelle topologie pour la gestion des connexions
// }
// Les options useNewUrlParser et useUnifiedTopology sont des configurations pour éviter les avertissements de dépréciation dans MongoDB.
) // .connect est une méthode de Mongoose pour établir une connexion à la base de données MongoDB.
// process.env.MONGO_URI est une variable d'environnement qui contient l'URI de connexion à la base de données MongoDB. 
.then(() => console.log('✅ Connexion à MongoDB réussie'))  // Si la connexion réussit, afficher un message
.catch((err) => console.error('❌ Erreur MongoDB :', err));  // Si une erreur survient, l'afficher dans la console

// Routes
// app.use() : méthode qui associe un chemin de l'URL à un fichier de routes. Les routes vont contenir les différentes actions liées aux ingrédients et aux recettes (ajout, suppression, modification, lecture, etc.).
app.use('/api/ingredients', require('./routes/ingredientsRoute')); // Routes pour gérer les ingrédients. Toutes les requêtes qui commencent par /api/ingredients seront gérées par le fichier de routes ingredientsRoute.js dans le dossier routes.
app.use('/api/recipes', require('./routes/recipesRoute')); // Routes pour gérer les recettes
// "Si quelqu’un appelle une URL qui commence par /api/recipes, envoie ça dans le fichier recipesRoute.js."


// Démarrage du serveur et écoute sur le port défini
app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur le port ${port}`);  // Affichage d'un message de confirmation dans la console
});

