// Chargement des variables d'environnement depuis le fichier .env
require('dotenv').config();

// Importation du module Express
const express = require('express');
// Création d'une nouvelle application Express
const app = express();

// Récupération du port à partir des variables d'environnement
const PORT = process.env.PORT;

// Importation du module path pour travailler avec les chemins de fichiers et de répertoires
const path = require('path');

// Importation du module body-parser pour parser les données des requêtes HTTP
const bodyParser = require('body-parser');

// Importation du module express-session pour gérer les sessions Express
const session = require('express-session');

// Importation de la fonction connectDB depuis le fichier de configuration de la base de données
const connectDB = require('./server/configuration/database');

// Connexion à la base de données
connectDB();

// Configuration du répertoire 'public' comme répertoire statique
app.use(express.static(path.join(__dirname, 'public')));

// Configuration du middleware bodyParser pour parser les données au format urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration du middleware session pour gérer les sessions Express
app.use(session({
    secret: 'secretRandomKey', // Clé secrète pour signer les cookies de session
    resave: false,
    saveUninitialized: true
}));

// Configuration du moteur de modèle EJS et du répertoire des vues
app.set('views', path.join(__dirname, 'public', 'ejs'));
app.set('view engine', 'ejs');

// Utilisation du routeur principal pour gérer les requêtes entrantes à la racine de l'application
app.use('/', require('./server/routes/main'));

// Démarrage du serveur Express et écoute des requêtes sur le port spécifié
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
