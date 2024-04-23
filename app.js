require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');
const bodyParser = require('body-parser');

const connectDB = require('./server/configuration/database');

//Connect to DataBase
connectDB();

// Set 'public' directory as the static directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Set 'views' directory for EJS templates
app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');
    
app.use('/', require('./server/routes/main'))


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})