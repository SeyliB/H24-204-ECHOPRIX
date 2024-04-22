require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');

// Set 'public' directory as the static directory
app.use(express.static(path.join(__dirname, 'public')));


// Set 'views' directory for EJS templates
app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');
        

app.get('/', (req, res) => {
    // Sample data to pass to the EJS template
    const data = {
        title: 'ECHOPRIX'
    };

    // Render the 'index.ejs' template with the provided data
    res.render('accueil', data);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})