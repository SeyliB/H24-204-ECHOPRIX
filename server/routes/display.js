const express = require('express'); // Importe le module express
const router = express.Router(); // Crée un routeur express
const User = require('../models/User'); // Importe le modèle User
const Post = require('../models/Post'); // Importe le modèle Post
const fs = require('fs'); // Importe le module file system de Node.js
const { spawn } = require('child_process'); // Importe la fonction spawn pour exécuter des processus enfants
const { Binary } = require('mongodb'); // Importe l'objet Binary de MongoDB

// Route GET pour afficher un post spécifique par son ID
router.get('/display/:id', async (req, res) => {
    const id = req.params.id; // Récupère l'ID du post à partir des paramètres de la requête
    const post = await Post.findById(id).exec(); // Recherche le post dans la base de données

    const buffer = Buffer.from(post.images, 'base64'); // Convertit les images du post en buffer
    const binaryData = new Binary(buffer, Binary.SUBTYPE_BYTE_ARRAY); // Crée un objet Binary à partir du buffer
    post.images = binaryData; // Remplace les images du post par l'objet Binary

    // Calcule le temps écoulé depuis la création du post
    post.posted = await new Promise((resolve, reject) => {
        createPostTimersArray(post, (timer) => {
            resolve(timer); 
        });
    });

    // Récupère les informations du créateur du post
    post.postCreator = await User.findById(post.creatorID).exec();

    const buffer2 = Buffer.from(post.postCreator.image, 'base64'); // Convertit l'image du créateur en buffer
    const binaryData2 = new Binary(buffer2, Binary.SUBTYPE_BYTE_ARRAY); // Crée un objet Binary à partir du buffer
    post.postCreator.image = binaryData2; // Remplace l'image du créateur par l'objet Binary

    const data = {
        session: req.session, // Données de session
        post: post // Données du post
    };

    let newVues = post.vues + 1; // Incrémente le nombre de vues du post
    const postUpdated = await Post.findByIdAndUpdate(post._id, { vues: newVues }, { new: true }); // Met à jour le post dans la base de données

    res.render('display', { data }); // Rend la vue 'display' avec les données du post et de la session
});

// Fonction pour obtenir le temps écoulé depuis la création du post en appelant un script Python
function getPostTimer(time, callback) {
    const pythonScript = spawn('python', ['server/python_scripts/timer.py', time]);

    pythonScript.stdout.on('data', (data) => {
        const counter = data.toString().trim(); // Lit la sortie du script Python
        callback(counter); // Appelle le callback avec le temps écoulé
    });
}

// Fonction pour changer le format de la date en ajoutant 4 heures
function changeDateFormat(timestamp) {
    const inputDate = new Date(timestamp); // Parse la date de création du post
    const adjustedDate = new Date(inputDate.getTime() + (4 * 60 * 60)); // Ajuste la date en ajoutant 4 heures

    const year = adjustedDate.getUTCFullYear();
    const month = String(adjustedDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(adjustedDate.getUTCDate()).padStart(2, '0');
    const hours = String(adjustedDate.getUTCHours()).padStart(2, '0');
    const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(adjustedDate.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(adjustedDate.getUTCMilliseconds()).padStart(3, '0');

    const formattedDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;

    return formattedDateString;
}

// Fonction pour créer un tableau de timers pour les posts
async function createPostTimersArray(posts, callback) {
    const timer = await new Promise((resolve, reject) => {
        getPostTimer(changeDateFormat(posts.createdAt), (counter) => {
            resolve(counter);
        });
    });

    callback(timer);
    return timer;
}

module.exports = router; // Exporte le routeur
