const mongoose = require('mongoose');
const fs = require('fs');


const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: Buffer,
        default: fs.readFileSync("public/images/profile.jpg"),
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//Ajouter les posts de l'utilisateur (un array => meme systeme)

module.exports = mongoose.model('User', UserSchema);