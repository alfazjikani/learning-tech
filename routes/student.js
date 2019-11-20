var express = require('express');
var loginController = require('../controllers/loginController');
var studentController = require('../controllers/studentController');

var router = express.Router();

// Default Student Root Path
router.get('/', loginController.validateRequest, function(req, res, next) {
    res.redirect('/student/list');
});

// Get Student Form
router.get('/add', loginController.validateRequest, studentController.getStudentForm);

// Save Student Form
router.post('/save', loginController.validateRequest, studentController.saveStudentForm);

// Student List
router.get('/list', loginController.validateRequest, studentController.getStudentList);

// View Student
router.get('/view/:id', loginController.validateRequest, studentController.viewStudent);

// Edit Student
router.get('/edit/:id', loginController.validateRequest, studentController.editStudent);

// Delete Student
router.get('/delete/:id', loginController.validateRequest, studentController.deleteStudent)

module.exports = router;