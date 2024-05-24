const express = require('express'); // Importe le module express
const router = express.Router(); // Crée un routeur express
const User = require('../models/User'); // Importe le modèle User
const Post = require('../models/Post'); // Importe le modèle Post
const { Binary } = require('mongodb'); // Importe l'objet Binary de MongoDB
const fs = require('fs'); // Importe le module filesystem pour lire les fichiers
const { spawn } = require('child_process'); // Importe le module pour créer des processus enfants
const mongoose = require('mongoose'); // Importe le module mongoose pour MongoDB
const { ObjectId } = mongoose.Types; // Importe l'objet ObjectId de mongoose

// Route GET pour la page des publications
router.get('/publications', async (req, res) => {
    try {
        var page = req.session.test || 1; // Définit le numéro de page à partir de la session, ou 1 si non défini
        req.session.test = page + 1; // Incrémente le numéro de page pour la session suivante
        const limit = 2; // Limite de publications par page
        const skip = 1; // Déplacement des publications (à calculer en fonction de la page et de la limite)

        // Liste des catégories de publications
        const categoriesName = [
            "Video Games", "Cars", "Vegetation", "Home Appliances", "Fashion Accessories",
            "Sports Equipment", "Art Supplies", "Books", "Pet Supplies", "Furniture",
            "Electronics", "Jewelry", "Toys", "Health & Beauty Products", "Kitchenware",
            "Outdoor Gear", "Musical Instruments", "Fitness Equipment", "Tools & Hardware", "Office Supplies"
        ];

        let categories = new Map(); // Crée une map pour stocker les catégories et leurs publications

        // Fonction pour récupérer les publications par catégorie
        async function fetchPosts() {
            for (const categorie of categoriesName) {
                const CategoriePost = await Post.find({ category: categorie }).exec(); // Récupère les publications de la catégorie
                categories.set(categorie, CategoriePost); // Ajoute la catégorie et ses publications à la map

                for (const post of CategoriePost) {
                    const timer = await new Promise((resolve, reject) => {
                        createPostTimersArray(post, (timer) => {
                            resolve(timer);
                        });
                    });

                    post.posted = timer; // Ajoute le timer à la publication

                    const postCreator = await User.findById(post.creatorID).exec(); // Récupère le créateur de la publication

                    const buffer = Buffer.from(postCreator.image, 'base64'); // Convertit l'image du créateur en buffer
                    // Crée un objet Binary en utilisant le constructeur Binary
                    const binaryData = new Binary(buffer, Binary.SUBTYPE_BYTE_ARRAY);
                    post.creatorImage = binaryData; // Ajoute l'image binaire à la publication
                }
            }
            return categories; // Retourne la map des catégories et leurs publications
        }

        if (req.session.connected) {
            const buffer = Buffer.from(req.session.user.image, 'base64'); // Convertit l'image de l'utilisateur en buffer
            // Crée un objet Binary en utilisant le constructeur Binary
            const binaryData = new Binary(buffer, Binary.SUBTYPE_BYTE_ARRAY);
            req.session.user.image = binaryData; // Ajoute l'image binaire à la session de l'utilisateur
        }

        const data = {
            session: req.session, // Données de la session
            categories: await fetchPosts() // Récupère les publications par catégorie
        };

        res.render('publications', { categories, data }); // Rend la vue 'publications' avec les données des catégories et de la session
    } catch (error) {
        console.log(error); // Log l'erreur en cas de problème
    }
});

// Fonction pour récupérer le timer d'une publication
function getPostTimer(time, callback) {
    const pythonScript = spawn('python', ['server/python_scripts/timer.py', time]); // Exécute le script Python avec l'heure de la publication

    pythonScript.stdout.on('data', (data) => {
        const counter = data.toString().trim(); // Convertit le résultat du script en chaîne de caractères
        callback(counter); // Retourne le résultat via le callback
    });
}

// Fonction pour changer le format de la date
function changeDateFormat(timestamp) {
    const inputDate = new Date(timestamp); // Parse le timestamp en date

    const adjustedDate = new Date(inputDate.getTime() + (4 * 60 * 60)); // Ajuste la date de 4 heures

    const year = adjustedDate.getUTCFullYear();
    const month = String(adjustedDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(adjustedDate.getUTCDate()).padStart(2, '0');
    const hours = String(adjustedDate.getUTCHours()).padStart(2, '0');
    const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(adjustedDate.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(adjustedDate.getUTCMilliseconds()).padStart(3, '0');

    const formattedDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`; // Formate la date ajustée

    return formattedDateString; // Retourne la date formatée
}

// Fonction pour créer un tableau de timers pour les publications
async function createPostTimersArray(posts, callback) {
    const timer = await new Promise((resolve, reject) => {
        getPostTimer(changeDateFormat(posts.createdAt), (counter) => {
            resolve(counter);
        });
    });
    callback(timer); // Retourne le timer via le callback

    return timer; // Retourne le timer
}

// Fonction pour ajouter une vue à une publication (non utilisée dans le code actuel)
async function addView(id) {
    const currentPost = await User.findOne({ id }); // Récupère la publication par son ID
    currentPost.vues++; // Incrémente le nombre de vues
}

module.exports = router; // Exporte le routeur pour l'utiliser dans d'autres fichiers
