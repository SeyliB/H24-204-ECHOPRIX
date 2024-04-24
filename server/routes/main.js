const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


router.get('/', (req, res) => {
    // Sample data to pass to the EJS template
    const data = {
        title: 'ECHOPRIX',
    };

    // Render the 'index.ejs' template with the provided data
    res.render('accueil', data);
});

router.get('/publications', async (req, res) =>{
    try {
        const data = await Post.find();
        res.render('publications', {data});
    } catch (error) {
        console.log(error);
    }
})

router.get('/connection', (req, res) =>{
    res.render('connection');
})

router.get('/recherche', (req, res) =>{
    res.render('recherche');
})

router.post('/login', async (req, res) =>{

    try {
        const {email, password} = req.body;

        if (regexEmail.test(email)){
            res.redirect('/publications');
            //c'est ici que je dois check si le compte existe dans le serv et si c'est le bon
            // je dois checker si le email est dans la base de donner (serach in database with)
            //si oui bah checker si mdp est bon
        }else{
            res.redirect('/connection');
        }

        console.log(req.body);
    } catch (error) {
        
    }


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
            title: "OnePiece Tome 109",
            description: "EggHead ",
            adresse: "Rue de OnePiece",
            price: 50,
            image: fs.readFileSync('public/images/LOGO.png'),
            vues: 0
        }
    ])
}

// insertUserData();
// insertPostData();

module.exports = router;