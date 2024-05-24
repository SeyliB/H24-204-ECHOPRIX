// Importation du module mongoose pour la gestion de la base de données MongoDB
const mongoose = require('mongoose');

// Fonction asynchrone pour se connecter à la base de données MongoDB
const connectDB = async () => {
    try {
        // Désactive le mode strict de requête pour éviter les erreurs inattendues
        mongoose.set('strictQuery', false);
        
        // Connexion à la base de données en utilisant l'URI MongoDB fourni dans les variables d'environnement
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        
        // Affiche un message indiquant que la connexion à la base de données a réussi
        console.log(`Database connected successfully!`);
    } catch (error) {
        // En cas d'erreur lors de la connexion à la base de données, affiche l'erreur
        console.log(error);
    }
}

// Exporte la fonction connectDB pour pouvoir l'utiliser dans d'autres fichiers
module.exports = connectDB;
