const express = require('express'); // Importe le module express
const router = express.Router(); // Crée un routeur express
const User = require('../models/User'); // Importe le modèle User
const fs = require('fs'); // Importe le module filesystem pour lire les fichiers
const session = require('express-session'); // Importe le module express-session pour gérer les sessions
const { Binary } = require('mongodb'); // Importe l'objet Binary de MongoDB

// Route GET pour la page de connexion
router.get('/sign-in', async (req, res) => {
    res.render('sign-in'); // Rend la vue 'sign-in'
});

// Route POST pour la soumission du formulaire de connexion
router.post('/sign-in', async (req, res) => {
    const { firstName, lastName, email, password } = await req.body; // Récupère les données du corps de la requête
    
    const existingUser = await User.findOne({ email }); // Vérifie si un utilisateur avec cet email existe déjà

    const image = await req.session.iconProfile; // Récupère l'image de profil de la session
    if (existingUser) {
        const message = "CET EMAIL A DEJA ETE UTILISÉ POUR CRÉER UN COMPTE";
        console.log(message);
        res.render('sign-in'); // Rend à nouveau la vue 'sign-in' si l'utilisateur existe déjà
    } else {
        insertUserData(firstName, lastName, email, password, image); // Insère les données de l'utilisateur dans la base de données

        createUserSession(req, firstName, lastName, email, password, convertSessionImageToBuffered(req, req.session.iconProfile)); // Crée une session pour l'utilisateur
        req.session.connected = true; // Indique que l'utilisateur est connecté
        res.redirect('publications'); // Redirige vers la page des publications
    }
});

// Fonction pour insérer les données de l'utilisateur dans la base de données
function insertUserData(firstName, lastName, email, password, image) {
    User.insertMany([
        {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            image: image
        }
    ]);
}

// Fonction pour créer une session utilisateur
function createUserSession(req, firstName, lastName, email, password, image) {
    var userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        image: image || fs.readFileSync("public/images/profile.jpg") // Utilise une image par défaut si aucune image n'est fournie
    };

    req.session.user = userData; // Stocke les données utilisateur dans la session
}

// Fonction pour convertir une image de la session en données binaires
function convertSessionImageToBuffered(req, image) {
    const buffer = Buffer.from(image, 'base64'); // Convertit l'image en buffer
    // Crée un objet Binary en utilisant le constructeur Binary
    const binaryData = new Binary(buffer, Binary.SUBTYPE_BYTE_ARRAY);

    return binaryData;
}

module.exports = router; // Exporte le routeur pour l'utiliser dans d'autres fichiers
