var express = require('express');
var studentController = require('../controllers/studentController');

var router = express.Router();

// Get Student Form
router.get('/add', studentController.getStudentForm);

// Save Student Form
router.post('/add', studentController.saveStudentForm);

// Student List
router.get('/list', studentController.getStudentList);

module.exports = router;