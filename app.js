const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle root request explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
