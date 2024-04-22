require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT;

app.get('/accueil', (req, res) => {
    // Define the data to be passed to the HTML file
    const data = {
      email: 'contact@example.com'
    };
  
    // Define the path to the HTML file
    const filePath = path.join(__dirname, 'public/html', 'accueil.html');
  
    // Read the HTML file and replace placeholders with data
    res.sendFile(filePath, { 
      // Specify the root object to replace placeholders
      root: '.', 
      // Set custom headers to specify content type
      headers: {
        'Content-Type': 'text/html'
      }
    });
  });


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})