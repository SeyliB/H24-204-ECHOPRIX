const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');

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
            title: "Cadenas de Taha",
            description: "Son cadenas s<est fait casser car il aoublier son mot de pass",
            adresse: "Rue HJ",
            price: 10,
            image: fs.readFileSync('public/images/LOCK.png'),
            vues: 0
        }
    ])
}

// insertUserData();
// insertPostData();

module.exports = router;