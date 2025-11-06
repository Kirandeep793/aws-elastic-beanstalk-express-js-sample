const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// explicitly send index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
