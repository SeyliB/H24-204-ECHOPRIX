const express = require('express');
const router = express.Router();
const User = require('../models/User');
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


router.get('/login', (req, res) =>{
    res.render('login');
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
            res.redirect('/test'); 
        } else {
            res.redirect('/login');
        }
        }else{
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }


})

module.exports = router;