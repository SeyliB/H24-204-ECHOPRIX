const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route to handle API requests
app.get('/data', (req, res) => {
  // This is a dummy data example, you would typically fetch data from a database or external API
  const data = { message: 'Hello from the backend!' };
  res.json();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});