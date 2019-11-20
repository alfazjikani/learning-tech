var express = require('express');

var loginController = require('../controllers/loginController');

var router = express.Router();

/* GET home page. */
router.get('/', loginController.validateRequest, function(req, res, next) {
  res.redirect('/student/list');
});

// Login Form
router.get('/login', loginController.getLoginForm);

// Submit Login Form
router.post('/login', loginController.login);

module.exports = router;
