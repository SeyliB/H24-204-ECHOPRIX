const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    // Sample data to pass to the EJS template
    const data = {
        title: 'ECHOPRIX',
    };

    // Render the 'index.ejs' template with the provided data
    res.render('accueil', data);
});

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

// insertUserData();

module.exports = router;