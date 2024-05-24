const express = require('express'); // Importe le module express
const router = express.Router(); // Crée un routeur express
const multer = require('multer'); // Importe le module multer pour gérer les fichiers uploadés
const upload = multer({ storage: multer.memoryStorage() }); // Configure multer pour stocker les fichiers en mémoire
const { Binary } = require('mongodb'); // Importe l'objet Binary de MongoDB
const loginRouter = require('./login'); // Importe le routeur pour la connexion
const signInRouter = require('./sign-in'); // Importe le routeur pour l'inscription
const publicationsRouter = require('./publications'); // Importe le routeur pour les publications
const creationRouter = require('./creation'); // Importe le routeur pour la création de contenu
const displayRouter = require('./display'); // Importe le routeur pour l'affichage de contenu
const { spawn } = require('child_process'); // Importe le module pour créer des processus enfants
const Post = require('../models/Post'); // Importe le modèle Post

// Route GET pour la page d'accueil
router.get('/', async (req, res) => {
    if (typeof req.session.connected === 'undefined') {
        req.session.connected = false; // Initialise la variable de session connected à false si elle n'est pas définie
    }
    const data = {
        session: req.session, // Passe la session aux données de la vue
    };
    res.render('home', { data }); // Rend la vue 'home' avec les données
});

// Routes pour la connexion
router.get('/login', loginRouter);
router.post('/login', loginRouter);

// Routes pour l'inscription
router.get('/sign-in', signInRouter);
router.post('/sign-in', signInRouter);

// Routes pour les publications
router.get('/publications', publicationsRouter);
router.post('/publications', publicationsRouter);

// Routes pour la création de contenu
router.get('/creation', creationRouter);
router.post('/creation', creationRouter);

// Routes pour l'affichage de contenu
router.get('/display/:id', displayRouter);
router.post('/display', displayRouter);

// Route POST pour uploader une image
router.post('/uploadImage', upload.single('image'), (req, res) => {
    try {
        req.session.iconProfile = req.file.buffer; // Stocke le buffer de l'image dans la session
        res.json({ message: 'Image uploaded successfully' }); // Renvoie une réponse JSON indiquant le succès de l'upload
    } catch (error) {
        console.error('Error uploading image:', error); // Log l'erreur en cas de problème
        res.status(500).json({ error: 'Failed to upload image' }); // Renvoie une réponse JSON d'erreur
    }
});

// Route POST pour uploader plusieurs images
router.post('/uploadImages', upload.single('image'), (req, res) => {
    try {
        req.session.tempImage = req.file.buffer; // Stocke le buffer de l'image temporaire dans la session
        res.json({ message: 'Image uploaded successfully' }); // Renvoie une réponse JSON indiquant le succès de l'upload
    } catch (error) {
        console.error('Error uploading image:', error); // Log l'erreur en cas de problème
        res.status(500).json({ error: 'Failed to upload image' }); // Renvoie une réponse JSON d'erreur
    }
});

// Route GET pour le test
router.get('/test', (req, res) => {
    const buffer = Buffer.from(req.session.user.image, 'base64'); // Convertit l'image de l'utilisateur en buffer
    const binaryData = new Binary(buffer, Binary.SUBTYPE_BYTE_ARRAY); // Crée un objet Binary avec le buffer
    req.session.user.image = binaryData; // Ajoute l'image binaire à la session de l'utilisateur

    const data = {
        user: req.session.user // Passe les données de l'utilisateur à la vue
    };

    res.render('test', { data }); // Rend la vue 'test' avec les données
});

// Route POST pour envoyer une publication
router.post('/sendPost', async (req, res) => {
    const { title, description, adresse, price } = await req.body; // Récupère les données du formulaire
    console.log(req.session.user._id); // Log l'ID de l'utilisateur

    // Insère les données de la publication dans la base de données
    insertPostData(title, description, adresse, price, req.session.user._id, req.session.tempImage);

    res.redirect('publications'); // Redirige vers la page des publications
});

// Fonction pour obtenir la catégorie d'une publication en utilisant un script Python
function getPostCategory(title, description, callback) {
    const pythonScript = spawn('python', ['server/python_scripts/categotizer.py', title, description]); // Exécute le script Python

    pythonScript.stdout.on('data', (data) => {
        const category = data.toString().trim(); // Convertit le résultat du script en chaîne de caractères
        callback(category); // Retourne la catégorie via le callback
    });
}

// Fonction pour insérer les données d'une publication dans la base de données
async function insertPostData(title, description, adresse, price, creatorID, images) {
    const category = await new Promise((resolve, reject) => {
        getPostCategory(title, description, (category) => {
            resolve(category);
        });
    });

    let imagesBuffered = [];

    // Insère les données de la publication dans la base de données
    const result = await Post.insertMany([
        {
            title: title,
            description: description,
            adresse: adresse,
            price: price,
            creatorID: creatorID,
            category: category, // Utilise la catégorie obtenue
            images: images, // Utilise les données de l'image
            vues: 0
        }
    ]);

    console.log("Data successfully sent"); // Log un message indiquant le succès de l'insertion
}

module.exports = router; // Exporte le routeur
