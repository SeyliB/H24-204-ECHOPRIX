const express = require('express');
const router = express.Router();
const User = require('../models/User');
const fs = require('fs');
const session = require('express-session');
const { Binary } = require('mongodb');

router.get('/sign-in', async (req, res) =>{
    res.render('sign-in');
})

router.post('/sign-in', async (req, res) =>{
    const {firstName, lastName, email, password} = await req.body;
    
    const existingUser = await User.findOne({ email }); 

    const image = await req.session.iconProfile;
    if (existingUser) {
        const message = "CET EMAIL A DEJA ETE UTILISé POUR CREER UN COMPTE";
        console.log(message)
        res.render('sign-in')
    }else{
        insertUserData(firstName, lastName, email, password, image);

        // console.log(image)
        
        createUserSession(req, firstName, lastName, email, password, convertSessionImageToBuffered(req, req.session.iconProfile))
        req.session.connected = true;
        res.redirect('publications');
    }



})

function insertUserData (firstName, lastName, email, password, image){
    User.insertMany([
        {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            image: image
        }
    ])
}
function createUserSession(req, firstName, lastName,email, password, image){
    
    var userData = {
        firstName: firstName,
        lastName:  lastName,
        email: email,
        password: password,
        image: image || fs.readFileSync("public/images/profile.jpg")
    }

    // console.log(userData.image)
    req.session.user = userData
}

function convertSessionImageToBuffered(req, image){
    const buffer = Buffer.from(image, 'base64');
    // Create a Binary object using the Binary constructor with new
    const binaryData = new Binary(buffer, Binary.SUBTYPE_BYTE_ARRAY);

    return binaryData;
}
module.exports = router;