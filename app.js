const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Root route – send HTML directly
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Express App</title></head>
      <body style="font-family: Arial; text-align: center; margin-top: 100px;">
        <h1>My Student ID is 22094629. Welcome to Express!</h1>
        <p>Deployed successfully on AWS Elastic Beanstalk!</p>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(\`App running on port \${port}\`);
});
