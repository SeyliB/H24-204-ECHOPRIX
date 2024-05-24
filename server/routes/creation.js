const express = require('express'); // Importe le module express
const router = express.Router(); // Crée un routeur express
const User = require('../models/User'); // Importe le modèle User
const Post = require('../models/Post'); // Importe le modèle Post
const fs = require('fs'); // Importe le module file system de Node.js
const { spawn } = require('child_process'); // Importe la fonction spawn pour exécuter des processus enfants

// Route GET pour afficher la page de création de post
router.get('/creation', async (req, res) => {
    const data = {
        session: req.session, // Données de session
    };
    res.render('creation', { data }); // Rend la vue 'creation' avec les données de session
});

module.exports = router; // Exporte le routeur
