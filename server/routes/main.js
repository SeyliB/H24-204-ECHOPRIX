const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


router.get('/', (req, res) => {
    const data = {
        title: 'ECHOPRIX',
    };

    res.render('accueil', data);
});

router.get('/publications', async (req, res) =>{
    try {
        var page = req.session.test || 1;
        req.session.test = page+1
        const limit = 2;
        const skip = (page - 1) * limit;
        
        //La ca spawn 5 par 5

        const data = await Post.find().skip(skip).limit(limit);
        res.render('publications', {data});
    } catch (error) {
        console.log(error);
    }
})

router.get('/connection', (req, res) =>{
    res.render('connection');
})

router.get('/recherche', (req, res) =>{

    const data = {
        email: req.session.user.lastName
    }
    res.render('recherche', data);
})

router.post('/login', async (req, res) =>{

    try {
        //Recuperer les informations du form
        const {email, password} = req.body;

        //Check si email correspond aux contraintes
        if (regexEmail.test(email)){
        //Check si exist dans Mongo
        const existingUser = await User.findOne({ email }); 

        //conditions pour se connecter
        if (existingUser && existingUser.password.toLowerCase() === password.toLowerCase()) {
            req.session.email = req.body.email;
            req.session.user = existingUser;
            res.redirect('/'); 
        } else {
            res.redirect('/connection');
        }
        }else{
            res.redirect('/connection');

        }
    } catch (error) {
        console.log(error);
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