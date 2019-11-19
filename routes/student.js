var express = require('express');
var studentController = require('../controllers/studentController');

var router = express.Router();

// Default Student Root Path
router.get('/', function(req, res, next) {
    res.redirect('/student/list');
});

// Get Student Form
router.get('/add', studentController.getStudentForm);

// Save Student Form
router.post('/save', studentController.saveStudentForm);

// Student List
router.get('/list', studentController.getStudentList);

// Edit Student
router.get('/edit/:id', studentController.editStudent);

// Delete Student
router.get('/delete/:id', studentController.deleteStudent)

module.exports = router;