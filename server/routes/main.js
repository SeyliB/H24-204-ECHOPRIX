const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const { spawn } = require('child_process');
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;




router.get('/', async (req, res) => {
    const data = {
        title: 'ECHOPRIX',
    };

    res.render('accueil', data);
});

router.get('/publications', async (req, res) =>{
    try {
        var page = req.session.test || 1;
        req.session.test = page+1
        const limit = 5;
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
        email: req.session.user._id
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

router.post('/signup', async (req, res) =>{
    const {firstName, lastName, adresse, email, password, image} = req.body;
    
    const existingUser = await User.findOne({ email }); 


    if (existingUser) {
        console.log("CET EMAIL A DEJA ETE UTILISé POUR CREER UN COMPTE")
    }else{
        insertUserData(firstName, lastName, adresse, email, password, image);
    }

})

function getPostCategory(title,description,callback){
    const pythonScript = spawn('python', ['server/python_scripts/categotizer.py', title, description]);


    pythonScript.stdout.on('data', (data) => {
        //En faite ca lit le output dans la console de ce qui a ete ecris par le prog python
       const category = data.toString().trim();
        callback(category);
    });


}

function insertUserData (firstName, lastName, adresse, email, password, image){
    User.insertMany([
        {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            image: fs.readFileSync(image)
        }
    ])
}

async function insertPostData(title, description, adresse, price, image) {
    
        //Les callbacks c'est op quand on a besoin d'attendre qu'une tache s'execute
        const category = await new Promise((resolve, reject) => {
            getPostCategory(title, description, (category) => {
                resolve(category); 
            });
        });


        // Insert post data into the database
        const result = await Post.insertMany([
            {
                title: title,
                description: description,
                adresse: adresse,
                price: price,
                category: category, // Use the category obtained from the callback
                image: fs.readFileSync(image), // Use the read image data
                vues: 0
            }
        ]);

        console.log("Data successfully sent");

}

// insertUserData();
//insertPostData("Bureau de classe", "un eleve qui a changer d'ecole a oublier son bureau","2221 rue de Bdeb",600,'public/images/LOGO.png');

module.exports = router;