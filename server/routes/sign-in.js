const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fs = require('fs');
router.get('/sign-in', async (req, res) =>{
    res.render('sign-in');
})

router.post('/sign-in', async (req, res) =>{
    const {firstName, lastName, adresse, email, password} = await req.body;
    
    const existingUser = await User.findOne({ email }); 

    const image = await req.session.iconProfile;
    if (existingUser) {
        const message = "CET EMAIL A DEJA ETE UTILISé POUR CREER UN COMPTE";
        console.log(message)
        res.render('sign-in')
    }else{
        insertUserData(firstName, lastName, adresse, email, password, image);
        createUserSession(req, firstName, lastName, adresse, email, password, image)
    }

    res.redirect('test');

})

function insertUserData (firstName, lastName, adresse, email, password, image){
    User.insertMany([
        {
            firstName: firstName,
            lastName: lastName,
            adresse: adresse,
            email: email,
            password: password,
            image: image
        }
    ])
}
function createUserSession(req, firstName, lastName, adresse, email, password, image){
    
    var userData = {
        firstName: firstName,
        lastName:  lastName,
        adresse: adresse,
        email: email,
        password: password,
        image: image || fs.readFileSync("public/images/profile.jpg")
    }

    console.log(userData.image)
    req.session.user = userData
}

module.exports = router;