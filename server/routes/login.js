const express = require('express'); // Importe le module express
const router = express.Router(); // Crée un routeur express
const User = require('../models/User'); // Importe le modèle User
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Définie une expression régulière pour valider les emails
const { Binary } = require('mongodb'); // Importe l'objet Binary de MongoDB

// Route GET pour la page de connexion
router.get('/login', (req, res) => {
    res.render('login'); // Rend la vue 'login'
});

// Route POST pour traiter le formulaire de connexion
router.post('/login', async (req, res) => {
    try {
        // Récupère les informations du formulaire
        const { email, password } = req.body;

        // Vérifie si l'email correspond aux contraintes définies par l'expression régulière
        if (regexEmail.test(email)) {
            // Vérifie si l'utilisateur existe dans MongoDB
            const existingUser = await User.findOne({ email });

            // Conditions pour se connecter
            if (existingUser && existingUser.password.toLowerCase() === password.toLowerCase()) {
                // Si l'utilisateur existe et que le mot de passe est correct
                req.session.user = existingUser; // Stocke l'utilisateur dans la session
                req.session.connected = true; // Indique que l'utilisateur est connecté
                res.redirect('/publications'); // Redirige vers la page des publications
            } else {
                // Si l'utilisateur n'existe pas ou que le mot de passe est incorrect
                res.redirect('/login'); // Redirige vers la page de connexion
            }
        } else {
            // Si l'email ne correspond pas aux contraintes
            res.redirect('/login'); // Redirige vers la page de connexion
        }
    } catch (error) {
        console.log(error); // Affiche l'erreur dans la console en cas de problème
    }
});

module.exports = router; // Exporte le routeur
