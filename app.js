const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
