require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');

// Set 'public' directory as the static directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'Images')));

// Set 'views' directory for EJS templates
app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');
        

app.get('/', (req, res) => {
    res.render('accueil');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})