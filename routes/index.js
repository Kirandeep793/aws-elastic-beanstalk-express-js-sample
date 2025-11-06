var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Student ID is 22094629. Welcome to Express' });
});

module.exports = router;
