const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

router.get('/', (req, res) => {
    // Sample data to pass to the EJS template
    const data = {
        title: 'ECHOPRIX',
    };

    // Render the 'index.ejs' template with the provided data
    res.render('accueil', data);
});

router.get('/publications', (req, res) =>{
    res.render('publications');
})

router.get('/compte', (req, res) =>{
    res.render('compte');
})

router.get('/recherche', (req, res) =>{
    res.render('recherche');
})

function insertUserData (){
    User.insertMany([
        {
            firstName: "Belhaddad",
            lastName: "Ilyes",
            email: "ilyBel@echoprix.com",
            password: "Yelta"

        }
    ])
}

function insertPostData (){
    Post.insertMany([
        {
            title: "BMW",
            description: "Nouvelle 20000km",
            adresse: "Rue BdeB",
            price: 215000,
            image: "images/LOGO.png",
            vues: 0
        }
    ])
}

// insertUserData();
insertPostData();

module.exports = router;