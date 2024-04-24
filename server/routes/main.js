const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');


const regexEmail = '/^(?!.*[\/^%$#~()])[^@]*@[^@]+[.][^@]+$/';

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

        console.log(req.body);
    } catch (error) {
        
    }


    res.redirect('/recherche');
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